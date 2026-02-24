'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

// Animated mascot — abstract geometric character (open book with spark)
function Mascot() {
    return (
        <motion.div
            className="relative mx-auto"
            style={{ width: 220, height: 220 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.3 }}
        >
            <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <radialGradient id="glow-bg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="book-left" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="book-right" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="page-left" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#e0e7ff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                    </linearGradient>
                    <linearGradient id="page-right" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ddd6fe" />
                        <stop offset="100%" stopColor="#c4b5fd" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#6366f1" floodOpacity="0.35" />
                    </filter>
                </defs>

                {/* Glow background */}
                <circle cx="110" cy="110" r="90" fill="url(#glow-bg)" />

                {/* Open book body */}
                <g filter="url(#shadow)" transform="translate(30, 70)">
                    {/* Left cover */}
                    <path d="M80 10 L6 30 L6 110 L80 90 Z" fill="url(#book-left)" rx="4" />
                    {/* Right cover */}
                    <path d="M80 10 L154 30 L154 110 L80 90 Z" fill="url(#book-right)" />
                    {/* Left page */}
                    <path d="M80 14 L12 32 L12 106 L80 88 Z" fill="url(#page-left)" opacity="0.9" />
                    {/* Right page */}
                    <path d="M80 14 L148 32 L148 106 L80 88 Z" fill="url(#page-right)" opacity="0.9" />
                    {/* Spine */}
                    <line x1="80" y1="10" x2="80" y2="90" stroke="rgba(99,102,241,0.4)" strokeWidth="2" />

                    {/* Lines on left page */}
                    <line x1="28" y1="50" x2="72" y2="42" stroke="rgba(99,102,241,0.25)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="62" x2="72" y2="54" stroke="rgba(99,102,241,0.25)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="74" x2="62" y2="67" stroke="rgba(99,102,241,0.25)" strokeWidth="2" strokeLinecap="round" />

                    {/* Lines on right page */}
                    <line x1="88" y1="50" x2="134" y2="42" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="88" y1="62" x2="134" y2="54" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="88" y1="74" x2="120" y2="67" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Floating sparkles */}
                <motion.circle
                    cx="175" cy="55" r="5"
                    fill="#fbbf24"
                    opacity="0.9"
                    animate={{ y: [-4, 4, -4], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                    cx="45" cy="65" r="3.5"
                    fill="#34d399"
                    opacity="0.8"
                    animate={{ y: [4, -4, 4], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.circle
                    cx="185" cy="140" r="4"
                    fill="#f472b6"
                    opacity="0.8"
                    animate={{ y: [-3, 5, -3], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.path
                    d="M155 48 L158 42 L161 48 L167 51 L161 54 L158 60 L155 54 L149 51 Z"
                    fill="#fbbf24"
                    opacity="0.9"
                    animate={{ rotate: [0, 20, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '158px 51px' }}
                />
                <motion.path
                    d="M42 120 L44 115 L46 120 L51 122 L46 124 L44 129 L42 124 L37 122 Z"
                    fill="#818cf8"
                    opacity="0.8"
                    animate={{ rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    style={{ transformOrigin: '44px 122px' }}
                />
            </svg>
        </motion.div>
    );
}

export default function WelcomePage() {
    const [leaving, setLeaving] = useState(false);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between py-10 px-6"
            style={{ background: 'var(--bg-primary)' }}
        >
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Logo size={36} showText />
            </motion.div>

            {/* Center content */}
            <div className="flex flex-col items-center text-center max-w-sm w-full">
                {/* Mascot */}
                <Mascot />

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-6 space-y-2"
                >
                    <h1 className="text-3xl font-extrabold text-white leading-snug">
                        Cara seru belajar
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Matematika & PPKn!
                        </span>
                    </h1>
                    <p className="text-white/40 text-base mt-3">
                        Belajar dengan cara yang menyenangkan, capai target harianmu, dan raih bintang!
                    </p>
                </motion.div>
            </div>

            {/* CTA buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-full max-w-sm space-y-3"
            >
                <Link
                    href="/register"
                    onClick={() => setLeaving(true)}
                    className="block w-full py-4 rounded-2xl text-center font-extrabold text-white text-base tracking-wide transition-all active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                    }}
                >
                    MULAI BELAJAR
                </Link>
                <Link
                    href="/login"
                    className="block w-full py-4 rounded-2xl text-center font-bold text-white/60 text-base tracking-wide transition-all active:scale-95 hover:text-white/90"
                    style={{
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.04)',
                    }}
                >
                    SUDAH PUNYA AKUN
                </Link>
            </motion.div>
        </div>
    );
}
