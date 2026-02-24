'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface TypeAnswerProps {
    onSubmit: (value: string) => void;
    disabled: boolean;
    checked: boolean;
    correctAnswer: string;
    givenAnswer: string;
    subject: 'math' | 'pkn';
}

export default function TypeAnswer({
    onSubmit,
    disabled,
    checked,
    correctAnswer,
    givenAnswer,
    subject,
}: TypeAnswerProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const isCorrect = checked && givenAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    const isWrong = checked && !isCorrect;

    const accentColor = subject === 'math' ? '#6366f1' : '#10b981';

    const handleSubmit = () => {
        if (value.trim().length > 0) {
            onSubmit(value.trim());
        }
    };

    let inputStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(255,255,255,0.1)',
        color: '#f1f5f9',
    };

    if (isCorrect) {
        inputStyle = {
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid rgba(16,185,129,0.4)',
            color: '#34d399',
        };
    } else if (isWrong) {
        inputStyle = {
            background: 'rgba(239,68,68,0.1)',
            border: '2px solid rgba(239,68,68,0.4)',
            color: '#fca5a5',
        };
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={disabled ? givenAnswer : value}
                    disabled={disabled}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                    }}
                    className="w-full rounded-2xl py-4 px-5 text-lg font-semibold transition-all duration-300 focus:outline-none disabled:cursor-not-allowed placeholder:text-white/20"
                    style={{
                        ...inputStyle,
                        backdropFilter: 'blur(12px)',
                    }}
                    placeholder="Ketik jawaban di sini..."
                />

                {/* Real-time char count */}
                {!disabled && value.trim().length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${accentColor}22`, color: accentColor }}
                    >
                        <span className="text-sm font-bold">{value.trim().length}</span>
                    </motion.div>
                )}

                {/* Correct/wrong indicator */}
                {checked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
                    >
                        {isCorrect ? '✓' : '✕'}
                    </motion.div>
                )}
            </div>

            {!checked && !disabled && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleSubmit}
                    disabled={value.trim().length === 0}
                    className="w-full py-3.5 rounded-2xl font-bold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                        background: value.trim().length > 0
                            ? `linear-gradient(135deg, ${accentColor}, ${subject === 'math' ? '#818cf8' : '#34d399'})`
                            : 'rgba(255,255,255,0.08)',
                        boxShadow: value.trim().length > 0 ? `0 4px 24px ${accentColor}33` : 'none',
                    }}
                >
                    JAWAB
                </motion.button>
            )}
        </motion.div>
    );
}
