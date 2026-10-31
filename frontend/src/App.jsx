import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import AuthForm from './components/AuthForm';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CurriculumView from './pages/student/CurriculumView';
import FlashcardsView from './pages/student/FlashcardsView';
import GamesHub from './pages/student/GamesHub';
import ExamPrepView from './pages/student/ExamPrepView';
import ScheduleView from './pages/student/ScheduleView';

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
  const [activeTab, setActiveTab] = useState(role === 'teacher' ? 'teacher-dashboard' : 'dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync activeTab when role changes (e.g. from navbar toggle)
  useEffect(() => {
    if (role === 'teacher') {
      if (!['teacher-dashboard', 'content-manager', 'exam-manager', 'student-tracker'].includes(activeTab)) {
        setActiveTab('teacher-dashboard');
      }
    } else {
      if (!['dashboard', 'curriculum', 'flashcards', 'games', 'exams', 'schedule'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 flex items-center justify-center text-cream-50 font-black text-2xl shadow-lg animate-pulse">
            D
          </div>
          <p className="text-xs font-bold text-navy-900">DerinTalks Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Show elegant full-screen AuthForm card
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
        <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EAE2D5] my-6 animate-in fade-in duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-navy-950 flex items-center justify-center text-[#FAF8F5] shadow-md mb-3">
                <GraduationCap className="w-6 h-6 text-[#FAF8F5]" />
              </div>
              <h1 className="text-2xl font-black text-navy-950 tracking-tight">DerinTalks</h1>
              <p className="text-xs text-[#6F6B64] mt-1 font-medium">Modern İngilizce & Sınav Hazırlık Platformu</p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (role === 'teacher') {
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

    // Default Student role
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard onNavigate={setActiveTab} />;
      case 'curriculum':
        return <CurriculumView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'games':
        return <GamesHub />;
      case 'exams':
        return <ExamPrepView />;
      case 'schedule':
        return <ScheduleView />;
      default:
        return <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  const mobileNavItems = role === 'teacher' ? [
    { id: 'teacher-dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'content-manager', label: 'İçerik', icon: FileEdit },
    { id: 'exam-manager', label: 'Soru CMS', icon: FileCheck2 },
    { id: 'student-tracker', label: 'Öğrenci', icon: Users },
  ] : [
    { id: 'dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Müfredat', icon: BookOpen },
    { id: 'flashcards', label: 'Kelimeler', icon: Layers },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2 },
    { id: 'exams', label: 'Sınavlar', icon: FileCheck2 },
    { id: 'schedule', label: 'Takvim', icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex pb-16 md:pb-0">
        
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />

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

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

    </div>
  );
}
