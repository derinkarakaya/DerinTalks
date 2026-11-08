import React from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-slate-900/10 border border-stone-200 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-stone-100 transition-colors"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-[11px] font-bold mb-3">
            <span>🎯</span>
            <span>Giriş & Kayıt Portalı</span>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-2xl font-black text-[#0F172A] tracking-tight">Derin</span>
            <span className="text-2xl font-black text-red-600 tracking-tight">Talks</span>
          </div>
          <p className="text-xs text-[#0F172A]/70 mt-1 font-medium">
            Modern İngilizce & Sınav Hazırlık Platformu
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm onSuccess={onClose} />
      </div>
    </div>
  );
}
