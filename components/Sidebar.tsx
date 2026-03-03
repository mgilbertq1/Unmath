'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store/user-store';
import { useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';
import { IconBook, IconChart, IconCart, IconUser, IconSettings, IconLogout, IconStar, IconGem } from '@/components/Icons';

const navItems = [
  { href: '/', icon: <IconBook />, label: 'Belajar', match: (p: string) => p === '/' || p.startsWith('/game') },
  { href: '/stats', icon: <IconChart />, label: 'Statistik', match: (p: string) => p === '/stats' },
  { href: '/shop', icon: <IconCart />, label: 'Toko', match: (p: string) => p === '/shop' },
  { href: '/profile', icon: <IconUser />, label: 'Profil', match: (p: string) => p === '/profile' },
  { href: '/settings', icon: <IconSettings />, label: 'Setelan', match: (p: string) => p === '/settings' },
];

/* ── Desktop Sidebar ───────────────────────────────────────────── */
export function DesktopSidebar() {
  const pathname = usePathname();
  const { gems, totalXP, dailyXP, dailyTarget } = useUserStore();
  const { user, logout } = useAuth();
  const xpPct = Math.min((dailyXP / dailyTarget) * 100, 100);

  return (
    <aside className="glass-card-strong hidden lg:flex flex-col w-64 min-h-screen p-5 shrink-0 border-y-0 border-l-0 rounded-none"
    >
      {/* Logo */}
      <div className="mb-8">
        <Logo size={32} showText />
      </div>

      {/* User chip */}
      <div className="glass-card p-3.5 mb-6 flex items-center gap-3">
        {/* Avatar initials ring */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))' }}>
          {user?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[var(--text-primary)] text-sm truncate">{user?.username || '...'}</p>
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            <IconStar size={12} className="text-[var(--jawa-gold)]" />
            {totalXP.toLocaleString()} XP
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--jawa-gold)]/15 border border-[var(--jawa-gold)]/25">
          <IconGem size={12} className="text-[var(--jawa-gold)]" />
          <span className="text-xs font-bold text-[var(--jawa-gold)]">{gems}</span>
        </div>
      </div>

      {/* Daily progress mini bar */}
      <div className="mb-6 px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Target Harian</span>
          <span className="text-[10px] text-[var(--text-muted)] font-bold">{dailyXP}/{dailyTarget} XP</span>
        </div>
        <div className="jawa-progress-track">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-1.5 rounded-full"
            style={{ background: xpPct >= 100 ? 'linear-gradient(90deg, var(--jawa-sage), var(--jawa-gold))' : 'linear-gradient(90deg, var(--jawa-bluegray), var(--jawa-terracotta))' }}
          />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                                flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm
                                jawa-nav-item
                                transition-all duration-200
                                ${active
                  ? 'jawa-nav-item-active'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
                            `}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--jawa-gold)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — logout */}
      <div className="mt-auto pt-4 space-y-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[var(--text-muted)] hover:text-[var(--jawa-batik)] hover:bg-[var(--jawa-terracotta)]/12 transition-all duration-200 font-semibold text-sm group"
        >
          <IconLogout size={18} className="group-hover:text-[var(--jawa-batik)] transition-colors" />
          Keluar
        </button>
        <p className="text-[10px] text-[var(--text-muted)] text-center">Unmath v1.0</p>
      </div>
    </aside>
  );
}

/* ── Mobile Bottom Tab Bar ─────────────────────────────────────── */
export function MobileTabBar() {
  const pathname = usePathname();

  // Show all nav items on mobile tab bar (exclude settings, replace with logout on long press)
  const mobileNav = navItems.slice(0, 5);

  return (
    <nav className="glass-card-strong lg:hidden fixed bottom-0 left-0 right-0 z-50 border-b-0 border-x-0 rounded-none"
    >
      <div className="flex justify-around items-center h-16 px-2 pb-safe">
        {mobileNav.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
            >
              {active && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute -top-0 inset-x-3 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--jawa-batik), var(--jawa-gold))' }}
                />
              )}
              <motion.span
                animate={active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`text-2xl leading-none ${active ? 'text-[var(--jawa-batik)]' : 'opacity-45 text-[var(--text-secondary)]'}`}
              >
                {item.icon}
              </motion.span>
              <span className={`text-[10px] font-bold transition-colors duration-200 ${active ? 'text-[var(--jawa-batik)]' : 'text-[var(--text-muted)]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
