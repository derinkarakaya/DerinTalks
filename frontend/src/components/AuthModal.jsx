import React from 'react';
import { X, GraduationCap } from 'lucide-react';
import AuthForm from './AuthForm';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EAE2D5] relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8C867A] hover:text-navy-900 hover:bg-[#FAF7F2] transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-navy-950 flex items-center justify-center text-[#FAF8F5] shadow-md mb-3">
            <GraduationCap className="w-6 h-6 text-[#FAF8F5]" />
          </div>
          <h2 className="text-2xl font-black text-navy-950 tracking-tight">
            DerinTalks
          </h2>
          <p className="text-xs text-[#6F6B64] mt-1 font-medium">
            Giriş Yapın veya Yeni Hesap Oluşturun
          </p>
        </div>

        {/* Modern Auth Form */}
        <AuthForm onSuccess={onClose} />
      </div>
    </div>
  );
}

