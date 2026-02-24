import { mathQuestions } from '../questions/math-questions';
import { pknQuestions } from '../questions/pkn-questions';
import { Question, Subject } from '../types';

export interface LevelDef {
    id: number;          // 1-based
    title: string;
    subtitle: string;
    emoji: string;
    questionIds: string[];
}

/** Math levels — 23 questions across 5 levels */
export const mathLevelDefs: LevelDef[] = [
    {
        id: 1,
        title: 'Aljabar Linear',
        subtitle: 'Persamaan & pertidaksamaan',
        emoji: '➕',
        questionIds: ['math-01', 'math-02', 'math-03', 'math-04'],
    },
    {
        id: 2,
        title: 'Fungsi Kuadrat',
        subtitle: 'Parabola & diskriminan',
        emoji: '📈',
        questionIds: ['math-05', 'math-06', 'math-07', 'math-08'],
    },
    {
        id: 3,
        title: 'Trigonometri',
        subtitle: 'Sudut-sudut istimewa',
        emoji: '📐',
        questionIds: ['math-09', 'math-10', 'math-11', 'math-12'],
    },
    {
        id: 4,
        title: 'Peluang & Statistika',
        subtitle: 'Data, rata-rata & peluang',
        emoji: '🎲',
        questionIds: ['math-13', 'math-14', 'math-15', 'math-16', 'math-17', 'math-18'],
    },
    {
        id: 5,
        title: 'Limit',
        subtitle: 'Nilai batas fungsi',
        emoji: '∞',
        questionIds: ['math-19', 'math-20', 'math-21', 'math-22', 'math-23'],
    },
];

/** PKN levels — 23 questions across 5 levels */
export const pknLevelDefs: LevelDef[] = [
    {
        id: 1,
        title: 'Pancasila',
        subtitle: 'Dasar negara & implementasi',
        emoji: '🌟',
        questionIds: ['pkn-01', 'pkn-02', 'pkn-03', 'pkn-04'],
    },
    {
        id: 2,
        title: 'UUD 1945',
        subtitle: 'Pasal-pasal penting',
        emoji: '📜',
        questionIds: ['pkn-05', 'pkn-06', 'pkn-07', 'pkn-08'],
    },
    {
        id: 3,
        title: 'Sistem Pemerintahan',
        subtitle: 'Presidensial & struktur NKRI',
        emoji: '🏛️',
        questionIds: ['pkn-09', 'pkn-10', 'pkn-11', 'pkn-12'],
    },
    {
        id: 4,
        title: 'Hak & Kewajiban',
        subtitle: 'Hak dan kewajiban warga negara',
        emoji: '⚖️',
        questionIds: ['pkn-13', 'pkn-14', 'pkn-15', 'pkn-16', 'pkn-17', 'pkn-18'],
    },
    {
        id: 5,
        title: 'Lembaga & Demokrasi',
        subtitle: 'Pemilu, lembaga negara',
        emoji: '🗳️',
        questionIds: ['pkn-19', 'pkn-20', 'pkn-21', 'pkn-22', 'pkn-23'],
    },
];

/** Get all level defs for a subject */
export function getLevelDefs(subject: Subject): LevelDef[] {
    return subject === 'math' ? mathLevelDefs : pknLevelDefs;
}

/** Get questions for a specific level */
export function getQuestionsForLevel(subject: Subject, levelId: number): Question[] {
    const defs = getLevelDefs(subject);
    const def = defs.find((d) => d.id === levelId);
    if (!def) return [];
    const allQ = subject === 'math' ? mathQuestions : pknQuestions;
    return allQ.filter((q) => def.questionIds.includes(q.id));
}

/** Total number of levels per subject */
export const TOTAL_LEVELS = 5;
