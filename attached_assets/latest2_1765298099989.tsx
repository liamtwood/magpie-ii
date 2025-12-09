import React, { useState } from 'react';
import { 
  Users, Search, ClipboardList, User, Target, BarChart3, Video,
  ChevronDown, ChevronUp, ChevronRight, Plus, Star, AlertCircle,
  PoundSterling, CalendarDays, MessageSquare, Pause, CheckCircle2, 
  Circle, Clock, TrendingUp, Activity, Zap, Shield, Heart,
  Send, X, MoreHorizontal, Filter, ArrowUpDown
} from 'lucide-react';

// ============================================================================
// MAGPIE II - Newcastle United Recruitment Platform
// Updated with Shortlist CRM functionality
// ============================================================================

// Data source badge component
const SourceBadge = ({ source }) => {
  const sources = {
    statsbomb: { label: 'SB', color: 'bg-blue-600', full: 'StatsBomb' },
    impect: { label: 'IMP', color: 'bg-purple-600', full: 'Impect' },
    secondspectrum: { label: 'SS', color: 'bg-orange-600', full: 'Second Spectrum' },
    skillcorner: { label: 'SC', color: 'bg-cyan-600', full: 'SkillCorner' },
    noisefeed: { label: 'NF', color: 'bg-red-600', full: 'Noisefeed' },
    scoutastic: { label: 'SCT', color: 'bg-green-600', full: 'Scoutastic' },
    transferroom: { label: 'TR', color: 'bg-yellow-600', full: 'Transfer Room' },
  };
  const s = sources[source] || { label: '?', color: 'bg-gray-600', full: source };
  return (
    <span className={`${s.color} text-white px-1.5 py-0.5 rounded text-[10px] font-medium`} title={s.full}>
      {s.label}
    </span>
  );
};

