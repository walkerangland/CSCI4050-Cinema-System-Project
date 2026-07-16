import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' },
        { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Both current and new passwords are required.' },
        { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: 'New password must be at least 8 characters long.' },
        { status: 400 })
    }

    //get user from db
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found.' },
        { status: 404 })
    }

    //verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Incorrect current password.' },
        { status: 401 })
    }

    //new password and save it
    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    })

    return NextResponse.json({ message: 'Password updated successfully.' },
      { status: 200 })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ message: 'Server error.' },
      { status: 500 })
  }
}