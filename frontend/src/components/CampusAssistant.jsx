import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Flame,
  Award,
  BookOpen,
  Volume2,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { playSuccessSound } from '../utils/soundEffects';

export default function CampusAssistant({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Selam ${user?.full_name?.split(' ')[0] || 'Dostum'}! 👋 Ben Derin Kampüs Koçun.`,
      time: 'Şimdi'
    },
    {
      id: 2,
      sender: 'bot',
      text: 'Son yaptığın kelime ve telaffuz çalışmasını inceledim: Ödevin harikaydı, harika bir ritim yakaladın! 🌟',
      time: 'Şimdi'
    },
    {
      id: 3,
      sender: 'bot',
      text: 'Bugün 15 dakikalık aralıklı tekrarını yapıp çalışma serini uzatmaya ne dersin? 🔥',
      time: 'Şimdi'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Playful AI / Coach automated response logic
    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('hedef') || lower.includes('puan') || lower.includes('xp')) {
        botReply = 'Hedefin haftalık 1000 XP! Şimdiden harika bir yol kat ettin. 2 modül daha bitirirsen yeni rozetini kapıyorsun! ⚡';
      } else if (lower.includes('ne çalış') || lower.includes('öneri') || lower.includes('ders')) {
        botReply = 'Bugün 2. ve 3. Leitner kutundaki kelimeleri tekrar etmek hafızanı tazeler. Ardından A2/B1 konuşma pratiğine geçebilirsin! 📚';
      } else if (lower.includes('motivasyon') || lower.includes('mod') || lower.includes('moral')) {
        botReply = '"Mistakes are proof that you are trying!" Dil konuşuldukça açılır, hata yapmaktan asla çekinme, tam gaz devam! 🚀';
      } else if (lower.includes('telaffuz') || lower.includes('aksam') || lower.includes('speaking')) {
        botReply = 'İpucu: "Schedule" kelimesini söylerken Amerikan tarzında "sked-yul" diyebilirsin. Aynanın karşısında 3 kez sesli dene! 🗣️';
      } else {
        botReply = 'Mesajını aldım! Harika bir soru. Kampüste seninle ilerlemek çok keyifli, bugün de serini korumayı unutma! 😉⭐';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playSuccessSound();
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white shadow-2xl shadow-red-900/30 hover:shadow-red-900/50 hover:scale-105 active:scale-95 transition-all group border border-red-500/30"
          title="Derin Kampüs Koçu ile Sohbet Et"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" style={{ animationDuration: '2.5s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-red-700" />
          </div>

          <span className="text-xs font-black tracking-wide hidden sm:inline">
            Kampüs Asistanı
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0F172A] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] max-h-[82vh] rounded-[2rem] bg-white shadow-2xl shadow-slate-900/20 border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#0F172A] p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black">Derin Kampüs Koçu</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600/30 text-red-300 font-bold border border-red-500/40">AI</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Çevrimiçi • Motivasyon Hazır</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Motivational Chips */}
          <div className="bg-stone-50 p-2 border-b border-stone-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSendMessage('Bugün ne çalışmalıyım?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#0F172A] font-semibold hover:border-red-300 hover:text-red-700 transition-all shadow-2xs"
            >
              🎯 Ne çalışmalıyım?
            </button>
            <button
              onClick={() => handleSendMessage('Bana motivasyon ver!')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#0F172A] font-semibold hover:border-red-300 hover:text-red-700 transition-all shadow-2xs"
            >
              🔥 Motivasyon ver
            </button>
            <button
              onClick={() => handleSendMessage('Bir telaffuz ipucu söyle')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#0F172A] font-semibold hover:border-red-300 hover:text-red-700 transition-all shadow-2xs"
            >
              🗣️ Telaffuz ipucu
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#F8F9FA]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white font-medium rounded-br-xs'
                      : 'bg-white border border-stone-200 text-[#0F172A] font-medium rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Koçuna bir şey sor veya yaz..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
              title="Gönder"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
