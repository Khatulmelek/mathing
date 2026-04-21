import Link from 'next/link'
import { Quiz } from '@/components/quiz'
import { Leaderboard } from '@/components/leaderboard'

export default function Home() {
  return (
    <main className="min-h-dvh bg-background py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Mathing</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Test your mental math skills
          </p>
        </header>
        
        <div className="flex flex-col gap-6 sm:gap-8">
          <Quiz />
          <Leaderboard />
        </div>
        
        <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </main>
  )
}
