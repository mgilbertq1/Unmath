'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useUserStore } from '@/lib/store/user-store';

import { IconArrowLeft, IconEye, IconEyeOff } from '@/components/Icons';

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login gagal');
            } else {
                // Clear state to load new user data
                useUserStore.getState().resetProgress();
                // Hard redirect so the new JWT cookie is read by the proxy
                window.location.href = '/';
            }
        } catch {
            setError('Tidak dapat terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none opacity-65" style={{ backgroundImage: 'var(--batik-pattern)', backgroundSize: '24px 24px' }} />

            {/* Back to welcome */}
            <Link href="/welcome" className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10">
                <IconArrowLeft size={24} />
            </Link>

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <Logo size={34} showText />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card-strong p-6"
                >
                    <h1 className="text-4xl font-heading leading-none text-[var(--text-primary)] mb-1">Masuk</h1>
                    <p className="text-[var(--text-secondary)] text-sm mb-6">Selamat datang kembali!</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="Username kamu"
                                autoComplete="username"
                                className="w-full py-3 px-4 rounded-xl text-[var(--text-primary)] text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'var(--bg-surface-soft)',
                                    border: '1.5px solid var(--border-subtle)',
                                }}
                                onFocus={(e) => {
                                    e.target.style.border = '1.5px solid var(--border-strong)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(164,117,81,0.14)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.border = '1.5px solid var(--border-subtle)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full py-3 px-4 pr-12 rounded-xl text-[var(--text-primary)] text-sm outline-none transition-all duration-200"
                                    style={{
                                        background: 'var(--bg-surface-soft)',
                                        border: '1.5px solid var(--border-subtle)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = '1.5px solid var(--border-strong)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(164,117,81,0.14)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = '1.5px solid var(--border-subtle)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {showPass ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-semibold rounded-xl px-4 py-2.5"
                                style={{ background: 'rgba(164,117,81,0.14)', color: 'var(--jawa-batik)' }}
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm tracking-wide transition-all mt-2"
                            style={{
                                background: loading ? 'rgba(164,117,81,0.35)' : 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))',
                                boxShadow: loading ? 'none' : '0 10px 24px rgba(164,117,81,0.28)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Memproses...' : 'MASUK'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Register link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-[var(--text-secondary)] text-sm mt-5"
                >
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-[var(--jawa-batik)] font-bold hover:text-[var(--jawa-terracotta)] transition-colors">
                        Daftar sekarang
                    </Link>
                </motion.p>
            </div>
        </div>
    );
}
