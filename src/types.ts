export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type GameMode = 'zen' | 'timer' | 'challenge';

export interface TidyObject {
  id: string;
  name: string; // English name, e.g. "Coffee Mug"
  ipa: string; // Phonetics IPA, e.g. "/ˈkɒfi mʌɡ/"
  vietnamese: string; // Vietnamese translation, e.g. "Cốc cà phê"
  spatialInstruction: string; // e.g. "Put the coffee mug next to the laptop on the coaster"
  category: string; // e.g. "Beverage", "Stationery", "Electronics"
  initialPos: { x: number; y: number }; // Percentage (10 to 90)
  targetPos: { x: number; y: number }; // Percentage (10 to 90)
  targetZoneDescription: string; // e.g. "On the wooden coaster next to the laptop"
  iconName: string; // Lucide icon name or preset graphic key
  color: string;
  tidied: boolean;
  hintShown?: boolean;
  box2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 normalized
  croppedImageDataUrl?: string; // Cropped PNG sprite from source photo
}

export interface GameLevel {
  id: string;
  title: string;
  theme: string;
  cefrLevel: CEFRLevel;
  backstory: string; // Funny 2-sentence English backstory of owner
  bgGradient: string;
  bgStyle?: string;
  objects: TidyObject[];
  roomType: string;
  isCustomPhoto: boolean;
  photoUrl?: string;
}

export interface LevelStats {
  score: number;
  combos: number;
  tidiedCount: number;
  totalCount: number;
  stars: number;
  timeSeconds: number;
  mistakes: number;
}

export interface AnalyzeMessResponse {
  cefrLevel: CEFRLevel;
  backstory: string;
  roomType: string;
  stylizedPhotoUrl?: string;
  objects: {
    id: string;
    name: string;
    ipa: string;
    vietnamese: string;
    spatialInstruction: string;
    category: string;
    initialPos: { x: number; y: number };
    targetPos: { x: number; y: number };
    targetZoneDescription: string;
    iconName: string;
    box2d?: [number, number, number, number];
  }[];
}
