import { pool } from './pool'

const REPOSITORIES_TABLE = `
CREATE TABLE IF NOT EXISTS repositories (
  id SERIAL PRIMARY KEY,
  github_id BIGINT UNIQUE NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  language TEXT,
  stars INT DEFAULT 0,
  forks INT DEFAULT 0,
  open_issues INT DEFAULT 0,
  size INT DEFAULT 0,
  difficulty_score INT,
  difficulty_level TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`

const ISSUES_TABLE = `
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  github_id BIGINT UNIQUE NOT NULL,
  repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
  number INT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  state TEXT NOT NULL,
  labels TEXT[] DEFAULT '{}',
  comments INT DEFAULT 0,
  difficulty_score INT,
  difficulty_level TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`

const USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  github_id BIGINT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`

const BOOKMARKS_TABLE = `
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, repository_id)
);
`




async function migrate() {
  try {
    await pool.query(REPOSITORIES_TABLE)
    await pool.query(ISSUES_TABLE)
    await pool.query(USERS_TABLE)
    await pool.query(BOOKMARKS_TABLE)
    console.log('Migration applied: repositories + issues + users tables ready.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrate()