import React from 'react';

const colorClasses = {
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export const Badge = ({ children, color = 'gray', className = '' }) => {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color] || colorClasses.gray} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusColors = {
    'new': 'blue',
    'in-progress': 'yellow',
    'resolved': 'green',
    'closed': 'gray',
  };
  const statusLabels = {
    'new': 'New',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
  };
  return <Badge color={statusColors[status] || 'gray'}>{statusLabels[status] || status}</Badge>;
};

export const TypeBadge = ({ type }) => {
  const typeColors = {
    'Epic': 'purple',
    'Story': 'indigo',
    'Bug': 'red',
    'Enhancement': 'green',
    'Question': 'blue',
    'Requirement': 'yellow',
  };
  return <Badge color={typeColors[type] || 'gray'}>{type}</Badge>;
};

export default Badge;
