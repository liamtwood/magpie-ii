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

// Entity definitions with all their data
const entityData = {
  CLUB: {
    sources: ['statsbomb', 'transfer_room', 'elo', 'internal'],
    fields: ['Club ID', 'Name', 'Country', 'League', 'Stadium', 'Founded', 'Logo URL'],
    derived: ['ELO Rating', 'Squad Value', 'Wage Bill'],
    drilldowns: ['→ Players (squad)', '→ Fixtures (schedule)', '→ Competitions']
  },
  COMPETITION: {
    sources: ['statsbomb', 'transfer_room'],
    fields: ['Competition ID', 'Name', 'Country', 'Type', 'Season', 'Tier'],
    derived: ['Total Teams', 'Current Matchday'],
    drilldowns: ['→ Fixtures', '→ Clubs', '→ Standings']
  },
  FIXTURE: {
    sources: ['statsbomb', 'gamescope', 'internal'],
    fields: ['Match ID', 'Date', 'Kickoff', 'Home/Away Team', 'Venue', 'Score'],
    derived: ['xG Home/Away', 'Possession %', 'Event Count'],
    drilldowns: ['→ Events', '→ Video', '→ Lineups', '→ Players']
  },
  EVENT: {
    sources: ['statsbomb', 'impect', 'gamescope'],
    fields: ['Event ID', 'Type', 'Minute', 'Second', 'Player ID', 'Location XY'],
    derived: ['xG (shots)', 'xA (passes)', 'Packing Value'],
    drilldowns: ['→ Player', '→ Video Timeline', '→ Related Events']
  },
  VIDEO: {
    sources: ['gamescope', 'internal'],
    fields: ['Video ID', 'URL/Path', 'Duration', 'Source', 'Quality'],
    derived: ['Processing Status', 'Frame Count', 'Event Sync Status'],
    drilldowns: ['→ Timeline', '→ Fixture', '→ Highlights']
  },
  TIMELINE: {
    sources: ['gamescope', 'statsbomb'],
    fields: ['Timestamp', 'Event Reference', 'Video Timestamp', 'Label'],
    derived: ['Synced Events Count'],
    drilldowns: ['→ Video (scrubber)', '→ Event', '→ Player filter']
  },
  CONTRACTS: {
    sources: ['transfer_room', 'internal'],
    fields: ['Contract ID', 'Club', 'Start/End Date', 'Weekly Wages', 'Release Clause'],
    derived: ['Years Remaining', 'Total Value'],
    drilldowns: ['→ Player', '→ Club', '→ Agent']
  },
  INJURIES: {
    sources: ['noisefeed', 'internal'],
    fields: ['Injury ID', 'Type', 'Body Part', 'Start/End Date', 'Severity'],
    derived: ['Days Out', 'Games Missed', 'Injury Proneness'],
    drilldowns: ['→ Player', '→ Fixtures Missed']
  },
  SCOUTING: {
    sources: ['scoutastic', 'internal'],
    fields: ['Report ID', 'Scout', 'Date', 'Match', 'Rating', 'Notes'],
    derived: ['Avg Rating', 'Report Count'],
    drilldowns: ['→ Player', '→ Fixture', '→ Video Analysis']
  },
  RUMOURS: {
    sources: ['tweet', 'internal'],
    fields: ['Rumour ID', 'Source', 'Date', 'Linked Clubs', 'Fee Mentioned'],
    derived: ['Rumour Volume', 'Interest Level'],
    drilldowns: ['→ Player', '→ Clubs']
  },
  PHYSICAL: {
    sources: ['skillcorner', 'second_spectrum', 'catapult'],
    fields: ['Session ID', 'Date', 'Top Speed', 'Distance', 'Sprints', 'HI Running'],
    derived: ['HI Distance/Min', 'Off-Ball Workrate', 'Physical %ile'],
    drilldowns: ['→ Player', '→ Fixture', '→ Training']
  },
  PLAYER: {
    sources: ['statsbomb', 'transfer_room', 'skillcorner', 'impect', 'scoutastic', 'noisefeed'],
    fields: ['Player ID', 'Name', 'DOB', 'Nationality', 'Height', 'Position', 'Foot'],
    derived: ['Age', 'Market Value Trend', 'Overall Score', 'All Composite Metrics'],
    drilldowns: ['→ Contracts', '→ Injuries', '→ Scouting', '→ Physical', '→ Events']
  }
};

// Minimum metrics categories for PLAYER
const metricsCategories = [
  {
    name: 'Overall',
    score: 7.90,
    percentile: 94,
    color: '#ec4899',
    sources: ['statsbomb', 'impect', 'skillcorner', 'second_spectrum'],
    formula: 'Weighted avg of all categories',
    metrics: ['Position-Adjusted Score', 'Form Trend', 'Minutes Played']
  },
  {
    name: 'Distribution',
    score: 8.42,
    percentile: 92,
    color: '#3b82f6',
    sources: ['statsbomb'],
    formula: 'Pass Acc × 0.3 + Prog Pass × 0.25 + Long Pass × 0.2 + ...',
    metrics: ['Pass Accuracy', 'Prog Pass Acc', 'Long Pass Acc', 'Pass Under Pressure', 'Switch Play Acc']
  },
  {
    name: 'Progression',
    score: 7.68,
    percentile: 86,
    color: '#8b5cf6',
    sources: ['statsbomb', 'impect'],
    formula: 'Prog Carries × 0.3 + Prog Passes × 0.3 + Packing × 0.25 + ...',
    metrics: ['Prog Carries/90', 'Prog Passes/90', 'Packing Value/90', 'Line Breaks/90']
  },
  {
    name: 'Finishing & Chance',
    score: 6.24,
    percentile: 64,
    color: '#ef4444',
    sources: ['statsbomb'],
    formula: 'xG Perf × 0.25 + xA Perf × 0.25 + Shot Quality × 0.2 + ...',
    metrics: ['Goals - xG', 'Assists - xA', 'xG/Shot', 'Chances Created/90']
  },
  {
    name: 'Dribbling',
    score: 7.12,
    percentile: 76,
    color: '#f97316',
    sources: ['statsbomb', 'skillcorner', 'second_spectrum'],
    formula: 'Dribble Success × 0.3 + Take-ons × 0.25 + Carries × 0.25 + Ball Retention × 0.2',
    metrics: ['Dribble Success %', 'Take-ons Won/90', 'Progressive Carries/90', 'Ball Retention Under Pressure', 'Miscontrols/90']
  },
  {
    name: 'Physical (Def)',
    score: 8.14,
    percentile: 88,
    color: '#14b8a6',
    sources: ['skillcorner', 'second_spectrum'],
    formula: 'Press Distance × 0.3 + Sprints × 0.25 + Recovery Runs × 0.25 + ...',
    metrics: ['Pressure Distance/90', 'Defensive Sprints/90', 'Recovery Runs/90', 'Defensive Actions Distance']
  },
  {
    name: 'Physical (Ath)',
    score: 7.84,
    percentile: 82,
    color: '#06b6d4',
    sources: ['skillcorner', 'second_spectrum', 'catapult'],
    formula: 'Top Speed × 0.2 + HI Distance × 0.25 + Total Distance × 0.2 + ...',
    metrics: ['Top Speed', 'HI Distance/Min', 'Total Distance/90', 'Sprint Count/90', 'Off-Ball Workrate']
  },
  {
    name: 'Defending',
    score: 6.92,
    percentile: 71,
    color: '#eab308',
    sources: ['statsbomb'],
    formula: 'Tackle Success × 0.25 + Aerial × 0.2 + Interceptions × 0.2 + ...',
    metrics: ['Tackle Success %', 'Aerial Duel %', 'Interceptions/90', 'Ball Recoveries/90']
  },
  {
    name: 'Pressing',
    score: 8.26,
    percentile: 89,
    color: '#22c55e',
    sources: ['statsbomb', 'impect', 'second_spectrum'],
    formula: 'Pressure Count × 0.25 + Success × 0.3 + Counter-Press × 0.25 + ...',
    metrics: ['Pressures/90', 'Pressure Success %', 'Counter-Press/90', 'Pressure Regains/90']
  }
];

// Entity Node Component
const EntityNode = ({ id, x, y, size, selected, onClick, highlighted }) => {
  const data = entityData[id];
  const isPlayer = id === 'PLAYER';
  const radius = size / 2;
  
  return (
    <g 
      className="cursor-pointer transition-all duration-300"
      onClick={() => onClick(id)}
      style={{ filter: highlighted === false ? 'opacity(0.3)' : 'none' }}
    >
      {/* Selection ring */}
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={radius + 8}
          fill="none"
          stroke="#06b6d4"
          strokeWidth={3}
          className="animate-pulse"
        />
      )}
      
      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={isPlayer ? '#1e3a5f' : '#3b4261'}
        stroke={isPlayer ? '#06b6d4' : selected ? '#06b6d4' : '#4b5563'}
        strokeWidth={isPlayer ? 4 : 2}
        className="transition-all duration-200 hover:brightness-125"
      />
      
      {/* Entity name */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={size > 100 ? 16 : size > 60 ? 12 : 10}
        fontWeight="600"
        fontFamily="system-ui"
      >
        {id}
      </text>
      
      {/* Source count badge */}
      {data && (
        <g>
          <circle cx={x + radius - 5} cy={y - radius + 5} r={10} fill="#06b6d4" />
          <text
            x={x + radius - 5}
            y={y - radius + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={9}
            fontWeight="bold"
          >
            {data.sources.length}
          </text>
        </g>
      )}
    </g>
  );
};

