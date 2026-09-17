import 'dotenv/config'

export const env = {
  githubToken: process.env.GITHUB_TOKEN || '',
  databaseUrl: process.env.DATABASE_URL || '',
  syncIntervalMinutes: Number(process.env.SYNC_INTERVAL_MINUTES || 240),
  port: Number(process.env.PORT || 4000),
  trackedRepos: (process.env.TRACKED_REPOS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}

