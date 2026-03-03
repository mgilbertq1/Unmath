'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { CHALLENGE_TYPES } from '@/lib/store/user-store';

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
          <stop offset="0%" stopColor={done ? '#7A9E7E' : '#A47551'} />
          <stop offset="100%" stopColor={done ? '#C6A75E' : '#D8A47F'} />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="54" cy="54" r={R} fill="none" stroke="rgba(164,117,81,0.15)" strokeWidth="8" />
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
      <text x="54" y="50" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--text-primary)">{current}</text>
      <text x="54" y="66" textAnchor="middle" fontSize="10" fill="var(--text-muted)">/{target} XP</text>
    </svg>
  );
}

export default function Home() {
  const { levels } = useGameStore();
  const { totalXP, loginStreak, gems, dailyXP, dailyTarget, username, avatar, getDailyChallenge, dailyLives } = useUserStore();
  const dailyChallenge = getDailyChallenge();

  const mathProgress = levels.math.filter((l) => l.status === 'completed').length;
  const pknProgress = levels.pkn.filter((l) => l.status === 'completed').length;
  const allStars = [...levels.math, ...levels.pkn].reduce((s, l) => s + l.bestStars, 0);
  const targetMet = dailyXP >= dailyTarget;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{ backgroundImage: 'var(--batik-pattern)', backgroundSize: '24px 24px' }}
      />

      {/* Top bar */}
      <header className="glass-card-strong px-5 py-3 flex items-center justify-between sticky top-0 z-40 border-t-0 border-x-0 rounded-none">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{avatar}</span>
          <span className="font-bold text-[var(--text-primary)] text-sm">{username}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="glass-pill px-3 py-1.5 text-[var(--jawa-gold)] font-bold">💎 {gems}</span>
          <span className="glass-pill px-3 py-1.5 text-[var(--jawa-terracotta)] font-bold">🔥 {loginStreak}</span>
          <span className="glass-pill px-3 py-1.5 text-[var(--text-secondary)] font-bold">⭐ {totalXP.toLocaleString()}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-4xl font-heading font-semibold leading-none text-[var(--text-primary)]">
            Halo, {username}! 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Siap belajar hari ini?</p>
        </motion.div>

        {/* Daily Target */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card-strong p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-3xl leading-none text-[var(--text-primary)]">🎯 Target Harian</h2>
            {targetMet && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(122,158,126,0.18)', color: 'var(--jawa-sage)', border: '1px solid rgba(122,158,126,0.35)' }}
              >
                ✓ Tercapai!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <DailyRing current={dailyXP} target={dailyTarget} />
            <div className="flex-1">
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">{dailyXP} <span className="text-[var(--text-muted)] font-normal text-base">/ {dailyTarget} XP</span></p>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {targetMet ? '🔥 Luar biasa! Target hari ini terpenuhi.' : `Kurangi ${dailyTarget - dailyXP} XP lagi!`}
              </p>
              <div className="mt-3 jawa-progress-track h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((dailyXP / dailyTarget) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-2 rounded-full"
                  style={{ background: targetMet ? 'linear-gradient(90deg, var(--jawa-sage), var(--jawa-gold))' : 'linear-gradient(90deg, var(--jawa-batik), var(--jawa-terracotta))' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Challenge – Task 7 */}
        {dailyChallenge && (() => {
          const ct = CHALLENGE_TYPES.find((c) => c.type === dailyChallenge.type);
          const progress = dailyChallenge.progress ?? 0;
          const target = dailyChallenge.type === 2 ? 10 : dailyChallenge.type === 3 ? 5 : 1;
          const pct = Math.min(progress / target, 1);
          return (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="glass-card-strong p-4 mb-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h2 className="font-heading text-xl leading-none text-[var(--text-primary)]">Tantangan Harian</h2>
                    {ct && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{ct.desc}</p>}
                  </div>
                </div>
                {dailyChallenge.completed ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(122,158,126,0.18)', color: 'var(--jawa-sage)', border: '1px solid rgba(122,158,126,0.35)' }}
                  >✓ Selesai!</span>
                ) : (
                  <div className="text-right">
                    {ct && <p className="text-xs font-bold text-[var(--jawa-gold)]">+{ct.xpReward} XP{ct.gemReward ? ` +${ct.gemReward}💎` : ''}</p>}
                    <p className="text-xs text-[var(--text-muted)]">{progress}/{target}</p>
                  </div>
                )}
              </div>
              {!dailyChallenge.completed && (
                <div className="jawa-progress-track h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-1.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--jawa-batik), var(--jawa-gold))' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Lives indicator – Task 4 */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-xs text-[var(--text-muted)] font-bold">Nyawa Hari Ini:</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-base" style={{ opacity: i < dailyLives ? 1 : 0.2 }}>❤️</span>
          ))}
          <span className="text-xs text-[var(--text-muted)] ml-1">({dailyLives}/5)</span>
        </div>

        {/* Pick subject */}
        <h2 className="font-heading text-3xl leading-none text-[var(--text-primary)] mb-3">📚 Pilih Pelajaran</h2>

        <div className="flex flex-col gap-3 mb-5">
          {[
            {
              href: '/game/math/levels',
              emoji: '📐',
              name: 'Matematika',
              desc: 'Aljabar · Fungsi · Trigonometri · Peluang · Limit',
              progress: mathProgress,
              gradient: 'linear-gradient(135deg, #A47551, #D8A47F, #C6A75E)',
              shadow: 'var(--shadow-soft)',
              pattern: 'radial-gradient(circle at 6px 6px, rgba(255,255,255,0.18) 1px, transparent 1px)',
            },
            {
              href: '/game/pkn/levels',
              emoji: '🏛️',
              name: 'PPKn',
              desc: 'Pancasila · UUD 1945 · Pemerintahan · Hak & Kewajiban',
              progress: pknProgress,
              gradient: 'linear-gradient(135deg, #6D8299, #7A9E7E, #6D8299)',
              shadow: 'var(--shadow-soft)',
              pattern: 'radial-gradient(circle at 6px 6px, rgba(255,255,255,0.16) 1px, transparent 1px)',
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
                className="glass-card-warm flex items-center gap-4 p-5 rounded-3xl relative overflow-hidden group"
              >
                {/* Subtle gradient glow behind emoji */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                  style={{ background: 'radial-gradient(circle at 30% 50%, rgba(164,117,81,0.14), transparent 70%)' }}
                />
                <span className="text-4xl relative z-10 drop-shadow-md">{s.emoji}</span>
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="font-extrabold text-[var(--text-primary)] text-lg">{s.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{s.desc}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(198,167,94,0.14)' }}>
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${(s.progress / 5) * 100}%`, background: 'linear-gradient(90deg, var(--jawa-batik), var(--jawa-gold))' }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] font-bold">{s.progress}/5</span>
                  </div>
                </div>
                <span className="text-[var(--jawa-gold)] text-2xl font-bold relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '★', label: 'Bintang', val: allStars, color: 'var(--jawa-gold)' },
            { icon: '🔥', label: 'Streak', val: `${loginStreak} hr`, color: 'var(--jawa-terracotta)' },
            { icon: '💎', label: 'Gems', val: gems, color: 'var(--jawa-gold)' },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 text-center"
            >
              <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.color }}>{s.icon} {s.val}</p>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
