import { useEffect, useState } from "react";
import type { Repository } from "../types";
import { fetchBookmarks, fetchRepositories } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookmarkButton from "../components/BookmarkButton";


const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export default function ExplorePage() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');




  useEffect(() => {
    fetchRepositories()
      .then((res) => setRepos(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


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

  if (loading) return <div className="p-8 text-center">Loading repositories...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Repositories</h1>

      <div className="flex gap-2 mb-6">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1 rounded border text-sm ${filter === level ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-gray-500">No repositories match this filter.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((repo) => (
          <Link
            key={repo.id}
            to={`/repo/${repo.id}`}
            className="border rounded-lg p-4 hover:shadow-md transition block"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold">{repo.owner}/{repo.name}</h2>
              <div className="flex items-center gap-2">
                <BookmarkButton
                  repositoryId={repo.id}
                  initiallyBookmarked={bookmarkedIds.has(repo.id)}
                />

                <span className={`text-xs px-2 py-1 rounded ${difficultyColor[repo.difficulty_level] ?? 'bg-gray-100'}`}>
                  {repo.difficulty_level}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{repo.description}</p>
            <div className="text-xs text-gray-500 mt-2 flex gap-3">
              <span>⭐ {repo.stars}</span>
              <span>🍴 {repo.forks}</span>
              <span>{repo.language}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

}
