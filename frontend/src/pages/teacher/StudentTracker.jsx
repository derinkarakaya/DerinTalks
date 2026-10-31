import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Layers,
  Award,
  Flame,
  Zap,
  CheckCircle2,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

export default function StudentTracker() {
  const [trackingData, setTrackingData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentsTracking();
      setTrackingData(data);
    } catch (err) {
      console.error("Failed to load students tracking", err);
    } finally {
      setLoading(false);
    }
  };

  const students = (trackingData?.students || []).filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || s.current_level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-navy-900 text-burgundy-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-navy-900 tracking-tight">
              Öğrenci Gelişim & Başarı Takip Sistemi
            </h1>
          </div>
          <p className="text-xs text-[#6F6B64] mt-1 font-medium">
            Öğrencilerinizin CEFR seviye tamamlama oranlarını, Leitner kelime kartı başarılarını ve YDS/LGS deneme puanlarını izleyin.
          </p>
        </div>

        <div className="px-5 py-2.5 bg-white rounded-2xl border border-[#EAE2D5] text-center shadow-sm">
          <div className="text-[10px] font-bold text-[#8C867A] uppercase tracking-wider">Toplam Kayıtlı Öğrenci</div>
          <div className="text-2xl font-black text-navy-900">{trackingData?.total_students || 0}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D5] shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C867A] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Öğrenci adı veya e-posta ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 placeholder:text-[#8C867A] focus:outline-none focus:border-navy-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-[#8C867A] mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Seviye:</span>
          </span>
          {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-navy-900 text-[#FAF8F5] shadow-sm'
                  : 'bg-white text-[#6F6B64] border border-[#EAE2D5] hover:bg-[#FAF8F5]'
              }`}
            >
              {lvl === 'ALL' ? 'Tümü' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#EAE2D5]">
          <Users className="w-12 h-12 text-[#8C867A] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[#6F6B64] font-medium">Aranan kriterlere uygun öğrenci bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE2D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#8C867A] font-bold uppercase text-[10px] tracking-wider border-b border-[#EAE2D5]">
                <tr>
                  <th className="py-3.5 px-4">Öğrenci</th>
                  <th className="py-3.5 px-4">Seviye</th>
                  <th className="py-3.5 px-4">Müfredat İlerlemesi</th>
                  <th className="py-3.5 px-4">Leitner Kelime Hafızası</th>
                  <th className="py-3.5 px-4">Sınav Performansı</th>
                  <th className="py-3.5 px-4">Seri & XP</th>
                  <th className="py-3.5 px-4 text-right">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] font-medium text-[#3E3A33]">
                {students.map((st) => (
                  <tr key={st.student_id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy-900 text-[#FAF8F5] font-black flex items-center justify-center text-xs">
                          {st.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900">{st.full_name}</div>
                          <div className="text-[11px] text-[#8C867A]">{st.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-burgundy-50 border border-burgundy-200 text-burgundy-800 font-bold">
                        {st.current_level}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] text-[#6F6B64] font-bold">
                          <span>{st.completed_modules} / {st.total_modules}</span>
                          <span>%{st.module_progress_pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#EAE2D5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-navy-900 rounded-full"
                            style={{ width: `${st.module_progress_pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-navy-900 border border-[#EAE2D5]">
                          {st.mastered_flashcards} Mastered
                        </span>
                        <span className="text-[11px] text-[#8C867A]">
                          ({st.learning_flashcards} öğreniliyor)
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-burgundy-800 text-sm">
                        %{st.average_exam_score}
                      </span>
                      <span className="text-[10px] text-[#8C867A] block">
                        {st.exams_taken} deneme çözüldü
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-0.5 text-burgundy-700 text-[11px] font-bold">
                          <Flame className="w-3.5 h-3.5 text-burgundy-600" />
                          <span>{st.streak_days}g</span>
                        </span>
                        <span className="flex items-center space-x-0.5 text-navy-900 text-[11px] font-bold">
                          <Zap className="w-3.5 h-3.5 text-navy-800" />
                          <span>{st.xp_points} XP</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-navy-900 hover:text-[#FAF8F5] text-navy-900 border border-[#EAE2D5] text-xs font-bold transition-all shadow-sm"
                      >
                        Gelişim Raporu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE2D5] space-y-5">
            <div className="flex items-start justify-between border-b border-[#EAE2D5] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-[#FAF8F5] font-black text-lg flex items-center justify-center shadow-sm">
                  {selectedStudent.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-navy-900">{selectedStudent.full_name}</h3>
                  <p className="text-xs text-[#8C867A]">{selectedStudent.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-burgundy-50 border border-burgundy-200 text-burgundy-800">
                    Aktif Seviye: {selectedStudent.current_level}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-full text-[#8C867A] hover:text-navy-900 hover:bg-[#EAE2D5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D5] text-center">
                <span className="text-[10px] font-bold uppercase text-[#8C867A]">Müfredat Tamamlama</span>
                <p className="text-lg font-black text-navy-900">%{selectedStudent.module_progress_pct}</p>
                <span className="text-[10px] text-[#6F6B64]">
                  {selectedStudent.completed_modules} / {selectedStudent.total_modules} modül
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D5] text-center">
                <span className="text-[10px] font-bold uppercase text-burgundy-700">Kalıcı Kelime (Box 4)</span>
                <p className="text-lg font-black text-burgundy-800">{selectedStudent.mastered_flashcards}</p>
                <span className="text-[10px] text-burgundy-600">Öğrenilmiş kelime</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D5] text-center">
                <span className="text-[10px] font-bold uppercase text-navy-900">Sınav Başarısı</span>
                <p className="text-lg font-black text-navy-900">%{selectedStudent.average_exam_score}</p>
                <span className="text-[10px] text-[#6F6B64]">Ortalama net puanı</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D5] text-center">
                <span className="text-[10px] font-bold uppercase text-navy-900">Toplam XP</span>
                <p className="text-lg font-black text-navy-900">{selectedStudent.xp_points} XP</p>
                <span className="text-[10px] text-[#6F6B64]">{selectedStudent.streak_days} gün seri</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE2D5] text-xs text-[#555047] space-y-1">
              <p className="font-bold text-navy-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-burgundy-700" />
                <span>Eğitmen Görüşü & Tavsiyesi:</span>
              </p>
              <p className="leading-relaxed">
                Öğrenci {selectedStudent.current_level} gramer ve okuma metinlerinde düzenli ilerleme gösteriyor. Aralıklı tekrar kutusundaki {selectedStudent.learning_flashcards} kelimeyi pekiştirmek için haftalık kelime etüdüne katılması önerilir.
              </p>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-[#FAF8F5] font-bold text-xs shadow-md transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
