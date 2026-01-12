import React from 'react';

export const ObjectList = ({ objects, selectedObject, onSelectObject, getLinkedCount, unassignedCount }) => {
  return (
    <div className="w-80 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Domain Objects</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {objects.map(obj => (
          <div
            key={obj.id}
            onClick={() => onSelectObject(obj)}
            className={`p-4 cursor-pointer transition-colors ${
              selectedObject?.id === obj.id
                ? 'bg-purple-50 border-l-4 border-purple-600'
                : 'hover:bg-gray-50 border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">{obj.name}</h4>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                {getLinkedCount(obj.id)}
              </span>
            </div>
          </div>
        ))}
        <div className="border-t-2 border-gray-300 my-1"></div>
        <div
          onClick={() => onSelectObject({ id: null, name: 'None', description: 'Stories not assigned to any object' })}
          className={`p-4 cursor-pointer transition-colors ${
            selectedObject?.id === null
              ? 'bg-purple-50 border-l-4 border-purple-600'
              : 'hover:bg-gray-50 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-500 italic">None</h4>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {unassignedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectList;
