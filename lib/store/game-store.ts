'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, AnswerRecord, Subject, LevelState, LevelProgress, LeaderboardEntry } from '../types';
import { TOTAL_LEVELS } from '../levels/level-definitions';

/* ─── helpers ─────────────────────────────────────────────────── */

function makeLevelStates(): LevelState[] {
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
        id: i + 1,
        status: i === 0 ? 'available' : 'locked',
        bestStars: 0,
        bestXP: 0,
    })) as LevelState[];
}

function shuffleWithTypeVariety(questions: Question[]): Question[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 2; i < shuffled.length; i++) {
        if (
            shuffled[i].type === shuffled[i - 1].type &&
            shuffled[i].type === shuffled[i - 2].type
        ) {
            for (let j = i + 1; j < shuffled.length; j++) {
                if (shuffled[j].type !== shuffled[i].type) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    break;
                }
            }
        }
    }
    return shuffled;
}

/** Task 2: Updated star thresholds — 85/70/60 */
function calcStars(correct: number, total: number): number {
    if (total === 0) return 0;
    const pct = correct / total;
    if (pct >= 0.85) return 3;
    if (pct >= 0.70) return 2;
    if (pct >= 0.60) return 1;
    return 0;   // < 60% → wajib ulang
}

/** Helper: compute gems earned from stars + perfect run bonus (Task 8) */
export function calcGems(stars: number, isPerfect: boolean): number {
    const base = stars >= 3 ? 20 : stars >= 2 ? 12 : stars >= 1 ? 5 : 0;
    const bonus = isPerfect ? 10 : 0;
    return base + bonus;
}

/* ─── types ────────────────────────────────────────────────────── */

interface GameStore {
    // ── Persistent: level progress ──────────────────────────────
    levels: LevelProgress;

    // ── Persistent: leaderboard per level ───────────────────────
    leaderboard: Record<string, LeaderboardEntry[]>;

    // ── Session: in-game state ───────────────────────────────────
    subject: Subject | null;
    currentLevelId: number | null;
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
    sessionStartTime: number;

    // ── Actions ──────────────────────────────────────────────────
    startGame: (subject: Subject, levelId: number, questions: Question[], initialLives: number) => void;
    answerQuestion: (given: string | string[], quickAnswer?: boolean) => boolean;
    addLeaderboardEntry: (subject: Subject, levelId: number, entry: LeaderboardEntry) => void;
    nextQuestion: () => void;
    skipQuestion: () => void;
    resetGame: () => void;
    /** Called after a level completes. Unlocks next level if stars >= 1. */
    unlockNextLevel: (subject: Subject, completedLevelId: number, stars: number) => void;
    /** Hard-reset all level progress (dev / debug) */
    resetAllProgress: () => void;
}

/* ─── initial session state ────────────────────────────────────── */

const initialSession = {
    subject: null as Subject | null,
    currentLevelId: null as number | null,
    questions: [] as Question[],
    currentIndex: 0,
    answers: [] as AnswerRecord[],
    xp: 0,
    lives: 5,
    maxLives: 5,
    streak: 0,
    bestStreak: 0,
    isGameOver: false,
    isGameComplete: false,
    sessionStartTime: 0,
};

