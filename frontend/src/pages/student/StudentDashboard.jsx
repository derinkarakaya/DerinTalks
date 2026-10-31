import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Flame,
  Zap,
  GraduationCap,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function StudentDashboard({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await api.getStudentDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error("Dashboard summary fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-navy-800">Öğrenci paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  const user = summary?.user || {};
  const curriculum = summary?.curriculum || {};
  const flashcards = summary?.flashcards || {};
  const exams = summary?.exams || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 sm:p-8 text-cream-50 shadow-card border border-navy-900">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burgundy-900/60 border border-burgundy-700/60 text-cream-100 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Bugün Yeni Bir Adım At</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-cream-50">
            Hoş Geldin, {user.full_name || 'Öğrenci'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/80 mt-2 leading-relaxed">
            Aktif seviyeniz <strong className="text-cream-50 underline decoration-burgundy-500 underline-offset-4 font-bold">{user.current_level} Seviyesi</strong>.
            Aralıklı tekrar kelime kartların ve YDS/LGS deneme sınavların seni bekliyor.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('curriculum')}
              className="px-5 py-2.5 rounded-xl bg-cream-50 text-navy-950 hover:bg-cream-100 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-navy-800" />
              <span>Derslere Devam Et</span>
              <ArrowRight className="w-4 h-4 text-navy-800" />
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-cream-100 font-semibold text-xs border border-navy-800 transition-all flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-cream-200" />
              <span>Kelimeleri Tekrar Et ({flashcards.in_review_cards || 0})</span>
            </button>
          </div>
        </div>

        {/* Decorative Minimalist Accents */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-burgundy-900/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 bg-navy-800/40 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-50 border border-burgundy-100 text-burgundy-800 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-burgundy-700" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Çalışma Serisi</div>
            <div className="text-xl font-extrabold text-navy-950">{user.streak_days || 1} Gün</div>
            <div className="text-[11px] text-burgundy-700 font-medium">İstikrarını koruyorsun 🔥</div>
          </div>
        </div>

        {/* XP */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-[#EAE2D5] text-navy-900 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Kazanılan Puan</div>
            <div className="text-xl font-extrabold text-navy-950">{user.xp_points || 0} XP</div>
            <div className="text-[11px] text-navy-700 font-medium">Hedef: 1000 XP ⚡</div>
          </div>
        </div>

        {/* Flashcard Mastery */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cream-50 border border-[#EAE2D5] text-navy-900 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Öğrenilen Kelimeler</div>
            <div className="text-xl font-extrabold text-navy-950">
              {flashcards.mastered_cards || 0} / {flashcards.total_flashcards || 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">4. Kutu (Kalıcı Hafıza)</div>
          </div>
        </div>

        {/* Exam Average */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 text-navy-900 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-navy-800" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Sınav Başarısı</div>
            <div className="text-xl font-extrabold text-navy-950">
              %{exams.average_score || 0}
            </div>
            <div className="text-[11px] text-navy-800 font-medium">
              {exams.exams_completed || 0} deneme çözüldü
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Level Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Level Progress Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">CEFR Seviye Müfredat İlerlemesi</h2>
              <p className="text-xs text-navy-700/60">A1 Başlangıç'tan C2 Ustalık seviyesine modül durumunuz</p>
            </div>
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center space-x-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {(curriculum.level_stats || []).map((lvl) => (
              <div key={lvl.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-navy-950 text-cream-50 flex items-center justify-center font-bold text-xs">
                      {lvl.level}
                    </span>
                    <span className="text-navy-900">
                      {lvl.level === 'A1' && 'A1 Başlangıç (Beginner)'}
                      {lvl.level === 'A2' && 'A2 Temel (Elementary)'}
                      {lvl.level === 'B1' && 'B1 Orta Öncesi (Intermediate)'}
                      {lvl.level === 'B2' && 'B2 Orta Üstü (Upper-Intermediate)'}
                      {lvl.level === 'C1' && 'C1 İleri (Advanced)'}
                      {lvl.level === 'C2' && 'C2 Ustalık (Mastery)'}
                    </span>
                  </div>
                  <span className="text-navy-700/70 font-medium">
                    {lvl.completed} / {lvl.total} modül (%{lvl.percentage})
                  </span>
                </div>
                <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy-900 rounded-full transition-all duration-500"
                    style={{ width: `${lvl.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Launch & Flashcard Deck status */}
        <div className="space-y-6">
          
          {/* Flashcard SRS Box Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft">
            <h3 className="text-sm font-bold text-navy-950 mb-1 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-navy-800" />
              <span>Aralıklı Tekrar (Leitner Kutuları)</span>
            </h3>
            <p className="text-xs text-navy-700/60 mb-4">Hafızayı tazelemek için kartlarını gözden geçir</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cream-50 border border-[#EAE2D5] text-center">
                <span className="text-[10px] font-bold uppercase text-navy-700/60">1. Kutu: Yeni</span>
                <p className="text-lg font-extrabold text-navy-950">{flashcards.new_cards || 0}</p>
              </div>
              <div className="p-3 rounded-2xl bg-burgundy-50/70 border border-burgundy-200 text-center">
                <span className="text-[10px] font-bold uppercase text-burgundy-800">2-3. Tekrar</span>
                <p className="text-lg font-extrabold text-burgundy-900">{flashcards.in_review_cards || 0}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('flashcards')}
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Kelime Pratiğine Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* National Exam Teaser */}
          <div className="bg-cream-100 rounded-3xl p-6 border border-[#EAE2D5]">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-xl bg-navy-900 text-cream-50 shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy-950">YDS & LGS Sınav Portalı</h4>
                <p className="text-[11px] text-burgundy-800 font-semibold">ÖSYM & MEB Müfredatına Uygun</p>
              </div>
            </div>
            <p className="text-xs text-navy-800 mb-4 leading-relaxed">
              Zaman sınırlı tam deneme sınavları çözebilir veya kategori bazında soru bankasından pratik yapabilirsiniz.
            </p>
            <button
              onClick={() => onNavigate('exams')}
              className="w-full py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs transition-all shadow-sm flex items-center justify-center space-x-2"
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
