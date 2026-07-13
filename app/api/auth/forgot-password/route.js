import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(req) {
const { email } = await req.json()

if (!email) {
return NextResponse.json({ message: 'Email is required.' }, { status: 400})
}

const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
return NextResponse.json({ message: 'If that email exists, a reset link was sent.' }, { status: 200 })
}

const token = crypto.randomBytes(32).toString('hex')
const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt }
  })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

 const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${user.firstName},</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}" style="background:#c0392b;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })

  return NextResponse.json({ message: 'Reset link sent.' }, { status: 200 })


}