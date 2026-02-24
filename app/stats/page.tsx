'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import * as Icons from '@/components/Icons';

/* ── Accuracy Ring ───────────────────────────────────────────────── */
function AccuracyRing({ pct, label, color, icon: Icon }: { pct: number; label: string; color: string; icon: any }) {
    const R = 36;
    const circ = 2 * Math.PI * R;
    const offset = circ * (1 - pct / 100);

    return (
        <div className="text-center group">
            <div className="relative mb-2">
                <svg width="88" height="88" className="mx-auto rotate-[-90deg]">
                    <defs>
                        <filter id={`glow-${label}`}>
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <circle
                        cx="44" cy="44" r={R}
                        fill="none"
                        stroke={color}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                        filter={`url(#glow-${label})`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="text-xl font-extrabold text-white leading-none">{pct}%</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold">Akurasi</span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-1.5">
                {Icon && <Icon className="w-3 h-3" style={{ color }} />}
                <p className="text-xs font-bold text-white/50">{label}</p>
            </div>
        </div>
    );
}

export default function StatsPage() {
    const { totalXP, loginStreak, dailyHistory, badges, dailyXP, dailyTarget } = useUserStore();
    const { levels } = useGameStore();

    const allMathAnswers = levels.math.reduce((a, l) => a + l.bestXP, 0);
    const allPKNAnswers = levels.pkn.reduce((a, l) => a + l.bestXP, 0);
    const mathLevels = levels.math.filter((l) => l.status === 'completed').length;
    const pknLevels = levels.pkn.filter((l) => l.status === 'completed').length;
    const mathAccuracy = mathLevels > 0 ? Math.round((allMathAnswers / (mathLevels * 100)) * 100) : 0;
    const pknAccuracy = pknLevels > 0 ? Math.round((allPKNAnswers / (pknLevels * 100)) * 100) : 0;

    // Weekly XP data
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const todayIdx = new Date().getDay();
    const weekXP = days.map((_, i) => {
        const record = dailyHistory.find((d) => {
            const date = new Date(d.date);
            return date.getDay() === (i + 1) % 7;
        });
        return record?.xp || 0;
    });
    const maxXP = Math.max(...weekXP, 1);

    // Calendar (last 28 days)
    const last28 = Array.from({ length: 28 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (27 - i));
        const str = d.toISOString().split('T')[0];
        const record = dailyHistory.find((r) => r.date === str);
        return { date: str, xp: record?.xp || 0, day: d.getDate() };
    });

    const earnedBadges = badges.filter((b) => b.earned);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto px-4 py-6">
                <h1 className="text-2xl font-extrabold text-white mb-5">📊 Statistik</h1>

                {/* Top stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { icon: Icons.IconStar, val: totalXP.toLocaleString(), label: 'Total XP', color: '#818cf8' },
                        { icon: Icons.IconFlame, val: loginStreak, label: 'Streak', color: '#fca5a5' },
                        { icon: Icons.IconAward, val: earnedBadges.length, label: 'Badge', color: '#fbbf24' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-3.5 text-center flex flex-col items-center justify-center"
                        >
                            <s.icon className="w-5 h-5 mb-1.5" style={{ color: s.color }} />
                            <p className="text-xl font-extrabold text-white">{s.val}</p>
                            <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Weekly XP chart */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5 mb-6 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Icons.IconChart size={80} />
                    </div>
                    <h3 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
                        <Icons.IconChart className="w-4 h-4 text-indigo-400" />
                        XP Mingguan
                    </h3>
                    <div className="flex items-end gap-2 h-32 relative z-10">
                        {weekXP.map((xp, i) => {
                            const h = (xp / maxXP) * 100;
                            const isToday = i === (todayIdx === 0 ? 6 : todayIdx - 1);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-white/30 font-bold">{xp > 0 ? xp : ''}</span>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(h, 4)}%` }}
                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                        className="w-full rounded-lg"
                                        style={{
                                            background: isToday
                                                ? 'linear-gradient(180deg, #818cf8, #6366f1)'
                                                : 'rgba(255,255,255,0.08)',
                                            boxShadow: isToday ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                                        }}
                                    />
                                    <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-400' : 'text-white/20'}`}>
                                        {days[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Accuracy */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-5 mb-6"
                >
                    <h3 className="text-sm font-bold text-white/60 mb-6 flex items-center gap-2">
                        <Icons.IconTarget className="w-4 h-4 text-emerald-400" />
                        Akurasi Mata Pelajaran
                    </h3>
                    <div className="flex justify-around items-center">
                        <AccuracyRing pct={mathAccuracy} label="Matematika" color="#818cf8" icon={Icons.IconBook} />
                        <div className="w-[1px] h-12 bg-white/5" />
                        <AccuracyRing pct={pknAccuracy} label="PPKn" color="#34d399" icon={Icons.IconBook} />
                    </div>
                </motion.div>

                {/* Activity calendar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-5 mb-6"
                >
                    <h3 className="text-sm font-bold text-white/60 mb-3">🗓️ Aktivitas 28 Hari</h3>
                    <div className="grid grid-cols-7 gap-1.5">
                        {last28.map((d, i) => {
                            const intensity = d.xp > 0 ? Math.min(d.xp / dailyTarget, 1) : 0;
                            return (
                                <div
                                    key={i}
                                    className="aspect-square rounded-md flex items-center justify-center text-[9px] font-bold"
                                    style={{
                                        background: intensity > 0
                                            ? `rgba(99,102,241,${0.15 + intensity * 0.5})`
                                            : 'rgba(255,255,255,0.03)',
                                        border: intensity > 0 ? `1px solid rgba(99,102,241,${0.1 + intensity * 0.3})` : '1px solid transparent',
                                        color: intensity > 0 ? `rgba(129,140,248,${0.5 + intensity * 0.5})` : 'rgba(255,255,255,0.1)',
                                    }}
                                    title={`${d.date}: ${d.xp} XP`}
                                >
                                    {d.day}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Badges */}
                <h3 className="text-sm font-bold text-white/60 mb-3">🏅 Badge</h3>
                <div className="grid grid-cols-3 gap-3">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="glass-card p-3 text-center"
                            style={{
                                opacity: badge.earned ? 1 : 0.25,
                                boxShadow: badge.earned ? '0 4px 24px rgba(245,158,11,0.1)' : 'none',
                            }}
                        >
                            <span className="text-2xl block mb-1">{badge.emoji}</span>
                            <p className="text-[10px] font-bold text-white/50 leading-tight">{badge.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
