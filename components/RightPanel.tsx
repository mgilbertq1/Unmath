export default function RightPanel() {
  return (
    <aside className="glass-card-strong w-80 p-6 hidden lg:block rounded-none border-y-0 border-r-0">

      <div className="glass-card p-4 mb-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">🎯 Target Harian</h3>

        <div className="w-full jawa-progress-track mt-3">
          <div className="jawa-progress-fill w-1/3" />
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-2">
          3 / 10 XP
        </p>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-2">📊 Statistik</h3>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          🔥 Streak: <span className="font-semibold text-[var(--text-primary)]">5 hari</span>
        </p>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          ⭐ XP: <span className="font-semibold text-[var(--text-primary)]">1,250</span>
        </p>
      </div>

    </aside>
  );
}
