import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET favorite movies
export async function GET(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET)
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { favorites: true } 
    })

    if (!user) return NextResponse.json({ message: 'User not found.' }, { status: 404 })

    const movieIds = user.favorites.map(fav => String(fav.movieId))
    
    return NextResponse.json(movieIds, { status: 200 })
  } catch (error) {
    console.error('Favorites GET error:', error)
    return NextResponse.json({ message: 'Server error.' }, { status: 500 }) // Fixed from 401
  }
}

// POST (Add) favorite movie
export async function POST(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET)
    const { movieId } = await req.json()
    if (!movieId) return NextResponse.json({ message: 'Movie ID required' }, { status: 400 })

    // Safely convert ID to a Number if your DB expects Integers
    const parsedMovieId = isNaN(Number(movieId)) ? movieId : Number(movieId)

    // Check if it already exists to prevent DB crashes!
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { favorites: true }
    })

    if (user?.favorites.some(fav => String(fav.movieId) === String(movieId))) {
      return NextResponse.json({ message: 'Already in favorites' }, { status: 200 })
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        favorites: {
          create: { movieId: parsedMovieId }
        }
      }
    })

    return NextResponse.json({ message: 'Added to favorites' }, { status: 200 })
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json({ message: 'Server error.' }, { status: 500 }) // Fixed from 401
  }
}

// DELETE (Remove) favorite movie
export async function DELETE(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET)
    const { movieId } = await req.json()
    if (!movieId) return NextResponse.json({ message: 'Movie ID required' }, { status: 400 })

    // Safely convert ID to a Number if your DB expects Integers
    const parsedMovieId = isNaN(Number(movieId)) ? movieId : Number(movieId)

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        favorites: {
          deleteMany: { movieId: parsedMovieId }
        }
      }
    })

    return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 })
  } catch (error) {
    console.error('Favorites DELETE error:', error)
    return NextResponse.json({ message: 'Server error.' }, { status: 500 }) // Fixed from 401
  }
}