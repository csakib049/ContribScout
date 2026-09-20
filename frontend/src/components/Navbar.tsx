import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;


export default function Navbar() {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center px-6 py-3 border-b">
            <Link to="/" className="font-bold">ContribScout</Link>

            {!loading && (
                user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">{user.username}</span>
                        <button
                            onClick={logout}
                            className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href={`${API_URL}/auth/github`}
                        className="text-sm px-3 py-1 bg-gray-900 text-white rounded"
                    >
                        Sign in with GitHub
                    </a>
                )
            )}
        </nav>
    );
}