"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function Result() {
  const params = useSearchParams();
  const router = useRouter();

  // expect query parameters ?correct=4&total=5&score=5000&lives=2&time=120
  const correct = parseInt(params.get("correct") || "0", 10);
  const total = parseInt(params.get("total") || "0", 10);
  const wrong = total - correct;
  const score = parseInt(params.get("score") || "0", 10);
  const livesLeft = parseInt(params.get("lives") || "0", 10);
  const timeLeft = parseInt(params.get("time") || "0", 10);

  const stars = wrong === 0 ? 3 : wrong === 1 ? 2 : 1;

  const [showReview, setShowReview] = useState(false);
  const [answers, setAnswers] = useState<
    Array<{
      question: string;
      given: string;
      correct: string;
      isCorrect: boolean;
    }>
  >([]);

  useEffect(() => {
    if (showReview) {
      const raw = sessionStorage.getItem("gameAnswers");
      if (raw) {
        try {
          setAnswers(JSON.parse(raw));
        } catch {}
      }
    }
  }, [showReview]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col items-center py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800">
            🎓 Hasil Kuis
          </h1>
          <p className="text-slate-600 mt-2">
            Terima kasih telah bermain, berikut ringkasannya:
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center">
            <p className="text-slate-500 uppercase tracking-wide text-sm">
              Skor Akhir
            </p>
            <p className="text-5xl font-bold text-emerald-500 mt-1">
              {score.toLocaleString()}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>
                Benar: <strong>{correct}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span>
                Salah: <strong>{wrong}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <span>
                Nyawa tersisa: <strong>{livesLeft}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱</span>
              <span>
                Waktu tersisa:{" "}
                <strong>
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </strong>
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-5xl ${i < stars ? "text-amber-400" : "text-slate-300"}`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-500 text-white py-3 rounded-3xl font-semibold shadow-md hover:bg-gray-600 transition"
            >
              Beranda
            </button>
            <button
              onClick={() => setShowReview(true)}
              className="w-full bg-indigo-500 text-white py-3 rounded-3xl font-semibold shadow-md hover:bg-indigo-600 transition"
            >
              Lihat Pembahasan
            </button>
            <button
              onClick={() => router.push("/game/math")}
              className="w-full bg-emerald-500 text-white py-3 rounded-3xl font-semibold shadow-md hover:bg-emerald-600 transition"
            >
              Main Lagi
            </button>
            <button
              onClick={() => {
                alert("Level berikutnya dibuka! 🔓");
              }}
              className="w-full bg-sky-500 text-white py-3 rounded-3xl font-semibold shadow-md hover:bg-sky-600 transition"
            >
              Lanjut Level
            </button>
          </div>
        </div>
      </div>

      {showReview && (
        <Modal onClose={() => setShowReview(false)}>
          <h2 className="text-2xl font-bold mb-4">Pembahasan</h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  ans.isCorrect
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  {idx + 1}. {ans.question}
                </p>

                <p className="mt-1 text-slate-800">
                  Jawaban Anda: <strong>{ans.given || "—"}</strong>{" "}
                  {ans.isCorrect ? (
                    <span className="text-emerald-600 font-medium">
                      (Benar)
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">(Salah)</span>
                  )}
                </p>

                {!ans.isCorrect && (
                  <p className="mt-1 text-slate-800">
                    Jawaban benar: <strong>{ans.correct}</strong>
                  </p>
                )}

                <p className="mt-2 text-sm text-slate-800">
                  {ans.isCorrect
                    ? "Jawaban Anda sudah tepat. Pertahankan!"
                    : "Coba periksa kembali materi relevan; jawaban benar ditunjukkan di atas."}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </main>
  );
}
