import React from 'react';
import {
  Coffee,
  StickyNote,
  Headphones,
  PenTool,
  Milk,
  Gamepad2,
  Trash2,
  BookOpen,
  Glasses,
  Clock,
  Palette,
  BookMarked,
  Scissors,
  Lamp,
  Utensils,
  Box,
  Shirt,
  CupSoda,
  Package,
  Sparkles,
  Search,
} from 'lucide-react';

interface ObjectIconProps {
  name: string;
  className?: string;
}

export const ObjectIcon: React.FC<ObjectIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const iconMap: Record<string, React.ElementType> = {
    Coffee,
    StickyNote,
    Headphones,
    PenTool,
    Milk,
    Gamepad2,
    Trash2,
    BookOpen,
    Glasses,
    Clock,
    Palette,
    BookMarked,
    Scissors,
    Lamp,
    Utensils,
    Box,
    Shirt,
    CupSoda,
    Sparkles,
  };

  const IconComponent = iconMap[name] || Package;

  return <IconComponent className={className} />;
};
