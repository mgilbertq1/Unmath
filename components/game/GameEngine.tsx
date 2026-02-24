'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore, computeStars } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { Question, Subject } from '@/lib/types';
import { TOTAL_LEVELS } from '@/lib/levels/level-definitions';
import { syncGameData } from '@/lib/sync';
import GameHeader from './GameHeader';
import QuestionCard from './QuestionCard';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import DragDrop from './DragDrop';
import TypeAnswer from './TypeAnswer';
import FeedbackOverlay from './FeedbackOverlay';
import ResultScreen from './ResultScreen';
import LevelUpCelebration from './LevelUpCelebration';

interface GameEngineProps {
    subject: Subject;
    levelId: number;
    questions: Question[];
}

export default function GameEngine({ subject, levelId, questions }: GameEngineProps) {
    const store = useGameStore();
    const userStore = useUserStore();

    const [checked, setChecked] = useState(false);
    const [lastCorrect, setLastCorrect] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [givenAnswer, setGivenAnswer] = useState<string>('');
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [unlockTriggered, setUnlockTriggered] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        store.startGame(subject, levelId, questions);
        setUnlockTriggered(false);
        userStore.checkDailyLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentQuestion = store.questions[store.currentIndex];

    useEffect(() => {
        if ((store.isGameComplete || store.isGameOver) && !unlockTriggered) {
            setUnlockTriggered(true);
            const stars = computeStars(store.answers);
            store.unlockNextLevel(subject, levelId, stars);

            userStore.addXP(store.xp);
            const gemsEarned = stars >= 3 ? 15 : stars >= 2 ? 10 : stars >= 1 ? 5 : 0;
            if (gemsEarned > 0) userStore.addGems(gemsEarned);

            if (stars >= 1) userStore.earnBadge('first_win');
            if (stars === 3) userStore.earnBadge('perfect_level');
            if (store.bestStreak >= 5) userStore.earnBadge('speed_demon');
            if (stars >= 1 && !store.isGameOver) setShowCelebration(true);

            // Simpan ke server
            syncGameData();
        }
    }, [store.isGameComplete, store.isGameOver, unlockTriggered, subject, levelId, store, userStore]);

    const handleAnswer = useCallback(
        (given: string | string[]) => {
            const xpBefore = store.xp;
            const isCorrect = store.answerQuestion(given);
            setLastCorrect(isCorrect);
            setChecked(true);
            setGivenAnswer(Array.isArray(given) ? given.join(', ') : given);
            setEarnedPoints(store.xp - xpBefore);
        },
        [store]
    );

    const handleMCSelect = useCallback((opt: string) => {
        if (!checked) setSelectedAnswer(opt);
    }, [checked]);

    const handleMCSubmit = useCallback(() => {
        if (selectedAnswer && !checked) handleAnswer(selectedAnswer);
    }, [selectedAnswer, checked, handleAnswer]);

    const handleTFSelect = useCallback((value: string) => {
        if (!checked) { setSelectedAnswer(value); handleAnswer(value); }
    }, [checked, handleAnswer]);

    const handleContinue = useCallback(() => {
        store.nextQuestion();
        setChecked(false);
        setLastCorrect(false);
        setSelectedAnswer(null);
        setGivenAnswer('');
        setEarnedPoints(0);
    }, [store]);

    const handleRestart = useCallback(() => {
        store.startGame(subject, levelId, questions);
        setChecked(false);
        setLastCorrect(false);
        setSelectedAnswer(null);
        setGivenAnswer('');
        setEarnedPoints(0);
        setUnlockTriggered(false);
        setShowCelebration(false);
    }, [store, subject, levelId, questions]);

    const stars = computeStars(store.answers);
    const gemsEarned = stars >= 3 ? 15 : stars >= 2 ? 10 : stars >= 1 ? 5 : 0;

    if (showCelebration && (store.isGameComplete || store.isGameOver)) {
        return (
            <>
                <ResultScreen
                    answers={store.answers}
                    xp={store.xp}
                    lives={store.lives}
                    maxLives={store.maxLives}
                    streak={store.streak}
                    bestStreak={store.bestStreak}
                    subject={subject}
                    levelId={levelId}
                    stars={stars}
                    isGameOver={store.isGameOver}
                    hasNextLevel={levelId < TOTAL_LEVELS}
                    onRestart={handleRestart}
                />
                <LevelUpCelebration
                    show={showCelebration}
                    levelId={levelId}
                    stars={stars}
                    xpEarned={store.xp}
                    gemsEarned={gemsEarned}
                    subject={subject}
                    onClose={() => setShowCelebration(false)}
                />
            </>
        );
    }

    if (store.isGameOver || store.isGameComplete) {
        return (
            <ResultScreen
                answers={store.answers}
                xp={store.xp}
                lives={store.lives}
                maxLives={store.maxLives}
                streak={store.streak}
                bestStreak={store.bestStreak}
                subject={subject}
                levelId={levelId}
                stars={stars}
                isGameOver={store.isGameOver}
                hasNextLevel={levelId < TOTAL_LEVELS}
                onRestart={handleRestart}
            />
        );
    }

    if (!currentQuestion) return null;

    const diffBadge = {
        easy: { label: 'Mudah', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
        medium: { label: 'Sedang', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
        hard: { label: 'Sulit', bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' },
    }[currentQuestion.difficulty];

    const typeLabel: Record<string, string> = {
        'multiple-choice': 'Pilihan Ganda',
        'true-false': 'Benar / Salah',
        'drag-drop': 'Pasangkan',
        'type-answer': 'Ketik Jawaban',
    };

    const accentColor = subject === 'math' ? '#6366f1' : '#10b981';
    const accentLight = subject === 'math' ? '#818cf8' : '#34d399';

    const renderQuestionType = () => {
        switch (currentQuestion.type) {
            case 'multiple-choice':
                return (
                    <>
                        <MultipleChoice
                            options={currentQuestion.options || []}
                            onSelect={handleMCSelect}
                            disabled={checked}
                            selectedAnswer={selectedAnswer}
                            correctAnswer={currentQuestion.answer as string}
                            checked={checked}
                            subject={subject}
                        />
                        {!checked && selectedAnswer && (
                            <button
                                onClick={handleMCSubmit}
                                className="mt-4 w-full py-3.5 rounded-2xl font-bold text-white text-base active:scale-95 transition-all duration-200"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                                    boxShadow: `0 4px 24px ${accentColor}33`,
                                }}
                            >
                                PERIKSA
                            </button>
                        )}
                    </>
                );
            case 'true-false':
                return (
                    <TrueFalse
                        onSelect={handleTFSelect}
                        disabled={checked}
                        selectedAnswer={selectedAnswer}
                        correctAnswer={currentQuestion.answer as string}
                        checked={checked}
                        subject={subject}
                    />
                );
            case 'drag-drop':
                return (
                    <DragDrop
                        pairs={currentQuestion.pairs || []}
                        onSubmit={(answer) => handleAnswer(answer)}
                        disabled={checked}
                        checked={checked}
                        correctAnswer={currentQuestion.answer as string[]}
                        subject={subject}
                    />
                );
            case 'type-answer':
                return (
                    <TypeAnswer
                        onSubmit={(value) => handleAnswer(value)}
                        disabled={checked}
                        checked={checked}
                        correctAnswer={currentQuestion.answer as string}
                        givenAnswer={givenAnswer}
                        subject={subject}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* Back to map */}
            <button
                onClick={() => window.history.back()}
                className="text-white/30 hover:text-white/60 text-sm font-bold mb-4 flex items-center gap-1.5 transition-colors"
            >
                ← Peta Level
            </button>

            <GameHeader
                currentIndex={store.currentIndex}
                totalQuestions={store.questions.length}
                xp={store.xp}
                lives={store.lives}
                maxLives={store.maxLives}
                streak={store.streak}
                subject={subject}
            />

            <div className="mt-5">
                <QuestionCard questionKey={currentQuestion.id} subject={subject}>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: diffBadge.bg, color: diffBadge.color, border: `1px solid ${diffBadge.border}` }}
                        >
                            {diffBadge.label}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                        >
                            {typeLabel[currentQuestion.type]}
                        </span>
                        <span className="text-xs font-bold text-white/30 ml-auto">
                            +{currentQuestion.points} XP
                        </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white mb-5 leading-snug">
                        {currentQuestion.question}
                    </h2>

                    {renderQuestionType()}

                    <FeedbackOverlay
                        show={checked}
                        isCorrect={lastCorrect}
                        explanation={currentQuestion.explanation}
                        points={earnedPoints}
                        streak={store.streak}
                        onContinue={handleContinue}
                    />
                </QuestionCard>
            </div>

            {!checked && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => { store.skipQuestion(); setChecked(false); setSelectedAnswer(null); setGivenAnswer(''); }}
                        className="text-sm text-white/20 hover:text-white/40 font-semibold transition-colors py-2 px-4"
                    >
                        LEWATI →
                    </button>
                </div>
            )}
        </div>
    );
}
