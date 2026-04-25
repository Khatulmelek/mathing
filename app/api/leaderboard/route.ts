import { NextResponse, NextRequest } from 'next/server'
import {list, get} from '@vercel/blob'
import { text } from 'node:stream/consumers';

export async function GET(request: NextRequest) {
  try {
    // url: process.env.VERCEL_BLOB_URL
    // const { blobs } = await list({
    //   prefix: `${process.env.VERCEL_BLOB_URL}/entries/`,
    //   access: 'private'
    // })
    // const entries = await Promise.all(
    //   blobs.map(async (blobby) => {
    //     const response = await get(blobby.url, {access: 'private'})
    //     return response.json()
    //   })
    // )
    let data = await get('entries.json', {access: 'private'})
    if (data.statusCode == 200) let entries = JSON.parse(await text(data.stream))
    else throw new Error("Resource does not exist");
    

    console.info(entries)
    
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