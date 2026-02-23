import Link from "next/link";

export default function Button({ href, children }: any) {
  return (
    <Link
      href={href}
      className="
        block
        text-center
        bg-sky-500
        hover:bg-sky-400
        text-white
        px-4 py-3
        rounded-2xl
        font-semibold
        shadow-sm
        active:scale-95
        transition
      "
    >
      {children}
    </Link>
  );
}
