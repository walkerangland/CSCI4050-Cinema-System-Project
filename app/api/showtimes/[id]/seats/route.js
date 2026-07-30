import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const request = await params;
    const showtimeId = request.id

    if (!showtimeId || isNaN(parseInt(showtimeId))) {
      return NextResponse.json(
        { message: 'Valid Showtime ID is required.' },
        { status: 400 }
      )
    }

    //tickets tied to successful or pending bookings for this showtime
    const tickets = await prisma.ticket.findMany({
      where: {
        booking: {
          showtimeId: parseInt(showtimeId),
          status: {
            not: 'CANCELLED'
          }
        }
      },
      include: {
        seat: true
      }
    });

    //format data to match frontend array structure
    const takenSeats = tickets.map(ticket => `${ticket.seat.row}${ticket.seat.number}`);

    return NextResponse.json({ takenSeats }, { status: 200 })

  } catch (error) {
    console.error('Fetch booked seats error:', error)
    return NextResponse.json(
      { message: 'Server error while fetching seats.' },
      { status: 500 }
    )
  }
}