// Metrics Ring for PLAYER entity
const MetricsRing = ({ x, y, baseRadius, metrics, onMetricClick, selectedMetric }) => {
  const ringRadius = baseRadius + 70;
  
  // Determine label position based on angle
  // Top 3 (indices 0, 1, 8): labels above
  // Bottom 2 (indices 4, 5): labels below  
  // Middle 4 (indices 2, 3, 6, 7): labels on sides
  const getLabelPosition = (index, total) => {
    // Positions: 0=top, going clockwise
    // 0, 1, 8 = top area (label above)
    // 2, 3 = right side (label right)
    // 4, 5 = bottom area (label below)
    // 6, 7 = left side (label left)
    if (index === 0 || index === 1 || index === total - 1) return 'top';
    if (index === 4 || index === 5) return 'bottom';
    if (index === 2 || index === 3) return 'right';
    return 'left';
  };
  
  return (
    <g>
      {/* Semi-transparent background overlay */}
      <circle
        cx={x}
        cy={y}
        r={ringRadius + 60}
        fill="rgba(15, 23, 42, 0.85)"
      />
      
      {metrics.map((metric, i) => {
        const angle = (i / metrics.length) * 2 * Math.PI - Math.PI / 2;
        const mx = x + Math.cos(angle) * ringRadius;
        const my = y + Math.sin(angle) * ringRadius;
        const isSelected = selectedMetric === metric.name;
        const nodeRadius = 32 + (metric.percentile / 100) * 10;
        const labelPos = getLabelPosition(i, metrics.length);
        
        // Calculate label offset based on position
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
            {/* Connection line */}
            <line
              x1={x + Math.cos(angle) * baseRadius}
              y1={y + Math.sin(angle) * baseRadius}
              x2={mx}
              y2={my}
              stroke={metric.color}
              strokeWidth={isSelected ? 3 : 1.5}
              opacity={0.6}
            />
            
            {/* Selection ring */}
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
            
            {/* Metric circle */}
            <circle
              cx={mx}
              cy={my}
              r={nodeRadius}
              fill={`${metric.color}40`}
              stroke={metric.color}
              strokeWidth={isSelected ? 4 : 2.5}
              className="transition-all duration-200 hover:brightness-125"
            />
            
            {/* Score */}
            <text
              x={mx}
              y={my - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={14}
              fontWeight="800"
            >
              {metric.score}
            </text>
            
            {/* Percentile */}
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
            
            {/* Label - positioned based on location */}
            <text
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              dominantBaseline={labelPos === 'bottom' ? 'hanging' : labelPos === 'top' ? 'auto' : 'middle'}
              fill="white"
              fontSize={12}
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

// Detail Panel Component
const DetailPanel = ({ entity, metric, onClose }) => {
  if (!entity && !metric) return null;
  
  const data = entity ? entityData[entity] : null;
  
  return (
    <div className="absolute right-4 top-4 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 px-5 py-4 flex items-center justify-between border-b border-slate-700/50">
        <div>
          <h3 className="font-bold text-white text-lg">{metric ? metric.name : entity}</h3>
          {metric && <p className="text-xs text-slate-400 mt-0.5">Composite Metric</p>}
          {entity && <p className="text-xs text-slate-400 mt-0.5">Data Entity</p>}
        </div>
        <button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        {/* Entity View */}
        {entity && data && (
          <>
            {/* Data Sources */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Data Sources</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.sources.map(src => (
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
            
            {/* Raw Fields */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Raw Fields</h4>
              <div className="bg-slate-800/50 rounded-xl p-3 space-y-1.5">
                {data.fields.map((field, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    {field}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Derived */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Derived / Calculated</h4>
              <div className="bg-amber-900/20 rounded-xl p-3 border border-amber-700/30 space-y-1.5">
                {data.derived.map((field, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {field}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Drilldowns */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Drill-downs</h4>
              <div className="bg-cyan-900/20 rounded-xl p-3 border border-cyan-700/30 space-y-1.5">
                {data.drilldowns.map((dd, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-cyan-300">
                    <span className="text-cyan-500">↳</span>
                    {dd}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Special: PLAYER metrics hint */}
            {entity === 'PLAYER' && (
              <div className="bg-pink-900/20 rounded-xl p-4 border border-pink-700/30">
                <p className="text-sm text-pink-300">
                  💡 Click the colored metric circles around PLAYER to see the composite score breakdown
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Metric View */}
        {metric && (
          <>
            {/* Score Display */}
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
                style={{ backgroundColor: `${metric.color}30`, border: `2px solid ${metric.color}` }}
              >
                <span className="text-2xl font-bold text-white">{metric.score}</span>
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
            
            {/* Formula */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Composite Formula</h4>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <code className="text-xs text-pink-400 font-mono">{metric.formula}</code>
              </div>
            </div>
            
            {/* Data Sources */}
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
            
            {/* Component Metrics */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Derived Metrics in Category</h4>
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
          </>
        )}
      </div>
    </div>
  );
};

// Main App Component
const GameScopeDataArchitecture = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showMetricsRing, setShowMetricsRing] = useState(false);
  
  const handleEntityClick = (id) => {
    setSelectedMetric(null);
    if (id === 'PLAYER') {
      setShowMetricsRing(!showMetricsRing);
      setSelectedEntity(id);
    } else {
      setShowMetricsRing(false);
      setSelectedEntity(selectedEntity === id ? null : id);
    }
  };
  
  const handleMetricClick = (metric) => {
    setSelectedEntity(null);
    setSelectedMetric(selectedMetric?.name === metric.name ? null : metric);
  };
  
  const handleClose = () => {
    setSelectedEntity(null);
    setSelectedMetric(null);
  };

  // Entity positions
  const entities = [
    { id: 'CLUB', x: 200, y: 80, size: 100 },
    { id: 'COMPETITION', x: 320, y: 100, size: 65 },
    { id: 'FIXTURE', x: 420, y: 180, size: 110 },
    { id: 'EVENT', x: 400, y: 320, size: 80 },
    { id: 'VIDEO', x: 520, y: 400, size: 90 },
    { id: 'TIMELINE', x: 460, y: 420, size: 55 },
    { id: 'PLAYER', x: 200, y: 360, size: 120 },
    { id: 'SCOUTING', x: 280, y: 220, size: 60 },
    { id: 'RUMOURS', x: 60, y: 260, size: 60 },
    { id: 'CONTRACTS', x: 50, y: 360, size: 60 },
    { id: 'INJURIES', x: 80, y: 460, size: 60 },
    { id: 'PHYSICAL', x: 240, y: 490, size: 60 },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">GameScope Data Architecture</h1>
            <p className="text-sm text-slate-400">Click entities to explore • Click PLAYER for metrics breakdown</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-full border-2 border-cyan-500"></span>
              <span>Core Entity</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              <span>Composite Metric</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* SVG Diagram */}
      <svg viewBox="0 0 600 580" className="w-full h-screen pt-16">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
          </marker>
        </defs>
        
        {/* Connection lines */}
        <g stroke="#4b5563" strokeWidth={1.5} fill="none">
          {/* Match context flow */}
          <path d="M 250 80 Q 285 90 320 100" markerEnd="url(#arrow)" />
          <path d="M 352 100 Q 386 140 420 180" markerEnd="url(#arrow)" />
          <path d="M 420 235 L 400 275" markerEnd="url(#arrow)" />
          <path d="M 440 320 L 460 375" markerEnd="url(#arrow)" />
          <path d="M 488 420 L 520 400" />
          
          {/* Player context flow */}
          <path d="M 200 130 L 200 300" markerEnd="url(#arrow)" />
          <path d="M 280 250 L 240 320" markerEnd="url(#arrow)" />
          <path d="M 95 290 L 160 340" markerEnd="url(#arrow)" />
          <path d="M 85 360 L 140 360" markerEnd="url(#arrow)" />
          <path d="M 115 430 L 160 400" markerEnd="url(#arrow)" />
          <path d="M 210 460 L 200 420" markerEnd="url(#arrow)" />
          
          {/* KEY: Event to Player */}
          <path 
            d="M 360 320 L 260 360" 
            stroke="#06b6d4" 
            strokeWidth={3}
            strokeDasharray="8,4"
            markerEnd="url(#arrow)"
          />
        </g>
        
        {/* Flow labels */}
        <text x="480" y="130" fill="#06b6d4" fontSize={10} fontWeight="600" opacity={0.7}>MATCH CONTEXT</text>
        <text x="30" y="220" fill="#c026d3" fontSize={10} fontWeight="600" opacity={0.7}>PLAYER CONTEXT</text>
        <text x="290" y="325" fill="#06b6d4" fontSize={9}>player_id</text>
        
        {/* Metrics ring around PLAYER (when active) */}
        {showMetricsRing && (
          <MetricsRing
            x={200}
            y={360}
            baseRadius={60}
            metrics={metricsCategories}
            onMetricClick={handleMetricClick}
            selectedMetric={selectedMetric?.name}
          />
        )}
        
        {/* Entity nodes */}
        {entities.map(ent => (
          <EntityNode
            key={ent.id}
            {...ent}
            selected={selectedEntity === ent.id}
            onClick={handleEntityClick}
            highlighted={showMetricsRing ? ent.id === 'PLAYER' : true}
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute left-4 bottom-4 bg-slate-800/90 backdrop-blur rounded-xl border border-slate-700 p-4 max-w-xs">
        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Data Sources</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {Object.entries(dataSourceColors).slice(0, 12).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: color }}></span>
              <span className="text-slate-400">{key}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      {!selectedEntity && !selectedMetric && (
        <div className="absolute right-4 top-20 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700 p-4 max-w-xs">
          <h4 className="text-sm font-medium text-white mb-2">How to use</h4>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li>• Click any <span className="text-slate-200">entity circle</span> to see its data sources and fields</li>
            <li>• Click <span className="text-cyan-400">PLAYER</span> to reveal the 9 composite metric categories</li>
            <li>• Click a <span className="text-pink-400">metric circle</span> to see how it's calculated</li>
            <li>• The number badge shows how many data sources feed each entity</li>
          </ul>
        </div>
      )}
      
      {/* Detail Panel */}
      <DetailPanel 
        entity={selectedEntity} 
        metric={selectedMetric}
        onClose={handleClose}
      />
    </div>
  );
};

export default GameScopeDataArchitecture;
