import React from 'react';
import { Star, CheckCircle2, Circle } from 'lucide-react';
import { getFCRatingColor } from 'utils-helpers-js.js';

// FC Rating Badge
export const FCRatingBadge = ({ rating, size = 'md' }) => {
  if (!rating) return <span className="text-xs text-gray-400">N/A</span>;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  return (
    <div className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${getFCRatingColor(rating)} text-white font-bold shadow-md ${sizeClasses[size]}`}>
      {rating}
    </div>
  );
};

// Data Source Badge
export const SourceBadge = ({ source }) => {
  const sources = {
    statsbomb: { label: 'SB', color: 'bg-blue-600', full: 'StatsBomb' },
    impect: { label: 'IMP', color: 'bg-purple-600', full: 'Impect' },
    scoutastic: { label: 'SCT', color: 'bg-green-600', full: 'Scoutastic' },
    wyscout: { label: 'WY', color: 'bg-orange-600', full: 'Wyscout' },
    transfermarkt: { label: 'TM', color: 'bg-teal-600', full: 'Transfermarkt' },
  };
  const s = sources[source] || { label: '?', color: 'bg-gray-600', full: 'Unknown' };
  
  return (
    <span 
      className={`${s.color} text-white px-1.5 py-0.5 rounded text-xs font-medium cursor-help`}
      title={s.full}
    >
      {s.label}
    </span>
  );
};

// Injury Risk Badge
export const InjuryBadge = ({ risk, daysOut }) => {
  const colors = { 
    low: 'bg-green-500', 
    medium: 'bg-amber-500', 
    high: 'bg-red-500' 
  };
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${colors[risk]} bg-opacity-20`}>
      <span className={`w-2 h-2 rounded-full ${colors[risk]}`} />
      <span className="text-xs text-gray-700">{daysOut}d</span>
    </div>
  );
};

// Star Rating
export const StarRating = ({ rating, max = 4 }) => {
  const safeRating = Math.max(0, Math.min(max, rating || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);
  
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && <Star className="h-3 w-3 fill-amber-400/50 text-amber-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3 w-3 text-gray-200" />
      ))}
    </div>
  );
};

// Pipeline Progress Indicator
export const PipelineIndicator = ({ stage, maxStage = 6 }) => (
  <div className="flex gap-1">
    {Array.from({ length: maxStage }).map((_, i) => (
      <div 
        key={i} 
        className={`w-2 h-2 rounded-sm transition-colors ${i < stage ? 'bg-blue-500' : 'bg-gray-200'}`} 
      />
    ))}
  </div>
);

// Gate Checkbox
export const GateCheckbox = ({ label, checked, onClick }) => (
  <div 
    className={`flex items-center gap-1.5 text-xs text-gray-500 ${onClick ? 'cursor-pointer hover:text-gray-700' : ''}`}
    onClick={onClick}
  >
    {checked ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    ) : (
      <Circle className="h-3.5 w-3.5 text-gray-300" />
    )}
    {label}
  </div>
);

// Position Badge
export const PositionBadge = ({ position, size = 'sm' }) => {
  const positionColors = {
    GK: 'bg-yellow-100 text-yellow-800',
    CB: 'bg-blue-100 text-blue-800',
    LB: 'bg-blue-100 text-blue-800',
    RB: 'bg-blue-100 text-blue-800',
    CM: 'bg-green-100 text-green-800',
    CDM: 'bg-green-100 text-green-800',
    CAM: 'bg-green-100 text-green-800',
    LW: 'bg-purple-100 text-purple-800',
    RW: 'bg-purple-100 text-purple-800',
    CF: 'bg-red-100 text-red-800',
    ST: 'bg-red-100 text-red-800',
  };
  
  const sizeClasses = {
    xs: 'px-1 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
  };
  
  return (
    <span className={`${positionColors[position] || 'bg-gray-100 text-gray-800'} ${sizeClasses[size]} rounded font-medium`}>
      {position}
    </span>
  );
};

// Flag Badge (Key, Prospect, Contract, etc.)
export const FlagBadge = ({ flag }) => {
  const flagColors = {
    Key: 'bg-blue-100 text-blue-700',
    Prospect: 'bg-green-100 text-green-700',
    Loan: 'bg-purple-100 text-purple-700',
    Contract: 'bg-amber-100 text-amber-700',
    ACL: 'bg-red-100 text-red-700',
    Transfer: 'bg-orange-100 text-orange-700',
  };
  
  if (!flag) return null;
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${flagColors[flag] || 'bg-gray-100 text-gray-700'}`}>
      {flag}
    </span>
  );
};

// Match Score Badge (for AI replacement)
export const MatchScoreBadge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 90) return 'from-emerald-500 to-emerald-600';
    if (s >= 80) return 'from-green-500 to-green-600';
    if (s >= 70) return 'from-lime-500 to-lime-600';
    if (s >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-orange-600';
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${getColor(score)} text-white text-xs font-bold`}>
      <span>{score}%</span>
      <span className="opacity-75">match</span>
    </div>
  );
};

// Player Avatar
export const PlayerAvatar = ({ src, name, number, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };
  
  const initials = name ? name.split(' ').map(n => n[0]).join('') : number || '?';
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold ${className}`}>
      {initials}
    </div>
  );
};
