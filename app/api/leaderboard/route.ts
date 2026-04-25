import { NextResponse } from 'next/server'
import { list, get, createBlobClient } from '@vercel/blob'

export async function GET() {
  try {
    const blob = createBlobClient({ url: process.env.VERCEL_BLOB_URL })
    const { blobs } = await blob.list({
      prefix: 'entries/',
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    console.info(`request: ${await request.json()}, token: ${process.env.BLOB_READ_WRITE_TOKEN}`)
    const entries = await Promise.all(
      blobs.map(async (blobby) => {
        const response = await blob.get(blobby.url, {access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN})
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