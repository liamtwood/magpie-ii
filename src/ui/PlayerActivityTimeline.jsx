import React, { useState } from 'react';
import { X, Plus, MessageSquare, Phone, Eye, Video, Users, Clock, Send, RefreshCw } from 'lucide-react';
import { PlayerAvatar } from './components-ui-badges';
import { activityTypes, formatRelativeDate } from '../utils-helpers-js';

const ActivityIcon = ({ type }) => {
  const icons = {
    discussion: MessageSquare,
    phone_call: Phone,
    scout_visit: Eye,
    video_review: Video,
    meeting: Users,
    status_change: RefreshCw,
  };
  const Icon = icons[type] || MessageSquare;
  return <Icon className="h-4 w-4" />;
};

const ActivityTypeColors = {
  discussion: 'bg-blue-100 text-blue-600',
  phone_call: 'bg-green-100 text-green-600',
  scout_visit: 'bg-purple-100 text-purple-600',
  video_review: 'bg-orange-100 text-orange-600',
  meeting: 'bg-cyan-100 text-cyan-600',
  status_change: 'bg-gray-100 text-gray-600',
};

export default function PlayerActivityTimeline({
  show,
  onClose,
  playerName,
  activities = [],
  onAddNote
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    type: 'discussion',
    title: '',
    content: ''
  });

  if (!show) return null;

  const handleSubmit = () => {
    if (newNote.title && newNote.content && onAddNote) {
      onAddNote({
        id: Date.now(),
        type: newNote.type,
        date: new Date().toISOString().split('T')[0],
        user: 'Current User',
        title: newNote.title,
        content: newNote.content
      });
      setNewNote({ type: 'discussion', title: '', content: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PlayerAvatar name={playerName} size="sm" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{playerName}</h2>
              <p className="text-sm text-gray-500">Activity Timeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" /> Recent Activity
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Note
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {Object.entries(activityTypes).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setNewNote({...newNote, type: key})}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      newNote.type === key 
                        ? ActivityTypeColors[key] 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Title (e.g., Agent call, Live scouting)"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Notes and observations..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Save Note
                </button>
              </div>
            </div>
          )}

          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No activity recorded yet</p>
              <p className="text-sm">Add a note to start tracking this player</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={activity.id || i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ActivityTypeColors[activity.type] || 'bg-gray-100 text-gray-600'}`}>
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-500">
                        {activity.date && formatRelativeDate(activity.date.replace(/-/g, '/'))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">by {activity.user}</div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{activity.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
