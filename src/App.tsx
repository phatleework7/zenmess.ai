import React, { useState, useEffect } from 'react';
import { GameLevel, TidyObject, GameMode, LevelStats } from './types';
import { PRESET_LEVELS } from './data/presetLevels';
import { Header } from './components/Header';
import { BackstoryBanner } from './components/BackstoryBanner';
import { RoomCanvas } from './components/RoomCanvas';
import { VocabSidebar } from './components/VocabSidebar';
import { AIPhotoScannerModal } from './components/AIPhotoScannerModal';
import { VictoryModal } from './components/VictoryModal';
import { VocabDictionaryModal } from './components/VocabDictionaryModal';
import { HelpModal } from './components/HelpModal';
import { soundFx } from './services/soundEffects';

export default function App() {
  const [levels, setLevels] = useState<GameLevel[]>(PRESET_LEVELS);
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(PRESET_LEVELS[0]);
  const [objects, setObjects] = useState<TidyObject[]>(PRESET_LEVELS[0].objects);
  const [gameMode, setGameMode] = useState<GameMode>('zen');
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [totalScore, setTotalScore] = useState<number>(0);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Interaction State
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // Level Stats
  const [stats, setStats] = useState<LevelStats>({
    score: 0,
    combos: 1,
    tidiedCount: 0,
    totalCount: PRESET_LEVELS[0].objects.length,
    stars: 3,
    timeSeconds: 0,
    mistakes: 0,
  });

  const [timeLeft, setTimeLeft] = useState<number>(60);

  // Load objects when current level changes
  useEffect(() => {
    setObjects(currentLevel.objects.map((o) => ({ ...o, tidied: false })));
    setStats({
      score: 0,
      combos: 1,
      tidiedCount: 0,
      totalCount: currentLevel.objects.length,
      stars: 3,
      timeSeconds: 0,
      mistakes: 0,
    });
    setTimeLeft(60);
    setSelectedObjectId(null);
    setActiveHintId(null);
    setIsVictoryOpen(false);
  }, [currentLevel]);

  // Timer interval for Time Attack Mode & Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({ ...prev, timeSeconds: prev.timeSeconds + 1 }));

      if (gameMode === 'timer' && !isVictoryOpen) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // End of time attack
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, isVictoryOpen]);

  // Handle successful tidy drop
  const handleTidyObject = (objectId: string) => {
    setObjects((prevObjs) => {
      const nextObjs = prevObjs.map((o) => (o.id === objectId ? { ...o, tidied: true } : o));
      const tidiedCount = nextObjs.filter((o) => o.tidied).length;

      // Calculate score & combo
      const addedScore = 100 * stats.combos;
      const nextScore = stats.score + addedScore;
      const nextTotalScore = totalScore + addedScore;
      setTotalScore(nextTotalScore);

      setStats((prev) => ({
        ...prev,
        score: nextScore,
        combos: prev.combos + 1,
        tidiedCount,
      }));

      // Check level victory condition
      if (tidiedCount === nextObjs.length) {
        // Calculate star rating
        let starRating = 3;
        if (stats.mistakes >= 3 || stats.timeSeconds > 90) starRating = 2;
        if (stats.mistakes >= 5 || stats.timeSeconds > 150) starRating = 1;

        setStats((prev) => ({ ...prev, stars: starRating }));
        setTimeout(() => {
          setIsVictoryOpen(true);
        }, 500);
      }

      return nextObjs;
    });

    if (activeHintId === objectId) {
      setActiveHintId(null);
    }
  };

  // Handle mistake drop
  const handleMistake = (objectId: string) => {
    setStats((prev) => ({
      ...prev,
      combos: 1, // Reset combo on mistake
      mistakes: prev.mistakes + 1,
    }));
  };

  // Trigger hint for specific item or next untidied item
  const handleTriggerHint = () => {
    const untidied = objects.filter((o) => !o.tidied);
    if (untidied.length > 0) {
      const targetObj = untidied[0];
      setActiveHintId(targetObj.id);
      soundFx.playHint();
      setTimeout(() => setActiveHintId(null), 4000);
    }
  };

  const handleTriggerHintForId = (id: string) => {
    setActiveHintId(id);
    setTimeout(() => setActiveHintId(null), 4000);
  };

  // Handle Level Selection
  const handleSelectLevel = (level: GameLevel) => {
    setCurrentLevel(level);
  };

  // Handle New Level from AI Scanner
  const handleLevelGenerated = (newLevel: GameLevel) => {
    setLevels((prev) => [newLevel, ...prev]);
    setCurrentLevel(newLevel);
  };

  // Replay Current Level
  const handleReplay = () => {
    setObjects(currentLevel.objects.map((o) => ({ ...o, tidied: false })));
    setStats({
      score: 0,
      combos: 1,
      tidiedCount: 0,
      totalCount: currentLevel.objects.length,
      stars: 3,
      timeSeconds: 0,
      mistakes: 0,
    });
    setTimeLeft(60);
    setIsVictoryOpen(false);
  };

  // Go to Next Level
  const handleNextLevel = () => {
    const currentIndex = levels.findIndex((l) => l.id === currentLevel.id);
    const nextIndex = (currentIndex + 1) % levels.length;
    setCurrentLevel(levels[nextIndex]);
    setIsVictoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <Header
        levels={levels}
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        gameMode={gameMode}
        onSelectMode={setGameMode}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isSoundOn={isSoundOn}
        onToggleSound={() => setIsSoundOn(soundFx.toggleSound())}
        totalScore={totalScore}
      />

      {/* Backstory & Stats Banner */}
      <BackstoryBanner
        level={currentLevel}
        stats={stats}
        gameMode={gameMode}
        timeLeft={timeLeft}
        onTriggerHint={handleTriggerHint}
        activeHintCount={activeHintId ? 1 : 0}
      />

      {/* Main Game Stage Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Room Canvas (8 cols on desktop) */}
        <div className="lg:col-span-8 w-full">
          <RoomCanvas
            level={currentLevel}
            objects={objects}
            onTidyObject={handleTidyObject}
            onMistake={handleMistake}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            activeHintId={activeHintId}
          />
        </div>

        {/* Vocabulary & Instructions Sidebar (4 cols on desktop) */}
        <div className="lg:col-span-4 w-full">
          <VocabSidebar
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onTriggerHintForId={handleTriggerHintForId}
            activeHintId={activeHintId}
          />
        </div>
      </main>

      {/* Modals */}
      <AIPhotoScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLevelGenerated={handleLevelGenerated}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        level={currentLevel}
        stats={stats}
        onReplay={handleReplay}
        onNextLevel={handleNextLevel}
        onOpenScanner={() => {
          setIsVictoryOpen(false);
          setIsScannerOpen(true);
        }}
      />

      <VocabDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        levels={levels}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
