export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white
      p-6
      rounded-3xl
      shadow-sm
      border border-slate-200
    ">
      {children}
    </div>
  );
}
