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

const baseMetrics = [
  { name: 'Overall', color: '#ec4899', sources: ['statsbomb', 'impect', 'skillcorner', 'second_spectrum'], formula: 'Weighted avg of all categories', metrics: ['Position-Adjusted Score', 'Form Trend', 'Minutes Played'] },
  { name: 'Distribution', color: '#3b82f6', sources: ['statsbomb'], formula: 'Pass Acc × 0.3 + Prog Pass × 0.25 + Long Pass × 0.2 + ...', metrics: ['Pass Accuracy', 'Prog Pass Acc', 'Long Pass Acc', 'Pass Under Pressure', 'Switch Play Acc'] },
  { name: 'Progression', color: '#8b5cf6', sources: ['statsbomb', 'impect'], formula: 'Prog Carries × 0.3 + Prog Passes × 0.3 + Packing × 0.25 + ...', metrics: ['Prog Carries/90', 'Prog Passes/90', 'Packing Value/90', 'Line Breaks/90'] },
  { name: 'Finishing', color: '#ef4444', sources: ['statsbomb'], formula: 'xG Perf × 0.25 + xA Perf × 0.25 + Shot Quality × 0.2 + ...', metrics: ['Goals - xG', 'Assists - xA', 'xG/Shot', 'Chances Created/90'] },
  { name: 'Dribbling', color: '#f97316', sources: ['statsbomb', 'skillcorner', 'second_spectrum'], formula: 'Dribble Success × 0.3 + Take-ons × 0.25 + Carries × 0.25 + Ball Retention × 0.2', metrics: ['Dribble Success %', 'Take-ons Won/90', 'Progressive Carries/90', 'Ball Retention Under Pressure'] },
  { name: 'Physical (Def)', color: '#14b8a6', sources: ['skillcorner', 'second_spectrum'], formula: 'Press Distance × 0.3 + Sprints × 0.25 + Recovery Runs × 0.25 + ...', metrics: ['Pressure Distance/90', 'Defensive Sprints/90', 'Recovery Runs/90', 'Defensive Actions Distance'] },
  { name: 'Physical (Ath)', color: '#06b6d4', sources: ['skillcorner', 'second_spectrum', 'catapult'], formula: 'Top Speed × 0.2 + HI Distance × 0.25 + Total Distance × 0.2 + ...', metrics: ['Top Speed', 'HI Distance/Min', 'Total Distance/90', 'Sprint Count/90', 'Off-Ball Workrate'] },
  { name: 'Defending', color: '#eab308', sources: ['statsbomb'], formula: 'Tackle Success × 0.25 + Aerial × 0.2 + Interceptions × 0.2 + ...', metrics: ['Tackle Success %', 'Aerial Duel %', 'Interceptions/90', 'Ball Recoveries/90'] },
  { name: 'Pressing', color: '#22c55e', sources: ['statsbomb', 'impect', 'second_spectrum'], formula: 'Pressure Count × 0.25 + Success × 0.3 + Counter-Press × 0.25 + ...', metrics: ['Pressures/90', 'Pressure Success %', 'Counter-Press/90', 'Pressure Regains/90'] }
];

const metricsBySeason = {
  '24/25': [7.90, 7.50, 7.70, 4.50, 6.40, 8.50, 8.20, 7.80, 8.50],
  '23/24': [7.60, 7.30, 7.40, 4.20, 6.10, 8.20, 7.90, 7.50, 8.20],
  '22/23': [6.80, 6.50, 6.60, 3.50, 5.80, 7.40, 7.20, 6.90, 7.50],
  '21/22': [6.20, 6.00, 6.10, 3.20, 5.40, 6.80, 6.60, 6.40, 6.90],
  '20/21': [5.50, 5.30, 5.40, 2.80, 4.90, 6.00, 5.80, 5.70, 6.10],
  '19/20': [4.80, 4.60, 4.70, 2.40, 4.30, 5.20, 5.00, 4.90, 5.30],
};

