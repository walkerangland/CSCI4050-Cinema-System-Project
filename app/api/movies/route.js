import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        showtimes: {
          include: { hall: true },
          orderBy: { startTime: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ movies }, { status: 200 })
  } catch (error) {
    console.error('Fetch movies error:', error)
    return NextResponse.json({ message: 'Failed to fetch movies.' }, { status: 500 })
  }
}