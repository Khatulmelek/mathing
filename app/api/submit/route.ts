import { NextRequest, NextResponse } from 'next/server'
import { addLeaderboardEntry } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { playerName, score, totalQuestions, totalTimeMs } = body
    
    if (!playerName || typeof score !== 'number' || typeof totalQuestions !== 'number' || typeof totalTimeMs !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    
    const id = addLeaderboardEntry(playerName, score, totalQuestions, totalTimeMs)
    
    return NextResponse.json({ success: true, id: Number(id) })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}
