export const WIDGET_TARGETS = {
  dashboard: {
    key: 'dashboard',
    name: 'Dashboard',
    type: 'page',
    widgets: {
      'squad-health-check': { key: 'squad-health-check', name: 'Squad Health Check', description: 'Proactive risk detection across your squad' },
      'issue-filter': { key: 'issue-filter', name: 'Issue Filter', description: 'Filter issues by Critical, Moderate, Resolved, Snoozed' },
      'issue-cards': { key: 'issue-cards', name: 'Issue Cards', description: 'Individual issue cards with recommendations and actions' },
    }
  },
  squad: {
    key: 'squad',
    name: 'Squad',
    type: 'page',
    widgets: {
      'pitch-view': { key: 'pitch-view', name: 'Pitch View', description: 'Interactive 4-3-3 formation display' },
      'squad-list': { key: 'squad-list', name: 'Squad List', description: 'Tabular view of all squad players' },
    }
  },
  'player-search': {
    key: 'player-search',
    name: 'Player Search',
    type: 'page',
    widgets: {
      'search-filters': { key: 'search-filters', name: 'Search Filters', description: 'Position, age, and attribute filters' },
      'search-results': { key: 'search-results', name: 'Search Results', description: 'Player search results grid' },
    }
  },
  shortlists: {
    key: 'shortlists',
    name: 'Shortlists',
    type: 'page',
    widgets: {
      'shortlist-cards': { key: 'shortlist-cards', name: 'Shortlist Cards', description: 'Overview of all active shortlists' },
      'shortlist-panel': { key: 'shortlist-panel', name: 'Shortlist Panel', description: 'Detailed shortlist view with candidates' },
    }
  },
  'user-management': {
    key: 'user-management',
    name: 'User Management',
    type: 'page',
    widgets: {}
  },
  global: {
    key: 'global',
    name: 'Global',
    type: 'page',
    widgets: {
      'ai-assistant': { key: 'ai-assistant', name: 'AI Assistant', description: 'Natural language query sidebar widget' },
      'feedback-system': { key: 'feedback-system', name: 'Feedback System', description: 'Issue and requirement tracking' },
      'player-panel': { key: 'player-panel', name: 'Player Panel', description: 'Slide-out player details panel' },
      'timeline-modal': { key: 'timeline-modal', name: 'Timeline Modal', description: 'Player activity timeline' },
      'whatsapp-panel': { key: 'whatsapp-panel', name: 'WhatsApp Panel', description: 'WhatsApp group chat integration' },
      'create-shortlist-modal': { key: 'create-shortlist-modal', name: 'Create Shortlist Modal', description: 'AI-assisted shortlist creation' },
    }
  }
};

export function getWidgetInfo(widgetKey) {
  // Check if it's a page-level key first
  const page = WIDGET_TARGETS[widgetKey];
  if (page) {
    return {
      key: page.key,
      name: page.name,
      description: `All widgets and issues on the ${page.name} page`,
      isPage: true,
      parentPage: null
    };
  }
  
  // Otherwise look for widget
  for (const pg of Object.values(WIDGET_TARGETS)) {
    if (pg.widgets[widgetKey]) {
      return {
        ...pg.widgets[widgetKey],
        isPage: false,
        parentPage: { key: pg.key, name: pg.name }
      };
    }
  }
  return null;
}

export function getAllWidgets() {
  const widgets = [];
  for (const page of Object.values(WIDGET_TARGETS)) {
    for (const widget of Object.values(page.widgets)) {
      widgets.push({
        ...widget,
        parentPage: { key: page.key, name: page.name }
      });
    }
  }
  return widgets;
}

export function getPageWidgets(pageKey) {
  const page = WIDGET_TARGETS[pageKey];
  if (!page) return [];
  return Object.values(page.widgets).map(w => ({
    ...w,
    parentPage: { key: page.key, name: page.name }
  }));
}
