import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user profile data including username, favorites, credit cards, address
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
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        aptNumber: true,
        favoriteMovies: true,
        creditCards: {
          select: {
            id: true,
            cardNumber: true,
            expirationDate: true,
            cardholderName: true
            // Don't return CVV for security
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
