'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnswerRecord, Subject } from '@/lib/types';
import { TOTAL_LEVELS } from '@/lib/levels/level-definitions';
import { computeStars, calcGems } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';

interface ResultScreenProps {
    answers: AnswerRecord[];
    xp: number;
    lives: number;
    maxLives: number;
    streak: number;
    bestStreak: number;
    subject: Subject;
    levelId: number;
    stars: number;
    isGameOver: boolean;
    hasNextLevel: boolean;
    onRestart: () => void;
}

export default function ResultScreen({
    answers,
    xp,
    lives,
    maxLives,
    streak,
    bestStreak,
    subject,
    levelId,
    stars,
    isGameOver,
    hasNextLevel,
    onRestart,
}: ResultScreenProps) {
    const router = useRouter();
    const { soundEnabled } = useUserStore();
    const hasPlayedConfetti = useRef(false);
    const hasPlayedAudio = useRef(false);
    const [expandedPembahasan, setExpandedPembahasan] = useState<number | null>(null);
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    const isPerfect = correctCount === answers.length && answers.length > 0;
    const gemsEarned = calcGems(stars, isPerfect);
    const wrongAnswers = answers.map((a, i) => ({ ...a, index: i })).filter((a) => !a.isCorrect);
    const canProceed = stars >= 1;

    const isMath = subject === 'math';
    const accentColor = isMath ? '#6366f1' : '#10b981';
    const accentLight = isMath ? '#818cf8' : '#34d399';

    useEffect(() => {
        if (!isGameOver && stars >= 2 && !hasPlayedConfetti.current) {
            hasPlayedConfetti.current = true;
            const count = 200;
            const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

            function fire(particleRatio: number, opts: confetti.Options) {
                confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        } else if (isGameOver && soundEnabled && !hasPlayedAudio.current) {
            hasPlayedAudio.current = true;
            const audio = new Audio('/sounds/spin fail.mp3');
            audio.play().catch(e => console.warn('Game over audio prevented', e));
        }
    }, [isGameOver, stars, soundEnabled]);

    return (
        <div className="max-w-lg mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="rounded-3xl p-6 sm:p-8"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: isGameOver
                        ? '2px solid rgba(239,68,68,0.2)'
                        : `2px solid ${accentColor}25`,
                    boxShadow: isGameOver
                        ? '0 8px 48px rgba(239,68,68,0.1)'
                        : `0 8px 48px ${accentColor}15`,
                }}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="text-5xl mb-3"
                    >
                        {isGameOver ? '😢' : stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👍'}
                    </motion.p>
                    <h2 className={`text-2xl font-extrabold ${isGameOver ? 'text-red-300' : 'text-white'}`}>
                        {isGameOver ? 'Game Over!' : stars === 3 ? 'Sempurna!' : 'Level Selesai!'}
                    </h2>
                    <p className="text-sm text-white/40 mt-1">Level {levelId}</p>
                </div>

                {/* 0-star gate warning */}
                {!isGameOver && stars === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl p-4 mb-5 text-center"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                        <p className="text-2xl mb-1">⚠️</p>
                        <p className="font-bold text-red-300 text-sm">Nilai &lt; 60% — Wajib Ulang Level Ini!</p>
                        <p className="text-xs text-white/40 mt-1">Selesaikan level dengan ≥60% untuk melanjutkan</p>
                    </motion.div>
                )}

                {/* Stars */}
                {!isGameOver && (
                    <div className="flex justify-center gap-3 mb-6">
                        {[1, 2, 3].map((s) => (
                            <motion.span
                                key={s}
                                className="text-4xl"
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.4 + s * 0.15, type: 'spring', stiffness: 300 }}
                                style={{
                                    filter: s <= stars ? 'drop-shadow(0 0 12px rgba(245,158,11,0.6))' : 'none',
                                    opacity: s <= stars ? 1 : 0.15,
                                }}
                            >
                                {s <= stars ? '⭐' : '★'}
                            </motion.span>
                        ))}
                    </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: '✅', label: 'Benar', value: `${correctCount}/${answers.length}` },
                        { icon: '🎯', label: 'Akurasi', value: `${accuracy}%` },
                        { icon: '⭐', label: 'XP', value: `+${xp}` },
                        { icon: '💎', label: 'Gems', value: `+${gemsEarned}` },
                        { icon: '🔥', label: 'Best Streak', value: `${bestStreak}` },
                        { icon: '❤️', label: 'Nyawa', value: `${lives}/${maxLives}` },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="rounded-2xl p-3 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <p className="text-lg">{stat.icon}</p>
                            <p className="text-lg font-extrabold text-white">{stat.value}</p>
                            <p className="text-[10px] text-white/30 font-bold uppercase">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    {!isGameOver && hasNextLevel && canProceed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            onClick={() => router.push(`/game/${subject}?level=${levelId + 1}`)}
                            className="w-full py-3.5 rounded-2xl font-bold text-white"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                                boxShadow: `0 4px 24px ${accentColor}33`,
                            }}
                        >
                            Level Berikutnya →
                        </motion.button>
                    )}

                    <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.85 }}
                            onClick={() => router.push(`/game/${subject}?level=${levelId}`)}
                            className="w-full py-3.5 rounded-2xl font-bold text-white/70 hover:text-white transition-colors"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                            🔁 Pelajari Lagi
                        </motion.button>

                    <motion.button
                        className="w-full py-3.5 rounded-2xl font-bold text-white/60 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        🔄 Main Ulang
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        onClick={() => router.push(`/game/${subject}/levels`)}
                        className="w-full py-3 rounded-2xl font-semibold text-white/30 hover:text-white/50 transition-colors text-sm"
                    >
                        ← Kembali ke Peta
                    </motion.button>
                </div>
            </motion.div>

            {/* Pembahasan (wrong answers collapsible) – Task 3 */}
            {wrongAnswers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-6"
                >
                    <h3 className="text-base font-bold text-white/60 mb-3">📚 Pembahasan Soal Salah</h3>
                    <div className="space-y-2">
                        {wrongAnswers.map((a) => (
                            <div
                                key={a.index}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
                            >
                                <button
                                    className="w-full flex items-start gap-2.5 p-3.5 text-left"
                                    onClick={() => setExpandedPembahasan(expandedPembahasan === a.index ? null : a.index)}
                                >
                                    <span className="text-sm mt-0.5 shrink-0">❌</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/70 font-medium text-sm line-clamp-2">{a.question}</p>
                                    </div>
                                    <span className="text-white/30 text-sm shrink-0 mt-0.5">{expandedPembahasan === a.index ? '▲' : '▼'}</span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {expandedPembahasan === a.index && (
                                        <motion.div
                                            key="pembahasan"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-3.5 pb-3.5 pt-0 space-y-2">
                                                <div className="rounded-xl p-2.5" style={{ background: 'rgba(239,68,68,0.08)' }}>
                                                    <p className="text-xs text-white/40">Jawabanmu:</p>
                                                    <p className="text-sm font-bold text-red-300">{a.given || '(Tidak menjawab)'}</p>
                                                </div>
                                                <div className="rounded-xl p-2.5" style={{ background: 'rgba(16,185,129,0.08)' }}>
                                                    <p className="text-xs text-white/40">Jawaban benar:</p>
                                                    <p className="text-sm font-bold text-emerald-300">{a.correct}</p>
                                                </div>
                                                {a.explanation && (
                                                    <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                        <p className="text-xs text-white/40 mb-1">💡 Penjelasan:</p>
                                                        <p className="text-xs text-white/60 leading-relaxed">{a.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Answer review */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6"
            >
                <h3 className="text-base font-bold text-white/50 mb-3">📝 Review Jawaban</h3>
                <div className="space-y-2">
                    {answers.map((a, i) => (
                        <div
                            key={i}
                            className="rounded-xl p-3.5 text-sm"
                            style={{
                                background: a.isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                                border: `1px solid ${a.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                            }}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-sm mt-0.5">{a.isCorrect ? '✅' : '❌'}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/70 font-medium">{a.question}</p>
                                    <p className="text-xs text-white/30 mt-1">
                                        Jawabanmu: <span className={a.isCorrect ? 'text-emerald-300' : 'text-red-300'}>{a.given}</span>
                                    </p>
                                    {!a.isCorrect && (
                                        <p className="text-xs text-white/30 mt-0.5">
                                            Jawaban benar: <span className="text-emerald-300">{a.correct}</span>
                                        </p>
                                    )}
                                    <p className="text-xs text-white/25 mt-1">{a.explanation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
