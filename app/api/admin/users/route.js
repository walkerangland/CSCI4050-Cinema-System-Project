import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true
}

function normalizeRole(role) {
  return role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
}

function normalizeStatus(status) {
  if (status === 'SUSPENDED') return 'SUSPENDED'
  if (status === 'INACTIVE') return 'INACTIVE'
  return 'ACTIVE'
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ message: 'Failed to fetch users.' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { email, password, firstName, lastName, phoneNumber, role, status } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: 'Email, password, first name, and last name are required.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
        role: normalizeRole(role),
        status: normalizeStatus(status)
      },
      select: userSelect
    })

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Admin users POST error:', error)
    return NextResponse.json({ message: 'Unable to create user.' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, email, password, firstName, lastName, phoneNumber, role, status } = await req.json()

    if (!id) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 })
    }

    const userId = Number(id)
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    if (email) {
      const duplicateUser = await prisma.user.findUnique({ where: { email } })
      if (duplicateUser && duplicateUser.id !== userId) {
        return NextResponse.json({ message: 'Email already registered.' }, { status: 409 })
      }
    }

    const updatePayload = {}
    if (firstName !== undefined) updatePayload.firstName = firstName
    if (lastName !== undefined) updatePayload.lastName = lastName
    if (phoneNumber !== undefined) updatePayload.phoneNumber = phoneNumber || null
    if (email !== undefined) updatePayload.email = email
    if (role !== undefined) updatePayload.role = normalizeRole(role)
    if (status !== undefined) updatePayload.status = normalizeStatus(status)
    if (password) updatePayload.passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
      select: userSelect
    })

    return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 })
  } catch (error) {
    console.error('Admin users PUT error:', error)
    return NextResponse.json({ message: 'Unable to update user.' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 })
    }

    const userId = Number(id)
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    const bookingCount = await prisma.booking.count({ where: { userId } })
    if (bookingCount > 0) {
      return NextResponse.json({ message: 'User has bookings and cannot be deleted. Suspend instead.' }, { status: 409 })
    }

    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Admin users DELETE error:', error)
    return NextResponse.json({ message: 'Unable to delete user.' }, { status: 500 })
  }
}
