'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyRecord, Badge, BadgeId, ShopItem, ShopItemId, DailyChallenge, GameResult } from '../types';

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
    { id: 'heart_refill', name: 'Isi Nyawa', description: 'Isi ulang nyawa harian +3', emoji: '❤️', price: 15, owned: 0, maxStack: 5 },
    { id: 'streak_freeze', name: 'Streak Freeze', description: 'Pertahankan streak 1 hari walau tidak main', emoji: '❄️', price: 20, owned: 0, maxStack: 3 },
    { id: 'double_xp', name: 'Double XP', description: '2x XP untuk sesi berikutnya', emoji: '⭐', price: 50, owned: 0, maxStack: 3 },
    { id: 'dark_theme', name: 'Tema Gelap', description: 'Unlock tema warna gelap eksklusif', emoji: '🌙', price: 100, owned: 0, maxStack: 1 },
    // ── New items (Task 8) ──
    { id: 'hint', name: 'Petunjuk', description: 'Eliminasi 1 opsi salah (pilihan ganda)', emoji: '💡', price: 8, owned: 0, maxStack: 10 },
    { id: 'time_extend', name: 'Tambah Waktu', description: '+15 detik untuk soal ini', emoji: '⏰', price: 10, owned: 0, maxStack: 10 },
    { id: 'second_chance', name: 'Kesempatan Kedua', description: 'Jawab ulang 1 soal tanpa nyawa berkurang', emoji: '🛡️', price: 25, owned: 0, maxStack: 5 },
    { id: 'xp_boost_24h', name: 'XP Boost 24 Jam', description: '2x XP selama 24 jam', emoji: '🚀', price: 80, owned: 0, maxStack: 3 },
];

/* ─── Types ─────────────────────────────────────────────────────── */

interface UserStore {
    // Profile
    username: string;
    avatar: string;

    // Progression
    totalXP: number;
    gems: number;
    totalGemsEarned: number;    // lifetime total for gem_hoarder badge
    loginStreak: number;
    longestStreak: number;
    lastLoginDate: string;

    // Daily target
    dailyTarget: DailyTarget;
    dailyXP: number;
    dailyDate: string;

    // Daily lives (Task 4)
    dailyLives: number;         // 0-5
    lastRegenTime: number;      // unix timestamp ms

    // Daily challenge (Task 7)
    dailyChallenge: DailyChallenge | null;
    consecutiveQuickAnswers: number;  // for speed_demon badge tracking

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
    xpBoostExpiresAt: number;   // unix ms — replaces doubleXPActive
    hintActive: boolean;        // true if hint item consumed this question
    secondChanceActive: boolean; // true if second_chance active this question
    timeExtendActive: boolean;  // true if time_extend consumed this question

    // Actions
    setUsername: (name: string) => void;
    setAvatar: (emoji: string) => void;
    setDailyTarget: (target: DailyTarget) => void;
    toggleSound: () => void;

    addXP: (amount: number) => void;
    addGems: (amount: number) => void;
    spendGems: (amount: number) => boolean;

    purchaseItem: (itemId: ShopItemId) => boolean;
    useHint: () => void;
    useTimeExtend: () => void;
    useSecondChance: () => void;
    clearQuestionPowerUps: () => void;

    earnBadge: (badgeId: BadgeId) => void;
    checkAndAwardBadges: (result: GameResult) => void;

    checkDailyLogin: () => void;
    consumeLife: () => void;
    regenLives: () => void;
    refillLives: (amount: number) => void;

    updateDailyChallenge: (event: 'level_no_loss' | 'correct_answer' | 'streak_5' | 'level_fast') => void;
    getDailyChallenge: () => DailyChallenge;

