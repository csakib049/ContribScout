import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookmarkButton from '../components/BookmarkButton';
import type { Repository } from '../types';

export default function BookmarksPage() {
    const { user, loading: authLoading } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchBookmarks()
            .then((res) => setRepos(res.data))
            .finally(() => setLoading(false));
    }, [user]);

    if (authLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return <div className="p-8 text-center text-gray-500">Sign in to see your bookmarks.</div>;
    if (loading) return <div className="p-8 text-center">Loading bookmarks...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
            {repos.length === 0 && <p className="text-gray-500">No bookmarks yet — star a repo from Explore.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
                {repos.map((repo) => (
                    <Link key={repo.id} to={`/repo/${repo.id}`} className="border rounded-lg p-4 hover:shadow-md block">
                        <div className="flex justify-between items-start">
                            <h2 className="font-semibold">{repo.owner}/{repo.name}</h2>
                            <BookmarkButton repositoryId={repo.id} initiallyBookmarked={true} />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}