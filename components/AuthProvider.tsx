'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';

export interface AuthUser {
    id: string;
    username: string;
    totalXP: number;
    gems: number;
    avatar: string;
    loginStreak: number;
    longestStreak: number;
    lastLoginDate: string;
    dailyTarget: number;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    refresh: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                const u = data.user;
                setUser(u);

                // Sinkronisasi data dari server ke store lokal (Zustand)
                useUserStore.setState({
                    username: u.username,
                    avatar: u.avatar,
                    totalXP: u.totalXP,
                    gems: u.gems,
                    loginStreak: u.loginStreak,
                    longestStreak: u.longestStreak,
                    lastLoginDate: u.lastLoginDate,
                    dailyTarget: u.dailyTarget,
                    dailyHistory: u.dailyHistory,
                    badges: u.badges,
                    shopItems: u.shopItems,
                });

                useGameStore.setState({
                    levels: u.levels,
                });

            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth refresh error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        // Clear persisted user data on logout
        useUserStore.getState().resetProgress();
        useGameStore.getState().resetAllProgress();
        setUser(null);
        window.location.href = '/welcome';
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}
