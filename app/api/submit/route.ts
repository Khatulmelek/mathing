import { NextResponse, NextRequest } from 'next/server'
import { put, list, get, createBlobClient } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
const blob = createBlobClient({ url: process.env.VERCEL_BLOB_URL })

    const { playerName, totalTimeMs, totalQuestions } = await request.json()
  
  // Save to Vercel Blob
  const entry = {
    id: Date.now(),
    playerName,
    totalTimeMs,
    totalQuestions,
    completedAt: new Date().toISOString()
  }
  console.info(`request: ${await request.json()}, token: ${process.env.BLOB_READ_WRITE_TOKEN}`)
  await blob.put(`entries/${entry.id}.json`, JSON.stringify(entry), {
    access: 'private',
    token: process.env.BLOB_READ_WRITE_TOKEN
  })

  const { blobs } = await blob.list({
      prefix: 'entries/',
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    
  const entries = await Promise.all(
      blobs.map(async (blobby) => {
        const response = await blob.get(blobby.url, {access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN})
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
