import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;


export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center px-6 py-3 border-b border-neutral-800 bg-neutral-950">
            <Link to="/" className="font-bold text-white">ContribScout</Link>


            {user && (
                <Link to="/bookmarks" className="text-sm text-neutral-300 hover:text-white mr-4 transition-colors">My Bookmarks</Link>
            )}

            {!loading && (
                user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-300">{user.username}</span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1 border border-neutral-700 rounded text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600 hover:text-white active:bg-neutral-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href={`${API_URL}/auth/github`}
                        className="text-sm px-3 py-1 bg-white text-neutral-950 font-medium rounded hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                    >
                        Sign in with GitHub
                    </a>
                )
            )}
        </nav>
    );
}