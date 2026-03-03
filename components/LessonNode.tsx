interface LessonNodeProps {
  label: number;
  stars?: number; // 0-3
  locked?: boolean;
  active?: boolean;
}

export default function LessonNode({
  label,
  stars = 0,
  locked = false,
  active = false,
}: LessonNodeProps) {
  let base =
    "w-56 rounded-3xl p-4 border text-sm font-semibold transition relative backdrop-blur-sm";

  if (locked) {
    base += " bg-[var(--bg-surface-soft)] text-[var(--text-muted)] border-[var(--border-subtle)]";
  } else if (active) {
    base += " text-white border-[var(--border-medium)] shadow-lg";
  } else {
    base += " bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:scale-[1.02] hover:shadow-md";
  }

  return (
    <div
      className={base}
      style={active ? { background: 'linear-gradient(135deg, var(--jawa-batik), var(--jawa-terracotta))' } : {}}
    >
      <p className={active ? 'text-white' : 'text-[var(--text-primary)]'}>Level {label}</p>
      <p className={`text-xs ${active ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>5 soal • ±2 menit</p>
      {!locked && (
        <div className="mt-2 flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < stars ? "text-[var(--jawa-gold)]" : active ? 'text-white/35' : "text-[var(--border-strong)]"}`}
            >
              ★
            </span>
          ))}
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 bg-[var(--bg-primary)]/45 flex items-center justify-center rounded-3xl">
          <span className="text-xl">🔒</span>
        </div>
      )}
    </div>
  );
}
