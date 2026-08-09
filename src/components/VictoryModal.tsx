import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameLevel, LevelStats } from '../types';
import { ObjectIcon } from './ObjectIcon';
import { speakEnglish } from '../services/speechSynthesis';
import { Trophy, Star, Sparkles, Volume2, ArrowRight, RotateCcw, Camera } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  level: GameLevel;
  stats: LevelStats;
  onReplay: () => void;
  onNextLevel: () => void;
  onOpenScanner: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  level,
  stats,
  onReplay,
  onNextLevel,
  onOpenScanner,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8 animate-scaleUp">
        {/* Header Banner */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 shadow-xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-white animate-bounce" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            🎉 Hoàn Thành Dọn Dẹp! (Tidy Up Victory!)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Bạn đã sắp xếp toàn bộ đồ vật vào đúng vị trí và học thêm các câu lệnh tiếng Anh không gian!
          </p>

          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-8 h-8 ${
                  starIndex <= stats.stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md scale-110'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Level Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 text-center">
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold">Tổng Điểm XP</span>
            <span className="text-lg font-extrabold text-amber-400">+{stats.score}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold">Thời Gian</span>
            <span className="text-lg font-extrabold text-indigo-300">{stats.timeSeconds}s</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold">Trình Độ</span>
            <span className="text-lg font-extrabold text-emerald-400">CEFR {level.cefrLevel}</span>
          </div>
        </div>

        {/* Vocabulary Mastery Review Table */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Từ Vựng & Câu Lệnh Không Gian Đã Học:</span>
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {level.objects.map((obj) => (
              <div
                key={`mastery-${obj.id}`}
                className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${obj.color} flex items-center justify-center text-white shrink-0`}
                  >
                    <ObjectIcon name={obj.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white">{obj.name}</span>
                      <span className="text-[11px] font-mono text-amber-300">{obj.ipa}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">"{obj.spatialInstruction}"</p>
                  </div>
                </div>

                <button
                  onClick={() => speakEnglish(`${obj.name}. ${obj.spatialInstruction}`)}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 hover:text-amber-300 transition-colors shrink-0"
                  title="Nghe lại phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onReplay}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>AI Scan Ảnh</span>
          </button>

          <button
            onClick={onNextLevel}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>Phòng Tiếp Theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
