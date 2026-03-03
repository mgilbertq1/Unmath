export interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'type-answer';
    question: string;
    options?: string[];
    pairs?: { left: string; right: string }[];
    answer: string | string[];
    explanation: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnswerRecord {
    questionId: string;
    question: string;
    given: string | string[];
    correct: string | string[];
    isCorrect: boolean;
    explanation: string;
    points: number;
}

export type Subject = 'math' | 'pkn';

export type LevelStatus = 'locked' | 'available' | 'completed';

export interface LevelState {
    id: number;
    status: LevelStatus;
    bestStars: number;
    bestXP: number;
}

export type LevelProgress = {
    math: LevelState[];
    pkn: LevelState[];
};

export interface GameState {
    subject: Subject | null;
    questions: Question[];
    currentIndex: number;
    answers: AnswerRecord[];
    xp: number;
    lives: number;
    maxLives: number;
    streak: number;
    bestStreak: number;
    isGameOver: boolean;
    isGameComplete: boolean;
}

// ─── User Profile ────────────────────────────────────────────────
export interface DailyRecord {
    date: string;   // ISO date string 'YYYY-MM-DD'
    xp: number;
    levelsPlayed: number;
}

export type BadgeId =
    | 'first_win'
    | 'streak_3'
    | 'streak_7'
    | 'all_math'
    | 'all_pkn'
    | 'perfect_level'
    | 'speed_demon'
    | 'gem_spender'
    // NEW badges
    | 'math_master'
    | 'pkn_master'
    | 'no_mistake'
    | 'comeback'
    | 'scholar_30'
    | 'gem_hoarder'
    | 'all_clear';

export interface Badge {
    id: BadgeId;
    name: string;
    description: string;
    emoji: string;
    earned: boolean;
}

export type ShopItemId =
    | 'streak_freeze'
    | 'double_xp'
    | 'heart_refill'
    | 'dark_theme'
    // NEW shop items
    | 'hint'
    | 'time_extend'
    | 'second_chance'
    | 'xp_boost_24h';

export interface ShopItem {
    id: ShopItemId;
    name: string;
    description: string;
    emoji: string;
    price: number;          // gems
    owned: number;          // quantity owned
    maxStack: number;
}

// ─── Daily Lives ─────────────────────────────────────────────────
export interface DailyLivesState {
    dailyLives: number;         // 0-5
    lastRegenTime: number;      // Unix timestamp ms
}

// ─── Daily Challenge ──────────────────────────────────────────────
export type ChallengeType = 1 | 2 | 3 | 4;

export interface DailyChallenge {
    date: string;               // YYYY-MM-DD
    type: ChallengeType;
    progress: number;
    completed: boolean;
}

// ─── Leaderboard ──────────────────────────────────────────────────
export interface LeaderboardEntry {
    username: string;
    score: number;
    stars: number;
    date: string;
    timeSeconds: number;
}

// ─── Game Result (for badge check) ───────────────────────────────
export interface GameResult {
    subject: 'math' | 'pkn';
    levelId: number;
    stars: number;
    correctCount: number;
    totalQuestions: number;
    livesLeft: number;
    bestStreak: number;
    sessionTimeSeconds: number;
    allLevelsMath: { bestStars: number }[];
    allLevelsPkn: { bestStars: number }[];
}

// ─── Account Data ────────────────────────────────────────────────
export interface User {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: string;

    // Persisted Game Data
    totalXP: number;
    gems: number;
    avatar: string;
    loginStreak: number;
    longestStreak: number;
    lastLoginDate: string;
    dailyTarget: number;

    levels: LevelProgress;
    dailyHistory: DailyRecord[];
    badges: Badge[];
    shopItems: ShopItem[];
}
