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
  BookOpen,
  ShieldAlert
} from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shadow-md">
              <span className="font-black text-base text-white">D</span>
              <span className="font-black text-xs text-red-500">T</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight">
                  <span className="text-[#0F172A]">Derin</span><span className="text-red-600">Talks</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Modern Dil & Sınav Platformu</p>
            </div>
          </div>

          {/* Center: Role Switcher & Badges */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Role Indicator Pill */}
              <div
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isTeacherOrAdmin
                    ? 'bg-violet-100 text-violet-800 border-violet-200'
                    : 'bg-sky-100 text-sky-800 border-sky-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isTeacherOrAdmin ? 'bg-violet-500 animate-pulse' : 'bg-sky-400'
                  }`}
                />
                <span>
                  {role === 'admin'
                    ? 'Yönetici & Kurucu'
                    : role === 'teacher'
                    ? 'Eğitmen Masası'
                    : 'Öğrenci Paneli'}
                </span>
              </div>

              {/* Student Stats Badges */}
              {!isTeacherOrAdmin && (
                <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-rose-50 rounded-lg text-rose-700 text-xs font-semibold border border-rose-200">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>{user.streak_days || 1} Gün</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 rounded-lg text-amber-700 text-xs font-semibold border border-amber-200">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user.xp_points || 0} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-sky-50 rounded-lg text-sky-700 text-xs font-bold border border-sky-200">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
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
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-stone-100 transition-all border border-transparent hover:border-stone-200"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-[#0F172A] leading-tight">
                      {user.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {role === 'admin' ? 'Kurucu (Admin)' : role === 'teacher' ? 'Eğitmen' : 'Öğrenci'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-[#0F172A]">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-700 border border-red-200">
                        {isTeacherOrAdmin ? 'Eğitmen Masası' : `Aktif Seviye: ${user.current_level}`}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenAuthModal();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-[#0F172A] hover:bg-stone-50 text-left transition-colors font-medium"
                      >
                        <UserCheck className="w-4 h-4 text-slate-600" />
                        <span>Hesap Değiştir</span>
                      </button>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition-colors font-semibold"
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
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-md shadow-red-900/20 transition-all"
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
