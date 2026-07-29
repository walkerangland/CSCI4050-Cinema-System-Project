import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const halls = await prisma.hall.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ halls }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch halls.' }, { status: 500 })
  }
}