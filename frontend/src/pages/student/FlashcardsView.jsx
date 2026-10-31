import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import AudioButton from '../../components/AudioButton';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  Layers,
  Rotate3D,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  Sparkles,
  Award,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function FlashcardsView() {
  const [flashcards, setFlashcards] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedBox, setSelectedBox] = useState(null); // null = all
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCardsAndStats();
  }, [selectedLevel, selectedBox]);

  const fetchCardsAndStats = async () => {
    setLoading(true);
    try {
      const [cardsData, statsData] = await Promise.all([
        api.getFlashcards(selectedLevel, selectedBox),
        api.getFlashcardStats()
      ]);
      setFlashcards(cardsData);
      setStats(statsData);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error("Failed to load flashcards", err);
    } finally {
      setLoading(false);
    }
  };

  const currentCard = flashcards[currentIndex];

  const handleReview = async (rating) => {
    if (!currentCard) return;

    if (rating === 'again') {
      playErrorSound();
    } else {
      playSuccessSound();
    }

    try {
      await api.reviewFlashcard(currentCard.id, rating);
      
      if (rating === 'easy') {
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
      }

      // Move to next card or loop
      setIsFlipped(false);
      setTimeout(() => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // Re-fetch to get updated Leitner boxes
          fetchCardsAndStats();
        }
      }, 150);
    } catch (err) {
      console.error("Flashcard review submission failed", err);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Mastery Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D5] shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-navy-50 text-navy-900 border border-navy-200">
              <Layers className="w-5 h-5 text-navy-800" />
            </span>
            <h1 className="text-xl font-extrabold text-navy-950">
              Kelime Kartları (Leitner Aralıklı Tekrar)
            </h1>
          </div>
          <p className="text-xs text-navy-700/70 mt-1 max-w-xl">
            Aralıklı Tekrar Sistemi (Spaced Repetition), zorlandığınız kelimeleri daha sık, iyi bildiklerinizi ise seyrek göstererek bilgiyi kalıcı hafızaya kodlar.
          </p>
        </div>

        {/* Global Mastery Rate */}
        <div className="flex items-center space-x-4 bg-cream-50 p-4 rounded-2xl border border-[#EAE2D5]">
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase text-navy-700/60">Kalıcı Hafıza</div>
            <div className="text-2xl font-black text-burgundy-700">%{stats?.mastery_percentage || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-burgundy-700 border-t-transparent flex items-center justify-center font-bold text-xs text-navy-950 bg-white shadow-sm">
            {stats?.box_4_mastered || 0}
          </div>
        </div>
      </div>

      {/* 4 Leitner Box Filter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { box: 1, title: '1. Kutu: Yeni', count: stats?.box_1_new || 0, color: 'border-[#EAE2D5] bg-cream-50 text-navy-900' },
          { box: 2, title: '2. Kutu: Öğreniliyor', count: stats?.box_2_learning || 0, color: 'border-navy-200 bg-navy-50 text-navy-900' },
          { box: 3, title: '3. Kutu: Tekrar', count: stats?.box_3_review || 0, color: 'border-[#DFD4C2] bg-cream-100 text-navy-900' },
          { box: 4, title: '4. Kutu: Öğrenildi', count: stats?.box_4_mastered || 0, color: 'border-burgundy-200 bg-burgundy-50 text-burgundy-900' },
        ].map((item) => {
          const isSelected = selectedBox === item.box;
          return (
            <button
              key={item.box}
              onClick={() => setSelectedBox(isSelected ? null : item.box)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${item.color} ${
                isSelected ? 'ring-2 ring-navy-900 shadow-md scale-102' : 'hover:opacity-90'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{item.title}</div>
              <div className="text-xl font-extrabold mt-0.5">{item.count} Kelime</div>
            </button>
          );
        })}
      </div>

      {/* Level Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-navy-700/60 mr-1 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Seviye:</span>
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

      {/* Main Flashcard Interactive Area */}
      {loading ? (
        <div className="min-h-[360px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : flashcards.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EAE2D5] shadow-soft">
          <Layers className="w-12 h-12 text-navy-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-navy-900">Bu filtrelere uygun kelime kartı bulunamadı</h3>
          <p className="text-xs text-navy-700/60 mt-1">Filtreleri sıfırlayarak tüm kartları görebilirsiniz.</p>
          <button
            onClick={() => { setSelectedLevel('ALL'); setSelectedBox(null); }}
            className="mt-4 px-4 py-2 bg-navy-900 text-cream-50 rounded-xl text-xs font-bold hover:bg-navy-800"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Card Counter & Navigation */}
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700/60">
            <span>
              Kart {currentIndex + 1} / {flashcards.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg border border-[#EAE2D5] bg-white hover:bg-cream-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-navy-700" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="p-1.5 rounded-lg border border-[#EAE2D5] bg-white hover:bg-cream-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-navy-700" />
              </button>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer perspective-1000 min-h-[300px] sm:min-h-[340px]"
          >
            <div
              className={`w-full h-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE2D5] shadow-card flex flex-col justify-between transition-all duration-300 transform-style-preserve-3d relative ${
                isFlipped ? 'bg-cream-50/60 border-burgundy-200' : 'hover:border-navy-300'
              }`}
            >
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-900 border border-navy-200">
                    {currentCard.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-100 text-navy-800">
                    {currentCard.part_of_speech}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-navy-700/60">
                    {currentCard.box}. Kutu ({currentCard.box === 4 ? 'Kalıcı' : 'Gelişiyor'})
                  </span>
                  <span className="text-xs text-burgundy-700 font-bold flex items-center space-x-1">
                    <Rotate3D className="w-4 h-4" />
                    <span className="hidden sm:inline">Çevir</span>
                  </span>
                </div>
              </div>

              {/* Card Center: English or Turkish */}
              <div className="py-6 text-center space-y-3">
                {!isFlipped ? (
                  // Front side: English
                  <>
                    <div className="flex items-center justify-center space-x-3">
                      <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
                        {currentCard.word}
                      </h2>
                      <AudioButton text={currentCard.word} className="scale-125" />
                    </div>
                    {currentCard.phonetic && (
                      <p className="text-sm font-mono text-navy-700/50">{currentCard.phonetic}</p>
                    )}
                    <div className="pt-4 max-w-lg mx-auto">
                      <p className="text-sm text-navy-900 italic bg-cream-50 p-3 rounded-2xl border border-[#EAE2D5]">
                        "{currentCard.example_en}"
                      </p>
                    </div>
                    <p className="text-[11px] text-navy-700/40 pt-2">
                      (Kartın arkasını görmek için tıklayın)
                    </p>
                  </>
                ) : (
                  // Back side: Turkish
                  <>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase text-burgundy-700">Türkçe Anlamı</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
                        {currentCard.translation}
                      </h2>
                    </div>
                    <div className="pt-4 max-w-lg mx-auto">
                      <p className="text-sm text-navy-900 bg-white p-3 rounded-2xl border border-[#EAE2D5] shadow-sm">
                        "{currentCard.example_tr}"
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block text-[11px] px-3 py-1 bg-cream-100 text-navy-800 rounded-full font-medium border border-[#EAE2D5]">
                        Kategori: {currentCard.category}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Card Bottom Hint */}
              <div className="text-center text-[11px] text-navy-700/50">
                {isFlipped ? 'Nasıl hatırladığınızı aşağıdan seçin:' : 'Kartı çevirip bilginizi test edin'}
              </div>

            </div>
          </div>

          {/* Leitner Spaced Repetition Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleReview('again')}
              className="py-3 px-3 rounded-2xl bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-800 border border-burgundy-200 text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 shadow-sm"
            >
              <div className="flex items-center space-x-1">
                <XCircle className="w-4 h-4 text-burgundy-700" />
                <span>Zor / Hatırlamadım</span>
              </div>
              <span className="text-[10px] text-burgundy-600 font-normal">1. Kutuya döner</span>
            </button>

            <button
              onClick={() => handleReview('good')}
              className="py-3 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-navy-900 border border-[#EAE2D5] text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 shadow-sm"
            >
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4 text-navy-800" />
                <span>İyi Hatırladım</span>
              </div>
              <span className="text-[10px] text-navy-700/60 font-normal">+1 Kutu ilerler</span>
            </button>

            <button
              onClick={() => handleReview('easy')}
              className="py-3 px-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-cream-50 border border-navy-950 text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 shadow-sm"
            >
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Çok Kolay / Bildim</span>
              </div>
              <span className="text-[10px] text-cream-200 font-normal">Kalıcı Hafıza (+2)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
