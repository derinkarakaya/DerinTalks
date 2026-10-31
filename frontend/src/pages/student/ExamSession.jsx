import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  ArrowLeft,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
  HelpCircle,
  Check,
  RotateCcw
} from 'lucide-react';

export default function ExamSession({ exam, questions, mode = 'full_exam', onBack, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    exam?.duration_minutes ? exam.duration_minutes * 60 : 30 * 60
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [String(currentQ.id)]: opt });
  };

  const toggleFlag = (qId) => {
    setFlagged({ ...flagged, [qId]: !flagged[qId] });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const answeredCount = Object.keys(answers).length;
    if (!isSubmitted && answeredCount < questions.length) {
      if (!window.confirm(`${questions.length - answeredCount} adet soru cevaplanmadı. Sınavı tamamlayıp teslim etmek istiyor musunuz?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        exam_id: exam?.id || null,
        exam_type: exam?.exam_type || questions[0]?.exam_type || 'YDS',
        exam_title: exam?.title || 'Özgün Soru Pratiği',
        duration_taken_seconds: (exam?.duration_minutes ? exam.duration_minutes * 60 : 1800) - timeLeft,
        answers: answers
      };

      const res = await api.submitExam(payload);
      setResult(res);
      setIsSubmitted(true);

      if (res.score >= 60) {
        playSuccessSound();
        if (res.score >= 70) {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        }
      } else {
        playErrorSound();
      }

      if (onComplete) onComplete(res);
    } catch (err) {
      console.error("Exam submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#EAE2D5] shadow-soft flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-[#EAE2D5] text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-navy-700" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-navy-50 text-navy-900 border border-navy-200">
              {exam?.exam_type || questions[0]?.exam_type} Sınav Salonu
            </span>
            <h1 className="text-sm font-bold text-navy-950 mt-0.5">{exam?.title || 'Soru Çözüm Modu'}</h1>
          </div>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center space-x-3">
          {!isSubmitted && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cream-100 border border-[#EAE2D5] text-navy-950 text-xs font-bold">
              <Clock className="w-4 h-4 text-burgundy-700 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sınavı Bitir</span>
            </button>
          ) : (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-navy-900 text-cream-50 font-bold text-xs hover:bg-navy-800"
            >
              Sınav Listesine Dön
            </button>
          )}
        </div>
      </div>

      {/* Result Card if submitted */}
      {isSubmitted && result && (
        <div className="p-6 rounded-3xl bg-cream-100 border border-[#EAE2D5] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-full bg-navy-900 text-cream-50 flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-black">%{result.score}</span>
              <span className="text-[9px] uppercase font-bold text-cream-300">Başarı</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-navy-950">
                {result.score >= 70 ? 'Tebrikler, Harika Performans! 🎯' : 'Deneme Sınavı Tamamlandı 📝'}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-navy-800 mt-1">
                <span className="text-emerald-700 font-bold">Doğru: {result.correct_count}</span>
                <span className="text-burgundy-700 font-bold">Yanlış: {result.incorrect_count}</span>
                <span className="text-navy-700/60">Boş: {result.empty_count}</span>
              </div>
              <p className="text-[11px] text-navy-700/70 mt-1">
                Aşağıdaki soru navigasyonundan her sorunun detaylı Türkçe çözümünü inceleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Question + Question Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Cols: Active Question */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D5] shadow-soft space-y-5">
          
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-navy-50 text-navy-950 flex items-center justify-center font-bold text-xs border border-navy-200">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-semibold text-navy-700/60">
                / {questions.length} Soru
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cream-100 text-navy-900 font-medium border border-[#EAE2D5]">
                {currentQ.category}
              </span>
            </div>

            {!isSubmitted && (
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200 font-bold'
                    : 'bg-cream-50 text-navy-700 hover:bg-cream-100 border border-[#EAE2D5]'
                }`}
              >
                <Flag className="w-3.5 h-3.5 fill-current" />
                <span>{flagged[currentQ.id] ? 'İşaretlendi' : 'İşaretle'}</span>
              </button>
            )}
          </div>

          {/* Reading passage if exists for paragraph questions */}
          {currentQ.passage && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-[#EAE2D5] text-xs sm:text-sm text-navy-950 leading-relaxed italic">
              <p className="font-bold text-[11px] text-burgundy-800 not-italic uppercase mb-1">
                Paragrafı Dikkatlice Okuyunuz:
              </p>
              {currentQ.passage}
            </div>
          )}

          {/* Question Prompt */}
          <p className="text-sm sm:text-base font-bold text-navy-950 leading-relaxed">
            {currentQ.question_text}
          </p>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {['A', 'B', 'C', 'D', 'E'].map((letter) => {
              const optKey = `option_${letter.toLowerCase()}`;
              const optText = currentQ[optKey];
              if (!optText) return null; // E option is null for LGS 4-option questions

              const isSelected = answers[String(currentQ.id)] === letter;
              const isCorrectOpt = currentQ.correct_option === letter;

              let style = 'bg-white text-navy-900 border-[#EAE2D5] hover:border-navy-400';

              if (isSubmitted) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-700 text-white border-emerald-800 font-bold';
                } else if (isSelected) {
                  style = 'bg-burgundy-800 text-white border-burgundy-900 font-semibold';
                } else {
                  style = 'bg-cream-50 text-navy-400 border-[#EAE2D5] opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-navy-900 text-cream-50 border-navy-950 font-semibold shadow-sm';
              }

              return (
                <button
                  key={letter}
                  onClick={() => handleSelectOption(letter)}
                  className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-start space-x-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {letter}
                  </span>
                  <span className="flex-1">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Turkish Explanation if submitted */}
          {isSubmitted && currentQ.explanation && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-burgundy-200 text-xs text-navy-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-burgundy-800">
                <AlertCircle className="w-4 h-4 text-burgundy-700" />
                <span>Çözüm & Soru İncelemesi:</span>
              </div>
              <p className="leading-relaxed pl-5">{currentQ.explanation}</p>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAE2D5]">
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-cream-100 text-navy-900 text-xs font-semibold hover:bg-cream-200 border border-[#EAE2D5] disabled:opacity-40"
            >
              Önceki Soru
            </button>
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIdx === questions.length - 1}
              className="px-5 py-2 rounded-xl bg-navy-900 text-cream-50 text-xs font-bold hover:bg-navy-800 disabled:opacity-40"
            >
              Sonraki Soru
            </button>
          </div>

        </div>

        {/* Right 1 Col: Question Grid Palette */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE2D5] shadow-soft h-fit space-y-4">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
            Soru Navigasyonu
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = currentIdx === idx;
              const hasAnswer = answers[String(q.id)] !== undefined;
              const isFlag = flagged[q.id];
              const isCorrect = answers[String(q.id)] === q.correct_option;

              let btnBg = 'bg-cream-100 text-navy-800 border border-[#EAE2D5]';
              if (isSubmitted) {
                btnBg = isCorrect
                  ? 'bg-emerald-700 text-white'
                  : hasAnswer
                  ? 'bg-burgundy-800 text-white'
                  : 'bg-cream-200 text-navy-400';
              } else if (hasAnswer) {
                btnBg = 'bg-navy-900 text-cream-50';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${btnBg} ${
                    isCurrent ? 'ring-2 ring-burgundy-700 ring-offset-2' : ''
                  }`}
                >
                  {idx + 1}
                  {isFlag && !isSubmitted && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-burgundy-600 border border-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#EAE2D5] space-y-1.5 text-[11px] text-navy-700/70">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-navy-900" />
              <span>Cevaplandı ({Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-cream-200" />
              <span>Boş ({questions.length - Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-burgundy-600" />
              <span>İşaretlendi ({Object.values(flagged).filter(Boolean).length})</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
