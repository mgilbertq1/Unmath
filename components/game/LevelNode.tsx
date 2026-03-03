'use client';

import { motion } from 'framer-motion';
import { LevelState } from '@/lib/types';

interface LevelDef {
    id: number;
    title: string;
    emoji: string;
    description?: string;
}

interface LevelNodeProps {
    def: LevelDef;
    state: LevelState;
    subject: 'math' | 'pkn';
    onPlay: (levelId: number) => void;
}

export default function LevelNode({ def, state, subject, onPlay }: LevelNodeProps) {
    const isLocked = state.status === 'locked';
    const isAvailable = state.status === 'available';
    const isCompleted = state.status === 'completed';

    const isMath = subject === 'math';
    const accentColor = isMath ? '#A47551' : '#6D8299';
    const accentLight = isMath ? '#D8A47F' : '#7A9E7E';

    const stars = state.bestStars;

    // Ring gradient based on state
    let ringStyle: React.CSSProperties = {};
    let bgStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.65)',
        border: '3px solid rgba(164,117,81,0.18)',
    };

    if (isCompleted) {
        ringStyle = {
            background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
            padding: '3px',
            borderRadius: '50%',
        };
        bgStyle = {
            background: `${accentColor}15`,
            border: 'none',
            boxShadow: `0 8px 24px ${accentColor}33`,
        };
    } else if (isAvailable) {
        ringStyle = {
            background: `linear-gradient(135deg, ${accentColor}80, ${accentLight}80)`,
            padding: '3px',
            borderRadius: '50%',
        };
        bgStyle = {
            background: `${accentColor}10`,
            border: 'none',
        };
    }

    return (
        <div className="flex flex-col items-center gap-2 w-[120px]">
            {/* Node button */}
            <motion.button
                disabled={isLocked}
                onClick={() => !isLocked && onPlay(def.id)}
                whileHover={!isLocked ? { scale: 1.08, y: -4 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                className={`
                    relative flex items-center justify-center
                    transition-all duration-200
                    ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={isCompleted || isAvailable ? ringStyle : {}}
            >
                {/* Pulse glow for available */}
                {isAvailable && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `${accentColor}25` }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}

                <div
                    className="w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] rounded-full flex flex-col items-center justify-center transition-all duration-200"
                    style={bgStyle}
                >
                    {isLocked ? (
                        <span className="text-3xl opacity-40">🔒</span>
                    ) : (
                        <>
                            <span className="text-3xl sm:text-4xl">{def.emoji}</span>
                            <span className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                                Level {def.id}
                            </span>
                        </>
                    )}
                </div>
            </motion.button>

            {/* Title */}
            <p className={`text-xs font-bold text-center leading-tight ${isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                {def.title}
            </p>

            {/* Stars */}
            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-0.5"
                >
                    {[1, 2, 3].map((s) => (
                        <motion.span
                            key={s}
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: s * 0.1, type: 'spring', stiffness: 300 }}
                            className="text-lg"
                            style={{
                                filter: s <= stars ? 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' : 'none',
                                opacity: s <= stars ? 1 : 0.2,
                            }}
                        >
                            {s <= stars ? '⭐' : '★'}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* Available badge */}
            {isAvailable && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${accentColor}20`, color: accentColor, border: '1px solid rgba(164,117,81,0.2)' }}
                >
                    MAIN!
                </motion.span>
            )}
        </div>
    );
}
