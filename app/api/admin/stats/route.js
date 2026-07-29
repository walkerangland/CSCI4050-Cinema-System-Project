import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      totalBookings,
      confirmedSalesAggregate,
      pendingBookings,
      cancelledBookings,
      currentlyRunningMovies,
      registeredUsers,
      activeUsers
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalPrice: true }
      }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.movie.count({ where: { status: 'CURRENTLY_RUNNING' } }),
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } })
    ])

    const totalSales = confirmedSalesAggregate._sum.totalPrice
      ? Number(confirmedSalesAggregate._sum.totalPrice)
      : 0

    return NextResponse.json({
      totalBookings,
      totalSales,
      pendingBookings,
      cancelledBookings,
      currentlyRunningMovies,
      registeredUsers,
      activeUsers
    }, { status: 200 })
  } catch (error) {
    console.error('Admin stats GET error:', error)
    return NextResponse.json({ message: 'Unable to fetch statistics.' }, { status: 500 })
  }
}
