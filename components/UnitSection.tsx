import LessonNode from "./LessonNode";

export default function UnitSection({ title, subtitle }: any) {
  return (
    <div className="mb-20">

      <div className="bg-sky-500 text-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm opacity-90">{subtitle}</p>
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
