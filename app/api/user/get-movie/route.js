import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Gets movie
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

    jwt.verify(token, JWT_SECRET)

    const movies = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        posterUrl: true,
        status: true
        }
      }
    )

    return NextResponse.json(movies, { status: 200 })
  } catch (error) {
    console.error('Movies fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}