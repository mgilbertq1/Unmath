import type { ReactNode } from 'react';

interface StatBarProps {
  label: ReactNode;
  value: ReactNode;
}

export default function StatBar({ label, value }: StatBarProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="text-[var(--text-primary)] font-semibold">{value}</span>
    </div>
  );
}
