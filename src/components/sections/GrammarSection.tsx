import React, { useState } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Columns,
  Layers,
  Layout
} from 'lucide-react';
import { PREPOSITIONS_DATA } from '../../data/curriculumData';
import { speakEnglish, playSuccessSound, playWrongSound, playClickSound } from '../../utils/audio';

export const GrammarSection: React.FC = () => {
  const [activePrepId, setActivePrepId] = useState<string>(PREPOSITIONS_DATA[0].id);
  const [practiceQuestion, setPracticeQuestion] = useState({
    sentence: 'The table is _______ two chairs.',
    correct: 'between',
    userAnswer: null as string | null,
    isCorrect: null as boolean | null,
  });

  const activePrep = PREPOSITIONS_DATA.find(p => p.id === activePrepId) || PREPOSITIONS_DATA[0];

  const handleSelectPrep = (id: string) => {
    playClickSound();
    setActivePrepId(id);
    const selected = PREPOSITIONS_DATA.find(p => p.id === id);
    if (selected) {
      speakEnglish(selected.exampleEn);
    }
  };

  const handleCheckAnswer = (answer: string) => {
    const isCorrect = answer === practiceQuestion.correct;
    setPracticeQuestion({
      ...practiceQuestion,
      userAnswer: answer,
      isCorrect: isCorrect,
    });

    if (isCorrect) {
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grammar & Prepositions of Place</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          قواعد حروف الجر المكانية في المنهاج
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          شرح تفاعلي متقدم لحروف الجر المعتمدة في الوحدة الثانية (next to, behind, between, on, under, in) مع أمثلة كتاب الطالب وأوراق عمل المعلمة جيداء صقر.
        </p>
      </div>

      {/* Preposition Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PREPOSITIONS_DATA.map((item) => {
          const isSelected = activePrepId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectPrep(item.id)}
              className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-english font-black text-base">{item.word}</span>
              <span className="text-xs font-semibold opacity-90">{item.wordAr}</span>
            </button>
          );
        })}
      </div>

      {/* Active Preposition Interactive Detail View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
              {activePrep.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black font-english text-white">
                  {activePrep.word}
                </h3>
                <span className="text-lg font-bold text-amber-400 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {activePrep.wordAr}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activePrep.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => speakEnglish(`${activePrep.word}. ${activePrep.exampleEn}`)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع لنطق الحرف والمثال</span>
          </button>
        </div>

        {/* Visual Placement Demo */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-amber-400">
            المشهد التوضيحي للجملة:
          </span>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/60 max-w-xl w-full">
            <div className="text-lg sm:text-2xl font-black font-english text-white">
              "{activePrep.exampleEn}"
            </div>
            <div className="text-sm font-bold text-slate-300 mt-1">
              "{activePrep.exampleAr}"
            </div>
          </div>

          {/* Graphical Representation */}
          <div className="w-full max-w-md h-32 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/40 flex items-center justify-center gap-6 relative overflow-hidden">
            {activePrep.word === 'next to' && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl">👩‍🏫</div>
                  <span className="text-[11px] text-slate-400 font-english">The teacher</span>
                </div>
                <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">next to</div>
                <div className="text-center">
                  <div className="text-3xl">🪑</div>
                  <span className="text-[11px] text-slate-400 font-english">The desk</span>
                </div>
              </div>
            )}

            {activePrep.word === 'behind' && (
              <div className="flex items-center justify-center relative">
                <div className="text-center z-20">
                  <div className="text-4xl">🌳</div>
                  <span className="text-[11px] text-slate-400 font-english">The tree</span>
                </div>
                <div className="text-center absolute -right-6 top-1 z-10 opacity-85">
                  <div className="text-3xl">🐱</div>
                  <span className="text-[10px] text-amber-400 font-bold bg-slate-900 px-1 rounded">behind</span>
                </div>
              </div>
            )}

            {activePrep.word === 'between' && (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl">🪑</div>
                  <span className="text-[10px] text-slate-400">Chair 1</span>
                </div>
                <div className="text-center bg-blue-600/20 px-3 py-1.5 rounded-xl border border-blue-500/40">
                  <div className="text-3xl">🪵</div>
                  <span className="text-[11px] font-bold text-amber-400">between</span>
                </div>
                <div className="text-center">
                  <div className="text-3xl">🪑</div>
                  <span className="text-[10px] text-slate-400">Chair 2</span>
                </div>
              </div>
            )}

            {activePrep.word === 'on' && (
              <div className="flex flex-col items-center">
                <div className="text-2xl animate-bounce">📚</div>
                <div className="text-[10px] text-amber-400 font-bold">on the table</div>
                <div className="w-32 h-3 bg-amber-700 rounded-sm mt-1" />
                <div className="flex justify-between w-28 h-6 border-x-2 border-amber-800" />
              </div>
            )}

            {activePrep.word === 'under' && (
              <div className="flex flex-col items-center">
                <div className="w-28 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-english font-bold text-white shadow">
                  Pencil case
                </div>
                <div className="text-[10px] text-amber-400 font-bold mt-1">under ⬇️</div>
                <div className="text-2xl mt-0.5">📏 📐</div>
              </div>
            )}

            {activePrep.word === 'in' && (
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl">🎒</div>
                <div className="text-xs font-bold text-slate-200">
                  <span className="text-amber-400">in</span> the bag (Notebooks inside)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Interactive Test */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>تمرين تطبيقي سريع من أوراق العمل:</span>
        </div>

        <div className="text-base font-bold font-english text-white">
          {practiceQuestion.sentence}
        </div>
        <p className="text-xs text-slate-400">
          اختر حرف الجر المناسب لملء الفراغ بحيث تكون الجملة صحيحة قواعدياً:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['on', 'between', 'under'].map((option) => (
            <button
              key={option}
              onClick={() => handleCheckAnswer(option)}
              className={`p-3 rounded-xl border text-sm font-bold font-english transition cursor-pointer ${
                practiceQuestion.userAnswer === option
                  ? option === practiceQuestion.correct
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-rose-600 text-white border-rose-400'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {practiceQuestion.isCorrect !== null && (
          <div className={`p-3 rounded-xl text-xs font-bold ${
            practiceQuestion.isCorrect 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {practiceQuestion.isCorrect 
              ? '✓ أحسنت! إجابة ممتازة. نستخدم between لأن الطاولة تقع بين كرسيين (two chairs).' 
              : '✗ إجابة غير صحيحة، فكر مجدداً: الطاولة تتوسط كرسيين اثنين.'}
          </div>
        )}
      </div>
    </div>
  );
};
