import React, { useState } from 'react';
import { 
  Volume2, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Award, 
  Headphones, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from 'lucide-react';
import { speakEnglish, playSuccessSound, playWrongSound, playClickSound } from '../../utils/audio';

export const ListeningSection: React.FC = () => {
  // Activity 1: Listen and Number
  const [numbers, setNumbers] = useState<{ [key: string]: string }>({
    'pencil cases': '',
    'posters': '',
    'rulers': '',
    'notebooks': '',
  });
  const [numberCheckResult, setNumberCheckResult] = useState<boolean | null>(null);

  // Activity 2: Listen and Tick (4 questions from Worksheet 3 / Textbook Ex 5)
  const tickQuestions = [
    {
      id: 1,
      prompt: 'Audio 1: Listen carefully and tick the correct item.',
      audio: 'The bag is here.',
      options: [
        { id: 'chairs', label: 'Chairs', icon: '🪑' },
        { id: 'table', label: 'Table', icon: '🪵' },
        { id: 'bag', label: 'Bag', icon: '🎒', isCorrect: true },
      ],
    },
    {
      id: 2,
      prompt: 'Audio 2: Listen and tick the matching picture.',
      audio: 'Open the notebook.',
      options: [
        { id: 'closed_books', label: 'Books', icon: '📚' },
        { id: 'notebook', label: 'Notebook', icon: '📖', isCorrect: true },
        { id: 'pens', label: 'Pens', icon: '✏️' },
      ],
    },
    {
      id: 3,
      prompt: 'Audio 3: Listen and tick.',
      audio: 'This is a pencil case.',
      options: [
        { id: 'pencil_case', label: 'Pencil Case', icon: '👝', isCorrect: true },
        { id: 'eraser', label: 'Rubber', icon: '🧼' },
        { id: 'ruler', label: 'Ruler', icon: '📏' },
      ],
    },
    {
      id: 4,
      prompt: 'Audio 4: Listen and tick.',
      audio: 'Look at the posters on the wall.',
      options: [
        { id: 'desks', label: 'Desks', icon: '🪑' },
        { id: 'poster', label: 'Posters', icon: '🖼️', isCorrect: true },
        { id: 'pupil', label: 'Pupil', icon: '👧' },
      ],
    },
  ];

  const [selectedTicks, setSelectedTicks] = useState<{ [key: number]: string }>({});
  const [tickFeedback, setTickFeedback] = useState<{ [key: number]: boolean }>({});

  // Activity 3: Phonics letter 'b'
  const phonicsWords = [
    { word: 'butterfly', hasB: true, icon: '🦋', label: 'فراشة' },
    { word: 'cat', hasB: false, icon: '🐱', label: 'قطة' },
    { word: 'bird', hasB: true, icon: '🐦', label: 'طائر' },
    { word: 'rubber', hasB: true, icon: '🧼', label: 'ممحاة' },
    { word: 'box', hasB: true, icon: '📦', label: 'صندوق' },
    { word: 'sun', hasB: false, icon: '☀️', label: 'شمس' },
  ];
  const [selectedPhonics, setSelectedPhonics] = useState<string[]>([]);
  const [phonicsTested, setPhonicsTested] = useState(false);

  const handlePlayAudio = (text: string) => {
    playClickSound();
    speakEnglish(text);
  };

  const handleCheckNumbers = () => {
    // Correct order as in book page 5:
    // 1: pencil cases, 2: posters, 3: rulers, 4: notebooks
    const is1 = numbers['pencil cases'] === '1';
    const is2 = numbers['posters'] === '2';
    const is3 = numbers['rulers'] === '3';
    const is4 = numbers['notebooks'] === '4';

    const allCorrect = is1 && is2 && is3 && is4;
    setNumberCheckResult(allCorrect);
    if (allCorrect) {
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  const handleSelectTick = (qId: number, optId: string, isCorrect: boolean) => {
    playClickSound();
    setSelectedTicks(prev => ({ ...prev, [qId]: optId }));
    setTickFeedback(prev => ({ ...prev, [qId]: isCorrect }));
    if (isCorrect) {
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  const togglePhonicsSelection = (word: string) => {
    playClickSound();
    setSelectedPhonics(prev => 
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const handleCheckPhonics = () => {
    setPhonicsTested(true);
    const correctItems = ['butterfly', 'bird', 'rubber', 'box'];
    const isPerfect = 
      selectedPhonics.length === correctItems.length &&
      selectedPhonics.every(w => correctItems.includes(w));

    if (isPerfect) {
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <Headphones className="w-3.5 h-3.5" />
          <span>Listening Lab & Phonics Sound /b/</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          مختبر الاستماع والصوتيات التفاعلي
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          تدريبات الاستماع المنهجية (Listen, repeat and number) و (Listen and tick) وصوتيات حرف B كما أعدتها المعلمة جيداء صقر.
        </p>
      </div>

      {/* Exercise 1: Listen and Number (كتاب الطالب ص 5) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-amber-400">التدريب الأول من المنهاج:</div>
            <h3 className="text-lg font-black font-english text-white">
              2. Listen, repeat and number (1, 2, 3, 4)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              استمع للكلمات ورقم الأدوات من 1 إلى 4 بحسب ورودها في كتاب المنهاج.
            </p>
          </div>

          <button
            onClick={() => handlePlayAudio('Number 1: pencil cases. Number 2: posters. Number 3: rulers. Number 4: notebooks.')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>تشغيل التسجيل الصوتي</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'pencil cases', nameEn: 'pencil cases', nameAr: 'مقلمات أقلام', icon: '👝', hint: 'الرقم 1' },
            { key: 'posters', nameEn: 'posters', nameAr: 'ملصقات حائطية', icon: '🖼️', hint: 'الرقم 2' },
            { key: 'rulers', nameEn: 'rulers', nameAr: 'مساطر ملونة', icon: '📏', hint: 'الرقم 3' },
            { key: 'notebooks', nameEn: 'notebooks', nameAr: 'دفاتر ملاحظات', icon: '📓', hint: 'الرقم 4' },
          ].map((item) => (
            <div
              key={item.key}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-3"
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <div className="font-english font-bold text-white text-base">{item.nameEn}</div>
                <div className="text-xs text-slate-400">{item.nameAr}</div>
              </div>

              <div className="flex items-center gap-2 w-full pt-1">
                <span className="text-xs text-slate-400 font-bold">الرقم:</span>
                <select
                  value={numbers[item.key]}
                  onChange={(e) => setNumbers({ ...numbers, [item.key]: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-bold text-center text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="">اختر</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCheckNumbers}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer"
          >
            تأكيد التحقق من الترقيم
          </button>

          {numberCheckResult !== null && (
            <div className={`px-4 py-2 rounded-xl text-xs font-bold ${
              numberCheckResult 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {numberCheckResult 
                ? '✓ إجاباتك مطابقة لكتاب المنهاج تماماً: 1- pencil cases, 2- posters, 3- rulers, 4- notebooks!' 
                : '✗ راجع الترقيم: 1 للمقلمات، 2 للملصقات، 3 للمساطر، و4 للدفاتر.'}
            </div>
          )}
        </div>
      </div>

      {/* Exercise 2: Listen and Tick (✓) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-bold text-amber-400">التدريب الثاني: ورقة العمل 3</div>
          <h3 className="text-lg font-black font-english text-white">
            5. Listen and tick (✓)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            استمع للجملة الصوتية وضع إشارة صح (✓) أمام الصورة المطابقة لمعنى الكلام المنطوق.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tickQuestions.map((q) => (
            <div key={q.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">السؤال رقم {q.id}</span>
                <button
                  onClick={() => handlePlayAudio(q.audio)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {q.options.map((opt) => {
                  const isSelected = selectedTicks[q.id] === opt.id;
                  const isCorrect = opt.isCorrect;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectTick(q.id, opt.id, !!isCorrect)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-600/20 border-emerald-400 text-emerald-300'
                            : 'bg-rose-600/20 border-rose-400 text-rose-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <span className="font-english text-xs font-bold">{opt.label}</span>
                      {isSelected && (
                        <span className="text-xs font-bold">
                          {isCorrect ? '✓ صحيح' : '✗ غير مطابق'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise 3: Phonics letter 'B / b' */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-amber-400">التدريب الثالث: الصوتيات (Phonics)</div>
            <h3 className="text-lg font-black font-english text-white">
              Identify words with the sound /b/
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اضغط لتحديد جميع الصور والكلمات التي تحتوي على صوت حرف B (مثل bird, rubber, butterfly, box).
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black font-english text-2xl flex items-center justify-center shadow-md">
            b
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {phonicsWords.map((item) => {
            const isSelected = selectedPhonics.includes(item.word);
            return (
              <button
                key={item.word}
                onClick={() => {
                  togglePhonicsSelection(item.word);
                  handlePlayAudio(item.word);
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="font-english font-bold text-sm">{item.word}</span>
                <span className="text-[11px] text-slate-400">{item.label}</span>
                {isSelected && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                    محدد
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCheckPhonics}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            فحص إجابة الصوتيات
          </button>

          {phonicsTested && (
            <div className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-200">
              الكلمات الصحيحة التي تحتوي على حرف B وصوته: bird (طائر), butterfly (فراشة), box (صندوق), rubber (ممحاة).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
