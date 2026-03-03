'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import { syncGameData } from '@/lib/sync';
import * as Icons from '@/components/Icons';

import EmojiPicker from '@/components/EmojiPicker';

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
        <div className="page-content">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-strong p-6 text-center mb-6 relative overflow-hidden"
                >
                    {/* Gradient blob */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(164,117,81,0.16), transparent 60%)',
                    }} />

                    <div className="relative z-10">
                        {/* Avatar */}
                        <motion.button
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative mx-auto mb-3 w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(164,117,81,0.18), rgba(216,164,127,0.18))',
                                border: '3px solid rgba(164,117,81,0.34)',
                                boxShadow: '0 8px 24px rgba(164,117,81,0.2)',
                            }}
                        >
                            {avatar}
                            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                style={{ background: 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))' }}>
                                ✏️
                            </span>
                        </motion.button>

                        {/* Username */}
                        {editing ? (
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-transparent border-b-2 border-[var(--jawa-batik)] text-[var(--text-primary)] font-bold text-center text-lg outline-none py-1 px-2 max-w-[180px]"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveUsername();
                                        }}
                                    />
                                    {/* Emoji picker for display name */}
                                    <EmojiPicker
                                        onEmojiSelect={(emoji) => setNewName((prev) => prev + emoji)}
                                        triggerLabel="😊"
                                        position="bottom"
                                    />
                                    <button
                                        onClick={handleSaveUsername}
                                        className="text-[var(--jawa-sage)] text-lg font-bold"
                                    >✓</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-4xl font-heading leading-none text-[var(--text-primary)] hover:text-[var(--jawa-batik)] transition-colors"
                            >
                                {username} ✏️
                            </button>
                        )}

                        <p className="text-sm text-[var(--text-secondary)] mt-1">Pelajar aktif</p>
                    </div>
                </motion.div>

                {/* Avatar picker — powered by emoji-mart */}
                <AnimatePresence>
                    {showAvatarPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-card mb-4 p-4 overflow-hidden flex flex-col items-center gap-3"
                        >
                            <p className="text-xs font-bold text-[var(--text-secondary)] self-start">Pilih Avatar dari Emoji</p>
                            <EmojiPicker
                                onEmojiSelect={(emoji) => handleSetAvatar(emoji)}
                                triggerLabel={avatar}
                                position="bottom"
                            />
                            <p className="text-xs text-[var(--text-muted)]">Ketuk ikon di atas untuk membuka semua emoji</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: Icons.IconStar, value: totalXP.toLocaleString(), label: 'Total XP', accent: '#A47551' },
                        { icon: Icons.IconGem, value: gems, label: 'Gems', accent: '#C6A75E' },
                        { icon: Icons.IconBook, value: totalLevels, label: 'Level Selesai', accent: '#7A9E7E' },
                        { icon: Icons.IconStar, value: totalStars, label: 'Bintang', accent: '#C6A75E' },
                        { icon: Icons.IconFlame, value: loginStreak, label: 'Login Streak', accent: '#D8A47F' },
                        { icon: Icons.IconAward, value: earnedBadges.length, label: 'Badge', accent: '#6D8299' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-4 text-center flex flex-col items-center justify-center group hover:border-[var(--border-strong)] transition-colors"
                        >
                            <stat.icon className="w-6 h-6 mb-2" style={{ color: stat.accent }} />
                            <p className="text-xl font-extrabold text-[var(--text-primary)]">{stat.value}</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Badges */}
                <h3 className="text-3xl font-heading leading-none text-[var(--text-primary)] mb-3">🏆 Badge</h3>
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
                                boxShadow: badge.earned ? `0 4px 24px ${badge.earned ? 'rgba(198,167,94,0.2)' : 'none'}` : 'none',
                            }}
                        >
                            <span className="text-2xl block mb-1">{badge.emoji}</span>
                            <p className="text-xs font-bold text-[var(--text-secondary)] leading-tight">{badge.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
