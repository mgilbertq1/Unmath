'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GameEngine from '@/components/game/GameEngine';
import { getQuestionsForLevel, getLevelDefs } from '@/lib/levels/level-definitions';

function PKNGame() {
  const params = useSearchParams();
  const router = useRouter();
  const levelId = parseInt(params.get('level') ?? '1', 10);

  const levelDefs = getLevelDefs('pkn');
  const def = levelDefs.find((d) => d.id === levelId);
  if (!def) {
    router.replace('/game/pkn/levels');
    return null;
  }

  const questions = getQuestionsForLevel('pkn', levelId);

  return (
    <main className="theme-pkn">
      <div className="relative z-10 p-4 sm:p-6 py-6 sm:py-10">
        <GameEngine key={levelId} subject="pkn" levelId={levelId} questions={questions} />
      </div>
    </main>
  );
}

export default function PKNGamePage() {
  return (
    <Suspense>
      <PKNGame />
    </Suspense>
  );
}
