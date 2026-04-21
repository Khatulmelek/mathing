import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const leaderboard = getLeaderboard(10)
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
