import { NextRequest, NextResponse } from 'next/server'
import { getEntryById } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entry = getEntryById(parseInt(id))
    
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }
    
    return NextResponse.json(entry)
  } catch (error) {
    console.error('Certificate error:', error)
    return NextResponse.json({ error: 'Failed to fetch certificate data' }, { status: 500 })
  }
}
