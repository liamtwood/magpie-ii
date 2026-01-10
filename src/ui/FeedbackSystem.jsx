import React, { useState, useEffect } from 'react';
import { 
  Bug, Lightbulb, HelpCircle, X, Send, ChevronDown, ChevronRight,
  AlertCircle, Clock, Zap, Flag, Filter, CheckCircle,
  Circle, Trash2, Edit2, MessageSquare, Plus, Layers, Layout
} from 'lucide-react';

const ISSUE_TYPES = [
  { id: 'bug', label: 'Bug', icon: Bug, color: 'red' },
  { id: 'enhancement', label: 'Enhancement', icon: Lightbulb, color: 'amber' },
  { id: 'question', label: 'Question', icon: HelpCircle, color: 'blue' },
  { id: 'requirement', label: 'Requirement', icon: Flag, color: 'purple' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'slate' },
  { id: 'medium', label: 'Medium', color: 'blue' },
  { id: 'high', label: 'High', color: 'orange' },
  { id: 'critical', label: 'Critical', color: 'red' },
];

const FIX_BY = [
  { id: 'immediately', label: 'Immediately' },
  { id: 'current-release', label: 'Current Release' },
  { id: 'future-release', label: 'Future Release' },
];

const STATUSES = [
  { id: 'new', label: 'New', color: 'blue' },
  { id: 'in-progress', label: 'In Progress', color: 'amber' },
  { id: 'resolved', label: 'Resolved', color: 'green' },
  { id: 'closed', label: 'Closed', color: 'slate' },
];