const getMetricsForSeason = (season) => {
  const scores = metricsBySeason[season] || metricsBySeason['24/25'];
  return baseMetrics.map((m, i) => ({
    ...m,
    score: scores[i],
    percentile: Math.round(scores[i] * 10)
  }));
};

const santosMetrics = getMetricsForSeason('24/25');

const recruitMetrics = [
  { name: 'Scouting', color: '#8b5cf6', score: 8.2, percentile: 82, sources: ['scoutastic', 'internal'], formula: 'Scout Reports × 0.4 + Video Analysis × 0.3 + Live Views × 0.3', metrics: ['Scout Reports Filed', 'Video Sessions Completed', 'Live Matches Watched', 'Profile Completeness'], icon: '🔍' },
  { name: 'Physical', color: '#06b6d4', score: 8.5, percentile: 85, sources: ['skillcorner', 'catapult', 'second_spectrum'], formula: 'Athleticism × 0.3 + Durability × 0.3 + Workload Capacity × 0.4', metrics: ['Top Speed', 'Sprint Distance/90', 'HI Running/90', 'Recovery Metrics'], icon: '💪' },
  { name: 'Injuries', color: '#ef4444', score: 8.9, percentile: 89, sources: ['catapult', 'internal'], formula: 'Injury History × 0.4 + Recovery Time × 0.3 + Availability % × 0.3', metrics: ['Major Injuries', 'Days Missed (3yr)', 'Availability %', 'Current Status'], icon: '🏥' },
  { name: 'Contracts', color: '#22c55e', score: 7.8, percentile: 78, sources: ['transfer_room', 'internal'], formula: 'Contract Length × 0.25 + Wage Fit × 0.35 + Release Clause × 0.2 + Agent Fee × 0.2', metrics: ['Contract Expires', 'Wage Demands', 'Release Clause', 'Agent Fee Est.'], icon: '📝' },
  { name: 'Rumours', color: '#f97316', score: 6.5, percentile: 65, sources: ['noisefeed', 'transfer_room'], formula: 'Media Mentions × 0.3 + Club Interest × 0.4 + Agent Activity × 0.3', metrics: ['Media Mentions', 'Clubs Interested', 'Agent Contacts', 'Social Media Activity'], icon: '📰' },
  { name: 'WhatsApp', color: '#25d366', score: 7.2, percentile: 72, sources: ['internal'], formula: 'Messages × 0.3 + Engagement × 0.4 + Response Time × 0.3', metrics: ['Total Messages', 'Active Participants', 'Last Activity', 'Key Decisions'], icon: '💬' },
  { name: 'Timeline', color: '#f59e0b', score: 7.5, percentile: 75, sources: ['internal'], formula: 'Activities × 0.4 + Recency × 0.3 + Progress × 0.3', metrics: ['Total Activities', 'Days Since First Contact', 'Current Stage', 'Next Action'], icon: '📅' },
];

const santosWhatsApp = {
  groupName: 'RB Target - Tiago Santos',
  participants: ['Paul Mitchell', 'Eddie Howe', 'Steve Nickson', 'Andy Howe'],
  messages: [
    { sender: 'Paul Mitchell', time: '10:32', text: 'Just got off the call with his agent. They\'re open to talks in January.' },
    { sender: 'Eddie Howe', time: '10:45', text: 'What are the wage expectations? Need to factor that into budget.' },
    { sender: 'Paul Mitchell', time: '10:48', text: 'Around €50k/week. Within our range for RB position.' },
    { sender: 'Steve Nickson', time: '11:02', text: 'Scout report from Lille game last week is in. Very impressive in 1v1 duels.' },
    { sender: 'Andy Howe', time: '11:15', text: 'Medical team flagged minor hamstring issue from 2023. Need full records.' },
    { sender: 'Eddie Howe', time: '11:30', text: 'Let\'s schedule a call with Lille sporting director this week.' },
  ]
};

