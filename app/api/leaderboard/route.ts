import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'entries/',
    })
    
    const entries = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url)
        return response.json()
      })
    )
    
    // Sort by total time (fastest first)
    return NextResponse.json(
      entries
        .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
        .slice(0, 10)
    )
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}