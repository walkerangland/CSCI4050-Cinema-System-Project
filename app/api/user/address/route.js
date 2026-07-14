import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user's address
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
        street: true,
        city: true,
        state: true,
        aptNumber: true
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
    console.error('Address fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Update user's address
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
    const { street, city, state, aptNumber } = await req.json()

    // Validation
    if (!street || !city || !state) {
      return NextResponse.json(
        { message: 'Street, city, and state are required.' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    // Update address
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        street,
        city,
        state,
        ...(aptNumber && { aptNumber })
      },
      select: {
        street: true,
        city: true,
        state: true,
        aptNumber: true
      }
    })

    return NextResponse.json(
      { message: 'Address updated successfully.', address: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Address update error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
