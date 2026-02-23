export default function RightPanel() {
  return (
    <aside className="w-80 bg-white border-l p-6 hidden lg:block">

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-800">Daily Target</h3>

        <div className="w-full bg-slate-200 h-3 rounded-full mt-3">
          <div className="bg-sky-500 h-3 rounded-full w-1/3"></div>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          3 / 10 XP
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 mt-4">
        <h3 className="font-semibold text-slate-800">Statistik</h3>

        <p className="text-sm text-slate-600 mt-2">
          🔥 Streak: <span className="font-semibold">5 hari</span>
        </p>

        <p className="text-sm text-slate-600">
          ⭐ XP: <span className="font-semibold">1,250</span>
        </p>
      </div>

    </aside>
  );
}
