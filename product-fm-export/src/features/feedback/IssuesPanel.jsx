import React, { useState } from 'react';
import { X, Bug, Lightbulb, HelpCircle, FileText, Layers, BookOpen, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

const ISSUE_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'Epic', label: 'Epic', icon: Layers },
  { id: 'Story', label: 'Story', icon: BookOpen },
  { id: 'Bug', label: 'Bug', icon: Bug },
  { id: 'Enhancement', label: 'Enhancement', icon: Lightbulb },
  { id: 'Question', label: 'Question', icon: HelpCircle },
  { id: 'Requirement', label: 'Requirement', icon: FileText },
];

export const IssuesPanel = ({ 
  isOpen, 
  onClose, 
  issues = [], 
  onUpdateIssue, 
  onDeleteIssue,
  targets = [],
}) => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [expandedIssues, setExpandedIssues] = useState(new Set());

  if (!isOpen) return null;

  const pages = targets.filter(t => t.type === 'page');
  const widgets = targets.filter(t => t.type === 'widget');

  const parentIssues = issues.filter(issue => !issue.parentId);
  const getChildIssues = (parentId) => issues.filter(issue => issue.parentId === parentId);

  const filteredIssues = parentIssues.filter(issue => {
    if (filterType !== 'all' && issue.type !== filterType) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterTarget !== 'all' && issue.screen !== filterTarget) return false;
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTypeIcon = (type) => {
    const found = ISSUE_TYPES.find(t => t.id === type);
    return found?.icon || Bug;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[600px] bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Issues & Requirements</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ISSUE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Screens</option>
              {pages.length > 0 && (
                <optgroup label="Pages">
                  {pages.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
                </optgroup>
              )}
              {widgets.length > 0 && (
                <optgroup label="Widgets">
                  {widgets.map(w => <option key={w.key} value={w.key}>{w.name}</option>)}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const Icon = getTypeIcon(issue.type);
              const children = getChildIssues(issue.id);
              const hasChildren = children.length > 0;
              const isExpanded = expandedIssues.has(issue.id);

              return (
                <div key={issue.id}>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      {hasChildren && (
                        <button onClick={() => toggleExpand(issue.id)} className="mt-1">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-500">#{issue.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                          {issue.screen && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {issue.screen}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        {issue.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteIssue(issue.id)}
                        className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-2 space-y-2">
                      {children.map(child => {
                        const ChildIcon = getTypeIcon(child.type);
                        return (
                          <div key={child.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <ChildIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">#{child.id}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(child.status)}`}>
                                {child.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800">{child.title}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredIssues.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No issues found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesPanel;
