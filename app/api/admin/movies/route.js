import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Parse the request body sent by the frontend
    const data = await req.json()
    // Convert the status from frontend to Prisma enum
    const statusEnum = data.status === 'COMING_SOON' ? 'COMING_SOON' : 'CURRENTLY_RUNNING'

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
    // returns success message and the created movie object
    return NextResponse.json({ message: 'Movie added successfully', movie }, { status: 201 })
  } catch (error) {
    console.error('Add movie error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
// Prisma findMany with showtimes included, ordered by createdAt descending
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      // get all movies with their associated showtimes
      include: {
        showtimes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    // returns the list of movies with their showtimes
    return NextResponse.json({ movies }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch movies.' },
      { status: 500 }
    )
  }
}
// Update movie details based on the provided ID and data
export async function PUT(req) {
  try {
    const data = await req.json()
    //if no id is provided in the request body, return a 400 error
    if (!data.id) {
      return NextResponse.json({ message: 'Movie ID is required.' },
        { status: 400 })
    }
    // Convert the provided ID for Prisma 
    const movieId = Number(data.id)
    const updatePayload = {}
    // adds fields that needs to be updated
    if (data.title !== undefined) updatePayload.title = data.title
    if (data.genre !== undefined) updatePayload.genre = data.genre
    if (data.rating !== undefined) updatePayload.rating = data.rating
    if (data.description !== undefined) updatePayload.description = data.description
    if (data.posterUrl !== undefined) updatePayload.posterUrl = data.posterUrl
    if (data.trailerUrl !== undefined) updatePayload.trailerUrl = data.trailerUrl
    if (data.director !== undefined) updatePayload.director = data.director
    if (data.producer !== undefined) updatePayload.producer = data.producer
    if (data.cast !== undefined) updatePayload.cast = data.cast
    // Convert the status from frontend to backend enum if provided
    if (data.status !== undefined) {
        updatePayload.status = data.status === 'COMING_SOON' ? 'COMING_SOON' : 'CURRENTLY_RUNNING'
    }
    // Update the movie record in the database
    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: updatePayload
    })

    return NextResponse.json({ message: 'Movie updated successfully', movie },
      { status: 200 })
  } catch (error) {
    console.error('Update movie error:', error)
    return NextResponse.json({ message: 'Unable to update movie.' },
      { status: 500 })
  }
}
// Delete a movie based on the provided ID
export async function DELETE(req) {
  try {
    const { id } = await req.json()
    //if no id is provided in the request body, return a 400 error
    if (!id) {
      return NextResponse.json({ message: 'Movie ID is required.' }, { status: 400 })
    }
    // Convert the provided ID for Prisma
    const movieId = Number(id)
    // Delete the movie record from the database
    await prisma.movie.delete({
      where: { id: movieId }
    })

    return NextResponse.json({ message: 'Movie deleted successfully' },
      { status: 200 })
  } catch (error) {
    console.error('Delete movie error:', error)
    return NextResponse.json({ message: 'Unable to delete movie.' },
      { status: 500 })
  }
}