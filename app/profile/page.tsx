'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import { syncGameData } from '@/lib/sync';
import * as Icons from '@/components/Icons';

const avatarOptions = ['🧑‍🎓', '👩‍🎓', '🦊', '🐱', '🐶', '🦁', '🐼', '🐸', '🦄', '🐯', '🐨', '🐵'];

export default function ProfilePage() {
    const { avatar, username, totalXP, gems, loginStreak, badges, setAvatar, setUsername } = useUserStore();
    const { levels } = useGameStore();
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(username);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    const handleSetAvatar = async (av: string) => {
        setAvatar(av);
        setShowAvatarPicker(false);
        await syncGameData();
    };

    const handleSaveUsername = async () => {
        setUsername(newName);
        setEditing(false);
        await syncGameData();
    };

    const totalLevels = [...levels.math, ...levels.pkn].filter((l) => l.status === 'completed').length;
    const totalStars = [...levels.math, ...levels.pkn].reduce((s, l) => s + l.bestStars, 0);
    const earnedBadges = badges.filter((b) => b.earned);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-strong p-6 text-center mb-6 relative overflow-hidden"
                >
                    {/* Gradient blob */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)',
                    }} />

                    <div className="relative z-10">
                        {/* Avatar */}
                        <motion.button
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative mx-auto mb-3 w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
                                border: '3px solid rgba(99,102,241,0.3)',
                                boxShadow: '0 8px 32px rgba(99,102,241,0.2)',
                            }}
                        >
                            {avatar}
                            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                                ✏️
                            </span>
                        </motion.button>

                        {/* Username */}
                        {editing ? (
                            <div className="flex items-center gap-2 justify-center mb-2">
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-transparent border-b-2 border-indigo-500 text-white font-bold text-center text-lg outline-none py-1 px-2 max-w-[200px]"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveUsername();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSaveUsername}
                                    className="text-emerald-400 text-sm font-bold"
                                >✓</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-xl font-extrabold text-white hover:text-indigo-300 transition-colors"
                            >
                                {username} ✏️
                            </button>
                        )}

                        <p className="text-sm text-white/30 mt-1">Pelajar aktif</p>
                    </div>
                </motion.div>

                {/* Avatar picker */}
                <AnimatePresence>
                    {showAvatarPicker && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card mb-4 p-4 overflow-hidden"
                        >
                            <p className="text-xs font-bold text-white/40 mb-3">Pilih Avatar</p>
                            <div className="grid grid-cols-6 gap-2">
                                {avatarOptions.map((av) => (
                                    <motion.button
                                        key={av}
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() => handleSetAvatar(av)}
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all"
                                        style={{
                                            background: av === avatar ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                                            border: av === avatar ? '2px solid rgba(99,102,241,0.4)' : '2px solid transparent',
                                        }}
                                    >
                                        {av}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: Icons.IconStar, value: totalXP.toLocaleString(), label: 'Total XP', accent: '#6366f1' },
                        { icon: Icons.IconGem, value: gems, label: 'Gems', accent: '#a855f7' },
                        { icon: Icons.IconBook, value: totalLevels, label: 'Level Selesai', accent: '#10b981' },
                        { icon: Icons.IconStar, value: totalStars, label: 'Bintang', accent: '#f59e0b' },
                        { icon: Icons.IconFlame, value: loginStreak, label: 'Login Streak', accent: '#ef4444' },
                        { icon: Icons.IconAward, value: earnedBadges.length, label: 'Badge', accent: '#ec4899' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-4 text-center flex flex-col items-center justify-center group hover:border-indigo-500/30 transition-colors"
                        >
                            <stat.icon className="w-6 h-6 mb-2" style={{ color: stat.accent }} />
                            <p className="text-xl font-extrabold text-white">{stat.value}</p>
                            <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Badges */}
                <h3 className="text-lg font-extrabold text-white mb-3">🏆 Badge</h3>
                <div className="grid grid-cols-3 gap-3">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-3 text-center"
                            style={{
                                opacity: badge.earned ? 1 : 0.3,
                                boxShadow: badge.earned ? `0 4px 24px ${badge.earned ? 'rgba(245,158,11,0.15)' : 'none'}` : 'none',
                            }}
                        >
                            <span className="text-2xl block mb-1">{badge.emoji}</span>
                            <p className="text-xs font-bold text-white/70 leading-tight">{badge.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
