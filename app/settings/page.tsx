'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import { useAuth } from '@/components/AuthProvider';
import { IconLogout } from '@/components/Icons';

const targetOptions = [10, 30, 50, 100];

export default function SettingsPage() {
    const { dailyTarget, setDailyTarget, soundEnabled, toggleSound, resetProgress: resetUser } = useUserStore();
    const { resetAllProgress } = useGameStore();
    const { logout } = useAuth();
    const [showReset, setShowReset] = useState(false);

    const handleReset = () => {
        resetAllProgress();
        resetUser();
        setShowReset(false);
    };

    return (
        <div className="page-content">
            <div className="max-w-lg mx-auto px-4 py-6">
                <h1 className="text-5xl font-heading leading-none text-[var(--text-primary)] mb-5">⚙️ Pengaturan</h1>

                {/* Daily target */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-5 mb-4"
                >
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">🎯 Target XP Harian</h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-4">Pilih berapa XP yang ingin kamu capai setiap hari</p>

                    <div className="flex flex-wrap gap-2">
                        {targetOptions.map((t) => (
                            <motion.button
                                key={t}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDailyTarget(t as 10 | 30 | 50 | 100)}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                                style={{
                                    background: t === dailyTarget
                                        ? 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))'
                                        : 'var(--bg-card)',
                                    border: t === dailyTarget
                                        ? '2px solid var(--border-strong)'
                                        : '2px solid var(--border-subtle)',
                                    color: t === dailyTarget ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: t === dailyTarget ? 'var(--shadow-warm)' : 'none',
                                }}
                            >
                                {t} XP
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Sound */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="glass-card p-5 mb-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">🔊 Efek Suara</h3>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Suara saat menjawab soal</p>
                        </div>
                        <motion.button
                            onClick={toggleSound}
                            className="relative w-14 h-8 rounded-full transition-all duration-300"
                            style={{
                                background: soundEnabled
                                    ? 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))'
                                    : 'var(--bg-card)',
                                border: soundEnabled
                                    ? '2px solid var(--border-medium)'
                                    : '2px solid var(--border-subtle)',
                            }}
                        >
                            <motion.div
                                layout
                                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                                style={{ left: soundEnabled ? '28px' : '2px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </motion.button>
                    </div>
                </motion.div>

                {/* App info */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5 mb-4"
                >
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">ℹ️ Tentang Aplikasi</h3>
                    <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                        <div className="flex justify-between">
                            <span>Versi</span>
                            <span className="text-[var(--text-primary)] font-bold">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform</span>
                            <span className="text-[var(--text-primary)] font-bold">Web App</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Konten</span>
                            <span className="text-[var(--text-primary)] font-bold">Matematika & PPKn SMA</span>
                        </div>
                    </div>
                </motion.div>

                {/* Account / Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="glass-card p-5 mb-4"
                >
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                        👤 Akun
                    </h3>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[var(--text-primary)] hover:text-[var(--jawa-batik)] transition-all duration-200"
                        style={{
                            background: 'var(--bg-surface-soft)',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        <IconLogout size={18} />
                        Keluar dari Akun
                    </motion.button>
                </motion.div>

                {/* Danger zone */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-5"
                    style={{
                        borderColor: 'var(--jawa-batik)',
                        borderWidth: '1px',
                    }}
                >
                    <h3 className="text-sm font-bold text-[var(--jawa-terracotta)] mb-1">⚠️ Zona Bahaya</h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">Reset semua progress dan data. Aksi ini tidak dapat dibatalkan.</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReset(true)}
                        className="w-full py-2.5 rounded-xl font-bold text-sm text-[var(--jawa-terracotta)] transition-all"
                        style={{ background: 'rgba(164,117,81,0.14)', border: '1px solid var(--border-medium)' }}
                    >
                        Reset Semua Data
                    </motion.button>
                </motion.div>
            </div>

            {/* Reset modal */}
            <AnimatePresence>
                {showReset && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowReset(false)}
                    >
                        <div className="absolute inset-0" style={{ background: 'rgba(63,46,34,0.5)', backdropFilter: 'blur(8px)' }} />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-sm w-full mx-4 rounded-3xl p-6 text-center"
                            style={{
                                background: 'var(--bg-surface)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(164,117,81,0.3)',
                            }}
                        >
                            <span className="text-5xl block mb-3">⚠️</span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Reset Semua Data?</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-5">
                                Semua progress, XP, gems, dan pengaturan akan dihapus.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-[var(--text-secondary)] text-sm"
                                    style={{ background: 'var(--bg-surface-soft)' }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--jawa-batik), #8f5d3a)',
                                        boxShadow: '0 4px 24px rgba(164,117,81,0.3)',
                                    }}
                                >
                                    Ya, Reset!
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
