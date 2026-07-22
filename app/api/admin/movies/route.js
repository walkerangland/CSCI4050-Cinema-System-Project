import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const data = await req.json()
    
    // Map the status string to match the Prisma MovieStatus enum
    const statusEnum = data.status === 'coming-soon' ? 'COMING_SOON' : 'CURRENTLY_RUNNING'

    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        genre: data.genre,
        rating: data.rating,
        description: data.description,
        posterUrl: data.posterUrl,
        trailerUrl: data.trailerUrl,
        status: statusEnum,
        director: data.director,
        producer: data.producer,
        cast: data.cast
      }
    })

    return NextResponse.json({ message: 'Movie added successfully', movie },
        { status: 201 })
  } catch (error) {
    console.error('Add movie error:', error)
    return NextResponse.json({ message: 'Server error' },
        { status: 500 })
  }
}