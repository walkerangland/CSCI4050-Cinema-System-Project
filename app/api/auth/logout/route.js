import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    //telling browser to delete cookie
    cookieStore.delete('auth_token')

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}