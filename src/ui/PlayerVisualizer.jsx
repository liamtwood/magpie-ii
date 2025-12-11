import React, { useState } from 'react';

const dataSourceColors = {
  statsbomb: '#1e40af',
  impect: '#7c3aed', 
  second_spectrum: '#059669',
  skillcorner: '#0891b2',
  catapult: '#dc2626',
  transfer_room: '#ea580c',
  scoutastic: '#c026d3',
  tweet: '#0ea5e9',
  analytics_fc: '#65a30d',
  elo: '#f59e0b',
  noisefeed: '#ef4444',
  internal: '#64748b',
  gamescope: '#06b6d4',
  derived: '#f59e0b',
  composite: '#ec4899'
};

const Badge = ({ source, small = false }) => (
  <span 
    className={`${small ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'} rounded font-mono font-medium text-white inline-block`}
    style={{ backgroundColor: dataSourceColors[source] || '#64748b' }}
  >
    {source}
  </span>
);

const santosMetrics = [
  {
    name: 'Overall',
    score: 7.90,
    percentile: 83,
    color: '#ec4899',
    sources: ['statsbomb', 'impect', 'skillcorner', 'second_spectrum'],
    formula: 'Weighted avg of all categories',
    metrics: ['Position-Adjusted Score', 'Form Trend', 'Minutes Played']
  },
  {
    name: 'Distribution',
    score: 7.50,
    percentile: 75,
    color: '#3b82f6',
    sources: ['statsbomb'],
    formula: 'Pass Acc × 0.3 + Prog Pass × 0.25 + Long Pass × 0.2 + ...',
    metrics: ['Pass Accuracy', 'Prog Pass Acc', 'Long Pass Acc', 'Pass Under Pressure', 'Switch Play Acc']
  },
  {
    name: 'Progression',
    score: 7.70,
    percentile: 77,
    color: '#8b5cf6',
    sources: ['statsbomb', 'impect'],
    formula: 'Prog Carries × 0.3 + Prog Passes × 0.3 + Packing × 0.25 + ...',
    metrics: ['Prog Carries/90', 'Prog Passes/90', 'Packing Value/90', 'Line Breaks/90']
  },
  {
    name: 'Finishing',
    score: 4.50,
    percentile: 45,
    color: '#ef4444',
    sources: ['statsbomb'],
    formula: 'xG Perf × 0.25 + xA Perf × 0.25 + Shot Quality × 0.2 + ...',
    metrics: ['Goals - xG', 'Assists - xA', 'xG/Shot', 'Chances Created/90']
  },
  {
    name: 'Dribbling',
    score: 6.40,
    percentile: 64,
    color: '#f97316',
    sources: ['statsbomb', 'skillcorner', 'second_spectrum'],
    formula: 'Dribble Success × 0.3 + Take-ons × 0.25 + Carries × 0.25 + Ball Retention × 0.2',
    metrics: ['Dribble Success %', 'Take-ons Won/90', 'Progressive Carries/90', 'Ball Retention Under Pressure']
  },
  {
    name: 'Physical (Def)',
    score: 8.50,
    percentile: 85,
    color: '#14b8a6',
    sources: ['skillcorner', 'second_spectrum'],
    formula: 'Press Distance × 0.3 + Sprints × 0.25 + Recovery Runs × 0.25 + ...',
    metrics: ['Pressure Distance/90', 'Defensive Sprints/90', 'Recovery Runs/90', 'Defensive Actions Distance']
  },
  {
    name: 'Physical (Ath)',
    score: 8.20,
    percentile: 82,
    color: '#06b6d4',
    sources: ['skillcorner', 'second_spectrum', 'catapult'],
    formula: 'Top Speed × 0.2 + HI Distance × 0.25 + Total Distance × 0.2 + ...',
    metrics: ['Top Speed', 'HI Distance/Min', 'Total Distance/90', 'Sprint Count/90', 'Off-Ball Workrate']
  },
  {
    name: 'Defending',
    score: 7.80,
    percentile: 78,
    color: '#eab308',
    sources: ['statsbomb'],
    formula: 'Tackle Success × 0.25 + Aerial × 0.2 + Interceptions × 0.2 + ...',
    metrics: ['Tackle Success %', 'Aerial Duel %', 'Interceptions/90', 'Ball Recoveries/90']
  },
  {
    name: 'Pressing',
    score: 8.50,
    percentile: 85,
    color: '#22c55e',
    sources: ['statsbomb', 'impect', 'second_spectrum'],
    formula: 'Pressure Count × 0.25 + Success × 0.3 + Counter-Press × 0.25 + ...',
    metrics: ['Pressures/90', 'Pressure Success %', 'Counter-Press/90', 'Pressure Regains/90']
  }
];

