import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentUser, logout as apiLogout } from "../services/api";

interface User {
    userId: number;
    githubId: number;
    username: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refetch: () => void;
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    function refetch() {
        setLoading(true);
        fetchCurrentUser()
            .then((res) => setUser(res.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        refetch();
    }, []);

    async function logout() {
        await apiLogout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, refetch }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error ('useAuth must be used inside AuthProvider');
    return ctx;
}