import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const ticketPrices = await prisma.ticketPrice.findMany()
    const fees = await prisma.fee.findMany()
    return NextResponse.json({ ticketPrices, fees },
        { status: 200 })
  } catch (error) {
    console.error('Pricing GET error:', error)
    return NextResponse.json({ message: 'Failed to fetch pricing.' },
        { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { tickets, bookingFee } = await req.json()

    if (tickets && tickets.length > 0) {
      for (const ticket of tickets) {
        await prisma.ticketPrice.upsert({
          where: { category: ticket.category },
          update: { price: ticket.price },
          create: { category: ticket.category, price: ticket.price }
        })
      }
    }

    if (bookingFee !== undefined) {
      await prisma.fee.upsert({
        where: { name: 'Online Booking Fee' },
        update: { amount: bookingFee },
        create: { name: 'Online Booking Fee', amount: bookingFee }
      })
    }

    return NextResponse.json({ message: 'Pricing and fees updated successfully' },
        { status: 200 })
  } catch (error) {
    console.error('Pricing PUT error:', error)
    return NextResponse.json({ message: 'Unable to update pricing.' },
        { status: 500 })
  }
}