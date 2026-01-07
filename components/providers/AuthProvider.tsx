"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/actions/auth";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    setUser: () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                setUser(user as unknown as User);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        setUser(null); // Optimistically clear user state immediately
        await logoutUser();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
