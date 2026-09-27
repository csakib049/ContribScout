import { useEffect, useState } from "react";
import type { Repository } from "../types";
import { fetchBookmarks, fetchRepositories } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookmarkButton from "../components/BookmarkButton";


const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-900 text-green-300',
  Intermediate: 'bg-yellow-900 text-yellow-300',
  Advanced: 'bg-red-900 text-red-300',
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


  useEffect(() => {
    setLoading(true);
    fetchRepositories(page)
      .then((res) => {
        setRepos(res.data);
        setHasMore(res.data.length === res.limit);//full page = probably more
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);


  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    fetchBookmarks()
      .then((res) => setBookmarkedIds(new Set(res.data.map((r) => r.id))))
      .catch(() => setBookmarkedIds(new Set()));
  }, [user]);



  const filtered = filter === 'All' ? repos : repos.filter((r) => r.difficulty_level === filter);

  
  if (loading) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Repositories</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-800 bg-gray-900 rounded-lg p-4 animate-pulse">
            <div className="h-5 bg-gray-800 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-full mb-1" />
            <div className="h-4 bg-gray-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

  if (error) return <div className="p-8 text-center text-red-400">Error: {error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Repositories</h1>

      <div className="flex gap-2 mb-6">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1 rounded border text-sm transition-colors ${filter === level ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500 active:bg-blue-700' : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700'
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-gray-400">No repositories match this filter.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((repo) => (
          <Link key={repo.id} to={`/repo/${repo.id}`} className="border border-gray-800 bg-gray-900 rounded-lg p-4 hover:bg-gray-800 hover:border-gray-700 hover:shadow-lg transition block">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold">{repo.owner}/{repo.name}</h2>
              <div className="flex items-center gap-2">
                <BookmarkButton repositoryId={repo.id} initiallyBookmarked={bookmarkedIds.has(repo.id)} />
                <span className={`text-xs px-2 py-1 rounded ${difficultyColor[repo.difficulty_level] ?? 'bg-gray-800 text-gray-200'}`}>
                  {repo.difficulty_level}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{repo.description}</p>
            <div className="text-xs text-gray-400 mt-2 flex gap-3">
              <span>⭐ {repo.stars}</span>
              <span>🍴 {repo.forks}</span>
              <span>{repo.language}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border border-gray-700 rounded text-sm text-gray-200 hover:bg-gray-800 hover:border-gray-600 hover:text-white active:bg-gray-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="px-3 py-1 border border-gray-700 rounded text-sm text-gray-200 hover:bg-gray-800 hover:border-gray-600 hover:text-white active:bg-gray-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Next →
        </button>
      </div>
    </div>
  );
}