'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyRecord, Badge, BadgeId, ShopItem, ShopItemId } from '../types';

/* ─── Constants ─────────────────────────────────────────────────── */

export const DAILY_TARGETS = [10, 30, 50, 100] as const;
export type DailyTarget = typeof DAILY_TARGETS[number];

const AVATAR_OPTIONS = ['🦊', '🐼', '🦁', '🐸', '🐧', '🦄', '🐉', '🤖', '👾', '🦋'];
export { AVATAR_OPTIONS };

const DEFAULT_BADGES: Badge[] = [
    { id: 'first_win', name: 'Pemenang Pertama', description: 'Selesaikan level pertamamu', emoji: '🏆', earned: false },
    { id: 'streak_3', name: '3 Hari Berturut', description: 'Main 3 hari berturut-turut', emoji: '🔥', earned: false },
    { id: 'streak_7', name: 'Seminggu Juara', description: 'Main 7 hari berturut-turut', emoji: '🌟', earned: false },
    { id: 'all_math', name: 'Master Matematika', description: 'Selesaikan semua level Matematika', emoji: '📐', earned: false },
    { id: 'all_pkn', name: 'Warga Negara Teladan', description: 'Selesaikan semua level PKN', emoji: '🏛️', earned: false },
    { id: 'perfect_level', name: 'Sempurna!', description: 'Raih 3 bintang di satu level', emoji: '💯', earned: false },
    { id: 'speed_demon', name: 'Si Kilat', description: 'Jawab 5 soal berturut benar', emoji: '⚡', earned: false },
    { id: 'gem_spender', name: 'Big Spender', description: 'Belanja item di toko pertama kali', emoji: '💎', earned: false },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
    { id: 'heart_refill', name: 'Isi Nyawa', description: 'Isi ulang 5 nyawa instan', emoji: '❤️', price: 15, owned: 0, maxStack: 5 },
    { id: 'streak_freeze', name: 'Streak Freeze', description: 'Pertahankan streak 1 hari walau tidak main', emoji: '❄️', price: 20, owned: 0, maxStack: 3 },
    { id: 'double_xp', name: 'Double XP', description: '2x XP untuk sesi berikutnya', emoji: '⭐', price: 50, owned: 0, maxStack: 3 },
    { id: 'dark_theme', name: 'Tema Gelap', description: 'Unlock tema warna gelap eksklusif', emoji: '🌙', price: 100, owned: 0, maxStack: 1 },
];

/* ─── Types ─────────────────────────────────────────────────────── */

interface UserStore {
    // Profile
    username: string;
    avatar: string;         // emoji

    // Progression
    totalXP: number;
    gems: number;
    loginStreak: number;    // days in a row
    longestStreak: number;
    lastLoginDate: string;  // YYYY-MM-DD

    // Daily target
    dailyTarget: DailyTarget;
    dailyXP: number;
    dailyDate: string;      // YYYY-MM-DD of the current day's tracking

    // History (last 30 days)
    dailyHistory: DailyRecord[];

    // Sound
    soundEnabled: boolean;

    // Shop & Badges
    shopItems: ShopItem[];
    badges: Badge[];

    // Active power-ups
    doubleXPActive: boolean;
    streakFreezeActive: boolean;

    // Actions
    setUsername: (name: string) => void;
    setAvatar: (emoji: string) => void;
    setDailyTarget: (target: DailyTarget) => void;
    toggleSound: () => void;

    /** Called when XP is earned in a game session */
    addXP: (amount: number) => void;
    /** Called when gems are earned (e.g., completing level) */
    addGems: (amount: number) => void;

    purchaseItem: (itemId: ShopItemId) => boolean;
    /** Mark a badge as earned */
    earnBadge: (badgeId: BadgeId) => void;

    /** Check and update daily login streak */
    checkDailyLogin: () => void;

