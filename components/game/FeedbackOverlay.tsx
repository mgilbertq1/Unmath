'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
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

function hashSeed(seed: string, len: number) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return len > 0 ? h % len : 0;
}

export default function FeedbackOverlay({
    show, isCorrect, explanation, points, streak, onContinue,
}: FeedbackOverlayProps) {
    const hasConfetti = useRef(false);

    useEffect(() => {
        if (show && isCorrect && !hasConfetti.current) {
            hasConfetti.current = true;
            const c = 200;
            const def = { origin: { y: 0.7 }, zIndex: 9999 };
            const fire = (r: number, o: confetti.Options) =>
                confetti({ ...def, ...o, particleCount: Math.floor(c * r) });
            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
        if (!show) hasConfetti.current = false;
    }, [show, isCorrect]);

    const comment = useMemo(() => {
        const list = isCorrect ? correctComments : wrongComments;
        return list[hashSeed(`${isCorrect}-${explanation}-${points}`, list.length)];
    }, [isCorrect, explanation, points]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    style={{
                        marginTop: 12,
                        borderRadius: 16,
                        padding: '14px 16px',
                        ...(isCorrect ? {
                            background: 'rgba(122,158,126,0.15)',
                            border: '1px solid rgba(122,158,126,0.38)',
                        } : {
                            background: 'rgba(224,90,90,0.1)',
                            border: '1px solid rgba(224,90,90,0.32)',
                        }),
                    }}
                >
                    {/* Comment + XP row */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: 20 }}>{isCorrect ? '🎉' : '💡'}</span>
                            <p
                                className="font-bold leading-tight"
                                style={{
                                    fontSize: 14,
                                    color: isCorrect ? '#7A9E7E' : '#FF8A8A',
                                }}
                            >
                                {comment}
                            </p>
                        </div>
                        {isCorrect && points > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                                className="font-bold whitespace-nowrap shrink-0"
                                style={{
                                    fontSize: 12, padding: '3px 10px', borderRadius: 999,
                                    background: 'rgba(122,158,126,0.2)',
                                    color: '#7A9E7E',
                                    border: '1px solid rgba(122,158,126,0.35)',
                                }}
                            >
                                +{points} XP {streak > 1 ? `🔥×${streak}` : ''}
                            </motion.span>
                        )}
                    </div>

                    {/* Explanation */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 12, color: 'rgba(240,223,200,0.55)', marginTop: 8, lineHeight: 1.5 }}
                    >
                        <span style={{ color: 'rgba(240,223,200,0.75)', fontWeight: 600 }}>Penjelasan: </span>
                        {explanation}
                    </motion.p>

                    {/* Continue button */}
                    <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28 }}
                        onClick={onContinue}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-3 w-full font-bold uppercase"
                        style={{
                            padding: '13px 0',
                            borderRadius: 14,
                            fontSize: 13,
                            letterSpacing: '1px',
                            border: 'none',
                            cursor: 'pointer',
                            ...(isCorrect ? {
                                background: 'linear-gradient(135deg, #7A9E7E, #5A8E5E)',
                                color: '#fff',
                                boxShadow: '0 6px 20px rgba(122,158,126,0.35)',
                            } : {
                                background: 'linear-gradient(135deg, #8B5E3C, #A47551)',
                                color: '#F0DFA0',
                                boxShadow: '0 6px 20px rgba(164,117,81,0.35)',
                            }),
                        }}
                    >
                        Lanjut →
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
