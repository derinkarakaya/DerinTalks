import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  BookOpen,
  Layers,
  Plus,
  Trash2,
  Edit,
  FileText,
  HelpCircle,
  Gamepad2,
  Search,
  Filter,
  CheckCircle,
  X
} from 'lucide-react';

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' or 'flashcards'
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [modules, setModules] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Modules
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [modTitle, setModTitle] = useState('');
  const [modSubtitle, setModSubtitle] = useState('');
  const [modLevel, setModLevel] = useState('A1');
  const [modType, setModType] = useState('grammar');
  const [modDescription, setModDescription] = useState('');
  const [modContent, setModContent] = useState('');
  const [modMinutes, setModMinutes] = useState(15);

  // Modal State for Flashcards
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [fcWord, setFcWord] = useState('');
  const [fcPhonetic, setFcPhonetic] = useState('');
  const [fcTranslation, setFcTranslation] = useState('');
  const [fcLevel, setFcLevel] = useState('A1');
  const [fcPos, setFcPos] = useState('noun');
  const [fcExampleEn, setFcExampleEn] = useState('');
  const [fcExampleTr, setFcExampleTr] = useState('');
  const [fcCategory, setFcCategory] = useState('Genel Kelimeler');

  useEffect(() => {
    fetchContent();
  }, [activeTab, selectedLevel]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'curriculum') {
        const lvl = selectedLevel === 'ALL' ? 'A1' : selectedLevel;
        const data = await api.getModules(lvl);
        setModules(data);
      } else {
        const data = await api.getFlashcards(selectedLevel);
        setFlashcards(data);
      }
    } catch (err) {
      console.error("Failed to load CMS content", err);
    } finally {
      setLoading(false);
    }
  };

  // Module Submit
  const handleSaveModule = async (e) => {
    e.preventDefault();
    let jsonString = modContent;

    // Default basic valid json if user inputs plain text
    try {
      JSON.parse(modContent);
    } catch {
      if (modType === 'grammar') {
        jsonString = JSON.stringify({
          explanation: modContent,
          rules: [{ rule: "Genel Kural", example: modSubtitle || "Example sentence" }],
          practice_quiz: []
        });
      } else if (modType === 'reading') {
        jsonString = JSON.stringify({
          passage: modContent,
          vocabulary_hints: [],
          questions: []
        });
      } else {
        jsonString = JSON.stringify({ questions: [] });
      }
    }

    const payload = {
      level: modLevel,
      module_type: modType,
      title: modTitle,
      subtitle: modSubtitle,
      description: modDescription,
      content_json: jsonString,
      estimated_minutes: parseInt(modMinutes, 10) || 15
    };

    try {
      if (editingModule) {
        await api.updateModule(editingModule.id, payload);
      } else {
        await api.createModule(payload);
      }
      setShowModuleModal(false);
      resetModuleForm();
      fetchContent();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Bu modülü kalıcı olarak silmek istiyor musunuz?")) return;
    try {
      await api.deleteModule(id);
      fetchContent();
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  const openEditModule = (mod) => {
    setEditingModule(mod);
    setModTitle(mod.title);
    setModSubtitle(mod.subtitle || '');
    setModLevel(mod.level);
    setModType(mod.module_type);
    setModDescription(mod.description || '');
    setModContent(mod.content_json);
    setModMinutes(mod.estimated_minutes);
    setShowModuleModal(true);
  };

  const resetModuleForm = () => {
    setEditingModule(null);
    setModTitle('');
    setModSubtitle('');
    setModLevel('A1');
    setModType('grammar');
    setModDescription('');
    setModContent('');
    setModMinutes(15);
  };

  // Flashcard Submit
  const handleSaveFlashcard = async (e) => {
    e.preventDefault();
    const payload = {
      level: fcLevel,
      word: fcWord,
      phonetic: fcPhonetic,
      translation: fcTranslation,
      part_of_speech: fcPos,
      example_en: fcExampleEn,
      example_tr: fcExampleTr,
      category: fcCategory
    };

    try {
      if (editingCard) {
        await api.updateFlashcard(editingCard.id, payload);
      } else {
        await api.createFlashcard(payload);
      }
      setShowFlashcardModal(false);
      resetFlashcardForm();
      fetchContent();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (!window.confirm("Bu kelime kartını silmek istiyor musunuz?")) return;
    try {
      await api.deleteFlashcard(id);
      fetchContent();
    } catch (err) {
      alert("Silinemedi.");
    }
  };

  const openEditFlashcard = (card) => {
    setEditingCard(card);
    setFcWord(card.word);
    setFcPhonetic(card.phonetic || '');
    setFcTranslation(card.translation);
    setFcLevel(card.level);
    setFcPos(card.part_of_speech);
    setFcExampleEn(card.example_en);
    setFcExampleTr(card.example_tr);
    setFcCategory(card.category);
    setShowFlashcardModal(true);
  };

  const resetFlashcardForm = () => {
    setEditingCard(null);
    setFcWord('');
    setFcPhonetic('');
    setFcTranslation('');
    setFcLevel('A1');
    setFcPos('noun');
    setFcExampleEn('');
    setFcExampleTr('');
    setFcCategory('Genel Kelimeler');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-navy-950">
            Müfredat & İçerik Yönetim Masası (CMS)
          </h1>
          <p className="text-xs text-navy-700/60 mt-1">
            Gramer ders notları, okuma pasajları, seviye quizleri ve Leitner kelime kartları oluşturun ve yönetin.
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'curriculum') {
              resetModuleForm();
              setShowModuleModal(true);
            } else {
              resetFlashcardForm();
              setShowFlashcardModal(true);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-cream-200" />
          <span>{activeTab === 'curriculum' ? 'Yeni Müfredat Modülü Ekle' : 'Yeni Kelime Kartı Ekle'}</span>
        </button>
      </div>

      {/* Tabs: Curriculum vs Flashcards */}
      <div className="flex items-center space-x-2 border-b border-[#EAE2D5] pb-2">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'curriculum'
              ? 'bg-navy-900 text-cream-50 shadow-sm'
              : 'text-navy-800 bg-cream-50 hover:bg-cream-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Müfredat Modülleri (Gramer, Okuma, Quiz, Oyun)</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'flashcards'
              ? 'bg-navy-900 text-cream-50 shadow-sm'
              : 'text-navy-800 bg-cream-50 hover:bg-cream-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kelime Kartları (Flashcards)</span>
        </button>
      </div>

      {/* Level Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-navy-700/60 mr-1 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Seviye Filtrele:</span>
        </span>
        {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === lvl
                ? 'bg-navy-900 text-cream-50 shadow-sm'
                : 'bg-white text-navy-800 border border-[#EAE2D5] hover:bg-cream-50'
            }`}
          >
            {lvl === 'ALL' ? 'Tümü' : lvl}
          </button>
        ))}
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : activeTab === 'curriculum' ? (
        // Curriculum Modules List
        <div className="bg-white rounded-3xl border border-[#EAE2D5] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-navy-700/60 font-semibold uppercase text-[10px] tracking-wider border-b border-[#EAE2D5]">
                <tr>
                  <th className="py-3 px-4">Seviye</th>
                  <th className="py-3 px-4">Tür</th>
                  <th className="py-3 px-4">Başlık & Açıklama</th>
                  <th className="py-3 px-4">Süre</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] font-medium">
                {modules.map((m) => (
                  <tr key={m.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-navy-50 text-navy-900 border border-navy-200">
                        {m.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-cream-100 text-navy-800 border border-[#EAE2D5]">
                        {m.module_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-950">{m.title}</div>
                      <div className="text-[11px] text-navy-700/60 line-clamp-1">{m.subtitle || m.description}</div>
                    </td>
                    <td className="py-3 px-4 text-navy-700/70">{m.estimated_minutes} dk</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModule(m)}
                          className="p-1.5 rounded-lg text-navy-700 hover:bg-cream-100 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(m.id)}
                          className="p-1.5 rounded-lg text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Flashcards List
        <div className="bg-white rounded-3xl border border-[#EAE2D5] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-navy-700/60 font-semibold uppercase text-[10px] tracking-wider border-b border-[#EAE2D5]">
                <tr>
                  <th className="py-3 px-4">Seviye</th>
                  <th className="py-3 px-4">Kelime</th>
                  <th className="py-3 px-4">Türkçe Anlamı</th>
                  <th className="py-3 px-4">Tür</th>
                  <th className="py-3 px-4">Örnek Cümle</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] font-medium">
                {flashcards.map((fc) => (
                  <tr key={fc.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-navy-50 text-navy-900 border border-navy-200">
                        {fc.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-950">{fc.word}</td>
                    <td className="py-3 px-4 text-burgundy-800 font-semibold">{fc.translation}</td>
                    <td className="py-3 px-4 text-navy-700/70">{fc.part_of_speech}</td>
                    <td className="py-3 px-4 text-navy-700/70 line-clamp-1 italic max-w-xs">{fc.example_en}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditFlashcard(fc)}
                          className="p-1.5 rounded-lg text-navy-700 hover:bg-cream-100 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFlashcard(fc.id)}
                          className="p-1.5 rounded-lg text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module Edit/Add Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#EAE2D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                {editingModule ? 'Müfredat Modülünü Düzenle' : 'Yeni Müfredat Modülü Ekle'}
              </h3>
              <button
                onClick={() => setShowModuleModal(false)}
                className="p-1.5 rounded-full text-navy-400 hover:text-navy-900 hover:bg-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Seviye</label>
                  <select
                    value={modLevel}
                    onChange={(e) => setModLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                  >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Modül Türü</label>
                  <select
                    value={modType}
                    onChange={(e) => setModType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                  >
                    <option value="grammar">Gramer Notu</option>
                    <option value="reading">Okuma Metni</option>
                    <option value="test">Seviye Testi</option>
                    <option value="game">Eğitici Oyun</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Süre (Dk)</label>
                  <input
                    type="number"
                    value={modMinutes}
                    onChange={(e) => setModMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Modül Başlığı</label>
                <input
                  type="text"
                  required
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                  placeholder="Örn: Present Continuous Tense Kullanımı"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={modSubtitle}
                  onChange={(e) => setModSubtitle(e.target.value)}
                  placeholder="Kısa özet veya hedef"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  İçerik (Metin / JSON Yapısı)
                </label>
                <textarea
                  rows={6}
                  required
                  value={modContent}
                  onChange={(e) => setModContent(e.target.value)}
                  placeholder="Gramer açıklaması veya okuma metnini buraya giriniz..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#EAE2D5] text-xs font-semibold text-navy-800 hover:bg-cream-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 text-xs font-bold shadow-md"
                >
                  Kaydet & Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flashcard Edit/Add Modal */}
      {showFlashcardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EAE2D5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                {editingCard ? 'Kelime Kartını Düzenle' : 'Yeni Kelime Kartı Ekle'}
              </h3>
              <button
                onClick={() => setShowFlashcardModal(false)}
                className="p-1.5 rounded-full text-navy-400 hover:text-navy-900 hover:bg-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFlashcard} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Seviye</label>
                  <select
                    value={fcLevel}
                    onChange={(e) => setFcLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                  >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Kelime Türü</label>
                  <select
                    value={fcPos}
                    onChange={(e) => setFcPos(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                  >
                    <option value="noun">İsim (Noun)</option>
                    <option value="verb">Fiil (Verb)</option>
                    <option value="adj">Sıfat (Adj)</option>
                    <option value="adv">Zarf (Adv)</option>
                    <option value="idiom">Deyim (Idiom)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">İngilizce Kelime</label>
                <input
                  type="text"
                  required
                  value={fcWord}
                  onChange={(e) => setFcWord(e.target.value)}
                  placeholder="Örn: Collaborate"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Türkçe Anlamı</label>
                <input
                  type="text"
                  required
                  value={fcTranslation}
                  onChange={(e) => setFcTranslation(e.target.value)}
                  placeholder="Örn: İş birliği yapmak"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">İngilizce Örnek Cümle</label>
                <input
                  type="text"
                  required
                  value={fcExampleEn}
                  onChange={(e) => setFcExampleEn(e.target.value)}
                  placeholder="The teams will collaborate on the project."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Örnek Cümle Türkçe Çevirisi</label>
                <input
                  type="text"
                  required
                  value={fcExampleTr}
                  onChange={(e) => setFcExampleTr(e.target.value)}
                  placeholder="Ekipler proje üzerinde iş birliği yapacak."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFlashcardModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#EAE2D5] text-xs font-semibold text-navy-800 hover:bg-cream-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 text-xs font-bold shadow-md"
                >
                  Kelimeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
