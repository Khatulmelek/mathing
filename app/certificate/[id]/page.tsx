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
  
  const avgTimeSeconds = (entry.average_time_ms / 1000).toFixed(2)
  const totalTimeSeconds = (entry.total_time_ms / 1000).toFixed(2)
  
  return (
    <main className="min-h-dvh bg-background py-4 px-3 sm:py-8 sm:px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-card border-2 sm:border-4 border-primary rounded-lg p-4 sm:p-8 shadow-lg">
          <div className="text-center border-b-2 border-border pb-4 sm:pb-6 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-1 sm:mb-2">
              Certificate of Completion
            </p>
            <h1 className="text-xl sm:text-3xl font-bold">Mathing Quiz</h1>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-muted-foreground mb-1 sm:mb-2">This certifies that</p>
            <p className="text-2xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2 break-words">{entry.player_name}</p>
            <p className="text-sm sm:text-base text-muted-foreground">has completed {entry.total_questions} math problems</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Time</p>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-primary">{totalTimeSeconds}s</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">Average: {avgTimeSeconds}s per question</p>
          </div>
          
          <div className="text-center border-t-2 border-border pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Completed on {new Date(entry.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="text-center mt-4 sm:mt-6">
          <Button asChild className="h-11 sm:h-10 text-base">
            <Link href="/">Take Quiz Again</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
