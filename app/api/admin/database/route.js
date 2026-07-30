import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      users,
      addresses,
      paymentCards,
      movies,
      favoriteMovies,
      halls,
      seats,
      showtimes,
      ticketPrices,
      bookings,
      tickets,
      promotions,
      fees
    ] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          promotionOptIn: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { id: 'asc' }
      }),
      prisma.address.findMany({ orderBy: { id: 'asc' } }),
      prisma.paymentCard.findMany({
        select: {
          id: true,
          userId: true,
          cardholderName: true,
          expirationMonth: true,
          expirationYear: true,
          billingZip: true,
          createdAt: true
        },
        orderBy: { id: 'asc' }
      }),
      prisma.movie.findMany({ orderBy: { id: 'asc' } }),
      prisma.favoriteMovie.findMany({ orderBy: { id: 'asc' } }),
      prisma.hall.findMany({ orderBy: { id: 'asc' } }),
      prisma.seat.findMany({ orderBy: { id: 'asc' } }),
      prisma.showtime.findMany({ orderBy: { id: 'asc' } }),
      prisma.ticketPrice.findMany({ orderBy: { id: 'asc' } }),
      prisma.booking.findMany({ orderBy: { id: 'asc' } }),
      prisma.ticket.findMany({ orderBy: { id: 'asc' } }),
      prisma.promotion.findMany({ orderBy: { id: 'asc' } }),
      prisma.fee.findMany({ orderBy: { id: 'asc' } })
    ])

    return NextResponse.json({
      users,
      addresses,
      paymentCards,
      movies,
      favoriteMovies,
      halls,
      seats,
      showtimes,
      ticketPrices,
      bookings,
      tickets,
      promotions,
      fees
    }, { status: 200 })
  } catch (error) {
    console.error('Admin database GET error:', error)
    return NextResponse.json({ message: 'Failed to fetch database.' }, { status: 500 })
  }
}