/* ─── store ────────────────────────────────────────────────────── */

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            // Persistent level progress — hydrated from localStorage
            levels: {
                math: makeLevelStates(),
                pkn: makeLevelStates(),
            },

            leaderboard: {},

            // Session (also persisted so page refresh mid-game works)
            ...initialSession,

            startGame: (subject, levelId, questions, initialLives) => {
                const shuffled = shuffleWithTypeVariety(questions);
                set({
                    subject,
                    currentLevelId: levelId,
                    questions: shuffled,
                    currentIndex: 0,
                    answers: [],
                    xp: 0,
                    lives: initialLives,
                    maxLives: 5,
                    streak: 0,
                    bestStreak: 0,
                    isGameOver: false,
                    isGameComplete: false,
                    sessionStartTime: Date.now(),
                });
            },

            answerQuestion: (given, quickAnswer = false) => {
                const { questions, currentIndex, streak, bestStreak, xp, lives } = get();
                const question = questions[currentIndex];
                if (!question) return false;

                let isCorrect = false;
                if (Array.isArray(question.answer)) {
                    if (Array.isArray(given)) {
                        isCorrect =
                            given.length === question.answer.length &&
                            given.every((g, i) => g === (question.answer as string[])[i]);
                    }
                } else {
                    const givenStr = Array.isArray(given) ? given[0] : given;
                    isCorrect =
                        givenStr.toLowerCase().trim() ===
                        (question.answer as string).toLowerCase().trim();
                }

                const newStreak = isCorrect ? streak + 1 : 0;
                const streakMultiplier = isCorrect ? 1 + Math.floor(streak / 3) * 0.5 : 0;
                // Task 5: +50% XP if answered within first 10 seconds
                const quickMultiplier = (isCorrect && quickAnswer) ? 1.5 : 1;
                const earnedXP = isCorrect ? Math.round(question.points * streakMultiplier * quickMultiplier) : 0;
                const newLives = isCorrect ? lives : lives - 1;

                const record: AnswerRecord = {
                    questionId: question.id,
                    question: question.question,
                    given,
                    correct: question.answer,
                    isCorrect,
                    explanation: question.explanation,
                    points: earnedXP,
                };

                set({
                    answers: [...get().answers, record],
                    xp: xp + earnedXP,
                    lives: newLives,
                    streak: newStreak,
                    bestStreak: Math.max(bestStreak, newStreak),
                    isGameOver: newLives <= 0,
                });

                return isCorrect;
            },

            nextQuestion: () => {
                const { currentIndex, questions } = get();
                if (currentIndex >= questions.length - 1) {
                    set({ isGameComplete: true });
                } else {
                    set({ currentIndex: currentIndex + 1 });
                }
            },

            skipQuestion: () => {
                const { currentIndex, questions } = get();
                const question = questions[currentIndex];
                if (!question) return;

                const record: AnswerRecord = {
                    questionId: question.id,
                    question: question.question,
                    given: '',
                    correct: question.answer,
                    isCorrect: false,
                    explanation: question.explanation,
                    points: 0,
                };

                set({ answers: [...get().answers, record], streak: 0 });
                get().nextQuestion();
            },

            unlockNextLevel: (subject, completedLevelId, stars) => {
                const state = get();
                const levelsCopy: LevelProgress = {
                    math: state.levels.math.map((l) => ({ ...l })),
                    pkn: state.levels.pkn.map((l) => ({ ...l })),
                };
                const subjectLevels = levelsCopy[subject];

                // Update best stars/XP for completed level
                const completed = subjectLevels.find((l) => l.id === completedLevelId);
                if (completed) {
                    if (stars > completed.bestStars) completed.bestStars = stars;
                    if (state.xp > completed.bestXP) completed.bestXP = state.xp;
                    if (completed.status !== 'completed') completed.status = 'completed';
                }

                // Task 2: Unlock next level ONLY if stars >= 1 (≥ 60% correct)
                if (stars >= 1) {
                    const next = subjectLevels.find((l) => l.id === completedLevelId + 1);
                    if (next && next.status === 'locked') {
                        next.status = 'available';
                    }
                }

                set({ levels: levelsCopy });
            },

            addLeaderboardEntry: (subject, levelId, entry) => {
                const key = `${subject}-${levelId}`;
                const current = get().leaderboard[key] ?? [];
                const updated = [...current, entry]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
                set({ leaderboard: { ...get().leaderboard, [key]: updated } });
            },

            resetGame: () => {
                set(initialSession);
            },

            resetAllProgress: () => {
                set({
                    levels: {
                        math: makeLevelStates(),
                        pkn: makeLevelStates(),
                    },
                    leaderboard: {},
                    ...initialSession,
                });
            },
        }),
        {
            name: 'unmath-progress',
            // Only persist level progress + session state
            // (questions array is large and recreatable, skip it)
            partialize: (state) => ({
                levels: state.levels,
                leaderboard: state.leaderboard,
                subject: state.subject,
                currentLevelId: state.currentLevelId,
                xp: state.xp,
                lives: state.lives,
                streak: state.streak,
                bestStreak: state.bestStreak,
                currentIndex: state.currentIndex,
                answers: state.answers,
                isGameOver: state.isGameOver,
                isGameComplete: state.isGameComplete,
                sessionStartTime: state.sessionStartTime,
            }),
        }
    )
);

/** Standalone helper: compute stars from an answer set */
export function computeStars(answers: AnswerRecord[]): number {
    const correct = answers.filter((a) => a.isCorrect).length;
    return calcStars(correct, answers.length);
}
