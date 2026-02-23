import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";

export default function Home() {
  return (
    <main className="bg-sky-100 min-h-screen flex">
      <Sidebar />

      <section className="flex-1 flex justify-center p-10">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 flex justify-between text-sm font-semibold text-slate-700">
            <span>❤️ 3 Lives</span>
            <span>🔥 Streak 5</span>
            <span>⭐ 1,250 XP</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-6">
            Pilih Pelajaran
          </h1>

          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/math"
              className="bg-white rounded-3xl p-6 shadow-md hover:scale-[1.02] transition"
            >
              <h2 className="text-lg font-bold text-sky-600">📘 Matematika</h2>
              <p className="text-sm text-slate-500">
                Pecahan, Aljabar, Logika, dll
              </p>
            </Link>

            <Link
              href="/pkn"
              className="bg-white rounded-3xl p-6 shadow-md hover:scale-[1.02] transition"
            >
              <h2 className="text-lg font-bold text-indigo-600">🏛️ PPKn</h2>
              <p className="text-sm text-slate-500">
                Pancasila, UUD 1945, Hak & Kewajiban
              </p>
            </Link>
          </div>
        </div>
      </section>

      <RightPanel />
    </main>
  );
}
