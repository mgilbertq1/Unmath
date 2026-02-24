'use client';

import { motion } from 'framer-motion';

interface TrueFalseProps {
    onSelect: (value: string) => void;
    disabled: boolean;
    selectedAnswer: string | null;
    correctAnswer: string;
    checked: boolean;
    subject: 'math' | 'pkn';
}

export default function TrueFalse({
    onSelect,
    disabled,
    selectedAnswer,
    correctAnswer,
    checked,
    subject,
}: TrueFalseProps) {
    const cards = [
        { label: 'BENAR', value: 'true', icon: '✓', gradient: 'linear-gradient(135deg, #059669, #10b981)' },
        { label: 'SALAH', value: 'false', icon: '✕', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {cards.map((card, idx) => {
                const isSelected = selectedAnswer === card.value;
                const isCorrectAnswer = card.value === correctAnswer;
                const showCorrect = checked && isCorrectAnswer;
                const showWrong = checked && isSelected && !isCorrectAnswer;

                let bgStyle: React.CSSProperties = {
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.08)',
                };
                let textClass = 'text-white/70';

                if (showCorrect) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.1))',
                        border: '2px solid rgba(16,185,129,0.5)',
                        boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
                    };
                    textClass = 'text-emerald-300';
                } else if (showWrong) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.1))',
                        border: '2px solid rgba(239,68,68,0.5)',
                        boxShadow: '0 8px 32px rgba(239,68,68,0.25)',
                    };
                    textClass = 'text-red-300';
                } else if (isSelected) {
                    const accent = subject === 'math' ? '99,102,241' : '16,185,129';
                    bgStyle = {
                        background: `linear-gradient(135deg, rgba(${accent},0.2), rgba(${accent},0.08))`,
                        border: `2px solid rgba(${accent},0.4)`,
                        boxShadow: `0 8px 32px rgba(${accent},0.2)`,
                    };
                    textClass = subject === 'math' ? 'text-indigo-300' : 'text-emerald-300';
                }

                return (
                    <motion.button
                        key={card.value}
                        initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
                        disabled={disabled}
                        onClick={() => !disabled && onSelect(card.value)}
                        whileHover={!disabled ? { scale: 1.05, y: -4 } : {}}
                        whileTap={!disabled ? { scale: 0.95 } : {}}
                        drag={!disabled ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                            if (Math.abs(info.offset.x) > 50 && !disabled) {
                                onSelect(card.value);
                            }
                        }}
                        className={`
                            relative rounded-3xl p-8 sm:p-10
                            flex flex-col items-center justify-center gap-4
                            cursor-pointer disabled:cursor-not-allowed
                            transition-all duration-200
                            ${textClass}
                        `}
                        style={{ ...bgStyle, minHeight: '140px' }}
                    >
                        <motion.span
                            className="text-5xl sm:text-6xl"
                            animate={showCorrect || showWrong ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {card.icon}
                        </motion.span>
                        <span className="text-lg sm:text-xl font-bold tracking-wider">
                            {card.label}
                        </span>
                        {!disabled && (
                            <span className="text-xs opacity-30 mt-1">Tap atau swipe</span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
