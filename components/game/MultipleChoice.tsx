'use client';

import { motion } from 'framer-motion';

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
    const accentColor = subject === 'math' ? '#A47551' : '#6D8299';

    return (
        <div className="flex flex-col gap-2.5">
            {options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const showCorrect = checked && opt === correctAnswer;
                const showWrong = checked && isSelected && opt !== correctAnswer;
                const letter = String.fromCharCode(65 + idx);

                let containerStyle: React.CSSProperties = {
                    background: 'rgba(255,248,235,0.04)',
                    border: '1.5px solid rgba(198,167,94,0.15)',
                };
                let letterStyle: React.CSSProperties = {
                    background: 'rgba(198,167,94,0.1)',
                    border: '1px solid rgba(198,167,94,0.2)',
                    color: '#C6A75E',
                };
                let leftBarColor = 'transparent';

                if (showCorrect) {
                    containerStyle = {
                        background: 'rgba(122,158,126,0.13)',
                        border: '1.5px solid rgba(122,158,126,0.4)',
                        boxShadow: '0 0 18px rgba(122,158,126,0.22), -4px 0 0 #7A9E7E',
                    };
                    letterStyle = { background: '#7A9E7E', color: '#fff', border: '1px solid #7A9E7E' };
                    leftBarColor = '#7A9E7E';
                } else if (showWrong) {
                    containerStyle = {
                        background: 'rgba(224,90,90,0.1)',
                        border: '1.5px solid rgba(224,90,90,0.38)',
                        boxShadow: '0 0 18px rgba(224,90,90,0.18), -4px 0 0 #E05A5A',
                    };
                    letterStyle = { background: '#E05A5A', color: '#fff', border: '1px solid #E05A5A' };
                    leftBarColor = '#E05A5A';
                } else if (isSelected) {
                    containerStyle = {
                        background: `rgba(198,167,94,0.1)`,
                        border: `1.5px solid rgba(198,167,94,0.5)`,
                        boxShadow: `0 4px 20px rgba(164,117,81,0.22), -4px 0 0 #C6A75E`,
                    };
                    letterStyle = { background: accentColor, color: '#1A0903', border: `1px solid ${accentColor}` };
                    leftBarColor = '#C6A75E';
                }

                return (
                    <motion.button
                        key={opt}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07, duration: 0.3 }}
                        disabled={disabled}
                        onClick={() => !disabled && onSelect(opt)}
                        whileHover={!disabled && !checked ? { x: 5, boxShadow: `0 4px 20px rgba(0,0,0,0.3), -3px 0 0 ${accentColor}` } : {}}
                        whileTap={!disabled && !checked ? { scale: 0.98 } : {}}
                        className="flex items-center gap-3 w-full text-left"
                        style={{
                            ...containerStyle,
                            padding: '13px 16px',
                            borderRadius: 14,
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                        }}
                    >
                        {/* Letter badge */}
                        <span
                            className="flex items-center justify-center font-bold shrink-0"
                            style={{
                                ...letterStyle,
                                width: 32, height: 32,
                                borderRadius: 9,
                                fontSize: 12,
                                transition: 'all 0.2s',
                            }}
                        >
                            {letter}
                        </span>

                        {/* Option text */}
                        <span
                            className="flex-1 font-semibold"
                            style={{ fontSize: 14, color: '#E8D8C0' }}
                        >
                            {opt}
                        </span>

                        {/* Result icon */}
                        {showCorrect && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ fontSize: 16, color: '#7A9E7E' }}
                            >
                                ✓
                            </motion.span>
                        )}
                        {showWrong && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ fontSize: 16, color: '#E05A5A' }}
                            >
                                ✕
                            </motion.span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