    resetProgress: () => void;
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

/* ─── Store ─────────────────────────────────────────────────────── */

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            username: 'Pelajar Hebat',
            avatar: '🦊',
            totalXP: 0,
            gems: 50,       // start with some gems
            loginStreak: 0,
            longestStreak: 0,
            lastLoginDate: '',
            dailyTarget: 30,
            dailyXP: 0,
            dailyDate: todayStr(),
            dailyHistory: [],
            soundEnabled: true,
            shopItems: DEFAULT_SHOP_ITEMS,
            badges: DEFAULT_BADGES,
            doubleXPActive: false,
            streakFreezeActive: false,

            setUsername: (name) => set({ username: name }),
            setAvatar: (emoji) => set({ avatar: emoji }),
            setDailyTarget: (target) => set({ dailyTarget: target }),
            toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

            addXP: (amount) => {
                const s = get();
                const today = todayStr();
                const multiplier = s.doubleXPActive ? 2 : 1;
                const earned = amount * multiplier;

                // Reset daily XP if day changed
                const sameDay = s.dailyDate === today;
                const newDailyXP = sameDay ? s.dailyXP + earned : earned;
                const newDailyDate = today;

                // Update history
                const history = [...s.dailyHistory];
                const todayIdx = history.findIndex((h) => h.date === today);
                if (todayIdx >= 0) {
                    history[todayIdx] = { ...history[todayIdx], xp: history[todayIdx].xp + earned };
                } else {
                    history.unshift({ date: today, xp: earned, levelsPlayed: 0 });
                    if (history.length > 30) history.pop();
                }

                set({
                    totalXP: s.totalXP + earned,
                    dailyXP: newDailyXP,
                    dailyDate: newDailyDate,
                    dailyHistory: history,
                    doubleXPActive: false, // consume double XP
                });
            },

            addGems: (amount) => set((s) => ({ gems: s.gems + amount })),

            purchaseItem: (itemId) => {
                const s = get();
                const item = s.shopItems.find((i) => i.id === itemId);
                if (!item || s.gems < item.price || item.owned >= item.maxStack) return false;

                const newItems = s.shopItems.map((i) =>
                    i.id === itemId ? { ...i, owned: i.owned + 1 } : i
                );

                // Apply effects immediately
                const effects: Partial<UserStore> = {};
                if (itemId === 'double_xp') effects.doubleXPActive = true;
                if (itemId === 'streak_freeze') effects.streakFreezeActive = true;

                set({ gems: s.gems - item.price, shopItems: newItems, ...effects });

                // Earn gem_spender badge
                get().earnBadge('gem_spender');
                return true;
            },

            earnBadge: (badgeId) => {
                const s = get();
                if (s.badges.find((b) => b.id === badgeId)?.earned) return;
                set({
                    badges: s.badges.map((b) =>
                        b.id === badgeId ? { ...b, earned: true } : b
                    ),
                });
            },

            checkDailyLogin: () => {
                const s = get();
                const today = todayStr();
                if (s.lastLoginDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toISOString().slice(0, 10);

                let newStreak: number;
                if (s.lastLoginDate === yStr || s.streakFreezeActive) {
                    newStreak = s.loginStreak + 1;
                } else {
                    newStreak = 1; // reset
                }

                // Earn streak badges
                const updates: Partial<UserStore> = {
                    loginStreak: newStreak,
                    longestStreak: Math.max(s.longestStreak, newStreak),
                    lastLoginDate: today,
                    streakFreezeActive: false,
                };

                set(updates);

                if (newStreak >= 3) get().earnBadge('streak_3');
                if (newStreak >= 7) get().earnBadge('streak_7');
            },

            resetProgress: () => {
                set({
                    totalXP: 0,
                    gems: 50,
                    loginStreak: 0,
                    longestStreak: 0,
                    lastLoginDate: '',
                    dailyXP: 0,
                    dailyDate: todayStr(),
                    dailyHistory: [],
                    shopItems: DEFAULT_SHOP_ITEMS,
                    badges: DEFAULT_BADGES,
                    doubleXPActive: false,
                    streakFreezeActive: false,
                });
            },
        }),
        { name: 'unmath-user' }
    )
);
