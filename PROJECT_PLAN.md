# ContribScout — Project Plan (Revised)

> **Project type:** GitHub Contribution Discovery Platform
> **Purpose:** Help developers discover open-source repositories and GitHub issues that match their skill level.
> **Constraint driving this revision:** zero budget, no laptop — development happens on a home desktop plus short (2–3 hr) sessions on university lab PCs. Every architecture decision below is filtered through that constraint first.

---

## What changed from the original plan and why

| Area | Original plan | Problem | Revised approach |
|---|---|---|---|
| Database/cache | Local Postgres + Redis via Docker Compose | Lab PCs won't have Docker or persistent local storage between sessions | Free-tier **cloud** Postgres (Neon/Supabase) + optional cloud Redis (Upstash), reachable from any machine with just a connection string |
| GitHub API limits | Only the general 5,000/hr limit was covered | Search/filter features use the **Search API**, which is capped at 30 req/min authenticated — the real bottleneck | Never call GitHub Search live per user request; only search your own database, populated by a background sync |
| Difficulty scoring | A formula (`Issue Complexity + Repository Complexity + ...`) with no actual numbers | Not implementable as written | A concrete point-based rule table (below) |
| Scope | Queues, workers, AI, search indexing, horizontal scaling all planned in detail | Too much for a solo student project with a few hours/week | Everything past the MVP is now explicitly labeled **optional / only if the project keeps growing** |
| Dev workflow | Not addressed | You move between two machines | Git push/pull workflow defined explicitly (see below) |

---

## 1. Problem & Solution

**Problem:** Developers who want to contribute to open source don't know which repos/issues fit their skill level, or whether an issue is still worth pursuing.

**Solution:** ContribScout pulls repo/issue data from the GitHub API, applies a simple rule-based difficulty classification, and presents it as a browsable, filterable list — with a repo details page showing files, issues, PRs, and a link back to GitHub.

---

## 2. Development Environment Strategy (new — read this first)

Because you're switching between a home desktop and lab PCs with no persistent local setup, the project must **not depend on anything installed locally except Git and Node.js** (both of which are commonly preinstalled or quick to check on lab machines).

**Rule: no local database or cache dependency.** Use free cloud services reachable by connection string/API key from anywhere:

