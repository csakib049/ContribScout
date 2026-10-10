<p align="center">
  <img src="frontend/public/contribscout-logo-mark.png" alt="ContribScout" width="140" height="140" />
</p>

# ContribScout

## What is this project

ContribScout helps developers find open-source GitHub projects and issues that match their skill level. You can browse a list of repositories, search and filter them, see how hard they are (Beginner, Intermediate, or Advanced), open a repository to see its files and open issues, and click through to the real GitHub page. If you sign in with GitHub, you can also save repositories as bookmarks to look at later.

## What it's built with

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (hosted for free on Neon)
- **Login:** Sign in with GitHub (OAuth)

## Main features

- Browse a list of open-source repositories
- Search repositories by name, owner, or description
- Filter repositories by difficulty level
- Open a repository to see its file tree and open issues, and filter those issues by title or label
- Click through to the real repository or issue on GitHub
- Sign in with your GitHub account
- Save repositories as bookmarks and view them later
- A landing page that introduces the project and what it does
- A background sync job keeps repository and issue data fresh
- Discovers new repositories from GitHub based on quality checks (open issues, beginner-friendly labels, activity) via `npm run discover`

## How to run it on your own computer

**You will need:** Node.js installed, a free PostgreSQL database (from [neon.tech](https://neon.tech)), and a GitHub account.

**1. Clone the project**
```
git clone https://github.com/<your-username>/ContribScout.git
cd ContribScout
```

**2. Set up the backend**
```
cd backend
npm install
```

Create a file named `.env` inside the `backend` folder and fill in your own values:
```
DATABASE_URL=your_postgres_connection_string
GITHUB_TOKEN=your_github_personal_access_token
TRACKED_REPOS=facebook/react,vuejs/core,expressjs/express
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
JWT_SECRET=a_long_random_string
FRONTEND_URL=http://localhost:5173
PORT=4000
SYNC_INTERVAL_MINUTES=240
```

Set up the database tables and pull in some starting data:
```
npm run migrate
npm run sync
```

To automatically find and add new repositories (optional — this searches GitHub and can take a few minutes):
```

npm run discover
```

Start the backend:
```
npm run dev
```

To keep the data updating on a timer in the background, run the scheduler in its own terminal (optional):
```
npm run scheduler
```

**3. Set up the frontend**

Open a new terminal window:
```
cd frontend
npm install
```

Create a file named `.env` inside the `frontend` folder:
```
VITE_API_URL=http://localhost:4000
```

Start the frontend:
```
npm run dev
```

**4. Open the app**

Go to `http://localhost:5173` in your browser.

## How it's built (simple version)

A few choices were made on purpose, to keep the project simple, free to run, and working well:

- **The website almost never asks GitHub for data live, while a user is browsing.** Instead, a background job fetches repository and issue data every few hours and saves it in the database. The one exception is the file tree: opening a repository details page fetches that repository's file list straight from GitHub's API so it is always current. Everything else is served from the project's own database, which keeps the site fast and avoids running into GitHub's request limits.

- **Login does not need a database session.** When you sign in, the backend gives your browser a signed token (kept in a cookie) instead of saving a session on the server. This keeps things simple and means the backend doesn't need extra memory or a session store to know who's logged in.

- **The database lives in the cloud, not on one computer.** Since this project is sometimes built from a home computer and sometimes from a university lab computer, the database needed to be reachable from anywhere. A free cloud database (Neon) solves this — no matter which computer is used, it connects to the same data.