import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import AuthForm from './components/AuthForm';
import CampusAssistant from './components/CampusAssistant';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CurriculumView from './pages/student/CurriculumView';
import FlashcardsView from './pages/student/FlashcardsView';
import GamesHub from './pages/student/GamesHub';
import ExamPrepView from './pages/student/ExamPrepView';
import ScheduleView from './pages/student/ScheduleView';
import ReadingLibraryView from './pages/student/ReadingLibraryView';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ContentManager from './pages/teacher/ContentManager';
import ExamManager from './pages/teacher/ExamManager';
import StudentTracker from './pages/teacher/StudentTracker';

import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Gamepad2,
  FileCheck2,
  CalendarDays,
  FileEdit,
  Users,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const { user, role, loading } = useAuth();
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';
  const [activeTab, setActiveTab] = useState(isTeacherOrAdmin ? 'teacher-dashboard' : 'dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync activeTab when role changes (e.g. from navbar toggle or login)
  useEffect(() => {
    if (isTeacherOrAdmin) {
      if (!['teacher-dashboard', 'content-manager', 'exam-manager', 'student-tracker'].includes(activeTab)) {
        setActiveTab('teacher-dashboard');
      }
    } else {
      if (!['dashboard', 'schedule', 'curriculum', 'readers', 'games', 'games-hub', 'flashcards', 'exams'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-900/10 animate-pulse">
            <span className="text-white">D</span>
            <span className="text-red-500 text-sm font-black">T</span>
          </div>
          <p className="text-xs font-bold text-[#0F172A]">DerinTalks yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Show clean, off-white, modern Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex flex-col font-sans relative selection:bg-red-100 selection:text-red-900">
        
        {/* Top Header with 'DerinTalks' Logo */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black text-base shadow-md shadow-slate-900/10">
              <span className="text-white">D</span>
              <span className="text-red-500 text-xs font-black">T</span>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-black text-[#0F172A] tracking-tight">Derin</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">Talks</span>
              </div>
              <p className="text-[11px] text-[#0F172A]/70 font-semibold tracking-wide hidden sm:block">
                Modern İngilizce & Sınav Hazırlık Platformu
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-6 sm:py-10">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Inspiring Highlights */}
            <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/70 text-red-700 text-xs font-bold w-fit shadow-sm">
                <span>🎯</span>
                <span>Akıcı & Özgüvenli İngilizce Kampüsü</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
                İngilizceyi ezberleme, <br />
                <span className="text-red-600">
                  hayatında yaşa.
                </span>
              </h1>

              <p className="text-sm xl:text-base text-[#0F172A]/80 font-medium leading-relaxed max-w-lg">
                YKS-DİL, TOEFL, hazırlık atlama ve günlük konuşma pratiklerin için tasarlanmış ferah, modern ve sonuç odaklı dijital kampüs alanı.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-3.5 pt-2 max-w-lg">
                <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:border-red-200 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                    🗣️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Akıcı Konuşma Pratikleri</h4>
                    <p className="text-[11px] text-[#0F172A]/70 font-medium">Hata yapmaktan çekinmeden, samimi ve interaktif akış.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:border-red-200 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-[#0F172A] flex items-center justify-center font-bold text-sm shrink-0">
                    🧠
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Akıllı SRS Kelime Sistemi</h4>
                    <p className="text-[11px] text-[#0F172A]/70 font-medium">Unutmayı engelleyen bilimsel aralıklı tekrar algoritması.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:border-red-200 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Sınav ve Seviye Testleri</h4>
                    <p className="text-[11px] text-[#0F172A]/70 font-medium">YKS-DİL, TOEFL ve seviye tespit modülleri ile hedefine ulaş.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean, Off-White Auth Form Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-stone-200/80 relative">
                <div className="text-center mb-5 lg:hidden">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-xl font-black text-[#0F172A]">Derin</span>
                    <span className="text-xl font-black text-red-600">Talks</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">Hoş Geldin! 👋</h2>
                  <p className="text-xs text-[#0F172A]/70 mt-1">Giriş yap veya saniyeler içinde hesabını aç</p>
                </div>

                <AuthForm />
              </div>
            </div>

          </div>
        </main>

        {/* Minimal Subtle Footer */}
        <footer className="py-4 text-center text-xs text-[#0F172A]/60 font-medium">
          <p>© {new Date().getFullYear()} DerinTalks. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    );
  }

  const renderContent = () => {
    if (isTeacherOrAdmin) {
      switch (activeTab) {
        case 'teacher-dashboard':
          return <TeacherDashboard onNavigate={setActiveTab} />;
        case 'content-manager':
          return <ContentManager />;
        case 'exam-manager':
          return <ExamManager />;
        case 'student-tracker':
          return <StudentTracker />;
        default:
          return <TeacherDashboard onNavigate={setActiveTab} />;
      }
    }

    // Default Student role: Reordered per hierarchy
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard onNavigate={setActiveTab} />;
      case 'schedule':
        return <ScheduleView />;
      case 'curriculum':
        return <CurriculumView />;
      case 'readers':
        return <ReadingLibraryView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'games':
      case 'games-hub':
        return <GamesHub onNavigate={setActiveTab} />;
      case 'exams':
        return <ExamPrepView />;
      default:
        return <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  const mobileNavItems = isTeacherOrAdmin ? [
    { id: 'teacher-dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'content-manager', label: 'İçerik', icon: FileEdit },
    { id: 'exam-manager', label: 'Soru CMS', icon: FileCheck2 },
    { id: 'student-tracker', label: 'Öğrenci', icon: Users },
  ] : [
    { id: 'dashboard', label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'schedule', label: 'Programım', icon: CalendarDays },
    { id: 'curriculum', label: 'Müfredat', icon: BookOpen },
    { id: 'readers', label: 'Okuma', icon: Layers },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2 },
    { id: 'exams', label: 'Test Çöz', icon: FileCheck2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#0F172A]">
      
      {/* Top Navigation Bar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex pb-16 md:pb-0">
        
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={isTeacherOrAdmin ? 'teacher' : 'student'} />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950 text-cream-100 border-t border-navy-900 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-burgundy-400 scale-105' : 'text-cream-400 hover:text-cream-100'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Campus Assistant Live Chat / Motivation Widget */}
      <CampusAssistant user={user} />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

    </div>
  );
}
