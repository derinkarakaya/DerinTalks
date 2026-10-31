import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Zap,
  GraduationCap,
  Sparkles,
  UserCheck,
  LogOut,
  ChevronDown,
  Layers,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE2D5] shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center text-cream-50 shadow-md">
              <span className="font-extrabold text-xl tracking-tight text-cream-50">D</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-navy-950 tracking-tight">
                  DerinTalks
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-cream-100 text-navy-900 border border-[#EAE2D5]">
                  English
                </span>
              </div>
              <p className="text-[11px] text-navy-700/60 hidden sm:block font-medium">Modern Dil & Sınav Platformu</p>
            </div>
          </div>

          {/* Center: Role Switcher & Badges */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Role Indicator Pill */}
              <div
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  role === 'teacher'
                    ? 'bg-burgundy-50 text-burgundy-900 border-burgundy-200'
                    : 'bg-navy-50 text-navy-900 border-navy-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    role === 'teacher' ? 'bg-burgundy-700' : 'bg-navy-900'
                  }`}
                />
                <span>{role === 'teacher' ? 'Öğretmen Masası' : 'Öğrenci Paneli'}</span>
              </div>

              {/* Student Stats Badges */}
              {role === 'student' && (
                <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-[#EAE2D5]">
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-cream-50 rounded-lg text-navy-900 text-xs font-semibold border border-[#EAE2D5]">
                    <Flame className="w-3.5 h-3.5 text-burgundy-700" />
                    <span>{user.streak_days || 1} Gün</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-cream-50 rounded-lg text-navy-900 text-xs font-semibold border border-[#EAE2D5]">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user.xp_points || 0} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-navy-50 rounded-lg text-navy-900 text-xs font-bold border border-navy-200">
                    <GraduationCap className="w-3.5 h-3.5 text-navy-700" />
                    <span>Seviye {user.current_level || 'A1'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right: User Profile or Login */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-cream-100 transition-all border border-transparent hover:border-[#EAE2D5]"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-950 flex items-center justify-center text-cream-50 font-bold text-xs shadow-sm">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-navy-950 leading-tight">
                      {user.full_name}
                    </div>
                    <div className="text-[10px] text-navy-700/60 font-medium">
                      {role === 'teacher' ? 'Eğitmen' : 'Öğrenci'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EAE2D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#EAE2D5]">
                      <p className="text-xs font-bold text-navy-950">{user.full_name}</p>
                      <p className="text-[11px] text-navy-700/60 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-cream-100 text-navy-900 border border-[#EAE2D5]">
                        {role === 'teacher' ? 'Eğitmen Masası' : `Aktif Seviye: ${user.current_level}`}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenAuthModal();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-navy-900 hover:bg-cream-100 text-left transition-colors font-medium"
                      >
                        <UserCheck className="w-4 h-4 text-navy-700" />
                        <span>Giriş Yap / Yeni Hesap Oluştur</span>
                      </button>
                    </div>

                    <div className="border-t border-[#EAE2D5] pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-burgundy-800 hover:bg-burgundy-50 text-left transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Oturumu Kapat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 shadow-md transition-all"
              >
                Giriş Yap / Kayıt Ol
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
