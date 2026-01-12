import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Layers, List } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { FeatureManagement } from './pages/FeatureManagement';
import { FeedbackButton } from './features/feedback/FeedbackButton';
import { IssuesPanel } from './features/feedback/IssuesPanel';
import { useIssues } from './hooks/useIssues';
import { useObjects } from './hooks/useObjects';
import { useTargets } from './hooks/useTargets';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'features', label: 'Feature Management', icon: Layers },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showIssuesPanel, setShowIssuesPanel] = useState(false);

  const { issues, epics, stories, createIssue, updateIssue, deleteIssue, refetch: refetchIssues } = useIssues();
  const { objects, updateObject, refetch: refetchObjects } = useObjects();
  const { targets } = useTargets();

  const handleCreateIssue = async (issueData) => {
    await createIssue(issueData);
  };

  const handleUpdateIssue = async (id, updates) => {
    return await updateIssue(id, updates);
  };

  const handleDeleteIssue = async (id) => {
    await deleteIssue(id);
  };

  const handleUpdateObject = async (id, updates) => {
    return await updateObject(id, updates);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-purple-600">Product FM</h1>
          <p className="text-sm text-gray-500 mt-1">Feature Management</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentScreen === item.id
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowIssuesPanel(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <List className="h-5 w-5" />
              Issues
              <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                {issues.length}
              </span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {currentScreen === 'dashboard' && (
          <Dashboard issues={issues} objects={objects} />
        )}
        {currentScreen === 'features' && (
          <FeatureManagement
            issues={issues}
            objects={objects}
            targets={targets}
            onCreateIssue={handleCreateIssue}
            onUpdateIssue={handleUpdateIssue}
            onUpdateObject={handleUpdateObject}
          />
        )}
      </main>

      <FeedbackButton 
        onSubmit={handleCreateIssue} 
        currentScreen={currentScreen} 
      />

      <IssuesPanel
        isOpen={showIssuesPanel}
        onClose={() => setShowIssuesPanel(false)}
        issues={issues}
        onUpdateIssue={handleUpdateIssue}
        onDeleteIssue={handleDeleteIssue}
        targets={targets}
      />
    </div>
  );
}

export default App;
