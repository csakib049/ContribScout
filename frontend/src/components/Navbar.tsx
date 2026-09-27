import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;


export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-gray-950">
            <Link to="/" className="font-bold text-white">ContribScout</Link>


            {user && (
                <Link to="/bookmarks" className="text-sm text-gray-300 hover:text-white mr-4 transition-colors">My Bookmarks</Link>
            )}

            {!loading && (
                user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">{user.username}</span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1 border border-gray-700 rounded text-gray-200 hover:bg-gray-800 hover:border-gray-600 hover:text-white active:bg-gray-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href={`${API_URL}/auth/github`}
                        className="text-sm px-3 py-1 bg-white text-gray-950 font-medium rounded hover:bg-gray-200 active:bg-gray-300 transition-colors"
                    >
                        Sign in with GitHub
                    </a>
                )
            )}
        </nav>
    );
}