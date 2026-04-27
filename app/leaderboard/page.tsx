import Link from 'next/link'
import { Leaderboard } from '@/components/leaderboard-full'

export default function Home() {
  return (
    <main className="min-h-dvh bg-background py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Mathing</h1>
        </header>
        <div className="flex flex-col gap-6 sm:gap-8">
          <Leaderboard />
        </div>
      </div>
    </main>
  )
}
