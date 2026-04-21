import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEntryById } from '@/lib/db'
import { Button } from '@/components/ui/button'

interface CertificatePageProps {
  params: Promise<{ id: string }>
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { id } = await params
  const entry = getEntryById(parseInt(id))
  
  if (!entry) {
    notFound()
  }
  
  const percentage = Math.round((entry.score / entry.total_questions) * 100)
  const avgTimeSeconds = (entry.average_time_ms / 1000).toFixed(2)
  const totalTimeSeconds = (entry.total_time_ms / 1000).toFixed(2)
  
  const getGrade = (percent: number) => {
    if (percent >= 90) return { grade: 'A', message: 'Outstanding!' }
    if (percent >= 80) return { grade: 'B', message: 'Great job!' }
    if (percent >= 70) return { grade: 'C', message: 'Good effort!' }
    if (percent >= 60) return { grade: 'D', message: 'Keep practicing!' }
    return { grade: 'F', message: 'Try again!' }
  }
  
  const { grade, message } = getGrade(percentage)
  
  return (
    <main className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-lg">
          <div className="text-center border-b-2 border-border pb-6 mb-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Certificate of Completion
            </p>
            <h1 className="text-3xl font-bold">Mathing Quiz</h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-2">This certifies that</p>
            <p className="text-4xl font-bold text-primary mb-2">{entry.player_name}</p>
            <p className="text-muted-foreground">has completed the Math Quiz</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-3xl font-bold">
                {entry.score}/{entry.total_questions}
              </p>
              <p className="text-sm text-muted-foreground">{percentage}%</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Grade</p>
              <p className="text-5xl font-bold">{grade}</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average Response Time</p>
              <p className="text-xl font-mono font-bold">{avgTimeSeconds}s</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-xl font-mono font-bold">{totalTimeSeconds}s</p>
            </div>
          </div>
          
          <div className="text-center border-t-2 border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Completed on {new Date(entry.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button asChild>
            <Link href="/">Take Quiz Again</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
