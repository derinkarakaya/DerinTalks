import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import AudioButton from '../../components/AudioButton';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import {
  ArrowLeft,
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Timer,
  HelpCircle,
  Zap
} from 'lucide-react';

export default function GamesHub({ module, onBack }) {
  let content = {};
  try {
    content = typeof module?.content_json === 'string' ? JSON.parse(module.content_json) : module?.content_json || {};
  } catch (err) {
    console.error("Game content parsing error", err);
  }

  const [activeGame, setActiveGame] = useState(content.game_mode || 'matching');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE2D5] text-xs font-semibold text-navy-900 hover:bg-cream-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-navy-700" />
            <span>Müfredata Dön</span>
          </button>
        ) : <div />}

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-burgundy-50 text-burgundy-800 border border-burgundy-200">
          🎮 Eğitici Dil Oyunları
        </span>
      </div>

      {/* Game Mode Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#EAE2D5] shadow-soft flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveGame('matching')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            activeGame === 'matching'
              ? 'bg-navy-900 text-cream-50 shadow-md'
              : 'text-navy-700 hover:bg-cream-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Kelime Eşleştirme</span>
        </button>

        <button
          onClick={() => setActiveGame('scramble')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            activeGame === 'scramble'
              ? 'bg-navy-900 text-cream-50 shadow-md'
              : 'text-navy-700 hover:bg-cream-50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Kelime Çözücü (Scramble)</span>
        </button>

        <button
          onClick={() => setActiveGame('true_false')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            activeGame === 'true_false'
              ? 'bg-navy-900 text-cream-50 shadow-md'
              : 'text-navy-700 hover:bg-cream-50'
          }`}
        >
          <Timer className="w-4 h-4 text-amber-400" />
          <span>Hızlı Karar (Doğru/Yanlış)</span>
        </button>
      </div>

      {/* Active Game Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D5] shadow-soft">
        {activeGame === 'matching' && <MatchingGame customPairs={content.pairs} />}
        {activeGame === 'scramble' && <ScrambleGame customWords={content.words} />}
        {activeGame === 'true_false' && <TrueFalseGame customChallenges={content.challenges} />}
      </div>

    </div>
  );
}

// Default pairs defined OUTSIDE the component to prevent re-creation and infinite re-render loops
const DEFAULT_MATCHING_PAIRS = [
  { en: "Morning", tr: "Sabah" },
  { en: "Library", tr: "Kütüphane" },
  { en: "Doctor", tr: "Doktor" },
  { en: "Breakfast", tr: "Kahvaltı" },
  { en: "Window", tr: "Pencere" },
  { en: "Challenge", tr: "Zorluk / Meydan Okuma" },
];

// ================= 1. MATCHING GAME =================
function MatchingGame({ customPairs }) {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);

  // Initialize and shuffle cards ONLY when called (on initial mount or explicit reset)
  const initGame = useCallback(() => {
    const sourcePairs = (customPairs && customPairs.length > 0) ? customPairs : DEFAULT_MATCHING_PAIRS;
    const cardList = [];
    sourcePairs.slice(0, 6).forEach((p, idx) => {
      cardList.push({ id: `en-${idx}`, pairId: idx, text: p.en, type: 'en' });
      cardList.push({ id: `tr-${idx}`, pairId: idx, text: p.tr, type: 'tr' });
    });
    // Shuffle cards in a deterministic single-pass
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setSelectedCards([]);
    setMatchedIds([]);
    setMoves(0);
  }, [customPairs]);

  // Bug Fix: Only shuffle once on component mount!
  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (card) => {
    if (matchedIds.includes(card.id) || selectedCards.find((c) => c.id === card.id)) return;
    if (selectedCards.length === 2) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newSelected;
      if (first.pairId === second.pairId && first.type !== second.type) {
        // Matched! Play success sound
        playSuccessSound();
        setMatchedIds((prev) => [...prev, first.id, second.id]);
        setSelectedCards([]);

        // If all matched!
        if (matchedIds.length + 2 >= cards.length) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        // Mismatch! Play error sound
        playErrorSound();
        setTimeout(() => {
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const isGameOver = cards.length > 0 && matchedIds.length === cards.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-navy-950">İngilizce - Türkçe Kart Eşleştirme</h2>
          <p className="text-xs text-navy-700/70 mt-0.5">Kelimelerin karşılıklarını doğru bularak tahtayı temizleyin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-cream-100 border border-[#EAE2D5] text-xs font-semibold text-navy-900">
            Hamle: <strong className="text-burgundy-700">{moves}</strong>
          </div>
          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-[#EAE2D5] text-navy-900 transition-colors"
            title="Yeniden Başlat ve Karıştır"
          >
            <RotateCcw className="w-4 h-4 text-navy-700" />
          </button>
        </div>
      </div>

      {isGameOver ? (
        <div className="p-8 rounded-3xl bg-cream-100 border border-burgundy-200 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-navy-900 text-amber-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-navy-950">Harika İş Çıkardın! 🎉</h3>
          <p className="text-xs text-navy-800">
            Tüm kelimeleri toplam <strong>{moves}</strong> hamlede kusursuz eşleştirdin.
          </p>
          <button
            onClick={initGame}
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all"
          >
            Tekrar Oyna
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cards.map((card) => {
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const isMatched = matchedIds.includes(card.id);

            let style = 'bg-cream-50 text-navy-900 border-[#EAE2D5] hover:border-navy-400 hover:bg-white';
            if (isMatched) {
              style = 'bg-burgundy-50 text-burgundy-800 border-burgundy-200 opacity-60 pointer-events-none';
            } else if (isSelected) {
              style = 'bg-navy-900 text-cream-50 border-navy-950 shadow-md scale-102';
            }

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`h-24 p-3 rounded-2xl border text-xs font-bold transition-all duration-150 flex flex-col items-center justify-center text-center ${style}`}
              >
                <span>{card.text}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 mt-1 text-burgundy-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ================= 2. WORD SCRAMBLE GAME =================
const DEFAULT_SCRAMBLE_WORDS = [
  { word: "JOURNEY", clue: "Seyahat, yolculuk" },
  { word: "ACHIEVE", clue: "Başarmak, elde etmek" },
  { word: "OPPORTUNITY", clue: "Fırsat, olanak" },
  { word: "ACCURATE", clue: "Doğru, hatasız" },
  { word: "CRUCIAL", clue: "Hayati derecede önemli" }
];

function ScrambleGame({ customWords }) {
  const words = customWords && customWords.length > 0 ? customWords : DEFAULT_SCRAMBLE_WORDS;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState(null);
  const [score, setScore] = useState(0);

  const currentItem = words[currentIdx] || words[0];
  const scrambled = (currentItem.scrambled || currentItem.word.split('').sort(() => Math.random() - 0.5).join(' '));

  const handleCheck = (e) => {
    e.preventDefault();
    if (userGuess.trim().toUpperCase() === currentItem.word.toUpperCase()) {
      playSuccessSound();
      setMessage({ type: 'success', text: 'Tebrikler! Doğru Kelime 🎉' });
      setScore((s) => s + 20);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => {
        setUserGuess('');
        setMessage(null);
        setCurrentIdx((prev) => (prev + 1) % words.length);
      }, 1200);
    } else {
      playErrorSound();
      setMessage({ type: 'error', text: 'Tekrar deneyin! Harfleri dikkatlice inceleyin.' });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-xl font-extrabold text-navy-950">Kelime Çözücü (Word Scramble)</h2>
        <p className="text-xs text-navy-700/70 mt-1">Harfleri birleştirerek gizli İngilizce kelimeyi bulun.</p>
        <span className="inline-block mt-2 px-3 py-1 bg-burgundy-50 border border-burgundy-200 rounded-full text-xs font-bold text-burgundy-800">
          Skor: {score} Puan
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-cream-50 border border-[#EAE2D5] space-y-4">
        <div className="text-2xl font-black tracking-widest text-navy-900 bg-white py-4 rounded-2xl border border-[#EAE2D5] shadow-sm">
          {scrambled}
        </div>

        <p className="text-xs font-semibold text-navy-800">
          💡 <strong>İpucu:</strong> {currentItem.clue}
        </p>

        <form onSubmit={handleCheck} className="space-y-3">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Kelimeyi buraya yazın..."
            className="w-full text-center px-4 py-2.5 rounded-xl border border-[#EAE2D5] text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-bold text-xs shadow-md transition-all"
          >
            Kontrol Et
          </button>
        </form>

        {message && (
          <div
            className={`p-2.5 rounded-xl text-xs font-bold ${
              message.type === 'success'
                ? 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ================= 3. SPEED TRUE / FALSE =================
const DEFAULT_TF_CHALLENGES = [
  { statement: "'Accurate' kelimesi 'Doğru / Hatasız' anlamına gelir.", is_true: true, fact: "Accurate = correct and precise." },
  { statement: "'Postpone' kelimesi 'Hızlandırmak' demektir.", is_true: false, fact: "Postpone = ertelemek (delay/put off)." },
  { statement: "'Crucial' hayati derecede önemli demektir.", is_true: true, fact: "Crucial = extremely important/vital." },
  { statement: "'Reluctant' istekli ve hevesli demektir.", is_true: false, fact: "Reluctant = isteksiz, gönülsüz (unwilling)." },
  { statement: "'Substantial' büyük ölçüde / kayda değer demektir.", is_true: true, fact: "Substantial = of considerable importance or size." }
];

function TrueFalseGame({ customChallenges }) {
  const challenges = customChallenges && customChallenges.length > 0 ? customChallenges : DEFAULT_TF_CHALLENGES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const current = challenges[currentIdx] || challenges[0];

  const handleAnswer = (choice) => {
    const isCorrect = choice === current.is_true;
    if (isCorrect) {
      playSuccessSound();
      setScore((s) => s + 10);
      setFeedback({ correct: true, text: `Doğru! ${current.fact}` });
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: `Hatalı! ${current.fact}` });
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx((prev) => (prev + 1) % challenges.length);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-xl font-extrabold text-navy-950">Hızlı Karar: Doğru mu, Yanlış mı?</h2>
        <p className="text-xs text-navy-700/70 mt-1">İfadenin doğruluğunu saniyeler içinde değerlendirin.</p>
        <span className="inline-block mt-2 px-3 py-1 bg-burgundy-50 border border-burgundy-200 rounded-full text-xs font-bold text-burgundy-800">
          Toplam Puan: {score} XP
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-cream-50 border border-[#EAE2D5] space-y-5">
        <span className="text-xs font-bold text-navy-700/60">
          Soru {currentIdx + 1} / {challenges.length}
        </span>

        <p className="text-base font-bold text-navy-950 min-h-[60px] flex items-center justify-center">
          {current.statement}
        </p>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              feedback.correct
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleAnswer(true)}
            className="py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-cream-50 font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>DOĞRU</span>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-3 rounded-2xl bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-5 h-5 text-rose-300" />
            <span>YANLIŞ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
