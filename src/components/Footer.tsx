import React from 'react';
import { 
  MessageCircle, 
  Youtube, 
  Facebook, 
  Instagram, 
  Send, 
  Heart,
  PhoneCall,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { TEACHER_INFO } from '../data/curriculumData';
import { playClickSound } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-16 text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-white font-black font-english text-lg tracking-wide">
                MORE ENGLISH MORE LOVE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              تطبيق ومنهاج تعليمي تفاعلي متكامل للغة الإنجليزية بإشراف وتدريس المعلمة <span className="text-amber-400 font-bold">{TEACHER_INFO.name}</span> ({TEACHER_INFO.nameEn}).
            </p>
          </div>

          {/* Teacher Official Contact */}
          <div className="space-y-2 text-center md:text-right">
            <div className="font-bold text-slate-200 text-xs">
              التواصل المباشر مع المعلمة:
            </div>
            <a
              href={`https://wa.me/${TEACHER_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب المعلمة: {TEACHER_INFO.whatsapp}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Social Links from curriculum sheets */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-xs text-center md:text-left">
              قنوات ومنصات التواصل الرسمية:
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <a
                href={TEACHER_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-600 hover:text-white transition text-slate-300"
                title="قناة يوتيوب: @MoreEnglishMoreLove"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={TEACHER_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white transition text-slate-300"
                title="صفحة فيسبوك: MoreEnglishMoreLove"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={TEACHER_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-pink-600 hover:text-white transition text-slate-300"
                title="إنستغرام: moreenglishmorelove"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={TEACHER_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 hover:text-white transition text-slate-300"
                title="قناة تيليجرام: t.me/moreenglishmorelove"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>تم بناء وتصميم التطبيق التعليمي بـ</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>لصالح طلاب المعلمة {TEACHER_INFO.name}</span>
          </div>
          <div>
            <span>نظام التحقق الرياضي المستقل يعمل 100% بدون خوادم خارجية • جاهز للنشر المجاني</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
