import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json(
      { message: 'Verification token is required.' },
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token.' },
        { status: 400 }
      )
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        verificationToken: null,
        verificationTokenExpires: null
      }
    })

    return NextResponse.json(
      { message: 'Email verified successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'An error occurred during verification.' },
      { status: 500 }
    )
  }
}
