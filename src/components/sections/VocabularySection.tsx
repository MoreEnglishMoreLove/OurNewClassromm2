import React, { useState } from 'react';
import { 
  Volume2, 
  Search, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Check, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { VOCABULARY_LIST } from '../../data/curriculumData';
import { VocabularyWord } from '../../types';
import { speakEnglish, playClickSound, playSuccessSound } from '../../utils/audio';

export const VocabularySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع الكلمات (All Words)' },
    { id: 'classroom', label: 'أدوات الصف الدراسي (Classroom)' },
    { id: 'preposition', label: 'حروف الجر المكانية (Prepositions)' },
    { id: 'phonics_b', label: 'صوتيات حرف B (Phonics)' },
  ];

  const filteredWords = VOCABULARY_LIST.filter(word => {
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const matchesSearch = 
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.arabic.includes(searchTerm) ||
      word.exampleEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (word: VocabularyWord) => {
    playClickSound();
    setSpeakingWordId(word.id);
    speakEnglish(word.english, () => {
      setSpeakingWordId(null);
    });
  };

  const handleSpeakExample = (exampleText: string) => {
    playClickSound();
    speakEnglish(exampleText);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بنك الكلمات والمفردات المصورة والناطقة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              مفردات المنهاج المعتمدة (Curriculum Vocabulary)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              اضغط على أي كلمة للاستماع لنطقها بالإنجليزية الفصحى بوضوح، واطلع على أمثلة استخدامها وجملها في المنهاج.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن كلمة إنجليزية أو عربية..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => {
          const isSpeaking = speakingWordId === word.id;
          return (
            <div
              key={word.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition group hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="space-y-3">
                {/* Top: Word & Audio Button */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black font-english text-white tracking-wide group-hover:text-blue-400 transition">
                      {word.english}
                    </h3>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">
                      {word.arabic}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSpeak(word)}
                    className={`p-3 rounded-xl transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-amber-400 text-slate-950 scale-110'
                        : 'bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white'
                    }`}
                    title="استمع للنطق"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Example sentence */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span>مثال من المنهاج:</span>
                    <button
                      onClick={() => handleSpeakExample(word.exampleEn)}
                      className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>نطق الجملة</span>
                    </button>
                  </div>
                  <p className="text-xs font-english font-semibold text-slate-200">
                    "{word.exampleEn}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {word.exampleAr}
                  </p>
                </div>
              </div>

              {/* Tag / Category */}
              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                  {word.category === 'classroom' ? 'أدوات صفية' : word.category === 'preposition' ? 'حرف جر مكاني' : 'صوتيات'}
                </span>
                <span className="text-slate-400">T. Jaidaa Saqer</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
          لم يتم العثور على كلمات مطابقة لبحثك. جرب كتابة كلمة أخرى.
        </div>
      )}
    </div>
  );
};
