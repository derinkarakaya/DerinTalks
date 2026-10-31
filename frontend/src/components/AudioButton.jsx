import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioButton({ text, lang = 'en-US', className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert("Tarayıcınız ses sentezini desteklemiyor.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for language learners

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      type="button"
      title="Telaffuzu Dinle"
      className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
        isPlaying
          ? 'bg-sky-500 text-white animate-pulse shadow-md'
          : 'bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700'
      } ${className}`}
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
}
