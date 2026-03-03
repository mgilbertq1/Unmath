import { mathQuestions } from '../questions/math-questions';
import { pknQuestions } from '../questions/pkn-questions';
import { Question, Subject } from '../types';

export interface LevelDef {
    id: number;          // 1-based
    title: string;
    subtitle: string;
    emoji: string;
    questionIds: string[];  // kept for backward compat
    poolIds: string[];      // full bank of questions for this level
    questionCount: number;  // how many to randomly pick per session
}

/** Math levels */
export const mathLevelDefs: LevelDef[] = [
    {
        id: 1,
        title: 'Aljabar Linear',
        subtitle: 'Persamaan & pertidaksamaan',
        emoji: '➕',
        questionIds: ['math-01', 'math-02', 'math-03', 'math-04'],
        poolIds: ['math-01', 'math-02', 'math-03', 'math-04', 'math-a01', 'math-a02', 'math-a03', 'math-a04', 'math-a05', 'math-a06', 'math-a07', 'math-a08', 'math-a09', 'math-a10', 'math-a11'],
        questionCount: 5,
    },
    {
        id: 2,
        title: 'Fungsi Kuadrat',
        subtitle: 'Parabola & diskriminan',
        emoji: '📈',
        questionIds: ['math-05', 'math-06', 'math-07', 'math-08'],
        poolIds: ['math-05', 'math-06', 'math-07', 'math-08', 'math-b01', 'math-b02', 'math-b03', 'math-b04', 'math-b05', 'math-b06', 'math-b07', 'math-b08', 'math-b09', 'math-b10', 'math-b11'],
        questionCount: 5,
    },
    {
        id: 3,
        title: 'Trigonometri',
        subtitle: 'Sudut-sudut istimewa',
        emoji: '📐',
        questionIds: ['math-09', 'math-10', 'math-11', 'math-12'],
        poolIds: ['math-09', 'math-10', 'math-11', 'math-12', 'math-c01', 'math-c02', 'math-c03', 'math-c04', 'math-c05', 'math-c06', 'math-c07', 'math-c08', 'math-c09', 'math-c10', 'math-c11'],
        questionCount: 5,
    },
    {
        id: 4,
        title: 'Peluang & Statistika',
        subtitle: 'Data, rata-rata & peluang',
        emoji: '🎲',
        questionIds: ['math-13', 'math-14', 'math-15', 'math-16', 'math-17', 'math-18'],
        poolIds: ['math-13', 'math-14', 'math-15', 'math-16', 'math-17', 'math-18', 'math-d01', 'math-d02', 'math-d03', 'math-d04', 'math-d05', 'math-d06', 'math-d07', 'math-d08', 'math-d09'],
        questionCount: 5,
    },
    {
        id: 5,
        title: 'Limit',
        subtitle: 'Nilai batas fungsi',
        emoji: '∞',
        questionIds: ['math-19', 'math-20', 'math-21', 'math-22', 'math-23'],
        poolIds: ['math-19', 'math-20', 'math-21', 'math-22', 'math-23', 'math-e01', 'math-e02', 'math-e03', 'math-e04', 'math-e05', 'math-e06', 'math-e07', 'math-e08', 'math-e09'],
        questionCount: 5,
    },
];

/** PKN levels */
export const pknLevelDefs: LevelDef[] = [
    {
        id: 1,
        title: 'Pancasila',
        subtitle: 'Dasar negara & implementasi',
        emoji: '🌟',
        questionIds: ['pkn-01', 'pkn-02', 'pkn-03', 'pkn-04'],
        poolIds: ['pkn-01', 'pkn-02', 'pkn-03', 'pkn-04', 'pkn-a01', 'pkn-a02', 'pkn-a03', 'pkn-a04', 'pkn-a05', 'pkn-a06', 'pkn-a07', 'pkn-a08', 'pkn-a09', 'pkn-a10', 'pkn-a11'],
        questionCount: 5,
    },
    {
        id: 2,
        title: 'UUD 1945',
        subtitle: 'Pasal-pasal penting',
        emoji: '📜',
        questionIds: ['pkn-05', 'pkn-06', 'pkn-07', 'pkn-08'],
        poolIds: ['pkn-05', 'pkn-06', 'pkn-07', 'pkn-08', 'pkn-b01', 'pkn-b02', 'pkn-b03', 'pkn-b04', 'pkn-b05', 'pkn-b06', 'pkn-b07', 'pkn-b08', 'pkn-b09', 'pkn-b10', 'pkn-b11'],
        questionCount: 5,
    },
    {
        id: 3,
        title: 'Sistem Pemerintahan',
        subtitle: 'Presidensial & struktur NKRI',
        emoji: '🏛️',
        questionIds: ['pkn-09', 'pkn-10', 'pkn-11', 'pkn-12'],
        poolIds: ['pkn-09', 'pkn-10', 'pkn-11', 'pkn-12', 'pkn-c01', 'pkn-c02', 'pkn-c03', 'pkn-c04', 'pkn-c05', 'pkn-c06', 'pkn-c07', 'pkn-c08', 'pkn-c09', 'pkn-c10', 'pkn-c11'],
        questionCount: 5,
    },
    {
        id: 4,
        title: 'Hak & Kewajiban',
        subtitle: 'Hak dan kewajiban warga negara',
        emoji: '⚖️',
        questionIds: ['pkn-13', 'pkn-14', 'pkn-15', 'pkn-16', 'pkn-17', 'pkn-18'],
        poolIds: ['pkn-13', 'pkn-14', 'pkn-15', 'pkn-16', 'pkn-17', 'pkn-18', 'pkn-d01', 'pkn-d02', 'pkn-d03', 'pkn-d04', 'pkn-d05', 'pkn-d06', 'pkn-d07', 'pkn-d08', 'pkn-d09'],
        questionCount: 5,
    },
    {
        id: 5,
        title: 'Lembaga & Demokrasi',
        subtitle: 'Pemilu, lembaga negara',
        emoji: '🗳️',
        questionIds: ['pkn-19', 'pkn-20', 'pkn-21', 'pkn-22', 'pkn-23'],
        poolIds: ['pkn-19', 'pkn-20', 'pkn-21', 'pkn-22', 'pkn-23', 'pkn-e01', 'pkn-e02', 'pkn-e03', 'pkn-e04', 'pkn-e05', 'pkn-e06', 'pkn-e07', 'pkn-e08', 'pkn-e09'],
        questionCount: 5,
    },
];

/** Get all level defs for a subject */
export function getLevelDefs(subject: Subject): LevelDef[] {
    return subject === 'math' ? mathLevelDefs : pknLevelDefs;
}

/** Fisher-Yates shuffle */
function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Get questions for a specific level.
 * Randomly samples `questionCount` questions from the pool (no duplicates).
 */
export function getQuestionsForLevel(subject: Subject, levelId: number): Question[] {
    const defs = getLevelDefs(subject);
    const def = defs.find((d) => d.id === levelId);
    if (!def) return [];
    const allQ = subject === 'math' ? mathQuestions : pknQuestions;
    const pool = allQ.filter((q) => def.poolIds.includes(q.id));
    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, Math.min(def.questionCount, shuffled.length));
}

/** Total number of levels per subject */
export const TOTAL_LEVELS = 5;
