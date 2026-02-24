'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface FeedbackOverlayProps {
    show: boolean;
    isCorrect: boolean;
    explanation: string;
    points: number;
    streak: number;
    onContinue: () => void;
}

const correctComments = [
    'Mantap! Kamu jenius! 🧠',
    'Luar biasa! Terus pertahankan! 🔥',
    'Benar sekali! Kamu makin jago! 💪',
    'Sempurna! Jawaban yang tepat! ⭐',
    'Keren banget! Lanjutkan! 🚀',
    'Wah hebat! Otak encer! 🎯',
    'Top markotop! Benar! 🏆',
    'Excellent! Tidak salah! 💯',
];

const wrongComments = [
    'Hmm, belum tepat. Coba lagi! 💡',
    'Hampir! Pelajari lagi ya! 📚',
    'Tidak apa-apa, semangat! 💪',
    'Salah kali ini, tapi jangan menyerah! 🌟',
    'Oops! Lihat penjelasannya ya! 🔍',
    'Jangan sedih, ini proses belajar! 🌱',
];

export default function FeedbackOverlay({
    show,
    isCorrect,
    explanation,
    points,
    streak,
    onContinue,
}: FeedbackOverlayProps) {
    const hasPlayedConfetti = useRef(false);

    useEffect(() => {
        if (show && isCorrect && !hasPlayedConfetti.current) {
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
        }

        if (!show) {
            hasPlayedConfetti.current = false;
        }
    }, [show, isCorrect]);

    const randomComment = isCorrect
        ? correctComments[Math.floor(Math.random() * correctComments.length)]
        : wrongComments[Math.floor(Math.random() * wrongComments.length)];

    const bgColor = isCorrect
        ? 'rgba(16,185,129,0.12)'
        : 'rgba(239,68,68,0.12)';
    const borderColor = isCorrect
        ? 'rgba(16,185,129,0.25)'
        : 'rgba(239,68,68,0.25)';

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="mt-6 rounded-2xl p-5 sm:p-6"
                    style={{
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    {/* Comment */}
                    <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`text-lg font-bold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}
                    >
                        {randomComment}
                    </motion.p>

                    {/* Points & Streak */}
                    {isCorrect && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 mt-2"
                        >
                            <span className="px-3 py-1 rounded-full text-sm font-bold"
                                style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}
                            >
                                +{points} XP
                            </span>
                            {streak > 1 && (
                                <span className="px-3 py-1 rounded-full text-sm font-bold"
                                    style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}
                                >
                                    🔥 Streak x{streak}
                                </span>
                            )}
                        </motion.div>
                    )}

                    {/* Explanation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3"
                    >
                        <p className="text-sm text-white/50">
                            <span className="font-semibold text-white/70">Penjelasan:</span> {explanation}
                        </p>
                    </motion.div>

                    {/* Continue button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={onContinue}
                        className="mt-4 w-full py-3.5 rounded-2xl font-bold text-white transition-all duration-200"
                        style={{
                            background: isCorrect
                                ? 'linear-gradient(135deg, #059669, #10b981)'
                                : 'linear-gradient(135deg, #dc2626, #ef4444)',
                            boxShadow: isCorrect
                                ? '0 4px 24px rgba(16,185,129,0.3)'
                                : '0 4px 24px rgba(239,68,68,0.3)',
                        }}
                    >
                        LANJUT
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