    resetProgress: () => void;
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

/* ─── Daily Challenge helpers ────────────────────────────────────── */

const CHALLENGE_TYPES: Array<{ type: 1 | 2 | 3 | 4; title: string; desc: string; xpReward: number; gemReward: number }> = [
    { type: 1, title: 'Tanpa Nyawa Berkurang', desc: 'Selesaikan 1 level tanpa kehilangan nyawa', xpReward: 50, gemReward: 10 },
    { type: 2, title: '10 Jawaban Benar', desc: 'Jawab 10 soal benar hari ini', xpReward: 30, gemReward: 0 },
    { type: 3, title: 'Streak 5 Jawaban', desc: 'Raih streak 5 jawaban berturut-turut', xpReward: 20, gemReward: 5 },
    { type: 4, title: 'Level Cepat', desc: 'Selesaikan 1 level dalam 3 menit', xpReward: 40, gemReward: 0 },
];

export { CHALLENGE_TYPES };

function getTodayChallenge(): DailyChallenge {
    const dateStr = new Date().toDateString();
    // Deterministic seed from date
    let hash = 0;
    for (const char of dateStr) hash = (hash * 31 + char.charCodeAt(0)) & 0xffffffff;
    const idx = Math.abs(hash) % CHALLENGE_TYPES.length;
    const today = todayStr();
    return {
        date: today,
        type: CHALLENGE_TYPES[idx].type,
        progress: 0,
        completed: false,
    };
}

/* ─── Store ─────────────────────────────────────────────────────── */

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            username: 'Pelajar Hebat',
            avatar: '🦊',
            totalXP: 0,
            gems: 50,
            totalGemsEarned: 0,
            loginStreak: 0,
            longestStreak: 0,
            lastLoginDate: '',
            dailyTarget: 30,
            dailyXP: 0,
            dailyDate: todayStr(),
            dailyLives: 5,
            lastRegenTime: Date.now(),
            dailyChallenge: null,
            consecutiveQuickAnswers: 0,
            dailyHistory: [],
            soundEnabled: true,
            shopItems: DEFAULT_SHOP_ITEMS,
            badges: DEFAULT_BADGES,
            doubleXPActive: false,
            streakFreezeActive: false,
            xpBoostExpiresAt: 0,
            hintActive: false,
            secondChanceActive: false,
            timeExtendActive: false,

            setUsername: (name) => set({ username: name }),
            setAvatar: (emoji) => set({ avatar: emoji }),
            setDailyTarget: (target) => set({ dailyTarget: target }),
            toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

