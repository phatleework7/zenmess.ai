import React from 'react';

interface RoomSceneryBackdropProps {
  roomType: string;
  bgStyle?: string;
  isCustomPhoto?: boolean;
  photoUrl?: string;
}

export const RoomSceneryBackdrop: React.FC<RoomSceneryBackdropProps> = ({
  roomType,
  bgStyle = 'desk-wood',
  isCustomPhoto = false,
  photoUrl,
}) => {
  // If user uploaded a custom room photo
  if (isCustomPhoto && photoUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-950">
        <img
          src={photoUrl}
          alt={roomType}
          className="w-full h-full object-cover brightness-95 filter shadow-inner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20" />
      </div>
    );
  }

  const isKitchen = bgStyle === 'kitchen-marble' || roomType.toLowerCase().includes('kitchen');
  const isStudio = bgStyle === 'studio-light' || roomType.toLowerCase().includes('studio') || roomType.toLowerCase().includes('craft');
  const isBedroom = bgStyle === 'bedroom-dark' || roomType.toLowerCase().includes('bedroom') || roomType.toLowerCase().includes('sleep');

  // KITCHEN SCENE (Warm Modern Marble Counter, Backsplash, Wall Shelves, Herbs)
  if (isKitchen) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-amber-950/30">
        {/* Wall Backsplash (Subway Tiles) */}
        <div className="absolute top-0 inset-x-0 h-[48%] bg-stone-900 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:36px_18px]">
          {/* Subtle warm under-cabinet LED bar glow */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-amber-300/20 via-amber-200/5 to-transparent" />
          
          {/* Kitchen Floating Spice & Mug Shelf */}
          <div className="absolute top-6 left-12 right-12 h-4 bg-amber-900 border-b-2 border-amber-950 shadow-md rounded-sm flex items-end justify-between px-8">
            {/* Shelf Bracket Left/Right */}
            <div className="w-2 h-6 -bottom-6 bg-amber-800 rounded-b" />
            <div className="w-2 h-6 -bottom-6 bg-amber-800 rounded-b" />
          </div>

          {/* Wall Hanging Utensil Rail */}
          <div className="absolute top-16 right-16 w-48 h-1.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-md">
            <div className="absolute -bottom-4 left-6 w-1 h-4 bg-slate-400 rounded-b" />
            <div className="absolute -bottom-5 left-16 w-1 h-5 bg-slate-400 rounded-b" />
            <div className="absolute -bottom-4 left-28 w-1 h-4 bg-slate-400 rounded-b" />
          </div>
        </div>

        {/* Marble Countertop Surface */}
        <div className="absolute bottom-0 inset-x-0 h-[52%] bg-gradient-to-b from-stone-200 via-stone-100 to-stone-300 border-t-8 border-amber-700/60 shadow-2xl">
          {/* Marble Veins Effect */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:28px_28px]" />
          
          {/* Pastel Linen Kitchen Runner Mat */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[88%] h-[82%] bg-emerald-950/10 rounded-3xl border-2 border-dashed border-emerald-700/20 shadow-inner flex items-center justify-center">
            <div className="w-full h-full rounded-2xl border border-emerald-600/10" />
          </div>
        </div>

        {/* Warm Ambient Overhead Spotlight Cone */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  // ART & CRAFT STUDIO (Teal Cutting Mat, Wooden Wall Pegboard, Natural Lighting)
  if (isStudio) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-stone-950">
        {/* Wall Layer (Warm Sage/Olive Wall) */}
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-stone-900 via-teal-950/60 to-stone-950">
          {/* Wooden Pegboard Grid */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[75%] h-32 bg-amber-950/80 rounded-2xl border-4 border-amber-900/80 shadow-lg p-3 bg-[radial-gradient(#d97706_2px,transparent_2px)] [background-size:16px_16px]">
            {/* Hanging Scissors / Art Supplies Silhouettes */}
            <div className="flex justify-around items-center h-full px-6 opacity-60">
              <div className="w-6 h-12 border-2 border-amber-400/40 rounded-lg flex flex-col justify-between p-1">
                <div className="w-full h-1 bg-amber-400/50 rounded" />
                <div className="w-2 h-2 rounded-full bg-amber-400/50 mx-auto" />
              </div>
              <div className="w-16 h-8 bg-amber-900/60 border border-amber-700/50 rounded-md" />
              <div className="w-8 h-14 bg-amber-900/60 border border-amber-700/50 rounded-md" />
            </div>
          </div>
        </div>

        {/* Studio Craft Workbench Surface */}
        <div className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-b from-amber-900 via-stone-900 to-slate-950 border-t-8 border-amber-700 shadow-2xl">
          {/* Wood Grain Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#f59e0b_0px,#f59e0b_2px,transparent_2px,transparent_40px)]" />
          
          {/* Professional Teal Cutting Mat Grid */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[86%] h-[84%] bg-teal-950 rounded-2xl border-2 border-teal-500/40 shadow-inner bg-[linear-gradient(to_right,#14b8a620_1px,transparent_1px),linear-gradient(to_bottom,#14b8a620_1px,transparent_1px)] bg-[size:24px_24px]">
            {/* Grid Measurement Markings */}
            <div className="absolute inset-2 border border-teal-500/20 rounded-xl" />
          </div>
        </div>

        {/* Cozy Warm Studio Lamp Rays */}
        <div className="absolute top-0 right-10 w-96 h-[500px] bg-gradient-to-bl from-amber-200/15 via-amber-400/5 to-transparent blur-2xl transform rotate-12" />
      </div>
    );
  }

  // COZY BEDROOM / NIGHT STUDY DESK (Warm Neon/Lamp Ambiance, Polaroids, Window)
  if (isBedroom) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-950">
        {/* Soft Evening Wall Layer */}
        <div className="absolute top-0 inset-x-0 h-[44%] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
          {/* Arch Window with Moon & Stars */}
          <div className="absolute top-4 left-10 w-28 h-36 rounded-t-full border-4 border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden flex flex-col justify-between p-2">
            <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 to-purple-950 flex items-center justify-center">
              {/* Moon */}
              <div className="absolute top-3 right-4 w-6 h-6 rounded-full bg-amber-100 shadow-[0_0_12px_#fef3c7]" />
              {/* Stars */}
              <div className="absolute top-6 left-4 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-12 right-10 w-1 h-1 bg-white rounded-full animate-pulse" />
              {/* Window Frame Crossbars */}
              <div className="absolute inset-0 border-r-2 border-b-2 border-slate-800/80" />
            </div>
          </div>

          {/* Wall Grid Board with Cute Notes & Photos */}
          <div className="absolute top-6 right-12 w-48 h-32 border-2 border-indigo-400/30 rounded-xl bg-slate-900/60 backdrop-blur-xs p-2 grid grid-cols-3 gap-2">
            <div className="w-12 h-10 bg-amber-100/90 rounded border border-amber-300 shadow-sm transform -rotate-3 p-1 text-[7px] text-amber-950 font-bold">♥ COZY</div>
            <div className="w-10 h-12 bg-pink-200/90 rounded border border-pink-300 shadow-sm transform rotate-6 p-1 text-[7px] text-pink-950 font-bold">TIDY UP!</div>
            <div className="w-11 h-11 bg-teal-100/90 rounded border border-teal-300 shadow-sm transform -rotate-6 p-1 text-[7px] text-teal-950 font-bold">ENGLISH</div>
          </div>
        </div>

        {/* Warm Cozy Oak Desk Surface */}
        <div className="absolute bottom-0 inset-x-0 h-[56%] bg-gradient-to-b from-amber-950 via-stone-900 to-slate-950 border-t-8 border-amber-800 shadow-2xl">
          {/* Natural Wood Grain */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#d97706_0px,#d97706_1px,transparent_1px,transparent_32px)]" />

          {/* Felt Leather Desk Pad */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[86%] h-[84%] bg-slate-900/90 rounded-3xl border-2 border-indigo-500/30 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-2xl border border-indigo-400/10 shadow-inner" />
          </div>
        </div>

        {/* Soft Golden Lamp Glow */}
        <div className="absolute -top-10 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
      </div>
    );
  }

  // DEFAULT: COZY NATURAL OAK ROOM (Unpacking / Oops Tidy Up Style)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-stone-950">
      {/* Wall Layer (Pastel Terracotta / Warm Oat) */}
      <div className="absolute top-0 inset-x-0 h-[44%] bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-900">
        {/* Soft Sunny Window Left */}
        <div className="absolute top-4 left-8 w-32 h-36 rounded-t-full border-4 border-amber-900/60 bg-amber-950/60 shadow-xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-sky-300/30 via-amber-200/20 to-amber-500/10 relative p-2">
            {/* Sun Glow */}
            <div className="w-8 h-8 rounded-full bg-amber-200/80 shadow-[0_0_20px_#fef08a] mx-auto mt-2" />
            {/* Window Pane Grid */}
            <div className="absolute inset-0 border-r-2 border-b-2 border-amber-900/40" />
          </div>
        </div>

        {/* Floating Wooden Wall Shelf Right */}
        <div className="absolute top-8 right-10 w-52 h-3 bg-amber-900 border-b-2 border-amber-950 rounded shadow-md flex items-end justify-between px-4">
          {/* Potted Plant SVG on Shelf */}
          <div className="relative -top-8 left-2 w-7 h-8 flex flex-col items-center">
            <div className="w-5 h-2 bg-emerald-400/80 rounded-t-full animate-pulse" />
            <div className="w-4 h-4 bg-amber-800 rounded-b-md border border-amber-900" />
          </div>
          {/* Books */}
          <div className="relative -top-7 right-2 flex gap-1 items-end">
            <div className="w-2.5 h-7 bg-rose-700 rounded-s" />
            <div className="w-2 h-8 bg-indigo-700 rounded-s" />
            <div className="w-3 h-6 bg-amber-600 rounded-s" />
          </div>
        </div>

        {/* Wall Art Frame Center */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-20 border-4 border-amber-800 rounded-lg bg-stone-900 shadow-md flex items-center justify-center p-1">
          <div className="w-full h-full bg-gradient-to-tr from-amber-500/20 to-teal-500/20 rounded flex items-center justify-center">
            <span className="text-[9px] font-black tracking-widest text-amber-200/70 font-sans">STAY COZY</span>
          </div>
        </div>
      </div>

      {/* Warm Natural Oak Desk Surface / Hardwood Floor */}
      <div className="absolute bottom-0 inset-x-0 h-[56%] bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 border-t-8 border-amber-700/80 shadow-2xl">
        {/* Subtle Beveled Wood Planks */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,#f59e0b_0px,#f59e0b_1px,transparent_1px,transparent_48px)]" />

        {/* Soft Woven Wool Desk Mat */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[88%] h-[84%] bg-slate-900/85 rounded-3xl border-2 border-amber-500/30 shadow-2xl flex items-center justify-center">
          <div className="w-full h-full rounded-2xl border border-amber-400/10 shadow-inner" />
        </div>
      </div>

      {/* Cozy Golden Sunbeam Light Cone */}
      <div className="absolute top-0 left-8 w-96 h-[550px] bg-gradient-to-br from-amber-200/15 via-amber-300/5 to-transparent blur-2xl transform -rotate-12 pointer-events-none" />
    </div>
  );
};
