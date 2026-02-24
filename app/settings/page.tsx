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
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto px-4 py-6">
                <h1 className="text-2xl font-extrabold text-white mb-5">⚙️ Pengaturan</h1>

                {/* Daily target */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-5 mb-4"
                >
                    <h3 className="text-sm font-bold text-white mb-1">🎯 Target XP Harian</h3>
                    <p className="text-xs text-white/30 mb-4">Pilih berapa XP yang ingin kamu capai setiap hari</p>

                    <div className="flex flex-wrap gap-2">
                        {targetOptions.map((t) => (
                            <motion.button
                                key={t}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDailyTarget(t as 10 | 30 | 50 | 100)}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                                style={{
                                    background: t === dailyTarget
                                        ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: t === dailyTarget
                                        ? '2px solid rgba(99,102,241,0.4)'
                                        : '2px solid rgba(255,255,255,0.06)',
                                    color: t === dailyTarget ? '#fff' : 'rgba(255,255,255,0.4)',
                                    boxShadow: t === dailyTarget ? '0 4px 16px rgba(99,102,241,0.25)' : 'none',
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
                            <h3 className="text-sm font-bold text-white">🔊 Efek Suara</h3>
                            <p className="text-xs text-white/30 mt-0.5">Suara saat menjawab soal</p>
                        </div>
                        <motion.button
                            onClick={toggleSound}
                            className="relative w-14 h-8 rounded-full transition-all duration-300"
                            style={{
                                background: soundEnabled
                                    ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                                    : 'rgba(255,255,255,0.08)',
                                border: soundEnabled
                                    ? '2px solid rgba(99,102,241,0.3)'
                                    : '2px solid rgba(255,255,255,0.1)',
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
                    <h3 className="text-sm font-bold text-white mb-3">ℹ️ Tentang Aplikasi</h3>
                    <div className="space-y-2 text-xs text-white/30">
                        <div className="flex justify-between">
                            <span>Versi</span>
                            <span className="text-white/50 font-bold">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform</span>
                            <span className="text-white/50 font-bold">Web App</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Konten</span>
                            <span className="text-white/50 font-bold">Matematika & PPKn SMA</span>
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
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        👤 Akun
                    </h3>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white/80 hover:text-white transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
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
                    className="rounded-2xl p-5"
                    style={{
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.15)',
                    }}
                >
                    <h3 className="text-sm font-bold text-red-300 mb-1">⚠️ Zona Bahaya</h3>
                    <p className="text-xs text-white/30 mb-3">Reset semua progress dan data. Aksi ini tidak dapat dibatalkan.</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReset(true)}
                        className="w-full py-2.5 rounded-xl font-bold text-sm text-red-300 transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
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
                        <div className="absolute inset-0" style={{ background: 'rgba(15,13,35,0.85)', backdropFilter: 'blur(8px)' }} />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-sm w-full mx-4 rounded-3xl p-6 text-center"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(32px)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}
                        >
                            <span className="text-5xl block mb-3">⚠️</span>
                            <h3 className="text-lg font-bold text-white mb-1">Reset Semua Data?</h3>
                            <p className="text-sm text-white/30 mb-5">
                                Semua progress, XP, gems, dan pengaturan akan dihapus.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-white/50 text-sm"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                        boxShadow: '0 4px 24px rgba(239,68,68,0.3)',
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
