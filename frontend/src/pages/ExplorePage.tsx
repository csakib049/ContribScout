import { useEffect, useState } from "react";
import type { Repository } from "../types";
import { useAuth } from "../context/AuthContext";
import RepoCard from "../components/RepoCard";
import { fetchRepositories, fetchBookmarks, searchRepositories } from '../services/api';
import { AlertIcon, ChevronLeftIcon, ChevronRightIcon, InboxIcon, SearchIcon, SpinnerIcon, XIcon } from "../components/icons";

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

const filterActiveStyles: Record<string, string> = {
  All: 'bg-cyan-500/15 text-cyan-200',
  Beginner: 'bg-emerald-500/15 text-emerald-200',
  Intermediate: 'bg-amber-500/15 text-amber-200',
  Advanced: 'bg-red-500/15 text-red-200',
};

const filterDots: Record<string, string> = {
  Beginner: 'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced: 'bg-red-400',
};

export default function ExplorePage() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Repository[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      searchRepositories(searchQuery)
        .then((res) => {
          setSearchResults(res.data);
          setError(null);
        })
        .catch((err) => setError(err.message))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    fetchRepositories(page)
      .then((res) => {
        setRepos(res.data);
        setHasMore(res.data.length === res.limit); // full page = probably more
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, reloadKey]);

  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    fetchBookmarks()
      .then((res) => setBookmarkedIds(new Set(res.data.map((r) => r.id))))
      .catch(() => setBookmarkedIds(new Set()));
  }, [user]);

  const baseList = searchResults ?? repos;
  const filtered = filter === 'All' ? baseList : baseList.filter((r) => r.difficulty_level === filter);

  function clearFilters() {
    setFilter('All');
    setSearchQuery('');
  }

  function handleRetry() {
    setError(null);
    setSearchQuery('');
    setReloadKey((key) => key + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Explore Repositories
        </h1>
        <p className="mt-2 text-sm text-neutral-400 sm:text-base">
          Discover open-source projects and find your next contribution.
        </p>
        <div className="mt-6 h-px bg-gradient-to-r from-cyan-500/40 via-blue-500/15 to-transparent" />
      </header>

      <div className="mt-7 flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="repo-search" className="sr-only">
            Search repositories
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            id="repo-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories by name, owner, or topic..."
            className="h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900 pl-11 pr-10 text-sm text-neutral-100 transition-colors placeholder:text-neutral-500 hover:border-neutral-700 focus:border-cyan-500/60"
            autoComplete="off"
            spellCheck={false}
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Filter by difficulty"
            className="inline-flex w-full flex-wrap gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-1 sm:w-auto"
          >
            {FILTERS.map((level) => {
              const active = filter === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFilter(level)}
                  aria-pressed={active}
                  className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
                    active
                      ? filterActiveStyles[level]
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                  }`}
                >
                  {level !== 'All' && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${filterDots[level] ?? 'bg-neutral-400'}`}
                      aria-hidden="true"
                    />
                  )}
                  {level}
                </button>
              );
            })}
          </div>

          <div
            className="flex h-5 items-center gap-2 text-xs text-neutral-500"
            aria-live="polite"
          >
            {searching && (
              <>
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                <span>Searching...</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <div className="flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">Something went wrong</h2>
            <p className="mt-1.5 max-w-sm text-sm text-neutral-400">
              We couldn't load repositories right now. Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 active:bg-neutral-300"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div>
            <span className="sr-only" role="status">Loading repositories...</span>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="skeleton h-4 w-1/2 rounded-md" />
                    <div className="skeleton h-5 w-24 rounded-full" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="skeleton h-3.5 w-full rounded-md" />
                    <div className="skeleton h-3.5 w-3/4 rounded-md" />
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-neutral-800/70 pt-3.5">
                    <div className="flex gap-3">
                      <div className="skeleton h-3 w-12 rounded-md" />
                      <div className="skeleton h-3 w-10 rounded-md" />
                      <div className="skeleton h-3 w-16 rounded-md" />
                    </div>
                    <div className="skeleton h-3 w-3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-500">
              <InboxIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">No repositories found</h2>
            <p className="mt-1.5 max-w-sm text-sm text-neutral-400">
              Nothing matches your current search and difficulty filter. Try broadening your
              criteria — new repositories are synced regularly.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 transition-colors hover:border-cyan-500/40 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} bookmarked={bookmarkedIds.has(repo.id)} />
            ))}
          </div>
        )}
      </div>

      {!searchResults && !loading && !error && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-800 disabled:hover:text-neutral-300"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Prev
          </button>

          <span className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-400">
            Page <span className="font-medium text-white">{page}</span>
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            aria-label="Next page"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-800 disabled:hover:text-neutral-300"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
