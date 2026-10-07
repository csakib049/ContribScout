import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookmarkButton from '../components/BookmarkButton';
import PageContainer from '../components/PageContainer';
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
    if (!user) return <div className="p-8 text-center text-neutral-400">Sign in to see your bookmarks.</div>;
    if (loading) return <div className="p-8 text-center">Loading bookmarks...</div>;

    return (
        <PageContainer className="pt-6 pb-12 sm:pt-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-4 sm:text-4xl">My Bookmarks</h1>
            {repos.length === 0 && <p className="text-neutral-400">No bookmarks yet — star a repo from Explore.</p>}
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {repos.map((repo) => (
                    <Link key={repo.id} to={`/repo/${repo.id}`} className="border border-neutral-800 bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 hover:border-neutral-700 hover:shadow-lg transition block">
                        <div className="flex justify-between items-start gap-3">
                            <h2 className="min-w-0 break-words font-semibold">{repo.owner}/{repo.name}</h2>
                            <BookmarkButton repositoryId={repo.id} initiallyBookmarked={true} />
                        </div>
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{repo.description}</p>
                        {!repo.is_active && (
                            <span className="text-xs text-gray-500 italic">No longer actively tracked</span>
                        )}
                    </Link>
                ))}
            </div>
        </PageContainer>
    );
}