const santosPlayer = {
  name: 'Tiago Santos',
  club: 'LOSC Lille',
  position: 'RB',
  age: 23,
  nationality: 'Portugal',
  height: '1.75m',
  foot: 'Right',
  marketValue: '€15M',
  image: '/players/santos_1765321431388.webp'
};

const MetricsRing = ({ x, y, baseRadius, metrics, onMetricClick, selectedMetric }) => {
  const ringRadius = baseRadius + 90;
  
  const getLabelPosition = (index, total) => {
    if (index === 0 || index === 1 || index === total - 1) return 'top';
    if (index === 4 || index === 5) return 'bottom';
    if (index === 2 || index === 3) return 'right';
    return 'left';
  };
  
  return (
    <g>
      {metrics.map((metric, i) => {
        const angle = (i / metrics.length) * 2 * Math.PI - Math.PI / 2;
        const mx = x + Math.cos(angle) * ringRadius;
        const my = y + Math.sin(angle) * ringRadius;
        const isSelected = selectedMetric === metric.name;
        const nodeRadius = 32 + (metric.percentile / 100) * 10;
        const labelPos = getLabelPosition(i, metrics.length);
        
        let labelX = mx;
        let labelY = my;
        let textAnchor = 'middle';
        
        if (labelPos === 'top') {
          labelY = my - nodeRadius - 14;
        } else if (labelPos === 'bottom') {
          labelY = my + nodeRadius + 20;
        } else if (labelPos === 'right') {
          labelX = mx + nodeRadius + 8;
          textAnchor = 'start';
        } else if (labelPos === 'left') {
          labelX = mx - nodeRadius - 8;
          textAnchor = 'end';
        }
        
        return (
          <g key={metric.name} onClick={() => onMetricClick(metric)} className="cursor-pointer">
            <line
              x1={x + Math.cos(angle) * baseRadius}
              y1={y + Math.sin(angle) * baseRadius}
              x2={mx}
              y2={my}
              stroke={metric.color}
              strokeWidth={isSelected ? 3 : 1.5}
              opacity={0.6}
            />
            
            {isSelected && (
              <circle
                cx={mx}
                cy={my}
                r={nodeRadius + 6}
                fill="none"
                stroke={metric.color}
                strokeWidth={2}
                className="animate-pulse"
              />
            )}
            
            <circle
              cx={mx}
              cy={my}
              r={nodeRadius}
              fill={`${metric.color}40`}
              stroke={metric.color}
              strokeWidth={isSelected ? 4 : 2.5}
              className="transition-all duration-200 hover:brightness-125"
            />
            
            <text
              x={mx}
              y={my - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={14}
              fontWeight="800"
            >
              {metric.score.toFixed(1)}
            </text>
            
            <text
              x={mx}
              y={my + 12}
              textAnchor="middle"
              fill={metric.color}
              fontSize={10}
              fontWeight="600"
            >
              {metric.percentile}%
            </text>
            
            <text
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              dominantBaseline={labelPos === 'bottom' ? 'hanging' : labelPos === 'top' ? 'auto' : 'middle'}
              fill="white"
              fontSize={11}
              fontWeight="700"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
            >
              {metric.name}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const DetailPanel = ({ metric, onClose }) => {
  if (!metric) return null;
  
  return (
    <div className="absolute right-4 top-4 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="bg-slate-800/80 px-5 py-4 flex items-center justify-between border-b border-slate-700/50">
        <div>
          <h3 className="font-bold text-white text-lg">{metric.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Composite Metric</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: `${metric.color}30`, border: `2px solid ${metric.color}` }}
          >
            <span className="text-2xl font-bold text-white">{metric.score.toFixed(1)}</span>
            <span className="text-xs" style={{ color: metric.color }}>{metric.percentile}%ile</span>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1">Percentile vs Position Group</div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${metric.percentile}%`, backgroundColor: metric.color }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Composite Formula</h4>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <code className="text-xs text-pink-400 font-mono">{metric.formula}</code>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Source Data</h4>
          <div className="flex flex-wrap gap-1.5">
            {metric.sources.map(src => (
              <span
                key={src}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: dataSourceColors[src] }}
              >
                {src}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Component Metrics</h4>
          <div className="space-y-2">
            {metric.metrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-300">{m}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${60 + Math.random() * 35}%`, 
                        backgroundColor: metric.color 
                      }}
                    />
                  </div>
                  <Badge source="derived" small />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerVisualizer = ({ playerAvatar }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  const handleMetricClick = (metric) => {
    setSelectedMetric(selectedMetric?.name === metric.name ? null : metric);
  };
  
  const handleClose = () => {
    setSelectedMetric(null);
  };
  
  const centerX = 280;
  const centerY = 300;
  const playerRadius = 70;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Player Visualizer</h2>
            <p className="text-gray-500 mt-1">Interactive performance metrics breakdown</p>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={santosPlayer.image} 
              alt={santosPlayer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="font-semibold text-gray-900">{santosPlayer.name}</div>
              <div className="text-sm text-gray-500">{santosPlayer.club} • {santosPlayer.position}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-700 relative overflow-hidden" style={{ height: '600px' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <circle cx={centerX} cy={centerY} r={playerRadius + 30} fill="url(#playerGlow)" />
          
          <MetricsRing
            x={centerX}
            y={centerY}
            baseRadius={playerRadius}
            metrics={santosMetrics}
            onMetricClick={handleMetricClick}
            selectedMetric={selectedMetric?.name}
          />
          
          <circle
            cx={centerX}
            cy={centerY}
            r={playerRadius + 4}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={3}
          />
          
          <clipPath id="playerClip">
            <circle cx={centerX} cy={centerY} r={playerRadius} />
          </clipPath>
          
          <circle
            cx={centerX}
            cy={centerY}
            r={playerRadius}
            fill="#1e3a5f"
          />
          
          <image
            href={santosPlayer.image}
            x={centerX - playerRadius}
            y={centerY - playerRadius}
            width={playerRadius * 2}
            height={playerRadius * 2}
            clipPath="url(#playerClip)"
            preserveAspectRatio="xMidYMid slice"
          />
          
          <text
            x={centerX}
            y={centerY + playerRadius + 25}
            textAnchor="middle"
            fill="white"
            fontSize={16}
            fontWeight="700"
          >
            {santosPlayer.name}
          </text>
          <text
            x={centerX}
            y={centerY + playerRadius + 45}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={12}
          >
            {santosPlayer.position} • {santosPlayer.age} yrs • {santosPlayer.marketValue}
          </text>
        </svg>
        
        <DetailPanel metric={selectedMetric} onClose={handleClose} />
        
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {['statsbomb', 'impect', 'skillcorner', 'second_spectrum'].map(src => (
            <span
              key={src}
              className="px-2 py-1 rounded text-[10px] font-medium text-white"
              style={{ backgroundColor: dataSourceColors[src] }}
            >
              {src}
            </span>
          ))}
        </div>
        
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          Click metrics to see breakdown
        </div>
      </div>
    </div>
  );
};

export default PlayerVisualizer;
