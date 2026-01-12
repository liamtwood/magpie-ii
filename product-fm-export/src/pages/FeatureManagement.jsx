import React, { useState } from 'react';
import { List, Layers, Box } from 'lucide-react';
import { EpicTable } from '../features/epics/EpicTable';
import { EpicPanel } from '../features/epics/EpicPanel';
import { ObjectList } from '../features/objects/ObjectList';
import { ObjectPanel } from '../features/objects/ObjectPanel';
import { StoryModal } from '../features/stories/StoryModal';

const ViewToggle = ({ mode, setMode }) => {
  const views = [
    { id: 'list', label: 'List', icon: List },
    { id: 'epic', label: 'Epic', icon: Layers },
    { id: 'object', label: 'Object', icon: Box },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => setMode(view.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === view.id
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <view.icon className="h-4 w-4" />
          {view.label}
        </button>
      ))}
    </div>
  );
};

export const FeatureManagement = ({
  issues,
  objects,
  targets,
  onCreateIssue,
  onUpdateIssue,
  onUpdateObject,
}) => {
  const [viewMode, setViewMode] = useState('epic');
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [saving, setSaving] = useState(false);

  const epics = issues.filter(i => i.type === 'Epic');
  const stories = issues.filter(i => i.type === 'Story');

  const getStoriesForEpic = (epicId) => stories.filter(s => s.parentId === epicId);
  const getStoriesForObject = (objectId) => {
    if (objectId === null) return stories.filter(s => !s.objectId);
    return stories.filter(s => s.objectId === objectId);
  };

  const handleEpicSave = async (id, updates) => {
    setSaving(true);
    try {
      const updated = await onUpdateIssue(id, updates);
      setSelectedEpic(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleObjectSave = async (id, updates) => {
    setSaving(true);
    try {
      const updated = await onUpdateObject(id, updates);
      setSelectedObject(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStory = async (storyData) => {
    await onCreateIssue({
      type: 'Story',
      status: 'new',
      priority: 'medium',
      ...storyData,
    });
  };

  const handleStorySave = async (id, updates, targetId) => {
    setSaving(true);
    try {
      await onUpdateIssue(id, { ...updates, targetIds: targetId ? [targetId] : [] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Management</h1>
          <p className="text-gray-500 mt-1">Manage epics, stories, and domain objects</p>
        </div>
        <ViewToggle mode={viewMode} setMode={setViewMode} />
      </div>

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Title</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Screen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.type === 'Epic' ? 'bg-purple-100 text-purple-700' :
                        issue.type === 'Story' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {issue.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{issue.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{issue.screen || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'epic' && (
        <div className="flex gap-6">
          <div className="flex-1">
            <EpicTable
              epics={epics}
              selectedEpic={selectedEpic}
              onSelectEpic={setSelectedEpic}
              getStoriesCount={(id) => getStoriesForEpic(id).length}
            />
          </div>
          <EpicPanel
            epic={selectedEpic}
            stories={selectedEpic ? getStoriesForEpic(selectedEpic.id) : []}
            onSave={handleEpicSave}
            onAddStory={handleAddStory}
            onSelectStory={setEditingStory}
            saving={saving}
          />
        </div>
      )}

      {viewMode === 'object' && (
        <div className="flex gap-6">
          <ObjectList
            objects={objects}
            selectedObject={selectedObject}
            onSelectObject={setSelectedObject}
            getLinkedCount={(id) => getStoriesForObject(id).length}
            unassignedCount={stories.filter(s => !s.objectId).length}
          />
          <ObjectPanel
            object={selectedObject}
            stories={selectedObject ? getStoriesForObject(selectedObject.id) : []}
            epics={epics}
            onSave={handleObjectSave}
            onAddStory={handleAddStory}
            onSelectStory={setEditingStory}
            saving={saving}
          />
        </div>
      )}

      <StoryModal
        story={editingStory}
        isOpen={!!editingStory}
        onClose={() => setEditingStory(null)}
        onSave={handleStorySave}
        objects={objects}
        targets={targets}
        saving={saving}
      />
    </div>
  );
};

export default FeatureManagement;
