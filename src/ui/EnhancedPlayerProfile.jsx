import React, { useState } from 'react';
import { 
  X, ChevronRight, MapPin, Calendar, Ruler, Flag, User, 
  Briefcase, FileText, TrendingUp, Activity, Shield, Zap,
  Target, Clock, AlertCircle, CheckCircle, ChevronDown,
  Circle, Phone, Eye, Video, MessageSquare, Search, Send
} from 'lucide-react';
import { shortlistCandidates } from '../data-shortlist-candidates';

const GateIndicator = ({ label, completed }) => (
  <div className={`flex-1 p-3 rounded-lg border ${completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-center gap-2 mb-1">
      {completed ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300" />
      )}
      <span className={`text-xs font-medium ${completed ? 'text-green-700' : 'text-gray-500'}`}>{label}</span>
    </div>
    <div className={`text-[10px] ${completed ? 'text-green-600' : 'text-gray-400'}`}>
      {completed ? 'Completed' : 'Pending'}
    </div>
  </div>
);

const ActivityIcon = ({ type }) => {
  const icons = {
    phone_call: Phone,
    scout_visit: Eye,
    video_review: Video,
    meeting: User,
    discussion: MessageSquare,
    status_change: Activity,
    email: Send,
  };
  const Icon = icons[type] || Activity;
  return <Icon className="h-4 w-4" />;
};

const getActivityTypeColor = (type) => {
  const colors = {
    phone_call: 'bg-blue-100 text-blue-600',
    scout_visit: 'bg-green-100 text-green-600',
    video_review: 'bg-purple-100 text-purple-600',
    meeting: 'bg-amber-100 text-amber-600',
    discussion: 'bg-cyan-100 text-cyan-600',
    status_change: 'bg-gray-100 text-gray-600',
    email: 'bg-pink-100 text-pink-600',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const SourceBadge = ({ source }) => {
  const sources = {
    statsbomb: { label: 'SB', color: 'bg-blue-600', full: 'StatsBomb' },
    impect: { label: 'IMP', color: 'bg-purple-600', full: 'Impect' },
    secondspectrum: { label: 'SS', color: 'bg-orange-600', full: 'Second Spectrum' },
    skillcorner: { label: 'SC', color: 'bg-cyan-600', full: 'SkillCorner' },
    transfermarkt: { label: 'TM', color: 'bg-green-600', full: 'TransferMarkt' },
  };
  const s = sources[source] || { label: '?', color: 'bg-gray-600', full: source };
  return (
    <span className={`${s.color} text-white px-1.5 py-0.5 rounded text-[10px] font-medium`} title={s.full}>
      {s.label}
    </span>
  );
};

const MetricBar = ({ label, percentile, showLabel = true }) => {
  const getColor = (val) => {
    if (val >= 75) return 'bg-green-500';
    if (val >= 50) return 'bg-lime-400';
    if (val >= 25) return 'bg-amber-400';
    return 'bg-red-400';
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && <div className="w-32 text-xs text-gray-600 truncate">{label}</div>}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${getColor(percentile)}`}
          style={{ width: `${percentile}%` }}
        />
      </div>
      <div className="w-8 text-xs font-medium text-gray-700 text-right">{percentile}%</div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon: Icon }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <div className="text-lg font-bold text-gray-900">{value}</div>
    {subValue && <div className="text-xs text-gray-400">{subValue}</div>}
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors ${
      active 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const playerAvatars = {
  'Kieran Trippier': '/players/trippier_1765315479138.png',
  'Fabian Schär': '/players/schar_1765315479138.png',
  'Nick Pope': '/players/pope_1765315479137.png',
  'Sean Longstaff': '/players/longstaff_1765315600236.png',
  'Tiago Santos': '/players/santos_1765321431388.webp',
  'Harvey Barnes': '/players/barnes_1765315308119.png',
  'Sven Botman': '/players/botman_1765315308120.png',
  'Dan Burn': '/players/burn_1765315308120.png',
  'Anthony Elanga': '/players/elanga_1765315308121.png',
  'Anthony Gordon': '/players/gordon_1765315308121.png',
  'Bruno Guimarães': '/players/guimaraes_1765315308121.png',
  'Lewis Hall': '/players/hall_1765315308122.png',
  'Joelinton': '/players/joelinton_1765315308122.png',
  'Tino Livramento': '/players/livramento_1765315479137.png',
  'Jacob Murphy': '/players/murphy_1765315479137.png',
  'Sandro Tonali': '/players/tonali_1765315479138.png',
};

const PlayerAvatar = ({ name, size = 'md', className = '' }) => {
  const imageUrl = playerAvatars[name];
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </div>
  );
};

