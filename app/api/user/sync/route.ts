import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateUser } from '@/lib/users';

export async function POST(request: NextRequest) {
    try {
        const session = await getCurrentUser();
        if (!session) {
            return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
        }

        const updates = await request.json();

        // Sanitize updates - don't allow changing sensitive fields via this endpoint
        const safeUpdates = { ...updates };
        delete safeUpdates.id;
        delete safeUpdates.username;
        delete safeUpdates.passwordHash;
        delete safeUpdates.createdAt;

        const updatedUser = updateUser(session.userId, safeUpdates);
        if (!updatedUser) {
            return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan sinkronisasi' }, { status: 500 });
    }
}
