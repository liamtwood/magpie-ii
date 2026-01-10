import React from 'react';
import { HelpCircle } from 'lucide-react';

export function InfoButton({ widgetKey, discoverMode, onClick, className = '' }) {
  if (!discoverMode) return null;
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(widgetKey);
      }}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors ml-2 ${className}`}
      aria-label="View widget information"
      title="View widget info & requirements"
    >
      <HelpCircle className="h-3.5 w-3.5" />
    </button>
  );
}
