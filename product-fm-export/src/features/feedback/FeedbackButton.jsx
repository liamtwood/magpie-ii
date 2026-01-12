import React, { useState } from 'react';
import { MessageSquarePlus, Send, X, Bug, Lightbulb, HelpCircle, FileText } from 'lucide-react';

const ISSUE_TYPES = [
  { id: 'Bug', label: 'Bug', icon: Bug, color: 'red' },
  { id: 'Enhancement', label: 'Enhancement', icon: Lightbulb, color: 'green' },
  { id: 'Question', label: 'Question', icon: HelpCircle, color: 'blue' },
  { id: 'Requirement', label: 'Requirement', icon: FileText, color: 'yellow' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' },
];

export const FeedbackButton = ({ onSubmit, currentScreen = 'dashboard' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Bug',
    title: '',
    description: '',
    priority: 'medium',
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    onSubmit({
      ...formData,
      screen: currentScreen,
      status: 'new',
      createdBy: 'Current User',
    });
    
    setFormData({ type: 'Bug', title: '', description: '', priority: 'medium' });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-full shadow-lg transition-all hover:shadow-xl"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span>Feedback</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Submit Feedback</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {ISSUE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        formData.type === type.id
                          ? 'border-amber-500 bg-amber-500/20'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <type.icon className={`w-5 h-5 ${formData.type === type.id ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className={`text-xs ${formData.type === type.id ? 'text-amber-400' : 'text-slate-400'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-4 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.title.trim()}
                  className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
