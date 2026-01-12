import React from 'react';
import { LayoutDashboard, Layers, BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const Dashboard = ({ issues = [], objects = [] }) => {
  const epics = issues.filter(i => i.type === 'Epic');
  const stories = issues.filter(i => i.type === 'Story');
  
  const newCount = issues.filter(i => i.status === 'new').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  
  const stats = [
    { label: 'Total Epics', value: epics.length, icon: Layers, color: 'purple' },
    { label: 'Total Stories', value: stories.length, icon: BookOpen, color: 'indigo' },
    { label: 'Domain Objects', value: objects.length, icon: LayoutDashboard, color: 'blue' },
  ];

  const statusStats = [
    { label: 'New', value: newCount, icon: AlertCircle, color: 'blue' },
    { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'yellow' },
    { label: 'Resolved', value: resolvedCount, icon: CheckCircle2, color: 'green' },
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your product features and requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Epics</h2>
          <div className="space-y-3">
            {epics.slice(0, 5).map(epic => (
              <div key={epic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{epic.title}</p>
                  <p className="text-sm text-gray-500">{epic.screen || 'No screen'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  epic.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  epic.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                  epic.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {epic.status}
                </span>
              </div>
            ))}
            {epics.length === 0 && (
              <p className="text-gray-500 text-center py-4">No epics yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Objects</h2>
          <div className="space-y-3">
            {objects.map(obj => {
              const linkedCount = issues.filter(i => i.objectId === obj.id).length;
              return (
                <div key={obj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{obj.name}</p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {linkedCount} stories
                  </span>
                </div>
              );
            })}
            {objects.length === 0 && (
              <p className="text-gray-500 text-center py-4">No objects yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
