'use client';

import { motion } from 'framer-motion';
import { useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

function WelcomeDoneContent() {
    const router = useRouter();
    const params = useSearchParams();
    const name = params.get('name') || 'Pelajar';
    const particles = useMemo(
        () => Array.from({ length: 12 }, (_, i) => {
            const seed = (i * 37 + 13) % 100;
            return {
                size: 4 + (seed % 8),
                color: ['#A47551', '#D8A47F', '#7A9E7E', '#C6A75E', '#6D8299'][i % 5],
                left: `${(seed * 1.7) % 100}%`,
                top: `${(seed * 2.3) % 100}%`,
                rise: -80 - (seed % 60),
                duration: 2.5 + (seed % 15) / 10,
                delay: (seed % 15) / 10,
            };
        }),
        []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3500);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative"
        >
            <div className="absolute inset-0 pointer-events-none opacity-65" style={{ backgroundImage: 'var(--batik-pattern)', backgroundSize: '24px 24px' }} />

            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at 50% 40%, rgba(164,117,81,0.2), transparent 65%)',
            }} />

            {/* Floating particles */}
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        background: particle.color,
                        left: particle.left,
                        top: particle.top,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                        y: [0, particle.rise],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
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
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <p className="text-[var(--text-primary)] font-bold text-lg">
                        Halo, <span style={{
                            background: 'linear-gradient(135deg, var(--jawa-bluegray), var(--jawa-batik))',
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
                            borderTop: '10px solid var(--bg-surface)',
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 space-y-2"
                >
                    <h1 className="text-4xl font-heading text-[var(--text-primary)] leading-none">
                        Selamat datang di Unmath!
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-2">
                        Akunmu berhasil dibuat. Siap belajar dengan cara yang seru?
                    </p>
                </motion.div>

                {/* Loading progress bar */}
                <motion.div
                    className="mt-10 w-48 mx-auto h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(164,117,81,0.18)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, var(--jawa-batik), var(--jawa-gold))' }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, delay: 1.2, ease: 'linear' }}
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-[var(--text-muted)] text-xs mt-2"
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
