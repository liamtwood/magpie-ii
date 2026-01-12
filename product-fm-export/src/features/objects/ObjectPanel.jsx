import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { StatusBadge, Badge } from '../../components/Badge';

export const ObjectPanel = ({ 
  object, 
  stories, 
  epics,
  onSave, 
  onAddStory, 
  onSelectStory,
  saving 
}) => {
  const [draft, setDraft] = useState({ name: '', description: '' });
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryEpicId, setNewStoryEpicId] = useState('');

  useEffect(() => {
    if (object) {
      setDraft({
        name: object.name,
        description: object.description || '',
      });
    }
  }, [object]);

  if (!object) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Object</h3>
          <p className="text-sm text-gray-500">Click on a Domain Object to view linked stories.</p>
        </div>
      </div>
    );
  }

  if (object.id === null) {
    return (
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <Badge color="gray">Unassigned</Badge>
          <h2 className="text-lg font-bold text-gray-500 italic mt-2">None</h2>
        </div>
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-500">Stories not assigned to any domain object</p>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Unassigned Stories ({stories.length})</h4>
          <div className="space-y-2">
            {stories.map(story => (
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
            {stories.length === 0 && (
              <p className="text-sm text-gray-500 italic py-4 text-center">No unassigned stories</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isDirty = draft.name !== object.name || 
                  draft.description !== (object.description || '');

  const handleSave = () => {
    const updates = {};
    if (draft.name !== object.name) updates.name = draft.name;
    if (draft.description !== (object.description || '')) updates.description = draft.description;
    onSave(object.id, updates);
  };

  const handleUndo = () => {
    setDraft({
      name: object.name,
      description: object.description || '',
    });
  };

  const handleAddStory = () => {
    if (newStoryTitle.trim()) {
      onAddStory({ 
        title: newStoryTitle.trim(), 
        objectId: object.id,
        parentId: newStoryEpicId ? parseInt(newStoryEpicId) : null,
      });
      setNewStoryTitle('');
      setNewStoryEpicId('');
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-purple-50">
        <div className="flex items-center justify-between mb-3">
          <Badge color="purple">Object</Badge>
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
          value={draft.name}
          onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))}
          className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors"
        />
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

      <div className="p-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Linked Stories ({stories.length})</h4>
        <div className="space-y-2 mb-4">
          {stories.map(story => {
            const parentEpic = epics.find(e => e.id === story.parentId);
            return (
              <div 
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">#{story.id}</span>
                  <StatusBadge status={story.status} />
                  {parentEpic && <Badge color="indigo">{parentEpic.title}</Badge>}
                </div>
                <p className="text-sm font-medium text-gray-900">{story.title}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Story</h4>
          <div className="space-y-2">
            <input
              type="text"
              value={newStoryTitle}
              onChange={(e) => setNewStoryTitle(e.target.value)}
              placeholder="Enter story title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <select
                value={newStoryEpicId}
                onChange={(e) => setNewStoryEpicId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">No Epic (standalone)</option>
                {epics.map(epic => (
                  <option key={epic.id} value={epic.id}>{epic.title}</option>
                ))}
              </select>
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
      </div>
    </div>
  );
};

export default ObjectPanel;
