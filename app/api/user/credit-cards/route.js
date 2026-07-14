import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user's saved credit cards
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

    const creditCards = await prisma.creditCard.findMany({
      where: { userId },
      select: {
        id: true,
        cardNumber: true,
        expirationDate: true,
        cardholderName: true
        // Don't return CVV for security
      }
    })

    return NextResponse.json(creditCards, { status: 200 })
  } catch (error) {
    console.error('Credit cards fetch error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Add new credit card
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
    const { cardNumber, expirationDate, cvv, cardholderName } = await req.json()

    // Validation
    if (!cardNumber || !expirationDate || !cvv || !cardholderName) {
      return NextResponse.json(
        { message: 'Card number, expiration date, CVV, and cardholder name are required.' },
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

    // Create credit card
    const creditCard = await prisma.creditCard.create({
      data: {
        userId,
        cardNumber,
        expirationDate,
        cvv,
        cardholderName
      },
      select: {
        id: true,
        cardNumber: true,
        expirationDate: true,
        cardholderName: true
      }
    })

    return NextResponse.json(
      { message: 'Credit card added successfully.', creditCard },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add credit card error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}

// Delete credit card
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
    const { cardId } = await req.json()

    if (!cardId) {
      return NextResponse.json(
        { message: 'Card ID is required.' },
        { status: 400 }
      )
    }

    // Check if card belongs to user
    const creditCard = await prisma.creditCard.findUnique({
      where: { id: cardId }
    })

    if (!creditCard || creditCard.userId !== userId) {
      return NextResponse.json(
        { message: 'Credit card not found or unauthorized.' },
        { status: 404 }
      )
    }

    // Delete credit card
    await prisma.creditCard.delete({
      where: { id: cardId }
    })

    return NextResponse.json(
      { message: 'Credit card deleted successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete credit card error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
