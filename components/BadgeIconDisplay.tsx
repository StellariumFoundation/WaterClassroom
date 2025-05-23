
import React from 'react';
import { Badge as BadgeType } from '../types';
import { Award, BookOpen, HelpCircle, Star, TrendingUp, Zap } from 'lucide-react'; // Example icons

interface BadgeIconDisplayProps {
  badge: BadgeType;
}

const iconsMap: { [key: string]: React.ElementType } = {
  Star: Star,
  HelpCircle: HelpCircle,
  BookOpen: BookOpen,
  TrendingUp: TrendingUp,
  Award: Award,
  Zap: Zap, // Added Zap for variety
  Default: Award,
};


const BadgeIcon: React.FC<BadgeIconDisplayProps> = ({ badge }) => {
  const IconComponent = badge.iconUrl && iconsMap[badge.iconUrl] ? iconsMap[badge.iconUrl] : iconsMap['Default'];
  
  return (
    <div className="flex flex-col items-center p-3 bg-brand-slate-dark rounded-lg shadow-md hover:shadow-brand-light-blue/20 transition-shadow" title={badge.description}>
      <div className="w-12 h-12 flex items-center justify-center bg-brand-purple rounded-full text-yellow-400 mb-2">
        <IconComponent size={28} />
      </div>
      <p className="text-xs font-medium text-brand-slate-light text-center">{badge.name}</p>
      {badge.dateEarned && <p className="text-xs text-brand-slate-medium text-center">{new Date(badge.dateEarned).toLocaleDateString()}</p>}
    </div>
  );
};

export default BadgeIcon;
