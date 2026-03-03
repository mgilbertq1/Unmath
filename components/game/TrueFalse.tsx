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
        { label: 'BENAR', value: 'true', icon: '✓', gradient: 'linear-gradient(135deg, #7A9E7E, #6D8299)' },
        { label: 'SALAH', value: 'false', icon: '✕', gradient: 'linear-gradient(135deg, #A47551, #D8A47F)' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {cards.map((card, idx) => {
                const isSelected = selectedAnswer === card.value;
                const isCorrectAnswer = card.value === correctAnswer;
                const showCorrect = checked && isCorrectAnswer;
                const showWrong = checked && isSelected && !isCorrectAnswer;

                let bgStyle: React.CSSProperties = {
                    background: 'var(--bg-surface-soft)',
                    border: '2px solid var(--border-subtle)',
                };
                let textClass = 'text-[var(--text-primary)]';

                if (showCorrect) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(122,158,126,0.25), rgba(122,158,126,0.1))',
                        border: '2px solid rgba(122,158,126,0.5)',
                        boxShadow: '0 8px 32px rgba(122,158,126,0.25)',
                    };
                    textClass = 'text-[var(--jawa-sage)]';
                } else if (showWrong) {
                    bgStyle = {
                        background: 'linear-gradient(135deg, rgba(164,117,81,0.25), rgba(164,117,81,0.1))',
                        border: '2px solid rgba(164,117,81,0.5)',
                        boxShadow: '0 8px 32px rgba(164,117,81,0.25)',
                    };
                    textClass = 'text-[var(--jawa-batik)]';
                } else if (isSelected) {
                    const accent = subject === 'math' ? '164,117,81' : '109,130,153';
                    bgStyle = {
                        background: `linear-gradient(135deg, rgba(${accent},0.2), rgba(${accent},0.08))`,
                        border: `2px solid rgba(${accent},0.4)`,
                        boxShadow: `0 8px 32px rgba(${accent},0.2)`,
                    };
                    textClass = subject === 'math' ? 'text-[var(--jawa-batik)]' : 'text-[var(--jawa-bluegray)]';
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
                            <span className="text-xs opacity-60 mt-1 text-[var(--text-secondary)]">Tap atau swipe</span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
