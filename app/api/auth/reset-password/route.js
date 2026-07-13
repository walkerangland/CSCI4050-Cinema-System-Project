import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
const { token, password } = await req.json()

if (!token || !password) {
 return NextResponse.json({ message: 'Token and password are required.' }, { status: 400 })
}

const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

 if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ message: 'Reset link is invalid or has expired.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.update({
  where: { id: resetToken.userId },
  data: { passwordHash }

  })

  await prisma.passwordResetToken.update({
  where: { token },
  data: { used: true },
  })

return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 })

}