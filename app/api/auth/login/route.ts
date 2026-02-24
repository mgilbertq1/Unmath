import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { findUserByUsername } from '@/lib/users';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
        }

        const token = await signToken({ userId: user.id, username: user.username });

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username },
        });

        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
