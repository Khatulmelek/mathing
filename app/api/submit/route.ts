import { NextResponse, NextRequest } from 'next/server'
import { put, list, get } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const { playerName, totalTimeMs, totalQuestions } = await request.json()
  
  // Save to Vercel Blob
  const entry = {
    id: Date.now(),
    playerName,
    totalTimeMs,
    totalQuestions,
    completedAt: new Date().toISOString()
  }
  console.log(`request: ${await request.json()}, token: ${process.env.LEADER_READ_WRITE_TOKEN}`)
  await put(`entries/${entry.id}.json`, JSON.stringify(entry), {
    access: 'private',
    token: process.env.LEADER_READ_WRITE_TOKEN
  })

  const { blobs } = await list({
      prefix: 'entries/',
      access: 'private',
      token: process.env.LEADER_READ_WRITE_TOKEN
    })
    
  const entries = await Promise.all(
      blobs.map(async (blob) => {
        const response = await get(blob.url, {access: 'private', token: process.env.LEADER_READ_WRITE_TOKEN})
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
  } catch (error) {
    console.error(`Submission error: ${error}`)
  }
}
