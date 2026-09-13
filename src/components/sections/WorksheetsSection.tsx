import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Award,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { CURRICULUM_WORKSHEETS, TEACHER_INFO } from '../../data/curriculumData';
import { Worksheet } from '../../types';
import { speakEnglish, playSuccessSound, playClickSound } from '../../utils/audio';

export const WorksheetsSection: React.FC = () => {
  const [selectedWsIndex, setSelectedWsIndex] = useState(0);
  const [showModelAnswers, setShowModelAnswers] = useState<{ [wsId: string]: boolean }>({});

  const activeWorksheet: Worksheet = CURRICULUM_WORKSHEETS[selectedWsIndex] || CURRICULUM_WORKSHEETS[0];
  const isModelAnswerVisible = !!showModelAnswers[activeWorksheet.id];

  const toggleModelAnswer = (wsId: string) => {
    playClickSound();
    setShowModelAnswers(prev => ({
      ...prev,
      [wsId]: !prev[wsId]
    }));
  };

  const handlePrintWorksheet = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <FileText className="w-3.5 h-3.5" />
          <span>7 Curriculum Worksheets & Model Solutions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          أوراق عمل المنهاج والحلول النموذجية (7 أوراق عمل معتمدة)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          القسم السابع والأخير المخصص لأوراق عمل منهاج MORE ENGLISH MORE LOVE بإشراف المعلمة جيداء صقر، مزودة بالحلول النموذجية التفسيرية وإمكانية الطباعة المباشرة.
        </p>

        {/* Action toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => toggleModelAnswer(activeWorksheet.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-md ${
              isModelAnswerVisible
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isModelAnswerVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>
              {isModelAnswerVisible ? 'إخفاء الحل النموذجي' : 'عرض الحل النموذجي والشرح الأكاديمي'}
            </span>
          </button>

          <button
            onClick={handlePrintWorksheet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة ورقة العمل الحالية (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Worksheets Carousel Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar no-print">
        {CURRICULUM_WORKSHEETS.map((ws, idx) => {
          const isSelected = selectedWsIndex === idx;
          return (
            <button
              key={ws.id}
              onClick={() => {
                playClickSound();
                setSelectedWsIndex(idx);
              }}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="w-6 h-6 rounded-lg bg-slate-950/40 flex items-center justify-center font-english text-xs">
                {ws.number}
              </span>
              <span>{ws.titleAr.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Worksheet Document Paper View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:p-4 print:border-none print:shadow-none">
        {/* Worksheet Header Header Banner */}
        <div className="border-b-2 border-slate-800 print:border-black pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 print:text-blue-700 font-english">
                {activeWorksheet.unit} • {activeWorksheet.unitAr}
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white print:text-black mt-1 font-english">
                {activeWorksheet.titleEn}
              </h3>
              <p className="text-sm font-bold text-slate-300 print:text-slate-700 mt-1">
                {activeWorksheet.titleAr}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-400 print:text-black space-y-1">
              <div>English Teacher: <span className="font-bold text-amber-400 print:text-black">{TEACHER_INFO.nameEn}</span></div>
              <div>المعلمة: <span className="font-bold">{TEACHER_INFO.name}</span></div>
              <div className="text-[11px] text-slate-500 font-english">MORE ENGLISH MORE LOVE</div>
            </div>
          </div>

          <p className="text-xs text-slate-400 print:text-slate-600">
            {activeWorksheet.description}
          </p>
        </div>

        {/* Exercises */}
        <div className="space-y-8">
          {activeWorksheet.exercises.map((ex) => (
            <div key={ex.id} className="space-y-4">
              {/* Exercise Title & Instructions */}
              <div className="flex items-start justify-between gap-4 bg-slate-950/60 print:bg-slate-100 p-4 rounded-2xl border border-slate-800 print:border-slate-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold font-english text-xs flex items-center justify-center shrink-0">
                      {ex.number}
                    </span>
                    <h4 className="font-black text-white print:text-black font-english text-base sm:text-lg">
                      {ex.titleEn}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-amber-400 print:text-blue-800 mr-9">
                    {ex.titleAr}
                  </p>
                  <p className="text-xs text-slate-400 print:text-slate-700 mr-9">
                    {ex.instructionAr} ({ex.instructionEn})
                  </p>
                </div>

                <button
                  onClick={() => speakEnglish(ex.titleEn)}
                  className="p-2.5 rounded-xl bg-slate-900 print:hidden hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                  title="استمع لعنوان التمرين"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Exercise Items Rendering */}
              <div className="space-y-3 mr-2 sm:mr-4">
                {/* Type 1: Read and Circle */}
                {ex.type === 'read_and_circle' && (
                  <div className="space-y-2">
                    {ex.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/40 print:bg-white border border-slate-800 print:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 font-english">
                            {idx + 1}-
                          </span>
                          <span className="font-english font-bold text-white print:text-black text-sm sm:text-base">
                            {item.sentence || item.words?.join('   -   ') || item.word}
                          </span>
                          {item.translation && (
                            <span className="text-xs text-slate-400 print:text-slate-600">
                              ({item.translation})
                            </span>
                          )}
                        </div>

                        {/* Model answer highlight if active */}
                        {isModelAnswerVisible && (
                          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 print:bg-emerald-50 text-emerald-400 print:text-emerald-800 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>الحل: {item.correct || (item.hasB ? 'يحتوي على B' : 'لا يحتوي')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Type 2: Match */}
                {ex.type === 'match' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ex.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/40 print:bg-white border border-slate-800 print:border-slate-200 space-y-1.5"
                      >
                        <div className="font-english font-bold text-white print:text-black text-base">
                          {item.sentence || item.word}
                        </div>
                        <div className="text-xs text-slate-400 print:text-slate-600">
                          {item.arabic}
                        </div>
                        {isModelAnswerVisible && (
                          <div className="text-xs font-bold text-emerald-400 print:text-emerald-800 pt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>التوصيل المطابق: {item.matchTo || item.sound || item.imageDesc}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Type 3: Multiple Choice & Comprehensive Questions */}
                {ex.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {ex.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/40 print:bg-white border border-slate-800 print:border-slate-200 space-y-2"
                      >
                        <div className="font-english font-bold text-white print:text-black text-base">
                          {item.q || item.name}
                        </div>
                        {item.arabic && (
                          <div className="text-xs text-slate-400">
                            {item.arabic}
                          </div>
                        )}
                        {isModelAnswerVisible && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 print:bg-emerald-50 border border-emerald-500/30 text-emerald-300 print:text-emerald-800 text-xs space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>الإجابة النموذجية: {item.answerEn || `الرقم ${item.correctNumber}`}</span>
                            </div>
                            {item.explanation && (
                              <p className="text-[11px] text-slate-300 print:text-slate-700">
                                الشرح: {item.explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Type 4: Trace and Copy */}
                {ex.type === 'trace_and_copy' && (
                  <div className="space-y-3">
                    {ex.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/40 print:bg-white border border-slate-800 print:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <span className="font-english text-2xl font-black text-amber-400 print:text-black mr-2">
                            {item.target}
                          </span>
                          <span className="text-xs text-slate-400">({item.type})</span>
                        </div>

                        <div className="font-english text-xs text-slate-400">
                          {item.strokes}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Type 5: Listen and Tick */}
                {ex.type === 'listen_and_tick' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ex.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/40 print:bg-white border border-slate-800 print:border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">السؤال {item.id}</span>
                          <button
                            onClick={() => speakEnglish(item.audioText)}
                            className="text-xs text-blue-400 print:hidden hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>استمع للجملة</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.options.map((opt: string) => (
                            <span
                              key={opt}
                              className={`px-3 py-1 rounded-lg text-xs font-english font-bold ${
                                isModelAnswerVisible && opt === item.correct
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-900 border border-slate-800 text-slate-300'
                              }`}
                            >
                              {opt} {isModelAnswerVisible && opt === item.correct ? '✓' : ''}
                            </span>
                          ))}
                        </div>
                        {isModelAnswerVisible && (
                          <div className="text-[11px] text-emerald-400 font-bold">
                            {item.explanationAr}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Answer Teacher Box */}
              {isModelAnswerVisible && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-950 to-emerald-950/50 border border-emerald-500/40 text-xs space-y-2 print:border-emerald-800">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>التفسير الأكاديمي النموذجي من المعلمة جيداء صقر:</span>
                  </div>
                  <p className="text-slate-200 print:text-black leading-relaxed">
                    {ex.modelAnswerExplanationAr}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Teacher Note Footer */}
        {activeWorksheet.notesTeacher && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center gap-2 print:text-black print:border-amber-800">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>توجيهات المعلمة: {activeWorksheet.notesTeacher}</span>
          </div>
        )}
      </div>
    </div>
  );
};
