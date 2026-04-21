'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: string
  expression: string
  answer: number
}

const TOTAL_QUESTIONS = 10

export function Quiz() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [totalTimeMs, setTotalTimeMs] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchQuestion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/question')
      const question = await response.json()
      setCurrentQuestion(question)
      setQuestionStartTime(performance.now())
      setUserAnswer('')
    } catch (error) {
      console.error('Failed to fetch question:', error)
    } finally {
      setLoading(false)
    }
  }

  const startGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return
    setGameStarted(true)
    setQuestionNumber(1)
    setScore(0)
    setTotalTimeMs(0)
    fetchQuestion()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion || submitting) return

    const responseTime = performance.now() - questionStartTime
    const newTotalTime = totalTimeMs + responseTime

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer
    const newScore = isCorrect ? score + 1 : score

    if (questionNumber >= TOTAL_QUESTIONS) {
      // Game finished - submit score
      setSubmitting(true)
      
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName,
            score: newScore,
            totalQuestions: TOTAL_QUESTIONS,
            totalTimeMs: Math.round(newTotalTime)
          })
        })
        const result = await response.json()
        if (result.id) {
          router.push(`/certificate/${result.id}`)
        }
      } catch (error) {
        console.error('Failed to submit score:', error)
        setSubmitting(false)
      }
    } else {
      setScore(newScore)
      setTotalTimeMs(newTotalTime)
      setQuestionNumber(prev => prev + 1)
      fetchQuestion()
    }
  }

  useEffect(() => {
    if (gameStarted && currentQuestion && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStarted, currentQuestion])

  if (!gameStarted) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-center text-lg sm:text-xl">Math Quiz</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <form onSubmit={startGame} className="flex flex-col gap-3 sm:gap-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium mb-1.5 sm:mb-2">
                Enter your name to start
              </label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
                className="h-11 sm:h-10 text-base"
              />
            </div>
            <Button type="submit" className="w-full h-11 sm:h-10 text-base">
              Start Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </span>
          <span className="text-xs sm:text-sm font-medium">
            Score: {score}
          </span>
        </div>
        <Progress value={(questionNumber / TOTAL_QUESTIONS) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-muted-foreground">Loading question...</p>
          </div>
        ) : currentQuestion ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <div className="text-center py-3 sm:py-4">
              <p className="text-3xl sm:text-4xl font-mono font-bold">
                {currentQuestion.expression} = ?
              </p>
            </div>
            <div>
              <Input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                required
                className="text-center text-xl sm:text-2xl h-12 sm:h-14"
              />
            </div>
            <Button type="submit" size="lg" className="w-full h-12 sm:h-11 text-base" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  )
}
