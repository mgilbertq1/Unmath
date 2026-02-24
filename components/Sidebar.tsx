'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    <aside className="hidden lg:flex flex-col w-64 min-h-screen p-5 shrink-0"
      style={{
        background: 'rgba(15, 13, 35, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Logo */}
      <div className="mb-8">
        <Logo size={32} showText />
      </div>

      {/* User chip */}
      <div className="glass-card p-3.5 mb-6 flex items-center gap-3">
        {/* Avatar initials ring */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
          {user?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white/90 text-sm truncate">{user?.username || '...'}</p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            <IconStar size={12} className="text-indigo-400" />
            {totalXP.toLocaleString()} XP
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
          <IconGem size={12} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-400">{gems}</span>
        </div>
      </div>

      {/* Daily progress mini bar */}
      <div className="mb-6 px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Target Harian</span>
          <span className="text-[10px] text-white/50 font-bold">{dailyXP}/{dailyTarget} XP</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-1.5 rounded-full"
            style={{ background: xpPct >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)' }}
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
                                transition-all duration-200
                                ${active
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }
                            `}
              style={active ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))',
                border: '1px solid rgba(99,102,241,0.2)',
              } : {}}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#6366f1' }}
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
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 font-semibold text-sm group"
        >
          <IconLogout size={18} className="group-hover:text-red-400 transition-colors" />
          Keluar
        </button>
        <p className="text-[10px] text-white/15 text-center">Unmath v1.0</p>
      </div>
    </aside>
  );
}

/* ── Mobile Bottom Tab Bar ─────────────────────────────────────── */
export function MobileTabBar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Show all nav items on mobile tab bar (exclude settings, replace with logout on long press)
  const mobileNav = navItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(15, 13, 35, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
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
                  style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                />
              )}
              <motion.span
                animate={active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`text-2xl leading-none ${active ? '' : 'opacity-40'}`}
              >
                {item.icon}
              </motion.span>
              <span className={`text-[10px] font-bold transition-colors duration-200 ${active ? 'text-indigo-400' : 'text-white/30'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
