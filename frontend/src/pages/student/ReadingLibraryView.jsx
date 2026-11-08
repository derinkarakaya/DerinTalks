import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Bookmark,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { playSuccessSound } from '../../utils/soundEffects';

const SAMPLE_BOOKS = [
  {
    id: 1,
    level: 'A1',
    title: 'A Day in London',
    category: 'Günlük Yaşam',
    minutes: '4 dk',
    summary: 'Liam Londra\'da tipik bir gününü anlatıyor: Metro yolculuğu, İngiliz kahvaltısı ve Hyde Park yürüyüşü.',
    passage: `Hello! My name is Liam and I live in London. Every morning, I wake up at 7:30 AM and drink a warm cup of English tea with milk. 

At 8:15 AM, I walk to the Underground station. Londoners call it the Tube. It is very fast and takes me directly to my college near the British Museum. 

In the afternoon, my classmates and I usually go to Hyde Park. We sit on the green grass, talk about our hobbies, and eat fresh sandwiches. In the evening, the city lights turn on, and the Big Ben clock tower shines beautifully beside the Thames River. London is busy, but I love living here!`,
    vocabulary: [
      { word: 'Underground / Tube', tr: 'Londra Metrosu' },
      { word: 'Fresh sandwiches', tr: 'Taze sandviçler' },
      { word: 'Shines beautifully', tr: 'Güzelce parıldar' }
    ],
    question: {
      text: 'What do Londoners call the Underground station?',
      options: ['The Bus', 'The Tube', 'The Train', 'The Tram'],
      answer: 1
    }
  },
  {
    id: 2,
    level: 'A2',
    title: 'The Cappadocia Hot Air Balloons',
    category: 'Seyahat & Kültür',
    minutes: '5 dk',
    summary: 'Kapadokya\'da gün doğumunda gökyüzüne yükselen rengarenk balonlar ve peri bacaları gezisi.',
    passage: `Cappadocia is one of the most magical places in the world. Early in the morning, before sunrise, hundreds of giant hot air balloons prepare to fly over the fairy chimneys.

When the burner turns on, a warm orange flame fills the balloon with hot air. Slowly, the basket lifts off the dusty ground. Looking down, the ancient stone valleys look like the surface of the moon.

Many travelers wake up at 5:00 AM just to take photos from the hills. The sky looks like a canvas painted with red, yellow, and blue balloons. If you ever visit Turkey, waking up early in Cappadocia is an unforgettable experience!`,
    vocabulary: [
      { word: 'Fairy chimneys', tr: 'Peri bacaları' },
      { word: 'Lifts off', tr: 'Yerden havalanır' },
      { word: 'Unforgettable', tr: 'Unutulmaz' }
    ],
    question: {
      text: 'What time do travelers usually wake up in Cappadocia?',
      options: ['At noon', 'At 5:00 AM', 'At 9:00 PM', 'At midnight'],
      answer: 1
    }
  },
  {
    id: 3,
    level: 'B1',
    title: 'The Secret Behind Coffee Culture',
    category: 'Kültür & Sosyal',
    minutes: '6 dk',
    summary: 'Kahvenin tarihi keşfinden modern kahve dükkanlarına ve sosyal sohbet kültürüne uzanan yolculuğu.',
    passage: `Today, millions of people start their day with the rich aroma of roasted coffee beans. But did you know that coffee was originally discovered in Ethiopia by a goat herder named Kaldi? He noticed his goats were full of energy after eating bright red berries from a mysterious shrub.

Over the centuries, coffee traveled to Yemen, Istanbul, and Venice. In the Ottoman era, coffeehouses were known as "schools of the wise" because philosophers, poets, and merchants met there to discuss politics and trade.

In modern society, coffee shops serve as flexible digital workspaces for remote professionals and students. Ordering a flat white or an iced Americano is not just about caffeine; it is a cultural ritual of connection, brainstorming, and relaxation.`,
    vocabulary: [
      { word: 'Shrub', tr: 'Çalı, bodur ağaç' },
      { word: 'Merchants', tr: 'Tüccarlar' },
      { word: 'Ritual of connection', tr: 'Bağ kurma ritüeli' }
    ],
    question: {
      text: 'Why were Ottoman coffeehouses called "schools of the wise"?',
      options: [
        'They taught math to kids',
        'People met to discuss ideas, poetry and politics',
        'Only teachers were allowed inside',
        'Coffee made people pass exams'
      ],
      answer: 1
    }
  },
  {
    id: 4,
    level: 'B2',
    title: 'Artificial Intelligence & Future Careers',
    category: 'Teknoloji & Gelecek',
    minutes: '7 dk',
    summary: 'Yapay zekanın iş dünyasını nasıl dönüştürdüğü ve geleceğin becerileri üzerine akıcı bir B2 okuma metni.',
    passage: `The rapid evolution of artificial intelligence and large language models is fundamentally redefining the global workforce. Routine cognitive tasks, such as basic data analysis and preliminary code generation, are increasingly automated by intelligent algorithms.

However, experts emphasize that human-centric skills will become significantly more valuable. Critical thinking, emotional intelligence, intercultural communication, and creative problem-solving cannot be easily replicated by neural networks.

Rather than replacing humans entirely, AI is functioning as an intellectual multiplier. Professionals who learn to prompt effectively and leverage AI tools will outpace those who resist technological transformation. Continuous adaptation and bilingual literacy are now indispensable assets for the next generation.`,
    vocabulary: [
      { word: 'Fundamentally redefining', tr: 'Kökten yeniden tanımlıyor' },
      { word: 'Indispensable assets', tr: 'Vazgeçilmez kazanımlar/değerler' },
      { word: 'Intellectual multiplier', tr: 'Zihinsel çarpan / kuvvetlendirici' }
    ],
    question: {
      text: 'According to the passage, which skills become MORE valuable in an AI era?',
      options: [
        'Typing fast on keyboard',
        'Human-centric skills like critical thinking & empathy',
        'Memorizing long phone numbers',
        'Doing repetitive arithmetic by hand'
      ],
      answer: 1
    }
  }
];

