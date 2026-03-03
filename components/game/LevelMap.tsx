'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { getLevelDefs } from '@/lib/levels/level-definitions';
import { Subject } from '@/lib/types';

interface LevelMapProps {
    subject: Subject;
}

/* ── Floating path dot ─────────────────────────────────────────── */
function PathDot({ left, top, delay }: { left: string; top: string; delay: number }) {
    return (
        <motion.div
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{ left, top, background: '#C6A75E', zIndex: 3 }}
            animate={{ opacity: [0.12, 0.6, 0.12] }}
            transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
    );
}

/* ── Wayang silhouette ── */
function WayanSilhouette({ align }: { align: 'left' | 'right' }) {
    const isRight = align === 'right';
    return (
        <div
            className={`fixed bottom-0 z-[2] pointer-events-none ${isRight ? 'right-[-40px]' : 'left-[-40px]'}`}
            style={{
                opacity: 0.18,
                filter: 'drop-shadow(0 0 20px rgba(198,167,94,0.3))',
                transform: isRight ? 'scaleX(-1)' : 'none',
                width: 320,
                height: 320,
                backgroundColor: '#C6A75E',
                maskImage: 'url(/wayang.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'bottom',
                WebkitMaskImage: 'url(/wayang.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'bottom',
            }}
        />
    );
}

