'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { ShopItemId } from '@/lib/types';
import { syncGameData } from '@/lib/sync';

const shopCatalog = [
    { id: 'heart_refill', emoji: '❤️', name: 'Isi Nyawa', description: 'Isi ulang 5 nyawa instan', price: 15 },
    { id: 'streak_freeze', emoji: '❄️', name: 'Streak Freeze', description: 'Pertahankan streak 1 hari', price: 20 },
    { id: 'double_xp', emoji: '⭐', name: 'Double XP', description: '2x XP untuk sesi berikutnya', price: 50 },
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
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">🛒 Toko</h1>
                        <p className="text-sm text-white/30 mt-0.5">Beli power-up dengan gems</p>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="glass-pill px-4 py-2 text-amber-400 font-bold flex items-center gap-1.5"
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
                                background: message.includes('Berhasil') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                color: message.includes('Berhasil') ? '#34d399' : '#fca5a5',
                                border: `1px solid ${message.includes('Berhasil') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
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
                                <h3 className="font-bold text-white text-sm">{item.name}</h3>
                                <p className="text-xs text-white/30 mt-0.5 mb-3">{item.description}</p>

                                {owned > 0 && (
                                    <span className="text-xs font-bold text-white/20 mb-2">Punya: {owned}</span>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBuy(item)}
                                    disabled={!canAfford}
                                    className={`
                                        w-full py-2 rounded-xl font-bold text-sm transition-all duration-200
                                        ${canAfford
                                            ? 'text-white cursor-pointer'
                                            : 'text-white/20 cursor-not-allowed'}
                                    `}
                                    style={{
                                        background: canAfford ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${canAfford ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)'}`,
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
                    <h3 className="font-bold text-white text-sm mb-2">💡 Cara Dapat Gems</h3>
                    <div className="space-y-1.5 text-xs text-white/40">
                        <p>⭐ Selesaikan level dengan 3 bintang — <span className="text-amber-400 font-bold">+15</span></p>
                        <p>⭐ Selesaikan level dengan 2 bintang — <span className="text-amber-400 font-bold">+10</span></p>
                        <p>⭐ Selesaikan level dengan 1 bintang — <span className="text-amber-400 font-bold">+5</span></p>
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
                        <div className="absolute inset-0" style={{ background: 'rgba(15,13,35,0.8)', backdropFilter: 'blur(8px)' }} />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm mx-4 rounded-3xl p-6 text-center"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(32px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {(() => {
                                const item = shopItems.find((i) => i.id === buying);
                                if (!item) return null;
                                return (
                                    <>
                                        <span className="text-5xl block mb-3">{item.emoji}</span>
                                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                        <p className="text-sm text-white/40 mb-4">{item.description}</p>
                                        <p className="text-amber-400 font-bold mb-5">💎 {item.price} gems</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setBuying(null)}
                                                className="flex-1 py-3 rounded-xl font-bold text-white/50 text-sm"
                                                style={{ background: 'rgba(255,255,255,0.06)' }}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={confirmBuy}
                                                className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                                                style={{
                                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                                    boxShadow: '0 4px 24px rgba(99,102,241,0.3)',
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
