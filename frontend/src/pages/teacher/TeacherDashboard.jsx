import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Users,
  BookOpen,
  Layers,
  FileCheck2,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';

export default function TeacherDashboard({ onNavigate }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = async () => {
    try {
      const data = await api.getStudentsTracking();
      setTrackingData(data);
    } catch (err) {
      console.error("Failed to load tracking data", err);
    } finally {
      setLoading(false);
    }
  };

  const students = trackingData?.students || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Teacher Hero */}
      <div className="rounded-3xl bg-navy-950 p-6 sm:p-8 text-cream-50 shadow-card border border-navy-900 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burgundy-900/60 border border-burgundy-700/60 text-cream-100 text-xs font-semibold mb-3">
            <School className="w-3.5 h-3.5 text-cream-200" />
            <span>DerinTalks Eğitmen Masası</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-cream-50">
            Öğretmen Kontrol Paneli (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/80 mt-2 leading-relaxed">
            Buradan tüm seviyelere (A1 - C2) gramer notları, okuma metinleri, kelime kartları ve YDS/LGS soruları yükleyebilir, öğrencilerinizin ilerlemesini anlık takip edebilirsiniz.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('content-manager')}
              className="px-5 py-2.5 rounded-xl bg-cream-50 text-navy-950 hover:bg-cream-100 font-bold text-xs shadow-md transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-navy-800" />
              <span>Müfredat & İçerik Yönetimi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('exam-manager')}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-cream-100 font-semibold text-xs border border-navy-800 transition-all flex items-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4 text-cream-300" />
              <span>YDS / LGS Soru Ekle</span>
            </button>
            <button
              onClick={() => onNavigate('student-tracker')}
              className="px-5 py-2.5 rounded-xl bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 font-semibold text-xs transition-all flex items-center space-x-2 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Öğrenci Takip Sistemi</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-burgundy-900/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-[#EAE2D5] text-navy-900 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-navy-800" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Kayıtlı Öğrenciler</div>
            <div className="text-xl font-extrabold text-navy-950">{trackingData?.total_students || 0} Öğrenci</div>
            <div className="text-[11px] text-navy-800 font-medium">Aktif takipte</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 text-navy-900 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-navy-800" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Müfredat Modülleri</div>
            <div className="text-xl font-extrabold text-navy-950">{trackingData?.total_curriculum_items || 24} Modül</div>
            <div className="text-[11px] text-navy-800 font-medium">A1 - C2 Kapsamında</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-50 border border-burgundy-100 text-burgundy-900 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-burgundy-800" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Kelime Kartı Havuzu</div>
            <div className="text-xl font-extrabold text-navy-950">16+ Kart</div>
            <div className="text-[11px] text-burgundy-800 font-medium">Leitner Algoritmalı</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cream-50 border border-[#EAE2D5] text-navy-900 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/60">Sınav Soru Havuzu</div>
            <div className="text-xl font-extrabold text-navy-950">YDS & LGS</div>
            <div className="text-[11px] text-amber-700 font-medium">ÖSYM & MEB Uyumlu</div>
          </div>
        </div>
      </div>

      {/* Quick Student Highlights Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy-950">Öğrenci Gelişim Özeti</h2>
            <p className="text-xs text-navy-700/60">Öğrencilerin müfredat ilerlemesi ve sınav başarıları</p>
          </div>
          <button
            onClick={() => onNavigate('student-tracker')}
            className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center space-x-1"
          >
            <span>Detaylı Takip Tablosu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-navy-700/60 font-semibold uppercase text-[10px] tracking-wider border-y border-[#EAE2D5]">
              <tr>
                <th className="py-3 px-4">Öğrenci</th>
                <th className="py-3 px-4">Aktif Seviye</th>
                <th className="py-3 px-4">Müfredat İlerlemesi</th>
                <th className="py-3 px-4">Kelime Ustalığı</th>
                <th className="py-3 px-4">Sınav Ortalaması</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D5] font-medium">
              {students.map((st) => (
                <tr key={st.student_id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-navy-950 text-cream-50 font-bold flex items-center justify-center text-xs">
                        {st.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-navy-950">{st.full_name}</div>
                        <div className="text-[11px] text-navy-700/60">{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-900 border border-navy-200 font-bold">
                      {st.current_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px] text-navy-900 font-semibold">
                        <span>{st.completed_modules} / {st.total_modules} modül</span>
                        <span>%{st.module_progress_pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy-900 rounded-full"
                          style={{ width: `${st.module_progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-navy-950 font-semibold">
                      {st.mastered_flashcards} kelime
                    </span>
                    <span className="text-navy-700/50 text-[10px] block">4. Kutuda kalıcı</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-burgundy-700 text-sm">
                      %{st.average_exam_score}
                    </span>
                    <span className="text-navy-700/50 text-[10px] block">
                      {st.exams_taken} deneme çözüldü
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('student-tracker')}
                      className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-navy-900 text-xs font-semibold transition-colors border border-[#EAE2D5]"
                    >
                      İncele
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
