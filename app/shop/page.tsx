'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { ShopItemId } from '@/lib/types';
import { syncGameData } from '@/lib/sync';

const shopCatalog = [
    { id: 'heart_refill', emoji: '❤️', name: 'Isi Nyawa', description: 'Isi ulang 3 nyawa harian instan', price: 15 },
    { id: 'hint', emoji: '💡', name: 'Petunjuk', description: 'Hilangkan 2 pilihan salah (1 soal)', price: 8 },
    { id: 'time_extend', emoji: '⏰', name: 'Tambah Waktu', description: '+15 detik untuk soal berikutnya', price: 10 },
    { id: 'second_chance', emoji: '🛡️', name: 'Kesempatan Kedua', description: 'Nyawa tidak berkurang jika salah 1x', price: 25 },
    { id: 'streak_freeze', emoji: '❄️', name: 'Streak Freeze', description: 'Pertahankan streak 1 hari', price: 20 },
    { id: 'double_xp', emoji: '⭐', name: 'Double XP', description: '2x XP untuk sesi berikutnya', price: 50 },
    { id: 'xp_boost_24h', emoji: '🚀', name: 'XP Boost 24 Jam', description: '2x XP semua aktivitas selama 24 jam', price: 80 },
    { id: 'dark_theme', emoji: '🌙', name: 'Tema Gelap', description: 'Unlock tema warna eksklusif', price: 100 },
];

export default function ShopPage() {
    const { gems, shopItems, purchaseItem } = useUserStore();
    const [buying, setBuying] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const handleBuy = (item: typeof shopCatalog[0]) => {
        setBuying(item.id);
    };

    const confirmBuy = async () => {
        if (!buying) return;
        const item = shopCatalog.find((i) => i.id === buying);
        if (!item) return;

        const success = purchaseItem(item.id as ShopItemId);
        if (success) {
            setMessage(`Berhasil membeli ${item.name}!`);
            await syncGameData();
        } else {
            setMessage('Gems tidak cukup!');
        }
        setBuying(null);
        setTimeout(() => setMessage(''), 2500);
    };

    return (
        <div className="page-content">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-5xl font-heading leading-none text-[var(--text-primary)] drop-shadow-md">🛒 Toko</h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5 drop-shadow-md">Beli power-up dengan gems</p>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="glass-pill px-4 py-2 text-[var(--jawa-gold)] font-bold flex items-center gap-1.5"
                    >
                        💎 {gems}
                    </motion.div>
                </div>

                {/* Toast message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 rounded-2xl p-3 text-center font-bold text-sm"
                            style={{
                                background: message.includes('Berhasil') ? 'rgba(122,158,126,0.15)' : 'rgba(164,117,81,0.16)',
                                color: message.includes('Berhasil') ? 'var(--jawa-sage)' : 'var(--jawa-batik)',
                                border: `1px solid ${message.includes('Berhasil') ? 'rgba(122,158,126,0.25)' : 'rgba(164,117,81,0.25)'}`,
                            }}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Shop items */}
                <div className="grid grid-cols-2 gap-3">
                    {shopCatalog.map((item, i) => {
                        const owned = shopItems.find(s => s.id === item.id)?.owned || 0;
                        const canAfford = gems >= item.price;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card p-4 flex flex-col items-center text-center"
                            >
                                <span className="text-3xl mb-2">{item.emoji}</span>
                                <h3 className="font-bold text-[var(--text-primary)] text-sm">{item.name}</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-3">{item.description}</p>

                                {owned > 0 && (
                                    <span className="text-xs font-bold text-[var(--text-muted)] mb-2">Punya: {owned}</span>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBuy(item)}
                                    disabled={!canAfford}
                                    className={`
                                        w-full py-2 rounded-xl font-bold text-sm transition-all duration-200
                                        ${canAfford
                                            ? 'text-white cursor-pointer'
                                            : 'text-[var(--text-muted)] cursor-not-allowed'}
                                    `}
                                    style={{
                                        background: canAfford ? 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))' : 'var(--bg-card)',
                                        border: `1px solid ${canAfford ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
                                    }}
                                >
                                    💎 {item.price}
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* How to earn gems */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card mt-6 p-4"
                >
                    <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2">💡 Cara Dapat Gems</h3>
                    <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                        <p>⭐ Selesaikan level dengan 3 bintang — <span className="text-[var(--jawa-gold)] font-bold">+15</span></p>
                        <p>⭐ Selesaikan level dengan 2 bintang — <span className="text-[var(--jawa-gold)] font-bold">+10</span></p>
                        <p>⭐ Selesaikan level dengan 1 bintang — <span className="text-[var(--jawa-gold)] font-bold">+5</span></p>
                    </div>
                </motion.div>
            </div>

            {/* Purchase modal */}
            <AnimatePresence>
                {buying && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setBuying(null)}
                    >
                        <div className="absolute inset-0" style={{ background: 'rgba(63,46,34,0.5)', backdropFilter: 'blur(8px)' }} />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm mx-4 rounded-3xl p-6 text-center"
                            style={{
                                background: 'var(--bg-surface)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid var(--border-medium)',
                            }}
                        >
                            {(() => {
                                const item = shopItems.find((i) => i.id === buying);
                                if (!item) return null;
                                return (
                                    <>
                                        <span className="text-5xl block mb-3">{item.emoji}</span>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.name}</h3>
                                        <p className="text-sm text-[var(--text-secondary)] mb-4">{item.description}</p>
                                        <p className="text-[var(--jawa-gold)] font-bold mb-5">💎 {item.price} gems</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setBuying(null)}
                                                className="flex-1 py-3 rounded-xl font-bold text-[var(--text-secondary)] text-sm"
                                                style={{ background: 'var(--bg-card)' }}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={confirmBuy}
                                                className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))',
                                                    boxShadow: '0 4px 24px rgba(164,117,81,0.28)',
                                                }}
                                            >
                                                Beli
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
