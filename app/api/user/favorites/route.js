import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user's favorite movies
export async function GET(req) {
  try {
    const token = cookies().get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteMovies: true }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json(user.favoriteMovies, { status: 200 })
  } catch (error) {
    console.error('Favorite movies fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Add movie to favorites
export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    const { movieId } = await req.json()

    if (!movieId) {
      return NextResponse.json(
        { message: 'Movie ID is required.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteMovies: true }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    // Check if movie is already in favorites
    if (user.favoriteMovies.includes(movieId)) {
      return NextResponse.json(
        { message: 'Movie already in favorites.' },
        { status: 409 }
      )
    }

    // Add movie to favorites
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteMovies: {
          push: movieId
        }
      }
    })

    return NextResponse.json(
      { message: 'Movie added to favorites.', favorites: updatedUser.favoriteMovies },
      { status: 200 }
    )
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Remove movie from favorites
export async function DELETE(req) {
  try {
    const token = cookies().get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    const { movieId } = await req.json()

    if (!movieId) {
      return NextResponse.json(
        { message: 'Movie ID is required.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteMovies: true }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    // Remove movie from favorites
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteMovies: {
          set: user.favoriteMovies.filter(id => id !== movieId)
        }
      }
    })

    return NextResponse.json(
      { message: 'Movie removed from favorites.', favorites: updatedUser.favoriteMovies },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
