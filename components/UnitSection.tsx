import LessonNode from "./LessonNode";

interface UnitSectionProps {
  title: string;
  subtitle: string;
}

export default function UnitSection({ title, subtitle }: UnitSectionProps) {
  return (
    <div className="mb-20">

      <div
        className="text-white rounded-3xl p-6 shadow-sm border border-[var(--border-medium)]"
        style={{ background: 'linear-gradient(145deg, var(--jawa-batik), var(--jawa-terracotta))' }}
      >
        <h2 className="text-2xl font-heading font-semibold leading-none">{title}</h2>
        <p className="text-sm text-white/85 mt-1">{subtitle}</p>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <div className="flex justify-center">
          <LessonNode label={1} active stars={3} />
        </div>

        <div className="flex justify-start">
          <LessonNode label={2} stars={2} />
        </div>

        <div className="flex justify-end">
          <LessonNode label={3} stars={1} />
        </div>

        <div className="flex justify-center">
          <LessonNode label={4} locked />
        </div>
      </div>
    </div>
  );
}
