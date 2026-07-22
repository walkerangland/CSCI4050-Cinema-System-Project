import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { movieId, hallId, startTime } = await req.json()

    if (!movieId || !hallId || !startTime) {
      return NextResponse.json({ message: 'Movie, Hall, and Start Time are required.' },
        { status: 400 })
    }
    
    const showtime = await prisma.showtime.create({
      data: {
        movieId: parseInt(movieId),
        hallId: parseInt(hallId),
        startTime: new Date(startTime)
      }
    })

    return NextResponse.json({ message: 'Showtime scheduled successfully', showtime },
        { status: 201 })
  } catch (error) {
    //Prisma's error code for a unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Conflict: This hall is already booked for that time.' },
        { status: 409 })
    }
    console.error('Schedule showtime error:', error)
    return NextResponse.json({ message: 'Server error' },
        { status: 500 })
  }
}