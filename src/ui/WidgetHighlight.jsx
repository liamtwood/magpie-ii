import React, { useRef, useEffect } from 'react';
import { Eye } from 'lucide-react';

const WIDGET_REGISTRY = {
  'ai-assistant': { name: 'AI Assistant', color: '#8B5CF6' },
  'player-panel': { name: 'Player Panel', color: '#3B82F6' },
  'feedback-system': { name: 'Feedback System', color: '#10B981' },
  'shortlist-panel': { name: 'Shortlist Panel', color: '#F59E0B' },
  'timeline-modal': { name: 'Timeline Modal', color: '#EC4899' },
  'pitch-view': { name: 'Pitch View', color: '#14B8A6' },
  'whatsapp-panel': { name: 'WhatsApp Panel', color: '#22C55E' },
  'create-shortlist-modal': { name: 'Create Shortlist Modal', color: '#6366F1' },
  'data-sources': { name: 'Data Sources', color: '#EF4444' },
};

export function WidgetHighlight({ widgetId, discoverMode, children, className = '' }) {
  const ref = useRef(null);
  const widget = WIDGET_REGISTRY[widgetId];
  
  if (!widget) {
    console.warn(`Unknown widget ID: ${widgetId}`);
    return children;
  }
  
  if (!discoverMode) {
    return <div className={className} data-widget-id={widgetId}>{children}</div>;
  }
  
  return (
    <div 
      ref={ref}
      className={`relative ${className}`}
      data-widget-id={widgetId}
      style={{
        outline: `3px solid ${widget.color}`,
        outlineOffset: '2px',
        borderRadius: '8px',
      }}
    >
      <div 
        className="absolute -top-3 left-2 px-2 py-0.5 text-xs font-bold text-white rounded-full flex items-center gap-1 z-50 shadow-lg"
        style={{ backgroundColor: widget.color }}
      >
        <Eye className="h-3 w-3" />
        {widget.name}
      </div>
      {children}
    </div>
  );
}

export function WidgetLegend({ onScrollToWidget }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Eye className="h-4 w-4 text-purple-600" />
        Widget Legend
      </h3>
      <div className="space-y-2">
        {Object.entries(WIDGET_REGISTRY).map(([id, widget]) => (
          <button
            key={id}
            onClick={() => onScrollToWidget?.(id)}
            className="flex items-center gap-2 text-sm hover:bg-gray-50 p-1.5 rounded w-full text-left transition-colors"
          >
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: widget.color }}
            />
            <span className="text-gray-700">{widget.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { WIDGET_REGISTRY };
