import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export async function GET() {
    const session = await getCurrentUser();
    if (!session) {
        return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const user = findUserById(session.userId);
    if (!user) {
        return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Return the full user object (excluding passwordHash for security)
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
}
