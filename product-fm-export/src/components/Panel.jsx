import React from 'react';
import { X } from 'lucide-react';

export const Panel = ({ isOpen, onClose, title, children, width = 'w-[500px]' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative ${width} bg-white shadow-xl flex flex-col h-full`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${onClick ? 'cursor-pointer hover:border-purple-300 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-200 bg-gray-50 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default Panel;
