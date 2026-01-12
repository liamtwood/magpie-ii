import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { StatusBadge, Badge } from '../../components/Badge';

const SCREENS = [
  { value: '', label: 'None' },
  { group: 'Pages', options: [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'squad', label: 'Squad' },
    { value: 'shortlists', label: 'Shortlists' },
    { value: 'feature-management', label: 'Feature Management' },
  ]},
  { group: 'Widgets', options: [
    { value: 'squad-health-check', label: 'Squad Health Check' },
    { value: 'issues', label: 'Issues' },
    { value: 'ai-assistant', label: 'AI Assistant' },
    { value: 'squad-overview', label: 'Squad Overview' },
    { value: 'shortlist-panel', label: 'Shortlist Panel' },
    { value: 'player-panel', label: 'Player Panel' },
    { value: 'pitch-view', label: 'Pitch View' },
  ]},
];

export const EpicPanel = ({ 
  epic, 
  stories, 
  onSave, 
  onAddStory, 
  onSelectStory,
  saving 
}) => {
  const [draft, setDraft] = useState({ 
    title: '', description: '', status: '', scope: '', screen: '' 
  });
  const [newStoryTitle, setNewStoryTitle] = useState('');

  useEffect(() => {
    if (epic) {
      setDraft({
        title: epic.title,
        description: epic.description || '',
        status: epic.status,
        scope: epic.scope || '',
        screen: epic.screen || '',
      });
    }
  }, [epic]);

  if (!epic) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Epic</h3>
          <p className="text-sm text-gray-500">Click on an Epic from the table to view details.</p>
        </div>
      </div>
    );
  }

  const isDirty = draft.title !== epic.title || 
                  draft.description !== (epic.description || '') || 
                  draft.status !== epic.status ||
                  draft.scope !== (epic.scope || '') ||
                  draft.screen !== (epic.screen || '');

  const handleSave = () => {
    const updates = {};
    if (draft.title !== epic.title) updates.title = draft.title;
    if (draft.description !== (epic.description || '')) updates.description = draft.description;
    if (draft.status !== epic.status) updates.status = draft.status;
    if (draft.scope !== (epic.scope || '')) updates.scope = draft.scope;
    if (draft.screen !== (epic.screen || '')) updates.screen = draft.screen;
    onSave(epic.id, updates);
  };

  const handleUndo = () => {
    setDraft({
      title: epic.title,
      description: epic.description || '',
      status: epic.status,
      scope: epic.scope || '',
      screen: epic.screen || '',
    });
  };

  const handleAddStory = () => {
    if (newStoryTitle.trim()) {
      onAddStory({ 
        title: newStoryTitle.trim(), 
        parentId: epic.id 
      });
      setNewStoryTitle('');
    }
  };

  return (
    <div className="w-[400px] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge color="purple">Epic #{epic.id}</Badge>
            <select
              value={draft.status}
              onChange={(e) => setDraft(prev => ({ ...prev, status: e.target.value }))}
              className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                draft.status === 'new' ? 'bg-blue-100 text-blue-700' :
                draft.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                draft.status === 'resolved' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2">
              <button onClick={handleUndo} className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                Undo
              </button>
              <button onClick={handleSave} disabled={saving} className="px-3 py-1 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
          className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors"
        />
      </div>

      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Screen</h4>
        <select
          value={draft.screen}
          onChange={(e) => setDraft(prev => ({ ...prev, screen: e.target.value }))}
          className="w-full text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg p-2 hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="">None</option>
          {SCREENS.filter(s => s.group).map(group => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
        <textarea
          value={draft.description}
          onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Add a description..."
          rows={3}
          className="w-full text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg p-2 hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Scope</h4>
        <textarea
          value={draft.scope}
          onChange={(e) => setDraft(prev => ({ ...prev, scope: e.target.value }))}
          placeholder="Describe the scope concerns for this feature..."
          rows={3}
          className="w-full text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg p-2 hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Stories ({stories.length})</h4>
        </div>

        <div className="space-y-2 mb-4">
          {stories.map((story) => (
            <div 
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500">#{story.id}</span>
                <StatusBadge status={story.status} />
              </div>
              <p className="text-sm font-medium text-gray-900">{story.title}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            placeholder="New story title..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddStory()}
          />
          <button
            onClick={handleAddStory}
            disabled={!newStoryTitle.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpicPanel;
