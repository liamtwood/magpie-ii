import React, { useState } from 'react';
import { X, Zap, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { PlayerAvatar } from './components-ui-badges';
import { formatBudget, getSeverityConfig } from '../utils-helpers-js';

const GateCheckbox = ({ label, checked, onChange }) => (
  <button 
    onClick={() => onChange && onChange(!checked)}
    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
  >
    {checked ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Circle className="h-3.5 w-3.5 text-gray-300" />}
    {label}
  </button>
);

export default function CreateShortlistModal({ 
  show, 
  onClose, 
  data,
  onConfirm 
}) {
  const [title, setTitle] = useState(data?.title || '');
  const [budget, setBudget] = useState(data?.budget || 0);
  const [wages, setWages] = useState(data?.wages || 80000);
  const [gates, setGates] = useState({
    scouting: false,
    manager: false,
    budget: false,
    medical: false
  });

  if (!show || !data) return null;

  const sevConfig = getSeverityConfig(data.severity);

  const handleSubmit = () => {
    if (onConfirm) {
      onConfirm({
        title,
        player: data.player,
        trigger: data.trigger,
        severity: data.severity,
        reasoning: data.reasoning,
        budget: { transfer: budget, wages },
        gates
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Create Shortlist</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <PlayerAvatar name={data.player.name} size="md" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{data.player.name}</div>
              <div className="text-sm text-gray-500">{data.player.position} - Age {data.player.age}</div>
            </div>
            <div className="text-right font-bold text-gray-900">£{data.player.value}</div>
          </div>
          
          <div className={`${sevConfig.bg} border ${sevConfig.border} rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <Zap className={`h-5 w-5 ${sevConfig.text} mt-0.5`} />
              <div>
                <div className={`text-sm font-semibold ${sevConfig.text}`}>AI Inference: {data.trigger}</div>
                <div className="text-sm text-gray-600 mt-1">{data.reasoning}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shortlist Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CB Cover - Botman"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Budget</label>
              <input
                type="text"
                value={formatBudget(budget)}
                onChange={(e) => {
                  const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                  setBudget(num * 1000000 || 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Wages</label>
              <input
                type="text"
                value={`£${(wages / 1000).toFixed(0)}K/wk`}
                onChange={(e) => {
                  const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                  setWages(num * 1000 || 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval Gates</label>
            <div className="flex flex-wrap gap-4">
              <GateCheckbox 
                label="Scouting" 
                checked={gates.scouting} 
                onChange={(v) => setGates({...gates, scouting: v})} 
              />
              <GateCheckbox 
                label="Manager" 
                checked={gates.manager} 
                onChange={(v) => setGates({...gates, manager: v})} 
              />
              <GateCheckbox 
                label="Budget" 
                checked={gates.budget} 
                onChange={(v) => setGates({...gates, budget: v})} 
              />
              <GateCheckbox 
                label="Medical" 
                checked={gates.medical} 
                onChange={(v) => setGates({...gates, medical: v})} 
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Create Shortlist
          </button>
        </div>
      </div>
    </div>
  );
}