export default function ReadingLibraryView() {
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [activeBook, setActiveBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Stop speech when changing book
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeBook]);

  const handleToggleAudio = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerQuestion = (idx, correctIdx) => {
    setSelectedAnswer(idx);
    if (idx === correctIdx) {
      setQuizFeedback('correct');
      playSuccessSound();
    } else {
      setQuizFeedback('wrong');
    }
  };

  const filteredBooks = selectedLevel === 'ALL'
    ? SAMPLE_BOOKS
    : SAMPLE_BOOKS.filter((b) => b.level === selectedLevel);

  // Detail View: Reading Book with Audio
  if (activeBook) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        
        {/* Top Back Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              setActiveBook(null);
              setSelectedAnswer(null);
              setQuizFeedback(null);
            }}
            className="flex items-center space-x-2 text-xs font-bold text-[#0F172A] hover:text-red-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Okuma Kitaplığına Dön</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#0F172A] text-white">
              {activeBook.level} Seviyesi
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeBook.minutes}</span>
            </span>
          </div>
        </div>

        {/* Reader Book Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          
          {/* Header & Audio Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                {activeBook.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1 tracking-tight">
                {activeBook.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">{activeBook.summary}</p>
            </div>

            {/* Audio Button */}
            <button
              onClick={() => handleToggleAudio(activeBook.passage)}
              className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all transform active:scale-95 shrink-0 ${
                isPlaying
                  ? 'bg-red-600 text-white animate-pulse shadow-red-900/20'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Okumayı Durdur' : 'Sesli Dinle (Listen Aloud)'}</span>
            </button>
          </div>

          {/* Reading Passage Text Area */}
          <div className="prose prose-slate max-w-none">
            <div className="p-6 sm:p-7 rounded-2xl bg-stone-50 border border-stone-200/60 leading-loose text-sm sm:text-base font-serif text-[#0F172A] whitespace-pre-line select-text">
              {activeBook.passage}
            </div>
          </div>

          {/* Vocabulary Highlights */}
          {activeBook.vocabulary && activeBook.vocabulary.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 space-y-2">
              <h4 className="text-xs font-black text-[#0F172A] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Önemli Kelimeler & Deyimler:</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeBook.vocabulary.map((vocab, vIdx) => (
                  <div key={vIdx} className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#0F172A]">
                    <strong className="text-red-700">{vocab.word}</strong>: <span className="text-slate-600 font-normal">{vocab.tr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mini Comprehension Quiz */}
          {activeBook.question && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-stone-100 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-800">
                  Anlama Sorusu
                </span>
                <span className="text-xs text-slate-400 font-medium">Okuduğunu test et</span>
              </div>

              <h3 className="text-sm font-black text-[#0F172A]">
                {activeBook.question.text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {activeBook.question.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswerQuestion(optIdx, activeBook.question.answer)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedAnswer === optIdx
                        ? optIdx === activeBook.question.answer
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                          : 'bg-red-50 border-red-400 text-red-900 shadow-sm'
                        : 'border-stone-200 hover:border-red-300 hover:bg-stone-50 text-[#0F172A]'
                    }`}
                  >
                    <span className="inline-block w-5 font-black text-slate-400">{String.fromCharCode(65 + optIdx)})</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {quizFeedback === 'correct' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Harika! Metni çok iyi anlamışsın. (+25 XP)</span>
                </div>
              )}
              {quizFeedback === 'wrong' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center space-x-2 animate-in fade-in">
                  <span>Biraz daha dikkatli oku, metinde cevabı bulacaksın! Tekrar deneyebilirsin. 😉</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    );
  }

  // List View: All Graded Reader Books
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200/60">
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span>Graded Readers & Sesli Okuma</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Okuma Kitapları
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-medium">
            Seviyene göre özel olarak basitleştirilmiş İngilizce metinleri oku, doğal Amerikan telaffuzuyla sesli dinle ve kelime dağarcığını genişlet.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start md:self-auto">
          {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedLevel === lvl
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-slate-500 hover:text-[#0F172A]'
              }`}
            >
              {lvl === 'ALL' ? 'Tümü' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setActiveBook(book)}
            className="group bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#0F172A] text-white">
                  {book.level}
                </span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{book.minutes} okuma</span>
                </span>
              </div>

              <h3 className="text-lg font-black text-[#0F172A] group-hover:text-red-600 transition-colors">
                {book.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                {book.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-600 flex items-center space-x-1">
                <Volume2 className="w-3.5 h-3.5 text-red-600" />
                <span>Sesli Dinleme Mevcut</span>
              </span>
              <div className="flex items-center space-x-1 text-xs font-bold text-[#0F172A] group-hover:text-red-600 transition-colors">
                <span>Kitabı Aç</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
