import React from 'react';
import { StatusBadge } from '../../components/Badge';

export const EpicTable = ({ epics, selectedEpic, onSelectEpic, getStoriesCount }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Epics ({epics.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Title</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Screen</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Stories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {epics.map((epic) => (
              <tr
                key={epic.id}
                onClick={() => onSelectEpic(epic)}
                className={`cursor-pointer transition-colors ${
                  selectedEpic?.id === epic.id
                    ? 'bg-purple-50 border-l-4 border-purple-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{epic.title}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={epic.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{epic.screen || '-'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {getStoriesCount(epic.id)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EpicTable;
