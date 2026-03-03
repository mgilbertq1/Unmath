export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      glass-card
      p-6
      rounded-3xl
      border
    ">
      {children}
    </div>
  );
}
