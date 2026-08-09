import React, { useState, useRef, useEffect } from 'react';
import { GameLevel, TidyObject } from '../types';
import { PhysicalItemGraphic } from './PhysicalItemGraphic';
import { RoomSceneryBackdrop } from './RoomSceneryBackdrop';
import { soundFx } from '../services/soundEffects';
import { speakEnglish } from '../services/speechSynthesis';
import { CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

interface RoomCanvasProps {
  level: GameLevel;
  objects: TidyObject[];
  onTidyObject: (objectId: string) => void;
  onMistake: (objectId: string) => void;
  selectedObjectId: string | null;
  onSelectObject: (objectId: string | null) => void;
  activeHintId: string | null;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  level,
  objects,
  onTidyObject,
  onMistake,
  selectedObjectId,
  onSelectObject,
  activeHintId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [draggingObjId, setDraggingObjId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number } | null>(null);

  // Refs for zero-latency global drag handling
  const draggingObjIdRef = useRef<string | null>(null);
  const dragCurrentPosRef = useRef<{ x: number; y: number } | null>(null);

  // Sparkle particle effects
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const triggerSparkles = (x: number, y: number) => {
    const newSparkles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 30 - 15),
      y: y + (Math.random() * 30 - 15),
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
    }, 850);
  };

  // Convert pixel mouse/touch event to canvas percentage (0-100)
  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 50, y: 50 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 5), 95);
    return { x, y };
  };

  // Start dragging handler
  const startDrag = (obj: TidyObject, clientX: number, clientY: number) => {
    if (obj.tidied) return;
    soundFx.playPickUp();
    onSelectObject(obj.id);

    const pos = getCanvasCoords(clientX, clientY);
    const offset = {
      x: pos.x - obj.initialPos.x,
      y: pos.y - obj.initialPos.y,
    };

    draggingObjIdRef.current = obj.id;
    dragCurrentPosRef.current = pos;

    setDragOffset(offset);
    setDragCurrentPos(pos);
    setDraggingObjId(obj.id);
  };

  const handleMouseDown = (e: React.MouseEvent, obj: TidyObject) => {
    if (obj.tidied) return;
    e.preventDefault();
    startDrag(obj, e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent, obj: TidyObject) => {
    if (obj.tidied || e.touches.length === 0) return;
    const touch = e.touches[0];
    startDrag(obj, touch.clientX, touch.clientY);
  };

  // Global window listeners when dragging to maintain smooth 60fps motion
  useEffect(() => {
    if (!draggingObjId) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
      if (clientX === undefined || clientY === undefined) return;

      const pos = getCanvasCoords(clientX, clientY);
      dragCurrentPosRef.current = pos;
      setDragCurrentPos(pos);
    };

    const handlePointerUp = () => {
      const currentId = draggingObjIdRef.current;
      const currentPos = dragCurrentPosRef.current;

      if (currentId && currentPos) {
        const activeObj = objects.find((o) => o.id === currentId);
        if (activeObj) {
          // Calculate distance between dropped position and target position
          const dx = currentPos.x - activeObj.targetPos.x;
          const dy = currentPos.y - activeObj.targetPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Threshold distance for successful tidy snap (~16%)
          if (distance <= 16) {
            soundFx.playSnapSuccess();
            triggerSparkles(activeObj.targetPos.x, activeObj.targetPos.y);
            speakEnglish(activeObj.name);
            onTidyObject(activeObj.id);
          } else {
            soundFx.playError();
            onMistake(activeObj.id);
          }
        }
      }

      draggingObjIdRef.current = null;
      dragCurrentPosRef.current = null;
      setDraggingObjId(null);
      setDragCurrentPos(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [draggingObjId, objects, onTidyObject, onMistake]);

  // Click-to-place fallback for target zone
  const handleTargetZoneClick = (obj: TidyObject) => {
    if (selectedObjectId === obj.id && !obj.tidied) {
      soundFx.playSnapSuccess();
      triggerSparkles(obj.targetPos.x, obj.targetPos.y);
      speakEnglish(obj.name);
      onTidyObject(obj.id);
      onSelectObject(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 select-none bg-slate-950"
    >
      {/* Realistic Atmospheric Room Backstage */}
      <RoomSceneryBackdrop
        roomType={level.roomType}
        bgStyle={level.bgStyle}
        isCustomPhoto={level.isCustomPhoto}
        photoUrl={level.photoUrl}
      />

      {/* Top Banner Badge: Empty Room Stage Indicator */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-indigo-500/40 px-3 py-1.5 rounded-xl shadow-lg">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold text-slate-100">
          CĂN PHÒNG TRỐNG (Sắp xếp đồ vật từ Khay bên dưới)
        </span>
      </div>

      {/* Bottom Unsorted Inventory Tray (Khay Đồ Vật Bừa Bộn Đã Tách Bằng AI) */}
      <div className="absolute bottom-0 inset-x-0 h-[22%] z-10 bg-slate-950/90 backdrop-blur-lg border-t-2 border-indigo-500/50 rounded-b-3xl p-2 flex flex-col justify-between shadow-2xl">
        <div className="flex items-center justify-between px-3 text-[11px] font-bold text-amber-300 tracking-wider">
          <span className="flex items-center gap-1.5">
            <span>📦 KHAY ĐỒ VẬT ĐÃ TÁCH TỪ ẢNH</span>
            <span className="text-slate-400 font-normal">
              ({objects.filter((o) => !o.tidied).length} món chưa xếp)
            </span>
          </span>
          <span className="text-slate-400 font-sans text-[10px] hidden sm:inline">
            💡 Kéo/chạm đồ vật ở đây & chọn ô mục tiêu tương ứng trên phòng
          </span>
        </div>
      </div>

      {/* Target Drop Zones (Invisible click targets until hint is triggered) */}
      {objects.map((obj) => {
        const isHinted = activeHintId === obj.id;

        return (
          <div
            key={`target-${obj.id}`}
            onClick={() => handleTargetZoneClick(obj)}
            style={{
              left: `${obj.targetPos.x}%`,
              top: `${obj.targetPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-10 transition-all duration-300 cursor-pointer ${
              obj.tidied
                ? 'pointer-events-none opacity-90'
                : isHinted
                ? 'scale-110 z-30'
                : ''
            }`}
          >
            {/* Target Furniture Spot Graphic (Only visible when hinted) */}
            {isHinted && !obj.tidied && (
              <div className="relative w-14 h-14 bg-amber-500/40 border-2 border-amber-300 rounded-full shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/50 animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-md animate-ping" />
              </div>
            )}

            {/* Invisible touch/click zone when untidied and not hinted */}
            {!isHinted && !obj.tidied && (
              <div className="w-12 h-12 bg-transparent border-none rounded-full" />
            )}

            {/* Hint Connecting Pulse & English Hint Bubble (ONLY WHEN USER EXPLICITLY CLICKS FOR HINT) */}
            {isHinted && !obj.tidied && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-4 border-amber-400 rounded-full animate-ping pointer-events-none" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-2xl z-50 animate-bounce border border-amber-200">
                  💡 "{obj.spatialInstruction}"
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Draggable Physical Graphic Items */}
      {objects.map((obj) => {
        const isBeingDragged = draggingObjId === obj.id;
        const isSelected = selectedObjectId === obj.id;

        let pos = obj.initialPos;
        if (obj.tidied) {
          pos = obj.targetPos;
        } else if (isBeingDragged && dragCurrentPos) {
          pos = {
            x: dragCurrentPos.x - dragOffset.x,
            y: dragCurrentPos.y - dragOffset.y,
          };
        }

        return (
          <div
            key={`obj-${obj.id}`}
            onMouseDown={(e) => handleMouseDown(e, obj)}
            onTouchStart={(e) => handleTouchStart(e, obj)}
            onClick={() => {
              if (!obj.tidied && !isBeingDragged) {
                onSelectObject(obj.id);
                speakEnglish(obj.name);
              }
            }}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              willChange: isBeingDragged ? 'left, top' : 'auto',
            }}
            className={`absolute z-20 cursor-grab active:cursor-grabbing touch-none select-none flex flex-col items-center ${
              isBeingDragged
                ? 'transition-none scale-125 z-40 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]'
                : obj.tidied
                ? 'transition-all duration-300 pointer-events-auto cursor-default scale-90 opacity-90'
                : isSelected
                ? 'transition-all duration-300 scale-115 z-30 filter drop-shadow-[0_10px_15px_rgba(245,158,11,0.7)]'
                : 'transition-all duration-300 hover:scale-110 drop-shadow-md'
            }`}
          >
            {/* Real Physical Visual Graphic Item */}
            <div className="relative group flex flex-col items-center">
              {/* Floor Shadow Under Physical Item */}
              <div className="absolute -bottom-2 w-12 h-3 bg-black/60 rounded-full blur-xs transform scale-x-125" />

              {/* Physical Artwork Graphic */}
              <div className="p-1 flex items-center justify-center bg-transparent border-none">
                <PhysicalItemGraphic
                  iconName={obj.iconName}
                  name={obj.name}
                  color={obj.color}
                  size={obj.tidied ? 'sm' : 'md'}
                  croppedImageDataUrl={obj.croppedImageDataUrl}
                />
              </div>

              {/* Floating English & IPA Name Pill (Hover/Selected) */}
              <div
                className={`mt-1 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border shadow-lg transition-all ${
                  obj.tidied
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                    : isSelected || isBeingDragged
                    ? 'bg-amber-400 text-slate-950 font-black border-amber-300 ring-2 ring-amber-300'
                    : 'bg-slate-900/90 text-slate-100 border-slate-700 hover:border-indigo-400'
                }`}
              >
                <span>{obj.name}</span>
                {obj.tidied && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakEnglish(obj.name);
                  }}
                  className="p-0.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-amber-300"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>

              {/* Vietnamese Meaning Subtitle for Learners */}
              {(isSelected || isBeingDragged) && (
                <span className="text-[10px] bg-slate-950/90 text-emerald-300 font-semibold px-2 py-0.5 rounded-md mt-0.5 border border-slate-800 shadow-md">
                  {obj.vietnamese} ({obj.ipa})
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Sparkles particle overlay */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
          }}
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
        >
          <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300 filter drop-shadow-[0_0_8px_#f59e0b]" />
        </div>
      ))}
    </div>
  );
};
