'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';

// Circular XP progress ring with gradient stroke
function DailyRing({ current, target }: { current: number; target: number }) {
  const R = 44;
  const circ = 2 * Math.PI * R;
  const pct = Math.min(current / target, 1);
  const offset = circ * (1 - pct);
  const done = pct >= 1;

  return (
    <svg width="108" height="108" className="block mx-auto">
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={done ? '#10b981' : '#6366f1'} />
          <stop offset="100%" stopColor={done ? '#34d399' : '#a78bfa'} />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="54" cy="54" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="54" cy="54" r={R}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="ring-progress"
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        filter="url(#ring-glow)"
      />
      <text x="54" y="50" textAnchor="middle" fontSize="16" fontWeight="800" fill="#f1f5f9">{current}</text>
      <text x="54" y="66" textAnchor="middle" fontSize="10" fill="rgba(241,245,249,0.4)">/{target} XP</text>
    </svg>
  );
}

export default function Home() {
  const { levels } = useGameStore();
  const { totalXP, loginStreak, gems, dailyXP, dailyTarget, username, avatar } = useUserStore();

  const mathProgress = levels.math.filter((l) => l.status === 'completed').length;
  const pknProgress = levels.pkn.filter((l) => l.status === 'completed').length;
  const allStars = [...levels.math, ...levels.pkn].reduce((s, l) => s + l.bestStars, 0);
  const targetMet = dailyXP >= dailyTarget;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <header className="px-5 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{
          background: 'rgba(15, 13, 35, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{avatar}</span>
          <span className="font-bold text-white/90 text-sm">{username}</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-bold">
          <span className="glass-pill px-2.5 py-1 text-amber-400">💎 {gems}</span>
          <span className="glass-pill px-2.5 py-1 text-orange-400">🔥 {loginStreak}</span>
          <span className="glass-pill px-2.5 py-1 text-indigo-300">⭐ {totalXP.toLocaleString()}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-2xl font-extrabold text-white">
            Halo, {username}! 👋
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Siap belajar hari ini?</p>
        </motion.div>

        {/* Daily Target */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card-strong p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-white">🎯 Target Harian</h2>
            {targetMet && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                ✓ Tercapai!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <DailyRing current={dailyXP} target={dailyTarget} />
            <div className="flex-1">
              <p className="text-2xl font-extrabold text-white">{dailyXP} <span className="text-white/30 font-normal text-base">/ {dailyTarget} XP</span></p>
              <p className="text-sm text-white/40 mt-0.5">
                {targetMet ? '🔥 Luar biasa! Target hari ini terpenuhi.' : `Kurangi ${dailyTarget - dailyXP} XP lagi!`}
              </p>
              <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((dailyXP / dailyTarget) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-2 rounded-full"
                  style={{ background: targetMet ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pick subject */}
        <h2 className="font-extrabold text-white text-lg mb-3">📚 Pilih Pelajaran</h2>

        <div className="flex flex-col gap-3 mb-5">
          {[
            {
              href: '/game/math/levels',
              emoji: '📐',
              name: 'Matematika',
              desc: 'Aljabar · Fungsi · Trigonometri · Peluang · Limit',
              progress: mathProgress,
              gradient: 'linear-gradient(135deg, #4f46e5, #6366f1, #7c3aed)',
              shadow: '0 8px 32px rgba(99,102,241,0.3)',
              pattern: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            },
            {
              href: '/game/pkn/levels',
              emoji: '🏛️',
              name: 'PPKn',
              desc: 'Pancasila · UUD 1945 · Pemerintahan · Hak & Kewajiban',
              progress: pknProgress,
              gradient: 'linear-gradient(135deg, #059669, #10b981, #047857)',
              shadow: '0 8px 32px rgba(16,185,129,0.3)',
              pattern: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            },
          ].map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={s.href}
                className="flex items-center gap-4 p-5 rounded-3xl transition-shadow hover:shadow-xl relative overflow-hidden"
                style={{ background: s.gradient, boxShadow: s.shadow }}
              >
                {/* Pattern overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-60"
                  style={{ backgroundImage: s.pattern, backgroundSize: '20px 20px' }}
                />
                <span className="text-4xl relative z-10">{s.emoji}</span>
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="font-extrabold text-white text-lg">{s.name}</p>
                  <p className="text-xs text-white/50 truncate">{s.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-white rounded-full transition-all duration-700"
                        style={{ width: `${(s.progress / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 font-bold">{s.progress}/5</span>
                  </div>
                </div>
                <span className="text-white/30 text-xl relative z-10">›</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '★', label: 'Bintang', val: allStars },
            { icon: '🔥', label: 'Streak', val: `${loginStreak} hr` },
            { icon: '💎', label: 'Gems', val: gems },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 text-center"
            >
              <p className="text-2xl font-extrabold text-white">{s.icon} {s.val}</p>
              <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