const FeedbackButton = ({ currentScreen, onOpenPanel, issues = [], onAddIssue, onShowWidgetInfo, discoverMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug',
    priority: 'medium',
    fixBy: 'current-release',
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const newIssue = {
      ...formData,
      screen: currentScreen,
      status: 'new',
      createdBy: 'Current User',
    };

    onAddIssue(newIssue);
    setFormData({
      type: 'bug',
      priority: 'medium',
      fixBy: 'current-release',
      title: '',
      description: '',
    });
    setIsModalOpen(false);
  };

  const TypeIcon = ISSUE_TYPES.find(t => t.id === formData.type)?.icon || Bug;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {discoverMode ? (
          <button
            onClick={() => onShowWidgetInfo()}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 animate-pulse"
            title="View Widget Requirements"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        ) : (
          <>
            <button
              onClick={() => onOpenPanel()}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 relative"
              title="View Issues"
            >
              <MessageSquare className="w-5 h-5" />
              {issues.filter(i => i.status === 'new').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {issues.filter(i => i.status === 'new').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Report Issue"
            >
              <Bug className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Report Issue</h2>
                  <p className="text-xs text-slate-400">From: {currentScreen}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <div className="flex gap-2">
                  {ISSUE_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                          formData.type === type.id
                            ? type.color === 'red' ? 'bg-red-500/20 border-red-500 text-red-400'
                            : type.color === 'amber' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : type.color === 'purple' ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                            : 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fix By</label>
                  <select
                    value={formData.fixBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixBy: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {FIX_BY.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim()}
                className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const IssuesPanel = ({ isOpen, onClose, issues = [], onUpdateIssue, onDeleteIssue, onAddIssue, initialFilters = {} }) => {
  const [filterType, setFilterType] = useState(initialFilters.type || 'all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTarget, setFilterTarget] = useState(initialFilters.screen || 'all');
  const [deliveryTargets, setDeliveryTargets] = useState([]);
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const [showAddStoryModal, setShowAddStoryModal] = useState(null);
  const [storyForm, setStoryForm] = useState({ title: '', description: '' });
  
  useEffect(() => {
    fetch('/api/delivery-targets')
      .then(res => res.json())
      .then(data => setDeliveryTargets(data))
      .catch(err => console.error('Failed to fetch delivery targets:', err));
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      setFilterType(initialFilters.type || 'all');
      setFilterTarget(initialFilters.screen || 'all');
    }
  }, [isOpen, initialFilters.type, initialFilters.screen]);

  const updateIssueStatus = (id, newStatus) => {
    onUpdateIssue(id, { status: newStatus });
  };

  const deleteIssue = (id) => {
    onDeleteIssue(id);
  };
  
  const toggleExpand = (issueId) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };
  
  const handleAddStory = () => {
    if (!storyForm.title.trim() || !showAddStoryModal) return;
    
    const parentIssue = issues.find(i => i.id === showAddStoryModal);
    
    onAddIssue({
      type: 'requirement',
      title: storyForm.title,
      description: storyForm.description,
      parentId: showAddStoryModal,
      screen: parentIssue?.screen || 'dashboard',
      status: 'new',
      priority: 'medium',
      fixBy: 'current-release',
      area: parentIssue?.area || 'Recruitment',
      createdBy: 'Current User',
    });
    
    setStoryForm({ title: '', description: '' });
    setShowAddStoryModal(null);
    setExpandedIssues(prev => new Set([...prev, showAddStoryModal]));
  };

  const parentIssues = issues.filter(issue => !issue.parentId);
  const getChildIssues = (parentId) => issues.filter(issue => issue.parentId === parentId);
  
  const pageTargets = deliveryTargets.filter(t => t.type === 'page');
  const widgetTargets = deliveryTargets.filter(t => t.type === 'widget');

  const filteredIssues = parentIssues.filter(issue => {
    if (filterType !== 'all' && issue.type !== filterType) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterTarget !== 'all' && issue.screen !== filterTarget) return false;
    return true;
  });

  const getTypeIcon = (type) => {
    const found = ISSUE_TYPES.find(t => t.id === type);
    return found?.icon || Bug;
  };

  const getTypeColor = (type) => {
    const found = ISSUE_TYPES.find(t => t.id === type);
    return found?.color || 'slate';
  };

  const getPriorityColor = (priority) => {
    const found = PRIORITIES.find(p => p.id === priority);
    return found?.color || 'slate';
  };

  const getStatusColor = (status) => {
    const found = STATUSES.find(s => s.id === status);
    return found?.color || 'slate';
  };

  if (!isOpen) return null;

  const IssueCard = ({ issue, isChild = false }) => {
    const TypeIcon = getTypeIcon(issue.type);
    const typeColor = getTypeColor(issue.type);
    const priorityColor = getPriorityColor(issue.priority);
    const statusColor = getStatusColor(issue.status);
    const children = getChildIssues(issue.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIssues.has(issue.id);

    return (
      <div className={isChild ? 'ml-6 border-l-2 border-purple-500/30 pl-4' : ''}>
        <div className={`bg-slate-700/50 border border-slate-600 rounded-lg p-4 ${isChild ? 'bg-slate-700/30' : ''}`}>
          <div className="flex items-start gap-3">
            {!isChild && issue.type === 'requirement' && (
              <button 
                onClick={() => toggleExpand(issue.id)}
                className="mt-1 p-1 hover:bg-slate-600 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              typeColor === 'red' ? 'bg-red-500/20' :
              typeColor === 'amber' ? 'bg-amber-500/20' :
              typeColor === 'purple' ? 'bg-purple-500/20' :
              'bg-blue-500/20'
            }`}>
              <TypeIcon className={`w-4 h-4 ${
                typeColor === 'red' ? 'text-red-400' :
                typeColor === 'amber' ? 'text-amber-400' :
                typeColor === 'purple' ? 'text-purple-400' :
                'text-blue-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white truncate">{issue.title}</h3>
                {hasChildren && (
                  <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                    {children.length} {children.length === 1 ? 'story' : 'stories'}
                  </span>
                )}
              </div>
              {issue.description && (
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{issue.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  priorityColor === 'red' ? 'bg-red-500/20 text-red-400' :
                  priorityColor === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                  priorityColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {issue.priority}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  statusColor === 'green' ? 'bg-green-500/20 text-green-400' :
                  statusColor === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  statusColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {issue.status}
                </span>
                {issue.screen && (
                  <span className="px-2 py-0.5 bg-slate-600/50 text-slate-300 text-xs rounded flex items-center gap-1">
                    <Layout className="w-3 h-3" />
                    {issue.screen}
                  </span>
                )}
              </div>
              {issue.ideasToDiscuss && (
                <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-xs text-purple-300">
                    <span className="font-medium">Ideas:</span> {issue.ideasToDiscuss}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-600">
            <select
              value={issue.status}
              onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
              className="px-2 py-1 bg-slate-600/50 border border-slate-500 rounded text-xs text-white focus:outline-none"
            >
              {STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            {!isChild && issue.type === 'requirement' && (
              <button
                onClick={() => setShowAddStoryModal(issue.id)}
                className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Story
              </button>
            )}
            <button
              onClick={() => deleteIssue(issue.id)}
              className="ml-auto p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isExpanded && children.length > 0 && (
          <div className="mt-2 space-y-2">
            {children.map(child => (
              <IssueCard key={child.id} issue={child} isChild={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-[520px] bg-slate-800 border-l border-slate-700 z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">Issues & Requirements</h2>
            <p className="text-xs text-slate-400">
              {issues.length} total • {issues.filter(i => i.type === 'requirement').length} requirements • {issues.filter(i => !i.parentId && i.type === 'requirement').length} top-level
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-700 space-y-2">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              {ISSUE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label} ({issues.filter(i => i.type === t.id).length})</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white focus:outline-none flex-1"
            >
              <option value="all">All Pages & Widgets</option>
              <optgroup label="Pages">
                {pageTargets.map(t => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </optgroup>
              <optgroup label="Widgets">
                {widgetTargets.map(t => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No issues found</p>
            </div>
          ) : (
            filteredIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          )}
        </div>
      </div>
      
      {showAddStoryModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Add Story</h2>
                  <p className="text-xs text-slate-400">
                    Under: {issues.find(i => i.id === showAddStoryModal)?.title?.substring(0, 30)}...
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddStoryModal(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Story Title</label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Natural language query parsing"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={storyForm.description}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the story requirements..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowAddStoryModal(null)}
                className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStory}
                disabled={!storyForm.title.trim()}
                className="flex-1 py-2 px-4 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { FeedbackButton, IssuesPanel };
