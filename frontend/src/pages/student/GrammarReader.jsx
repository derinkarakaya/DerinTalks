import React, { useState } from 'react';
import AudioButton from '../../components/AudioButton';
import { api } from '../../api/client';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  Volume2,
  AlertCircle
} from 'lucide-react';

export default function GrammarReader({ module, onBack, onCompleted }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let content = {};
  try {
    content = typeof module.content_json === 'string' ? JSON.parse(module.content_json) : module.content_json;
  } catch (err) {
    console.error("Content parsing error", err);
  }

  const quiz = content.practice_quiz || [];

  const handleSelectOption = (qIdx, option) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: option });
  };

  const handleCheckQuiz = async () => {
    if (Object.keys(selectedAnswers).length === 0 && quiz.length > 0) {
      alert("Lütfen en az bir soruyu cevaplayınız.");
      return;
    }

    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const score = quiz.length > 0 ? Math.round((correct / quiz.length) * 100) : 100;
    setShowResults(true);

    if (score >= 60) {
      playSuccessSound();
      if (score >= 70) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      playErrorSound();
    }

    try {
      setIsSubmitting(true);
      await api.submitModule(module.id, score, selectedAnswers);
      if (onCompleted) onCompleted(score);
    } catch (err) {
      console.error("Module submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
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
          {module.level} Seviyesi • Gramer Notu
        </span>
      </div>

      {/* Main Grammar Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D5] shadow-soft space-y-6">
        
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">{module.title}</h1>
          {module.subtitle && (
            <p className="text-sm font-medium text-burgundy-700 mt-1">{module.subtitle}</p>
          )}
          {module.description && (
            <p className="text-xs text-navy-700/70 mt-2 leading-relaxed">{module.description}</p>
          )}
        </div>

        {/* Explanation Section */}
        {content.explanation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-[#EAE2D5]">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-navy-700" />
              <span>Konu Özeti ve Kullanım Mantığı</span>
            </h3>
            <p className="text-sm text-navy-900 leading-relaxed font-normal">
              {content.explanation}
            </p>
          </div>
        )}

        {/* Rules & Examples */}
        {content.rules && content.rules.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy-700/60 uppercase tracking-wider">
              Temel Gramer Kuralları & Cümle Örnekleri
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {content.rules.map((r, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-cream-50 border border-[#EAE2D5] hover:border-navy-300 transition-colors"
                >
                  <p className="text-xs font-bold text-navy-950 mb-1.5">{r.rule}</p>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#EAE2D5]">
                    <span className="text-xs text-navy-900 font-medium italic">"{r.example}"</span>
                    <AudioButton text={r.example} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Dialogue if exists */}
        {content.dialogue && content.dialogue.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy-700/60 uppercase tracking-wider">
              Örnek Canlı Diyalog
            </h3>
            <div className="space-y-2 bg-cream-50 p-4 rounded-2xl border border-[#EAE2D5]">
              {content.dialogue.map((d, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-navy-100 text-navy-900 shrink-0">
                    {d.speaker}:
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-navy-950 font-medium">{d.text}</span>
                    <AudioButton text={d.text} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Practice Quiz */}
        {quiz.length > 0 && (
          <div className="pt-6 border-t border-[#EAE2D5] space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-navy-950">
                Pekiştirme Alıştırması ({quiz.length} Soru)
              </h3>
            </div>

            <div className="space-y-4">
              {quiz.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.answer;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      showResults
                        ? isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-burgundy-50/70 border-burgundy-200'
                        : 'bg-cream-50 border-[#EAE2D5]'
                    }`}
                  >
                    <p className="text-xs font-bold text-navy-950 mb-3">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[idx] === opt;
                        let btnStyle = 'bg-white text-navy-900 border-[#EAE2D5] hover:border-navy-400';

                        if (showResults) {
                          if (opt === q.answer) {
                            btnStyle = 'bg-emerald-700 text-white border-emerald-800 font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-burgundy-800 text-white border-burgundy-900';
                          } else {
                            btnStyle = 'bg-cream-100 text-navy-400 border-[#EAE2D5] opacity-60';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-navy-900 text-cream-50 border-navy-950 font-semibold shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(idx, opt)}
                            className={`px-3 py-2 rounded-xl text-xs border text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && q.explanation && (
                      <p className="mt-3 text-[11px] text-navy-900 font-medium bg-white p-2.5 rounded-lg border border-[#EAE2D5] flex items-start space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-burgundy-700 shrink-0 mt-0.5" />
                        <span><strong>Açıklama:</strong> {q.explanation}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              {!showResults ? (
                <button
                  onClick={handleCheckQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Cevapları Kontrol Et & Tamamla</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-cream-100 border border-[#EAE2D5] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-burgundy-700" />
                    <span className="text-xs font-bold text-navy-950">
                      Modül tamamlandı! Başarı puanınız sisteme kaydedildi.
                    </span>
                  </div>
                  <button
                    onClick={onBack}
                    className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 text-xs font-semibold"
                  >
                    Müfredata Dön
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
