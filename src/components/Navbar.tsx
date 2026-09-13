import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Key, 
  LogOut, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Layers,
  FileText,
  HelpCircle
} from 'lucide-react';
import { TEACHER_NAME, TEACHER_NAME_EN } from '../utils/cryptoAuth';
import { playClickSound } from '../utils/audio';

interface NavbarProps {
  studentName: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenTeacherPortal: () => void;
  onLogout: () => void;
}

export const TABS = [
  { id: 'dialogue', titleAr: 'المحادثة والقصة', titleEn: 'Dialogue', icon: '📖' },
  { id: 'vocabulary', titleAr: 'بنك المفردات', titleEn: 'Vocabulary', icon: '🔤' },
  { id: 'grammar', titleAr: 'قواعد حروف الجر', titleEn: 'Grammar', icon: '📐' },
  { id: 'listening', titleAr: 'مختبر الاستماع والصوتيات', titleEn: 'Listening & Phonics', icon: '🎧' },
  { id: 'games', titleAr: 'الألعاب والخط', titleEn: 'Games & Tracing', icon: '✍️' },
  { id: 'quiz', titleAr: 'الاختبار الذكي والشهادة', titleEn: 'Smart Quiz', icon: '🏆' },
  { id: 'worksheets', titleAr: 'أوراق العمل والحلول النموذجية (7)', titleEn: '7 Worksheets', icon: '📑' },
];

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  daysRemaining,
  hoursRemaining,
  minutesRemaining,
  activeTab,
  onSelectTab,
  onOpenTeacherPortal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      {/* Top Banner with Student Info and Countdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        {/* Brand & Teacher */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm font-english tracking-wide">
              MORE ENGLISH MORE LOVE
            </div>
            <div className="text-[11px] font-semibold text-amber-400">
              إشراف وتدريس: {TEACHER_NAME} ({TEACHER_NAME_EN})
            </div>
          </div>
        </div>

        {/* Student Name & 6-Month Countdown */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>الطالب: {studentName}</span>
          </div>

          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs shadow-sm"
            title="مدة الاشتراك الكاملة 180 يوماً من تاريخ التفعيل"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              متبقي على اشتراكك: {daysRemaining} يوم و {hoursRemaining} ساعة
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playClickSound();
                onOpenTeacherPortal();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
              title="لوحة تحكم المعلمة"
            >
              <Key className="w-3 h-3" />
              <span>لوحة المعلمة</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onLogout();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-bold transition flex items-center gap-1 cursor-pointer"
              title="تسجيل الخروج وقفل المنهاج"
            >
              <LogOut className="w-3 h-3" />
              <span>قفل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 space-x-reverse py-2 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40 scale-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.titleAr}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
