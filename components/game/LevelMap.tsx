'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { getLevelDefs } from '@/lib/levels/level-definitions';
import { Subject, LevelState } from '@/lib/types';
import LevelNode from './LevelNode';

interface LevelMapProps {
    subject: Subject;
}

export default function LevelMap({ subject }: LevelMapProps) {
    const router = useRouter();
    const { levels } = useGameStore();
    const { totalXP, loginStreak, gems } = useUserStore();
    const levelDefs = getLevelDefs(subject);
    const levelStates: LevelState[] = levels[subject];

    const completedCount = levelStates.filter((l) => l.status === 'completed').length;
    const allStars = levelStates.reduce((s, l) => s + l.bestStars, 0);

    const isMath = subject === 'math';
    const accentColor = isMath ? '#6366f1' : '#10b981';
    const accentLight = isMath ? '#818cf8' : '#34d399';

    const handlePlay = (levelId: number) => {
        router.push(`/game/${subject}?level=${levelId}`);
    };

    return (
        <div className="min-h-screen relative" style={{
            background: isMath
                ? 'linear-gradient(180deg, #1e1b6a 0%, #13113a 40%, #0f0d23 100%)'
                : 'linear-gradient(180deg, #064e3b 0%, #0a2e21 40%, #0f0d23 100%)',
        }}>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: isMath
                    ? 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)'
                    : 'radial-gradient(circle, rgba(16,185,129,0.04) 1px, transparent 1px)',
                backgroundSize: isMath ? '40px 40px' : '30px 30px',
            }} />

            <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push('/')}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        ←
                    </motion.button>
                    <div className="flex-1">
                        <h1 className="text-xl font-extrabold text-white">
                            {isMath ? '📐 Matematika' : '🏛️ PPKn'}
                        </h1>
                        <p className="text-sm text-white/30">{completedCount}/{levelDefs.length} level selesai</p>
                    </div>
                </div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-8 flex-wrap"
                >
                    {[
                        { icon: '⭐', label: `${totalXP} XP`, bg: `${accentColor}15`, border: `${accentColor}25`, color: accentLight },
                        { icon: '★', label: `${allStars} Bintang`, bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
                        { icon: '🔥', label: `${loginStreak} Streak`, bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', color: '#fca5a5' },
                        { icon: '💎', label: `${gems}`, bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', color: '#c4b5fd' },
                    ].map((s) => (
                        <span key={s.label} className="glass-pill px-3 py-1.5 text-xs font-bold flex items-center gap-1"
                            style={{ background: s.bg, borderColor: s.border, color: s.color }}
                        >
                            {s.icon} {s.label}
                        </span>
                    ))}
                </motion.div>

                {/* Level nodes with SVG path */}
                <div className="relative flex flex-col items-center gap-10">
                    {/* Connecting line */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        preserveAspectRatio="none"
                        style={{ zIndex: 0 }}
                    >
                        <defs>
                            <linearGradient id={`line-grad-${subject}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        {levelDefs.map((_, idx) => {
                            if (idx === levelDefs.length - 1) return null;
                            const isEven = idx % 2 === 0;
                            const nextIsEven = (idx + 1) % 2 === 0;
                            const y1 = idx * 160 + 60;
                            const y2 = (idx + 1) * 160 + 60;
                            const x1 = isEven ? '50%' : (idx % 4 === 1 ? '30%' : '70%');
                            const x2 = nextIsEven ? '50%' : ((idx + 1) % 4 === 1 ? '30%' : '70%');
                            return (
                                <line
                                    key={idx}
                                    x1={x1} y1={y1}
                                    x2={x2} y2={y2}
                                    stroke={`url(#line-grad-${subject})`}
                                    strokeWidth="2"
                                    strokeDasharray="8 8"
                                />
                            );
                        })}
                    </svg>

                    {levelDefs.map((def, idx) => {
                        const state = levelStates.find((s) => s.id === def.id) || {
                            id: def.id,
                            status: 'locked' as const,
                            bestStars: 0,
                            bestXP: 0,
                        };

                        const zigzag = idx % 4 === 0 ? 'center' : idx % 4 === 1 ? 'left' : idx % 4 === 2 ? 'center' : 'right';

                        return (
                            <motion.div
                                key={def.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring' }}
                                className={`relative z-10 w-full flex ${zigzag === 'left' ? 'justify-start pl-4' :
                                    zigzag === 'right' ? 'justify-end pr-4' :
                                        'justify-center'
                                    }`}
                            >
                                <LevelNode
                                    def={def}
                                    state={state}
                                    subject={subject}
                                    onPlay={handlePlay}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
