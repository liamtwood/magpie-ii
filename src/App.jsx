import React, { useState, useEffect } from 'react';
import { 
  Users, Search, ClipboardList, Activity, Star, AlertCircle,
  ChevronDown, ChevronUp, Plus, Clock, TrendingUp,
  Send, Play, Eye, Phone, FileText, Video, MapPin,
  ChevronRight, Sparkles, Zap, X, CheckCircle2, Circle, MessageSquare
} from 'lucide-react';

// Import components
import { PlayerAvatar, SourceBadge, InjuryBadge, StarRating, PipelineIndicator } from './ui/components-ui-badges';
import PlayerReplacementAI from './ui/components-ai-replacement';
import CreateShortlistModal from './ui/CreateShortlistModal';
import PlayerActivityTimeline from './ui/PlayerActivityTimeline';
import { squad } from './data-squad-js';
import { shortlistCandidates, playerActivities as initialPlayerActivities } from './data-shortlist-candidates';
import { formatValue, formatWages, inferShortlistReason, generateSquadIssues, getPlayerId, parseValue } from './utils-helpers-js';

// ============================================================================
// MAGPIE II - Newcastle United Recruitment Platform
// Demo Version - December 2025
// ============================================================================

export default function App() {
  // ============================================================================
  // STATE
  // ============================================================================
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [expandedShortlist, setExpandedShortlist] = useState('trippier');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Welcome to MAGPIE II! I can help you find players, analyze your squad, or suggest replacements. Try asking: 'Find me a Trippier replacement'" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // AI Replacement Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPlayerId, setAiPlayerId] = useState(null);
  
  // Create Shortlist Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShortlistData, setNewShortlistData] = useState(null);
  
  // Dismiss/Snooze state for issues
  const [dismissedIssues, setDismissedIssues] = useState({});
  const [snoozedIssues, setSnoozedIssues] = useState({});
  
  // Player Timeline Modal state
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [playerActivities, setPlayerActivities] = useState(initialPlayerActivities);

  // Player Avatar state
  const [playerAvatars, setPlayerAvatars] = useState({});

  // Load avatars from localStorage on mount
  useEffect(() => {
    try {
      const savedAvatars = localStorage.getItem('playerAvatars');
      if (savedAvatars) {
        setPlayerAvatars(JSON.parse(savedAvatars));
      }
    } catch (e) {
      console.error('Failed to load avatars from localStorage:', e);
    }
  }, []);

  // Handle avatar change
  const handleAvatarChange = (playerId, base64Image) => {
    setPlayerAvatars(prev => {
      const updated = { ...prev, [playerId]: base64Image };
      try {
        localStorage.setItem('playerAvatars', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save avatar to localStorage:', e);
      }
      return updated;
    });
  };

  // ============================================================================
  // DATA
  // ============================================================================
  
  // Navigation screens
  const screens = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'squad', name: 'Squad', icon: Users },
    { id: 'shortlists', name: 'Shortlists', icon: ClipboardList },
    { id: 'search', name: 'Search', icon: Search },
  ];

  // Transfer window info
  const currentWindow = { name: 'Summer 2025', end: 'Aug 31', daysRemaining: 85 };

  // Shortlists data
  const shortlists = [
    {
      id: 'trippier',
      title: 'RB Cover - Trippier',
      priority: 'high',
      reason: 'Contract expires 2026 + 67 days injured (12mo)',
      planA: { action: 'Extend', player: 'Kieran Trippier', status: 'Negotiating', note: 'Wants 2yr, club offering 1+1' },
      candidates: [
        { id: 'tiago-santos', name: 'Tiago Santos', club: 'Lille', age: 22, value: '15M', rating: 3.5, stage: 4, sources: ['statsbomb', 'scoutastic'], fit: 92, flag: 'Top Pick' },
        { id: 'malo-gusto', name: 'Malo Gusto', club: 'Chelsea', age: 21, value: '35M', rating: 3, stage: 2, sources: ['statsbomb'], fit: 88, flag: null },
        { id: 'devyne-rensch', name: 'Devyne Rensch', club: 'Ajax', age: 21, value: '20M', rating: 3, stage: 3, sources: ['impect', 'scoutastic'], fit: 85, flag: null },
      ]
    },
    {
      id: 'cb-cover',
      title: 'CB Cover - Botman ACL',
      priority: 'critical',
      reason: 'ACL injury - 6 months out',
      planA: { action: 'Loan', player: 'TBD', status: 'Searching', note: 'Jan window priority' },
      candidates: [
        { id: 'marc-guehi', name: 'Marc Guéhi', club: 'Crystal Palace', age: 24, value: '65M', rating: 4, stage: 5, sources: ['statsbomb', 'transferroom'], fit: 95, flag: 'Top Pick' },
        { id: 'goncalo-inacio', name: 'Gonçalo Inácio', club: 'Sporting CP', age: 23, value: '45M', rating: 3.5, stage: 3, sources: ['statsbomb'], fit: 90, flag: null },
      ]
    },
    {
      id: 'cm-depth',
      title: 'CM Depth',
      priority: 'medium',
      reason: 'Bruno interest from Saudi + PSG',
      planA: { action: 'Retain', player: 'Bruno Guimaraes', status: 'Monitoring', note: 'Release clause £100M' },
      candidates: [
        { id: 'adam-wharton', name: 'Adam Wharton', club: 'Crystal Palace', age: 20, value: '50M', rating: 4, stage: 4, sources: ['statsbomb', 'impect'], fit: 93, flag: 'English' },
        { id: 'enzo-lopes', name: 'Enzo Le Fée', club: 'Roma', age: 24, value: '25M', rating: 3, stage: 2, sources: ['scoutastic'], fit: 82, flag: null },
      ]
    }
  ];

  // Player database for search
  const playerDatabase = [
    { id: 'tiago-santos', name: 'Tiago Santos', club: 'Lille', position: 'RB', age: 22, value: '15M', nationality: 'Portugal' },
    { id: 'malo-gusto', name: 'Malo Gusto', club: 'Chelsea', position: 'RB', age: 21, value: '35M', nationality: 'France' },
    { id: 'devyne-rensch', name: 'Devyne Rensch', club: 'Ajax', position: 'RB', age: 21, value: '20M', nationality: 'Netherlands' },
    { id: 'marc-guehi', name: 'Marc Guéhi', club: 'Crystal Palace', position: 'CB', age: 24, value: '65M', nationality: 'England' },
    { id: 'goncalo-inacio', name: 'Gonçalo Inácio', club: 'Sporting CP', position: 'CB', age: 23, value: '45M', nationality: 'Portugal' },
    { id: 'adam-wharton', name: 'Adam Wharton', club: 'Crystal Palace', position: 'CM', age: 20, value: '50M', nationality: 'England' },
    { id: 'enzo-lopes', name: 'Enzo Le Fée', club: 'Roma', position: 'CM', age: 24, value: '25M', nationality: 'France' },
    { id: 'jeremie-frimpong', name: 'Jeremie Frimpong', club: 'Bayer Leverkusen', position: 'RB', age: 23, value: '40M', nationality: 'Netherlands' },
    { id: 'pedro-porro', name: 'Pedro Porro', club: 'Spurs', position: 'RB', age: 25, value: '50M', nationality: 'Spain' },
  ];

  // Player detail data
  const playerDetails = {
    'tiago-santos': {
      fullName: 'Tiago Carvalho Santos',
      position: 'RB',
      altPositions: ['RWB', 'RM'],
      age: 22,
      dob: '23/07/2002',
      nationality: 'Portugal',
      height: '1.75m',
      foot: 'Right',
      club: 'Lille',
      contract: '2029',
      value: '€15M',
      wages: '€55k/week',
      agent: 'Gestifute',
      strengths: ['Attacking threat', 'Recovery pace', 'High ceiling', 'Europa League exp.'],
      concerns: ['Recent ACL', 'Limited Ligue 1 mins', 'PL physicality adaptation'],
      stats: { appearances: 6, goals: 0, assists: 1, minutes: 316, passCompletion: 84, tacklesWon: 2.1, interceptions: 1.4 },
      videos: [
        { title: 'vs PSG - Attacking runs', duration: '2:34', date: '05/10/2025' },
        { title: 'Season highlights 24/25', duration: '4:12', date: '01/12/2025' },
      ],
      timeline: [
        { date: '06/12/2025', type: 'scout', title: 'Live scouting: Lille vs Marseille', user: 'Mark Thompson', note: 'Not in squad - concerning' },
        { date: '29/10/2025', type: 'video', title: 'Video analysis: Nice vs Lille', user: 'Analysis Team', note: 'Looked rusty post-injury' },
        { date: '15/10/2025', type: 'call', title: 'Agent call - Gestifute', user: 'Steve Nickson', note: 'Player interested in PL. Lille want €15M min.' },
      ]
    },
    'marc-guehi': {
      fullName: 'Marc Guéhi',
      position: 'CB',
      altPositions: ['LCB'],
      age: 24,
      dob: '13/07/2000',
      nationality: 'England',
      height: '1.82m',
      foot: 'Right',
      club: 'Crystal Palace',
      contract: '2026',
      value: '£65M',
      wages: '£80k/week',
      agent: 'CAA Stellar',
      strengths: ['Leadership', 'Ball-playing CB', 'England international', 'PL proven'],
      concerns: ['Price tag', 'Palace reluctant to sell', 'Multiple suitors'],
      stats: { appearances: 18, goals: 1, assists: 0, minutes: 1620, passCompletion: 89, tacklesWon: 1.8, interceptions: 1.2, aerialWon: 65 },
      videos: [
        { title: 'vs Brighton - Defensive masterclass', duration: '3:45', date: '06/12/2025' },
        { title: 'England Euro 2024 highlights', duration: '5:20', date: '01/07/2024' },
      ],
      timeline: [
        { date: '06/12/2025', type: 'scout', title: 'Live scouting: Palace vs Brighton', user: 'Mark Thompson', note: 'Dominant. Leadership evident. Must sign.' },
        { date: '04/12/2025', type: 'call', title: 'Palace DoF call', user: 'Steve Nickson', note: 'Starting price £65M but flexible structure' },
        { date: '28/11/2025', type: 'meeting', title: 'Transfer committee', user: 'Dan Ashworth', note: 'Approved as primary CB target' },
      ]
    },
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  // AI Chat handler
  const handleChat = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let response = '';
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('trippier') && lowerInput.includes('replacement')) {
        response = `Based on your squad needs, I recommend these Trippier replacements:\n\n🥇 **Tiago Santos** (Lille, 22) - €15M\n• 92% tactical fit score\n• Similar attacking output\n• Already in Stage 4 of pipeline\n\n🥈 **Jeremie Frimpong** (Leverkusen, 23) - €40M\n• Elite pace and 1v1 ability\n• Champions League experience\n\n🥉 **Devyne Rensch** (Ajax, 21) - €20M\n• Good value option\n• Dutch league pedigree\n\nWant me to add any of these to your RB shortlist?`;
        setActiveScreen('shortlists');
        setExpandedShortlist('trippier');
      } else if (lowerInput.includes('squad') && lowerInput.includes('issue')) {
        response = `Current squad issues I've identified:\n\n🔴 **Critical:** Botman ACL - need CB cover urgently\n🟠 **High:** Trippier contract + injury history\n🟡 **Medium:** Bruno Guimaraes interest from Saudi/PSG\n🟡 **Medium:** Gordon interest from Liverpool\n\nThe CB situation needs immediate attention for the January window.`;
      } else if (lowerInput.includes('budget') || lowerInput.includes('spend')) {
        response = `Based on your current shortlists:\n\n**Total potential spend:** £155M\n• CB (Guéhi): £65M\n• RB (Santos): £15M\n• CM (Wharton): £50M\n• Wages impact: ~£350k/week additional\n\nPSR considerations: You'd need to offset with sales. Gordon (£70M) or Bruno (£100M) could enable this.`;
      } else {
        response = `I can help you with:\n• "Find me a Trippier replacement"\n• "What are our squad issues?"\n• "Show me RB options under £20M"\n• "Compare Guéhi vs Inácio"\n\nWhat would you like to explore?`;
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsAiThinking(false);
    }, 1500);
  };

  // Open AI Replacement Modal
  const openAiReplacement = (playerId) => {
    setAiPlayerId(playerId);
    setShowAiModal(true);
  };

  // Create Shortlist handler
  const handleCreateShortlist = (player) => {
    const inference = inferShortlistReason(player);
    setNewShortlistData({
      player,
      title: `${player.position} - ${player.name} Replacement`,
      ...inference,
      budget: parseValue(player.value),
      wages: 80000,
    });
    setShowCreateModal(true);
  };

  // Open Player Timeline
  const openPlayerTimeline = (playerName) => {
    setActivePlayerId(getPlayerId(playerName));
    setShowTimelineModal(true);
  };

  // Add note to player activities
  const handleAddNote = (note) => {
    if (!activePlayerId) return;
    setPlayerActivities(prev => ({
      ...prev,
      [activePlayerId]: [...(prev[activePlayerId] || []), note]
    }));
  };

  // Generate squad issues
  const squadIssues = generateSquadIssues(squad);
  const activeIssues = squadIssues.filter(i => !dismissedIssues[i.id] && !snoozedIssues[i.id]);

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  // Render player profile
  const renderPlayerProfile = () => {
    const player = playerDetails[selectedPlayer];
    if (!player) return null;

    return (
      <div className="flex-1 overflow-y-auto p-6">
        <button onClick={() => setSelectedPlayer(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to shortlists
        </button>
        
        {/* Player header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            <PlayerAvatar 
                  name={player.fullName} 
                  size="xl" 
                  src={playerAvatars[selectedPlayer]}
                  editable={true}
                  playerId={selectedPlayer}
                  onAvatarChange={handleAvatarChange}
                />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{player.fullName}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">Shortlist Candidate</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="font-semibold">{player.position}</span>
                <span>•</span>
                <span>{player.club}</span>
                <span>•</span>
                <span>{player.age} years</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {player.nationality}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Market Value</div>
                  <div className="font-semibold text-gray-900">{player.value}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Contract</div>
                  <div className="font-semibold text-gray-900">{player.contract}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Wages</div>
                  <div className="font-semibold text-gray-900">{player.wages}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Agent</div>
                  <div className="font-semibold text-gray-900">{player.agent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scouting assessment */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" /> Strengths
            </h3>
            <ul className="space-y-2">
              {player.strengths.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> Concerns
            </h3>
            <ul className="space-y-2">
              {player.concerns.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Video clips */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" /> Video Clips
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {player.videos.map((v, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{v.title}</div>
                  <div className="text-xs text-gray-500">{v.duration} • {v.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" /> Activity Timeline
          </h3>
          <div className="space-y-4">
            {player.timeline.map((t, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  t.type === 'scout' ? 'bg-green-100 text-green-600' :
                  t.type === 'video' ? 'bg-blue-100 text-blue-600' :
                  t.type === 'call' ? 'bg-amber-100 text-amber-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {t.type === 'scout' ? <Eye className="h-4 w-4" /> :
                   t.type === 'video' ? <Video className="h-4 w-4" /> :
                   t.type === 'call' ? <Phone className="h-4 w-4" /> :
                   <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.date}</div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">by {t.user}</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render dashboard
  const renderDashboard = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Squad Health Check</h2>
        <p className="text-sm text-gray-500">Proactive issues requiring attention</p>
      </div>

      {/* Critical alerts */}
      <div className="space-y-4">
        {[
          { severity: 'critical', title: 'CB Cover Required', subtitle: 'Sven Botman - ACL injury', detail: '6 months out. Only Schär and Burn available.', action: 'Find Replacement', playerId: 4, shortlistId: 'cb-cover' },
          { severity: 'high', title: 'Contract Expiring', subtitle: 'Kieran Trippier - June 2026', detail: 'Age 34, 67 injury days this season. Need succession plan.', action: 'Find Replacement', playerId: 2, shortlistId: 'trippier' },
          { severity: 'medium', title: 'Transfer Interest', subtitle: 'Bruno Guimaraes - Saudi & PSG', detail: '£100M release clause. Need contingency.', action: 'Find Replacement', playerId: 39, shortlistId: 'cm-depth' },
          { severity: 'medium', title: 'Transfer Interest', subtitle: 'Anthony Gordon - Liverpool', detail: 'Part of PSR discussions. May need to sell.', action: 'Find Replacement', playerId: 10, shortlistId: null },
        ].map((alert, i) => (
          <div key={i} className={`bg-white border-l-4 rounded-lg p-4 shadow-sm ${
            alert.severity === 'critical' ? 'border-red-500' :
            alert.severity === 'high' ? 'border-orange-500' : 'border-amber-500'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="font-semibold text-gray-900">{alert.title}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{alert.subtitle}</div>
                <div className="text-xs text-gray-500">{alert.detail}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openAiReplacement(alert.playerId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Zap className="h-3 w-3" />
                  {alert.action}
                </button>
                {alert.shortlistId ? (
                  <button
                    onClick={() => {
                      setActiveScreen('shortlists');
                      setExpandedShortlist(alert.shortlistId);
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Shortlist
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const player = squad.find(p => p.id === alert.playerId);
                      if (player) handleCreateShortlist(player);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Create Shortlist
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Window countdown */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Transfer Window</div>
            <div className="text-xl font-bold">{currentWindow.name}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentWindow.daysRemaining}</div>
            <div className="text-sm text-gray-400">days remaining</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render squad
  const renderSquad = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">First Team Squad</h2>
          <p className="text-sm text-gray-500">{squad.length} players</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Contract</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Injury Risk</th>
              <th className="px-4 py-3">Flag</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {squad.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar 
                      name={player.name} 
                      size="sm" 
                      src={playerAvatars[player.id]}
                      editable={true}
                      playerId={player.id}
                      onAvatarChange={handleAvatarChange}
                    />
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">{player.position}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.age}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.contract}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">£{player.value}</td>
                <td className="px-4 py-3">
                  <InjuryBadge risk={player.injury.risk} daysOut={player.injury.daysOut} />
                </td>
                <td className="px-4 py-3">
                  {player.flag && (
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      player.flag === 'ACL' ? 'bg-red-100 text-red-700' :
                      player.flag === 'Contract' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {player.flag}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {player.flag && (
                    <button
                      onClick={() => openAiReplacement(player.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    >
                      <Zap className="h-3 w-3" />
                      Find Cover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render shortlists
  const renderShortlists = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Active Shortlists</h2>
          <p className="text-sm text-gray-500">{shortlists.length} positions being tracked</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="h-4 w-4" /> New Shortlist
        </button>
      </div>

      <div className="space-y-4">
        {shortlists.map((shortlist) => (
          <div key={shortlist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpandedShortlist(expandedShortlist === shortlist.id ? null : shortlist.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`w-2 h-2 rounded-full ${
                  shortlist.priority === 'critical' ? 'bg-red-500' :
                  shortlist.priority === 'high' ? 'bg-orange-500' : 'bg-amber-500'
                }`} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{shortlist.title}</div>
                  <div className="text-xs text-gray-500">{shortlist.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{shortlist.candidates.length} candidates</span>
                {expandedShortlist === shortlist.id ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
            </button>

            {/* Expanded content */}
            {expandedShortlist === shortlist.id && (
              <div className="border-t border-gray-100">
                {/* Plan A */}
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Plan A: {shortlist.planA.action}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlayerAvatar name={shortlist.planA.player} size="sm" src={playerAvatars[getPlayerId(shortlist.planA.player)]} />
                      <div>
                        <div className="font-medium text-gray-900">{shortlist.planA.player}</div>
                        <div className="text-xs text-gray-500">{shortlist.planA.note}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      shortlist.planA.status === 'Negotiating' ? 'bg-blue-100 text-blue-700' :
                      shortlist.planA.status === 'Monitoring' ? 'bg-gray-100 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {shortlist.planA.status}
                    </span>
                  </div>
                </div>

                {/* Plan B - Candidates */}
                <div className="px-5 py-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Plan B: Candidates</div>
                  <div className="space-y-3">
                    {shortlist.candidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setSelectedPlayer(candidate.id)}
                      >
                        <div className="flex items-center gap-4">
                          <PlayerAvatar name={candidate.name} size="md" src={playerAvatars[candidate.id]} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{candidate.name}</span>
                              {candidate.flag && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded">
                                  {candidate.flag}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{candidate.club}</span>
                              <span>•</span>
                              <span>{candidate.age} yrs</span>
                              <span>•</span>
                              <span className="font-medium">£{candidate.value}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1">
                            {candidate.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
                          </div>
                          <div className="text-right">
                            <StarRating rating={candidate.rating} />
                            <div className="text-[10px] text-gray-500 mt-0.5">{candidate.fit}% fit</div>
                          </div>
                          <PipelineIndicator stage={candidate.stage} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPlayerTimeline(candidate.name);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="View Activity Timeline"
                          >
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                          </button>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render search
  const renderSearch = () => {
    const filteredPlayers = searchQuery 
      ? playerDatabase.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nationality.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : playerDatabase;

    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Players</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, club, position, or nationality..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Club</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Nationality</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <PlayerAvatar name={player.name} size="sm" src={playerAvatars[player.id]} />
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{player.club}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{player.position}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{player.age}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">£{player.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{player.nationality}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedPlayer(player.id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    >
                      View Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#231F20] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-xl">🦅</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-tight">MAGPIE II</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Newcastle United</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => { setActiveScreen(screen.id); setSelectedPlayer(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeScreen === screen.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <screen.icon className="h-5 w-5" />
              <span className="font-medium">{screen.name}</span>
            </button>
          ))}
        </nav>

        {/* Window info */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-1">Transfer Window</div>
          <div className="text-white font-semibold">{currentWindow.name}</div>
          <div className="text-xs text-gray-400">{currentWindow.daysRemaining} days remaining</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {selectedPlayer ? 'Player Profile' : screens.find(s => s.id === activeScreen)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                SN
              </div>
              <span className="text-sm font-medium text-gray-700">Steve Nickson</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        {selectedPlayer ? renderPlayerProfile() :
         activeScreen === 'dashboard' ? renderDashboard() :
         activeScreen === 'squad' ? renderSquad() :
         activeScreen === 'shortlists' ? renderShortlists() :
         renderSearch()}
      </div>

      {/* AI Chat panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="font-semibold text-gray-900">AI Assistant</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`${msg.role === 'user' ? 'ml-8' : 'mr-4'}`}>
              <div className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="mr-4">
              <div className="p-3 bg-gray-100 rounded-xl text-sm text-gray-500">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              placeholder="Ask about players..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button 
              onClick={handleChat}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Replacement Modal */}
      <PlayerReplacementAI 
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        playerId={aiPlayerId}
        onAddToShortlist={(candidate) => {
          console.log('Added to shortlist:', candidate);
        }}
      />

      {/* Create Shortlist Modal */}
      <CreateShortlistModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        data={newShortlistData}
        onConfirm={(data) => {
          console.log('Created shortlist:', data);
          setShowCreateModal(false);
        }}
      />

      {/* Player Activity Timeline Modal */}
      <PlayerActivityTimeline
        show={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
        playerName={activePlayerId ? activePlayerId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''}
        activities={playerActivities[activePlayerId] || []}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
