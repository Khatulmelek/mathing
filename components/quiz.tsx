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

const TOTAL_QUESTIONS = 20

export function Quiz() {
  const router = useRouter()
  const [position, setPosition] = useState(-1)
  const [playerName, setPlayerName] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [totalTimeMs, setTotalTimeMs] = useState(0)
  const [currentElapsed, setCurrentElapsed] = useState(0)
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
    setTotalTimeMs(0)
    setIsWrong(false)
    fetchQuestion()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion || submitting) return

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer
    
    if (!isCorrect) {
      setIsWrong(true)
      setUserAnswer('')
      return
    }

    // Correct answer - record time and proceed
    setIsWrong(false)
    const responseTime = performance.now() - questionStartTime
    const newTotalTime = totalTimeMs + responseTime

    if (questionNumber >= TOTAL_QUESTIONS) {
      // Game finished - submit result
      setSubmitting(true)
      
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName,
            totalQuestions: TOTAL_QUESTIONS,
            totalTimeMs: Math.round(newTotalTime)
          })
        })
        const result = await response.json()
        if (result.id) {
          setGameEnded(true)
          setPosition(result.pos)
          return
        }
      } catch (error) {
        console.error('Failed to submit:', error)
        setSubmitting(false)
      }
    } else {
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

  // Live timer update
  useEffect(() => {
    if (!gameStarted || loading || !currentQuestion) {
      setCurrentElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentElapsed(performance.now() - questionStartTime)
    }, 50)

    return () => clearInterval(interval)
  }, [gameStarted, loading, currentQuestion, questionStartTime])

  if(questionNumber >= TOTAL_QUESTIONS)
  {
    return (
            <Card classname="w-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-center text-lg sm:text-xl">Quiz</CardTitle>
              </CardHeader>
              <CardContent  className="px-4 pb-4 sm:px-6 sm:pb-6">
                <h3 className="text-center mt-2">Ukończyłeś quiz!</h3>
                <p className="text-center mt-2 text-sm">Miejsce w rankingu: <b>{position}</b></p>
                <p className="text-center mt-2 text-sm">Czas ukończenia: <b>{((totalTimeMs) / 1000).toFixed(1)}s</b></p>
              </CardContent>
            </Card>
          )
  }

  if (!gameStarted) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-center text-lg sm:text-xl">Quiz</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <form onSubmit={startGame} className="flex flex-col gap-3 sm:gap-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium mb-1.5 sm:mb-2">
                Wpisz nazwę użytkownika
              </label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nazwa użytkownika"
                required
                autoFocus
                className="h-11 sm:h-10 text-base"
              />
            </div>
            <Button type="submit" className="w-full h-11 sm:h-10 text-base">
              Rozpocznij Quiz
            </Button>
            <p className="text-center mt-2 text-sm">Rozpoczynając ten quiz, akceptujesz Politykę Prywatności.</p>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex justify-center items-center mb-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Pytanie {questionNumber} z {TOTAL_QUESTIONS}
          </span>
        </div>
        <Progress value={(questionNumber / TOTAL_QUESTIONS) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-muted-foreground">Ładowanie pytania...</p>
          </div>
        ) : currentQuestion ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
              <span>Czas na to pytanie: <span className="font-mono font-medium text-foreground">{(currentElapsed / 1000).toFixed(1)}s</span></span>
              <span>Całkowity czas: <span className="font-mono font-medium text-foreground">{((totalTimeMs + currentElapsed) / 1000).toFixed(1)}s</span></span>
            </div>
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
                onChange={(e) => {
                  setUserAnswer(e.target.value)
                  if (isWrong) setIsWrong(false)
                }}
                placeholder="Twoja odpowiedź"
                required
                className={`text-center text-xl sm:text-2xl h-12 sm:h-14 transition-colors ${
                  isWrong ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20 focus-visible:ring-red-500' : ''
                }`}
              />
              {isWrong && (
                <p className="text-red-500 text-sm text-center mt-2">Zła odpowiedź, spróbuj ponownie!</p>
              )}
            </div>
            <Button type="submit" size="lg" className="w-full h-12 sm:h-11 text-base" disabled={submitting}>
              {submitting ? 'Wysyłanie...' : 'Wyślij'}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  )
}
