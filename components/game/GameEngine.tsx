'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, computeStars, calcGems } from '@/lib/store/game-store';
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

    // Audio refs
    const themeAudioRef = useRef<HTMLAudioElement | null>(null);
    const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio
    useEffect(() => {
        themeAudioRef.current = new Audio('/sounds/backsound.mp3');
        themeAudioRef.current.loop = true;
        // set moderate volume for background music
        themeAudioRef.current.volume = 0.3;

        wrongAudioRef.current = new Audio('/sounds/wrong.ogg');
        wrongAudioRef.current.volume = 0.8;

        return () => {
            if (themeAudioRef.current) {
                themeAudioRef.current.pause();
                themeAudioRef.current = null;
            }
        };
    }, []);

    // Control theme music based on settings and game state
    useEffect(() => {
        if (!themeAudioRef.current) return;
        
        if (userStore.soundEnabled && !store.isGameComplete && !store.isGameOver) {
            themeAudioRef.current.play().catch(e => console.warn('Audio play prevented', e));
        } else {
            themeAudioRef.current.pause();
        }
    }, [userStore.soundEnabled, store.isGameComplete, store.isGameOver]);

    // Task 5: per-question timer
    const [timeLeft, setTimeLeft] = useState(30);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const answerStartTimeRef = useRef<number>(Date.now());

    const currentQuestion = store.questions[store.currentIndex];
    const maxTime = currentQuestion?.difficulty === 'hard' ? 45 : 30;

    // Start/reset timer when question changes
    useEffect(() => {
        if (!currentQuestion || store.isGameComplete || store.isGameOver) return;
        const t = maxTime;
        setTimeLeft(t);
        answerStartTimeRef.current = Date.now();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    // Time's up: count as wrong, consume life
                    store.answerQuestion('', false);
                    userStore.consumeLife();
                    setLastCorrect(false);
                    
                    if (userStore.soundEnabled && wrongAudioRef.current) {
                        wrongAudioRef.current.currentTime = 0;
                        wrongAudioRef.current.play().catch(e => console.warn('Audio play prevented', e));
                    }

                    setChecked(true);
                    setGivenAnswer('');
                    setEarnedPoints(0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.currentIndex, store.isGameComplete, store.isGameOver]);

    useEffect(() => {
        // Task 4: start game with daily lives
        store.startGame(subject, levelId, questions, userStore.dailyLives);
        setUnlockTriggered(false);
        userStore.checkDailyLogin();
        userStore.regenLives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if ((store.isGameComplete || store.isGameOver) && !unlockTriggered) {
            setUnlockTriggered(true);
            if (timerRef.current) clearInterval(timerRef.current);
            const stars = computeStars(store.answers);
            store.unlockNextLevel(subject, levelId, stars);

            const correctCount = store.answers.filter((a) => a.isCorrect).length;
            const isPerfect = correctCount === store.answers.length && store.answers.length > 0;
            const gemsEarned = calcGems(stars, isPerfect);

            userStore.addXP(store.xp);
            if (gemsEarned > 0) userStore.addGems(gemsEarned);

            // Task 6: check and award badges
            const levelProgress = store.levels;
            userStore.checkAndAwardBadges({
                subject,
                levelId,
                stars,
                correctCount,
                totalQuestions: store.answers.length,
                livesLeft: store.lives,
                bestStreak: store.bestStreak,
                sessionTimeSeconds: Math.round((Date.now() - store.sessionStartTime) / 1000),
                allLevelsMath: levelProgress.math,
                allLevelsPkn: levelProgress.pkn,
            });

            // Task 7: update daily challenge
            if (stars >= 1 && store.lives === store.maxLives) userStore.updateDailyChallenge('level_no_loss');
            if (store.bestStreak >= 5) userStore.updateDailyChallenge('streak_5');
            const sessionSec = Math.round((Date.now() - store.sessionStartTime) / 1000);
            if (stars >= 1 && sessionSec <= 180) userStore.updateDailyChallenge('level_fast');

            // Task 9: add leaderboard entry
            store.addLeaderboardEntry(subject, levelId, {
                username: userStore.username,
                score: store.xp,
                stars,
                date: new Date().toLocaleDateString('id-ID'),
                timeSeconds: sessionSec,
            });

            if (stars >= 1 && !store.isGameOver) setShowCelebration(true);
            syncGameData();
        }
    }, [store.isGameComplete, store.isGameOver, unlockTriggered, subject, levelId, store, userStore]);

    const handleAnswer = useCallback(
        (given: string | string[]) => {
            if (timerRef.current) clearInterval(timerRef.current);
            const elapsed = (Date.now() - answerStartTimeRef.current) / 1000;
            const quickAnswer = elapsed <= 10;
            const xpBefore = store.xp;
            const isCorrect = store.answerQuestion(given, quickAnswer);
            setLastCorrect(isCorrect);
            setChecked(true);
            setGivenAnswer(Array.isArray(given) ? given.join(', ') : given);
            setEarnedPoints(store.xp - xpBefore);
            // Task 4: consume daily life on wrong answer
            if (!isCorrect) {
                 userStore.consumeLife();
                 if (userStore.soundEnabled && wrongAudioRef.current) {
                     wrongAudioRef.current.currentTime = 0;
                     wrongAudioRef.current.play().catch(e => console.warn('Audio play prevented', e));
                 }
            }
            // Task 6: track consecutive quick answers for speed_demon badge
            if (isCorrect && quickAnswer) {
                const newCount = userStore.consecutiveQuickAnswers + 1;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (userStore as any).set?.({ consecutiveQuickAnswers: newCount });
            }
            // Task 7: correct_answer challenge
            if (isCorrect) userStore.updateDailyChallenge('correct_answer');
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [store, userStore]
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
        userStore.clearQuestionPowerUps();
    }, [store, userStore]);

    const handleRestart = useCallback(() => {
        store.startGame(subject, levelId, questions, userStore.dailyLives);
        setChecked(false);
        setLastCorrect(false);
        setSelectedAnswer(null);
        setGivenAnswer('');
        setEarnedPoints(0);
        setUnlockTriggered(false);
        setShowCelebration(false);
        userStore.clearQuestionPowerUps();
    }, [store, subject, levelId, questions, userStore]);

    const stars = computeStars(store.answers);
    const isPerfect = store.answers.length > 0 && store.answers.every((a) => a.isCorrect);
    const gemsEarned = calcGems(stars, isPerfect);

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
        easy: { label: 'Mudah', bg: 'rgba(122,158,126,0.16)', color: '#7A9E7E', border: 'rgba(122,158,126,0.3)' },
        medium: { label: 'Sedang', bg: 'rgba(198,167,94,0.16)', color: '#C6A75E', border: 'rgba(198,167,94,0.3)' },
        hard: { label: 'Sulit', bg: 'rgba(164,117,81,0.15)', color: '#A47551', border: 'rgba(164,117,81,0.3)' },
    }[currentQuestion.difficulty];

    const typeLabel: Record<string, string> = {
        'multiple-choice': 'Pilihan Ganda',
        'true-false': 'Benar / Salah',
        'drag-drop': 'Pasangkan',
        'type-answer': 'Ketik Jawaban',
    };

    const accentColor = subject === 'math' ? '#A47551' : '#6D8299';
    const accentLight = subject === 'math' ? '#D8A47F' : '#7A9E7E';

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
        <div className="w-full flex flex-col gap-3">
            <GameHeader
                currentIndex={store.currentIndex}
                totalQuestions={store.questions.length}
                xp={store.xp}
                lives={store.lives}
                maxLives={store.maxLives}
                streak={store.streak}
                subject={subject}
                timeLeft={timeLeft}
                maxTime={maxTime}
            />

            <QuestionCard questionKey={currentQuestion.id} subject={subject}>
                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: diffBadge.bg, color: diffBadge.color, border: `1px solid ${diffBadge.border}` }}
                    >
                        {diffBadge.label}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(109,130,153,0.14)', color: '#8FAAC0', border: '1px solid rgba(109,130,153,0.28)' }}
                    >
                        {typeLabel[currentQuestion.type]}
                    </span>
                    <span className="text-xs font-bold ml-auto"
                        style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(122,158,126,0.12)', color: '#7A9E7E', border: '1px solid rgba(122,158,126,0.25)' }}
                    >
                        +{currentQuestion.points} XP
                    </span>
                </div>

                {/* Question text */}
                <h2 className="font-bold mb-5 leading-snug" style={{ fontSize: 'clamp(16px,4vw,20px)', color: '#F0E8D8' }}>
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

            {/* Bottom bar: skip + confirm */}
            {!checked && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { store.skipQuestion(); setChecked(false); setSelectedAnswer(null); setGivenAnswer(''); }}
                        className="font-bold uppercase"
                        style={{
                            padding: '12px 18px', borderRadius: 13,
                            background: 'transparent',
                            border: '1px solid rgba(198,167,94,0.2)',
                            color: 'rgba(198,167,94,0.5)',
                            fontSize: 11, letterSpacing: '1px',
                            cursor: 'pointer', transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Lewati →
                    </button>

                    {/* PERIKSA — only for multiple-choice after selecting */}
                    {currentQuestion.type === 'multiple-choice' && selectedAnswer && (
                        <motion.button
                            onClick={handleMCSubmit}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{
                                opacity: 1, scale: 1,
                                boxShadow: [
                                    '0 6px 22px rgba(164,117,81,0.4)',
                                    '0 6px 32px rgba(164,117,81,0.65)',
                                    '0 6px 22px rgba(164,117,81,0.4)',
                                ],
                            }}
                            transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                            whileHover={{ y: -2, scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex-1 font-bold uppercase"
                            style={{
                                padding: '13px 0',
                                borderRadius: 14,
                                background: 'linear-gradient(135deg, #C6A75E, #A47551)',
                                color: '#1A0903',
                                fontSize: 13, letterSpacing: '1px',
                                border: 'none', cursor: 'pointer',
                            }}
                        >
                            Konfirmasi ⚔
                        </motion.button>
                    )}
                </div>
            )}
        </div>
    );
}