const getStatusBadge = (status) => {
  const configs = {
    started: { bg: 'bg-green-100', text: 'text-green-700', label: 'Started' },
    sub: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sub' },
    bench: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Bench' },
    injured: { bg: 'bg-red-100', text: 'text-red-700', label: 'Injured' },
    absent: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Not in Squad' },
  };
  return configs[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
};

export default function EnhancedPlayerProfile({ show, onClose, playerId, gates, activities, whatsAppData }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!show || !playerId) return null;
  
  const playerKey = playerId.toLowerCase().replace(/ /g, '-');
  const player = shortlistCandidates[playerKey];
  
  if (!player) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-[700px] bg-white shadow-2xl p-8 flex items-center justify-center">
          <p className="text-gray-500">Player data not found</p>
        </div>
      </div>
    );
  }

  const metrics = player.performanceMetrics || {};
  const matchLog = player.matchLog || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-[750px] bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
          <div className="flex items-start justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex-1 flex items-center gap-5 ml-2">
              <PlayerAvatar name={player.name} size="xl" />
              <div className="text-white flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{player.name}</h2>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-sm font-medium">#{player.number}</span>
                </div>
                <p className="text-white/70 mb-2">{player.fullName}</p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Flag className="h-3.5 w-3.5" />
                    {player.nation}
                  </span>
                  <span>{player.club}</span>
                  <span>{player.position}</span>
                  <span>Age {player.age}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <SourceBadge source="statsbomb" />
                  <SourceBadge source="impect" />
                  <SourceBadge source="transfermarkt" />
                  <SourceBadge source="skillcorner" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{player.marketValue}</div>
                <div className="text-xs text-white/50">Market Value</div>
                {player.lastValueUpdate && (
                  <div className="text-xs text-white/40 mt-1">Updated: {player.lastValueUpdate}</div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6 flex gap-1 bg-gray-50">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
          <TabButton active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>Performance</TabButton>
          <TabButton active={activeTab === 'matches'} onClick={() => setActiveTab('matches')}>Matches</TabButton>
          <TabButton active={activeTab === 'career'} onClick={() => setActiveTab('career')}>Career</TabButton>
          <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>Timeline</TabButton>
          <TabButton active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')}>WhatsApp</TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {gates && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Recruitment Gates
                  </h3>
                  <div className="flex gap-3">
                    <GateIndicator label="Scouting" completed={gates.scouting} />
                    <GateIndicator label="Manager" completed={gates.manager} />
                    <GateIndicator label="Budget" completed={gates.budget} />
                    <GateIndicator label="Medical" completed={gates.medical} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                <StatCard label="Contract Until" value={player.contract} icon={FileText} />
                <StatCard label="Joined Club" value={player.joinedClub} icon={Calendar} />
                <StatCard label="Weekly Wages" value={player.wages} icon={Briefcase} />
                <StatCard label="Agent" value={player.agent} icon={User} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    Player Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date of Birth</span>
                      <span className="font-medium">{player.dob} (Age {player.age})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Birthplace</span>
                      <span className="font-medium">{player.birthplace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Height</span>
                      <span className="font-medium">{player.height} ({player.heightMetric})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Citizenship</span>
                      <span className="font-medium">{player.nation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Position</span>
                      <span className="font-medium">{player.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Preferred Foot</span>
                      <span className="font-medium">{player.foot}</span>
                    </div>
                    {player.nationalTeam && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">International</span>
                        <span className="font-medium">{player.nationalTeam} ({player.caps || 0} caps)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Contract Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Club</span>
                      <span className="font-medium">{player.club}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">League</span>
                      <span className="font-medium">{player.league} ({player.leagueLevel || 'First Tier'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Joined</span>
                      <span className="font-medium">{player.joinedClub}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contract Expires</span>
                      <span className="font-medium">{player.contractExpiry || player.contract}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Market Value</span>
                      <span className="font-medium text-green-600">{player.marketValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Fee</span>
                      <span className="font-medium">{player.fee}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {Object.values(metrics).slice(0, 8).map((metric, idx) => (
                    <MetricBar key={idx} label={metric.label} percentile={metric.percentile} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1">
                    {player.pros?.map((pro, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Concerns
                  </h3>
                  <ul className="space-y-1">
                    {player.cons?.map((con, idx) => (
                      <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {player.scoutingNotes && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Scouting Notes</h3>
                  <p className="text-sm text-blue-700">{player.scoutingNotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {player.keyStats && (
                <div className="grid grid-cols-4 gap-3">
                  <StatCard label="Top Speed" value={player.keyStats.topSpeed} subValue={`${player.keyStats.topSpeedPct} vs peers`} icon={Zap} />
                  <StatCard label="HI Distance/Min" value={player.keyStats.hiDistance} subValue={`${player.keyStats.hiDistancePct} vs peers`} icon={Activity} />
                  <StatCard label="Off-Ball Workrate" value={player.keyStats.offBallWorkrate} subValue={`${player.keyStats.offBallPct} vs peers`} icon={Target} />
                  <StatCard label="Foot Preference" value={player.keyStats.footPreference} subValue="Right : Left" icon={Shield} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Defensive Metrics
                  </h3>
                  <div className="space-y-3">
                    {['defending', 'duelsWon', 'aerialAbility', 'interceptions', 'pressureRegains'].map(key => {
                      const metric = metrics[key];
                      return metric ? (
                        <MetricBar key={key} label={metric.label} percentile={metric.percentile} />
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Attacking Metrics
                  </h3>
                  <div className="space-y-3">
                    {['attackingCrosses', 'offensiveVolume', 'chancesCreated', 'progression', 'progressiveCarry'].map(key => {
                      const metric = metrics[key];
                      return metric ? (
                        <MetricBar key={key} label={metric.label} percentile={metric.percentile} />
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    Physical Metrics
                  </h3>
                  <div className="space-y-3">
                    {['physical', 'topSpeed', 'hiDistance', 'offBallWorkrate'].map(key => {
                      const metric = metrics[key];
                      return metric ? (
                        <MetricBar key={key} label={metric.label} percentile={metric.percentile} />
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    Pressing & Distribution
                  </h3>
                  <div className="space-y-3">
                    {['pressing', 'reactionPress', 'distribution', 'passAccuracy'].map(key => {
                      const metric = metrics[key];
                      return metric ? (
                        <MetricBar key={key} label={metric.label} percentile={metric.percentile} />
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Match History (2025/26 Season)</h3>
                <div className="text-xs text-gray-500">
                  {matchLog.filter(m => m.status === 'started').length} starts, {matchLog.filter(m => m.status === 'sub').length} sub appearances
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Competition</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Match</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Result</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Pos</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Status</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Mins</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {matchLog.map((match, idx) => {
                        const statusBadge = getStatusBadge(match.status);
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <span className="text-xs font-medium text-gray-600">{match.comp}</span>
                            </td>
                            <td className="px-3 py-2 text-gray-500 text-xs">{match.date}</td>
                            <td className="px-3 py-2">
                              <span className="font-medium">{match.home}</span>
                              <span className="text-gray-400 mx-1">vs</span>
                              <span className="font-medium">{match.away}</span>
                            </td>
                            <td className="px-3 py-2 text-center font-bold">{match.result}</td>
                            <td className="px-3 py-2 text-center text-gray-500">{match.pos || '-'}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600">
                              {match.mins ? `${match.mins}'` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-6">
              {player.statsByClub && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Stats by Club</h3>
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="pb-2 text-left font-medium text-gray-600">Club</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Apps</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Goals</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Assists</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {player.statsByClub.map((stat, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-medium">{stat.club}</td>
                          <td className="py-2 text-center">{stat.appearances}</td>
                          <td className="py-2 text-center">{stat.goals}</td>
                          <td className="py-2 text-center">{stat.assists}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {player.statsByCompetition && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Stats by Competition</h3>
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="pb-2 text-left font-medium text-gray-600">Competition</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Apps</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Goals</th>
                        <th className="pb-2 text-center font-medium text-gray-600">Assists</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {player.statsByCompetition.map((stat, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-medium">{stat.comp}</td>
                          <td className="py-2 text-center">{stat.appearances}</td>
                          <td className="py-2 text-center">{stat.goals}</td>
                          <td className="py-2 text-center">{stat.assists}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {player.transferHistory && player.transferHistory.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Transfer History</h3>
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="pb-2 text-left font-medium text-gray-600">Season</th>
                        <th className="pb-2 text-left font-medium text-gray-600">From</th>
                        <th className="pb-2 text-left font-medium text-gray-600">To</th>
                        <th className="pb-2 text-right font-medium text-gray-600">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {player.transferHistory.map((transfer, idx) => (
                        <tr key={idx}>
                          <td className="py-2">{transfer.season}</td>
                          <td className="py-2">{transfer.from}</td>
                          <td className="py-2">{transfer.to}</td>
                          <td className="py-2 text-right font-medium">{transfer.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {player.youthClubs && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Youth Clubs</h3>
                  <div className="flex flex-wrap gap-2">
                    {player.youthClubs.map((club, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        {club}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {player.bio && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Biography</h3>
                  <p className="text-sm text-gray-600">{player.bio}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
                <div className="text-xs text-gray-500">
                  {activities?.length || 0} activities
                </div>
              </div>
              
              {activities && activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.sort((a, b) => new Date(b.date) - new Date(a.date)).map((activity) => (
                    <div key={activity.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getActivityTypeColor(activity.type)}`}>
                          <ActivityIcon type={activity.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">by {activity.user}</p>
                          <p className="text-sm text-gray-700">{activity.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activity recorded yet</p>
                  <p className="text-xs text-gray-400 mt-1">Activities will appear here once added</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">WhatsApp Conversations</h3>
              </div>
              
              {whatsAppData && whatsAppData.hasGroup ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-green-600 px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{whatsAppData.groupName}</div>
                        <div className="text-xs text-green-100">
                          {whatsAppData.participants?.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#e5ddd5] min-h-[300px] max-h-[400px] overflow-y-auto space-y-2">
                    {whatsAppData.messages?.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.isOwn ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                          {!msg.isOwn && (
                            <div className="text-xs font-medium text-green-700 mb-1">{msg.sender}</div>
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <div className="text-[10px] text-gray-500 text-right mt-1">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No WhatsApp group for this shortlist</p>
                  <p className="text-xs text-gray-400 mt-1">Create a group to start collaborating</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button 
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Add to Shortlist
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            View Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
