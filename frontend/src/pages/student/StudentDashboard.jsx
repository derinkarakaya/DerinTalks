import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Flame,
  Zap,
  GraduationCap,
  Layers,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  Volume2,
  MessageCircle,
  Smile,
  RotateCcw,
} from 'lucide-react';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';

export default function StudentDashboard({ onNavigate }) {
  const [summary, setSummary]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(null); // 'A' | 'B' | null

  useEffect(() => { fetchSummary(); }, []);

  const fetchSummary = async () => {
    try {
      const data = await api.getStudentDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Dashboard summary fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const playIdiomAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-US';
      utt.rate = 0.92;
      setIsPlayingAudio(true);
      utt.onend = utt.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utt);
    }
  };

  const handleMiniQuiz = (choice) => {
    setQuizAnswered(choice);
    choice === 'B' ? playSuccessSound() : playErrorSound();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Kampüs paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  const user       = summary?.user       || {};
  const curriculum = summary?.curriculum || {};
  const flashcards = summary?.flashcards || {};
  const exams      = summary?.exams      || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* ───── 1. KARŞILAMA KARTI — Vibrant Pastel Hero ───── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6 sm:p-8 border border-sky-200 shadow-sm">

        {/* Dekoratif daireler */}
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-indigo-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Sol: Metin & Butonlar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>DerinTalks Kampüs</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold">
                <span>🚀</span>
                <span>Günün Modu: %100 Odaklanmış!</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-800 leading-tight">
              Hoş Geldin,{' '}
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                {user.full_name?.split(' ')[0] || 'Dostum'}
              </span>
              ! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
              Aktif seviyen{' '}
              <span className="font-bold px-2 py-0.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
                {user.current_level || 'A1'} Seviyesi
              </span>
              . Dünkü çalışmaların harikaydı! Bugün de serini korumaya hazır mısın?
            </p>

            <div className="pt-1 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('curriculum')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all flex items-center space-x-2 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Derslere Devam Et</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('flashcards')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-sky-300 transition-all flex items-center space-x-2 shadow-sm"
              >
                <Layers className="w-4 h-4 text-sky-500" />
                <span>Kelime Tekrarı ({flashcards.in_review_cards || 0})</span>
              </button>
            </div>
          </div>

          {/* Sağ: SVG İllüstrasyon — artık açık renk */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 sm:w-72 h-52 sm:h-56 flex items-center justify-center">
              <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                {/* Yörünge Halkaları */}
                <circle cx="160" cy="130" r="95" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                <circle cx="160" cy="130" r="115" stroke="#E0F2FE" strokeWidth="1" opacity="0.6" />

                {/* Merkez Avatar */}
                <circle cx="160" cy="130" r="55" fill="#F0F9FF" stroke="#38BDF8" strokeWidth="3" />

                {/* Kulaklık */}
                <path d="M125 125 A 35 35 0 0 1 195 125" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
                <rect x="120" y="120" width="10" height="20" rx="5" fill="#0EA5E9" />
                <rect x="190" y="120" width="10" height="20" rx="5" fill="#0EA5E9" />

                {/* Yüz */}
                <circle cx="148" cy="128" r="4.5" fill="#1E293B" />
                <circle cx="172" cy="128" r="4.5" fill="#1E293B" />
                <path d="M148 142 Q 160 152 172 142" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

                {/* Şapka */}
                <polygon points="160,82 185,96 160,104 135,96" fill="#38BDF8" />
                <path d="M178 97 L 178 112" stroke="#FCD34D" strokeWidth="2" />
                <circle cx="178" cy="113" r="2.5" fill="#FCD34D" />

                {/* Balon 1 */}
                <g className="animate-bounce" style={{ animationDuration: '3.2s' }}>
                  <rect x="10" y="20" width="130" height="34" rx="12" fill="#FB7185" />
                  <path d="M44 54 L50 62 L58 54 Z" fill="#FB7185" />
                  <text x="20" y="42" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">Ödevin harikaydı! ⭐</text>
                </g>

                {/* Balon 2 */}
                <g className="animate-pulse" style={{ animationDuration: '3.8s' }}>
                  <rect x="183" y="18" width="115" height="34" rx="12" fill="#A5F3FC" />
                  <path d="M228 52 L234 60 L242 52 Z" fill="#A5F3FC" />
                  <text x="193" y="40" fill="#0E7490" fontSize="11" fontWeight="800" fontFamily="sans-serif">Let's Speak! 💬</text>
                </g>

                {/* Balon 3 */}
                <g className="animate-bounce" style={{ animationDuration: '4.5s' }}>
                  <rect x="175" y="185" width="125" height="32" rx="10" fill="#FDE68A" />
                  <text x="188" y="206" fill="#92400E" fontSize="11" fontWeight="800" fontFamily="sans-serif">5 Gün Kesintisiz! 🔥</text>
                </g>

                {/* Yıldız */}
                <circle cx="50" cy="175" r="10" fill="#FCD34D" />
                <text x="46" y="179" fill="#FFFFFF" fontSize="11" fontWeight="bold">★</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ───── 2. İSTATİSTİK KARTLARI ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Streak */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Çalışma Serisi</div>
            <div className="text-xl font-black text-slate-800">{user.streak_days || 1} Gün</div>
            <div className="text-[11px] text-rose-600 font-bold">İstikrarını koruyorsun 🔥</div>
          </div>
        </div>

        {/* XP */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Kazanılan Puan</div>
            <div className="text-xl font-black text-slate-800">{user.xp_points || 0} XP</div>
            <div className="text-[11px] text-amber-600 font-bold">Hedef: 1000 XP ⚡</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-5 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Kalıcı Kelimeler</div>
            <div className="text-xl font-black text-slate-800">
              {flashcards.mastered_cards || 0} / {flashcards.total_flashcards || 0}
            </div>
            <div className="text-[11px] text-sky-600 font-bold">SRS Leitner Kutuları</div>
          </div>
        </div>

        {/* Sınav */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Sınav Başarısı</div>
            <div className="text-xl font-black text-slate-800">%{exams.average_score || 0}</div>
            <div className="text-[11px] text-emerald-600 font-bold">{exams.exams_completed || 0} deneme çözüldü</div>
          </div>
        </div>

      </div>

      {/* ───── 3. İKİLİ KAMPÜS KARTLARI ───── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Sıradaki Canlı Pratik */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                📅 Sıradaki Canlı Pratik
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Yerini Kaptın! ☕</span>
              </span>
            </div>
            <h3 className="text-base font-black text-slate-800">
              Speaking Club: "Coffee, Tech & Daily Routines"
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              Bu akşam 20:00'de eğitmen ve diğer öğrencilerle konuşma kulübümüz var. Rahat ol, hata yapmaktan korkma!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-700 font-bold">⏰ Bugün 20:00 - 20:45</span>
            <button
              onClick={() => onNavigate('schedule')}
              className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-sm shadow-sky-200"
            >
              Takvimi Aç
            </button>
          </div>
        </div>

        {/* Mini Meydan Okuma */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                🎯 Günün Mini Meydan Okuması
              </span>
              <span className="text-xs text-slate-400 font-semibold">+20 XP Ödül</span>
            </div>

            <h4 className="text-sm font-black text-slate-800 mt-1">
              "Break a leg!" ifadesi İngilizcede ne anlama gelir?
            </h4>

            {!quizAnswered ? (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => handleMiniQuiz('A')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-bold text-slate-700 transition-all text-left"
                >
                  A) Bacağını kırmak
                </button>
                <button
                  onClick={() => handleMiniQuiz('B')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-xs font-bold text-slate-700 transition-all text-left"
                >
                  B) İyi şanslar!
                </button>
              </div>
            ) : quizAnswered === 'B' ? (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  Helal olsun! Sahneye çıkmadan önce "İyi şanslar" yerine söylenir. (+20 XP!)
                </div>
                <button onClick={() => setQuizAnswered(null)} className="text-emerald-600 hover:text-emerald-800 p-1" title="Yeniden Dene">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 animate-in fade-in flex items-start space-x-2">
                <Smile className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  Hahaha, bacağını kırma aman! 😄 Tekrar dene bakalım!
                </div>
                <button onClick={() => setQuizAnswered(null)} className="text-amber-600 hover:text-amber-800 p-1" title="Yeniden Dene">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            💡 Kampüs kuralı: Hata yapmak serbest, denemek zorunlu!
          </p>
        </div>
      </div>

      {/* ───── 4. GÜNÜN İFADESİ ───── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                Günün İfadesi (Idiom of the Day)
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Akıcı Konuşma Pratiği</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-800 mt-1">
              "A piece of cake"{' '}
              <span className="font-semibold text-slate-500 text-xs sm:text-sm">(Çantada keklik, çok kolay)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 italic">
              "Don't worry about the speaking club tonight, it will be a piece of cake!"
            </p>
          </div>
        </div>

        <button
          onClick={() => playIdiomAudio("A piece of cake. Don't worry about the speaking club tonight, it will be a piece of cake!")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm border ${
            isPlayingAudio
              ? 'bg-sky-400 text-white border-sky-500 animate-pulse'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Seslendiriliyor...' : 'Doğal Telaffuzu Dinle'}</span>
        </button>
      </div>

      {/* ───── 5. CEFR İLERLEME + SAĞ PANEL ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CEFR Seviye Çubukları */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-800">CEFR Seviye Müfredat İlerlemesi</h2>
              <p className="text-xs text-slate-500 font-medium">A1 Başlangıç'tan C2 Ustalık seviyesine modül durumunuz</p>
            </div>
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 transition-colors"
            >
              <span>Müfredata Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level renk paletleri */}
          {(() => {
            const levelColors = {
              A1: { bar: 'from-sky-400 to-blue-400',      badge: 'bg-sky-100 text-sky-700'     },
              A2: { bar: 'from-violet-400 to-purple-400',  badge: 'bg-violet-100 text-violet-700'},
              B1: { bar: 'from-rose-400 to-pink-400',      badge: 'bg-rose-100 text-rose-700'   },
              B2: { bar: 'from-amber-400 to-yellow-400',   badge: 'bg-amber-100 text-amber-700' },
              C1: { bar: 'from-emerald-400 to-teal-400',   badge: 'bg-emerald-100 text-emerald-700'},
              C2: { bar: 'from-orange-400 to-red-400',     badge: 'bg-orange-100 text-orange-700'},
            };
            const levelNames = {
              A1: 'A1 Başlangıç (Beginner)', A2: 'A2 Temel (Elementary)',
              B1: 'B1 Orta Öncesi',          B2: 'B2 Orta Üstü',
              C1: 'C1 İleri (Advanced)',      C2: 'C2 Ustalık (Mastery)',
            };
            return (
              <div className="space-y-4">
                {(curriculum.level_stats || []).map((lvl) => {
                  const c = levelColors[lvl.level] || levelColors.A1;
                  return (
                    <div key={lvl.level} className="space-y-1.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-8 h-8 rounded-xl ${c.badge} flex items-center justify-center font-black text-xs shadow-sm`}>
                            {lvl.level}
                          </span>
                          <span className="text-slate-700">{levelNames[lvl.level]}</span>
                        </div>
                        <span className="text-slate-400 font-semibold text-[11px]">
                          {lvl.completed} / {lvl.total} (%{lvl.percentage})
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all duration-500 shadow-sm`}
                          style={{ width: `${Math.max(lvl.percentage, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Sağ Panel */}
        <div className="space-y-5">

          {/* Leitner SRS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>Aralıklı Tekrar (Leitner Kutuları)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Hafızayı tazelemek için kelimelerini gözden geçir</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Yeni</span>
                <p className="text-xl font-black text-slate-800 mt-0.5">{flashcards.new_cards || 0}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[10px] font-bold uppercase text-rose-600">Tekrar</span>
                <p className="text-xl font-black text-rose-600 mt-0.5">{flashcards.in_review_cards || 0}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('flashcards')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all flex items-center justify-center space-x-2"
            >
              <span>Kelime Pratiğine Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sınav Portalı — artık ferah pastel */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center space-x-3 mb-2 relative z-10">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">YKS-DİL & TOEFL Portalı</h4>
                <p className="text-[11px] text-indigo-200 font-bold">Özgün Deneme Sınavları</p>
              </div>
            </div>
            <p className="text-xs text-indigo-100 mb-4 leading-relaxed font-medium relative z-10">
              Süre sınırlı deneme sınavları çöz veya soru bankasından hedef odaklı pratik yap.
            </p>
            <button
              onClick={() => onNavigate('exams')}
              className="relative z-10 w-full py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Sınav Merkezine Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
