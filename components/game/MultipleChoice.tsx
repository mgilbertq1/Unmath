'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface MultipleChoiceProps {
    options: string[];
    onSelect: (option: string) => void;
    disabled: boolean;
    selectedAnswer: string | null;
    correctAnswer: string;
    checked: boolean;
    subject: 'math' | 'pkn';
}

export default function MultipleChoice({
    options,
    onSelect,
    disabled,
    selectedAnswer,
    correctAnswer,
    checked,
    subject,
}: MultipleChoiceProps) {
    const [flippedIdx, setFlippedIdx] = useState<number | null>(null);

    const accentColor = subject === 'math' ? '#6366f1' : '#10b981';
    const accentColorLight = subject === 'math' ? '#818cf8' : '#34d399';

    return (
        <div className="grid grid-cols-1 gap-3">
            {options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const showCorrect = checked && opt === correctAnswer;
                const showWrong = checked && isSelected && opt !== correctAnswer;
                const isFlipped = flippedIdx === idx;

                let bgStyle: React.CSSProperties = {
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.08)',
                };
                let textClass = 'text-white/90';
                let letterBg = 'rgba(255,255,255,0.08)';
                let letterText = 'text-white/50';

                if (showCorrect) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
                        border: '2px solid rgba(16,185,129,0.4)',
                        boxShadow: '0 4px 24px rgba(16,185,129,0.2)',
                    };
                    textClass = 'text-emerald-300';
                    letterBg = 'rgba(16,185,129,0.3)';
                    letterText = 'text-emerald-300';
                } else if (showWrong) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
                        border: '2px solid rgba(239,68,68,0.4)',
                        boxShadow: '0 4px 24px rgba(239,68,68,0.2)',
                    };
                    textClass = 'text-red-300';
                    letterBg = 'rgba(239,68,68,0.3)';
                    letterText = 'text-red-300';
                } else if (isSelected) {
                    bgStyle = {
                        background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
                        border: `2px solid ${accentColor}66`,
                        boxShadow: `0 4px 24px ${accentColor}22`,
                    };
                    textClass = subject === 'math' ? 'text-indigo-300' : 'text-emerald-300';
                    letterBg = `${accentColor}33`;
                    letterText = subject === 'math' ? 'text-indigo-300' : 'text-emerald-300';
                }

                return (
                    <motion.button
                        key={opt}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        disabled={disabled}
                        onClick={() => {
                            if (!disabled) {
                                setFlippedIdx(idx);
                                setTimeout(() => setFlippedIdx(null), 300);
                                onSelect(opt);
                            }
                        }}
                        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!disabled ? { scale: 0.97 } : {}}
                        className={`
                            relative w-full rounded-2xl py-4 px-5 font-semibold
                            transition-all duration-200
                            disabled:cursor-not-allowed
                            ${textClass}
                        `}
                        style={{
                            ...bgStyle,
                            minHeight: '56px',
                            transform: isFlipped ? 'rotateY(10deg)' : 'rotateY(0deg)',
                            perspective: '600px',
                        }}
                    >
                        <span className="flex items-center gap-3">
                            <span className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                                ${letterText}
                            `} style={{ background: letterBg }}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-left flex-1">{opt}</span>
                            {showCorrect && <span>✓</span>}
                            {showWrong && <span>✕</span>}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
