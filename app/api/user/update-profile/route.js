import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// EditUserData + ProfileChangeConfirmation
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

    const { firstName, lastName, phoneNumber, street, city, state, aptNumber, username } = await req.json()

    // Get current user for comparison
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      )
    }

    // Check if username already exists (if being changed)
    if (username && username !== currentUser.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      })
      if (existingUsername) {
        return NextResponse.json(
          { message: 'Username already taken.' },
          { status: 409 }
        )
      }
    }

    // Update user profile data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(aptNumber && { aptNumber }),
        ...(username && { username })
      }
    })

    // Send profile change confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
      to: currentUser.email,
      subject: 'Profile Updated - Cinema Booking',
      html: `
        <h2>Profile Change Confirmation</h2>
        <p>Hi ${updatedUser.firstName},</p>
        <p>Your profile has been successfully updated.</p>
        <h3>Updated Information:</h3>
        <ul>
          ${firstName ? `<li>First Name: ${firstName}</li>` : ''}
          ${lastName ? `<li>Last Name: ${lastName}</li>` : ''}
          ${phoneNumber ? `<li>Phone: ${phoneNumber}</li>` : ''}
          ${street ? `<li>Street: ${street}</li>` : ''}
          ${city ? `<li>City: ${city}</li>` : ''}
          ${state ? `<li>State: ${state}</li>` : ''}
          ${username ? `<li>Username: ${username}</li>` : ''}
        </ul>
        <p>If you didn't make these changes, please contact support immediately.</p>
      `,
    })

    return NextResponse.json(
      { message: 'Profile updated successfully. Confirmation email sent.', user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { message: 'Invalid token or server error.' },
      { status: 401 }
    )
  }
}
