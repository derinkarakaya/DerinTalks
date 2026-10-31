import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ExamSession from './ExamSession';
import {
  FileCheck2,
  Clock,
  Award,
  BookOpen,
  Play,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  History
} from 'lucide-react';

export default function ExamPrepView() {
  const [selectedExamType, setSelectedExamType] = useState('YDS'); // YDS or LGS
  const [exams, setExams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [activeSession, setActiveSession] = useState(null); // { exam, questions }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamData();
  }, [selectedExamType, selectedCategory]);

  const loadExamData = async () => {
    setLoading(true);
    try {
      const [examsData, catsData, qData, resultsData] = await Promise.all([
        api.getExams(selectedExamType),
        api.getExamCategories(selectedExamType),
        api.getPracticeQuestions(selectedExamType, selectedCategory),
        api.getMyExamResults()
      ]);
      setExams(examsData);
      setCategories(catsData);
      setPracticeQuestions(qData);
      setPastResults(resultsData.filter((r) => r.exam_type === selectedExamType));
    } catch (err) {
      console.error("Failed to load exam data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (exam) => {
    try {
      const fullExam = await api.getExamDetail(exam.id);
      setActiveSession({
        exam: fullExam,
        questions: fullExam.questions,
        mode: 'full_exam'
      });
    } catch (err) {
      console.error("Failed to start exam", err);
    }
  };

  const handleStartPracticeSolver = () => {
    if (practiceQuestions.length === 0) {
      alert("Bu kategoride soru bulunamadı.");
      return;
    }
    setActiveSession({
      exam: {
        title: `${selectedExamType} - ${selectedCategory === 'ALL' ? 'Karışık Soru Pratiği' : selectedCategory}`,
        exam_type: selectedExamType,
        duration_minutes: 25
      },
      questions: practiceQuestions,
      mode: 'practice_solver'
    });
  };

  if (activeSession) {
    return (
      <ExamSession
        exam={activeSession.exam}
        questions={activeSession.questions}
        mode={activeSession.mode}
        onBack={() => {
          setActiveSession(null);
          loadExamData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Exam Type Tabs: YDS & LGS */}
      <div className="bg-white p-2 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-2">
        <button
          onClick={() => { setSelectedExamType('YDS'); setSelectedCategory('ALL'); }}
          className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
            selectedExamType === 'YDS'
              ? 'bg-navy-900 text-cream-50 shadow-md'
              : 'text-navy-800 hover:bg-cream-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>YDS (Yabancı Dil Bilgisi Seviye Tespit Sınavı)</span>
        </button>

        <button
          onClick={() => { setSelectedExamType('LGS'); setSelectedCategory('ALL'); }}
          className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
            selectedExamType === 'LGS'
              ? 'bg-navy-900 text-cream-50 shadow-md'
              : 'text-navy-800 hover:bg-cream-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>LGS (Liseye Geçiş Sistemi İngilizce)</span>
        </button>
      </div>

      {/* Hero Banner for Selected Exam */}
      <div className="rounded-3xl bg-navy-950 p-6 sm:p-8 text-cream-50 shadow-card border border-navy-900 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-burgundy-900/60 border border-burgundy-700/60 text-cream-100 uppercase tracking-wider">
            {selectedExamType} Ulusal Sınav Hazırlık Merkezi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-cream-50">
            {selectedExamType === 'YDS'
              ? 'YDS Hedef 80+ ve 90+ Özel Hazırlık'
              : 'LGS İngilizce 10/10 Tam Puan Kampı'}
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/80 mt-2 leading-relaxed">
            {selectedExamType === 'YDS'
              ? 'ÖSYM formatında hazırlanmış 5 şıklı özgün denemeler, akademik kelimeler, bağlaçlar ve paragraf soru çözüm teknikleri.'
              : 'MEB kazanımlarına %100 uyumlu yeni nesil diyalog tamamlama, tablo okuma ve görsel destekli sorular.'}
          </p>

          <div className="mt-5 flex items-center space-x-3">
            <button
              onClick={handleStartPracticeSolver}
              className="px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current text-cream-200" />
              <span>Soru Çözmeye Başla ({practiceQuestions.length} Soru)</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-burgundy-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Main Grid: Deneme Sınavları & Soru Bankası */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Full Practice Exams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950">
              {selectedExamType} Tam Kapsamlı Deneme Sınavları
            </h2>
            <span className="text-xs text-navy-700/60 font-medium">Gerçek Sınav Simülasyonu</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : exams.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2D5]">
              <p className="text-xs text-navy-700">Bu sınav türünde henüz deneme sınavı eklenmedi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl p-5 border border-[#EAE2D5] shadow-soft hover:shadow-card hover:border-navy-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-navy-50 text-navy-900 border border-navy-200">
                        {ex.difficulty} Zorluk
                      </span>
                      <span className="text-[11px] text-navy-700/60 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-navy-400" />
                        <span>{ex.duration_minutes} dakika</span>
                      </span>
                      <span className="text-[11px] text-navy-700/60">
                        • {ex.total_questions} Soru
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-navy-950">{ex.title}</h3>
                    <p className="text-xs text-navy-700/70 max-w-xl">{ex.description}</p>
                  </div>

                  <button
                    onClick={() => handleStartExam(ex)}
                    className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Denemeyi Başlat</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Soru Çöz Category Selector */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-950">
                  Kategori Bazlı Soru Çöz (Soru Bankası)
                </h3>
                <p className="text-xs text-navy-700/60">Eksik olduğunuz konu kategorisini seçerek pratik yapın</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-navy-900 text-cream-50'
                    : 'bg-cream-100 text-navy-800 hover:bg-cream-200'
                }`}
              >
                Tüm Konular
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-cream-50'
                      : 'bg-cream-100 text-navy-800 hover:bg-cream-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-[#EAE2D5] flex items-center justify-between">
              <div className="text-xs text-navy-950 font-semibold">
                Seçili filtrede <strong>{practiceQuestions.length} soru</strong> çözüme hazır.
              </div>
              <button
                onClick={handleStartPracticeSolver}
                className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs transition-colors"
              >
                Hemen Soru Çöz
              </button>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Past Exam Results */}
        <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft h-fit space-y-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-burgundy-700" />
            <h3 className="text-sm font-bold text-navy-950">
              {selectedExamType} Sınav Geçmişim
            </h3>
          </div>

          {pastResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-navy-700/50">
              Henüz tamamlanan bir deneme sınavınız bulunmuyor.
            </div>
          ) : (
            <div className="space-y-3">
              {pastResults.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-cream-50 border border-[#EAE2D5] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy-950 line-clamp-1">{r.exam_title}</span>
                    <span className="font-extrabold text-burgundy-700 text-sm">%{r.score}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-navy-700/60">
                    <span>
                      {r.correct_count} Doğru / {r.total_questions} Soru
                    </span>
                    <span>{new Date(r.completed_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
