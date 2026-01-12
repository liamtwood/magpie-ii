import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const StoryModal = ({ 
  story, 
  isOpen, 
  onClose, 
  onSave, 
  objects = [], 
  targets = [],
  saving 
}) => {
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    status: 'new',
    priority: 'medium',
    objectId: null,
    targetId: null,
  });

  useEffect(() => {
    if (story) {
      setDraft({
        title: story.title,
        description: story.description || '',
        status: story.status,
        priority: story.priority || 'medium',
        objectId: story.objectId || null,
        targetId: null,
      });
    }
  }, [story]);

  if (!story) return null;

  const handleSave = () => {
    const updates = {};
    if (draft.title !== story.title) updates.title = draft.title;
    if (draft.description !== (story.description || '')) updates.description = draft.description;
    if (draft.status !== story.status) updates.status = draft.status;
    if (draft.priority !== (story.priority || 'medium')) updates.priority = draft.priority;
    if (draft.objectId !== (story.objectId || null)) updates.objectId = draft.objectId;
    
    onSave(story.id, updates, draft.targetId);
    onClose();
  };

  const pages = targets.filter(t => t.type === 'page');
  const widgets = targets.filter(t => t.type === 'widget');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Story #${story.id}`} width="max-w-xl">
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={draft.status}
              onChange={(e) => setDraft(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={draft.priority}
              onChange={(e) => setDraft(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Object</label>
          <select
            value={draft.objectId || ''}
            onChange={(e) => setDraft(prev => ({ ...prev, objectId: e.target.value ? parseInt(e.target.value) : null }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">None</option>
            {objects.map(obj => (
              <option key={obj.id} value={obj.id}>{obj.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page / Widget</label>
          <select
            value={draft.targetId || ''}
            onChange={(e) => setDraft(prev => ({ ...prev, targetId: e.target.value ? parseInt(e.target.value) : null }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">None</option>
            {pages.length > 0 && (
              <optgroup label="Pages">
                {pages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            )}
            {widgets.length > 0 && (
              <optgroup label="Widgets">
                {widgets.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
};

export default StoryModal;
