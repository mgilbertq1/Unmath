import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { findUserByUsername, createUser } from '@/lib/users';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
        }
        if (username.length < 3 || username.length > 20) {
            return NextResponse.json({ error: 'Username harus 3-20 karakter' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return NextResponse.json({ error: 'Username hanya boleh huruf, angka, dan underscore' }, { status: 400 });
        }

        // Check existing user
        const existing = findUserByUsername(username);
        if (existing) {
            return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 });
        }

        // Create user
        const passwordHash = await hashPassword(password);
        const user = createUser(username, passwordHash);

        // Sign JWT
        const token = await signToken({ userId: user.id, username: user.username });

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username },
        });

        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
