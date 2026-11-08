import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  GraduationCap,
  Presentation,
  BookOpen
} from 'lucide-react';
import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

export default function AuthForm({ onSuccess, initialMode = 'login' }) {
  const { setAuthSession, forgotPassword } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [loginRole, setLoginRole] = useState('student'); // 'student' | 'teacher'
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

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

  // Password strength calculator (Red / Burgundy / Amber tones - No green)
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: '', color: '' };
    if (password.length < 6) return { score: 1, text: 'Zayıf (En az 6 karakter)', color: 'bg-red-500 text-red-600' };
    if (password.length < 8) return { score: 2, text: 'Orta', color: 'bg-amber-500 text-amber-600' };
    return { score: 3, text: 'Güçlü & Güvenli', color: 'bg-rose-800 text-rose-800' };
  };

  const strength = getPasswordStrength();

  // Handle Login & Register submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        // 1. Kayıt Ol Kontrolleri
        if (!firstName.trim() || !lastName.trim()) {
          showNotification('error', 'Lütfen ad ve soyadınızı eksiksiz girin.');
          setLoading(false);
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const payload = {
          email: email.trim(),
          password,
          full_name: fullName,
          role: 'student',
          current_level: 'A1'
        };

        // POST /api/register çağrısı
        await api.register(payload);

        // Başarılı olursa 'Kayıt başarılı, lütfen giriş yapın' mesajı verip Öğrenci Girişi sekmesine yönlendir
        showNotification('success', 'Kayıt başarılı, lütfen giriş yapın');
        setMode('login');
        setLoginRole('student');
        setPassword('');
        setFirstName('');
        setLastName('');
        setLoading(false);
        return;
      } else {
        // 2. Giriş Yap (POST /api/login)
        const res = await api.login(email.trim(), password);
        const userRole = res.user?.role;

        // 'Eğitmen Girişi' sekmesinden gelen kontroller
        if (loginRole === 'teacher') {
          const isInstructor = userRole === 'admin' || userRole === 'teacher';
          if (!isInstructor) {
            // GİRİŞİ ENGELLE: Kullanıcı student ise giriş yapamaz, token kaydedilmez
            showNotification('error', 'Bu alana sadece eğitmenler giriş yapabilir!');
            setLoading(false);
            return;
          }
        }

        // 'Öğrenci Girişi' veya yetkili 'Eğitmen Girişi': Token ve kullanıcıyı kaydet
        setAuthSession(res.access_token, res.user);
        showNotification('success', res?.message || 'Giriş başarılı! Yönlendiriliyorsunuz.');

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 800);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      showNotification('error', err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      if (forgotPassword) {
        await forgotPassword(forgotEmail.trim());
      }
      setForgotSubmitted(true);
      showNotification('success', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
    } catch (err) {
      console.error('Forgot password error:', err);
      showNotification('error', err.message || 'Şifre sıfırlama bağlantısı gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Toast Notification (Hata mesajları belirgin kırmızı renkte) */}
      {toast && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border text-xs font-semibold flex items-start justify-between space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-stone-50 border-stone-200 text-[#0F172A] shadow-sm'
              : 'bg-red-50 border-red-200 text-red-700 shadow-md'
          }`}
        >
          <div className="flex items-start space-x-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className={`leading-relaxed ${toast.type === 'error' ? 'font-black text-red-600' : 'font-bold'}`}>
              {toast.message}
            </span>
          </div>
          <button
            onClick={closeToast}
            className="p-1 rounded-lg text-slate-400 hover:text-[#0F172A] transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Forgot Password View */}
      {mode === 'forgot' ? (
        <div className="animate-in fade-in duration-200">
          <div className="mb-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-3 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
              Şifremi Unuttum
            </h3>
            <p className="text-xs text-[#0F172A]/70 mt-1.5 leading-relaxed max-w-xs mx-auto">
              Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısını hemen iletelim.
            </p>
          </div>

          {forgotSubmitted ? (
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-center space-y-3 my-4">
              <div className="w-10 h-10 mx-auto rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-red-950 leading-relaxed">
                <span className="font-bold text-red-900">{forgotEmail}</span> adresine sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSubmitted(false);
                  setMode('login');
                  setToast(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Kayıtlı E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="ornek@posta.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-[#FAFAFA] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 hover:from-red-700 hover:via-rose-800 hover:to-red-900 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all flex items-center justify-center space-x-2 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Şifre Sıfırlama Bağlantısı Gönder</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setToast(null);
                }}
                className="w-full flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-[#0F172A]/70 hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Giriş Yap Ekranına Dön</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          {/* Main Mode Tabs: Giriş Yap vs Kayıt Ol */}
          <div className="flex p-1 bg-[#F1F3F5] rounded-2xl border border-stone-200/70 mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setToast(null);
              }}
              className={`flex-1 py-2.5 text-xs rounded-xl font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#0F172A] shadow-sm border border-stone-200/60'
                  : 'text-[#0F172A]/60 hover:text-[#0F172A] font-medium'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setToast(null);
              }}
              className={`flex-1 py-2.5 text-xs rounded-xl font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#0F172A] shadow-sm border border-stone-200/60'
                  : 'text-[#0F172A]/60 hover:text-[#0F172A] font-medium'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Giriş Yap Formunun Üstündeki Rol Sekmeleri (Öğrenci Girişi & Eğitmen Girişi) */}
          {mode === 'login' && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
                {/* Öğrenci Girişi Sekmesi */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('student');
                    setToast(null);
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    loginRole === 'student'
                      ? 'bg-white text-[#0F172A] shadow-md border border-stone-200/60 scale-[1.01]'
                      : 'text-[#0F172A]/60 hover:text-[#0F172A]'
                  }`}
                >
                  <GraduationCap className={`w-4 h-4 ${loginRole === 'student' ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>Öğrenci Girişi</span>
                </button>

                {/* Eğitmen Girişi Sekmesi */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('teacher');
                    setToast(null);
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    loginRole === 'teacher'
                      ? 'bg-[#0F172A] text-white shadow-md border border-[#0F172A] scale-[1.01]'
                      : 'text-[#0F172A]/60 hover:text-[#0F172A]'
                  }`}
                >
                  <Presentation className={`w-4 h-4 ${loginRole === 'teacher' ? 'text-red-400' : 'text-slate-400'}`} />
                  <span>Eğitmen Girişi</span>
                </button>
              </div>

              {/* Farkı açıkça gösteren bilgilendirme rozeti */}
              <div className={`mt-2.5 p-2 rounded-xl border text-[11px] font-semibold flex items-center space-x-2 transition-all ${
                loginRole === 'student'
                  ? 'bg-stone-50 border-stone-200 text-[#0F172A]'
                  : 'bg-red-50/80 border-red-200 text-red-900'
              }`}>
                {loginRole === 'student' ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Öğrenci Kampüsü: Dersler, kelime kartları ve testler</span>
                  </>
                ) : (
                  <>
                    <Presentation className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Eğitmen Masası: Soru CMS, müfredat ve öğrenci takibi</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Kayıt Alanları: Ad ve Soyad */}
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Adınız
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ahmet"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-[#FAFAFA] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Soyadınız
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Yılmaz"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-[#FAFAFA] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E-posta Alanı */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' && loginRole === 'teacher' ? 'ogretmen@derintalks.com' : 'ogrenci@derintalks.com'}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-[#FAFAFA] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Şifre Alanı */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#0F172A]">
                  Şifre
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setMode('forgot');
                      setToast(null);
                    }}
                    className="text-[11px] font-bold text-red-600 hover:text-red-800 transition-colors"
                  >
                    Şifremi Unuttum?
                  </button>
                )}
                {mode === 'register' && password && (
                  <span className="text-[10px] font-bold text-[#0F172A]/70">
                    Güvenlik: <span className={strength.color.split(' ')[1]}>{strength.text}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 bg-[#FAFAFA] text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/15 focus:border-red-600 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-[#0F172A] transition-colors"
                  title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Şifre Güç Çubuğu (Kayıt ekranında) */}
              {mode === 'register' && password && (
                <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden mt-1.5 flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength.score === 1
                        ? 'w-1/3 bg-red-500'
                        : strength.score === 2
                        ? 'w-2/3 bg-amber-500'
                        : 'w-full bg-rose-800'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Gönder Butonu (Bordo & Kırmızı Vurgu) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 hover:from-red-700 hover:via-rose-800 hover:to-red-900 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all flex items-center justify-center space-x-2 mt-4 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? (loginRole === 'teacher' ? 'Eğitmen Masasına Giriş Yap' : 'Öğrenci Girişi Yap')
                      : 'Hesabını Oluştur'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Alt Bilgi & Mod Geçişi */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setToast(null);
              }}
              className="text-xs text-[#0F172A] font-semibold transition-colors"
            >
              {mode === 'register' ? (
                <span>
                  Zaten bir hesabınız var mı?{' '}
                  <strong className="text-red-600 hover:text-red-800 hover:underline">Giriş Yapın</strong>
                </span>
              ) : (
                <span>
                  Henüz hesabınız yok mu?{' '}
                  <strong className="text-red-600 hover:text-red-800 hover:underline">Hemen Ücretsiz Kaydolun</strong>
                </span>
              )}
            </button>
          </div>
        </>
      )}

      {/* Güvenlik & Gizlilik Notu */}
      <div className="mt-4 pt-3 flex items-center justify-center space-x-1.5 text-[11px] text-[#0F172A]/70 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span>256-Bit SSL korumalı güvenli giriş</span>
      </div>
    </div>
  );
}
