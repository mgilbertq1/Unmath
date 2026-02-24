'use client';

import { motion } from 'framer-motion';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

function WelcomeDoneContent() {
    const router = useRouter();
    const params = useSearchParams();
    const name = params.get('name') || 'Pelajar';

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3500);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
            style={{ background: 'var(--bg-primary)' }}
        >
            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.18), transparent 65%)',
            }} />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 8 + 4,
                        height: Math.random() * 8 + 4,
                        background: ['#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][i % 5],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                        y: [0, -80 - Math.random() * 60],
                    }}
                    transition={{
                        duration: 2.5 + Math.random() * 1.5,
                        delay: Math.random() * 1.5,
                        ease: 'easeOut',
                    }}
                />
            ))}

            <div className="relative z-10 text-center max-w-xs">
                {/* Logo with bounce */}
                <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <Logo size={48} showText={false} />
                </motion.div>

                {/* Speech bubble / mascot message */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.5 }}
                    className="relative inline-block px-5 py-3.5 rounded-2xl mb-2"
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <p className="text-white font-bold text-lg">
                        Halo, <span style={{
                            background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>{name}</span>!
                    </p>
                    {/* Bubble tail */}
                    <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0"
                        style={{
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid rgba(255,255,255,0.08)',
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 space-y-2"
                >
                    <h1 className="text-2xl font-extrabold text-white">
                        Selamat datang di Unmath!
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        Akunmu berhasil dibuat. Siap belajar dengan cara yang seru?
                    </p>
                </motion.div>

                {/* Loading progress bar */}
                <motion.div
                    className="mt-10 w-48 mx-auto h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, delay: 1.2, ease: 'linear' }}
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-white/20 text-xs mt-2"
                >
                    Masuk ke beranda...
                </motion.p>
            </div>
        </div>
    );
}

export default function WelcomeDonePage() {
    return (
        <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg-primary)' }} />}>
            <WelcomeDoneContent />
        </Suspense>
    );
}
