'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GameEngine from '@/components/game/GameEngine';
import { getQuestionsForLevel, getLevelDefs } from '@/lib/levels/level-definitions';
import WayangGameShell from '@/components/game/WayangGameShell';

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
    <WayangGameShell subject="pkn">
      <GameEngine key={levelId} subject="pkn" levelId={levelId} questions={questions} />
    </WayangGameShell>
  );
}

export default function PKNGamePage() {
  return (
    <Suspense>
      <PKNGame />
    </Suspense>
  );
}
