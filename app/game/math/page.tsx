'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GameEngine from '@/components/game/GameEngine';
import { getQuestionsForLevel, getLevelDefs } from '@/lib/levels/level-definitions';
import WayangGameShell from '@/components/game/WayangGameShell';

function MathGame() {
  const params = useSearchParams();
  const router = useRouter();
  const levelId = parseInt(params.get('level') ?? '1', 10);

  const levelDefs = getLevelDefs('math');
  const def = levelDefs.find((d) => d.id === levelId);
  if (!def) {
    router.replace('/game/math/levels');
    return null;
  }

  const questions = getQuestionsForLevel('math', levelId);

  return (
    <WayangGameShell subject="math">
      <GameEngine key={levelId} subject="math" levelId={levelId} questions={questions} />
    </WayangGameShell>
  );
}

export default function MathGamePage() {
  return (
    <Suspense>
      <MathGame />
    </Suspense>
  );
}
