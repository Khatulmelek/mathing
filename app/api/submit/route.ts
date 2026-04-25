import { NextResponse, NextRequest } from 'next/server'
import {put, list, get} from '@vercel/blob'

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
  await put(`entries/${entry.id}.json`, JSON.stringify(entry), {
    access: 'public',
    token: process.env.LEADER_READ_WRITE_TOKEN
  })

  const { blobs } = await list({
      prefix: 'entries/',
      access: 'public'
    })
    
  const entries = await Promise.all(
      blobs.map(async (blobby) => {
        const response = await get(blobby.url, {access: 'public'})
        return response
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
  return NextResponse.json({ success: true, id: entry.id, pos: dbretr.indexOf(entry) }, {status: 200})
  } catch (error) {
    console.error(`Submission error: ${error}`)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
