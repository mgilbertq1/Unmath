  import Sidebar from "@/components/Sidebar";
  import RightPanel from "@/components/RightPanel";
  import LessonNode from "@/components/LessonNode";
  import Link from "next/link";

  export default function MathPage() {
    const levels = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
      <main className="bg-sky-100 min-h-screen flex">
        <Sidebar />

        <section className="flex-1 flex justify-center p-10">
          <div className="w-full max-w-xl">
            <h1 className="text-2xl font-bold text-slate-800">Matematika</h1>

            <div className="mt-10 flex flex-col items-center gap-6">
              {levels.map((lvl, idx) => {
                let align = "translate-x-0";

                if (idx % 3 === 1) align = "-translate-x-10";
                if (idx % 3 === 2) align = "translate-x-10";

                // demo values: level 1 active with 3 stars, level2 unlocked 2 stars, level3 unlocked 1 star
                const active = lvl === 1;
                const locked = lvl > 3;
                const stars = lvl === 1 ? 3 : lvl === 2 ? 2 : lvl === 3 ? 1 : 0;

                return (
                  <div key={lvl} className={align}>
                    <LessonNode
                      label={lvl}
                      active={active}
                      locked={locked}
                      stars={stars}
                    />
                  </div>
                );
              })}
            </div>

            <Link
              href="/game/math"
              className="block text-center mt-10 bg-sky-500 text-white py-4 rounded-3xl shadow-md font-semibold"
            >
              Masuk Level (Demo)
            </Link>
          </div>
        </section>

        <RightPanel />
      </main>
    );
  }
