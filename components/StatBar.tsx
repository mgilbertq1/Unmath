export default function StatBar({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-semibold">{value}</span>
    </div>
  );
}
