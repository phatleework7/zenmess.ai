import React from 'react';
import { TidyObject } from '../types';
import { PhysicalItemGraphic } from './PhysicalItemGraphic';
import { speakEnglish } from '../services/speechSynthesis';
import { soundFx } from '../services/soundEffects';
import { CheckCircle2, Volume2, Lightbulb, Sparkles } from 'lucide-react';

interface VocabSidebarProps {
  objects: TidyObject[];
  selectedObjectId: string | null;
  onSelectObject: (objectId: string | null) => void;
  onTriggerHintForId: (objectId: string) => void;
  activeHintId: string | null;
}

export const VocabSidebar: React.FC<VocabSidebarProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onTriggerHintForId,
  activeHintId,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Danh Sách Đồ Vật (Object List)</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {objects.filter((o) => o.tidied).length}/{objects.length} hoàn thành
        </span>
      </div>

      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {objects.map((obj) => {
          const isSelected = selectedObjectId === obj.id;
          const isHinted = activeHintId === obj.id;

          return (
            <div
              key={`sidebar-${obj.id}`}
              onClick={() => {
                if (!obj.tidied) {
                  onSelectObject(isSelected ? null : obj.id);
                  speakEnglish(obj.name);
                }
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                obj.tidied
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300 opacity-85'
                  : isSelected || isHinted
                  ? 'bg-indigo-950/80 border-indigo-500/90 ring-2 ring-indigo-500/50 text-white shadow-lg'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-200'
              }`}
            >
              {/* Header line: Mini Physical Graphic, Name, Checkmark, Audio */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Physical Item Mini Rendering */}
                  <div className="shrink-0 p-1 bg-slate-950/60 rounded-xl border border-slate-700/60 flex items-center justify-center">
                    <PhysicalItemGraphic
                      iconName={obj.iconName}
                      name={obj.name}
                      color={obj.color}
                      size="sm"
                      croppedImageDataUrl={obj.croppedImageDataUrl}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      {obj.name}
                      {obj.tidied && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-amber-300">{obj.ipa}</span>
                      <span className="text-slate-400">• {obj.vietnamese}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Speak button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglish(`${obj.name}. ${obj.spatialInstruction}`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-amber-300 transition-colors"
                    title="Nghe tên & vị trí"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hint button for single item */}
                  {!obj.tidied && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playHint();
                        onTriggerHintForId(obj.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isHinted
                          ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                          : 'bg-slate-700/60 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300'
                      }`}
                      title="Gợi ý vị trí không gian"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Spatial instruction sentence (Hidden until hint clicked or object tidied) */}
              {obj.tidied || isHinted ? (
                <div className="mt-2 text-xs bg-amber-950/40 border border-amber-500/40 p-2 rounded-xl text-amber-200 leading-relaxed font-sans flex items-start gap-1.5 animate-fadeIn">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-400 font-bold mr-1">📍 Gợi ý vị trí:</span>
                    "{obj.spatialInstruction}"
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playHint();
                    onTriggerHintForId(obj.id);
                    speakEnglish(obj.spatialInstruction);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-dashed border-slate-700 hover:border-amber-500/50 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bí quá? Bấm để xem câu gợi ý Tiếng Anh</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
