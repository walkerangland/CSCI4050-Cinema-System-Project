import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { fetchSegmentPrefetchesUsingDynamicRequest } from 'next/dist/client/components/segment-cache/cache'

  const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get specific booking information
export async function GET(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const bookings = await prisma.booking.findMany({
      where: { userId },
      select: {
        id: true,
        showtimeId: true,
        bookingNumber: true,
        status: true,
        totalPrice: true
      }
    })

    const ticketCounts = await prisma.ticket.groupBy({
      by: ['bookingId'],
      where: {
        bookingId: { in: bookings.map(b => b.id) },
      },
      _count: { _all: true },
    })

    const countsByBookingId = Object.fromEntries(
      ticketCounts.map(x => [x.bookingId, x._count._all])
    )

    const showtimes = await prisma.showtime.findMany({
      where:{ 
        id: { in: bookings.map(b => b.showtimeId) },
      },
      select: {
        id: true,
        movieId: true,
        hallId: true,
        startTime: true
      }
    })

    const showtimeById = new Map(showtimes.map(st => [st.id, st]));
    
    const responseBookings = bookings.map(book => {
      const st = showtimeById.get(book.showtimeId);
      return {
        id: book.id,
        showtimeId: book.showtimeId,
        bookingNumber: book.bookingNumber,
        status: book.status,
        totalprice: book.totalPrice,
        ticketCount: countsByBookingId[book.id] ?? 1,
        ...(st && {
          movieId: st.movieId,
          hallId: st.hallId,
          startTime: st.startTime,
    }),
      }
    })

    return NextResponse.json(responseBookings, { status: 200 })
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Add new booking
export async function POST(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    const { showtimeId, totalPrice, status, seatIds, quantities, ticketTypes, hallId, bookId } = await req.json()

    // For payment page, only changes the status and price
    if (status != null) {
      const booking = await prisma.booking.update({
        where: { id : parseInt(bookId) },
        data: {
          status: status,
          totalPrice: totalPrice 
        }
      })
      return NextResponse.json(
        { message: 'Payment confirmed!' },
        { status: 200 }
      )
    }

    // Validation
    if (!showtimeId || !totalPrice) {
      return NextResponse.json(
        { message: 'No showtimeId or totalPrice provided.' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    const showtimeIdInt = parseInt(showtimeId)
    const totalPriceDecimal = parseFloat(totalPrice)
    console.log('totalprice:' + totalPriceDecimal)

    const bookingNumber = String(Date.now())

    //Create new booking info
    const booking = await prisma.booking.upsert({
      where: { bookingNumber },
      update: {
        ...(showtimeIdInt && { showtimeId: showtimeIdInt }),
        ...(status && { status: status }),
        ...(totalPriceDecimal && { totalPrice: totalPriceDecimal }),
      },
      create: {
        bookingNumber: bookingNumber,
        userId: userId,
        showtimeId: showtimeIdInt,
        status: status ?? 'PENDING',
        totalPrice: totalPriceDecimal,
      },
    })


    const parseSeatCode = (code) => {
      // "A7" -> row="A", number=7
      const match = String(code).match(/^([A-Za-z]+)(\d+)$/)
      if (!match) throw new Error(`Invalid seat code: ${code}`)
      return { row: match[1].toUpperCase(), number: Number(match[2]) }
    };

    const qtyByType = quantities // { Adult: 2, Child: 0, Senior: 0 }

    const seatCodes = seatIds // ['A7', 'A8']

    const typeToEnum = {
      Adult: "ADULT",
      Child: "CHILD",
      Senior: "SENIOR",
    };

    const priceByType = Object.fromEntries(
      ticketTypes.map((t) => [typeToEnum[t.type], t.price])
    )

    const requestedCategories = [];
    for (const [type, count] of Object.entries(quantities)) {
      const enumValue = typeToEnum[type]; // "ADULT" etc.
      if (!enumValue) continue;

      for (let i = 0; i < count; i++) requestedCategories.push(enumValue);
    }

    if (requestedCategories.length !== seatCodes.length) {
      throw new Error(
        `Ticket count mismatch: got ${requestedCategories.length} from quantities but ${seatCodes.length} seatIds were selected.`
      );
    }

    const seats = await Promise.all(
      seatCodes.map(async (code) => {
        const { row, number } = parseSeatCode(code);
        // seat unique key = (hallId, row, number)
        const seat = await prisma.seat.upsert({
          where: {
            hallId_row_number: {
              hallId : parseInt(hallId),
              row,
              number,
            },
          },
          update: {

          },
          create: {
            hallId : parseInt(hallId), 
            row, 
            number
          },
          select: { id: true },
        })
        return seat.id
      })
    )

  const bookingId = booking.id;

await Promise.all(
  seats.map((seatId, index) => {
    const ticketCategory = requestedCategories[index];
    const price = priceByType[ticketCategory];

    return prisma.ticket.upsert({
      where: {
        bookingId_seatId: { bookingId, seatId },
      },
      update: {
        ticketCategory,
        price: new Prisma.Decimal(price),
        booking: { connect: { id: bookingId } },
        seat: { connect: { id: seatId } },
      },
      create: {  
        ticketCategory,
        price: new Prisma.Decimal(price),
        booking: { connect: { id: bookingId } },
        seat: { connect: { id: seatId } },
      },
    });
  })
);

    return NextResponse.json({ ok: true, bookingId }, { status: 201 })
  } catch (error) {
    console.error('Add/create booking:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Delete booking (to-do)
export async function DELETE(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    const { cardId } = await req.json()

    if (!cardId) {
      return NextResponse.json(
        { message: 'Card ID is required.' },
        { status: 400 }
      )
    }

    // Check if card belongs to user
    const creditCard = await prisma.PaymentCard.findUnique({
      where: { id: cardId }
    })

    if (!creditCard || creditCard.userId !== userId) {
      return NextResponse.json(
        { message: 'Credit card not found or unauthorized.' },
        { status: 404 }
      )
    }

    // Delete credit card
    await prisma.PaymentCard.delete({
      where: { id: cardId }
    })

    return NextResponse.json(
      { message: 'Credit card deleted successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete credit card error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
