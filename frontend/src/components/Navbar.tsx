import { useAuth } from "../context/AuthContext";
import { Link, NavLink } from 'react-router-dom';
import { BookmarkIcon, GitHubIcon } from './icons';
import PageContainer from './PageContainer';
import LogoMark from './LogoMark';
import UserAvatar from './UserAvatar';

const API_URL = import.meta.env.VITE_API_URL;

const navLinkClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
            ? 'bg-cyan-500/10 text-cyan-300'
            : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
    }`;

export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/80 backdrop-blur-md">
            <PageContainer>
                <nav aria-label="Main" className="flex h-14 items-center gap-1">
                    <Link to="/" className="mr-2 flex items-center gap-2.5 sm:mr-4">
                        <LogoMark className="h-8 w-8 shrink-0" />
                        <span className="text-[15px] font-semibold leading-none tracking-tight text-white">
                            Contrib<span className="text-cyan-400">Scout</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 sm:flex">
                        <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
                            Explore
                        </NavLink>
                        {user && (
                            <NavLink to="/bookmarks" className={({ isActive }) => navLinkClass(isActive)}>
                                My Bookmarks
                            </NavLink>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        {loading && (
                            <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-900" aria-hidden="true" />
                        )}

                        {!loading && user && (
                            <>
                                <NavLink
                                    to="/bookmarks"
                                    aria-label="My bookmarks"
                                    className={({ isActive }) =>
                                        `rounded-lg p-2 transition-colors sm:hidden ${
                                            isActive
                                                ? 'bg-cyan-500/10 text-cyan-300'
                                                : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                                        }`
                                    }
                                >
                                    <BookmarkIcon className="h-5 w-5" />
                                </NavLink>

                                <div className="hidden items-center gap-2 sm:flex">
                                    <UserAvatar username={user.username} />
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
            </PageContainer>
        </header>
    );
}
