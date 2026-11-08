import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  BookMarked,
  Gamepad2,
  FileCheck2,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileEdit,
  Users,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role }) {
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';

  const isGamesChildActive = activeTab === 'games' || activeTab === 'games-hub' || activeTab === 'flashcards';
  const [gamesOpen, setGamesOpen] = useState(isGamesChildActive);

  useEffect(() => {
    if (isGamesChildActive) setGamesOpen(true);
  }, [activeTab]);

  const teacherNavItems = [
    { id: 'teacher-dashboard', label: 'Eğitmen Özeti',          icon: LayoutDashboard, color: 'sky'   },
    { id: 'content-manager',  label: 'İçerik Yönetimi (CMS)',   icon: FileEdit,        color: 'violet'},
    { id: 'exam-manager',     label: 'Soru Bankası & Denemeler', icon: FileCheck2,      color: 'rose'  },
    { id: 'student-tracker',  label: 'Öğrenci Analiz & Takip',  icon: Users,           color: 'amber' },
  ];

  // Pastel renk haritası: her menü öğesi için arka plan + metin + ikon renkleri
  const colorMap = {
    sky:    { bg: 'bg-sky-100',     text: 'text-sky-700',     icon: 'text-sky-500',     dot: 'bg-sky-400'    },
    rose:   { bg: 'bg-rose-100',    text: 'text-rose-700',    icon: 'text-rose-500',    dot: 'bg-rose-400'   },
    amber:  { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: 'text-amber-500',   dot: 'bg-amber-400'  },
    emerald:{ bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500', dot: 'bg-emerald-400'},
    violet: { bg: 'bg-violet-100',  text: 'text-violet-700',  icon: 'text-violet-500',  dot: 'bg-violet-400' },
  };

  // Öğrenci menüsü renk atamaları
  const studentItems = [
    { id: 'dashboard',   label: 'Genel Bakış / Ana Sayfa', icon: LayoutDashboard, color: 'sky',     badge: null },
    { id: 'schedule',    label: 'Ders Programım',           icon: CalendarDays,    color: 'violet',  badge: 'Haftalık' },
    { id: 'curriculum',  label: 'Seviye Müfredatı (A1-B2)', icon: BookOpen,        color: 'rose',    badge: 'Özetler' },
    { id: 'readers',     label: 'Okuma Kitapları',          icon: BookMarked,      color: 'emerald', badge: 'Sesli' },
  ];

  const NavItem = ({ id, label, icon: Icon, color, badge }) => {
    const isActive = activeTab === id;
    const c = colorMap[color] || colorMap.sky;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
          isActive
            ? `${c.bg} ${c.text} shadow-sm font-bold`
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? c.icon : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
            isActive ? `${c.bg} ${c.text} border border-current/20` : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-68 bg-white text-slate-700 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 border-r border-slate-200 hidden md:flex font-sans">
      <div className="space-y-6">

        {/* Section Label */}
        <div>
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {isTeacherOrAdmin ? 'Eğitmen & Yönetim Masası' : 'Kampüs Navigasyonu'}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Teacher Nav */}
          {isTeacherOrAdmin ? (
            <nav className="space-y-1.5">
              {teacherNavItems.map((item) => (
                <NavItem key={item.id} {...item} />
              ))}
            </nav>
          ) : (
            /* Student Nav */
            <nav className="space-y-1.5">

              {/* Items 1-4 via NavItem */}
              {studentItems.map((item) => (
                <NavItem key={item.id} {...item} />
              ))}

              {/* 5. Eğitici Oyunlar — açılır alt menü */}
              <div className="space-y-1" onMouseEnter={() => setGamesOpen(true)}>
                <button
                  type="button"
                  onClick={() => { setGamesOpen(!gamesOpen); setActiveTab('games'); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isGamesChildActive
                      ? 'bg-amber-100 text-amber-700 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Gamepad2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${isGamesChildActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>Eğitici Oyunlar</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] px-1.5 rounded font-bold uppercase bg-amber-200 text-amber-800">Pratik</span>
                    {gamesOpen
                      ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </button>

                {gamesOpen && (
                  <div className="ml-4 pl-3 border-l-2 border-amber-200 space-y-1 pt-1">
                    {/* Hafıza Kartları (SRS) */}
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        activeTab === 'flashcards'
                          ? 'bg-sky-100 text-sky-700 font-bold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Layers className={`w-3.5 h-3.5 ${activeTab === 'flashcards' ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span>Hafıza Kartları (SRS)</span>
                      </div>
                      <span className={`text-[9px] px-1.5 rounded font-semibold ${activeTab === 'flashcards' ? 'bg-sky-200 text-sky-800' : 'text-slate-400'}`}>
                        Leitner
                      </span>
                    </button>

                    {/* Kelime & Pratik Oyunları */}
                    <button
                      onClick={() => setActiveTab('games')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        activeTab === 'games' || activeTab === 'games-hub'
                          ? 'bg-rose-100 text-rose-700 font-bold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'games' || activeTab === 'games-hub' ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span>Kelime & Pratik Oyunları</span>
                      </div>
                      <span className={`text-[9px] px-1.5 rounded font-semibold ${activeTab === 'games' || activeTab === 'games-hub' ? 'bg-rose-200 text-rose-800' : 'text-slate-400'}`}>
                        Düello
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6. Test Çöz */}
              <NavItem id="exams" label="Test Çöz" icon={FileCheck2} color="rose" badge="Pekiştirme" />

            </nav>
          )}
        </div>

        {/* Tip Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg bg-sky-400 text-white shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800">
                {isTeacherOrAdmin ? 'Yönetici Masası' : 'Kampüs İpucu'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                {isTeacherOrAdmin
                  ? 'Tüm içerikler anında öğrenci paneli ile senkronize çalışır.'
                  : 'Sesli okuma yaparken tekrar etmek telaffuzunu güçlendirir. 🎤'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between px-2">
        <span>DerinTalks v1.2</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Sunucu Çevrimiçi" />
      </div>
    </aside>
  );
}
