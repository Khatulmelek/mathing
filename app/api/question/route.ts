import { NextResponse } from 'next/server'
import { generateQuestion } from '@/lib/questions'

export async function GET() {
  const question = generateQuestion()
  
  return NextResponse.json({
    id: question.id,
    expression: question.expression,
    answer: question.answer
  })
}
