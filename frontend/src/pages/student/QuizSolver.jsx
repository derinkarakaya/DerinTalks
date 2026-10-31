import React, { useState } from 'react';
import { api } from '../../api/client';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function QuizSolver({ module, onBack, onCompleted }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  let content = {};
  try {
    content = typeof module.content_json === 'string' ? JSON.parse(module.content_json) : module.content_json;
  } catch (err) {
    console.error("Content parse error", err);
  }

  const questions = content.questions || [];

  const handleSelectOption = (qIdx, opt) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: opt });
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!window.confirm("Bazı soruları boş bıraktınız. Yine de testi bitirmek istiyor musunuz?")) {
        return;
      }
    }

    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= 60) {
      playSuccessSound();
      if (calculatedScore >= 70) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      playErrorSound();
    }

    try {
      await api.submitModule(module.id, calculatedScore, selectedAnswers);
      if (onCompleted) onCompleted(calculatedScore);
    } catch (err) {
      console.error("Failed to submit test score", err);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE2D5] text-xs font-semibold text-navy-900 hover:bg-cream-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-navy-700" />
          <span>Müfredata Dön</span>
        </button>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-50 text-navy-900 border border-navy-200">
          {module.level} • Seviye Değerlendirme Testi
        </span>
      </div>

      {/* Main Quiz Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D5] shadow-soft space-y-6">
        
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">{module.title}</h1>
          {module.subtitle && (
            <p className="text-sm font-medium text-burgundy-700 mt-1">{module.subtitle}</p>
          )}
          <p className="text-xs text-navy-700/60 mt-1">Toplam {questions.length} Soru • Çoktan Seçmeli</p>
        </div>

        {/* Score Summary Banner if submitted */}
        {isSubmitted && (
          <div className="p-6 rounded-2xl bg-cream-100 border border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-navy-900 text-cream-50 flex items-center justify-center font-extrabold text-xl shadow-md">
                %{score}
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {score >= 80 ? 'Mükemmel Başarı! 🎉' : score >= 60 ? 'Tebrikler, Geçtiniz! 👍' : 'Biraz Daha Pratik Gerekebilir 💪'}
                </h3>
                <p className="text-xs text-navy-800">
                  {questions.filter((q, i) => selectedAnswers[i] === q.answer).length} / {questions.length} doğru cevap.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white text-navy-900 border border-[#EAE2D5] hover:bg-cream-50 font-semibold text-xs transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tekrar Çöz</span>
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs transition-colors"
              >
                Müfredata Dön
              </button>
            </div>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const isCorrect = selectedAnswers[qIdx] === q.answer;

            return (
              <div
                key={qIdx}
                className={`p-5 rounded-2xl border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-burgundy-50/70 border-burgundy-200'
                    : 'bg-cream-50/60 border-[#EAE2D5]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-navy-700/60">
                    Soru {qIdx + 1} / {questions.length}
                  </span>
                  {isSubmitted && (
                    <span className="text-xs font-bold flex items-center space-x-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" /> <span>Doğru</span>
                        </span>
                      ) : (
                        <span className="text-burgundy-700 flex items-center space-x-1">
                          <XCircle className="w-4 h-4" /> <span>Hatalı</span>
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-navy-950 mb-4">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === opt;
                    let style = 'bg-white text-navy-900 border-[#EAE2D5] hover:border-navy-400';

                    if (isSubmitted) {
                      if (opt === q.answer) {
                        style = 'bg-emerald-700 text-white border-emerald-800 font-bold';
                      } else if (isSelected) {
                        style = 'bg-burgundy-800 text-white border-burgundy-900 font-semibold';
                      } else {
                        style = 'bg-cream-100 text-navy-400 border-[#EAE2D5] opacity-60';
                      }
                    } else if (isSelected) {
                      style = 'bg-navy-900 text-cream-50 border-navy-950 font-semibold shadow-sm';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, opt)}
                        className={`px-4 py-3 rounded-xl text-xs border text-left transition-all ${style}`}
                      >
                        <span className="font-semibold mr-1.5">{String.fromCharCode(65 + optIdx)})</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && q.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-[#EAE2D5] text-xs text-navy-800 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-burgundy-700 shrink-0 mt-0.5" />
                    <span><strong>Çözüm & Açıklama:</strong> {q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="pt-4 text-right">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2 ml-auto"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Testi Bitir ve Puanı Hesapla</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
