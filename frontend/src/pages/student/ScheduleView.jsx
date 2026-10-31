import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  CalendarDays,
  Clock,
  Video,
  User,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export default function ScheduleView() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [title, setTitle] = useState('');
  const [dayName, setDayName] = useState('Pazartesi');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [category, setCategory] = useState('canli_ders');
  const [instructor, setInstructor] = useState('DerinTalks Eğitmeni');
  const [description, setDescription] = useState('');
  const [zoomLink, setZoomLink] = useState('');

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await api.getSchedule();
      setScheduleItems(data);
    } catch (err) {
      console.error("Failed to load schedule", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createScheduleItem({
        title,
        day_name: dayName,
        start_time: startTime,
        end_time: endTime,
        category,
        instructor_name: instructor,
        description,
        zoom_link: zoomLink
      });
      setShowAddModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setZoomLink('');
      fetchSchedule();
    } catch (err) {
      alert("Program eklenirken bir hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ders programını silmek istediğinize emin misiniz?")) return;
    try {
      await api.deleteScheduleItem(id);
      fetchSchedule();
    } catch (err) {
      console.error("Failed to delete schedule item", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-navy-50 text-navy-900 border border-navy-200">
              <CalendarDays className="w-5 h-5 text-navy-800" />
            </span>
            <h1 className="text-xl font-extrabold text-navy-950">
              Ders Programım & Canlı Etkinlik Takvimi
            </h1>
          </div>
          <p className="text-xs text-navy-700/60 mt-1">
            Haftalık canlı dersleriniz, Speaking Club oturumlarınız ve kişiselleştirilmiş çalışma saatleriniz.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-cream-200" />
          <span>Yeni Program Ekle</span>
        </button>
      </div>

      {/* Weekly Schedule Days Cards */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {daysOfWeek.map((day) => {
            const dayItems = scheduleItems.filter((i) => i.day_name === day);

            return (
              <div
                key={day}
                className="bg-white rounded-3xl p-4 border border-[#EAE2D5] shadow-soft flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE2D5]">
                    <span className="font-extrabold text-xs text-navy-950 uppercase tracking-wide">
                      {day}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cream-100 text-navy-900 border border-[#EAE2D5]">
                      {dayItems.length} Etkinlik
                    </span>
                  </div>

                  {dayItems.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-navy-700/50">
                      Planlanmış ders yok
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {dayItems.map((item) => {
                        let catStyle = 'bg-navy-50 text-navy-900 border-navy-200';
                        if (item.category === 'speaking') catStyle = 'bg-burgundy-50 text-burgundy-900 border-burgundy-200';
                        if (item.category === 'exam') catStyle = 'bg-cream-100 text-navy-900 border-[#EAE2D5]';
                        if (item.category === 'tekrar') catStyle = 'bg-amber-50 text-amber-900 border-amber-200';

                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl bg-cream-50 border border-[#EAE2D5] hover:border-navy-300 transition-all space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catStyle}`}>
                                {item.category === 'speaking' ? 'Speaking Club' : item.category === 'exam' ? 'Sınav Kampı' : 'Canlı Ders'}
                              </span>

                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-navy-400 hover:text-burgundy-700 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <h4 className="text-xs font-bold text-navy-950 leading-snug">
                              {item.title}
                            </h4>

                            <div className="flex items-center space-x-1.5 text-[11px] text-navy-700/70">
                              <Clock className="w-3 h-3 text-navy-400" />
                              <span>{item.start_time} - {item.end_time}</span>
                            </div>

                            {item.instructor_name && (
                              <div className="flex items-center space-x-1.5 text-[10px] text-navy-700/60">
                                <User className="w-3 h-3 text-navy-400" />
                                <span>{item.instructor_name}</span>
                              </div>
                            )}

                            {item.zoom_link && (
                              <a
                                href={item.zoom_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 text-[11px] font-bold text-burgundy-700 hover:text-burgundy-900 pt-1"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Canlı Derse Katıl</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setDayName(day);
                    setShowAddModal(true);
                  }}
                  className="w-full mt-3 py-1.5 rounded-xl border border-dashed border-[#EAE2D5] text-navy-700/60 hover:text-navy-950 hover:border-navy-400 text-[11px] font-semibold transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ders Ekle</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Schedule Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EAE2D5]">
            <h3 className="text-lg font-bold text-navy-950 mb-1">Yeni Ders / Etkinlik Ekle</h3>
            <p className="text-xs text-navy-700/60 mb-4">Haftalık çalışma takviminize yeni bir oturum planlayın.</p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Ders Başlığı</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: B1 Speaking Club"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Gün</label>
                  <select
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="canli_ders">Canlı Ders</option>
                    <option value="speaking">Speaking Club</option>
                    <option value="exam">Sınav Kampı</option>
                    <option value="tekrar">Kelime Tekrarı</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Başlangıç Saati</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Bitiş Saati</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Eğitmen / Koç Adı</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="DerinTalks Eğitmeni"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Canlı Ders / Zoom Bağlantısı (Opsiyonel)</label>
                <input
                  type="url"
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder="https://meet.derintalks.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#EAE2D5] text-xs font-semibold text-navy-800 hover:bg-cream-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 text-xs font-bold shadow-md"
                >
                  Programı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
