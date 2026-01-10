import React from 'react';

export function WidgetHighlight({ widgetId, discoverMode, children, className = '', style }) {
  return (
    <div className={className} data-widget-id={widgetId} style={style}>
      {children}
    </div>
  );
}

export function WidgetLegend({ onScrollToWidget }) {
  return null;
}
