'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GameEngine from '@/components/game/GameEngine';
import { getQuestionsForLevel, getLevelDefs } from '@/lib/levels/level-definitions';

function MathGame() {
  const params = useSearchParams();
  const router = useRouter();
  const levelId = parseInt(params.get('level') ?? '1', 10);

  // Validate level
  const levelDefs = getLevelDefs('math');
  const def = levelDefs.find((d) => d.id === levelId);
  if (!def) {
    router.replace('/game/math/levels');
    return null;
  }

  const questions = getQuestionsForLevel('math', levelId);

  return (
    <main className="theme-math">
      <div className="relative z-10 p-4 sm:p-6 py-6 sm:py-10">
        <GameEngine key={levelId} subject="math" levelId={levelId} questions={questions} />
      </div>
    </main>
  );
}

export default function MathGamePage() {
  return (
    <Suspense>
      <MathGame />
    </Suspense>
  );
}
