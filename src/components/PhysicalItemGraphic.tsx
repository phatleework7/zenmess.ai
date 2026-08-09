import React from 'react';

interface PhysicalItemGraphicProps {
  iconName: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  croppedImageDataUrl?: string;
}

export const PhysicalItemGraphic: React.FC<PhysicalItemGraphicProps> = ({
  iconName,
  name,
  color,
  size = 'md',
  croppedImageDataUrl,
}) => {
  const dimensionClass =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14 sm:w-16 sm:h-16';

  if (croppedImageDataUrl) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-lg group p-0.5`}>
        <img
          src={croppedImageDataUrl}
          alt={name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  // Render distinct physical SVG items based on object name/iconName
  const keyName = name.toLowerCase();

  if (keyName.includes('coffee') || keyName.includes('mug')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Steam animation */}
        <div className="absolute -top-3 flex gap-1 pointer-events-none opacity-80 animate-pulse">
          <div className="w-1 h-3 bg-white/60 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '1.2s' }} />
          <div className="w-1 h-4 bg-white/70 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '1.6s' }} />
        </div>
        {/* Mug Body */}
        <div className="relative w-12 h-11 sm:w-14 sm:h-12 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 rounded-b-2xl rounded-t-sm shadow-inner border border-amber-500/40 flex items-center justify-center">
          {/* Coffee Surface */}
          <div className="absolute top-0.5 w-10 sm:w-12 h-2.5 bg-amber-950 rounded-full border border-amber-800/80 overflow-hidden">
            <div className="w-3 h-1 bg-amber-800/60 rounded-full ml-1 mt-0.5" />
          </div>
          {/* Mug Handle */}
          <div className="absolute -right-2.5 top-2 w-3.5 h-6 border-3 border-amber-600 rounded-r-full" />
          {/* Logo print */}
          <span className="text-[10px] font-extrabold text-amber-200/60 font-mono tracking-tighter">JAVA</span>
        </div>
      </div>
    );
  }

  if (keyName.includes('controller') || keyName.includes('game')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Controller Body */}
        <div className="w-14 h-10 sm:w-16 sm:h-11 bg-gradient-to-b from-purple-800 via-indigo-900 to-slate-950 rounded-2xl border border-purple-500/50 shadow-xl flex items-center justify-between px-2 relative">
          {/* D-Pad */}
          <div className="w-3.5 h-3.5 relative flex items-center justify-center">
            <div className="absolute w-3.5 h-1 bg-slate-400 rounded-xs" />
            <div className="absolute w-1 h-3.5 bg-slate-400 rounded-xs" />
          </div>
          {/* LED Bar */}
          <div className="w-4 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee] animate-pulse" />
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          </div>
        </div>
      </div>
    );
  }

  if (keyName.includes('headphone')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Headphones Arc */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <div className="w-12 h-10 sm:w-14 sm:h-12 border-4 border-indigo-600 border-b-0 rounded-t-full relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-6 h-2 bg-slate-800 rounded-full border border-slate-600" />
          </div>
          {/* Ear Cups */}
          <div className="absolute bottom-1 left-0 w-4 h-6 bg-slate-900 border-2 border-indigo-400 rounded-xl shadow-md" />
          <div className="absolute bottom-1 right-0 w-4 h-6 bg-slate-900 border-2 border-indigo-400 rounded-xl shadow-md" />
        </div>
      </div>
    );
  }

  if (keyName.includes('sticky') || keyName.includes('note')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Sticky Note Stack */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 bg-amber-300 rounded-xs shadow-md border border-amber-400/80 transform rotate-[-3deg] relative p-1">
          <div className="w-full h-full border-b border-dashed border-amber-500/40 flex flex-col justify-between">
            <div className="w-3/4 h-1 bg-amber-600/40 rounded-full" />
            <div className="w-1/2 h-1 bg-amber-600/40 rounded-full" />
            <div className="w-2/3 h-1 bg-amber-600/40 rounded-full" />
          </div>
          {/* Curled corner */}
          <div className="absolute bottom-0 right-0 border-t-8 border-l-8 border-t-amber-400 border-l-amber-200 shadow-xs" />
        </div>
      </div>
    );
  }

  if (keyName.includes('pen') || keyName.includes('fountain')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Pen */}
        <div className="w-14 h-3 sm:w-16 sm:h-3.5 bg-gradient-to-r from-blue-900 via-blue-600 to-amber-400 rounded-full shadow-md transform rotate-[-35deg] relative border border-blue-400/50 flex items-center">
          {/* Clip */}
          <div className="absolute left-2 w-4 h-1 bg-amber-300 rounded-full" />
          {/* Nib */}
          <div className="absolute -left-2 w-2.5 h-2.5 bg-amber-300 clip-path-triangle rotate-90" />
        </div>
      </div>
    );
  }

  if (keyName.includes('water') || keyName.includes('bottle')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Water Flask Body */}
        <div className="w-8 h-13 sm:w-9 sm:h-15 bg-gradient-to-b from-cyan-400 via-teal-600 to-slate-900 rounded-xl border border-cyan-300/60 shadow-lg relative flex flex-col items-center">
          {/* Cap */}
          <div className="w-5 h-2.5 bg-slate-800 rounded-t-md border-b border-slate-600" />
          {/* Level Window */}
          <div className="w-2 h-7 bg-cyan-200/40 rounded-full mt-2" />
        </div>
      </div>
    );
  }

  if (keyName.includes('soda') || keyName.includes('can')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Soda Can */}
        <div className="w-8 h-12 sm:w-9 sm:h-14 bg-gradient-to-r from-red-600 via-orange-500 to-red-800 rounded-lg border border-red-400/80 shadow-md relative flex flex-col items-center justify-between py-1">
          {/* Silver Rim Top */}
          <div className="w-7 h-1.5 bg-slate-300 rounded-t-sm" />
          <span className="text-[9px] font-black text-white font-sans tracking-widest rotate-[-90deg]">FIZZ</span>
          {/* Silver Rim Bottom */}
          <div className="w-7 h-1.5 bg-slate-300 rounded-b-sm" />
        </div>
      </div>
    );
  }

  if (keyName.includes('novel') || keyName.includes('book') || keyName.includes('sketchbook')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Book Cover */}
        <div className="w-11 h-14 sm:w-13 sm:h-16 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-950 rounded-r-lg border-l-4 border-l-amber-500 shadow-xl relative p-1.5 flex flex-col justify-between">
          <div className="w-full h-1 bg-amber-400/60 rounded-full" />
          <div className="w-8 h-8 rounded-full border border-emerald-400/50 flex items-center justify-center mx-auto">
            <span className="text-[9px] font-bold text-amber-300">📖</span>
          </div>
          <div className="w-full h-1 bg-emerald-400/40 rounded-full" />
        </div>
      </div>
    );
  }

  if (keyName.includes('glasses') || keyName.includes('sunglasses')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Sunglasses */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-5 bg-gradient-to-b from-slate-900 to-amber-950 rounded-b-xl border-2 border-amber-500 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 transform rotate-45" />
          </div>
          <div className="w-2 h-0.5 bg-amber-500" />
          <div className="w-6 h-5 bg-gradient-to-b from-slate-900 to-amber-950 rounded-b-xl border-2 border-amber-500 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 transform rotate-45" />
          </div>
        </div>
      </div>
    );
  }

  if (keyName.includes('clock')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Alarm Clock */}
        <div className="w-12 h-10 sm:w-14 sm:h-11 bg-slate-900 rounded-xl border-2 border-cyan-500 shadow-lg flex items-center justify-center relative shadow-cyan-500/20">
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider animate-pulse">07:30</span>
          {/* Top buttons */}
          <div className="absolute -top-1.5 left-2 w-3 h-1 bg-cyan-500 rounded-t-sm" />
          <div className="absolute -top-1.5 right-2 w-3 h-1 bg-cyan-500 rounded-t-sm" />
        </div>
      </div>
    );
  }

  if (keyName.includes('paintbrush') || keyName.includes('palette')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Paintbrushes Bundle */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-1.5 h-12 bg-amber-700 rounded-full transform rotate-[-15deg] shadow-sm relative">
            <div className="absolute top-0 w-1.5 h-3 bg-rose-500 rounded-t-full" />
          </div>
          <div className="w-1.5 h-12 bg-amber-800 rounded-full transform rotate-[10deg] shadow-sm relative -ml-1">
            <div className="absolute top-0 w-1.5 h-3 bg-sky-400 rounded-t-full" />
          </div>
        </div>
      </div>
    );
  }

  if (keyName.includes('scissors')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Craft Scissors */}
        <div className="relative w-12 h-10 flex items-center justify-center">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full transform rotate-[-20deg] absolute shadow-sm" />
          <div className="w-10 h-1.5 bg-slate-300 rounded-full transform rotate-[20deg] absolute shadow-sm" />
          <div className="w-4 h-4 rounded-full border-2 border-sky-500 absolute -left-1 -top-1" />
          <div className="w-4 h-4 rounded-full border-2 border-sky-500 absolute -left-1 -bottom-1" />
        </div>
      </div>
    );
  }

  if (keyName.includes('lamp')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Desk Lamp */}
        <div className="relative w-12 h-14 flex flex-col items-center">
          {/* Lamp Shade with Glow */}
          <div className="w-10 h-6 bg-gradient-to-b from-amber-400 to-yellow-600 rounded-t-full border border-amber-300 shadow-[0_0_12px_#f59e0b]" />
          {/* Flex Arm */}
          <div className="w-1.5 h-6 bg-slate-600 rounded-full" />
          {/* Clamp Base */}
          <div className="w-8 h-2 bg-slate-800 rounded-sm border border-slate-600" />
        </div>
      </div>
    );
  }

  if (keyName.includes('spoon') || keyName.includes('utensils')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Wooden Spoon */}
        <div className="w-3 h-14 sm:w-3.5 sm:h-16 bg-gradient-to-b from-amber-700 via-amber-800 to-yellow-900 rounded-full shadow-md transform rotate-[-25deg] relative border border-amber-600/60 flex flex-col items-center">
          {/* Oval Bowl top */}
          <div className="w-6 h-6 bg-amber-700 rounded-full border border-amber-600 -mt-1 shadow-inner" />
        </div>
      </div>
    );
  }

  if (keyName.includes('jar') || keyName.includes('spice')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Glass Spice Jar */}
        <div className="w-8 h-12 sm:w-9 sm:h-14 bg-amber-900/40 border-2 border-amber-500/60 rounded-xl shadow-md relative flex flex-col items-center justify-between p-1 backdrop-blur-xs">
          {/* Cork Stopper */}
          <div className="w-5 h-2 bg-amber-700 rounded-t-md border-b border-amber-800 -mt-2" />
          <span className="text-[9px] font-bold text-amber-300">CINNAMON</span>
          <div className="w-full h-4 bg-amber-700/80 rounded-b-md" />
        </div>
      </div>
    );
  }

  if (keyName.includes('hat') || keyName.includes('chef')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* White Chef Toque */}
        <div className="relative w-12 h-12 flex flex-col items-center">
          <div className="w-12 h-8 bg-slate-100 rounded-t-2xl border border-slate-300 shadow-md flex justify-around px-1 pt-1">
            <div className="w-2 h-full bg-slate-200/60 rounded-t-full" />
            <div className="w-2 h-full bg-slate-200/60 rounded-t-full" />
            <div className="w-2 h-full bg-slate-200/60 rounded-t-full" />
          </div>
          <div className="w-10 h-3 bg-slate-200 rounded-b-sm border border-slate-300" />
        </div>
      </div>
    );
  }

  if (keyName.includes('measuring') || keyName.includes('cup')) {
    return (
      <div className={`relative ${dimensionClass} flex items-center justify-center filter drop-shadow-md`}>
        {/* Graduated Measuring Cup */}
        <div className="w-10 h-11 sm:w-11 sm:h-12 bg-cyan-950/30 border-2 border-cyan-400/70 rounded-b-xl shadow-md relative flex items-center justify-between p-1">
          {/* Graduation Lines */}
          <div className="flex flex-col gap-1">
            <div className="w-2 h-0.5 bg-rose-400" />
            <div className="w-1.5 h-0.5 bg-rose-400" />
            <div className="w-2 h-0.5 bg-rose-400" />
          </div>
          {/* Liquid level */}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-cyan-500/40 rounded-b-lg border-t border-cyan-300" />
          {/* Handle */}
          <div className="absolute -right-2 top-2 w-2.5 h-6 border-2 border-cyan-400 rounded-r-lg" />
        </div>
      </div>
    );
  }

  // Fallback visual item graphic
  return (
    <div
      className={`relative ${dimensionClass} rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-xl border-2 border-white/20`}
    >
      <span className="text-xl font-bold">✨</span>
    </div>
  );
};
