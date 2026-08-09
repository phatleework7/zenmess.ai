import React from 'react';
import { GameLevel, LevelStats, GameMode } from '../types';
import { Sparkles, Lightbulb, CheckCircle2, Flame, Timer, Volume2 } from 'lucide-react';
import { speakEnglish } from '../services/speechSynthesis';

interface BackstoryBannerProps {
  level: GameLevel;
  stats: LevelStats;
  gameMode: GameMode;
  timeLeft: number;
  onTriggerHint: () => void;
  activeHintCount: number;
}

export const BackstoryBanner: React.FC<BackstoryBannerProps> = ({
  level,
  stats,
  gameMode,
  timeLeft,
  onTriggerHint,
  activeHintCount,
}) => {
  const cefrColors = {
    A1: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    A2: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    B1: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    B2: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    C1: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  const progressPercent = Math.round((stats.tidiedCount / stats.totalCount) * 100);

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-slate-100 px-4 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Backstory & CEFR badge */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                cefrColors[level.cefrLevel] || cefrColors.A2
              }`}
            >
              CEFR {level.cefrLevel}
            </span>
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>{level.title}</span>
              <span className="text-slate-400 font-normal">({level.roomType})</span>
            </h2>
            <button
              onClick={() => speakEnglish(level.backstory)}
              className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
              title="Nghe đọc cốt truyện (Read Backstory)"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed font-sans">
            "{level.backstory}"
          </p>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
          {/* Progress Bar */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Đã dọn:</span>
              <span className="text-emerald-400 font-bold">
                {stats.tidiedCount}/{stats.totalCount}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Combo & Score */}
          <div className="flex items-center gap-2">
            {stats.combos > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold animate-bounce">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{stats.combos}x Combo!</span>
              </div>
            )}

            {gameMode === 'timer' && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  timeLeft <= 10
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Hint Trigger */}
          <button
            onClick={onTriggerHint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-medium transition-all active:scale-95"
            title="Gợi ý vị trí không gian (Highlight target zone)"
          >
            <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Gợi Ý Vị Trí</span>
          </button>
        </div>
      </div>
    </div>
  );
};
