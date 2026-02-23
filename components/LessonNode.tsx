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
    "w-56 rounded-3xl p-4 shadow-sm border text-sm font-semibold transition relative";

  if (locked) {
    base += " bg-slate-100 text-slate-400 border-slate-200";
  } else if (active) {
    base += " bg-sky-500 text-white border-sky-500";
  } else {
    base += " bg-white text-slate-700 border-slate-200 hover:scale-[1.02]";
  }

  return (
    <div className={base}>
      <p>Level {label}</p>
      <p className="text-xs opacity-70">5 soal • ±2 menit</p>
      {!locked && (
        <div className="mt-2 flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < stars ? "text-amber-400" : "text-slate-300"}`}
            >
              ★
            </span>
          ))}
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-3xl">
          <span className="text-xl">🔒</span>
        </div>
      )}
    </div>
  );
}