const santosTimeline = [
  { date: 'Dec 8, 2024', type: 'scout', title: 'Live Scout Visit', desc: 'Steve Nickson attended Lille vs Lyon (Ligue 1)', icon: '👁️' },
  { date: 'Dec 5, 2024', type: 'video', title: 'Video Analysis Session', desc: 'Reviewed 5 matches from current season', icon: '🎬' },
  { date: 'Dec 2, 2024', type: 'call', title: 'Agent Call', desc: 'Initial discussion with player representative', icon: '📞' },
  { date: 'Nov 28, 2024', type: 'meeting', title: 'Internal Meeting', desc: 'Added to priority shortlist for January window', icon: '📋' },
  { date: 'Nov 20, 2024', type: 'report', title: 'Scout Report Filed', desc: 'Comprehensive profile created by recruitment team', icon: '📄' },
  { date: 'Nov 15, 2024', type: 'added', title: 'Added to Watchlist', desc: 'Player identified as potential RB target', icon: '⭐' },
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

const santosClubs = {
  current: 'LOSC Lille',
  clubs: [
    {
      name: 'Lille',
      badge: '/clubs/lille.png',
      seasons: [
        { season: '24/25', apps: 18, goals: 2, assists: 1 },
        { season: '23/24', apps: 44, goals: 2, assists: 3 },
      ]
    },
    {
      name: 'Estoril',
      badge: '/clubs/estoril.png',
      seasons: [
        { season: '22/23', apps: 32, goals: 0, assists: 4 },
        { season: '21/22', apps: 22, goals: 0, assists: 3 },
      ]
    },
    {
      name: 'Sporting CP U23',
      badge: '/clubs/sporting.png',
      seasons: [
        { season: '20/21', apps: 17, goals: 0, assists: 0 },
      ]
    },
    {
      name: 'Estoril U23',
      badge: '/clubs/estoril.png',
      seasons: [
        { season: '19/20', apps: 16, goals: 1, assists: 2 },
      ]
    },
  ],
  statsByClub: [
    { club: 'Lille', appearances: 62, goals: 4, assists: 4 },
    { club: 'Estoril', appearances: 54, goals: 0, assists: 7 },
    { club: 'Sporting CP U23', appearances: 17, goals: 0, assists: 0 },
    { club: 'Estoril U23', appearances: 16, goals: 1, assists: 2 },
  ],
  transferHistory: [
    { season: '23/24', from: 'Estoril', to: 'Lille', fee: '€6.50m', mv: '€3.50m' },
    { season: '22/23', from: 'Estoril U23', to: 'Estoril', fee: '-' },
    { season: '21/22', from: 'Sporting CP U23', to: 'Estoril U23', fee: 'Free' },
  ],
  youthClubs: ['Sporting CP', 'AD Oeiras', 'SG Sacavenense', 'Estoril Praia']
};

const MetricsRing = ({ x, y, baseRadius, metrics, onMetricClick, selectedMetric, selectedEntity }) => {
  const ringRadius = baseRadius + 120;
  
  const getLabelPosition = (index, total) => {
    if (total === 7) {
      if (index === 0) return 'top';
      if (index === 1 || index === 2) return 'right';
      if (index === 3 || index === 4) return 'bottom';
      if (index === 5 || index === 6) return 'left';
    }
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
        const isSelected = selectedMetric === metric.name || selectedEntity === metric.name;
        const nodeRadius = 32 + (metric.percentile / 100) * 10;
        const labelPos = getLabelPosition(i, metrics.length);
        const hasIcon = !!metric.icon;
        
        const lineEndX = mx - Math.cos(angle) * nodeRadius;
        const lineEndY = my - Math.sin(angle) * nodeRadius;
        
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
              x2={lineEndX}
              y2={lineEndY}
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
            
            {hasIcon ? (
              <text
                x={mx}
                y={my + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={22}
              >
                {metric.icon}
              </text>
            ) : (
              <>
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
              </>
            )}
            
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

const DetailPanel = ({ metric, entity, onClose }) => {
  if (!metric && !entity) return null;
  
  return (
    <div className="absolute right-4 top-4 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="bg-slate-800/80 px-5 py-4 flex items-center justify-between border-b border-slate-700/50">
        <div>
          <h3 className="font-bold text-white text-lg">{metric ? metric.name : entity}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{metric ? 'Composite Metric' : 'Data Entity'}</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        {metric && (
          <>
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
          </>
        )}
        
        {entity === 'Club' && (
          <>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Current Club</h4>
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                <div className="text-lg font-bold text-white">{santosClubs.current}</div>
                <div className="text-sm text-blue-300 mt-1">Ligue 1 • France</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Stats by Club</h4>
              <div className="space-y-2">
                {santosClubs.statsByClub.map((club, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="font-medium text-white">{club.club}</div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-slate-400">Apps: <span className="text-white">{club.appearances}</span></span>
                      <span className="text-slate-400">Goals: <span className="text-white">{club.goals}</span></span>
                      <span className="text-slate-400">Assists: <span className="text-white">{club.assists}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Transfer History</h4>
              <div className="space-y-2">
                {santosClubs.transferHistory.map((transfer, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">{transfer.season}</div>
                      <div className="text-white">{transfer.from} → {transfer.to}</div>
                    </div>
                    <div className="text-green-400 font-medium">{transfer.fee}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Youth Clubs</h4>
              <div className="flex flex-wrap gap-2">
                {santosClubs.youthClubs.map((club, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm text-slate-300">
                    {club}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PlayerVisualizer = ({ playerAvatar }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('24/25');
  const [activeMode, setActiveMode] = useState('recruit'); // 'club' or 'recruit'
  
  const currentMetrics = activeMode === 'club' ? getMetricsForSeason(selectedSeason) : recruitMetrics;
  
  const handleMetricClick = (metric) => {
    if (metric.name === 'WhatsApp' || metric.name === 'Timeline') {
      setSelectedMetric(null);
      setSelectedEntity(selectedEntity === metric.name ? null : metric.name);
    } else {
      setSelectedEntity(null);
      setSelectedMetric(selectedMetric?.name === metric.name ? null : metric);
    }
  };
  
  const handleEntityClick = (entity) => {
    setSelectedMetric(null);
    if (entity === 'Club') {
      setActiveMode('club');
    } else if (entity === 'Overview') {
      setActiveMode('recruit');
    }
    setSelectedEntity(selectedEntity === entity ? null : entity);
  };
  
  const handleSeasonClick = (season) => {
    setSelectedSeason(season);
  };
  
  const handleClose = () => {
    setSelectedMetric(null);
    setSelectedEntity(null);
  };
  
  const centerX = 220;
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
      
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-700 overflow-hidden flex" style={{ height: '600px' }}>
        
        <div className="w-36 border-r border-slate-600 flex flex-col items-center p-3 gap-2 overflow-y-auto">
          <div className="flex flex-col items-center gap-0.5">
            <div 
              onClick={() => handleEntityClick('Overview')}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all
                ${selectedEntity === 'Overview'
                  ? 'border-2 border-cyan-400 ring-3 ring-cyan-400/30' 
                  : 'border-2 border-slate-500 hover:border-slate-400'}`}
              style={{ backgroundColor: '#1e293b' }}
            >
              <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Profile</span>
          </div>
          
          <div className="flex flex-col items-center gap-0.5">
            <div 
              onClick={() => handleEntityClick('Club')}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all overflow-hidden
                ${selectedEntity === 'Club' || activeMode === 'club'
                  ? 'border-2 border-blue-400 ring-3 ring-blue-400/30' 
                  : 'border-2 border-slate-500 hover:border-slate-400'}`}
              style={{ backgroundColor: '#1e293b' }}
            >
              <img 
                src={santosClubs.clubs[0].badge} 
                alt="Current Club" 
                className="w-9 h-9 object-contain"
              />
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Club</span>
          </div>
          
        </div>
        
        <div className="flex-1 border-r border-slate-600 relative">
          <svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            <circle cx={250} cy={centerY} r={playerRadius + 30} fill="url(#playerGlow)" />
            
            <MetricsRing
              x={250}
              y={centerY}
              baseRadius={playerRadius}
              metrics={currentMetrics}
              onMetricClick={handleMetricClick}
              selectedMetric={selectedMetric?.name}
              selectedEntity={selectedEntity}
            />
            
            <circle
              cx={250}
              cy={centerY}
              r={playerRadius + 4}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={3}
            />
            
            <clipPath id="playerClip">
              <circle cx={250} cy={centerY} r={playerRadius} />
            </clipPath>
            
            <circle
              cx={250}
              cy={centerY}
              r={playerRadius}
              fill="#1e3a5f"
            />
            
            <image
              href={santosPlayer.image}
              x={250 - playerRadius}
              y={centerY - playerRadius}
              width={playerRadius * 2}
              height={playerRadius * 2}
              clipPath="url(#playerClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            
            <text
              x={250}
              y={centerY + playerRadius + 25}
              textAnchor="middle"
              fill="white"
              fontSize={16}
              fontWeight="700"
            >
              {santosPlayer.name}
            </text>
            <text
              x={250}
              y={centerY + playerRadius + 45}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={12}
            >
              {santosPlayer.position} • {santosPlayer.age} yrs • {santosPlayer.marketValue}
            </text>
          </svg>
          
          <div className="absolute top-4 left-4 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{activeMode === 'club' ? 'Season' : 'Mode'}</span>
            <div className="text-sm font-semibold text-white">{activeMode === 'club' ? selectedSeason : 'Recruit Intel'}</div>
          </div>
          
          <div className="absolute bottom-4 right-4 text-xs text-slate-500">
            Click metrics to see breakdown
          </div>
        </div>
        
        <div className="w-80 border-l border-slate-600 bg-slate-900/50 overflow-y-auto">
          {!selectedMetric && !selectedEntity && (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center text-slate-500">
                <div className="text-lg font-medium mb-2">Select a metric or entity</div>
                <div className="text-sm">Click any metric circle or entity node to see details</div>
              </div>
            </div>
          )}
          
          {(selectedMetric || selectedEntity) && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedMetric ? selectedMetric.name : selectedEntity}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedMetric ? 'Composite Metric' : 
                      selectedEntity === 'Club' ? 'Club History' : 
                      selectedEntity === 'Recruit' ? 'Recruitment Intelligence' :
                      selectedEntity === 'Overview' ? 'Player Profile' :
                      selectedEntity === 'WhatsApp' ? 'Group Chat' :
                      selectedEntity === 'Timeline' ? 'Activity Log' : ''}
                  </p>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {selectedMetric && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                      style={{ backgroundColor: `${selectedMetric.color}30`, border: `2px solid ${selectedMetric.color}` }}
                    >
                      <span className="text-xl font-bold text-white">{selectedMetric.score.toFixed(1)}</span>
                      <span className="text-[10px]" style={{ color: selectedMetric.color }}>{selectedMetric.percentile}%ile</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Percentile vs Position</div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ width: `${selectedMetric.percentile}%`, backgroundColor: selectedMetric.color }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Formula</h4>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <code className="text-[10px] text-pink-400 font-mono">{selectedMetric.formula}</code>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Sources</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMetric.sources.map(src => (
                        <span key={src} className="px-2 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: dataSourceColors[src] }}>
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Components</h4>
                    <div className="space-y-1.5">
                      {selectedMetric.metrics.map((m, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded px-2 py-1.5">
                          <span className="text-xs text-slate-300">{m}</span>
                          <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${60 + Math.random() * 35}%`, backgroundColor: selectedMetric.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedEntity === 'Club' && (
                <div className="space-y-5">
                  {santosClubs.clubs.map((club, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-3">
                        {club.badge ? (
                          <img src={club.badge} alt={club.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium">
                            {club.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-white">{club.name}</span>
                      </div>
                      
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-1.5 text-slate-400 font-medium">Season</th>
                            <th className="text-center py-1.5 text-slate-400 font-medium">Apps</th>
                            <th className="text-center py-1.5 text-slate-400 font-medium">Goals</th>
                            <th className="text-center py-1.5 text-slate-400 font-medium">Assists</th>
                          </tr>
                        </thead>
                        <tbody>
                          {club.seasons.map((row, i) => (
                            <tr 
                              key={i} 
                              onClick={() => handleSeasonClick(row.season)}
                              className={`border-b border-slate-800/30 cursor-pointer transition-colors
                                ${selectedSeason === row.season 
                                  ? 'bg-blue-900/40 border-blue-500/30' 
                                  : 'hover:bg-slate-800/50'}`}
                            >
                              <td className="py-1.5 text-white flex items-center gap-2">
                                {selectedSeason === row.season && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                {row.season}
                              </td>
                              <td className="text-center py-1.5 text-white">{row.apps}</td>
                              <td className="text-center py-1.5 text-white">{row.goals}</td>
                              <td className="text-center py-1.5 text-white">{row.assists}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedEntity === 'Recruit' && (
                <div className="space-y-4">
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                    <div className="text-xs text-purple-300 font-medium mb-1">Recruitment Intel Mode</div>
                    <p className="text-[11px] text-slate-400">Showing recruitment-focused metrics: scouting reports, transfer rumours, contract intel, injury history, and physical profiles.</p>
                  </div>
                  
                  <div className="space-y-3">
                    {recruitMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                            <span className="text-sm font-medium text-white">{metric.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{metric.score.toFixed(1)}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${metric.color}30`, color: metric.color }}>
                              {metric.percentile}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${metric.percentile}%`, backgroundColor: metric.color }} />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {metric.sources.map(src => (
                            <span key={src} className="px-1.5 py-0.5 rounded text-[8px] font-medium text-white" style={{ backgroundColor: dataSourceColors[src] }}>
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEntity === 'Overview' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={santosPlayer.image} 
                      alt={santosPlayer.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white">{santosPlayer.name}</h4>
                      <p className="text-sm text-slate-400">{santosPlayer.position} • {santosPlayer.club}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 uppercase">Age</div>
                      <div className="text-sm font-semibold text-white">{santosPlayer.age} years</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 uppercase">Nationality</div>
                      <div className="text-sm font-semibold text-white">{santosPlayer.nationality}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 uppercase">Height</div>
                      <div className="text-sm font-semibold text-white">{santosPlayer.height}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-500 uppercase">Foot</div>
                      <div className="text-sm font-semibold text-white">{santosPlayer.foot}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2.5 col-span-2">
                      <div className="text-[10px] text-slate-500 uppercase">Market Value</div>
                      <div className="text-lg font-bold text-cyan-400">{santosPlayer.marketValue}</div>
                    </div>
                  </div>
                  
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 mt-4">
                    <div className="text-xs text-cyan-300 font-medium mb-1">Recruitment Status</div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-white">Active Target - January Window</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedEntity === 'WhatsApp' && (
                <div className="space-y-3">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <div className="text-xs text-green-300 font-medium">{santosWhatsApp.groupName}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{santosWhatsApp.participants.join(', ')}</div>
                  </div>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {santosWhatsApp.messages.map((msg, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-green-400">{msg.sender}</span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-xs text-slate-300">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                    <button className="px-3 py-2 bg-green-600 rounded-lg text-xs font-medium text-white hover:bg-green-500 transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              )}
              
              {selectedEntity === 'Timeline' && (
                <div className="space-y-3">
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                    <div className="text-xs text-amber-300 font-medium">Activity Timeline</div>
                    <div className="text-[10px] text-slate-400 mt-1">Recent recruitment activities for this player</div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
                    
                    <div className="space-y-3">
                      {santosTimeline.map((item, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className="absolute left-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-xs">
                            {item.icon}
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-white">{item.title}</span>
                              <span className="text-[10px] text-slate-500">{item.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerVisualizer;