- **Database:** [Neon](https://neon.tech) or [Supabase](https://supabase.com) — free-tier PostgreSQL, no card required for the free tier at time of writing (verify current terms before relying on this).
- **Cache (only once you actually need it):** [Upstash](https://upstash.com) — free-tier Redis over HTTP, works from any machine, no local Redis server needed.
- **Secrets:** a `.env` file, never committed. Keep a copy of your `.env.example` (no real values) in the repo so setup at either machine is copy-paste-fill.

**Docker is optional, not required.** Drop it as a hard requirement. If you want it later for local parity, fine — but don't let it block getting a working app in the lab.

**Sync workflow between home and lab:**

```
Home: finish a chunk of work → commit → git push
Lab:  git clone (first time) or git pull → work for your 2–3 hrs → commit → git push
Home: git pull → continue
```

Because the database is cloud-hosted, your data state doesn't depend on which machine you're on — only your code does, and Git handles that.

**Before your first lab session:** confirm the university network doesn't block GitHub, Neon/Supabase, or Upstash. Test once, don't assume.

---

## 3. Target Users

- **Beginner:** learning Git/GitHub, wants small issues (docs, typos, small bugs).
- **Intermediate:** comfortable with APIs/DBs, wants moderate feature work.
- **Advanced:** wants architecture-level or performance work.

(Unchanged from original — this part was fine.)

---

## 4. Core User Flow

```
Browse opportunities → apply filters → select repo/issue
  → Repository Details Page (info, files, issues, PRs, languages, README)
  → open original repo/issue on GitHub
```

---

## 5. MVP Scope (trimmed to be actually achievable solo, free, part-time)

This is deliberately smaller than the original MVP list. Build this first — nothing else.

**Frontend**
- Explore page (list of repos, basic filters: language, difficulty)
- Repository details page (info, file tree, issue list, "View on GitHub" button)
- Loading and error states

**Backend**
- Express + TypeScript API
- GitHub API integration (server-side only — frontend never calls GitHub directly)
- One background sync job (even a simple scheduled script, not a full queue system) that pulls a fixed, curated list of repos + their issues into your database on a timer
- Basic rule-based difficulty classification (see section 7)
- Pagination on list endpoints

**Database**
- PostgreSQL (cloud free tier)
- No Redis yet — a `updatedAt` timestamp check ("only re-sync if older than N hours") is enough caching for MVP scale

**Explicitly cut from MVP:** authentication, bookmarks, recommendations, Redis, queues/workers, AI, search indexing. All moved to "later, optional" below.

This scope is buildable in scattered short sessions because each piece (API route, DB table, one page) is independently small.

---

## 6. Repository & Issue Discovery

**Important constraint the original plan missed:** GitHub's Search API (used for filtering/discovery by language, stars, etc.) is limited to **30 requests/min authenticated, 10/min unauthenticated** — much tighter than the general 5,000/hr API limit.

**Consequence for design:** never let a user's filter/search request trigger a live call to GitHub. Instead:

1. Pick a **fixed, curated list** of repos to track (start with maybe 20–50 well-known beginner-friendly repos — e.g. from `good-first-issue`-tagged well-known projects).
2. A background job fetches their metadata + issues into your own database on a schedule (e.g. every few hours).
3. All user-facing search/filter/sort operations query **your database**, not GitHub, so there's no per-user rate-limit exposure at all.

This also means your app works even if GitHub is slow or you're mid-way through a sync — you're always serving from your own data.

**Issue signals used for classification (unchanged from original, still reasonable):**
`good first issue`, `help wanted`, `documentation`, `bug`, `beginner`, comment count, issue age, labels. Treated as signals, not ground truth.

---

## 7. Difficulty Classification — concrete version

The original formula (`Issue Complexity + Repository Complexity + ...`) wasn't implementable as written. Here's a simple point-based version you can actually code:

```
score = 0

if "good first issue" in labels:      score += 0
if "documentation" in labels:         score += 5
if "bug" in labels:                   score += 15
if "enhancement"/"feature" in labels: score += 25
if comment_count > 10:                score += 10
if issue_age_days > 180:              score += 5
if repo_size_kb > 50000:              score += 10   # large codebase = harder to navigate

if score <= 15:  difficulty = "Beginner"
if 16-40:        difficulty = "Intermediate"
if 41+:          difficulty = "Advanced"
```

Tune these numbers once you see real data — but this is a real, runnable starting rule set, not a placeholder formula.

---

## 8. Repository Details Page

Same content as original plan: repo info, file/folder tree, stars/forks, issues, PRs, contributors, languages, README, "View on GitHub" link.

**One technical note the original missed:** fetching a full folder tree efficiently uses the Git Trees API with `?recursive=1` (one call for the whole tree) rather than walking the `contents` endpoint folder-by-folder (one call per folder — burns through your rate limit fast on large repos).

---

## 9. GitHub API Integration

```
React Client → Express API → GitHub API
```

Backend holds the GitHub token; frontend never sees it. Same as original — this part was correct.

**Two separate rate-limit budgets to track (this distinction was missing before):**
- Core API (repo info, file contents, issues, PRs): 5,000/hr authenticated.
- Search API: 30/min authenticated — avoid entirely in the request path; only used by your own background sync job, if at all.

---

## 10. Data Storage

**PostgreSQL**, cloud free tier (Neon or Supabase). Same reasoning as original (relational data: users, repos, issues, bookmarks) — this choice was sound, just moved off local Docker.

### Core tables (trimmed to MVP — drop User/Skill/Bookmark/Contribution until Phase 2)

```
Repository: id, githubId, owner, name, description, url, language,
            stars, forks, openIssues, size, lastGitHubUpdate,
            difficultyScore, difficultyLevel, updatedAt

Issue:      id, githubId, repositoryId, number, title, url, state,
            labels, comments, difficultyScore, difficultyLevel, updatedAt
```

Add User/Skill/Bookmark/Contribution tables only when you actually build auth in Phase 2 — don't create empty tables now.

---

## 11. Backend Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/       (GitHub API logic lives here, isolated from routes)
│   ├── db/
│   ├── jobs/            (the one background sync script)
│   └── app.ts
```

Simpler than the original (dropped `workers/`, `repositories/` as separate layers, `models/` — not needed until the project is bigger than MVP).

---

## 12. Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/            (Explore, RepositoryDetails)
│   ├── services/         (API calls to your backend)
│   └── App.tsx
```

---

## 13. REST API (MVP set only)

```http
GET /api/repositories
GET /api/repositories/:id
GET /api/repositories/:id/files
GET /api/repositories/:id/issues
GET /api/repositories/:id/pulls
```

Everything else (auth, bookmarks, search endpoints) — Phase 2+.

---

## 14. Error Handling

- GitHub API unavailable → show cached DB data, note it may be stale.
- Repo not found → clear 404 message.
- Rate limit hit (shouldn't happen in normal use since users never call GitHub directly) → log it, alert only if the background sync job itself is throttled.

---

## 15. Phase 2 (only after MVP works end-to-end)

- GitHub OAuth login
- Bookmarks/saved repos
- Redis cache (only if you notice actual repeated-query slowness — don't add it preemptively)
- More repos in the tracked list, faster sync

## Phase 3 (optional, stretch — do not plan around these)

- Personalized recommendations
- AI-assisted classification
- Search indexing (TF-IDF/BM25) — only relevant at a scale you're unlikely to reach as a solo project
- Queues/workers, horizontal scaling — these solve problems you won't have with a curated repo list and single-instance deployment

These are kept in the plan only so you know the direction if the project ever grows — not because you should build toward them now.

---

## 16. Free Resource Checklist

| Need | Free option | Notes |
|---|---|---|
| Source control | GitHub | — |
| Database | Neon / Supabase free tier | Verify current limits before deploying |
| Backend hosting | Render free tier | Cold starts on free tier — acceptable for a portfolio project |
| Frontend hosting | Vercel / Netlify free tier | — |
| Cache (later) | Upstash free tier | Only add if needed |

Free-tier terms change — re-check limits before deployment, not just at project start.

---

## 17. Definition of Done — MVP

A user can:
- Open the app and see a list of tracked repositories.
- Filter by language and difficulty.
- Open a repository details page.
- See file tree, issues, PRs, languages.
- Click through to the real GitHub repo/issue.
- All of the above without the frontend ever calling GitHub directly, and without any per-request GitHub API call in the search/filter path.

---

## 18. Engineering Principles (kept from original — these were good)

1. Build the MVP before advanced architecture.
2. Don't add infrastructure (queues, microservices, search indexes) before you have a concrete problem that needs it.
3. Cache/sync GitHub data instead of calling it live per request.
4. Keep GitHub API logic isolated from business logic.
5. Keep secrets out of source code and off the frontend.
6. Validate all external input.

---

## 19. First Milestone (what to actually build first)

```
Explore page → Express API → GitHub API (via one background sync job)
            → repos stored in Postgres
            → Repository Details page (files/issues/PRs from DB)
```

Once this works end-to-end on both your home machine and a lab machine (proving the git push/pull + cloud DB workflow actually works), everything else is additive.

