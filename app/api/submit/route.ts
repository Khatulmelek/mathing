import { NextResponse, NextRequest } from 'next/server'
import {put, list, get} from '@vercel/blob'
import { text } from 'node:stream/consumers';

// function text(str, encoding = 'utf8') {
//   return new Promise<string>((resolve, reject) => {
//     const chunks: string[] = [];
//     if (encoding) str.setEncoding(encoding);
//     str.on('data', (chunk: string) => chunks.push(chunk));
//     str.on('end', () => resolve(chunks.join('')));
//     str.on('error', reject);
//   });
// }

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
  // await put(`entries/${entry.id}.json`, JSON.stringify(entry), {
  //   access: 'private'
  // })

  let data = await get('entries.json', {access: 'private'})

  if (data == undefined)
  {
    let entries = [entry]
    await put('entries.json', JSON.stringify(entries), {access: 'private', allowOverwrite: true})
    return NextResponse.json({ success: true, id: entry.id, pos: entries.indexOf(entry)+1, time: entry.totalTimeMs  }, {status: 200})
  }
  else {
    let entries = JSON.parse(await text(data.stream))
    entries.push(entry)
    console.info(entries)
    entries?.sort((a, b) => a?.totalTimeMs - b?.totalTimeMs)
    await put('entries.json', JSON.stringify(entries), {access: 'private', allowOverwrite: true})
    return NextResponse.json({ success: true, id: entry.id, pos: entries.indexOf(entry)+1, time: entry.totalTimeMs }, {status: 200})
  }

  

  // const { blobs } = await list({
  //     prefix: 'entries/',
  //     access: 'private'
  //   })
    
  // const entries = await Promise.all(
  //     blobs.map(async (blobby) => {
  //       const response = await get(blobby.url, {access: 'private'})
  //       return response
  //     })
  //   )
    
  //   // Sort by total time (fastest first)
    
  //   let dbretr = entries
  //       .sort((a, b) => a.totalTimeMs - b.totalTimeMs)

  // // return NextResponse.json(
  // //      entries
  // //        .sort((a, b) => a.totalTimeMs - b.totalTimeMs)
  // //        .slice(0, 10)
  // //    )


  } catch (error) {
    console.error(`Submission error: ${error}`)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
