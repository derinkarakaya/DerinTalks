import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Gamepad2,
  FileCheck2,
  CalendarDays,
  FileEdit,
  Users,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role }) {
  const studentNavItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard, badge: null },
    { id: 'curriculum', label: 'Seviye Müfredatı (A1-C2)', icon: BookOpen, badge: '6 Seviye' },
    { id: 'flashcards', label: 'Kelime Kartları (SRS)', icon: Layers, badge: 'Aralıklı Tekrar' },
    { id: 'games', label: 'Eğitici Oyunlar', icon: Gamepad2, badge: 'Pratik' },
    { id: 'exams', label: 'Sınav Hazırlık (YDS/LGS)', icon: FileCheck2, badge: 'Özgün' },
    { id: 'schedule', label: 'Ders Programım', icon: CalendarDays, badge: 'Haftalık' },
  ];

  const teacherNavItems = [
    { id: 'teacher-dashboard', label: 'Eğitmen Özeti', icon: LayoutDashboard, badge: null },
    { id: 'content-manager', label: 'İçerik Yönetimi (CMS)', icon: FileEdit, badge: 'Müfredat' },
    { id: 'exam-manager', label: 'YDS / LGS Soru Yönetimi', icon: FileCheck2, badge: 'Soru Bankası' },
    { id: 'student-tracker', label: 'Öğrenci Takip & Analiz', icon: Users, badge: 'İlerleme' },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-navy-950 text-cream-100 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-lg border-r border-navy-900 hidden md:flex">
      <div className="space-y-6">
        
        {/* Section Title */}
        <div>
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cream-400/80">
              {role === 'teacher' ? 'Eğitmen Masası' : 'Öğrenci Portalı'}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-burgundy-600 animate-pulse" />
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-burgundy-900/50 text-cream-50 border border-burgundy-700/60 shadow-sm font-bold'
                      : 'text-cream-200/80 hover:bg-navy-900 hover:text-cream-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-burgundy-300' : 'text-cream-400/70 group-hover:text-cream-100'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-burgundy-700 text-cream-50'
                          : 'bg-navy-900 text-cream-400 group-hover:bg-navy-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Minimalist Tip Box */}
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-navy-800">
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg bg-burgundy-800 text-cream-50 shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-cream-50">
                {role === 'teacher' ? 'Eğitmen Tavsiyesi' : 'Günün Çalışma Notu'}
              </p>
              <p className="text-[10px] text-cream-300/80 mt-0.5 leading-relaxed">
                {role === 'teacher'
                  ? 'Eklenen tüm gramer ve deneme soruları anında öğrencilerin takvim ve modüllerine yansır.'
                  : 'Günde 15 dakika aralıklı tekrar yapmak, dil ediniminde kalıcılığı %80 artırır.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-navy-900 text-center">
        <p className="text-[10px] font-bold tracking-wider text-cream-400/60 uppercase">
          DerinTalks v1.2 Minimalist
        </p>
        <p className="text-[9px] text-cream-500/40">
          Tüm Hakları Saklıdır © 2026
        </p>
      </div>
    </aside>
  );
}
