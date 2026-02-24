import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'unmath-secret-key-change-in-production-2025'
);

export const COOKIE_NAME = 'unmath_token';

export interface JWTPayload {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
}

/** Sign a JWT token valid for 30 days */
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(JWT_SECRET);
}

/** Verify and decode a JWT token. Returns null if invalid. */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

/** Hash a plaintext password */
export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 12);
}

/** Verify a plaintext password against a hash */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

/** Get current user from JWT cookie (server-side) */
export async function getCurrentUser(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}