            addXP: (amount) => {
                const s = get();
                const today = todayStr();
                const now = Date.now();
                // 24h boost takes priority over session double_xp
                const boosted = (s.xpBoostExpiresAt > now) || s.doubleXPActive;
                const multiplier = boosted ? 2 : 1;
                const earned = Math.round(amount * multiplier);

                const sameDay = s.dailyDate === today;
                const newDailyXP = sameDay ? s.dailyXP + earned : earned;

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
                    dailyDate: today,
                    dailyHistory: history,
                    doubleXPActive: false,
                });
            },

            addGems: (amount) => set((s) => ({
                gems: s.gems + amount,
                totalGemsEarned: s.totalGemsEarned + amount,
            })),

            spendGems: (amount) => {
                const s = get();
                if (s.gems < amount) return false;
                set({ gems: s.gems - amount });
                return true;
            },

            purchaseItem: (itemId) => {
                const s = get();
                const item = s.shopItems.find((i) => i.id === itemId);
                if (!item || s.gems < item.price || item.owned >= item.maxStack) return false;

                const newItems = s.shopItems.map((i) =>
                    i.id === itemId ? { ...i, owned: i.owned + 1 } : i
                );

                const effects: Partial<UserStore> = {};
                if (itemId === 'double_xp') effects.doubleXPActive = true;
                if (itemId === 'streak_freeze') effects.streakFreezeActive = true;
                if (itemId === 'xp_boost_24h') effects.xpBoostExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

                set({ gems: s.gems - item.price, shopItems: newItems, ...effects });
                get().earnBadge('gem_spender');
                return true;
            },

            useHint: () => {
                const s = get();
                const item = s.shopItems.find((i) => i.id === 'hint');
                if (!item || item.owned <= 0) return;
                set({
                    shopItems: s.shopItems.map((i) => i.id === 'hint' ? { ...i, owned: i.owned - 1 } : i),
                    hintActive: true,
                });
            },

            useTimeExtend: () => {
                const s = get();
                const item = s.shopItems.find((i) => i.id === 'time_extend');
                if (!item || item.owned <= 0) return;
                set({
                    shopItems: s.shopItems.map((i) => i.id === 'time_extend' ? { ...i, owned: i.owned - 1 } : i),
                    timeExtendActive: true,
                });
            },

            useSecondChance: () => {
                const s = get();
                const item = s.shopItems.find((i) => i.id === 'second_chance');
                if (!item || item.owned <= 0) return;
                set({
                    shopItems: s.shopItems.map((i) => i.id === 'second_chance' ? { ...i, owned: i.owned - 1 } : i),
                    secondChanceActive: true,
                });
            },

            clearQuestionPowerUps: () => set({ hintActive: false, timeExtendActive: false, secondChanceActive: false }),

            earnBadge: (badgeId) => {
                const s = get();
                // Merge new badge into list if it doesn't exist yet
                const existing = s.badges.find((b) => b.id === badgeId);
                if (existing?.earned) return;
                if (existing) {
                    set({ badges: s.badges.map((b) => b.id === badgeId ? { ...b, earned: true } : b) });
                } else {
                    // Badge from DEFAULT_BADGES that may not be in persisted state yet
                    const def = DEFAULT_BADGES.find((b) => b.id === badgeId);
                    if (def) {
                        set({ badges: [...s.badges, { ...def, earned: true }] });
                    }
                }
            },

            checkAndAwardBadges: (result) => {
                const self = get();
                const {
                    subject, levelId, stars, correctCount, totalQuestions,
                    livesLeft, bestStreak, sessionTimeSeconds,
                    allLevelsMath, allLevelsPkn,
                } = result;

                if (stars >= 1) self.earnBadge('first_win');
                if (stars === 3) self.earnBadge('perfect_level');

                // Task 6: no_mistake — all correct
                if (correctCount === totalQuestions && totalQuestions > 0) self.earnBadge('no_mistake');

                // Task 6: comeback — win with 1 life left
                if (livesLeft === 1 && stars >= 1) self.earnBadge('comeback');

                // Task 6: speed_demon — bestStreak 5 all within 10s tracked via consecutiveQuickAnswers
                if (self.consecutiveQuickAnswers >= 5) self.earnBadge('speed_demon');

                // Task 6: math_master — all 5 math levels with 3 stars
                if (subject === 'math' || allLevelsMath.length > 0) {
                    if (allLevelsMath.every((l) => l.bestStars === 3)) self.earnBadge('math_master');
                }
                // Task 6: pkn_master
                if (allLevelsPkn.every((l) => l.bestStars === 3)) self.earnBadge('pkn_master');

                // Task 6: all_clear — all levels in both subjects done with >=1 star
                if (allLevelsMath.every((l) => l.bestStars >= 1) && allLevelsPkn.every((l) => l.bestStars >= 1)) {
                    self.earnBadge('all_clear');
                }

                // all_math / all_pkn — complete all levels (any stars)
                if (subject === 'math' && allLevelsMath.every((l) => l.bestStars >= 1)) self.earnBadge('all_math');
                if (subject === 'pkn' && allLevelsPkn.every((l) => l.bestStars >= 1)) self.earnBadge('all_pkn');

                // Task 6: gem_hoarder
                const s = get();
                if (s.totalGemsEarned >= 500) self.earnBadge('gem_hoarder');

                // Task 6: scholar_30
                if (s.loginStreak >= 30) self.earnBadge('scholar_30');

                // reset quick answer tracker
                set({ consecutiveQuickAnswers: 0 });
                void levelId; void sessionTimeSeconds;
            },

            checkDailyLogin: () => {
                const s = get();
                const today = todayStr();
                if (s.lastLoginDate === today) {
                    // Still call regenLives on each login check
                    get().regenLives();
                    return;
                }

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toISOString().slice(0, 10);

                let newStreak: number;
                if (s.lastLoginDate === yStr || s.streakFreezeActive) {
                    newStreak = s.loginStreak + 1;
                } else {
                    newStreak = 1;
                }

                set({
                    loginStreak: newStreak,
                    longestStreak: Math.max(s.longestStreak, newStreak),
                    lastLoginDate: today,
                    streakFreezeActive: false,
                });

                if (newStreak >= 3) get().earnBadge('streak_3');
                if (newStreak >= 7) get().earnBadge('streak_7');
                if (newStreak >= 30) get().earnBadge('scholar_30');

                // Refresh daily challenge on new day
                const challenge = s.dailyChallenge;
                if (!challenge || challenge.date !== today) {
                    set({ dailyChallenge: getTodayChallenge() });
                }

                get().regenLives();
            },

            consumeLife: () => {
                const s = get();
                if (s.dailyLives <= 0) return;
                set({ dailyLives: s.dailyLives - 1 });
            },

            regenLives: () => {
                const s = get();
                if (s.dailyLives >= 5) return;
                const now = Date.now();
                const hourMs = 60 * 60 * 1000;
                const elapsed = now - s.lastRegenTime;
                const livesToRegen = Math.min(Math.floor(elapsed / hourMs), 5 - s.dailyLives);
                if (livesToRegen <= 0) return;
                set({
                    dailyLives: Math.min(s.dailyLives + livesToRegen, 5),
                    lastRegenTime: s.lastRegenTime + livesToRegen * hourMs,
                });
            },

            refillLives: (amount) => {
                set((s) => ({ dailyLives: Math.min(s.dailyLives + amount, 5) }));
            },

            getDailyChallenge: () => {
                const s = get();
                const today = todayStr();
                if (s.dailyChallenge && s.dailyChallenge.date === today) return s.dailyChallenge;
                const fresh = getTodayChallenge();
                set({ dailyChallenge: fresh });
                return fresh;
            },

            updateDailyChallenge: (event) => {
                const s = get();
                const challenge = s.getDailyChallenge();
                if (challenge.completed) return;

                let newProgress = challenge.progress;
                let completed = false;

                if (challenge.type === 1 && event === 'level_no_loss') { newProgress = 1; completed = true; }
                if (challenge.type === 2 && event === 'correct_answer') {
                    newProgress = Math.min(challenge.progress + 1, 10);
                    completed = newProgress >= 10;
                }
                if (challenge.type === 3 && event === 'streak_5') { newProgress = 1; completed = true; }
                if (challenge.type === 4 && event === 'level_fast') { newProgress = 1; completed = true; }

                const updated = { ...challenge, progress: newProgress, completed };
                set({ dailyChallenge: updated });

                if (completed) {
                    const challengeDef = CHALLENGE_TYPES.find((c) => c.type === challenge.type);
                    if (challengeDef) {
                        if (challengeDef.xpReward > 0) get().addXP(challengeDef.xpReward);
                        if (challengeDef.gemReward > 0) get().addGems(challengeDef.gemReward);
                    }
                }
            },

            resetProgress: () => {
                set({
                    totalXP: 0,
                    gems: 50,
                    totalGemsEarned: 0,
                    loginStreak: 0,
                    longestStreak: 0,
                    lastLoginDate: '',
                    dailyXP: 0,
                    dailyDate: todayStr(),
                    dailyLives: 5,
                    lastRegenTime: Date.now(),
                    dailyChallenge: null,
                    consecutiveQuickAnswers: 0,
                    dailyHistory: [],
                    shopItems: DEFAULT_SHOP_ITEMS,
                    badges: DEFAULT_BADGES,
                    doubleXPActive: false,
                    streakFreezeActive: false,
                    xpBoostExpiresAt: 0,
                    hintActive: false,
                    secondChanceActive: false,
                    timeExtendActive: false,
                });
            },
        }),
        { name: 'unmath-user' }
    )
);
