'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, AnswerRecord, Subject, LevelState, LevelProgress } from '../types';
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

function calcStars(correct: number, total: number): number {
    if (total === 0) return 0;
    const pct = correct / total;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    if (pct >= 0.5) return 1;   // min 1 star = 50% correct (≥ 3/5 for 5-question levels)
    return 0;
}

/* ─── types ────────────────────────────────────────────────────── */

interface GameStore {
    // ── Persistent: level progress ──────────────────────────────
    levels: LevelProgress;

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

    // ── Actions ──────────────────────────────────────────────────
    startGame: (subject: Subject, levelId: number, questions: Question[]) => void;
    answerQuestion: (given: string | string[]) => boolean;
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

            // Session (also persisted so page refresh mid-game works)
            ...initialSession,

            startGame: (subject, levelId, questions) => {
                const shuffled = shuffleWithTypeVariety(questions);
                set({
                    subject,
                    currentLevelId: levelId,
                    questions: shuffled,
                    currentIndex: 0,
                    answers: [],
                    xp: 0,
                    lives: 5,
                    maxLives: 5,
                    streak: 0,
                    bestStreak: 0,
                    isGameOver: false,
                    isGameComplete: false,
                });
            },

            answerQuestion: (given) => {
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
                const earnedXP = isCorrect ? Math.round(question.points * streakMultiplier) : 0;
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

                // Unlock next level if stars >= 1
                if (stars >= 1) {
                    const next = subjectLevels.find((l) => l.id === completedLevelId + 1);
                    if (next && next.status === 'locked') {
                        next.status = 'available';
                    }
                }

                set({ levels: levelsCopy });
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
            }),
        }
    )
);

/** Standalone helper: compute stars from an answer set */
export function computeStars(answers: AnswerRecord[]): number {
    const correct = answers.filter((a) => a.isCorrect).length;
    return calcStars(correct, answers.length);
}
