import { NextResponse, NextRequest } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  const { playerName, totalTimeMs, totalQuestions } = await request.json()
  
  // Save to Vercel Blob
  const entry = {
    id: Date.now(),
    playerName,
    totalTimeMs,
    totalQuestions,
    completedAt: new Date().toISOString()
  }
  
  await put(`entries/${entry.id}.json`, JSON.stringify(entry), {
    access: 'private'
  })

  const { blobs } = await list({
      prefix: 'entries/',
      access: 'private'
    })
    
  const entries = await Promise.all(
      blobs.map(async (blob) => {
        const response = await get(blob.url, {access: 'private'})
        return response.json()
      })
    )
    
    // Sort by total time (fastest first)
    
    let dbretr = entries
        .sort((a, b) => a.totalTimeMs - b.totalTimeMs)

  // return NextResponse.json(
  //      entries
  //        .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
  //        .slice(0, 10)
  //    )
  return NextResponse.json({ success: true, id: entry.id, pos: dbretr.indexOf(entry) })
}
