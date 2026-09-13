import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { DIALOGUE_LINES } from '../../data/curriculumData';
import { speakEnglish, stopSpeaking, playSuccessSound, playWrongSound, playClickSound } from '../../utils/audio';

export const DialogueSection: React.FC = () => {
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [showArabic, setShowArabic] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const handleSpeakLine = (lineId: string, englishText: string) => {
    playClickSound();
    setActiveLineId(lineId);
    speakEnglish(englishText, () => {
      setActiveLineId(null);
    });
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setActiveLineId(null);
      return;
    }

    setIsPlayingAll(true);
    let index = 0;

    const playNext = () => {
      if (index >= DIALOGUE_LINES.length) {
        setIsPlayingAll(false);
        setActiveLineId(null);
        return;
      }

      const current = DIALOGUE_LINES[index];
      setActiveLineId(current.id);
      speakEnglish(current.english, () => {
        index++;
        setTimeout(playNext, 600);
      });
    };

    playNext();
  };

  const handleCheckQuestion = (answer: string) => {
    setQuizAnswer(answer);
    if (answer === 'under') {
      setQuizFeedback('إجابة صحيحة وممتازة! المساطر تقع تحت مقلمة الأقلام (under the pencil case).');
      playSuccessSound();
    } else {
      setQuizFeedback('حاول ثانية! راجع جملة المحادثة: They are under the pencil case.');
      playWrongSound();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Unit Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Unit 2 • الوحدة الثانية: صفنا الجديد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-english">
            Our New Classroom
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            استمع للمحادثة الصفية بين المعلمة وتلاميذها، وتعرف على كيفية وصف الأغراض والأدوات ومواقعها داخل الصف باللغة الإنجليزية الصحيحة.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePlayAll}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg ${
                isPlayingAll 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isPlayingAll ? <VolumeX className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAll ? 'إيقاف المحادثة' : 'تشغيل المحادثة كاملة بالصوت'}</span>
            </button>

            <button
              onClick={() => setShowArabic(!showArabic)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <span>{showArabic ? 'إخفاء الترجمة العربية' : 'إظهار الترجمة العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comic / Dialogue Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span>فقرات المحادثة التفاعلية (اضغط على أي سطر للاستماع إلى النطق النموذجي):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIALOGUE_LINES.map((line, idx) => {
            const isActive = activeLineId === line.id;
            return (
              <div
                key={line.id}
                onClick={() => handleSpeakLine(line.id, line.english)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isActive
                    ? 'bg-blue-950/80 border-amber-400 shadow-xl shadow-blue-500/10 scale-[1.01]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-3">
                  {/* Speaker Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{line.avatar}</span>
                      <div>
                        <span className="font-bold text-xs text-amber-400 block">{line.speakerAr}</span>
                        <span className="text-[10px] text-slate-400 font-english">{line.speaker}</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl transition ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                    }`}>
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* English Text */}
                  <div className="font-english text-base sm:text-lg font-bold text-white leading-snug">
                    {line.english}
                  </div>

                  {/* Arabic Translation */}
                  {showArabic && (
                    <div className="text-xs sm:text-sm text-slate-300 font-medium pt-1 border-t border-slate-800/60">
                      {line.arabic}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>الفقرة {idx + 1}</span>
                  <span className="text-blue-400 font-medium group-hover:underline">استمع الآن 🔊</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Comprehension Challenge */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>سؤال الفهم السريع من القصة:</span>
        </div>
        <div className="text-sm font-semibold text-slate-200">
          Where are the rulers according to the classroom conversation? (أين توجد المساطر في المحادثة؟)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'on', label: 'On the table (على الطاولة)' },
            { id: 'under', label: 'Under the pencil case (تحت المقلمة)' },
            { id: 'behind', label: 'Behind the door (خلف الباب)' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleCheckQuestion(opt.id)}
              className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                quizAnswer === opt.id
                  ? opt.id === 'under'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-rose-600 text-white border-rose-400'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {quizFeedback && (
          <div className={`p-3 rounded-xl text-xs font-bold ${
            quizAnswer === 'under' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {quizFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
