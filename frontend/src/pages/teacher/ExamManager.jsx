import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  FileCheck2,
  Plus,
  Trash2,
  Edit,
  Filter,
  CheckCircle,
  HelpCircle,
  X,
  AlertCircle
} from 'lucide-react';

export default function ExamManager() {
  const [examType, setExamType] = useState('YDS');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Question Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [qType, setQType] = useState('YDS');
  const [qCategory, setQCategory] = useState('Kelime Bilgisi (Vocabulary)');
  const [qText, setQText] = useState('');
  const [qPassage, setQPassage] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctOpt, setCorrectOpt] = useState('A');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [examType, selectedCategory]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const [qData, cData] = await Promise.all([
        api.getPracticeQuestions(examType, selectedCategory),
        api.getExamCategories(examType)
      ]);
      setQuestions(qData);
      setCategories(cData);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      exam_type: qType,
      category: qCategory,
      question_text: qText,
      passage: qPassage || null,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      option_e: qType === 'YDS' ? optE : null,
      correct_option: correctOpt,
      explanation: explanation
    };

    try {
      if (editingQuestion) {
        await api.updateExamQuestion(editingQuestion.id, payload);
      } else {
        await api.createExamQuestion(payload);
      }
      setShowModal(false);
      resetForm();
      loadQuestions();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu sınav sorusunu kalıcı olarak silmek istiyor musunuz?")) return;
    try {
      await api.deleteExamQuestion(id);
      loadQuestions();
    } catch (err) {
      alert("Soru silinemedi.");
    }
  };

  const openEdit = (q) => {
    setEditingQuestion(q);
    setQType(q.exam_type);
    setQCategory(q.category);
    setQText(q.question_text);
    setQPassage(q.passage || '');
    setOptA(q.option_a);
    setOptB(q.option_b);
    setOptC(q.option_c);
    setOptD(q.option_d);
    setOptE(q.option_e || '');
    setCorrectOpt(q.correct_option);
    setExplanation(q.explanation || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setQType(examType);
    setQCategory('Kelime Bilgisi (Vocabulary)');
    setQText('');
    setQPassage('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setOptE('');
    setCorrectOpt('A');
    setExplanation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-900 tracking-tight">
            YDS & LGS Soru Bankası Yönetimi (CMS)
          </h1>
          <p className="text-xs text-[#6F6B64] mt-1 font-medium">
            ÖSYM ve MEB müfredat formatında çıkmış/özgün sorular ekleyin, düzenleyin ve çözüm açıklamalarını güncelleyin.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-[#FAF8F5] font-bold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-burgundy-400" />
          <span>Yeni Sınav Sorusu Ekle</span>
        </button>
      </div>

      {/* Sınav Türü Seçimi (YDS vs LGS) */}
      <div className="flex items-center space-x-2 border-b border-[#EAE2D5] pb-2">
        <button
          onClick={() => { setExamType('YDS'); setSelectedCategory('ALL'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            examType === 'YDS'
              ? 'bg-navy-900 text-[#FAF8F5] shadow-sm'
              : 'text-[#6F6B64] hover:bg-[#FAF7F2]'
          }`}
        >
          YDS Soruları (5 Seçenekli)
        </button>

        <button
          onClick={() => { setExamType('LGS'); setSelectedCategory('ALL'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            examType === 'LGS'
              ? 'bg-navy-900 text-[#FAF8F5] shadow-sm'
              : 'text-[#6F6B64] hover:bg-[#FAF7F2]'
          }`}
        >
          LGS Soruları (4 Seçenekli)
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-[#8C867A] mr-1 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Kategori:</span>
        </span>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-burgundy-800 text-white shadow-sm'
              : 'bg-[#FAF7F2] text-[#6F6B64] border border-[#EAE2D5] hover:bg-white'
          }`}
        >
          Tüm Konular
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-burgundy-800 text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#6F6B64] border border-[#EAE2D5] hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#EAE2D5]">
          <FileCheck2 className="w-12 h-12 text-[#8C867A] mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-navy-900">Bu filtrelere uygun soru bulunamadı</h3>
          <p className="text-xs text-[#6F6B64] mt-1">Yukarıdaki butondan hemen yeni soru ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#EAE2D5] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-navy-900 text-[#FAF8F5] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#EAE2D5] text-navy-900">
                    {q.category}
                  </span>
                  <span className="text-xs text-burgundy-800 font-black bg-burgundy-50 border border-burgundy-200 px-2 py-0.5 rounded-md">
                    Doğru Cevap: {q.correct_option}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEdit(q)}
                    className="p-1.5 rounded-lg text-[#6F6B64] hover:bg-[#EAE2D5] transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {q.passage && (
                <p className="text-xs italic bg-white p-3 rounded-xl border border-[#EAE2D5] text-[#555047] leading-relaxed">
                  {q.passage}
                </p>
              )}

              <p className="text-xs sm:text-sm font-bold text-navy-900 leading-relaxed">
                {q.question_text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3E3A33]">
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D5]">
                  <strong className="text-navy-900 font-black">A)</strong> {q.option_a}
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D5]">
                  <strong className="text-navy-900 font-black">B)</strong> {q.option_b}
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D5]">
                  <strong className="text-navy-900 font-black">C)</strong> {q.option_c}
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D5]">
                  <strong className="text-navy-900 font-black">D)</strong> {q.option_d}
                </div>
                {q.option_e && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D5] sm:col-span-2">
                    <strong className="text-navy-900 font-black">E)</strong> {q.option_e}
                  </div>
                )}
              </div>

              {q.explanation && (
                <div className="p-3 rounded-xl bg-burgundy-50 border border-burgundy-200 text-[11px] text-burgundy-900 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-burgundy-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>Çözüm & Analiz Notu:</strong> {q.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#EAE2D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-[#EAE2D5] pb-3">
              <h3 className="text-base font-black text-navy-900">
                {editingQuestion ? 'Sınav Sorusunu Düzenle' : 'Yeni Sınav Sorusu Ekle'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-[#8C867A] hover:text-navy-900 hover:bg-[#EAE2D5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Sınav Türü</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 font-semibold focus:outline-none focus:border-navy-900"
                  >
                    <option value="YDS">YDS (5 Şıklı)</option>
                    <option value="LGS">LGS (4 Şıklı)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    placeholder="Örn: Kelime Bilgisi, Gramer, Paragraf"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Paragraf / Parça (Opsiyonel)</label>
                <textarea
                  rows={2}
                  value={qPassage}
                  onChange={(e) => setQPassage(e.target.value)}
                  placeholder="Paragraf soruları için metin buraya..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Soru Kökü</label>
                <textarea
                  rows={2}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Soruyu buraya giriniz..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-900">Seçenekler</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="A seçeneği"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="B seçeneği"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                  <input
                    type="text"
                    required
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="C seçeneği"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                  <input
                    type="text"
                    required
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="D seçeneği"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                </div>

                {qType === 'YDS' && (
                  <input
                    type="text"
                    required
                    value={optE}
                    onChange={(e) => setOptE(e.target.value)}
                    placeholder="E seçeneği"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900 mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Doğru Seçenek</label>
                  <select
                    value={correctOpt}
                    onChange={(e) => setCorrectOpt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white font-black text-navy-900 focus:outline-none focus:border-navy-900"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    {qType === 'YDS' && <option value="E">E</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Açıklama / Çözüm Notu</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Doğru cevabın gerekçesi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EAE2D5] text-xs font-bold text-[#6F6B64] hover:bg-[#EAE2D5] transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-[#FAF8F5] text-xs font-bold shadow-md transition-all"
                >
                  Soruyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
