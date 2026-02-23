import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h1 className="text-2xl font-bold text-emerald-500">UNMAT</h1>

      <nav className="mt-10 flex flex-col gap-2 text-sm">
        <Link
          href="/"
          className="bg-sky-100 text-sky-600 px-4 py-3 rounded-2xl font-semibold"
        >
          Learn
        </Link>

        <Link href="#" className="px-4 py-3 rounded-2xl hover:bg-slate-100">
          🛒 Shop
        </Link>

        <Link
          href="/profile"
          className="px-4 py-3 rounded-2xl hover:bg-slate-100"
        >
          👤 Profile
        </Link>

        <Link href="#" className="px-4 py-3 rounded-2xl hover:bg-slate-100">
          ⚙️ Settings
        </Link>
      </nav>
    </aside>
  );
}
