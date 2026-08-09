import React, { useState } from 'react';
import { GameLevel, CEFRLevel, TidyObject } from '../types';
import { ObjectIcon } from './ObjectIcon';
import { speakEnglish } from '../services/speechSynthesis';
import { BookOpen, Search, Volume2, X, Sparkles } from 'lucide-react';

interface VocabDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: GameLevel[];
}

export const VocabDictionaryModal: React.FC<VocabDictionaryModalProps> = ({
  isOpen,
  onClose,
  levels,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');

  if (!isOpen) return null;

  // Flatten all unique vocabulary items across all levels
  const allObjects: { obj: TidyObject; levelTitle: string; cefr: CEFRLevel }[] = [];
  const seenIds = new Set<string>();

  levels.forEach((lvl) => {
    lvl.objects.forEach((o) => {
      if (!seenIds.has(o.id)) {
        seenIds.add(o.id);
        allObjects.push({ obj: o, levelTitle: lvl.title, cefr: lvl.cefrLevel });
      }
    });
  });

  const filteredObjects = allObjects.filter(({ obj, cefr }) => {
    const matchesSearch =
      obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.spatialInstruction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCefr = selectedCefr === 'ALL' || cefr === selectedCefr;
    return matchesSearch && matchesCefr;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Từ Điển Tiếng Anh Không Gian</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Tổng hợp từ vựng, phiên âm IPA & câu lệnh vị trí đồ vật ({filteredObjects.length} từ)
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo từ tiếng Anh, tiếng Việt, vị trí..."
              className="w-full bg-slate-800 text-slate-100 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs w-full sm:w-auto">
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedCefr(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedCefr === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Vocabulary Grid List */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredObjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Không tìm thấy từ vựng khớp với tìm kiếm.
            </div>
          ) : (
            filteredObjects.map(({ obj, levelTitle, cefr }) => (
              <div
                key={`dict-${obj.id}`}
                className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${obj.color} flex items-center justify-center text-white shrink-0 mt-0.5`}
                  >
                    <ObjectIcon name={obj.iconName} className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{obj.name}</span>
                      <span className="text-xs font-mono text-amber-300">{obj.ipa}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {cefr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Nghĩa: <span className="text-emerald-300">{obj.vietnamese}</span>
                    </p>
                    <p className="text-xs text-slate-400 italic">
                      📍 "{obj.spatialInstruction}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => speakEnglish(`${obj.name}. ${obj.spatialInstruction}`)}
                  className="p-2.5 rounded-xl bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all shrink-0"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
