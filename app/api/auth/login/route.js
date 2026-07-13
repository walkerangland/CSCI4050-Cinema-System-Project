import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req) {
const {email, password} = await req.json()

if (!email || !password) {
return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 })
}

const user = await prisma.user.findUnique({ where: {email} })

if (!user) {
return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })
}

if (user.status == 'INACTIVE') {
 return NextResponse.json(
      { message: 'Account is not verified. Please check your email to verify your account.' },
      { status: 403 }
    )
}

if (user.status == 'SUSPENDED') {
return NextResponse.json({ message: 'Your account has been suspended. Please contact support.' }, { status: 403 })
}

const passwordMatch = await bcrypt.compare(password, user.passwordHash)
if(!passwordMatch) {
 return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 })
  }

  const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
  )

cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 })

}