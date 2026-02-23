export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full relative">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