// Injury risk badge
const InjuryBadge = ({ risk, daysOut }) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${colors[risk]} bg-opacity-20`}>
      <span className={`w-2 h-2 rounded-full ${colors[risk]}`} />
      <span className="text-xs text-gray-700">{daysOut}d (12m)</span>
    </div>
  );
};

// Star rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && <Star className="h-3 w-3 fill-amber-200 text-amber-400" />}
      {[...Array(4 - Math.ceil(rating))].map((_, i) => (
        <Star key={`e-${i}`} className="h-3 w-3 text-gray-200" />
      ))}
    </div>
  );
};

// Pipeline indicator for recruitment stages
const PipelineIndicator = ({ stage }) => (
  <div className="flex gap-1">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} className={`w-2 h-2 rounded-sm ${i < stage ? 'bg-blue-500' : 'bg-gray-200'}`} />
    ))}
  </div>
);

// Gate checkbox component
const GateCheckbox = ({ label, checked }) => (
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    {checked ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    ) : (
      <Circle className="h-3.5 w-3.5 text-gray-300" />
    )}
    {label}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MagpieV2() {
  const [activeScreen, setActiveScreen] = useState('shortlists');
  const [expandedShortlist, setExpandedShortlist] = useState('trippier');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hi! I can help you find players, analyze shortlists, or compare candidates. Try: 'Find pressing midfielders under 25'" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Navigation screens
  const screens = [
    { id: 'squad', name: 'Squad', icon: Users },
    { id: 'player-search', name: 'Player Search', icon: Search },
    { id: 'shortlists', name: 'Shortlists', icon: ClipboardList },
    { id: 'player-profile', name: 'Player Profile', icon: User },
  ];

  // Transfer window data
  const currentWindow = {
    name: 'Summer 2025',
    start: 'Jun 10',
    end: 'Aug 31',
    daysRemaining: 85,
  };

  // Current squad data
  const squad = [
    { id: 1, name: 'Nick Pope', position: 'GK', age: 32, contract: '2028', value: '€30M', injury: { risk: 'medium', daysOut: 45 }, flag: null, minutes: 2340 },
    { id: 2, name: 'Kieran Trippier', position: 'RB', age: 34, contract: '2026', value: '€12M', injury: { risk: 'high', daysOut: 67 }, flag: '⚠️ Contract', minutes: 1890 },
    { id: 3, name: 'Sven Botman', position: 'CB', age: 24, contract: '2029', value: '€45M', injury: { risk: 'high', daysOut: 180 }, flag: '🏥 ACL', minutes: 450 },
    { id: 4, name: 'Fabian Schär', position: 'CB', age: 32, contract: '2026', value: '€8M', injury: { risk: 'low', daysOut: 12 }, flag: null, minutes: 2100 },
    { id: 5, name: 'Dan Burn', position: 'CB', age: 32, contract: '2027', value: '€10M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 1980 },
    { id: 6, name: 'Bruno Guimarães', position: 'CM', age: 26, contract: '2028', value: '€100M', injury: { risk: 'low', daysOut: 4 }, flag: '⭐ Key', minutes: 2520 },
    { id: 7, name: 'Sandro Tonali', position: 'CM', age: 24, contract: '2029', value: '€50M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 1200 },
    { id: 8, name: 'Sean Longstaff', position: 'CM', age: 27, contract: '2026', value: '€15M', injury: { risk: 'low', daysOut: 8 }, flag: '⚠️ Saudi Interest', minutes: 1650 },
    { id: 9, name: 'Alexander Isak', position: 'CF', age: 25, contract: '2030', value: '€120M', injury: { risk: 'low', daysOut: 12 }, flag: '⭐ Key', minutes: 2700 },
    { id: 10, name: 'Anthony Gordon', position: 'LW', age: 23, contract: '2029', value: '€75M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 2580 },
  ];

  // Shortlists data (the new CRM model)
  const shortlists = [
    {
      id: 'trippier',
      severity: 'critical',
      position: 'RB',
      title: 'RB Cover - Trippier',
      trigger: 'Contract expiring',
      budget: { transfer: 15000000, wages: 80000 },
      deadline: 82,
      ballHolder: { name: 'Steve Nickson', role: 'Head of Recruitment', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: false, medical: false },
      planA: {
        player: 'Kieran Trippier',
        age: 34,
        status: 'Negotiating',
        statusColor: 'amber',
        issue: 'Wage demands above budget',
        nextAction: 'Meeting with agent - Dec 12',
        confidence: 40,
      },
      planB: [
        { id: 1, name: 'Tiago Santos', club: 'Lille', age: 22, rating: 4, status: 'Agent Contacted', statusStage: 5, fee: '£12M', wages: '£55K/wk' },
        { id: 2, name: 'Vanderson', club: 'Monaco', age: 23, rating: 3.5, status: 'Video Review', statusStage: 2, fee: '£18M', wages: '£70K/wk' },
        { id: 3, name: 'Alex Fresneda', club: 'Sporting CP', age: 20, rating: 3.5, status: 'Data Scouting', statusStage: 1, fee: '£10M', wages: '£40K/wk' },
      ],
    },
    {
      id: 'longstaff',
      severity: 'moderate',
      position: 'CM',
      title: 'CM Depth - Longstaff',
      trigger: 'Interest from Saudi clubs',
      budget: { transfer: 8000000, wages: 50000 },
      deadline: 85,
      ballHolder: { name: 'Eddie Howe', role: 'Manager', avatar: 'EH' },
      gates: { scouting: true, manager: false, budget: false, medical: false },
      planA: {
        player: 'Sean Longstaff',
        age: 27,
        status: 'Monitoring',
        statusColor: 'green',
        issue: 'Saudi offer on table',
        nextAction: 'Player meeting - Dec 15',
        confidence: 65,
      },
      planB: [
        { id: 4, name: 'Sander Berge', club: 'Burnley', age: 26, rating: 3, status: 'Identified', statusStage: 1, fee: '£6M', wages: '£45K/wk' },
        { id: 5, name: 'Adam Wharton', club: 'Crystal Palace', age: 20, rating: 4, status: 'Video Review', statusStage: 2, fee: '£45M', wages: '£60K/wk' },
      ],
    },
    {
      id: 'cb',
      severity: 'moderate',
      position: 'CB',
      title: 'CB Cover - Botman ACL',
      trigger: 'Long-term injury cover',
      budget: { transfer: 25000000, wages: 70000 },
      deadline: 45,
      ballHolder: { name: 'Steve Nickson', role: 'Head of Recruitment', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: true, medical: false },
      planA: null,
      planB: [
        { id: 6, name: 'Marc Guéhi', club: 'Crystal Palace', age: 24, rating: 4, status: 'Club Contact', statusStage: 6, fee: '£65M', wages: '£100K/wk' },
        { id: 7, name: 'Castello Lukeba', club: 'RB Leipzig', age: 21, rating: 3.5, status: 'Live Scouting', statusStage: 3, fee: '£35M', wages: '£60K/wk' },
      ],
    },
  ];

  const deferredShortlists = [
    { id: 'lw', position: 'LW', title: 'LW Upgrade', reason: 'Market overheated - revisit January', targetWindow: 'January 2026' },
  ];

  // Player search targets
  const searchTargets = [
    { id: 101, name: 'Adam Wharton', team: 'Crystal Palace', position: 'CM', age: 20, value: '€45M', rating: 4, sources: ['statsbomb', 'impect', 'scoutastic'] },
    { id: 102, name: 'João Neves', team: 'PSG', position: 'CM', age: 20, value: '€80M', rating: 4.5, sources: ['statsbomb', 'secondspectrum', 'noisefeed'] },
    { id: 103, name: 'Tiago Santos', team: 'Lille', position: 'RB', age: 22, value: '€15M', rating: 4, sources: ['statsbomb', 'impect', 'transferroom'] },
    { id: 104, name: 'Marc Guéhi', team: 'Crystal Palace', position: 'CB', age: 24, value: '€70M', rating: 4, sources: ['statsbomb', 'skillcorner', 'scoutastic'] },
    { id: 105, name: 'Malo Gusto', team: 'Chelsea', position: 'RB', age: 21, value: '€35M', rating: 3.5, sources: ['statsbomb', 'impect'] },
  ];

  // Helper functions
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', dot: 'bg-red-500' },
      moderate: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },
      low: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', dot: 'bg-green-500' },
    };
    return configs[severity];
  };

  const getStatusColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
    };
    return colors[color];
  };

  const formatBudget = (amount) => {
    if (amount >= 1000000) return `£${amount / 1000000}M`;
    if (amount >= 1000) return `£${amount / 1000}K`;
    return `£${amount}`;
  };

  const totalBudget = shortlists.reduce((sum, s) => sum + s.budget.transfer, 0);
  const totalCandidates = shortlists.reduce((sum, s) => sum + s.planB.length, 0);
  const criticalCount = shortlists.filter(s => s.severity === 'critical').length;

  // Chat handler
  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { role: 'user', text: chatInput },
      { role: 'assistant', text: `Found 5 matches for your query. Top result: Adam Wharton (Crystal Palace) - 15.7 pressures/90, 91% pass accuracy, 0 days injured in 12 months. Would you like me to add him to a shortlist?` }
    ]);
    setChatInput('');
  };

  // ============================================================================
  // RENDER SCREENS
  // ============================================================================

  // Squad Screen
  const renderSquadScreen = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Current Squad</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Contract</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Injury Risk</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {squad.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedPlayer(player); setActiveScreen('player-profile'); }}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{player.name}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{player.position}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.age}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.contract}</td>
                <td className="px-4 py-3 text-sm font-medium">{player.value}</td>
                <td className="px-4 py-3">
                  <InjuryBadge risk={player.injury.risk} daysOut={player.injury.daysOut} />
                </td>
                <td className="px-4 py-3">
                  {player.flag && <span className="text-sm">{player.flag}</span>}
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Player Search Screen
  const renderPlayerSearchScreen = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Player Search</h2>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search players by name, position, or attributes..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800">
          Search
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        {['All', 'CM', 'CB', 'RB', 'LW', 'CF'].map((pos) => (
          <button key={pos} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${pos === 'All' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {pos}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
          Showing {searchTargets.length} players
        </div>
        <div className="divide-y divide-gray-100">
          {searchTargets.map((player) => (
            <div key={player.id} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => { setSelectedPlayer(player); setActiveScreen('player-profile'); }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{player.name}</div>
                  <div className="text-sm text-gray-500">{player.team} • {player.position} • Age {player.age}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {player.sources.map((s) => <SourceBadge key={s} source={s} />)}
                </div>
                <StarRating rating={player.rating} />
                <div className="font-medium">{player.value}</div>
                <button 
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  + Shortlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Shortlists Screen (NEW CRM-style)
  const renderShortlistsScreen = () => (
    <div className="space-y-6">
      {/* Window Status Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Window</div>
              <div className="text-lg font-semibold">{currentWindow.name}</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Closes</div>
              <div className="text-lg font-semibold">{currentWindow.end}</div>
            </div>
            <div className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
              {currentWindow.daysRemaining} days left
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Active Shortlists', value: shortlists.length, color: 'blue' },
          { icon: AlertCircle, label: 'Critical', value: criticalCount, color: 'red' },
          { icon: Users, label: 'Players Tracked', value: totalCandidates, color: 'purple' },
          { icon: PoundSterling, label: 'Total Budget', value: formatBudget(totalBudget), color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shortlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Shortlists
          </h2>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800">
            <Plus className="h-4 w-4" />
            New Shortlist
          </button>
        </div>

        <div className="space-y-3">
          {shortlists.map((shortlist) => {
            const config = getSeverityConfig(shortlist.severity);
            const isExpanded = expandedShortlist === shortlist.id;

            return (
              <div
                key={shortlist.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  isExpanded ? `${config.border} border-l-4 shadow-lg` : 'border-gray-200'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedShortlist(isExpanded ? null : shortlist.id)}
                  className={`p-4 cursor-pointer flex items-center gap-4 ${isExpanded ? config.bg : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.text} flex items-center justify-center font-bold text-sm border-2 ${config.border}`}>
                    {shortlist.position}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{shortlist.title}</div>
                    <div className="text-sm text-gray-500">{shortlist.trigger}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">BUDGET</div>
                    <div className="font-semibold">{formatBudget(shortlist.budget.transfer)} + {formatBudget(shortlist.budget.wages)}/wk</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                      {shortlist.ballHolder.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{shortlist.ballHolder.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-400">{shortlist.ballHolder.role}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shortlist.deadline < 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {shortlist.deadline}d left
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {/* Gates */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-6">
                      <span className="text-xs font-semibold text-gray-500">GATES:</span>
                      <GateCheckbox label="Scouting" checked={shortlist.gates.scouting} />
                      <GateCheckbox label="Manager" checked={shortlist.gates.manager} />
                      <GateCheckbox label="Budget" checked={shortlist.gates.budget} />
                      <GateCheckbox label="Medical" checked={shortlist.gates.medical} />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-3">
                      {/* Plan A */}
                      <div className="p-4 border-r border-gray-200 bg-gray-50/50">
                        <div className="text-xs font-bold text-gray-500 mb-3 tracking-wider">PLAN A: RETAIN</div>
                        
                        {shortlist.planA ? (
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-semibold">{shortlist.planA.player}</div>
                                <div className="text-sm text-gray-500">Age {shortlist.planA.age}</div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(shortlist.planA.statusColor)}`}>
                                {shortlist.planA.status}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs text-gray-400 mb-1">BLOCKER</div>
                                <div className="text-sm text-red-600">{shortlist.planA.issue}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 mb-1">NEXT ACTION</div>
                                <div className="text-sm">{shortlist.planA.nextAction}</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">CONFIDENCE</span>
                                  <span className="font-semibold">{shortlist.planA.confidence}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      shortlist.planA.confidence > 60 ? 'bg-green-500' :
                                      shortlist.planA.confidence > 30 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${shortlist.planA.confidence}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <div className="text-sm text-gray-500">No incumbent</div>
                            <div className="text-xs text-gray-400">(New position need)</div>
                          </div>
                        )}
                      </div>

                      {/* Plan B - Candidates */}
                      <div className="p-4 col-span-2">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs font-bold text-gray-500 tracking-wider">
                            CANDIDATES ({shortlist.planB.length})
                          </div>
                          <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Add Player
                          </button>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="grid grid-cols-7 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-200">
                            <div>#</div>
                            <div className="col-span-2">Player</div>
                            <div>Rating</div>
                            <div>Fee</div>
                            <div>Pipeline</div>
                            <div>Status</div>
                          </div>
                          {shortlist.planB.map((candidate, idx) => (
                            <div
                              key={candidate.id}
                              className={`grid grid-cols-7 gap-2 px-4 py-3 items-center hover:bg-gray-50 cursor-pointer ${
                                idx < shortlist.planB.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                              onClick={() => { setSelectedPlayer(candidate); setActiveScreen('player-profile'); }}
                            >
                              <div className="text-sm text-gray-400 font-medium">{idx + 1}</div>
                              <div className="col-span-2">
                                <div className="font-medium">{candidate.name}</div>
                                <div className="text-xs text-gray-500">{candidate.club} • Age {candidate.age}</div>
                              </div>
                              <div><StarRating rating={candidate.rating} /></div>
                              <div className="text-sm font-medium">{candidate.fee}</div>
                              <div><PipelineIndicator stage={candidate.statusStage} /></div>
                              <div>
                                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                                  {candidate.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity Bar */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          Last activity: 2 days ago
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          12 notes
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          6 video sessions
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100">
                          View Timeline
                        </button>
                        <button className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deferred */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-500">
          <Pause className="h-4 w-4" />
          Deferred to Future Windows
        </h2>
        <div className="flex gap-3">
          {deferredShortlists.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-400">
                {item.position}
              </div>
              <div>
                <div className="font-medium text-gray-500">{item.title}</div>
                <div className="text-xs text-gray-400">{item.reason}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {item.targetWindow}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Player Profile Screen
  const renderPlayerProfileScreen = () => {
    const player = selectedPlayer || {
      name: 'Adam Wharton',
      team: 'Crystal Palace',
      position: 'CM',
      age: 20,
      value: '€45M',
      contract: '2029',
      nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England',
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-500">
                {player.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
                <div className="text-gray-500">{player.team} • {player.position} • Age {player.age}</div>
                <div className="flex gap-2 mt-2">
                  <SourceBadge source="statsbomb" />
                  <SourceBadge source="impect" />
                  <SourceBadge source="scoutastic" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{player.value}</div>
              <div className="text-sm text-gray-500">Contract: {player.contract || '2029'}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-sm">Performance</span>
              <SourceBadge source="statsbomb" />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Pass Accuracy', value: '91.2%' },
                { label: 'Prog Passes/90', value: '8.4' },
                { label: 'xG Assisted', value: '0.18' },
                { label: 'Pressures/90', value: '15.7' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="font-semibold text-sm">Packing</span>
              <SourceBadge source="impect" />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Bypassed/90', value: '2.9' },
                { label: 'Packing Value', value: '14.2' },
                { label: 'Line Breaks', value: '1.8' },
                { label: 'Space Creation', value: '3.4' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-sm">Medical</span>
              <SourceBadge source="noisefeed" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Injury Risk</span>
                <InjuryBadge risk="low" daysOut={0} />
              </div>
              {[
                { label: 'Injuries (12m)', value: '0' },
                { label: 'Days Missed', value: '0' },
                { label: 'Availability', value: '100%' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scout Reports */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-sm">Scout Reports</span>
            <SourceBadge source="scoutastic" />
            <span className="text-xs text-gray-400 ml-2">15 reports</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 italic">
              "Exceptional composure on the ball. Dictates tempo from deep positions. Strong progressive passing range. 
              Would slot into our system immediately. Recommend priority pursuit."
            </p>
            <div className="mt-2 text-xs text-gray-400">— Senior Scout, Dec 2024</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800">
            Add to Shortlist
          </button>
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">
            Compare Players
          </button>
          <button className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">
            Share Profile
          </button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">M</span>
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight">MAGPIE II</div>
              <div className="text-xs text-slate-400">Recruitment Platform</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeScreen === screen.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <screen.icon className="h-5 w-5" />
              <span className="font-medium">{screen.name}</span>
              {screen.id === 'shortlists' && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{criticalCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium">
              SN
            </div>
            <div>
              <div className="text-sm font-medium">Steve Nickson</div>
              <div className="text-xs text-slate-400">Head of Recruitment</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {screens.find(s => s.id === activeScreen)?.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Window: <span className="font-medium text-gray-900">{currentWindow.name}</span>
                <span className="ml-2 text-blue-600">{currentWindow.daysRemaining}d left</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeScreen === 'squad' && renderSquadScreen()}
          {activeScreen === 'player-search' && renderPlayerSearchScreen()}
          {activeScreen === 'shortlists' && renderShortlistsScreen()}
          {activeScreen === 'player-profile' && renderPlayerProfileScreen()}
        </main>
      </div>

      {/* AI Chat Panel */}
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">AI Assistant</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 rounded-xl text-sm max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              placeholder="Ask about players..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleChat}
              className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
