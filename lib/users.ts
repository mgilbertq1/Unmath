import fs from 'fs';
import path from 'path';
import { User, Badge, ShopItem, LevelProgress, LevelState, DailyRecord } from './types';
import { TOTAL_LEVELS } from './levels/level-definitions';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const DEFAULT_BADGES: Badge[] = [
    { id: 'first_win', name: 'Pemenang Pertama', description: 'Selesaikan level pertamamu', emoji: '🏆', earned: false },
    { id: 'streak_3', name: '3 Hari Berturut', description: 'Main 3 hari berturut-turut', emoji: '🔥', earned: false },
    { id: 'streak_7', name: 'Seminggu Juara', description: 'Main 7 hari berturut-turut', emoji: '🌟', earned: false },
    { id: 'all_math', name: 'Master Matematika', description: 'Selesaikan semua level Matematika', emoji: '📐', earned: false },
    { id: 'all_pkn', name: 'Warga Negara Teladan', description: 'Selesaikan semua level PKN', emoji: '🏛️', earned: false },
    { id: 'perfect_level', name: 'Sempurna!', description: 'Raih 3 bintang di satu level', emoji: '💯', earned: false },
    { id: 'speed_demon', name: 'Si Kilat', description: 'Jawab 5 soal berturut benar', emoji: '⚡', earned: false },
    { id: 'gem_spender', name: 'Big Spender', description: 'Belanja item di toko pertama kali', emoji: '💎', earned: false },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
    { id: 'heart_refill', name: 'Isi Nyawa', description: 'Isi ulang 5 nyawa instan', emoji: '❤️', price: 15, owned: 0, maxStack: 5 },
    { id: 'streak_freeze', name: 'Streak Freeze', description: 'Pertahankan streak 1 hari walau tidak main', emoji: '❄️', price: 20, owned: 0, maxStack: 3 },
    { id: 'double_xp', name: 'Double XP', description: '2x XP untuk sesi berikutnya', emoji: '⭐', price: 50, owned: 0, maxStack: 3 },
    { id: 'dark_theme', name: 'Tema Gelap', description: 'Unlock tema warna gelap eksklusif', emoji: '🌙', price: 100, owned: 0, maxStack: 1 },
];

function makeLevelStates(): LevelState[] {
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
        id: i + 1,
        status: i === 0 ? 'available' : 'locked',
        bestStars: 0,
        bestXP: 0,
    })) as LevelState[];
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
}

export function readUsers(): User[] {
    ensureDataDir();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw) as User[];

    // Migrasi: Tambahkan field default jika belum ada
    return users.map(u => ({
        ...u,
        totalXP: u.totalXP ?? 0,
        gems: u.gems ?? 50,
        avatar: u.avatar ?? '🦊',
        loginStreak: u.loginStreak ?? 0,
        longestStreak: u.longestStreak ?? 0,
        lastLoginDate: u.lastLoginDate ?? '',
        dailyTarget: u.dailyTarget ?? 30,
        levels: u.levels ?? { math: makeLevelStates(), pkn: makeLevelStates() },
        dailyHistory: u.dailyHistory ?? [],
        badges: u.badges ?? DEFAULT_BADGES,
        shopItems: u.shopItems ?? DEFAULT_SHOP_ITEMS,
    }));
}

export function writeUsers(users: User[]): void {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUserByUsername(username: string): User | undefined {
    return readUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function findUserById(id: string): User | undefined {
    return readUsers().find((u) => u.id === id);
}

export function createUser(username: string, passwordHash: string): User {
    const users = readUsers();
    const newUser: User = {
        id: crypto.randomUUID(),
        username,
        passwordHash,
        createdAt: new Date().toISOString(),
        totalXP: 0,
        gems: 50,
        avatar: '🦊',
        loginStreak: 0,
        longestStreak: 0,
        lastLoginDate: '',
        dailyTarget: 30,
        levels: {
            math: makeLevelStates(),
            pkn: makeLevelStates(),
        },
        dailyHistory: [],
        badges: DEFAULT_BADGES,
        shopItems: DEFAULT_SHOP_ITEMS,
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    writeUsers(users);
    return users[idx];
}
