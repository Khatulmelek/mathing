'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface LeaderboardEntry {
  id: number
  player_name: string
  score: number
  total_questions: number
  total_time_ms: number
  average_time_ms: number
  created_at: string
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        if (Array.isArray(data)) {
          setEntries(data)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's'
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-center text-lg sm:text-xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-4 sm:px-6 sm:pb-6">
        {loading ? (
          <p className="text-center text-sm sm:text-base text-muted-foreground">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-sm sm:text-base text-muted-foreground">No scores yet. Be the first!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 sm:w-12 text-xs sm:text-sm px-2 sm:px-4">#</TableHead>
                <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Player</TableHead>
                <TableHead className="text-center text-xs sm:text-sm px-2 sm:px-4">Score</TableHead>
                <TableHead className="text-right text-xs sm:text-sm px-1 sm:px-4">Total</TableHead>
                <TableHead className="text-right text-xs sm:text-sm px-2 sm:px-4">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">{index + 1}</TableCell>
                  <TableCell className="text-xs sm:text-sm px-2 sm:px-4 max-w-24 sm:max-w-none truncate">{entry.player_name}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm px-2 sm:px-4">
                    {entry.score}/{entry.total_questions}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs sm:text-sm px-1 sm:px-4">
                    {formatTime(entry.total_time_ms)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs sm:text-sm px-2 sm:px-4">
                    {formatTime(entry.average_time_ms)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
