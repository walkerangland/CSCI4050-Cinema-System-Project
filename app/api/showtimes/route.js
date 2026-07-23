import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const movieId = searchParams.get('movieId')

    if (!movieId) {
      return NextResponse.json({ message: 'Movie ID is required.' },
        { status: 400 })
    }

    //gets showtimes for the given movie ID
    const showtimes = await prisma.showtime.findMany({
      where: {
        movieId: parseInt(movieId),
        startTime: {
          gte: new Date() 
        }
      },
      include: {
        hall: {
          select: {
            name: true,
            capacity: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(showtimes,
        { status: 200 })
  } catch (error) {
    console.error('Fetch showtimes error:', error)
    return NextResponse.json({ message: 'Server error' },
        { status: 500 })
  }
}