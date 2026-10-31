import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  X
} from 'lucide-react';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

export default function AuthForm({ onSuccess, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [level, setLevel] = useState('A1');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast / Alert State
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const showNotification = (type, message) => {
    setToast({ type, message });
    if (type === 'success') {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const closeToast = () => setToast(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      if (isRegister) {
        // POST /register
        const res = await register({
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined,
          role,
          current_level: level
        });
        showNotification('success', res?.message || 'Hesabınız başarıyla oluşturuldu! Hoş geldiniz.');
      } else {
        // POST /login
        const res = await login(email.trim(), password);
        showNotification('success', res?.message || 'Giriş başarılı! Hoş geldiniz.');
      }

      // Başarılı durumda kısa bir gecikme sonrası modal/callback'i kapat
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error('Auth error:', err);
      showNotification('error', err.message || 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Basit şifre güç seviyesi hesaplama (Kayıt ekranı için)
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: '', color: '' };
    if (password.length < 6) return { score: 1, text: 'Zayıf', color: 'bg-burgundy-500 text-burgundy-700' };
    if (password.length < 8) return { score: 2, text: 'Orta', color: 'bg-amber-500 text-amber-700' };
    return { score: 3, text: 'Güçlü', color: 'bg-emerald-500 text-emerald-700' };
  };

  const strength = getPasswordStrength();

  const isLogin = !isRegister;

  return (
    <div className="w-full relative">

      {/* Toast Bildirim Alanı */}
      {toast && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border text-xs font-semibold flex items-start justify-between space-x-2 animate-in fade-in slide-in-from-top-2 duration-200 ${toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
              : 'bg-amber-50 border-amber-200 text-red-600 shadow-sm'
            }`}
        >
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className={`leading-relaxed ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-600 font-semibold'}`}>
              {toast.message}
            </span>
          </div>
          <button
            onClick={closeToast}
            className={`p-1 rounded-lg transition-colors shrink-0 ${toast.type === 'success'
                ? 'hover:bg-emerald-100 text-emerald-600'
                : 'hover:bg-amber-100 text-red-500 hover:text-red-700'
              }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tab Switcher (Giriş Yap vs Kayıt Ol) */}
      <div className="flex p-1 bg-[#F0EBE3] rounded-2xl border border-[#DDD5C8] mb-5">
        <button
          type="button"
          onClick={() => {
            setIsRegister(false);
            setToast(null);
          }}
          className={`flex-1 py-2 text-xs rounded-xl transition-all ${isLogin
              ? 'bg-white text-stone-900 font-bold shadow-sm'
              : 'bg-transparent text-stone-600 font-medium hover:text-stone-900'
            }`}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegister(true);
            setToast(null);
          }}
          className={`flex-1 py-2 text-xs rounded-xl transition-all ${!isLogin
              ? 'bg-white text-stone-900 font-bold shadow-sm'
              : 'bg-transparent text-stone-600 font-medium hover:text-stone-900'
            }`}
        >
          Kayıt Ol
        </button>
      </div>

      {/* Form Alanları */}
      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Kayıt Modu Ekstra Alanları */}
        {isRegister && (
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Ad Soyad <span className="text-[#8C867A] font-normal">(Opsiyonel)</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C867A] absolute left-3 top-2.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 placeholder:text-[#8C867A] focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>
        )}

        {/* E-posta Alanı */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">E-posta Adresi</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C867A] absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@derintalks.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 placeholder:text-[#8C867A] focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>

        {/* Şifre Alanı */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-navy-900">Şifre</label>
            {isRegister && password && (
              <span className="text-[10px] font-bold uppercase text-[#8C867A]">
                Güç: <span className={strength.color.split(' ')[1]}>{strength.text}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C867A] absolute left-3 top-2.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 placeholder:text-[#8C867A] focus:outline-none focus:border-navy-900 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#8C867A] hover:text-navy-900 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Şifre güç çubuğu */}
          {isRegister && password && (
            <div className="w-full h-1 bg-[#EAE2D5] rounded-full overflow-hidden mt-1.5 flex">
              <div
                className={`h-full transition-all duration-300 ${strength.score === 1
                    ? 'w-1/3 bg-burgundy-600'
                    : strength.score === 2
                      ? 'w-2/3 bg-amber-500'
                      : 'w-full bg-emerald-500'
                  }`}
              />
            </div>
          )}
        </div>

        {/* Kayıt Modu: Seviye ve Rol Seçimi */}
        {isRegister && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Başlangıç Seviyesi</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 font-semibold focus:outline-none focus:border-navy-900"
              >
                <option value="A1">A1 - Başlangıç</option>
                <option value="A2">A2 - Temel</option>
                <option value="B1">B1 - Orta Öncesi</option>
                <option value="B2">B2 - Orta Üstü</option>
                <option value="C1">C1 - İleri</option>
                <option value="C2">C2 - Ustalık</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Hesap Türü</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE2D5] bg-white text-navy-900 font-semibold focus:outline-none focus:border-navy-900"
              >
                <option value="student">Öğrenci</option>
                <option value="teacher">Öğretmen</option>
              </select>
            </div>
          </div>
        )}

        {/* Gönder Butonu */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 mt-4 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-white font-bold">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
        </button>
      </form>

      {/* Alt Bilgi & Hızlı Geçiş */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setToast(null);
          }}
          className="text-xs text-burgundy-700 hover:text-burgundy-900 font-bold transition-colors"
        >
          {isRegister
            ? 'Zaten bir hesabınız var mı? Giriş Yapın'
            : 'Henüz hesabınız yok mu? Hemen Ücretsiz Kaydolun'}
        </button>
      </div>

    </div>
  );
}
