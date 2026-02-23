"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GamePage() {
  // clear any stored answers when entering this game
  useEffect(() => {
    sessionStorage.removeItem("gameAnswers");
  }, []);
  /**
   * Duolingo-style question set: each item can either be multiple-choice or
   * typing.  The UI will adapt accordingly, giving the feel of a more
   * interactive "stage" rather than a simple quiz.
   */
  const questions = [
    {
      question: "Apa bunyi sila pertama Pancasila?",
      type: "multiple-choice",
      options: [
        "Ketuhanan Yang Maha Esa",
        "Kemanusiaan yang adil dan beradab",
        "Persatuan Indonesia",
        "Kerakyatan yang dipimpin hikmat kebijaksanaan",
      ],
      answer: "Ketuhanan Yang Maha Esa",
    },
    {
      question: "Lembaga yang membuat undang-undang adalah?",
      type: "typing",
      answer: "DPR",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [remainingTime, setRemainingTime] = useState(5 * 60); // 5 minutes in seconds
  const [answers, setAnswers] = useState<
    Array<{
      question: string;
      given: string;
      correct: string;
      isCorrect: boolean;
    }>
  >([]);

  const currentQuestion = questions[current] || null;
  const isCorrect =
    checked &&
    currentQuestion !== null &&
    (currentQuestion.type === "typing"
      ? typed.trim() === currentQuestion.answer
      : selected === currentQuestion.answer);

  function handleCheck() {
    if (currentQuestion.type === "typing") {
      if (typed.trim().length === 0) return;
    } else {
      if (!selected) return;
    }

    const given = currentQuestion.type === "typing" ? typed.trim() : selected!;

    const correct = given === currentQuestion.answer;

    const newEntry = {
      question: currentQuestion.question,
      given,
      correct: currentQuestion.answer,
      isCorrect: correct,
    };

    setChecked(true);

    setAnswers((prev) => {
      const updated = [...prev, newEntry];

      // 🔥 SIMPAN KE SESSION STORAGE
      sessionStorage.setItem("gameAnswers", JSON.stringify(updated));

      return updated;
    });

    if (correct) setScore((s) => s + 10);
    else setLives((l) => Math.max(0, l - 1));
  }

  const router = useRouter();

  function handleContinue() {
    if (current < questions.length - 1 && lives > 0 && remainingTime > 0) {
      setCurrent(current + 1);
      setSelected(null);
      setTyped("");
      setChecked(false);
    } else {
      // navigate to result page with summary
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const params = new URLSearchParams({
        correct: String(correctCount),
        total: String(questions.length),
        score: String(score),
        lives: String(lives),
        time: String(remainingTime),
      });
      router.push(`/result?${params.toString()}`);
    }
  }

  const progressWidth = `${((current + 1) / questions.length) * 100}%`;

  // timer effect
  useEffect(() => {
    if (current >= questions.length || lives <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCurrent(questions.length); // force end
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current, lives]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const formatTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // guard against out-of-range index
  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="min-h-screen bg-sky-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto p-6 flex-1">
        {/* TOP BAR */}
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <span
            className="text-xl cursor-pointer hover:scale-110 transition"
            onClick={() => router.push("/")}
          >
            ✕
          </span>

          <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-3 rounded-full transition-all"
              style={{ width: progressWidth }}
            ></div>
          </div>

          <span className="text-slate-700">❤️ {lives}</span>
          <span className="text-slate-700">🏆 {score}</span>
          <span className="text-slate-700">⏱ {formatTime}</span>
        </div>

        {/* QUESTION NAV */}
        <div className="mt-6 flex justify-center gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setSelected(null);
                setTyped("");
                setChecked(false);
              }}
              className={`w-8 h-8 rounded-full text-sm font-semibold 
                ${idx === current ? "bg-sky-500 text-white" : "bg-white text-slate-700 border border-slate-200"}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* QUESTION */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              Tahap {current + 1} / {questions.length}
            </span>
            <span className="text-sm text-slate-600">❤️ {lives}</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {currentQuestion.question}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {currentQuestion.type === "typing"
              ? "Ketik jawaban di bawah"
              : "Pilih jawaban yang benar"}
          </p>
        </div>

        {/* ANSWER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mt-6">
          {currentQuestion.type === "multiple-choice" ? (
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options!.map((opt) => {
                const isSelected = selected === opt;
                const showCorrect = checked && opt === currentQuestion.answer;
                const showWrong =
                  checked && isSelected && opt !== currentQuestion.answer;

                let style =
                  "w-full rounded-2xl py-4 font-semibold border-2 transition-all";

                if (showCorrect)
                  style +=
                    " bg-emerald-500 border-emerald-500 text-white shadow-md";
                else if (showWrong)
                  style += " bg-red-500 border-red-500 text-white shadow-md";
                else if (isSelected)
                  style += " bg-sky-50 border-sky-500 text-sky-600 shadow-sm";
                else
                  style +=
                    " bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50";

                return (
                  <button
                    key={opt}
                    disabled={checked}
                    onClick={() => setSelected(opt)}
                    className={style}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={typed}
              disabled={checked}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Jawaban Anda..."
            />
          )}

          {/* FEEDBACK */}
          {checked && (
            <div
              className={`mt-5 text-sm font-semibold ${
                isCorrect ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {isCorrect
                ? "Jawaban benar! 🎉"
                : `Jawaban salah, seharusnya ${currentQuestion.answer}`}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t bg-white">
        <div className="max-w-2xl mx-auto p-4 flex justify-between items-center">
          <button
            disabled={checked}
            className="px-6 py-3 rounded-2xl text-slate-400 font-semibold disabled:opacity-40"
          >
            LEWATI
          </button>

          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={
                currentQuestion.type === "typing"
                  ? typed.trim().length === 0
                  : !selected
              }
              className="bg-sky-500 text-white px-10 py-3 rounded-2xl font-bold shadow-md disabled:opacity-40"
            >
              PERIKSA
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="bg-emerald-500 text-white px-10 py-3 rounded-2xl font-bold shadow-md"
            >
              LANJUT
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
