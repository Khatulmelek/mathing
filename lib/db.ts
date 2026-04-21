import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'quiz.db')

let db: Database.Database | null = null

export function getDb() {
  if (!db) {
    // Ensure directory exists
    const fs = require('fs')
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    db = new Database(dbPath)
    
    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        total_time_ms INTEGER NOT NULL,
        average_time_ms REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  return db
}

export interface LeaderboardEntry {
  id: number
  player_name: string
  score: number
  total_questions: number
  total_time_ms: number
  average_time_ms: number
  created_at: string
}

export function addLeaderboardEntry(
  playerName: string,
  score: number,
  totalQuestions: number,
  totalTimeMs: number
) {
  const database = getDb()
  const averageTimeMs = totalTimeMs / totalQuestions
  
  const stmt = database.prepare(`
    INSERT INTO leaderboard (player_name, score, total_questions, total_time_ms, average_time_ms)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  const result = stmt.run(playerName, score, totalQuestions, totalTimeMs, averageTimeMs)
  return result.lastInsertRowid
}

export function getLeaderboard(limit = 10): LeaderboardEntry[] {
  const database = getDb()
  const stmt = database.prepare(`
    SELECT * FROM leaderboard 
    ORDER BY score DESC, average_time_ms ASC 
    LIMIT ?
  `)
  return stmt.all(limit) as LeaderboardEntry[]
}

export function getEntryById(id: number): LeaderboardEntry | undefined {
  const database = getDb()
  const stmt = database.prepare('SELECT * FROM leaderboard WHERE id = ?')
  return stmt.get(id) as LeaderboardEntry | undefined
}
