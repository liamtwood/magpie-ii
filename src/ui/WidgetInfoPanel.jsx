import React, { useState, useEffect } from 'react';
import { X, ChevronDown, FileText, AlertCircle, Lightbulb, ExternalLink, Bug, Plus } from 'lucide-react';
import { WIDGET_TARGETS, getWidgetInfo, getAllWidgets } from './WidgetTargets';

export function WidgetInfoPanel({ isOpen, onClose, widgetKey, onChangeWidget, onReportIssue }) {
  const [issues, setIssues] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(widgetKey);
  
  const widgetInfo = getWidgetInfo(selectedWidget);
  const allWidgets = getAllWidgets();
  
  useEffect(() => {
    if (widgetKey) {
      setSelectedWidget(widgetKey);
    }
  }, [widgetKey]);
  
  useEffect(() => {
    if (isOpen && selectedWidget) {
      fetchWidgetData(selectedWidget);
    }
  }, [isOpen, selectedWidget]);
  
  const fetchWidgetData = async (key) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/delivery-targets/${key}/issues`);
      if (response.ok) {
        const widgetIssues = await response.json();
        const reqs = widgetIssues.filter(i => i.type === 'requirement');
        const bugs = widgetIssues.filter(i => i.type !== 'requirement');
        setRequirements(reqs);
        setIssues(bugs);
      } else {
        setRequirements([]);
        setIssues([]);
      }
    } catch (error) {
      console.error('Failed to fetch widget data:', error);
      setRequirements([]);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleWidgetChange = (key) => {
    setSelectedWidget(key);
    onChangeWidget?.(key);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Widget Info</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="relative">
          <select
            value={selectedWidget}
            onChange={(e) => handleWidgetChange(e.target.value)}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-sm appearance-none cursor-pointer hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {Object.entries(WIDGET_TARGETS).map(([pageKey, page]) => (
              <optgroup key={pageKey} label={page.name}>
                <option key={pageKey} value={pageKey} className="font-semibold">
                  📄 {page.name} (Page)
                </option>
                {Object.values(page.widgets).map((widget) => (
                  <option key={widget.key} value={widget.key}>
                    &nbsp;&nbsp;└ {widget.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {widgetInfo && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {widgetInfo.isPage ? (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                  📄 {widgetInfo.name} (Page)
                </span>
              ) : (
                <>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {widgetInfo.parentPage?.name}
                  </span>
                  <span>→</span>
                  <span className="font-medium text-gray-700">{widgetInfo.name}</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">{widgetInfo.description}</p>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-gray-900">Requirements</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {requirements.length}
            </span>
          </div>
          
          {loading ? (
            <div className="text-sm text-gray-500 italic">Loading...</div>
          ) : requirements.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              No requirements assigned to this widget
            </div>
          ) : (
            <div className="space-y-2">
              {requirements.map((req) => (
                <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.title}</p>
                      {req.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          req.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          req.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {req.status?.replace('_', ' ') || 'new'}
                        </span>
                        {req.priority && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            req.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {req.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h3 className="font-medium text-gray-900">Issues & Feedback</h3>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              {issues.length}
            </span>
          </div>
          
          {loading ? (
            <div className="text-sm text-gray-500 italic">Loading...</div>
          ) : issues.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              No issues reported for this widget
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-amber-300 transition-colors">
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      issue.type === 'bug' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          issue.type === 'bug' ? 'bg-red-100 text-red-700' :
                          issue.type === 'enhancement' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {issue.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {issue.status?.replace('_', ' ') || 'new'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        <button
          onClick={() => onReportIssue?.(selectedWidget, widgetInfo?.name)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-medium transition-colors"
        >
          <Bug className="h-4 w-4" />
          <span>Report Issue for {widgetInfo?.isPage ? 'Page' : 'Widget'}</span>
        </button>
        <p className="text-xs text-gray-500 text-center">
          Click the ? icon on any widget to see its info
        </p>
      </div>
    </div>
  );
}
