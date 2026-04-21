import Link from 'next/link'
import { Quiz } from '@/components/quiz'
import { Leaderboard } from '@/components/leaderboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Mathing</h1>
          <p className="text-muted-foreground">
            Test your mental math skills with quick arithmetic problems
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <Quiz />
          <Leaderboard />
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </main>
  )
}
