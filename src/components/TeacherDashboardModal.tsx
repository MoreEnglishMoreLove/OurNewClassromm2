import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  UserCheck, 
  Copy, 
  Check, 
  Share2, 
  Trash2, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  TEACHER_ADMIN_PIN, 
  TEACHER_NAME, 
  TEACHER_NAME_EN, 
  generateActivationCode, 
  verifyActivationCode,
  saveTeacherCodeToHistory, 
  getTeacherCodesHistory, 
  deleteTeacherCodeFromHistory,
  getTeacherWhatsAppSendCodeUrl 
} from '../utils/cryptoAuth';
import { GeneratedCodeRecord } from '../types';
import { playSuccessSound, playClickSound, playWrongSound } from '../utils/audio';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentCodeSelected?: (studentName: string, code: string) => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  onStudentCodeSelected,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Generation state
  const [studentNameInput, setStudentNameInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeNotes, setCodeNotes] = useState('');

  // History & testing
  const [history, setHistory] = useState<GeneratedCodeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testName, setTestName] = useState('');
  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<{ tested: boolean; valid: boolean } | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setHistory(getTeacherCodesHistory());
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === TEACHER_ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      playSuccessSound();
      setHistory(getTeacherCodesHistory());
    } else {
      setPinError('الرمز السري غير صحيح. يرجى إدخال رمز المعلمة المعتمد.');
      playWrongSound();
    }
  };

  const handleNameChange = (name: string) => {
    setStudentNameInput(name);
    setCopied(false);
    if (name.trim().length >= 2) {
      const code = generateActivationCode(name);
      setGeneratedCode(code);
    } else {
      setGeneratedCode('');
    }
  };

  const handleSaveToHistory = () => {
    if (!studentNameInput.trim() || !generatedCode) return;
    const updated = saveTeacherCodeToHistory(studentNameInput, generatedCode, codeNotes);
    setHistory(updated);
    playSuccessSound();
    setCodeNotes('');
  };

  const handleCopyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    playClickSound();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteTeacherCodeFromHistory(id);
    setHistory(updated);
    playClickSound();
  };

  const handleRunTest = () => {
    if (!testName.trim() || !testCode.trim()) return;
    const isValid = verifyActivationCode(testName, testCode);
    setTestResult({ tested: true, valid: isValid });
    if (isValid) {
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  const filteredHistory = history.filter(item => 
    item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center font-bold text-xl">
              🔑
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                بوابة المعلمة {TEACHER_NAME}
              </h2>
              <p className="text-xs font-semibold text-slate-900/80">
                {TEACHER_NAME_EN} • نظام توليد وإدارة أكواد التفعيل المشفرة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 transition text-slate-950 cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {!isAuthenticated ? (
            /* PIN Protection Form */
            <form onSubmit={handlePinSubmit} className="max-w-md mx-auto py-6 space-y-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  لوحة تحكم آمنة وخاصة بالمعلمة
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  أدخلي الرمز السري الدائم للمعلّمة للوصول إلى أدوات توليد الأكواد وإدارتها.
                </p>
              </div>

              <div className="space-y-2 text-right">
                <label className="text-xs font-bold text-slate-300 block">
                  الرمز السري للمعلّمة (Admin PIN)
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="أدخلي رمز المعلمة..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg tracking-widest font-mono text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-xl hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                تأكيد الدخول للوحة المعلمة
              </button>
            </form>
          ) : (
            /* Main Dashboard */
            <div className="space-y-6">
              {/* Generator Box */}
              <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>توليد كود تفعيل حصري باسم الطالب (خوارزمية رياضية)</span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    صلاحية 6 أشهر (180 يوماً)
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    اسم الطالب الكامل (كما سيكتبه الطالب في جهازه):
                  </label>
                  <input
                    type="text"
                    value={studentNameInput}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="مثال: أحمد محمد العلي أو Sarah Adams"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    💡 الخوارزمية تراعي همزات الأسماء تلقائياً (أ / ا / ة / ه) لضمان تطابق الكود دائماً على هاتف الطالب بدون أخطاء.
                  </p>
                </div>

                {generatedCode ? (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-amber-400/40 space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-slate-400 font-medium">كود التفعيل الحصري للطالب</span>
                      <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-amber-300 select-all py-1">
                        {generatedCode}
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        ✓ صالح لمدة 180 يوماً على جهاز الطالب ويبدأ العد التنازلي فور كتابته
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleCopyCode(generatedCode)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-600 transition cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">تم نسخ الكود!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-amber-400" />
                            <span>نسخ الكود</span>
                          </>
                        )}
                      </button>

                      <a
                        href={getTeacherWhatsAppSendCodeUrl(studentNameInput, generatedCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>إرسال للطالب عبر واتساب</span>
                      </a>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                      <button
                        onClick={handleSaveToHistory}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        حفظ الكود في سجل الطلاب المنشأ
                      </button>
                      {onStudentCodeSelected && (
                        <button
                          onClick={() => {
                            onStudentCodeSelected(studentNameInput, generatedCode);
                            onClose();
                          }}
                          className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                        >
                          تعبئة فورية في شاشة القفل للتجربة ←
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                    اكتبي اسم الطالب أعلاه لظهور كود التفعيل الرياضي فوراً
                  </div>
                )}
              </div>

              {/* Code Verification Tool */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>أداة فحص مطابقة كود التفعيل لطالب:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="اسم الطالب..."
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="الكود (MEML-XXXX-XXXX)..."
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
                <button
                  onClick={handleRunTest}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  فحص الكود رياضياً
                </button>
                {testResult && (
                  <div className={`p-2.5 rounded-lg text-xs font-bold text-center ${
                    testResult.valid 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {testResult.valid ? '✓ الكود صحيح ومطابق تماماً لاسم الطالب!' : '✗ الكود غير مطابق لهذا الاسم، يرجى إعادة التأكد من كتابة الاسم.'}
                  </div>
                )}
              </div>

              {/* History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>سجل الطلاب والأكواد السابقة ({history.length})</span>
                  </h4>
                  {history.length > 0 && (
                    <div className="relative w-44">
                      <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="بحث بالاسم أو الكود..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-8 pl-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px]"
                      />
                    </div>
                  )}
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/30 rounded-xl border border-slate-800">
                    لا يوجد أكواد محفوظة حالياً في هذا المتصفح. يمكنك حفظ الأكواد المنشأة للرجوع إليها في أي وقت.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                      >
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{item.studentName}</div>
                          <div className="font-mono text-amber-300 text-xs tracking-wider">{item.code}</div>
                          <div className="text-[10px] text-slate-500">
                            تاريخ الإنشاء: {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyCode(item.code)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                            title="نسخ الكود"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={getTeacherWhatsAppSendCodeUrl(item.studentName, item.code)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 transition cursor-pointer"
                            title="إرسال عبر واتساب"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            title="حذف من السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>نظام التفعيل الرياضي المشفر © {new Date().getFullYear()}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
