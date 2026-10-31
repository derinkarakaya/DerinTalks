import React, { useState } from 'react';
import AudioButton from '../../components/AudioButton';
import { api } from '../../api/client';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  Bookmark
} from 'lucide-react';

export default function ReadingPassage({ module, onBack, onCompleted }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let content = {};
  try {
    content = typeof module.content_json === 'string' ? JSON.parse(module.content_json) : module.content_json;
  } catch (err) {
    console.error("Content parsing error", err);
  }

  const passage = content.passage || '';
  const vocabHints = content.vocabulary_hints || [];
  const questions = content.questions || [];

  const handleSelectOption = (qIdx, option) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: option });
  };

  const handleCheckQuiz = async () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
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
          {module.level} Seviyesi • Okuma Metni & Anlama
        </span>
      </div>

      {/* Main Reading Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D5] shadow-soft space-y-6">
        
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-950">{module.title}</h1>
            {module.subtitle && (
              <p className="text-sm font-medium text-burgundy-700 mt-1">{module.subtitle}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 bg-cream-50 px-3 py-1.5 rounded-xl border border-[#EAE2D5]">
            <span className="text-xs text-navy-800 font-semibold">Metni Dinle:</span>
            <AudioButton text={passage} className="scale-105" />
          </div>
        </div>

        {/* Reading Passage Body */}
        <div className="p-6 rounded-2xl bg-cream-50 border border-[#EAE2D5] leading-relaxed text-navy-950 text-base sm:text-lg font-normal tracking-wide space-y-4">
          <p>{passage}</p>
        </div>

        {/* Vocabulary Glossary Hints */}
        {vocabHints.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy-700/60 uppercase tracking-wider flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-burgundy-700" />
              <span>Metindeki Önemli Kelimeler & Sözlük İpuçları</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {vocabHints.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-[#EAE2D5]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-navy-950">{v.word}</span>
                    <span className="text-xs text-navy-700/70">• {v.tr}</span>
                  </div>
                  <AudioButton text={v.word} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comprehension Questions */}
        {questions.length > 0 && (
          <div className="pt-6 border-t border-[#EAE2D5] space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-navy-950">
                Okuduğunu Anlama Soruları ({questions.length} Soru)
              </h3>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
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
                      <p className="mt-3 text-[11px] text-navy-900 font-medium bg-white p-2.5 rounded-lg border border-[#EAE2D5]">
                        <strong>Metin Kanıtı:</strong> {q.explanation}
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
                  <span>Cevapları Onayla & Puanı Kaydet</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-cream-100 border border-[#EAE2D5] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-burgundy-700" />
                    <span className="text-xs font-bold text-navy-950">
                      Tebrikler! Okuma parçası ve sorular başarıyla tamamlandı.
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
