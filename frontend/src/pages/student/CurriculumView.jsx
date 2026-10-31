import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import GrammarReader from './GrammarReader';
import ReadingPassage from './ReadingPassage';
import QuizSolver from './QuizSolver';
import GamesHub from './GamesHub';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Gamepad2,
  CheckCircle,
  Play,
  Clock,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';

export default function CurriculumView({ initialLevel = 'A1' }) {
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);

  const levelTabs = [
    { code: 'A1', label: 'A1 Başlangıç' },
    { code: 'A2', label: 'A2 Temel' },
    { code: 'B1', label: 'B1 Orta Öncesi' },
    { code: 'B2', label: 'B2 Orta Üstü' },
    { code: 'C1', label: 'C1 İleri' },
    { code: 'C2', label: 'C2 Ustalık' },
  ];

  const categories = [
    { id: 'ALL', label: 'Tüm Modüller' },
    { id: 'grammar', label: 'Gramer Konuları', icon: BookOpen },
    { id: 'reading', label: 'Okuma Metinleri', icon: FileText },
    { id: 'test', label: 'Testler / Quizler', icon: HelpCircle },
    { id: 'game', label: 'Eğitici Oyunlar', icon: Gamepad2 },
  ];

  useEffect(() => {
    fetchModules();
  }, [selectedLevel, selectedCategory]);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const typeFilter = selectedCategory === 'ALL' ? null : selectedCategory;
      const data = await api.getModules(selectedLevel, typeFilter);
      setModules(data);
    } catch (err) {
      console.error("Failed to load curriculum modules", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleCompleted = (score) => {
    fetchModules();
  };

  if (activeModule) {
    if (activeModule.module_type === 'grammar') {
      return (
        <GrammarReader
          module={activeModule}
          onBack={() => setActiveModule(null)}
          onCompleted={handleModuleCompleted}
        />
      );
    }
    if (activeModule.module_type === 'reading') {
      return (
        <ReadingPassage
          module={activeModule}
          onBack={() => setActiveModule(null)}
          onCompleted={handleModuleCompleted}
        />
      );
    }
    if (activeModule.module_type === 'test') {
      return (
        <QuizSolver
          module={activeModule}
          onBack={() => setActiveModule(null)}
          onCompleted={handleModuleCompleted}
        />
      );
    }
    if (activeModule.module_type === 'game') {
      return (
        <GamesHub
          module={activeModule}
          onBack={() => setActiveModule(null)}
        />
      );
    }
  }

  const completedCount = modules.filter((m) => m.completed).length;
  const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Level Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-1.5 overflow-x-auto">
        {levelTabs.map((lvl) => {
          const isActive = selectedLevel === lvl.code;
          return (
            <button
              key={lvl.code}
              onClick={() => setSelectedLevel(lvl.code)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 ${
                isActive
                  ? 'bg-navy-900 text-cream-50 shadow-md'
                  : 'text-navy-800 hover:bg-cream-50'
              }`}
            >
              <span className="text-sm font-black">{lvl.code}</span>
              <span className={`text-[10px] ${isActive ? 'text-cream-200' : 'text-navy-700/60'}`}>
                {lvl.label.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level Progress Banner */}
      <div className="bg-cream-100 p-6 rounded-3xl border border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-900 text-cream-50 uppercase tracking-wider">
            {selectedLevel} Müfredat Durumu
          </span>
          <h2 className="text-lg font-black text-navy-950 mt-1.5">
            {selectedLevel} Seviyesi Eğitim Modülleri
          </h2>
          <p className="text-xs text-navy-700/70 mt-0.5">
            Toplam {modules.length} modülden {completedCount} tanesi tamamlandı (%{progressPct}).
          </p>
        </div>

        <div className="w-full sm:w-48 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-navy-900">
            <span>İlerleme</span>
            <span>%{progressPct}</span>
          </div>
          <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-burgundy-700 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-navy-400 shrink-0 ml-1" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-navy-900 text-cream-50 shadow-sm'
                  : 'bg-white text-navy-800 border border-[#EAE2D5] hover:bg-cream-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Modules Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EAE2D5] shadow-soft">
          <BookOpen className="w-12 h-12 text-navy-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-navy-900">Bu kategoride henüz modül bulunmuyor</h3>
          <p className="text-xs text-navy-700/60 mt-1">Öğretmen panelinden yeni içerik ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const isCompleted = mod.completed;
            let typeColor = 'bg-navy-50 text-navy-900 border-navy-200';
            let typeLabel = 'Gramer';

            if (mod.module_type === 'reading') {
              typeColor = 'bg-cream-100 text-navy-900 border-[#EAE2D5]';
              typeLabel = 'Okuma Metni';
            } else if (mod.module_type === 'test') {
              typeColor = 'bg-burgundy-50 text-burgundy-900 border-burgundy-200';
              typeLabel = 'Seviye Testi';
            } else if (mod.module_type === 'game') {
              typeColor = 'bg-amber-50 text-amber-900 border-amber-200';
              typeLabel = 'Eğitici Oyun';
            }

            return (
              <div
                key={mod.id}
                className="bg-white rounded-3xl p-5 border border-[#EAE2D5] shadow-soft hover:shadow-card hover:border-navy-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeColor}`}>
                      {typeLabel}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-navy-700/60 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-navy-400" />
                        <span>{mod.estimated_minutes} dk</span>
                      </span>

                      {isCompleted && (
                        <span className="flex items-center space-x-1 text-emerald-800 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tamamlandı</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-navy-950 group-hover:text-burgundy-700 transition-colors">
                    {mod.title}
                  </h3>

                  {mod.subtitle && (
                    <p className="text-xs text-navy-700/80 mt-1 line-clamp-1 font-medium">
                      {mod.subtitle}
                    </p>
                  )}

                  {mod.description && (
                    <p className="text-xs text-navy-700/60 mt-2 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#EAE2D5] flex items-center justify-between">
                  {mod.score !== null && mod.score !== undefined ? (
                    <span className="text-xs font-bold text-navy-900 flex items-center space-x-1">
                      <Award className="w-4 h-4 text-burgundy-700" />
                      <span>Skor: %{mod.score}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-navy-700/50 font-medium">Henüz başlanmadı</span>
                  )}

                  <button
                    onClick={() => setActiveModule(mod)}
                    className="px-4 py-2 rounded-xl bg-navy-900 text-cream-50 hover:bg-navy-800 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>{isCompleted ? 'Tekrar İncele' : 'Başla'}</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