export default function LevelMap({ subject }: LevelMapProps) {
    const router = useRouter();
    const { levels, leaderboard } = useGameStore();
    const { totalXP, loginStreak, gems } = useUserStore();
    const levelDefs = getLevelDefs(subject);
    const levelStates = levels[subject];
    const containerRef = useRef<HTMLDivElement>(null);

    const [lbLevel, setLbLevel] = useState<number | null>(null);
    const completedCount = levelStates.filter((l) => l.status === 'completed').length;
    const isMath = subject === 'math';
    const subjectLabel = isMath ? 'Matematika' : 'PPKn';
    const subjectEmoji = isMath ? '📐' : '🏛️';

    const handlePlay = (levelId: number) => {
        router.push(`/game/${subject}?level=${levelId}`);
    };

    // Zigzag alignment per node exactly mimicking mockup positions
    const positions: Array<'center' | 'left' | 'right'> = ['center', 'right', 'left', 'right', 'left'];
    const xMap = { center: 210, right: 285, left: 135 };
    // Node spacing
    const nodeSpacing = typeof window !== 'undefined' && window.innerWidth < 430 ? 145 : 160;
    const topPad = 60;
    const nodeY = levelDefs.map((_, i) => topPad + i * nodeSpacing);
    const totalSvgH = nodeY[nodeY.length - 1] + 120;

    // Build full winding bezier path
    const pathPoints = positions.slice(0, levelDefs.length).map((pos, i) => ({ x: xMap[pos], y: nodeY[i] }));
    const buildPath = (pts: { x: number; y: number }[]) => {
        if (pts.length < 2) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i], p2 = pts[i + 1];
            const cy = (p1.y + p2.y) / 2;
            d += ` C ${p1.x} ${cy}, ${p2.x} ${cy}, ${p2.x} ${p2.y}`;
        }
        return d;
    };
    const fullPath = buildPath(pathPoints);
    const completedPoints = pathPoints.slice(0, Math.min(completedCount + 1, levelDefs.length));
    const partialPath = buildPath(completedPoints);

    return (
        <div
            className="min-h-screen w-full relative overflow-x-hidden"
            style={{ background: '#0E0703' }}
        >
            {/* ── Batik tile background ── */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23C6A75E' stroke-width='0.5' opacity='0.14'%3E%3Cellipse cx='40' cy='20' rx='20' ry='12'/%3E%3Cellipse cx='40' cy='60' rx='20' ry='12'/%3E%3Cellipse cx='14' cy='40' rx='12' ry='20'/%3E%3Cellipse cx='66' cy='40' rx='12' ry='20'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px',
                    zIndex: 0,
                }}
            />
            {/* ── Radial dark overlay ── */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(164,117,81,0.14) 0%, rgba(8,4,1,0.82) 65%)',
                    zIndex: 1,
                }}
            />

            {/* ── Wayang silhouettes ── */}
            <WayanSilhouette align="left" />
            <WayanSilhouette align="right" />

            {/* ── Sticky Header ── */}
            <header
                className="fixed top-0 left-0 right-0 flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3"
                style={{
                    zIndex: 50,
                    background: 'rgba(14,7,3,0.88)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(198,167,94,0.18)',
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push('/')}
                    className="flex items-center justify-center shrink-0"
                    style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'rgba(198,167,94,0.1)',
                        border: '1px solid rgba(198,167,94,0.25)',
                        color: '#C6A75E', fontSize: 16,
                    }}
                >
                    ←
                </motion.button>

                <div className="flex-1 min-w-0">
                    <h1
                        className="leading-none truncate font-bold"
                        style={{
                            fontFamily: 'var(--font-cinzel, "Cinzel Decorative", serif)',
                            fontSize: 'clamp(14px, 4vw, 19px)',
                            color: '#E8D5A3',
                            textShadow: '0 0 20px rgba(198,167,94,0.4)',
                        }}
                    >
                        {subjectEmoji} {subjectLabel}
                    </h1>
                    <p style={{ fontSize: 10, color: 'rgba(198,167,94,0.5)', fontStyle: 'italic', marginTop: 1 }}>
                        {completedCount}/{levelDefs.length} level selesai
                    </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {[
                        { icon: '⭐', val: totalXP },
                        { icon: '🔥', val: loginStreak },
                        { icon: '💎', val: gems },
                    ].map((s) => (
                        <span
                            key={s.icon}
                            className="flex items-center gap-0.5 font-bold"
                            style={{
                                fontSize: 11,
                                padding: '4px 9px',
                                borderRadius: 999,
                                background: 'rgba(198,167,94,0.1)',
                                border: '1px solid rgba(198,167,94,0.2)',
                                color: '#E8D5A3',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {s.icon} {s.val}
                        </span>
                    ))}
                </div>
            </header>

            {/* ── Scrollable main content ── */}
            <main className="relative pt-[62px] pb-12" style={{ zIndex: 10 }}>
                {/* ── Path container — centered, max 420px, scales on small screens ── */}
                <div
                    ref={containerRef}
                    className="relative mx-auto select-none"
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        padding: '8px 16px 40px',
                    }}
                >
                    {/* Floating dots along path */}
                    {[...Array(8)].map((_, i) => (
                        <PathDot
                            key={i}
                            left={`${32 + (i % 3) * 14}%`}
                            top={`${4 + i * 11}%`}
                            delay={i * 0.3}
                        />
                    ))}

                    {/* SVG winding path — stretches to full container width on mobile */}
                    <div
                        className="relative mx-auto"
                        style={{
                            width: 'calc(100% - 32px)',
                            maxWidth: 388,
                            height: totalSvgH,
                            margin: '0 auto',
                        }}
                    >
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            viewBox={`0 0 420 ${totalSvgH}`}
                            preserveAspectRatio="xMidYMid meet"
                            style={{ zIndex: 1 }}
                        >
                            <defs>
                                <linearGradient id={`pg-${subject}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#C6A75E" stopOpacity="0.5" />
                                    <stop offset="70%" stopColor="#A47551" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#C6A75E" stopOpacity="0.06" />
                                </linearGradient>
                                <filter id={`gw-${subject}`}>
                                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            {/* Faint dashed full path */}
                            <path
                                d={fullPath}
                                stroke={`url(#pg-${subject})`}
                                strokeWidth="2.5"
                                fill="none"
                                strokeDasharray="10 8"
                            />
                            {/* Bright completed portion */}
                            {partialPath && completedCount > 0 && (
                                <path
                                    d={partialPath}
                                    stroke="#C6A75E"
                                    strokeWidth="3.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    filter={`url(#gw-${subject})`}
                                    opacity="0.65"
                                />
                            )}
                        </svg>

                        {/* Level nodes — absolutely positioned within SVG coordinate space */}
                        {levelDefs.map((def, idx) => {
                            const state = levelStates.find((s) => s.id === def.id) || {
                                id: def.id, status: 'locked' as const, bestStars: 0, bestXP: 0,
                            };
                            const pos = positions[idx] || 'center';
                            const nodeX = xMap[pos]; // 0-420 range
                            const nY = nodeY[idx];

                            // Convert SVG coords to % of container
                            const leftPct = (nodeX / 420) * 100;
                            const topPx = nY;

                            return (
                                <motion.div
                                    key={def.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.45, type: 'spring', stiffness: 180 }}
                                    className="absolute"
                                    style={{
                                        left: `${leftPct}%`,
                                        top: topPx,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 2,
                                        width: 130,
                                    }}
                                >
                                    <LevelNode
                                        def={def}
                                        state={state}
                                        subject={subject}
                                        onPlay={handlePlay}
                                        align={pos}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard Section – Task 9 */}
                {levelStates.some((l) => l.status === 'completed') && (
                    <div className="px-4 pb-8 mt-4" style={{ position: 'relative', zIndex: 10 }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-center mb-3"
                            style={{ color: 'rgba(198,167,94,0.55)' }}
                        >🏆 Papan Skor</h3>
                        <div className="flex gap-2 flex-wrap justify-center mb-3">
                            {levelDefs.map((def) => {
                                const state = levelStates.find((s, i) => i === def.id - 1);
                                if (state?.status !== 'completed') return null;
                                const key = `${subject}-${def.id}`;
                                const entries = leaderboard?.[key] ?? [];
                                return (
                                    <motion.button
                                        key={def.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setLbLevel(lbLevel === def.id ? null : def.id)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                                        style={{
                                            background: lbLevel === def.id ? 'rgba(198,167,94,0.22)' : 'rgba(198,167,94,0.07)',
                                            border: `1px solid ${lbLevel === def.id ? 'rgba(198,167,94,0.45)' : 'rgba(198,167,94,0.15)'}`,
                                            color: lbLevel === def.id ? '#E8D5A3' : 'rgba(198,167,94,0.5)',
                                        }}
                                    >
                                        Level {def.id} {entries.length > 0 ? `(${entries.length})` : ''}
                                    </motion.button>
                                );
                            })}
                        </div>
                        <AnimatePresence>
                            {lbLevel !== null && (() => {
                                const key = `${subject}-${lbLevel}`;
                                const entries = leaderboard?.[key] ?? [];
                                if (entries.length === 0) return (
                                    <motion.p
                                        key="empty"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-center text-xs"
                                        style={{ color: 'rgba(198,167,94,0.35)' }}
                                    >Belum ada data</motion.p>
                                );
                                return (
                                    <motion.div
                                        key="lb"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="rounded-2xl overflow-hidden"
                                        style={{ background: 'rgba(198,167,94,0.05)', border: '1px solid rgba(198,167,94,0.12)' }}
                                    >
                                        {entries.map((e, i) => {
                                            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                                            return (
                                                <div key={i} className="flex items-center gap-3 px-4 py-2.5"
                                                    style={{ borderBottom: i < entries.length - 1 ? '1px solid rgba(198,167,94,0.07)' : 'none' }}
                                                >
                                                    <span className="text-sm w-5 text-center">{medal}</span>
                                                    <span className="flex-1 text-xs font-bold" style={{ color: i < 3 ? '#E8D5A3' : 'rgba(198,167,94,0.6)' }}>{e.username}</span>
                                                    <span className="text-xs" style={{ color: 'rgba(198,167,94,0.5)' }}>{'⭐'.repeat(e.stars)}</span>
                                                    <span className="text-xs font-bold" style={{ color: 'var(--jawa-gold)' }}>{e.score} XP</span>
                                                    <span className="text-xs" style={{ color: 'rgba(198,167,94,0.3)' }}>{e.timeSeconds}s</span>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
}

/* ── Individual level node ──────────────────────────────────────── */
interface LevelNodeProps {
    def: { id: number; title: string; subtitle?: string; emoji: string };
    state: { status: string; bestStars: number; bestXP: number };
    subject: Subject;
    onPlay: (id: number) => void;
    align: 'center' | 'left' | 'right';
}

function LevelNode({ def, state, subject, onPlay, align }: LevelNodeProps) {
    const isLocked = state.status === 'locked';
    const isAvailable = state.status === 'available';
    const isCompleted = state.status === 'completed';
    const stars = state.bestStars;
    const xpEarned = state.bestXP;
    const textAlign = align === 'right' ? 'right' as const : align === 'left' ? 'left' as const : 'center' as const;

    return (
        <div className={`flex flex-col items-center gap-1`}>
            {/* Circle node */}
            <div className="relative">
                {/* Animated pulse ring for available */}
                {isAvailable && (
                    <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{ inset: -10, border: '2px solid rgba(216,164,127,0.5)' }}
                        animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.07, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
                {/* Spinning ornament ring */}
                {!isLocked && (
                    <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{ inset: -9, border: '1.5px dashed rgba(198,167,94,0.28)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    />
                )}
                {/* XP badge on completed */}
                {isCompleted && xpEarned > 0 && (
                    <div
                        className="absolute font-bold whitespace-nowrap"
                        style={{
                            top: -5, right: -5, fontSize: 8,
                            padding: '2px 6px', borderRadius: 999,
                            background: 'linear-gradient(135deg,#7A9E7E,#5A8E5E)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.22)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                            zIndex: 10, lineHeight: 1.4,
                        }}
                    >
                        +{xpEarned} XP ✓
                    </div>
                )}

                <motion.button
                    disabled={isLocked}
                    onClick={() => !isLocked && onPlay(def.id)}
                    whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
                    whileTap={!isLocked ? { scale: 0.94 } : {}}
                    className="flex items-center justify-center relative overflow-hidden"
                    style={{
                        width: 78, height: 78,
                        borderRadius: '50%',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        ...(isCompleted ? {
                            background: 'linear-gradient(135deg, #C6A75E, #A47551, #8B6914)',
                            border: '2.5px solid rgba(255,240,180,0.4)',
                            boxShadow: '0 0 24px rgba(198,167,94,0.4), 0 6px 20px rgba(0,0,0,0.55)',
                        } : isAvailable ? {
                            background: 'linear-gradient(135deg, #D8A47F, #A47551)',
                            border: '2.5px solid rgba(255,220,150,0.5)',
                            boxShadow: '0 0 32px rgba(216,164,127,0.55), 0 6px 24px rgba(0,0,0,0.4)',
                        } : {
                            background: 'rgba(25,13,5,0.8)',
                            border: '2px solid rgba(198,167,94,0.12)',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                        }),
                    }}
                >
                    {/* Shimmer for completed */}
                    {isCompleted && (
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,240,180,0.18), transparent)' }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                        />
                    )}
                    <span
                        className="relative z-10"
                        style={{
                            fontSize: 28,
                            filter: isLocked ? 'grayscale(1) opacity(0.38)' : 'drop-shadow(0 2px 7px rgba(0,0,0,0.7))',
                        }}
                    >
                        {isLocked ? '🔒' : def.emoji}
                    </span>
                </motion.button>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
                {[1, 2, 3].map((s) => (
                    <span
                        key={s}
                        style={{
                            fontSize: 13,
                            opacity: s <= stars ? 1 : 0.18,
                            filter: s <= stars ? 'drop-shadow(0 0 4px rgba(245,158,11,0.7))' : 'grayscale(1)',
                        }}
                    >
                        ⭐
                    </span>
                ))}
            </div>

            {/* Label */}
            <div style={{ textAlign }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(198,167,94,0.42)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                    Level {def.id}
                </p>
                <p
                    className="font-semibold leading-tight"
                    style={{
                        fontSize: 11,
                        color: isLocked ? 'rgba(198,167,94,0.25)' : '#E8D5A3',
                        textShadow: isLocked ? 'none' : '0 1px 8px rgba(0,0,0,0.9)',
                        marginTop: 1,
                        maxWidth: 95,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                >
                    {def.title}
                </p>
                {def.subtitle && (
                    <p style={{ fontSize: 9, color: 'rgba(198,167,94,0.35)', marginTop: 1, maxWidth: 95 }}>
                        {def.subtitle}
                    </p>
                )}
            </div>

            {/* CTA for available node */}
            {isAvailable && (
                <motion.button
                    onClick={() => onPlay(def.id)}
                    animate={{
                        boxShadow: [
                            '0 4px 16px rgba(164,117,81,0.45)',
                            '0 4px 28px rgba(164,117,81,0.78)',
                            '0 4px 16px rgba(164,117,81,0.45)',
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-bold uppercase"
                    style={{
                        padding: '6px 18px', borderRadius: 999,
                        background: 'linear-gradient(135deg, #C6A75E, #A47551)',
                        color: '#1A0903',
                        fontSize: 10,
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: 4,
                        letterSpacing: '1.1px',
                    }}
                >
                    ⚔ MAIN
                </motion.button>
            )}

            {/* Completed badge */}
            {isCompleted && (
                <span
                    style={{
                        fontSize: 8, padding: '2px 8px', borderRadius: 999,
                        background: 'rgba(122,158,126,0.15)',
                        color: '#7A9E7E',
                        border: '1px solid rgba(122,158,126,0.28)',
                        letterSpacing: '0.6px',
                        fontWeight: 700,
                    }}
                >
                    ✓ SELESAI
                </span>
            )}
        </div>
    );
}
