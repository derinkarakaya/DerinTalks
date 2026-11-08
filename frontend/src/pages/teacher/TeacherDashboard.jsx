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

      {/* ───── Teacher Hero - Ferah, Canlı Tasarım ───── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-50 p-6 sm:p-8 border border-sky-200 shadow-sm">

        {/* Dekoratif daireler */}
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-indigo-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold mb-3">
            <School className="w-3.5 h-3.5 text-rose-500" />
            <span>DerinTalks Eğitmen Masası</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 leading-tight">
            Öğretmen Kontrol Paneli (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
            Buradan tüm seviyelere (A1 - C2) gramer notları, okuma metinleri, kelime kartları ve YDS/LGS soruları yükleyebilir, öğrencilerinizin ilerlemesini anlık takip edebilirsiniz.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('content-manager')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-200 transition-all flex items-center space-x-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Müfredat & İçerik Yönetimi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('exam-manager')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-sky-300 transition-all flex items-center space-x-2 shadow-sm"
            >
              <FileCheck2 className="w-4 h-4 text-sky-500" />
              <span>YDS / LGS Soru Ekle</span>
            </button>
            <button
              onClick={() => onNavigate('student-tracker')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-rose-300 transition-all flex items-center space-x-2 shadow-sm"
            >
              <Users className="w-4 h-4 text-rose-500" />
              <span>Öğrenci Takip Sistemi</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───── 4 Metric Stats Cards - Ferah Pastel ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Kayıtlı Öğrenciler</div>
            <div className="text-xl font-black text-slate-800">{trackingData?.total_students || 0} Öğrenci</div>
            <div className="text-[11px] text-sky-600 font-bold">Aktif takipte</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Müfredat Modülleri</div>
            <div className="text-xl font-black text-slate-800">{trackingData?.total_curriculum_items || 24} Modül</div>
            <div className="text-[11px] text-violet-600 font-bold">A1 - C2 Kapsamında</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Kelime Kartı Havuzu</div>
            <div className="text-xl font-black text-slate-800">16+ Kart</div>
            <div className="text-[11px] text-rose-600 font-bold">Leitner Algoritmalı</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Sınav Soru Havuzu</div>
            <div className="text-xl font-black text-slate-800">YDS & LGS</div>
            <div className="text-[11px] text-amber-600 font-bold">ÖSYM & MEB Uyumlu</div>
          </div>
        </div>
      </div>

      {/* ───── Quick Student Highlights Table - Temiz Liste ───── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-800">Öğrenci Gelişim Özeti</h2>
            <p className="text-xs text-slate-500 font-medium">Öğrencilerin müfredat ilerlemesi ve sınav başarıları</p>
          </div>
          <button
            onClick={() => onNavigate('student-tracker')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 transition-colors"
          >
            <span>Detaylı Takip Tablosu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Öğrenci</th>
                <th className="py-3 px-4">Aktif Seviye</th>
                <th className="py-3 px-4">Müfredat İlerlemesi</th>
                <th className="py-3 px-4">Kelime Ustalığı</th>
                <th className="py-3 px-4">Sınav Ortalaması</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((st) => (
                <tr key={st.student_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 font-black flex items-center justify-center text-xs shadow-sm">
                        {st.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{st.full_name}</div>
                        <div className="text-[11px] text-slate-500">{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      {st.current_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-700 font-bold">
                        <span>{st.completed_modules} / {st.total_modules} modül</span>
                        <span>%{st.module_progress_pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-400 rounded-full shadow-sm"
                          style={{ width: `${st.module_progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-bold">
                      {st.mastered_flashcards} kelime
                    </span>
                    <span className="text-slate-400 text-[10px] block font-semibold">4. Kutuda kalıcı</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-rose-600 text-sm">
                      %{st.average_exam_score}
                    </span>
                    <span className="text-slate-400 text-[10px] block font-semibold">
                      {st.exams_taken} deneme çözüldü
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('student-tracker')}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-sm"
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