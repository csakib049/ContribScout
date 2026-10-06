import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from 'react-router-dom';
import { BookmarkIcon, GitHubIcon } from './icons';

const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const { pathname } = useLocation();

    const linkClass = (active: boolean) =>
        `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            active
                ? 'bg-cyan-500/10 text-cyan-300'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/80 backdrop-blur-md">
            <nav aria-label="Main" className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4 sm:px-6">
                <Link to="/" className="mr-2 flex items-center gap-2.5 sm:mr-4">
                    <img
                        src="/logo.png"
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 rounded-lg ring-1 ring-white/10"
                    />
                    <span className="text-[15px] font-semibold tracking-tight text-white">
                        Contrib<span className="text-cyan-400">Scout</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 sm:flex">
                    <Link to="/" className={linkClass(pathname === '/')}>
                        Explore
                    </Link>
                    {user && (
                        <Link to="/bookmarks" className={linkClass(pathname === '/bookmarks')}>
                            My Bookmarks
                        </Link>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {loading && (
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-900" aria-hidden="true" />
                    )}

                    {!loading && user && (
                        <>
                            <Link
                                to="/bookmarks"
                                aria-label="My bookmarks"
                                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white sm:hidden"
                            >
                                <BookmarkIcon className="h-5 w-5" />
                            </Link>

                            <div className="hidden items-center gap-2 sm:flex">
                                <span
                                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-xs font-semibold text-cyan-100 ring-1 ring-white/10"
                                    aria-hidden="true"
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                <span className="max-w-40 truncate text-sm text-neutral-300">
                                    {user.username}
                                </span>
                            </div>

                            <button
                                onClick={logout}
                                className="rounded-lg border border-neutral-800 px-2.5 py-1.5 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-white sm:px-3"
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!loading && !user && (
                        <a
                            href={`${API_URL}/auth/github`}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 active:bg-neutral-300"
                        >
                            <GitHubIcon className="h-4 w-4" />
                            <span>
                                <span className="hidden sm:inline">Sign in with </span>GitHub
                            </span>
                        </a>
                    )}
                </div>
            </nav>
        </header>
    );
}
