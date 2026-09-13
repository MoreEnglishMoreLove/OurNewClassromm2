import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  PenTool, 
  Eraser, 
  Palette, 
  Volume2,
  Gamepad2,
  Brush
} from 'lucide-react';
import { speakEnglish, playSuccessSound, playWrongSound, playClickSound } from '../../utils/audio';

export const GamesSection: React.FC = () => {
  // Game 1: Guess the Missing Classroom Object (Textbook page 6)
  const missingObjectsRounds = [
    {
      id: 1,
      visible: ['pencil case', 'bag', 'book', 'notebook'],
      missing: 'rulers',
      missingAr: 'مساطر',
      icon: '📏',
      options: ['rulers', 'chair', 'desk'],
      cloudHint: 'أداة خشبية أو بلاستيكية تستخدم للقياس ورسم الخطوط في الصف',
    },
    {
      id: 2,
      visible: ['rulers', 'pencil case', 'notebook'],
      missing: 'bag',
      missingAr: 'حقيبة مدرسية',
      icon: '🎒',
      options: ['bag', 'cat', 'tree'],
      cloudHint: 'نضع فيها الدفاتر والكتب والمقلمة لحملها للمدرسة',
    },
    {
      id: 3,
      visible: ['bag', 'rulers', 'pencil case'],
      missing: 'notebook',
      missingAr: 'دفتر',
      icon: '📓',
      options: ['butterfly', 'notebook', 'dog'],
      cloudHint: 'نكتب فيه الملاحظات والواجبات المدرسية بالقلم',
    },
  ];

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [guessAnswer, setGuessAnswer] = useState<string | null>(null);
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);

  const currentRound = missingObjectsRounds[currentRoundIdx];

  const handleSelectGuess = (opt: string) => {
    setGuessAnswer(opt);
    if (opt === currentRound.missing) {
      setGuessFeedback(`ممتاز! الشيء الناقص في الصف هو: ${currentRound.missing} (${currentRound.missingAr})!`);
      playSuccessSound();
      speakEnglish(currentRound.missing);
    } else {
      setGuessFeedback('حاول ثانية! دقق في أدوات الصف المعروضة وما ينقصها.');
      playWrongSound();
    }
  };

  const handleNextRound = () => {
    playClickSound();
    setGuessAnswer(null);
    setGuessFeedback(null);
    setCurrentRoundIdx((prev) => (prev + 1) % missingObjectsRounds.length);
  };

  // Game 2: Handwriting & Tracing Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#ef4444'); // default red like teacher pen
  const [penWidth, setPenWidth] = useState(4);
  const [activeTemplate, setActiveTemplate] = useState<'B' | 'b' | 'rubber' | 'bird'>('B');

  // Initialize Canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw English 4-line handwriting ruling
    // Line 1 (top line - blue)
    // Line 2 (mid dotted - blue/grey)
    // Line 3 (base line - red)
    // Line 4 (bottom line - blue)
    const height = canvas.height;
    const width = canvas.width;
    const lineSpacing = height / 5;

    ctx.lineWidth = 1.5;

    // Line 1
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(20, lineSpacing);
    ctx.lineTo(width - 20, lineSpacing);
    ctx.stroke();

    // Line 2 (Dashed)
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(20, lineSpacing * 2);
    ctx.lineTo(width - 20, lineSpacing * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line 3 (Red baseline)
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, lineSpacing * 3);
    ctx.lineTo(width - 20, lineSpacing * 3);
    ctx.stroke();

    // Line 4 (Bottom blue)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(20, lineSpacing * 4);
    ctx.lineTo(width - 20, lineSpacing * 4);
    ctx.stroke();

    // Draw faded guide text for student to trace
    ctx.font = 'bold 85px "Fredoka", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (activeTemplate === 'B') {
      ctx.fillText('B', width / 2, lineSpacing * 2);
    } else if (activeTemplate === 'b') {
      ctx.fillText('b', width / 2, lineSpacing * 2.2);
    } else if (activeTemplate === 'rubber') {
      ctx.font = 'bold 50px "Fredoka", sans-serif';
      ctx.fillText('rubber', width / 2, lineSpacing * 2.4);
    } else if (activeTemplate === 'bird') {
      ctx.font = 'bold 55px "Fredoka", sans-serif';
      ctx.fillText('bird', width / 2, lineSpacing * 2.4);
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [activeTemplate]);

  // Touch and mouse drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearBoard = () => {
    playClickSound();
    redrawCanvas();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Interactive Games & Handwriting Tracing</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          ألعاب المنهاج وتحديات الكتابة وتتبع الحروف
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          ألعاب تفاعلية مباشرة: لعبة خمن الأداة الناقصة (Guess the missing classroom object)، ولوح الكتابة الرقمي لتتبع حرف B وكتابة كلمات المنهاج على الأسطر الأربعة.
        </p>
      </div>

      {/* Game 1: Guess the missing classroom object */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-amber-400">لعبة الكتاب ص 6:</div>
            <h3 className="text-lg font-black font-english text-white">
              5. Let's play. Guess the missing classroom objects
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              انظر إلى طاولة الصف، ثم خمن ما هي الأداة المفقودة التي تفكر بها المعلمة في سحابة التفكير!
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            الجولة {currentRoundIdx + 1} من {missingObjectsRounds.length}
          </span>
        </div>

        {/* Classroom Desk Scene */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Teacher with thinking cloud */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">👩‍🏫</div>
            <div className="relative p-4 rounded-2xl bg-blue-600/20 border border-blue-400/40 text-blue-200 text-xs font-bold max-w-xs">
              <div className="flex items-center gap-1.5 text-amber-300 mb-1">
                <span>💭 سحابة تفكير المعلمة:</span>
              </div>
              <p>{currentRound.cloudHint}</p>
            </div>
          </div>

          {/* Current Objects on the Desk */}
          <div className="flex-1 w-full text-center">
            <div className="text-xs font-bold text-slate-400 mb-2">
              الأدوات الموجودة حالياً على الطاولة:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {currentRound.visible.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-english font-bold text-xs text-slate-200">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Options to Guess */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300">
            ما هي الأداة الصفية الناقصة؟
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentRound.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectGuess(opt)}
                className={`p-3.5 rounded-xl border text-sm font-bold font-english transition cursor-pointer ${
                  guessAnswer === opt
                    ? opt === currentRound.missing
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {guessFeedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
              guessAnswer === currentRound.missing 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              <span>{guessFeedback}</span>
              {guessAnswer === currentRound.missing && (
                <button
                  onClick={handleNextRound}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  الجولة التالية ←
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game 2: Handwriting Tracing Canvas (ورقة عمل 6 / كتاب ص 12) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-amber-400">تمرين تحسين الخط (Trace then copy):</div>
            <h3 className="text-lg font-black font-english text-white">
              7. Four-Line English Handwriting & Tracing Board
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تتبع شكل الحرف B الكبير والصغير، وانسخ الكلمات باستخدام القلم على الأسطر الأربعة المعتمدة.
            </p>
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['B', 'b', 'rubber', 'bird'] as const).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => {
                  playClickSound();
                  setActiveTemplate(tmpl);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-english transition cursor-pointer ${
                  activeTemplate === tmpl
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Canvas Container */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border-2 border-slate-800 p-2 shadow-inner">
            <canvas
              ref={canvasRef}
              width={650}
              height={260}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-auto cursor-crosshair rounded-xl touch-none bg-slate-950"
            />
          </div>

          {/* Canvas Tools Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-2xl bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">لون القلم:</span>
              {[
                { color: '#ef4444', label: 'أحمر' },
                { color: '#38bdf8', label: 'أزرق' },
                { color: '#10b981', label: 'أخضر' },
                { color: '#fbbf24', label: 'أصفر' },
                { color: '#ffffff', label: 'أبيض' },
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() => {
                    playClickSound();
                    setPenColor(c.color);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                    penColor === c.color ? 'border-amber-400 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">السماكة:</span>
              {[2, 4, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setPenWidth(w)}
                  className={`px-2 py-1 rounded bg-slate-900 border text-[11px] font-bold cursor-pointer ${
                    penWidth === w ? 'border-blue-400 text-blue-300' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            {/* Clear Button */}
            <button
              onClick={handleClearBoard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح اللوح</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            💡 نصيحة المعلمة جيداء: الحرف الكبير B يشغل الأسطر العلوية الثلاثة، والحرف الصغير b له عصا صاعدة من السطر الأول ودائرة مستقرة بين السطرين الثاني والثالث.
          </div>
        </div>
      </div>
    </div>
  );
};
