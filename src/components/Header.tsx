import React from 'react';
import { GameLevel, GameMode } from '../types';
import { Sparkles, Volume2, VolumeX, BookOpen, Camera, HelpCircle, Trophy, Flame } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface HeaderProps {
  levels: GameLevel[];
  currentLevel: GameLevel;
  onSelectLevel: (level: GameLevel) => void;
  gameMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenScanner: () => void;
  onOpenDictionary: () => void;
  onOpenHelp: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  totalScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  levels,
  currentLevel,
  onSelectLevel,
  gameMode,
  onSelectMode,
  onOpenScanner,
  onOpenDictionary,
  onOpenHelp,
  isSoundOn,
  onToggleSound,
  totalScore,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent">
                ZenMess AI
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Oops Tidy Up!
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sắp xếp đồ vật & Học Tiếng Anh Không Gian (Spatial English)
            </p>
          </div>
        </div>

        {/* Level Selector & Game Mode */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Level Dropdown */}
          <div className="relative">
            <select
              value={currentLevel.id}
              onChange={(e) => {
                const found = levels.find((l) => l.id === e.target.value);
                if (found) onSelectLevel(found);
              }}
              className="bg-slate-800 text-slate-100 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <optgroup label="Preset Rooms (Màn chơi mẫu)">
                {levels
                  .filter((l) => !l.isCustomPhoto)
                  .map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      [{lvl.cefrLevel}] {lvl.title}
                    </option>
                  ))}
              </optgroup>
              {levels.some((l) => l.isCustomPhoto) && (
                <optgroup label="AI Custom Rooms (Ảnh thực tế)">
                  {levels
                    .filter((l) => l.isCustomPhoto)
                    .map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        ⚡ {lvl.title}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => onSelectMode('zen')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                gameMode === 'zen'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Zen Mode: Relaxed tidying without timer"
            >
              🌿 Zen
            </button>
            <button
              onClick={() => onSelectMode('timer')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                gameMode === 'timer'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Time Attack: 60 seconds tidying challenge"
            >
              ⏱️ 60s
            </button>
          </div>
        </div>

        {/* Action Controls & Total Score */}
        <div className="flex items-center gap-2">
          {/* AI Scanner Button */}
          <button
            onClick={() => {
              soundFx.playHint();
              onOpenScanner();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">Quét Ảnh Thật</span>
            <span className="md:hidden">AI Scan</span>
          </button>

          {/* Dictionary Flashcards */}
          <button
            onClick={onOpenDictionary}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Từ vựng đã học (Dictionary)"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title={isSoundOn ? 'Sound On' : 'Sound Muted'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Help button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Hướng dẫn chơi"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Total Score Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalScore} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
