import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { encrypt } from '../../../../lib/encryption'

const prisma = new PrismaClient()

// SendConfirmationEmail + StoreUserData
export async function POST(req) {
  const {
    email,
    password,
    username,
    firstName,
    lastName,
    phone,
    street,
    city,
    state,
    aptNumber,
    creditCards,
    promotions
  } = await req.json()

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { message: 'Email, password, first name, and last name are required.' },
      { status: 400 }
    )
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json(
      { message: 'Email already registered.' },
      { status: 409 }
    )
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

    const addressData = (street && city && state) ? {
      create: {
        street: aptNumber ? `${street} Apt ${aptNumber}` : street,
        city,
        state,
        zipCode: '00000'
      }
    } : undefined

    const paymentCardsData = creditCards && creditCards.length > 0 ? {
      create: creditCards.map(card => {
        const [month, year] = card.expirationDate.split('/')
        return {
          cardholderName: card.cardholderName,
          encryptedNumber: encrypt(card.cardNumber),
          expirationMonth: parseInt(month, 10) || 1,
          expirationYear: parseInt(year, 10) || 2026,
        }
      })
    } : undefined

    // Store user data in database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phoneNumber: phone || null,
        promotionOptIn: promotions || false,
        status: 'INACTIVE', // Not verified yet
        role: 'CUSTOMER',
        address: addressData,
        paymentCards: paymentCardsData,
        verificationTokens: {
          create: {
            token: verificationToken,
            expiresAt: verificationTokenExpires
          }
        },
      }
    })

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`

    await transporter.sendMail({
      from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Cinema Booking',
      html: `
        <h2>Welcome to Cinema Booking!</h2>
        <p>Hi ${firstName},</p>
        <p>Please verify your email address to complete your registration.</p>
        <a href="${verificationLink}" style="background:#c0392b;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't create this account, ignore this email.</p>
      `,
    })

    return NextResponse.json(
      { message: 'Registration successful. Please check your email to verify your account.', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration.' },
      { status: 500 }
    )
  }
}
