import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  MessageCircle, 
  Key, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Shield, 
  PhoneCall, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { 
  verifyActivationCode, 
  saveActivation, 
  getStudentWhatsAppRequestUrl,
  TEACHER_NAME,
  TEACHER_NAME_EN,
  TEACHER_WHATSAPP_DISPLAY 
} from '../utils/cryptoAuth';
import { playSuccessSound, playWrongSound, playClickSound } from '../utils/audio';

interface LockScreenProps {
  onSuccessActivation: (studentName: string) => void;
  onOpenTeacherPortal: () => void;
  initialStudentName?: string;
  initialCode?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onSuccessActivation,
  onOpenTeacherPortal,
  initialStudentName = '',
  initialCode = '',
}) => {
  const [studentName, setStudentName] = useState(initialStudentName);
  const [activationCode, setActivationCode] = useState(initialCode);
  const [errorMsg, setErrorMsg] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim() || studentName.trim().length < 2) {
      setErrorMsg('يرجى إدخال اسمك الكامل بشكل صحيح.');
      playWrongSound();
      return;
    }

    if (!activationCode.trim()) {
      setErrorMsg('يرجى كتابة كود التفعيل السري المخصص لاسمك.');
      playWrongSound();
      return;
    }

    setIsActivating(true);

    // Give a brief pleasant responsive feel
    setTimeout(() => {
      const isValid = verifyActivationCode(studentName, activationCode);

      if (isValid) {
        setSuccessAnimation(true);
        playSuccessSound();
        saveActivation(studentName, activationCode);
        setTimeout(() => {
          onSuccessActivation(studentName);
        }, 1200);
      } else {
        setIsActivating(false);
        playWrongSound();
        setErrorMsg('كود التفعيل غير متطابق مع هذا الاسم. تأكد من كتابة اسمك تماماً كما تم توليده من قبل المعلمة، أو اطلب كوداً جديداً.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070b19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.4),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background ambient elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Teacher Portal & Security Indicator */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>نظام تحقق وتفعيل رياضي مشفر مستقل</span>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onOpenTeacherPortal();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer hover:scale-105"
        >
          <Key className="w-3.5 h-3.5" />
          <span>بوابة المعلمة (Admin)</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div className="max-w-xl w-full mx-auto my-auto py-8 z-10">
        <div className="bg-slate-900/90 border border-blue-900/50 rounded-3xl shadow-2xl p-6 sm:p-10 backdrop-blur-xl space-y-8 relative">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-1">
              <BookOpen className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                CURRICULUM PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-english pt-1">
                MORE ENGLISH MORE LOVE
              </h1>
              <p className="text-sm font-bold text-amber-300/90 flex items-center justify-center gap-2">
                <span>بإشراف وتدريس المعلمة {TEACHER_NAME}</span>
                <span className="text-xs text-slate-400">({TEACHER_NAME_EN})</span>
              </p>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              منهاج تفاعلي متكامل للغة الإنجليزية يحتوي على الدروس الصوتية، القواعد، بنك المفردات، والاختبارات وأوراق العمل والحلول النموذجية.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleActivation} className="space-y-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-start">
                <User className="w-4 h-4 text-blue-400" />
                <span>اسم الطالب الكامل:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="اكتب اسمك الثلاثي كما تم تسجيله لدى المعلمة..."
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition"
                  disabled={isActivating || successAnimation}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-start">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>كود التفعيل الحصري (Secret Activation Code):</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => {
                    setActivationCode(e.target.value.toUpperCase());
                    setErrorMsg('');
                  }}
                  placeholder="MEML-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-amber-300 font-mono font-bold tracking-widest text-center text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 uppercase transition"
                  disabled={isActivating || successAnimation}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2 text-right">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successAnimation && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>تم التحقق بنجاح! جاري فتح المنهاج لمدة 6 أشهر...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isActivating || successAnimation}
              className={`w-full py-3.5 px-6 rounded-xl font-black text-sm transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                successAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isActivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري فك التشفير والتحقق الرياضي...</span>
                </>
              ) : successAnimation ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تم التفعيل بنجاح!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تفعيل الحساب والدخول للمنهاج</span>
                </>
              )}
            </button>
          </form>

          {/* Expiration Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 bg-slate-950/50 py-2 rounded-xl border border-slate-800/80">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>صلاحية الاشتراك: 6 أشهر كاملة (180 يوماً) من لحظة إدخال الكود لأول مرة</span>
          </div>

          {/* Section: How to get activation code via WhatsApp */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="text-center space-y-1">
              <h3 className="text-xs font-bold text-slate-200">
                كيف أحصل على كود تفعيل؟
              </h3>
              <p className="text-[11px] text-slate-400">
                تواصل مباشرة مع المعلمة {TEACHER_NAME} عبر واتساب لتسجيل اسمك واستلام كودك الفرعي:
              </p>
            </div>

            <a
              href={getStudentWhatsAppRequestUrl(studentName)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب كود تفعيل من المعلمة عبر واتساب ({TEACHER_WHATSAPP_DISPLAY})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 py-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div>
          <span>جميع الحقوق محفوظة للمنهاج التعليمي © {new Date().getFullYear()}</span>
          <span className="mx-2">•</span>
          <span className="text-amber-400 font-semibold">{TEACHER_NAME}</span>
        </div>
        <div className="text-[11px] text-slate-600">
          يعمل بدون اتصال بالخوادم، مجاني وآمن 100%
        </div>
      </div>
    </div>
  );
};
