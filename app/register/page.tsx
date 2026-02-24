'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useUserStore } from '@/lib/store/user-store';

import { IconArrowLeft, IconEye, IconEyeOff } from '@/components/Icons';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        if (!form.username || !form.password) return 'Semua kolom wajib diisi';
        if (form.username.length < 3) return 'Username minimal 3 karakter';
        if (form.username.length > 20) return 'Username maksimal 20 karakter';
        if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return 'Username hanya boleh huruf, angka, dan _';
        if (form.password.length < 6) return 'Password minimal 6 karakter';
        if (form.password !== form.confirm) return 'Konfirmasi password tidak cocok';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: form.username, password: form.password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Pendaftaran gagal');
            } else {
                // Clear state for new user
                useUserStore.getState().resetProgress();
                // Hard redirect to welcome animation/success
                window.location.href = `/welcome-done?name=${encodeURIComponent(form.username)}`;
            }
        } catch {
            setError('Tidak dapat terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.06)',
        border: '1.5px solid rgba(255,255,255,0.1)',
    };
    const focusStyle = {
        border: '1.5px solid rgba(99,102,241,0.5)',
        boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    };
    const blurStyle = { border: '1.5px solid rgba(255,255,255,0.1)', boxShadow: 'none' };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6"
            style={{ background: 'var(--bg-primary)' }}
        >
            <Link href="/welcome" className="absolute top-6 left-6 text-white/30 hover:text-white/70 transition-colors">
                <IconArrowLeft size={24} />
            </Link>

            <div className="w-full max-w-sm">
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
                    <h1 className="text-xl font-extrabold text-white mb-1">Daftar</h1>
                    <p className="text-white/30 text-sm mb-6">Buat akunmu dan mulai belajar!</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="Pilih username unik"
                                autoComplete="username"
                                maxLength={20}
                                className="w-full py-3 px-4 rounded-xl text-white text-sm outline-none transition-all duration-200"
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                                required
                            />
                            <p className="text-xs text-white/20 mt-1">Huruf, angka, dan _ saja · {form.username.length}/20</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Minimal 6 karakter"
                                    autoComplete="new-password"
                                    className="w-full py-3 px-4 pr-12 rounded-xl text-white text-sm outline-none transition-all duration-200"
                                    style={inputStyle}
                                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                    onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPass ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                                Konfirmasi Password
                            </label>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Ulangi password"
                                autoComplete="new-password"
                                className="w-full py-3 px-4 rounded-xl text-white text-sm outline-none transition-all duration-200"
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                                required
                            />
                            {form.confirm && form.password !== form.confirm && (
                                <p className="text-xs text-red-400 mt-1">Password tidak cocok</p>
                            )}
                            {form.confirm && form.password === form.confirm && form.confirm.length > 0 && (
                                <p className="text-xs text-emerald-400 mt-1">✓ Password cocok</p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-semibold rounded-xl px-4 py-2.5"
                                style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}
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
                                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                                boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.35)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Mendaftarkan...' : 'DAFTAR SEKARANG'}
                        </motion.button>
                    </form>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-white/30 text-sm mt-5"
                >
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                        Masuk
                    </Link>
                </motion.p>
            </div>
        </div>
    );
}
