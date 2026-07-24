import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { encrypt, decrypt } from '../../../../lib/encryption'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user's saved credit cards
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

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const creditCards = await prisma.PaymentCard.findMany({
      where: { userId },
      select: {
        id: true,
        encryptedNumber: true,
        expirationMonth: true,
        expirationYear: true,
        cardholderName: true
        // Don't return CVV for security
      }
    })
    //decrypt credit cards
    const maskedCards = creditCards.map(card => {
      const decryptedNumber = decrypt(card.encryptedNumber)
      return {
        id: card.id,
        cardholderName: card.cardholderName,
        expirationMonth: card.expirationMonth,
        expirationYear: card.expirationYear,
        cardNumber: `**** **** **** ${decryptedNumber.slice(-4)}` //only sends the last 4 digits
      }
    })

    return NextResponse.json(maskedCards, { status: 200 })
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
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided.' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    const { cardNumber, expirationMonth, expirationYear, cardholderName } = await req.json()

    // Validation
    if (!cardNumber || !expirationMonth || !expirationYear || !cardholderName) {
      return NextResponse.json(
        { message: 'Card number, expiration date, and cardholder name are required.' },
        { status: 400 }
      )
    }
    //if (creditCards.length >= 3) {
    //  return NextResponse.json({ message: 'Maximum credit card limit reached.' }, { status: 403 })
    //}

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

    //create credit card
    const paymentCard = await prisma.paymentCard.create({
      data: {
        userId,
        encryptedNumber: encrypt(cardNumber),
        expirationMonth: parseInt(expirationMonth, 10) || 1,
        expirationYear: parseInt(expirationYear, 10) || 2026,
        cardholderName
      },
      select: {
        id: true,
        expirationMonth: true,
        expirationYear: true,
        cardholderName: true
      }
    })

    return NextResponse.json(
      { message: 'Credit card added successfully.', card: paymentCard },
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
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

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
    const creditCard = await prisma.PaymentCard.findUnique({
      where: { id: cardId }
    })

    if (!creditCard || creditCard.userId !== userId) {
      return NextResponse.json(
        { message: 'Credit card not found or unauthorized.' },
        { status: 404 }
      )
    }

    // Delete credit card
    await prisma.PaymentCard.delete({
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
