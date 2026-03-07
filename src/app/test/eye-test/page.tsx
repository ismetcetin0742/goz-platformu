"use client";
import { useState } from "react";
import Link from "next/link";

const tests = [
  { id: 1, img: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", answer: "12", text: "Bu daire içinde hangi sayıyı görüyorsunuz?" },
  { id: 2, img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ishihara_9.png", answer: "74", text: "Peki ya burada?" },
];

export default function EyeTest() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (val: string) => {
    if (val === tests[step].answer) setScore(score + 1);
    if (step + 1 < tests.length) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100">
        {!finished ? (
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Test {step + 1}/2</span>
            <h2 className="text-2xl font-black text-[#002f56] mt-2 mb-6">{tests[step].text}</h2>
            <div className="size-48 mx-auto bg-gray-100 rounded-full mb-8 overflow-hidden border-4 border-white shadow-lg">
              <img src={tests[step].img} className="w-full h-full object-cover" alt="Test" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["12", "74", "6", "Hiçbiri"].map((opt) => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="py-4 bg-gray-50 hover:bg-[#00a3e0] hover:text-white rounded-2xl font-bold transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-[#002f56]">Test Tamamlandı!</h2>
            <p className="text-gray-500 mt-2 font-medium">Skorunuz: {score}/{tests.length}</p>
            <p className="text-sm text-red-500 mt-4 bg-red-50 p-4 rounded-2xl">
              <b>Not:</b> Bu test sadece bilgilendirme amaçlıdır. Kesin teşhis için bir göz doktoruna görünmelisiniz.
            </p>
            <Link href="/" className="mt-8 inline-block text-[#00a3e0] font-black underline">Anasayfaya Dön</Link>
          </div>
        )}
      </div>
    </div>
  );
}