import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Volume2, 
  Sparkles, 
  HelpCircle,
  Clock,
  GraduationCap
} from 'lucide-react';
import { QUIZ_QUESTIONS, TEACHER_INFO } from '../../data/curriculumData';
import { speakEnglish, playSuccessSound, playWrongSound, playCelebrationFanfare, playClickSound } from '../../utils/audio';

interface QuizSectionProps {
  studentName: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ studentName }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (optId: string) => {
    if (selectedAnswers[currentQ.id]) return; // already answered
    playClickSound();

    const newAnswers = { ...selectedAnswers, [currentQ.id]: optId };
    setSelectedAnswers(newAnswers);

    const chosenOpt = currentQ.options.find(o => o.id === optId);
    if (chosenOpt?.isCorrect) {
      playSuccessSound();
      setScore(prev => prev + 1);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setShowResults(true);
      playCelebrationFanfare();
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">
          <Award className="w-3.5 h-3.5" />
          <span>Interactive Assessment & Official Certificate</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          الاختبار الذكي المنهجي والشهادة التقديرية
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          10 أسئلة ذكية تغطي مفردات الصف، حروف الجر، الصوتيات، والقراءة. عند إتمام الاختبار بنجاح، يحصل الطالب على شهادة تفوق رقمية رسمية موقعة من المعلمة جيداء صقر.
        </p>
      </div>

      {!showResults ? (
        /* Quiz in Progress */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl no-print">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>السؤال {currentQuestionIdx + 1} من {QUIZ_QUESTIONS.length}</span>
              <span className="text-amber-400">النقاط الحالية: {score}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  {currentQ.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-english text-white pt-2">
                  {currentQ.questionEn}
                </h3>
                <p className="text-sm font-semibold text-slate-300">
                  {currentQ.questionAr}
                </p>
              </div>

              {currentQ.audioText && (
                <button
                  onClick={() => speakEnglish(currentQ.audioText!)}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                  title="استمع للسؤال"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                const hasAnswered = !!selectedAnswers[currentQ.id];

                let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                if (hasAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-600/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-600/20 border-rose-400 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${btnStyle}`}
                  >
                    <span className="font-english font-bold text-base">{opt.textEn}</span>
                    <span className="text-xs font-semibold">{opt.textAr}</span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedAnswers[currentQ.id] && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>الشرح والتوضيح الأكاديمي من المعلمة:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              disabled={!selectedAnswers[currentQ.id]}
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer ${
                selectedAnswers[currentQ.id]
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي ←' : 'عرض النتيجة والشهادة 🏆'}
            </button>
          </div>
        </div>
      ) : (
        /* Results & Printable Certificate */
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl no-print">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-amber-400/10 text-amber-400 text-4xl mb-1">
              🎉
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              تهانينا يا {studentName}! لقد أتممت الاختبار بنجاح
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              لقد أحرزت {score} من أصل {QUIZ_QUESTIONS.length} بنسبة نجاح بلغت {percentage}%.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handlePrintCertificate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ شهادة التفوق (PDF)</span>
              </button>

              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>
            </div>
          </div>

          {/* Official Printable Certificate (Styled beautifully for screen and print) */}
          <div className="max-w-3xl mx-auto p-2 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-3xl shadow-2xl">
            <div className="bg-slate-950 p-8 sm:p-12 rounded-[22px] border-4 border-amber-400/50 text-center space-y-6 relative overflow-hidden text-slate-100">
              {/* Certificate Decorative Corners */}
              <div className="absolute top-3 left-3 text-amber-400 font-serif text-2xl opacity-60">✦</div>
              <div className="absolute top-3 right-3 text-amber-400 font-serif text-2xl opacity-60">✦</div>
              <div className="absolute bottom-3 left-3 text-amber-400 font-serif text-2xl opacity-60">✦</div>
              <div className="absolute bottom-3 right-3 text-amber-400 font-serif text-2xl opacity-60">✦</div>

              <div className="space-y-1">
                <div className="text-xs font-black tracking-widest text-amber-400 uppercase font-english">
                  CERTIFICATE OF ACHIEVEMENT
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  شهادة تقدير وتفوق في اللغة الإنجليزية
                </h2>
                <p className="text-xs font-english text-amber-300/80 tracking-wider">
                  MORE ENGLISH MORE LOVE CURRICULUM
                </p>
              </div>

              <div className="py-3 border-y border-amber-500/30 max-w-lg mx-auto space-y-2">
                <p className="text-sm text-slate-300">
                  تشهد المعلمة <span className="font-bold text-amber-300">{TEACHER_INFO.name}</span> بأن التلميذ/ة المتميز/ة:
                </p>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-english py-1">
                  {studentName}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  قد أتم بنجاح واقتدار متطلبات منهاج الوحدة الثانية (Our New Classroom) وحقق درجة تفوق ({percentage}%) في الاختبار التفاعلي الذكي.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 max-w-lg mx-auto">
                <div className="text-center space-y-1">
                  <div className="text-xs text-slate-400">تاريخ الإنجاز</div>
                  <div className="text-xs font-bold text-slate-200">
                    {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* Golden Seal */}
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/10 flex flex-col items-center justify-center text-amber-400 shadow-inner">
                  <GraduationCap className="w-7 h-7" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">EXCELLENCE</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-xs text-slate-400">المعلمة المشرفة</div>
                  <div className="font-serif italic font-bold text-amber-300 text-sm">
                    {TEACHER_INFO.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-500">جيداء صقر</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
