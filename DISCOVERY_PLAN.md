# ContribScout — Automatic Repository Discovery (Planning)

> **Status:** most of this is now implemented in `backend/src/jobs/discover.ts` + `backend/src/services/discovery.ts`, run manually with `npm run discover` (candidate search, quality checks, `is_active` deactivation review — all as described below). What is still open is scheduling discovery to run automatically on a timer, as §5 proposes.

> **Original framing:** this was a planning document, not code yet. It explains how ContribScout finds new GitHub repositories on its own, instead of only using a fixed `TRACKED_REPOS` list. It was meant to be built **after** the main project was stable — which has now happened.

---

## 1. The problem

Right now, the website only shows repositories listed in `TRACKED_REPOS`. GitHub has millions of repositories — we can't add them one by one by hand forever.

**Goal:** have the website automatically find good repositories and add them, instead of relying only on a manual list.

```
A good GitHub project becomes active
            ↓
ContribScout discovers it
            ↓
Checks if it's actually useful for contributors
            ↓
Passes the checks
            ↓
Saved in PostgreSQL
            ↓
Shows up on ContribScout
```

Over time, the database — not `TRACKED_REPOS` — becomes the main source of repositories.

---

## 2. Two ways repositories get added (hybrid system)

**1. Manual repositories** — a small list we trust by hand (e.g. `facebook/react`, `microsoft/vscode`). These are guaranteed to always be there.

**2. Discovered repositories** — found automatically using GitHub's Search API, then checked for quality before being added.

```
                 GitHub
                   ↓
          Automatic Discovery
                   ↓
            Quality Checks
                   ↓
              PostgreSQL
                   ↑
          Manual Seed Repos
```

**Why not pure automatic discovery?** GitHub search might find a repo that technically passes our filters but still isn't a great fit. Keeping a small manual list gives us some control, while discovery lets the site grow without us adding every repo by hand.

---

## 3. Step 1 — Find candidate repositories

We use GitHub's Search API with simple rules, for example:
```
stars > 1000
pushed within the last 30 days
language = TypeScript
```

**Why only 1,000 stars, not 10,000+?** A huge, famous repo with no beginner-friendly issues is a worse fit for our users than a smaller, active repo that actually has `good first issue` labels. Stars are just a basic sanity filter here — not our real measure of quality.

**Why check recent activity?** We don't want to show users projects that have basically stopped being worked on.

**Search multiple languages separately** (JavaScript, TypeScript, Python, Go, Java, etc.) instead of just one big search — this keeps the website from becoming all-JavaScript.

**How many to pull per run:** around 50–100 candidates per language is enough — maybe 250 total across languages. These are only *candidates*, not approved yet.

---

## 4. Step 2 — Check if a candidate is actually useful

Being popular doesn't mean a repo is good to contribute to. Each candidate goes through more checks:

- **Has open issues?** A repo with only 1–2 open issues gives users almost nothing to do — reject.
- **Has beginner-friendly labels** like `good first issue` or `help wanted`? This is the most important signal for our project specifically — reject repos with none.
- **Repository size does NOT reject a repo.** Size already feeds into our existing difficulty score (`scoreRepo()`). A big repo just becomes "Advanced" instead of getting thrown out.
- **Not archived.** An archived repo is no longer maintained — reject.
- **Not a fork.** We don't want duplicate/unofficial copies of a project cluttering the list — reject.

**The full check, as a flow:**
```
Candidate repository
        ↓
Stars > 1000? → No → Reject
        ↓ Yes
Recently updated? → No → Reject
        ↓ Yes
Has open issues? → No → Reject
        ↓ Yes
Has good-first-issue / help-wanted labels? → No → Reject
        ↓ Yes
Archived? → Yes → Reject
        ↓ No
Is a fork? → Yes → Reject
        ↓ No
      Accept → Save in PostgreSQL
```

---

## 5. GitHub rate limits — why discovery runs rarely

GitHub limits how many requests we can make per hour. Checking every candidate (especially the "has good-first-issue labels" check) costs extra API calls, so discovery shouldn't run constantly.

**Two separate jobs, two separate schedules:**

| Job | Job | Runs |
|---|---|---|
| **Sync** | Updates repos we already know (stars, issues, PRs) | Often — every few hours |
| **Discovery** | Finds brand-new repos to add | Rarely — about once a day |

Keeping them separate keeps the system simple to understand and easy to debug.

---

## 6. What happens when a repo stops being good?

A repo that was great when discovered might become inactive or lose its good issues later. **We never delete it outright.**

**Why not delete?** Users might have bookmarked it. If we hard-delete the repo row, and bookmarks are set up to delete along with it (`ON DELETE CASCADE`), the user's bookmark silently disappears too — bad experience.

**Instead, add an `is_active` field:**
- `is_active = true` → shows up in Explore, normal.
- `is_active = false` → hidden from Explore, but the row still exists in the database, so a user's bookmark still works. The Bookmarks page can show a small note like "no longer actively tracked."

---

## 7. Track where each repo came from

Add a `source` field on each repository row:
- `source = manual` — came from our hand-picked list.
- `source = discovered` — found automatically.

This makes debugging easier later ("why is this repo here?") and is honest/explainable if this comes up in an interview.

---

## 8. Good news — existing sync code doesn't need to be rewritten

We already have `syncRepo(fullName)`, which fetches a repo's data, scores its difficulty, and saves it to PostgreSQL. That logic stays exactly the same.

**Discovery's only job is deciding *which* repo names get handed to `syncRepo()`:**
```
Discovery finds: facebook/react, microsoft/vscode, some-new-project
        ↓
Each one gets passed to syncRepo()
        ↓
Saved in PostgreSQL, same as always
```

---

## 9. Full system picture

```
                    GITHUB
                       │
             ┌─────────┴─────────┐
             │                   │
             ↓                   ↓
      Discovery Job          Existing Repos
             │                   │
             ↓                   ↓
       Search API             Sync Job
             │                   │
             ↓                   ↓
      Quality Checks       Update Data
             │                   │
             └─────────┬─────────┘
                       ↓
                  PostgreSQL
                       ↓
                 Express API
                       ↓
                  React App
```

Manual repos enter through their own simple path:
```
Manual Seed List → syncRepo() → PostgreSQL
```

PostgreSQL becomes the real source of truth for the whole website — `TRACKED_REPOS` stops being the main thing driving what users see.

---

## 10. Example walkthrough

**Day 1:** A new TypeScript repo hits 2,500 stars and was recently updated.

1. Discovery search finds it.
2. Has open issues? Yes.
3. Has `good first issue` labels? Yes.
4. Archived? No.
5. Fork? No.
6. **Approved** → `syncRepo("owner/project")` runs → saved in PostgreSQL.
7. Shows up automatically on the Explore page — nobody added it by hand.

---

## 11. The one idea to remember

Don't think: *"How do I collect every GitHub repo?"* — wrong problem.

Think: **"How do I automatically find a small number of genuinely useful repos?"**

```
Millions of GitHub repos
          ↓
   GitHub Search
          ↓
      Candidates
          ↓
   Quality filters
          ↓
    Good repositories
          ↓
      PostgreSQL
          ↓
   ContribScout users
```

This is more complex than the current `TRACKED_REPOS` setup — build it **after** the main project is stable, one piece at a time, not as one big rewrite.