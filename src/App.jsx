import React, { useState } from 'react';
import { 
  Users, Search, ClipboardList, User, Target, BarChart3, Video,
  ChevronDown, ChevronUp, ChevronRight, Plus, Star, AlertCircle,
  PoundSterling, CalendarDays, Calendar, MessageSquare, Pause, CheckCircle2, 
  Circle, Clock, TrendingUp, Activity, Zap, Shield, Heart,
  Send, X, MoreHorizontal, Filter, ArrowUpDown, Phone, Eye,
  ArrowUp, ArrowDown, ExternalLink, GripVertical, MessageCircle,
  Home, Trophy, Flag, List, LayoutGrid, FileText
} from 'lucide-react';
import WhatsAppPanel from './ui/WhatsAppPanel';
import EnhancedPlayerProfile from './ui/EnhancedPlayerProfile';
import PlayerVisualizer from './ui/PlayerVisualizer';
import PlayerSwipe from './ui/PlayerSwipe';
import { FeedbackButton, IssuesPanel } from './ui/FeedbackSystem';

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
  const safeRating = Math.max(0, Math.min(4, rating || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating % 1 !== 0;
  const emptyStars = Math.max(0, 4 - Math.ceil(safeRating));
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && <Star className="h-3 w-3 fill-amber-200 text-amber-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
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

// Player avatar images - add image URLs here for players
const playerAvatars = {
  'Nick Pope': '/players/pope_1765339295872.png',
  'Aaron Ramsdale': 'https://img.a.transfermarkt.technology/portrait/medium/427568-1681828000.jpg',
  'Max Thompson': '/players/thompson.webp',
  'Mark Gillespie': '/players/gillespie.webp',
  'John Ruddy': '/players/ruddy.webp',
  'Malick Thiaw': '/players/thiaw.webp',
  'Sven Botman': '/players/botman_1765339295866.png',
  'Fabian Schär': '/players/schar_1765339295872.png',
  'Dan Burn': '/players/burn_1765339295867.png',
  'Jamaal Lascelles': '/players/lasalles_1765339295869.png',
  'Lewis Hall': '/players/hall_1765339295868.png',
  'Alex Murphy': '/players/alexmurphy.webp',
  'Tino Livramento': '/players/livramento_1765339295869.png',
  'Kieran Trippier': '/players/trippier_1765339295873.png',
  'Emil Krafth': '/players/krafth.webp',
  'Harrison Ashby': '/players/ashby.webp',
  'Sandro Tonali': '/players/tonali_1765339295873.png',
  'Bruno Guimarães': '/players/guimaraes_1765339295868.png',
  'Jacob Ramsey': '/players/ramsey.webp',
  'Joelinton': '/players/joelinton_1765339295869.png',
  'Lewis Miley': '/players/miley.webp',
  'Joe Willock': '/players/willock.webp',
  'Anthony Gordon': '/players/gordon_1765339295868.png',
  'Harvey Barnes': '/players/barnes_1765339295866.png',
  'Anthony Elanga': '/players/elanga.webp',
  'Jacob Murphy': '/players/murphy_1765339295871.png',
  'Nick Woltemade': '/players/woltemade_1765339295873.png',
  'Yoane Wissa': '/players/wissa.webp',
  'William Osula': '/players/osula.webp',
  'Tiago Santos': '/players/santos_1765321431388.webp',
  'Malo Gusto': '/players/gusto_1765337067.jpg',
  'Devyne Rensch': '/players/rensch_1765337091.jpg',
  'Sander Berge': 'https://img.a.transfermarkt.technology/portrait/medium/298430-1724074631.jpg',
  'Adam Wharton': 'https://img.a.transfermarkt.technology/portrait/medium/744149-1716297290.jpg',
  'Marc Guéhi': 'https://img.a.transfermarkt.technology/portrait/medium/554846-1714647992.jpg',
  'Castello Lukeba': 'https://img.a.transfermarkt.technology/portrait/medium/676924-1698847409.jpg',
};

// Player avatar component with image support and initials fallback
const PlayerAvatar = ({ name, size = 'md', className = '' }) => {
  const imageUrl = playerAvatars[name];
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-lg object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export default function MagpieV2() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [expandedShortlist, setExpandedShortlist] = useState('trippier');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showIssuesPanel, setShowIssuesPanel] = useState(false);
  const [newShortlistData, setNewShortlistData] = useState(null);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissingIssue, setDismissingIssue] = useState(null);
  const [dismissedIssues, setDismissedIssues] = useState({});
  const [snoozedIssues, setSnoozedIssues] = useState({});
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [activeShortlistId, setActiveShortlistId] = useState(null);
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [openShortlistPanel, setOpenShortlistPanel] = useState(null);
  const [shortlistOrder, setShortlistOrder] = useState(['trippier', 'cb', 'longstaff']);
  const [openPlayerPanel, setOpenPlayerPanel] = useState(null);
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false);
  const [activeWhatsAppShortlist, setActiveWhatsAppShortlist] = useState(null);
  const [showEnhancedProfile, setShowEnhancedProfile] = useState(false);
  const [enhancedPlayerId, setEnhancedPlayerId] = useState(null);
  const [enhancedPlayerImage, setEnhancedPlayerImage] = useState(null);
  const [enhancedPlayerShortlistId, setEnhancedPlayerShortlistId] = useState(null);
  const [enhancedSquadPlayer, setEnhancedSquadPlayer] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalPlayer, setStatusModalPlayer] = useState(null);
  const [playerStatuses, setPlayerStatuses] = useState({});
  const [customStatusInput, setCustomStatusInput] = useState('');
  const [selectedStatusOption, setSelectedStatusOption] = useState(null);
  const [squadViewMode, setSquadViewMode] = useState('list');
  const [selectedPitchPosition, setSelectedPitchPosition] = useState(null);
  const [issuesTab, setIssuesTab] = useState('critical');
  
  const standardStatusOptions = [
    { id: 'available', label: 'Available', color: 'bg-green-100 text-green-700' },
    { id: 'injured', label: 'Injured', color: 'bg-red-100 text-red-700' },
    { id: 'rehab', label: 'Rehab', color: 'bg-orange-100 text-orange-700' },
    { id: 'on-loan', label: 'On Loan', color: 'bg-purple-100 text-purple-700' },
    { id: 'suspended', label: 'Suspended', color: 'bg-gray-100 text-gray-700' },
    { id: 'transfer-listed', label: 'Transfer Listed', color: 'bg-amber-100 text-amber-700' },
    { id: 'rested', label: 'Rested', color: 'bg-blue-100 text-blue-700' },
    { id: 'custom', label: 'Custom...', color: 'bg-slate-100 text-slate-700' },
  ];
  const [whatsAppGroups, setWhatsAppGroups] = useState({
    'trippier': {
      hasGroup: true,
      groupName: 'RB Recruitment Team',
      participants: ['Steve Nickson', 'Eddie Howe', 'Mark Thompson', 'Dan Ashworth'],
      messages: [
        { sender: 'Steve Nickson', text: 'Just spoke with Trippier\'s agent. Wage demands still high at £95K/wk.', time: '10:32', isOwn: false },
        { sender: 'Eddie Howe', text: 'That\'s above budget. What about Santos as backup?', time: '10:45', isOwn: false },
        { sender: 'Mark Thompson', text: 'Santos looked great against PSG. I\'d recommend we accelerate contact.', time: '11:02', isOwn: false },
        { sender: 'You', text: 'Agreed. I\'ll set up a call with Gestifute for tomorrow.', time: '11:15', isOwn: true },
        { sender: 'Dan Ashworth', text: 'Good plan. Let\'s have backup options ready for the board meeting Friday.', time: '11:23', isOwn: false },
      ]
    },
    'cb': {
      hasGroup: true,
      groupName: 'CB Emergency Cover',
      participants: ['Steve Nickson', 'Eddie Howe', 'Medical Team', 'Dan Ashworth'],
      messages: [
        { sender: 'Medical Team', text: 'Botman update: ACL surgery successful. Looking at 6-8 month recovery.', time: '09:15', isOwn: false },
        { sender: 'Eddie Howe', text: 'We need to move fast. Guéhi is the priority - can we get a meeting with Palace?', time: '09:32', isOwn: false },
        { sender: 'Steve Nickson', text: 'Palace willing to talk. They want £65M but there\'s room to negotiate.', time: '10:01', isOwn: false },
        { sender: 'You', text: 'I\'ll coordinate with legal on contract structure. Can we do installments?', time: '10:18', isOwn: true },
        { sender: 'Dan Ashworth', text: 'Board approved up to £70M. Let\'s get this done before the window opens.', time: '10:45', isOwn: false },
      ]
    },
    'longstaff': {
      hasGroup: false,
      groupName: null,
      participants: [],
      messages: []
    }
  });
  const [playerActivities, setPlayerActivities] = useState({
    'kieran-trippier': [
      { id: 1, type: 'phone_call', date: '2024-12-05', user: 'Steve Nickson', title: 'Call with Trippier\'s agent', content: 'Discussed wage expectations. Agent pushing for £95K/wk, we offered £75K. Will reconvene next week.' },
      { id: 2, type: 'discussion', date: '2024-12-01', user: 'Eddie Howe', title: 'Manager review meeting', content: 'Eddie confirmed Trippier remains first choice if wages align. Values his leadership and experience.' },
      { id: 3, type: 'status_change', date: '2024-11-25', user: 'System', title: 'Added to shortlist', content: 'RB Cover shortlist initiated due to contract situation.' },
    ],
    'tiago-santos': [
      { id: 1, type: 'scout_visit', date: '2024-12-03', user: 'Mark Thompson', title: 'Live scouting: Santos vs PSG', content: 'Excellent defensive positioning. Won 4/5 aerial duels. Composed on the ball. Looks ready for PL intensity. Recommend progressing to club contact.' },
      { id: 2, type: 'video_review', date: '2024-11-20', user: 'Analysis Team', title: 'Video analysis: 5 match review', content: 'Reviewed matches vs PSG, Lyon, Marseille, Monaco, Lens. Consistently strong. Progressive passing improving. Weakness: occasional lapses in concentration.' },
      { id: 3, type: 'phone_call', date: '2024-12-06', user: 'Steve Nickson', title: 'Call with agent (Jorge Mendes)', content: 'Agent confirmed player interested in PL move. Lille want £15M but may accept £12M + add-ons. Player on £35K/wk, expects £55K minimum.' },
    ],
    'vanderson': [
      { id: 1, type: 'video_review', date: '2024-11-28', user: 'Analysis Team', title: 'Video analysis: Vanderson (Monaco)', content: 'Reviewed 5 matches. Strong going forward, excellent crossing. Positioning concerns in defensive third - gets caught upfield. Needs more review.' },
      { id: 2, type: 'discussion', date: '2024-11-30', user: 'Eddie Howe', title: 'Manager feedback', content: 'Eddie has concerns about defensive discipline. Wants to see more before progressing. Prefer Santos at this stage.' },
    ],
    'marc-guehi': [
      { id: 1, type: 'scout_visit', date: '2024-12-06', user: 'Mark Thompson', title: 'Live scouting: Guéhi vs Brighton', content: 'Dominant performance. Comfortable on ball, excellent reading of game. Leadership qualities evident. £65M looks justified for this quality.' },
      { id: 2, type: 'phone_call', date: '2024-12-04', user: 'Steve Nickson', title: 'Call with Crystal Palace DoF', content: 'Palace willing to negotiate but starting price is £65M. Hinted flexibility if we move quickly before January window opens.' },
      { id: 3, type: 'video_review', date: '2024-11-25', user: 'Analysis Team', title: 'Video analysis: 10 match compilation', content: 'Ball-playing CB with excellent range. Aerial presence strong. Recovery pace adequate. Would slot into our system immediately.' },
      { id: 4, type: 'meeting', date: '2024-12-02', user: 'Eddie Howe', title: 'Transfer committee meeting', content: 'Committee agreed Guéhi is top target for CB. Approved budget up to £70M if needed. Medical team to prepare due diligence.' },
    ],
    'castello-lukeba': [
      { id: 1, type: 'video_review', date: '2024-12-02', user: 'Analysis Team', title: 'Video analysis: Lukeba (Leipzig)', content: 'Excellent ball-playing CB. Quick, agile, reads game well. Some concerns about physicality against PL strikers. Worth pursuing as backup option.' },
      { id: 2, type: 'scout_visit', date: '2024-11-15', user: 'John Bailey', title: 'Live scouting: Leipzig vs Dortmund', content: 'Impressive on the ball but struggled against Füllkrug physically. Young and developing. Potential but not ready as starter.' },
    ],
    'sean-longstaff': [
      { id: 1, type: 'discussion', date: '2024-12-04', user: 'Eddie Howe', title: 'Discussion with Sean', content: 'Sean confirmed he\'s happy at the club but flattered by Saudi interest. Family settled in Newcastle. Will reassess in January if offer increases.' },
      { id: 2, type: 'status_change', date: '2024-12-01', user: 'System', title: 'Added to shortlist', content: 'CM Depth shortlist initiated due to Saudi interest.' },
    ],
    'adam-wharton': [
      { id: 1, type: 'scout_visit', date: '2024-12-01', user: 'Mark Thompson', title: 'Live scouting: Wharton vs Man City', content: 'Outstanding. Dictated tempo against elite opposition. 15.7 pressures, 91% pass accuracy. The real deal.' },
      { id: 2, type: 'video_review', date: '2024-11-28', user: 'Analysis Team', title: 'Full season review', content: '20 years old, already looking like complete midfielder. Composure beyond his years. Would be perfect Bruno backup/partner.' },
      { id: 3, type: 'phone_call', date: '2024-12-05', user: 'Steve Nickson', title: 'Initial contact with Palace', content: 'Palace not keen to sell but acknowledged interest. Would need £45M+ and likely only in summer. Worth monitoring.' },
    ],
  });
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hi! I can help you find players, analyze shortlists, or compare candidates. Try: 'Find pressing midfielders under 25'" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const openEnhancedProfile = (playerName, shortlistId = null, playerImage = null, squadPlayerData = null) => {
    setEnhancedPlayerId(playerName);
    setEnhancedPlayerImage(playerImage || playerAvatars[playerName]);
    setEnhancedPlayerShortlistId(shortlistId);
    setEnhancedSquadPlayer(shortlistId ? null : squadPlayerData);
    setShowEnhancedProfile(true);
  };

  const screens = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'squad', name: 'Squad', icon: Users },
    { id: 'player-search', name: 'Player Search', icon: Search },
    { id: 'shortlists', name: 'Shortlists', icon: ClipboardList },
    { id: 'player-profile', name: 'Player Profile', icon: User },
    { id: 'player-visualizer', name: 'Player Visualizer', icon: Eye },
    { id: 'player-swipe', name: 'Player Swipe', icon: Zap },
  ];

  const currentWindow = {
    name: 'Summer 2025',
    start: 'Jun 10',
    end: 'Aug 31',
    daysRemaining: 85,
  };

  const squad = [
    { id: 1, number: 1, name: 'Nick Pope', position: 'GK', age: 33, contract: '2026', value: '€7M', injury: { risk: 'medium', daysOut: 45 }, flag: '⚠️ Contract', minutes: 2340, country: 'England' },
    { id: 32, number: 32, name: 'Aaron Ramsdale', position: 'GK', age: 27, contract: '2029', value: '€12M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 900, country: 'England' },
    { id: 31, number: 31, name: 'Max Thompson', position: 'GK', age: 21, contract: '2027', value: '€0.25M', injury: { risk: 'low', daysOut: 0 }, flag: '🎓 U21', minutes: 0, country: 'England' },
    { id: 29, number: 29, name: 'Mark Gillespie', position: 'GK', age: 33, contract: '2026', value: '€0.15M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 0, country: 'England' },
    { id: 26, number: 26, name: 'John Ruddy', position: 'GK', age: 39, contract: '2026', value: '€0.1M', injury: { risk: 'low', daysOut: 0 }, flag: '⚠️ Contract', minutes: 0, country: 'England' },
    { id: 12, number: 12, name: 'Malick Thiaw', position: 'CB', age: 24, contract: '2030', value: '€40M', injury: { risk: 'low', daysOut: 0 }, flag: '🆕 New', minutes: 0, country: 'Germany' },
    { id: 4, number: 4, name: 'Sven Botman', position: 'CB', age: 25, contract: '2027', value: '€35M', injury: { risk: 'high', daysOut: 180 }, flag: '🏥 ACL', minutes: 450, country: 'Netherlands' },
    { id: 5, number: 5, name: 'Fabian Schär', position: 'CB', age: 33, contract: '2026', value: '€6M', injury: { risk: 'low', daysOut: 12 }, flag: '⚠️ Contract', minutes: 2100, country: 'Switzerland' },
    { id: 33, number: 33, name: 'Dan Burn', position: 'CB', age: 33, contract: '2027', value: '€5M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 1980, country: 'England' },
    { id: 6, number: 6, name: 'Jamaal Lascelles', position: 'CB', age: 32, contract: '2026', value: '€2M', injury: { risk: 'medium', daysOut: 30 }, flag: '⚠️ Contract', minutes: 360, country: 'England' },
    { id: 3, number: 3, name: 'Lewis Hall', position: 'LB', age: 21, contract: '2029', value: '€32M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 2250, country: 'England' },
    { id: 37, number: 37, name: 'Alex Murphy', position: 'LB', age: 21, contract: '2027', value: '€0.3M', injury: { risk: 'low', daysOut: 0 }, flag: '🎓 U21', minutes: 0, country: 'Ireland' },
    { id: 21, number: 21, name: 'Tino Livramento', position: 'RB', age: 23, contract: '2028', value: '€40M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 2100, country: 'England' },
    { id: 2, number: 2, name: 'Kieran Trippier', position: 'RB', age: 35, contract: '2026', value: '€2.5M', injury: { risk: 'high', daysOut: 67 }, flag: '⚠️ Contract', minutes: 1890, country: 'England' },
    { id: 17, number: 17, name: 'Emil Krafth', position: 'RB', age: 31, contract: '2026', value: '€1.5M', injury: { risk: 'low', daysOut: 0 }, flag: '⚠️ Contract', minutes: 540, country: 'Sweden' },
    { id: 30, number: 30, name: 'Harrison Ashby', position: 'RB', age: 24, contract: '2027', value: '€1.4M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 180, country: 'Scotland' },
    { id: 8, number: 8, name: 'Sandro Tonali', position: 'DM', age: 25, contract: '2028', value: '€75M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 1800, country: 'Italy' },
    { id: 39, number: 39, name: 'Bruno Guimarães', position: 'CM', age: 28, contract: '2028', value: '€75M', injury: { risk: 'low', daysOut: 4 }, flag: '⭐ Key', minutes: 2520, country: 'Brazil' },
    { id: 41, number: 41, name: 'Jacob Ramsey', position: 'CM', age: 24, contract: '2030', value: '€35M', injury: { risk: 'low', daysOut: 0 }, flag: '🆕 New', minutes: 0, country: 'England' },
    { id: 7, number: 7, name: 'Joelinton', position: 'CM', age: 29, contract: '2028', value: '€30M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 2340, country: 'Brazil' },
    { id: 67, number: 67, name: 'Lewis Miley', position: 'CM', age: 19, contract: '2029', value: '€20M', injury: { risk: 'low', daysOut: 0 }, flag: '🌟 Prospect', minutes: 900, country: 'England' },
    { id: 28, number: 28, name: 'Joe Willock', position: 'CM', age: 26, contract: '2027', value: '€16M', injury: { risk: 'medium', daysOut: 60 }, flag: '🏥 Injury', minutes: 720, country: 'England' },
    { id: 10, number: 10, name: 'Anthony Gordon', position: 'LW', age: 24, contract: '2029', value: '€60M', injury: { risk: 'low', daysOut: 0 }, flag: '⭐ Key', minutes: 2580, country: 'England' },
    { id: 11, number: 11, name: 'Harvey Barnes', position: 'LW', age: 28, contract: '2028', value: '€32M', injury: { risk: 'medium', daysOut: 20 }, flag: null, minutes: 1800, country: 'England' },
    { id: 20, number: 20, name: 'Anthony Elanga', position: 'RW', age: 23, contract: '2030', value: '€50M', injury: { risk: 'low', daysOut: 0 }, flag: '🆕 New', minutes: 0, country: 'Sweden' },
    { id: 23, number: 23, name: 'Jacob Murphy', position: 'RW', age: 30, contract: '2027', value: '€15M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 1950, country: 'England' },
    { id: 27, number: 27, name: 'Nick Woltemade', position: 'CF', age: 23, contract: '2031', value: '€70M', injury: { risk: 'low', daysOut: 0 }, flag: '⭐ Key', minutes: 720, country: 'Germany' },
    { id: 9, number: 9, name: 'Yoane Wissa', position: 'CF', age: 29, contract: '2030', value: '€35M', injury: { risk: 'low', daysOut: 0 }, flag: '🆕 New', minutes: 0, country: 'DR Congo' },
    { id: 18, number: 18, name: 'William Osula', position: 'CF', age: 22, contract: '2030', value: '€15M', injury: { risk: 'low', daysOut: 0 }, flag: null, minutes: 360, country: 'Denmark' },
  ];

  const parseValue = (valueStr) => {
    const num = parseFloat(valueStr.replace(/[€£M]/g, ''));
    return num * 1000000;
  };

  const getContractYear = (contract) => parseInt(contract) || 2030;
  const currentYear = 2025;

  const inferShortlistReason = (player) => {
    const contractYear = getContractYear(player.contract);
    const yearsLeft = contractYear - currentYear;
    const isOlder = player.age >= 32;
    const isExpiring = yearsLeft <= 1;
    const hasLongInjury = player.injury.daysOut >= 90;
    const hasTransferInterest = player.flag?.includes('Saudi') || player.flag?.includes('Interest');
    const lowMinutes = player.minutes < 1000;

    let trigger, severity, reasoning;

    if (isExpiring && isOlder) {
      trigger = 'Contract expiring';
      severity = 'critical';
      reasoning = `${player.name}'s contract expires in ${contractYear} and at ${player.age}, this may be their last major contract. We recommend planning for both renewal and replacement.`;
    } else if (isExpiring) {
      trigger = 'Contract expiring';
      severity = 'critical';
      reasoning = `${player.name}'s contract expires in ${contractYear}. Starting replacement search now gives negotiating leverage and backup options.`;
    } else if (hasLongInjury) {
      trigger = 'Long-term injury cover';
      severity = 'critical';
      reasoning = `${player.name} has missed ${player.injury.daysOut} days in the last 12 months. Cover is needed to maintain squad depth.`;
    } else if (hasTransferInterest) {
      trigger = 'Transfer interest received';
      severity = 'moderate';
      reasoning = `There's external interest in ${player.name}. Identifying replacements now prepares for potential departure.`;
    } else if (isOlder) {
      trigger = 'Succession planning';
      severity = 'moderate';
      reasoning = `At ${player.age}, ${player.name} has 2-3 peak years remaining. Succession planning ensures smooth transition.`;
    } else if (lowMinutes) {
      trigger = 'Performance concerns';
      severity = 'low';
      reasoning = `${player.name} has only ${player.minutes} minutes this season. Evaluating alternatives for squad competition.`;
    } else {
      trigger = 'Succession planning';
      severity = 'low';
      reasoning = `Proactive planning for ${player.name}'s position to maintain long-term squad strength.`;
    }

    return { trigger, severity, reasoning };
  };

  const handleCreateShortlist = (player) => {
    const inference = inferShortlistReason(player);
    
    setNewShortlistData({
      player: player,
      title: `${player.position} - ${player.name} Replacement`,
      trigger: inference.trigger,
      severity: inference.severity,
      reasoning: inference.reasoning,
      budget: parseValue(player.value),
      wages: 80000,
    });
    setShowCreateModal(true);
  };

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
        { id: 2, name: 'Malo Gusto', club: 'Chelsea', age: 21, rating: 3, status: 'Video Review', statusStage: 2, fee: '£35M', wages: '£65K/wk' },
        { id: 3, name: 'Devyne Rensch', club: 'Ajax', age: 21, rating: 3, status: 'Data Scouting', statusStage: 1, fee: '£17M', wages: '£40K/wk' },
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

  const getEnhancedProfileData = () => {
    if (!enhancedPlayerId) return { gates: null, activities: [], whatsAppData: null };
    
    const playerSlug = enhancedPlayerId.toLowerCase().replace(/ /g, '-');
    const activities = playerActivities[playerSlug] || [];
    
    let gates = null;
    let whatsAppData = null;
    
    if (enhancedPlayerShortlistId) {
      const shortlist = shortlists.find(s => s.id === enhancedPlayerShortlistId);
      if (shortlist) {
        gates = shortlist.gates;
        whatsAppData = whatsAppGroups[enhancedPlayerShortlistId] || null;
      }
    }
    
    return { gates, activities, whatsAppData };
  };

  const deferredShortlists = [
    { id: 'lw', position: 'LW', title: 'LW Upgrade', reason: 'Market overheated - revisit January', targetWindow: 'January 2026' },
  ];

  const searchTargets = [
    { id: 101, name: 'Adam Wharton', team: 'Crystal Palace', position: 'CM', age: 20, value: '€45M', rating: 4, sources: ['statsbomb', 'impect', 'scoutastic'] },
    { id: 102, name: 'João Neves', team: 'PSG', position: 'CM', age: 20, value: '€80M', rating: 4.5, sources: ['statsbomb', 'secondspectrum', 'noisefeed'] },
    { id: 103, name: 'Tiago Santos', team: 'Lille', position: 'RB', age: 22, value: '€15M', rating: 4, sources: ['statsbomb', 'impect', 'transferroom'] },
    { id: 104, name: 'Marc Guéhi', team: 'Crystal Palace', position: 'CB', age: 24, value: '€70M', rating: 4, sources: ['statsbomb', 'skillcorner', 'scoutastic'] },
    { id: 105, name: 'Malo Gusto', team: 'Chelsea', position: 'RB', age: 21, value: '€35M', rating: 3.5, sources: ['statsbomb', 'impect'] },
  ];

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', dot: 'bg-red-500' },
      moderate: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },
      low: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', dot: 'bg-green-500' },
    };
    return configs[severity];
  };

  const moveShortlistUp = (shortlistId) => {
    setShortlistOrder(prev => {
      const index = prev.indexOf(shortlistId);
      if (index <= 0) return prev;
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  };

  const moveShortlistDown = (shortlistId) => {
    setShortlistOrder(prev => {
      const index = prev.indexOf(shortlistId);
      if (index < 0 || index >= prev.length - 1) return prev;
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  };

  const getOrderedShortlists = () => {
    return shortlistOrder.map(id => shortlists.find(s => s.id === id)).filter(Boolean);
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

  const generateSquadIssues = () => {
    const issues = [];
    
    squad.forEach(player => {
      const contractYear = getContractYear(player.contract);
      const yearsLeft = contractYear - currentYear;
      const isOlder = player.age >= 32;
      const isExpiring = yearsLeft <= 1;
      const hasLongInjury = player.injury.daysOut >= 90;
      const hasMediumInjury = player.injury.daysOut >= 30 && player.injury.daysOut < 90;
      const hasTransferInterest = player.flag?.includes('Saudi') || player.flag?.includes('Interest');
      const isKeyPlayer = player.flag?.includes('Key');
      const lowMinutes = player.minutes < 1000;

      const hasActiveShortlist = shortlists.some(s => 
        s.title.toLowerCase().includes(player.name.toLowerCase()) ||
        s.planA?.player === player.name
      );

      if (isExpiring && isOlder) {
        issues.push({
          id: `${player.id}-contract-age`,
          player,
          type: 'contract_expiring',
          severity: 'critical',
          score: 95,
          title: 'Contract expiring + Age concern',
          description: `Contract ends ${contractYear}. At ${player.age}, likely final major contract. High departure risk.`,
          recommendation: 'Begin succession planning immediately',
          hasActiveShortlist,
        });
      } else if (isExpiring) {
        issues.push({
          id: `${player.id}-contract`,
          player,
          type: 'contract_expiring',
          severity: 'critical',
          score: 85,
          title: 'Contract expiring',
          description: `Contract ends ${contractYear}. Decision needed on renewal vs replacement.`,
          recommendation: 'Open contract discussions or begin replacement search',
          hasActiveShortlist,
        });
      }

      if (hasLongInjury) {
        issues.push({
          id: `${player.id}-injury`,
          player,
          type: 'long_term_injury',
          severity: 'critical',
          score: 90,
          title: 'Long-term injury',
          description: `${player.injury.daysOut} days missed in last 12 months. ${player.flag?.includes('ACL') ? 'ACL injury - 6-9 month recovery typical.' : 'Extended absence impacting squad depth.'}`,
          recommendation: 'Source cover for remainder of season',
          hasActiveShortlist,
        });
      } else if (hasMediumInjury && isKeyPlayer) {
        issues.push({
          id: `${player.id}-injury-key`,
          player,
          type: 'injury_concern',
          severity: 'moderate',
          score: 60,
          title: 'Key player injury pattern',
          description: `${player.injury.daysOut} days missed. As a key player, even moderate absence creates risk.`,
          recommendation: 'Monitor and consider depth options',
          hasActiveShortlist,
        });
      }

      if (hasTransferInterest) {
        issues.push({
          id: `${player.id}-transfer`,
          player,
          type: 'transfer_interest',
          severity: 'moderate',
          score: 70,
          title: 'External transfer interest',
          description: `${player.flag}. Player may push for move or be unsettled.`,
          recommendation: 'Assess player commitment and identify potential replacements',
          hasActiveShortlist,
        });
      }

      if (isOlder && !isExpiring && isKeyPlayer) {
        issues.push({
          id: `${player.id}-succession`,
          player,
          type: 'succession',
          severity: 'moderate',
          score: 50,
          title: 'Succession planning needed',
          description: `Key player aged ${player.age}. Contract secure until ${contractYear} but succession planning advisable.`,
          recommendation: 'Identify and develop long-term replacement',
          hasActiveShortlist,
        });
      }

      if (lowMinutes && !hasLongInjury && player.age < 30) {
        issues.push({
          id: `${player.id}-minutes`,
          player,
          type: 'low_minutes',
          severity: 'low',
          score: 30,
          title: 'Low playing time',
          description: `Only ${player.minutes} minutes this season. May seek move for more game time.`,
          recommendation: 'Discuss role with player, consider loan or sale',
          hasActiveShortlist,
        });
      }
    });

    return issues.sort((a, b) => b.score - a.score);
  };

  const squadIssues = generateSquadIssues();
  const activeIssues = squadIssues.filter(i => !dismissedIssues[i.id] && !snoozedIssues[i.id]);
  const criticalIssues = activeIssues.filter(i => i.severity === 'critical');
  const moderateIssues = activeIssues.filter(i => i.severity === 'moderate');
  const lowIssues = activeIssues.filter(i => i.severity === 'low');

  const handleDismiss = (issue) => {
    setDismissingIssue(issue);
    setShowDismissModal(true);
  };

  const confirmDismiss = (note, snoozeUntil) => {
    if (snoozeUntil) {
      setSnoozedIssues({ ...snoozedIssues, [dismissingIssue.id]: { note, until: snoozeUntil } });
    } else {
      setDismissedIssues({ ...dismissedIssues, [dismissingIssue.id]: { note, date: new Date().toISOString() } });
    }
    setShowDismissModal(false);
    setDismissingIssue(null);
  };

  const activityTypes = {
    discussion: { label: 'Discussion', icon: MessageSquare, color: 'blue' },
    phone_call: { label: 'Phone Call', icon: Phone, color: 'green' },
    scout_visit: { label: 'Scouting Visit', icon: Eye, color: 'purple' },
    video_review: { label: 'Video Review', icon: Video, color: 'orange' },
    status_change: { label: 'Status Change', icon: Activity, color: 'gray' },
    meeting: { label: 'Meeting', icon: Users, color: 'cyan' },
    email: { label: 'Email', icon: Send, color: 'pink' },
  };

  const getPlayerId = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');

  const getPlayerActivities = (playerName) => {
    const playerId = getPlayerId(playerName);
    return playerActivities[playerId] || [];
  };

  const getShortlistActivityCount = (shortlist) => {
    let count = 0;
    if (shortlist.planA) {
      count += getPlayerActivities(shortlist.planA.player).length;
    }
    shortlist.planB.forEach(candidate => {
      count += getPlayerActivities(candidate.name).length;
    });
    return count;
  };

  const getShortlistLastActivity = (shortlist) => {
    let latestDate = null;
    const checkPlayer = (name) => {
      const activities = getPlayerActivities(name);
      if (activities.length > 0 && (!latestDate || activities[0].date > latestDate)) {
        latestDate = activities[0].date;
      }
    };
    if (shortlist.planA) checkPlayer(shortlist.planA.player);
    shortlist.planB.forEach(candidate => checkPlayer(candidate.name));
    return latestDate || 'Never';
  };

  const openPlayerTimeline = (playerName, shortlistId = null) => {
    setActivePlayerId(getPlayerId(playerName));
    setActiveShortlistId(shortlistId);
    setSelectedPlayer({ name: playerName });
    setShowTimelineModal(true);
  };

  const openAddNoteForPlayer = (playerName, shortlistId = null) => {
    setActivePlayerId(getPlayerId(playerName));
    setActiveShortlistId(shortlistId);
    setSelectedPlayer({ name: playerName });
    setShowAddNoteModal(true);
  };

  const openWhatsApp = (shortlist) => {
    setActiveWhatsAppShortlist(shortlist);
    setShowWhatsAppPanel(true);
  };

  const handleInitiateWhatsAppGroup = () => {
    if (activeWhatsAppShortlist) {
      const newGroup = {
        hasGroup: true,
        groupName: `${activeWhatsAppShortlist.title} Team`,
        participants: [activeWhatsAppShortlist.ballHolder.name, 'Eddie Howe', 'Dan Ashworth'],
        messages: [
          { sender: 'System', text: 'Group created. Start collaborating on this shortlist!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: false }
        ]
      };
      setWhatsAppGroups(prev => ({
        ...prev,
        [activeWhatsAppShortlist.id]: newGroup
      }));
    }
  };

  const getWhatsAppGroup = (shortlistId) => {
    return whatsAppGroups[shortlistId] || { hasGroup: false, groupName: null, participants: [], messages: [] };
  };

  const TimelineModal = () => {
    if (!showTimelineModal || !activePlayerId) return null;
    
    const activities = playerActivities[activePlayerId] || [];
    const playerName = selectedPlayer?.name || activePlayerId;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl max-h-[80vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {playerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-bold">{playerName}</h2>
                <p className="text-sm text-gray-500">Activity Timeline • {activities.length} activities</p>
              </div>
            </div>
            <button onClick={() => setShowTimelineModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No activity recorded yet</p>
                <p className="text-sm mt-1">Add a note to start tracking this player</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200" />
                
                <div className="space-y-6">
                  {activities.map((activity) => {
                    const typeConfig = activityTypes[activity.type] || activityTypes.discussion;
                    const IconComponent = typeConfig.icon;
                    
                    return (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ${
                          typeConfig.color === 'blue' ? 'bg-blue-100' :
                          typeConfig.color === 'green' ? 'bg-green-100' :
                          typeConfig.color === 'purple' ? 'bg-purple-100' :
                          typeConfig.color === 'orange' ? 'bg-orange-100' :
                          typeConfig.color === 'cyan' ? 'bg-cyan-100' :
                          typeConfig.color === 'pink' ? 'bg-pink-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            typeConfig.color === 'blue' ? 'text-blue-600' :
                            typeConfig.color === 'green' ? 'text-green-600' :
                            typeConfig.color === 'purple' ? 'text-purple-600' :
                            typeConfig.color === 'orange' ? 'text-orange-600' :
                            typeConfig.color === 'cyan' ? 'text-cyan-600' :
                            typeConfig.color === 'pink' ? 'text-pink-600' : 'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-medium text-gray-900">{activity.title}</div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <span>{activity.user}</span>
                                <span>•</span>
                                <span>{activity.date}</span>
                                <span className={`px-2 py-0.5 rounded ${
                                  typeConfig.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                  typeConfig.color === 'green' ? 'bg-green-100 text-green-700' :
                                  typeConfig.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                  typeConfig.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                  typeConfig.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                                  typeConfig.color === 'pink' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {typeConfig.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{activity.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <button 
              onClick={() => { setShowTimelineModal(false); setShowAddNoteModal(true); }}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Activity for {playerName.split(' ')[1] || playerName}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddNoteModal = () => {
    const [noteType, setNoteType] = useState('discussion');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);

    if (!showAddNoteModal || !activePlayerId) return null;

    const playerName = selectedPlayer?.name || activePlayerId;

    const handleAddNote = () => {
      if (!noteTitle.trim() || !noteContent.trim()) return;

      const newActivity = {
        id: Date.now(),
        type: noteType,
        date: noteDate,
        user: 'Steve Nickson',
        title: noteTitle,
        content: noteContent,
      };

      setPlayerActivities({
        ...playerActivities,
        [activePlayerId]: [newActivity, ...(playerActivities[activePlayerId] || [])],
      });

      setNoteTitle('');
      setNoteContent('');
      setShowAddNoteModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                {playerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-bold">Add Activity</h2>
                <p className="text-sm text-gray-500">{playerName}</p>
              </div>
            </div>
            <button onClick={() => setShowAddNoteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(activityTypes).filter(([key]) => key !== 'status_change').map(([key, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setNoteType(key)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        noteType === key
                          ? 'bg-slate-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder={
                  noteType === 'phone_call' ? `e.g., Call with ${playerName.split(' ')[1]}'s agent` :
                  noteType === 'scout_visit' ? `e.g., Live scouting: ${playerName} vs Liverpool` :
                  noteType === 'video_review' ? `e.g., Video analysis: ${playerName}` :
                  noteType === 'meeting' ? `e.g., Transfer committee: ${playerName}` :
                  `e.g., Discussion about ${playerName}`
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="What happened? Key takeaways, next steps, concerns..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button 
              onClick={() => setShowAddNoteModal(false)}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddNote}
              disabled={!noteTitle.trim() || !noteContent.trim()}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Activity
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DismissModal = () => {
    const [note, setNote] = useState('');
    const [action, setAction] = useState('resolve');
    const [snoozeUntil, setSnoozeUntil] = useState('jan2026');

    if (!showDismissModal || !dismissingIssue) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold">Resolve Issue</h2>
            <button onClick={() => setShowDismissModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                  {dismissingIssue.player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{dismissingIssue.player.name}</div>
                  <div className="text-sm text-gray-500">{dismissingIssue.title}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to do?</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAction('resolve')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    action === 'resolve' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Resolve
                </button>
                <button
                  onClick={() => setAction('snooze')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    action === 'snooze' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Snooze
                </button>
              </div>
            </div>

            {action === 'snooze' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revisit when?</label>
                <select
                  value={snoozeUntil}
                  onChange={(e) => setSnoozeUntil(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="jan2026">January 2026 window</option>
                  <option value="summer2026">Summer 2026 window</option>
                  <option value="30days">In 30 days</option>
                  <option value="90days">In 90 days</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'resolve' ? 'Why is this resolved?' : 'Notes for later'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={action === 'resolve' 
                  ? "e.g., Player confirmed he's happy to stay, taking pay cut. Kids in local school."
                  : "e.g., Will reassess after January transfer window opens"
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button 
              onClick={() => setShowDismissModal(false)}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={() => confirmDismiss(note, action === 'snooze' ? snoozeUntil : null)}
              className={`flex-1 py-2.5 text-white rounded-xl font-medium ${
                action === 'resolve' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {action === 'resolve' ? 'Mark Resolved' : 'Snooze Issue'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateShortlistModal = () => {
    if (!showCreateModal || !newShortlistData) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold">Create New Shortlist</h2>
            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {newShortlistData.player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Creating replacement shortlist for</div>
                <div className="font-semibold">{newShortlistData.player.name}</div>
                <div className="text-sm text-gray-500">{newShortlistData.player.position} • Age {newShortlistData.player.age} • Contract {newShortlistData.player.contract}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Value</div>
                <div className="font-bold text-lg">{newShortlistData.player.value}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900 mb-1">We've made some assumptions</div>
                  <p className="text-sm text-blue-700">{newShortlistData.reasoning}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-sm border border-blue-200">
                      <span className="text-blue-600">Trigger:</span>
                      <span className="font-medium text-blue-900">{newShortlistData.trigger}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-sm border border-blue-200">
                      <span className="text-blue-600">Priority:</span>
                      <span className={`font-medium capitalize ${
                        newShortlistData.severity === 'critical' ? 'text-red-600' : 
                        newShortlistData.severity === 'moderate' ? 'text-amber-600' : 'text-green-600'
                      }`}>{newShortlistData.severity}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-sm border border-blue-200">
                      <span className="text-blue-600">Budget:</span>
                      <span className="font-medium text-blue-900">{formatBudget(newShortlistData.budget)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Adjust if needed</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shortlist Title</label>
              <input
                type="text"
                value={newShortlistData.title}
                onChange={(e) => setNewShortlistData({...newShortlistData, title: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trigger / Reason</label>
              <select 
                value={newShortlistData.trigger}
                onChange={(e) => setNewShortlistData({...newShortlistData, trigger: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option>Succession planning</option>
                <option>Contract expiring</option>
                <option>Long-term injury cover</option>
                <option>Performance concerns</option>
                <option>Transfer interest received</option>
                <option>Age profile upgrade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-3">
                {['critical', 'moderate', 'low'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setNewShortlistData({...newShortlistData, severity: sev})}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                      newShortlistData.severity === sev
                        ? sev === 'critical' ? 'bg-red-500 text-white' : sev === 'moderate' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="text"
                    value={(newShortlistData.budget / 1000000).toFixed(0) + 'M'}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                      setNewShortlistData({...newShortlistData, budget: num * 1000000});
                    }}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Wages (p/w)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="text"
                    value={(newShortlistData.wages / 1000).toFixed(0) + 'K'}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                      setNewShortlistData({...newShortlistData, wages: num * 1000});
                    }}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setShowCreateModal(false);
                setActiveScreen('shortlists');
              }}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
            >
              Create Shortlist
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenStatusModal = (player) => {
    setStatusModalPlayer(player);
    const currentStatus = playerStatuses[player.id];
    if (currentStatus) {
      const isStandard = standardStatusOptions.find(s => s.label === currentStatus);
      if (isStandard) {
        setSelectedStatusOption(isStandard.id);
        setCustomStatusInput('');
      } else {
        setSelectedStatusOption('custom');
        setCustomStatusInput(currentStatus);
      }
    } else {
      setSelectedStatusOption(null);
      setCustomStatusInput('');
    }
    setShowStatusModal(true);
    setOpenActionMenuId(null);
  };

  const handleSaveStatus = () => {
    if (!statusModalPlayer) return;
    let newStatus = '';
    if (selectedStatusOption === 'custom') {
      newStatus = customStatusInput.trim();
    } else if (selectedStatusOption) {
      const option = standardStatusOptions.find(s => s.id === selectedStatusOption);
      newStatus = option?.label || '';
    }
    if (newStatus) {
      setPlayerStatuses({ ...playerStatuses, [statusModalPlayer.id]: newStatus });
    }
    setShowStatusModal(false);
    setStatusModalPlayer(null);
  };

  const getPlayerStatusBadge = (playerId) => {
    const status = playerStatuses[playerId];
    if (!status) return null;
    const option = standardStatusOptions.find(s => s.label === status);
    const colorClass = option ? option.color : 'bg-slate-100 text-slate-700';
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  const StatusModal = () => {
    if (!showStatusModal || !statusModalPlayer) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={() => setShowStatusModal(false)} />
        <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Change Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Update status for {statusModalPlayer.name}</p>
          </div>
          <div className="p-6 space-y-2">
            {standardStatusOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedStatusOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  checked={selectedStatusOption === option.id}
                  onChange={() => setSelectedStatusOption(option.id)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
            {selectedStatusOption === 'custom' && (
              <input
                type="text"
                value={customStatusInput}
                onChange={(e) => setCustomStatusInput(e.target.value)}
                placeholder="Enter custom status..."
                className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            )}
          </div>
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStatus}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
            >
              Save Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { role: 'user', text: chatInput },
      { role: 'assistant', text: `Found 5 matches for your query. Top result: Adam Wharton (Crystal Palace) - 15.7 pressures/90, 91% pass accuracy, 0 days injured in 12 months. Would you like me to add him to a shortlist?` }
    ]);
    setChatInput('');
  };

  const renderDashboardScreen = () => {
    const IssueCard = ({ issue }) => {
      const severityConfig = getSeverityConfig(issue.severity);
      
      return (
        <div className={`bg-white rounded-xl border-l-4 ${severityConfig.border} border border-gray-200 p-4 hover:shadow-md transition-shadow`}>
          <div className="flex items-start gap-4">
            <PlayerAvatar name={issue.player.name} size="lg" className="flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{issue.player.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">{issue.player.position}</span>
                    {issue.hasActiveShortlist && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Shortlist Active</span>
                    )}
                  </div>
                  <div className={`font-medium ${severityConfig.text} mt-0.5`}>{issue.title}</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${severityConfig.bg} ${severityConfig.text}`}>
                  {issue.score}% risk
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">{issue.description}</p>
              
              <div className="flex items-center gap-2 mt-3">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-gray-500">Recommendation:</span>
                <span className="text-xs font-medium text-gray-700">{issue.recommendation}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleCreateShortlist(issue.player)}
              className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Shortlist
            </button>
            <button
              onClick={() => handleDismiss(issue)}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolve / Snooze
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Squad Health Check</h2>
              <p className="text-gray-500 mt-1">Proactive risk detection across your squad</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Last scan: Just now
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{criticalIssues.length}</div>
                  <div className="text-xs text-red-600">Critical Issues</div>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-700">{moderateIssues.length}</div>
                  <div className="text-xs text-amber-600">Moderate Issues</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{Object.keys(dismissedIssues).length}</div>
                  <div className="text-xs text-green-600">Resolved</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Pause className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-700">{Object.keys(snoozedIssues).length}</div>
                  <div className="text-xs text-gray-600">Snoozed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Issues</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIssuesTab('critical')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                issuesTab === 'critical' 
                  ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Critical
              <span className="bg-red-200 text-red-800 px-1.5 py-0.5 rounded text-xs">{criticalIssues.length}</span>
            </button>
            <button
              onClick={() => setIssuesTab('moderate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                issuesTab === 'moderate' 
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Moderate
              <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-xs">{moderateIssues.length}</span>
            </button>
            <button
              onClick={() => setIssuesTab('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                issuesTab === 'resolved' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolved
              <span className="bg-green-200 text-green-800 px-1.5 py-0.5 rounded text-xs">{Object.keys(dismissedIssues).length}</span>
            </button>
            <button
              onClick={() => setIssuesTab('snoozed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                issuesTab === 'snoozed' 
                  ? 'bg-gray-200 text-gray-700 border-2 border-gray-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Pause className="h-4 w-4" />
              Snoozed
              <span className="bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-xs">{Object.keys(snoozedIssues).length}</span>
            </button>
          </div>

          {issuesTab === 'critical' && (
            <div className="space-y-3">
              {criticalIssues.length > 0 ? (
                criticalIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
              ) : (
                <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">No critical issues</p>
                </div>
              )}
            </div>
          )}

          {issuesTab === 'moderate' && (
            <div className="space-y-3">
              {moderateIssues.length > 0 ? (
                moderateIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
              ) : (
                <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">No moderate issues</p>
                </div>
              )}
            </div>
          )}

          {issuesTab === 'resolved' && (
            <div className="space-y-3">
              {Object.keys(dismissedIssues).length > 0 ? (
                squadIssues.filter(i => dismissedIssues[i.id]).map(issue => (
                  <div key={issue.id} className="bg-green-50 rounded-xl border border-green-200 p-4 flex items-center gap-4">
                    <PlayerAvatar name={issue.player.name} image={playerAvatars[issue.player.name]} size="md" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{issue.player.name}</div>
                      <div className="text-sm text-gray-600">{issue.title}</div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Resolved</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">No resolved issues yet</p>
                </div>
              )}
            </div>
          )}

          {issuesTab === 'snoozed' && (
            <div className="space-y-3">
              {Object.keys(snoozedIssues).length > 0 ? (
                squadIssues.filter(i => snoozedIssues[i.id]).map(issue => (
                  <div key={issue.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <PlayerAvatar name={issue.player.name} image={playerAvatars[issue.player.name]} size="md" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{issue.player.name}</div>
                      <div className="text-sm text-gray-600">{issue.title}</div>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600">
                      <Pause className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Until {snoozedIssues[issue.id].until === 'jan2026' ? 'Jan 2026' : snoozedIssues[issue.id].until}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">No snoozed issues</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSquadScreen = () => {
    const positionCounts = squad.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {});
    
    const totalValue = squad.reduce((sum, p) => sum + parseValue(p.value), 0);
    const avgAge = (squad.reduce((sum, p) => sum + p.age, 0) / squad.length).toFixed(1);
    const injuredCount = squad.filter(p => p.injury.daysOut > 30).length;
    
    return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Squad Overview</h2>
            <p className="text-gray-500 mt-1">Current squad composition and status</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setSquadViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  squadViewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button 
                onClick={() => setSquadViewMode('pitch')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  squadViewMode === 'pitch' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Pitch
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{squad.length}</div>
                <div className="text-xs text-slate-500">Total Players</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{positionCounts['GK'] || 0}</div>
                <div className="text-xs text-green-600">Goalkeepers</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{(positionCounts['CB'] || 0) + (positionCounts['RB'] || 0) + (positionCounts['LB'] || 0)}</div>
                <div className="text-xs text-blue-600">Defenders</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{positionCounts['CM'] || 0}</div>
                <div className="text-xs text-purple-600">Midfielders</div>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">{(positionCounts['LW'] || 0) + (positionCounts['RW'] || 0) + (positionCounts['CF'] || 0)}</div>
                <div className="text-xs text-amber-600">Attackers</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{injuredCount}</div>
                <div className="text-xs text-red-600">Long-term Injured</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Squad Value</div>
            <div className="text-lg font-bold text-gray-900">€{(totalValue / 1000000).toFixed(0)}M</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Average Age</div>
            <div className="text-lg font-bold text-gray-900">{avgAge} years</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Players with Flags</div>
            <div className="text-lg font-bold text-gray-900">{squad.filter(p => p.flag).length}</div>
          </div>
        </div>
      </div>

      {squadViewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs font-semibold text-gray-500 uppercase">
                <th className="px-3 py-3 text-center w-12">#</th>
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
                <tr key={player.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEnhancedProfile(player.name, null, playerAvatars[player.name], player)}>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-bold text-gray-700">{player.number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <PlayerAvatar name={player.name} size="sm" />
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
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
                    <div className="flex items-center gap-2">
                      {player.flag && <span className="text-sm">{player.flag}</span>}
                      {getPlayerStatusBadge(player.id)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setOpenActionMenuId(openActionMenuId === player.id ? null : player.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                      {openActionMenuId === player.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleCreateShortlist(player); 
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4 text-gray-400" />
                            Create Shortlist
                          </button>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleOpenStatusModal(player);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Activity className="h-4 w-4 text-gray-400" />
                            Change Status
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <X className="h-4 w-4" />
                            Delete Player
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1 bg-gradient-to-b from-green-600 to-green-700 rounded-xl p-6 relative" style={{ minHeight: '600px' }}>
            <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/30 -translate-x-1/2" />
            <div className="absolute left-1/2 top-1/2 w-24 h-24 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute left-4 right-4 top-4 h-24 border-b-2 border-l-2 border-r-2 border-white/30" style={{ borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}>
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-40 h-12 border-b-2 border-l-2 border-r-2 border-white/30" />
            </div>
            <div className="absolute left-4 right-4 bottom-4 h-24 border-t-2 border-l-2 border-r-2 border-white/30">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 h-12 border-t-2 border-l-2 border-r-2 border-white/30" />
            </div>

            {(() => {
              const formation433 = [
                { pos: 'GK', x: 50, y: 90, label: 'GK' },
                { pos: 'LB', x: 15, y: 70, label: 'LB' },
                { pos: 'CB', x: 35, y: 75, label: 'CB' },
                { pos: 'CB', x: 65, y: 75, label: 'CB', secondary: true },
                { pos: 'RB', x: 85, y: 70, label: 'RB' },
                { pos: 'CM', x: 30, y: 50, label: 'CM' },
                { pos: 'CM', x: 50, y: 45, label: 'CM', secondary: true },
                { pos: 'CM', x: 70, y: 50, label: 'CM', tertiary: true },
                { pos: 'LW', x: 15, y: 20, label: 'LW' },
                { pos: 'CF', x: 50, y: 15, label: 'CF' },
                { pos: 'RW', x: 85, y: 20, label: 'RW' },
              ];

              const getPlayerForPosition = (pos, secondary, tertiary) => {
                const posPlayers = squad.filter(p => p.position === pos);
                if (tertiary) return posPlayers[2] || null;
                if (secondary) return posPlayers[1] || null;
                return posPlayers[0] || null;
              };

              const getShortlistForPosition = (pos) => {
                return shortlists.find(s => s.position === pos);
              };

              return formation433.map((slot, idx) => {
                const player = getPlayerForPosition(slot.pos, slot.secondary, slot.tertiary);
                const shortlist = getShortlistForPosition(slot.pos);
                const isSelected = selectedPitchPosition === `${slot.pos}-${idx}`;
                const hasShortlist = !!shortlist;

                return (
                  <div
                    key={idx}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
                    style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                    onClick={() => setSelectedPitchPosition(isSelected ? null : `${slot.pos}-${idx}`)}
                  >
                    <div className={`relative ${isSelected ? 'ring-4 ring-yellow-400 rounded-lg' : ''}`}>
                      {player ? (
                        <PlayerAvatar name={player.name} size="lg" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-white/20 border-2 border-dashed border-white/40 flex items-center justify-center">
                          <span className="text-white/60 text-xs font-bold">{slot.label}</span>
                        </div>
                      )}
                      {hasShortlist && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">{shortlist.planB.length}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <div className="text-white text-xs font-semibold drop-shadow-lg">
                        {player ? player.name.split(' ').pop() : slot.label}
                      </div>
                      {player && player.flag && (
                        <div className="text-yellow-300 text-[10px] font-medium">{player.flag}</div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {selectedPitchPosition && (
            <div className="w-80 bg-white rounded-xl border border-gray-200 p-4 overflow-hidden">
              {(() => {
                const [pos] = selectedPitchPosition.split('-');
                const currentPlayers = squad.filter(p => p.position === pos);
                const shortlist = shortlists.find(s => s.position === pos);

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{pos} Position</h3>
                      <button
                        onClick={() => setSelectedPitchPosition(null)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Squad</div>
                      <div className="space-y-2">
                        {currentPlayers.length > 0 ? currentPlayers.map(player => (
                          <div
                            key={player.id}
                            onClick={() => openEnhancedProfile(player.name, null, playerAvatars[player.name], player)}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                          >
                            <PlayerAvatar name={player.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">{player.name}</div>
                              <div className="text-xs text-gray-500">Age {player.age} • {player.value}</div>
                            </div>
                            {player.flag && <span className="text-xs">{player.flag}</span>}
                          </div>
                        )) : (
                          <div className="text-sm text-gray-400 italic">No players in this position</div>
                        )}
                      </div>
                    </div>

                    {shortlist && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                          Candidates
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px]">
                            {shortlist.planB.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {shortlist.planB.map(candidate => (
                            <div
                              key={candidate.id}
                              onClick={() => {
                                setEnhancedPlayerId(candidate.name);
                                setEnhancedPlayerShortlistId(shortlist.id);
                                setShowEnhancedProfile(true);
                              }}
                              className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer border border-blue-100"
                            >
                              <PlayerAvatar name={candidate.name} size="sm" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">{candidate.name}</div>
                                <div className="text-xs text-gray-500">{candidate.club} • {candidate.fee}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < candidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setExpandedShortlist(shortlist.id)}
                          className="w-full mt-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Full Shortlist
                        </button>
                      </div>
                    )}

                    {!shortlist && currentPlayers.length > 0 && (
                      <button
                        onClick={() => handleCreateShortlist(currentPlayers[0])}
                        className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Shortlist
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
  };

  const [searchFilters, setSearchFilters] = useState({
    position: 'CM',
    name: '',
    country: '',
    league: '',
    club: '',
    ageMin: 18,
    ageMax: 35,
    valueMin: 0,
    valueMax: 150,
    contractMin: 6,
    contractMax: 60,
    ovrMin: 0,
    disMin: 0,
    proMin: 0,
    fcMin: 0,
    phyInMin: 0,
    phyOutMin: 0,
    phyMin: 0,
    defMin: 0,
    preMin: 0,
  });
  const [searchSort, setSearchSort] = useState({ field: 'overall', direction: 'desc' });

  const searchPlayersData = [
    { id: 1, name: 'Pedri', number: 8, age: 23, club: 'Barcelona', country: 'Spain', league: 'LaLiga', value: '€140M', tier: 1, overall: 9.08, distribution: 6.88, progression: 8.07, finishing: 6.52, physicalIn: 4.37, physicalOut: 6.59, physicalOther: 6.46, defending: 2.49, pressing: 3.95, image: 'https://img.a.transfermarkt.technology/portrait/medium/683840-1744278342.jpg', tmUrl: 'https://www.transfermarkt.us/pedri/profil/spieler/683840' },
    { id: 2, name: 'Vitinha', number: 17, age: 25, club: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1', value: '€90M', tier: 1, overall: 8.25, distribution: 8.43, progression: 7.86, finishing: 5.78, physicalIn: 4.00, physicalOut: 5.12, physicalOther: 9.22, defending: 2.09, pressing: 1.59, image: 'https://img.a.transfermarkt.technology/portrait/header/487469-1749415169.jpg', tmUrl: 'https://www.transfermarkt.us/vitinha/profil/spieler/487469' },
    { id: 3, name: 'Ismael Saibari', number: 34, age: 24, club: 'PSV Eindhoven', country: 'Netherlands', league: 'Eredivisie', value: '€27M', tier: 2, overall: 8.03, distribution: 5.18, progression: 3.49, finishing: 7.82, physicalIn: 4.07, physicalOut: 5.10, physicalOther: 8.89, defending: 3.43, pressing: 3.85, image: 'https://img.a.transfermarkt.technology/portrait/medium/702869-1765214009.jpg', tmUrl: 'https://www.transfermarkt.us/ismael-saibari/profil/spieler/702869' },
    { id: 4, name: 'Bruno Guimarães', number: 39, age: 28, club: 'Newcastle United', country: 'England', league: 'Premier League', value: '€80M', tier: 1, overall: 7.61, distribution: 6.06, progression: 4.85, finishing: 3.77, physicalIn: 4.31, physicalOut: 5.86, physicalOther: 6.55, defending: 3.08, pressing: 2.13, image: 'https://img.a.transfermarkt.technology/portrait/header/520624-1668522672.jpg', tmUrl: 'https://www.transfermarkt.us/bruno-guimaraes/profil/spieler/520624' },
    { id: 5, name: 'Florian Wirtz', number: 7, age: 22, club: 'Liverpool', country: 'England', league: 'Premier League', value: '€140M', tier: 1, overall: 8.89, distribution: 7.12, progression: 7.54, finishing: 7.21, physicalIn: 3.89, physicalOut: 4.78, physicalOther: 7.88, defending: 2.11, pressing: 2.87, image: 'https://img.a.transfermarkt.technology/portrait/medium/598577-1689710503.jpg', tmUrl: 'https://www.transfermarkt.us/florian-wirtz/profil/spieler/598577' },
    { id: 6, name: 'Jamal Musiala', number: 10, age: 22, club: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', value: '€140M', tier: 1, overall: 8.76, distribution: 6.95, progression: 7.23, finishing: 6.89, physicalIn: 4.12, physicalOut: 5.01, physicalOther: 8.12, defending: 2.34, pressing: 2.45, image: 'https://img.a.transfermarkt.technology/portrait/header/580195-1711745441.jpg', tmUrl: 'https://www.transfermarkt.us/jamal-musiala/profil/spieler/580195' },
    { id: 7, name: 'Declan Rice', number: 41, age: 26, club: 'Arsenal', country: 'England', league: 'Premier League', value: '€120M', tier: 1, overall: 7.26, distribution: 5.71, progression: 3.67, finishing: 5.34, physicalIn: 3.86, physicalOut: 4.84, physicalOther: 8.14, defending: 3.75, pressing: 2.13, image: 'https://img.a.transfermarkt.technology/portrait/header/357662-1687962936.jpg', tmUrl: 'https://www.transfermarkt.us/declan-rice/profil/spieler/357662' },
    { id: 8, name: 'Joshua Kimmich', number: 6, age: 30, club: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', value: '€45M', tier: 2, overall: 7.24, distribution: 7.18, progression: 5.64, finishing: 5.38, physicalIn: 3.48, physicalOut: 5.34, physicalOther: 8.06, defending: 4.30, pressing: 1.50, image: 'https://img.a.transfermarkt.technology/portrait/header/161056-1700039639.jpg', tmUrl: 'https://www.transfermarkt.us/joshua-kimmich/profil/spieler/161056' },
    { id: 9, name: 'Frenkie de Jong', number: 21, age: 28, club: 'Barcelona', country: 'Spain', league: 'LaLiga', value: '€45M', tier: 2, overall: 7.21, distribution: 5.50, progression: 6.60, finishing: 3.08, physicalIn: 2.97, physicalOut: 4.74, physicalOther: 9.28, defending: 1.99, pressing: 1.86, image: 'https://img.a.transfermarkt.technology/portrait/header/326330-1746041680.jpg', tmUrl: 'https://www.transfermarkt.us/frenkie-de-jong/profil/spieler/326330' },
    { id: 10, name: 'Martin Ødegaard', number: 8, age: 26, club: 'Arsenal', country: 'England', league: 'Premier League', value: '€80M', tier: 1, overall: 7.18, distribution: 6.12, progression: 4.94, finishing: 6.25, physicalIn: 3.09, physicalOut: 4.97, physicalOther: 8.00, defending: 0.92, pressing: 1.99, image: 'https://img.a.transfermarkt.technology/portrait/header/316264-1678877651.jpg', tmUrl: 'https://www.transfermarkt.us/martin-odegaard/profil/spieler/316264' },
    { id: 11, name: 'Sandro Tonali', number: 8, age: 25, club: 'Newcastle United', country: 'England', league: 'Premier League', value: '€75M', tier: 1, overall: 6.82, distribution: 4.91, progression: 3.90, finishing: 4.02, physicalIn: 4.57, physicalOut: 5.70, physicalOther: 7.02, defending: 9.01, pressing: 4.47, image: 'https://img.a.transfermarkt.technology/portrait/header/397033-1688389270.jpg', tmUrl: 'https://www.transfermarkt.us/sandro-tonali/profil/spieler/397033' },
    { id: 12, name: 'Adam Wharton', number: 20, age: 21, club: 'Crystal Palace', country: 'England', league: 'Premier League', value: '€60M', tier: 1, overall: 7.05, distribution: 5.65, progression: 4.20, finishing: 4.60, physicalIn: 3.86, physicalOut: 5.02, physicalOther: 8.34, defending: 2.21, pressing: 2.20, image: 'https://img.a.transfermarkt.technology/portrait/header/744149-1716297290.jpg', tmUrl: 'https://www.transfermarkt.us/adam-wharton/profil/spieler/744149' },
  ];

  const getMetricColor = (value, max = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-green-300';
    if (percentage >= 30) return 'bg-yellow-200';
    if (percentage >= 15) return 'bg-red-200';
    return 'bg-red-400';
  };

  const MetricCell = ({ value, max = 10 }) => (
    <td className="px-2 py-2 text-center">
      <div className={`px-2 py-1 rounded text-xs font-medium ${getMetricColor(value, max)} ${value >= 7 ? 'text-white' : 'text-gray-800'}`}>
        {value.toFixed(2)}
      </div>
    </td>
  );

  const TierBadge = ({ tier }) => {
    const colors = {
      1: 'bg-green-100 text-green-800 border-green-300',
      2: 'bg-blue-100 text-blue-800 border-blue-300',
      3: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return (
      <span className={`px-2 py-0.5 rounded border text-xs font-medium ${colors[tier] || colors[3]}`}>
        {tier}
      </span>
    );
  };

  // Get unique values for dropdowns (cascading filters)
  const uniqueCountries = [...new Set(searchPlayersData.map(p => p.country))].sort();
  
  const filteredByCountry = searchFilters.country 
    ? searchPlayersData.filter(p => p.country === searchFilters.country)
    : searchPlayersData;
  const uniqueLeagues = [...new Set(filteredByCountry.map(p => p.league))].sort();
  
  const filteredByLeague = searchFilters.league
    ? filteredByCountry.filter(p => p.league === searchFilters.league)
    : filteredByCountry;
  const uniqueClubs = [...new Set(filteredByLeague.map(p => p.club))].sort();

  // Filter and sort players
  const filteredPlayers = searchPlayersData.filter(player => {
    if (searchFilters.name && !player.name.toLowerCase().includes(searchFilters.name.toLowerCase())) return false;
    if (searchFilters.country && player.country !== searchFilters.country) return false;
    if (searchFilters.league && player.league !== searchFilters.league) return false;
    if (searchFilters.club && player.club !== searchFilters.club) return false;
    return true;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aVal = a[searchSort.field];
    const bVal = b[searchSort.field];
    return searchSort.direction === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const renderPlayerSearchScreen = () => (
    <div className="flex gap-4 h-full">
      <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 space-y-4 flex-shrink-0 overflow-auto">
        <h3 className="font-bold text-gray-900">Filters</h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Position</label>
          <select 
            value={searchFilters.position}
            onChange={(e) => setSearchFilters({...searchFilters, position: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CM">CM - Centre Mid</option>
            <option value="CB">CB - Centre Back</option>
            <option value="RB">RB - Right Back</option>
            <option value="LB">LB - Left Back</option>
            <option value="LW">LW - Left Wing</option>
            <option value="RW">RW - Right Wing</option>
            <option value="CF">CF - Centre Forward</option>
            <option value="GK">GK - Goalkeeper</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Player Age</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={searchFilters.ageMin}
              onChange={(e) => setSearchFilters({...searchFilters, ageMin: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              value={searchFilters.ageMax}
              onChange={(e) => setSearchFilters({...searchFilters, ageMax: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
          <input 
            type="range" 
            min="16" 
            max="42" 
            value={searchFilters.ageMax}
            onChange={(e) => setSearchFilters({...searchFilters, ageMax: parseInt(e.target.value)})}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Transfer Value (€M)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={searchFilters.valueMin}
              onChange={(e) => setSearchFilters({...searchFilters, valueMin: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              value={searchFilters.valueMax}
              onChange={(e) => setSearchFilters({...searchFilters, valueMax: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={searchFilters.valueMax}
            onChange={(e) => setSearchFilters({...searchFilters, valueMax: parseInt(e.target.value)})}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Contract Months Left</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={searchFilters.contractMin}
              onChange={(e) => setSearchFilters({...searchFilters, contractMin: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              value={searchFilters.contractMax}
              onChange={(e) => setSearchFilters({...searchFilters, contractMax: parseInt(e.target.value)})}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <label className="block text-xs font-semibold text-gray-500 mb-2">Minimum Metrics</label>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Overall</span>
                <span>{searchFilters.ovrMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.ovrMin}
                onChange={(e) => setSearchFilters({...searchFilters, ovrMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Distribution</span>
                <span>{searchFilters.disMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.disMin}
                onChange={(e) => setSearchFilters({...searchFilters, disMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progression</span>
                <span>{searchFilters.proMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.proMin}
                onChange={(e) => setSearchFilters({...searchFilters, proMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Finishing & Chance</span>
                <span>{searchFilters.fcMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.fcMin}
                onChange={(e) => setSearchFilters({...searchFilters, fcMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Physical (In Poss.)</span>
                <span>{searchFilters.phyInMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.phyInMin}
                onChange={(e) => setSearchFilters({...searchFilters, phyInMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Physical (Out Poss.)</span>
                <span>{searchFilters.phyOutMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.phyOutMin}
                onChange={(e) => setSearchFilters({...searchFilters, phyOutMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Physical (General)</span>
                <span>{searchFilters.phyMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.phyMin}
                onChange={(e) => setSearchFilters({...searchFilters, phyMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Defending</span>
                <span>{searchFilters.defMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.defMin}
                onChange={(e) => setSearchFilters({...searchFilters, defMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Pressing</span>
                <span>{searchFilters.preMin.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={searchFilters.preMin}
                onChange={(e) => setSearchFilters({...searchFilters, preMin: parseFloat(e.target.value)})}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
            Apply Filters
          </button>
          <button className="w-full py-2 mt-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Player Search: {searchFilters.position}</h2>
            <p className="text-sm text-gray-500">Showing {sortedPlayers.length} players matching filters</p>
          </div>
        </div>

        {/* Breadcrumb-style Filter Bar */}
        <div className="bg-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm flex-wrap">
          <div className="flex items-center gap-2 text-white/80">
            <Filter className="h-4 w-4" />
          </div>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <div className="flex items-center gap-1.5 bg-slate-600 rounded text-white/90">
            <Flag className="h-3 w-3 ml-2 flex-shrink-0" />
            <select 
              value={searchFilters.country}
              onChange={(e) => setSearchFilters({...searchFilters, country: e.target.value, league: '', club: ''})}
              className="px-2 py-1 bg-slate-600 text-white text-sm rounded border-none focus:outline-none cursor-pointer appearance-none pr-6"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '16px'}}
            >
              <option value="">All Countries</option>
              {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <div className="flex items-center gap-1.5 bg-slate-600 rounded text-white/90">
            <Trophy className="h-3 w-3 ml-2 flex-shrink-0" />
            <select 
              value={searchFilters.league}
              onChange={(e) => setSearchFilters({...searchFilters, league: e.target.value, club: ''})}
              className="px-2 py-1 bg-slate-600 text-white text-sm rounded border-none focus:outline-none cursor-pointer appearance-none pr-6"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '16px'}}
            >
              <option value="">All Leagues</option>
              {uniqueLeagues.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <div className="flex items-center gap-1.5 bg-slate-600 rounded text-white/90">
            <Shield className="h-3 w-3 ml-2 flex-shrink-0" />
            <select 
              value={searchFilters.club}
              onChange={(e) => setSearchFilters({...searchFilters, club: e.target.value})}
              className="px-2 py-1 bg-slate-600 text-white text-sm rounded border-none focus:outline-none cursor-pointer appearance-none pr-6"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '16px'}}
            >
              <option value="">All Clubs</option>
              {uniqueClubs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-600 rounded text-white/90">
            <User className="h-3 w-3" />
            <input 
              type="text"
              placeholder="Player name..."
              value={searchFilters.name}
              onChange={(e) => setSearchFilters({...searchFilters, name: e.target.value})}
              className="bg-transparent text-white/90 text-sm border-none focus:outline-none placeholder-white/50 w-28"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="px-2 py-1 bg-blue-500 rounded text-white font-medium text-xs">
              {sortedPlayers.length} results
            </div>
            <select 
              value={`${searchSort.field}-${searchSort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSearchSort({ field, direction });
              }}
              className="px-2 py-1 bg-slate-600 rounded text-white/90 text-sm border-none focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer"
            >
              <option value="overall-desc">Overall ↓</option>
              <option value="overall-asc">Overall ↑</option>
              <option value="age-asc">Age ↑</option>
              <option value="age-desc">Age ↓</option>
              <option value="pressing-desc">Pressing ↓</option>
              <option value="defending-desc">Defending ↓</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs font-semibold text-gray-500">
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Player</th>
                  <th className="px-3 py-3 text-left">Age</th>
                  <th className="px-3 py-3 text-left">Country</th>
                  <th className="px-3 py-3 text-left">League</th>
                  <th className="px-3 py-3 text-left">Club</th>
                  <th className="px-3 py-3 text-left">Value</th>
                  <th className="px-3 py-3 text-center">Tier</th>
                  <th className="px-2 py-3 text-center bg-blue-50">Rating</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPlayers.map((player, idx) => (
                  <tr key={player.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEnhancedProfile(player.name, null, player.image, player)}>
                    <td className="px-3 py-2 text-gray-500 font-medium">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <PlayerAvatar name={player.name} size="sm" />
                        )}
                        <span className="font-medium text-gray-900">{player.name}</span>
                        {player.tmUrl && (
                          <a 
                            href={player.tmUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-blue-600"
                            title="View on Transfermarkt"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{player.age}</td>
                    <td className="px-3 py-2 text-gray-600">{player.country}</td>
                    <td className="px-3 py-2 text-gray-600">{player.league}</td>
                    <td className="px-3 py-2 text-gray-700 font-medium">{player.club}</td>
                    <td className="px-3 py-2 font-medium">{player.value}</td>
                    <td className="px-3 py-2 text-center"><TierBadge tier={player.tier} /></td>
                    <MetricCell value={player.overall} />
                    <td className="px-3 py-2 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100"
                      >
                        + Shortlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShortlistsScreen = () => (
    <div className="space-y-6">
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
          {getOrderedShortlists().map((shortlist, index) => {
            const config = getSeverityConfig(shortlist.severity);
            const isExpanded = expandedShortlist === shortlist.id;
            const isFirst = index === 0;
            const isLast = index === getOrderedShortlists().length - 1;

            return (
              <div
                key={shortlist.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  isExpanded ? `${config.border} border-l-4 shadow-lg` : 'border-gray-200'
                }`}
              >
                <div
                  onClick={() => setExpandedShortlist(isExpanded ? null : shortlist.id)}
                  className={`p-4 cursor-pointer flex items-center gap-4 ${isExpanded ? config.bg : 'hover:bg-gray-50'}`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveShortlistUp(shortlist.id); }}
                      disabled={isFirst}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${isFirst ? 'opacity-30 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Move up in priority"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveShortlistDown(shortlist.id); }}
                      disabled={isLast}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${isLast ? 'opacity-30 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Move down in priority"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.text} flex items-center justify-center font-bold text-sm border-2 ${config.border}`}>
                    {shortlist.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{shortlist.title}</div>
                    <div className="text-sm text-gray-500">{shortlist.trigger}</div>
                  </div>
                  <div className="w-40 text-right">
                    <div className="text-xs text-gray-400">BUDGET</div>
                    <div className="font-semibold">{formatBudget(shortlist.budget.transfer)} + {formatBudget(shortlist.budget.wages)}/wk</div>
                  </div>
                  <div className="w-36 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {shortlist.ballHolder.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{shortlist.ballHolder.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-400 truncate">{shortlist.ballHolder.role}</div>
                    </div>
                  </div>
                  <div className={`w-20 text-center px-3 py-1 rounded-full text-sm font-medium ${
                    shortlist.deadline < 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {shortlist.deadline}d left
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenShortlistPanel(shortlist); }}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                    title="Open Shortlist"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-6">
                      <span className="text-xs font-semibold text-gray-500">GATES:</span>
                      <GateCheckbox label="Scouting" checked={shortlist.gates.scouting} />
                      <GateCheckbox label="Manager" checked={shortlist.gates.manager} />
                      <GateCheckbox label="Budget" checked={shortlist.gates.budget} />
                      <GateCheckbox label="Medical" checked={shortlist.gates.medical} />
                    </div>

                    <div className="grid grid-cols-3">
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
                          <div className="grid grid-cols-8 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-200">
                            <div>#</div>
                            <div className="col-span-2">Player</div>
                            <div>Rating</div>
                            <div>Fee</div>
                            <div>Pipeline</div>
                            <div>Activity</div>
                            <div>Actions</div>
                          </div>
                          {shortlist.planB.map((candidate, idx) => (
                            <div
                              key={candidate.id}
                              className={`grid grid-cols-8 gap-2 px-4 py-3 items-center hover:bg-gray-50 ${
                                idx < shortlist.planB.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                            >
                              <div className="text-sm text-gray-400 font-medium">{idx + 1}</div>
                              <div 
                                className="col-span-2 cursor-pointer flex items-center gap-2"
                                onClick={() => openEnhancedProfile(candidate.name, shortlist.id)}
                              >
                                <PlayerAvatar name={candidate.name} size="sm" />
                                <div>
                                  <div className="font-medium hover:text-blue-600">{candidate.name}</div>
                                  <div className="text-xs text-gray-500">{candidate.club} • Age {candidate.age}</div>
                                </div>
                              </div>
                              <div><StarRating rating={candidate.rating} /></div>
                              <div className="text-sm font-medium">{candidate.fee}</div>
                              <div><PipelineIndicator stage={candidate.statusStage} /></div>
                              <div className="text-xs text-gray-500">
                                {getPlayerActivities(candidate.name).length} notes
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); openPlayerTimeline(candidate.name, shortlist.id); }}
                                  className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                                  title="View Timeline"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); openAddNoteForPlayer(candidate.name, shortlist.id); }}
                                  className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                                  title="Add Note"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          Last activity: {getShortlistLastActivity(shortlist)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {getShortlistActivityCount(shortlist)} total activities
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openWhatsApp(shortlist); }}
                          className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 ${
                            getWhatsAppGroup(shortlist.id).hasGroup 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {getWhatsAppGroup(shortlist.id).hasGroup ? 'WhatsApp' : 'Start Chat'}
                        </button>
                        {shortlist.planA && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); openPlayerTimeline(shortlist.planA.player, shortlist.id); }}
                            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            {shortlist.planA.player.split(' ')[1]} Timeline
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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

  const renderPlayerProfileScreen = () => {
    const player = selectedPlayer || {
      name: 'Adam Wharton',
      team: 'Crystal Palace',
      position: 'CM',
      age: 20,
      value: '€45M',
      contract: '2029',
      nationality: 'England',
    };

    return (
      <div className="space-y-6">
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

  const enhancedProfileData = getEnhancedProfileData();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CreateShortlistModal />
      <DismissModal />
      <StatusModal />
      <TimelineModal />
      <AddNoteModal />

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/newcastle-logo.png" alt="Newcastle United" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-bold text-lg tracking-tight text-gray-900">MAGPIE II</div>
              <div className="text-xs text-gray-500">Recruitment Platform</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeScreen === screen.id 
                  ? 'bg-slate-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <screen.icon className="h-5 w-5" />
              <span className="font-medium">{screen.name}</span>
              {screen.id === 'shortlists' && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeScreen === screen.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'}`}>{criticalCount}</span>
              )}
              {screen.id === 'dashboard' && criticalIssues.length > 0 && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeScreen === screen.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'}`}>{criticalIssues.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-200 flex flex-col flex-1 min-h-0">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold">AI Assistant</span>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-auto space-y-2 min-h-0" style={{ maxHeight: '200px' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-3 py-1.5 rounded-lg text-xs max-w-[95%] ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about players..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleChat}
                className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              SN
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Steve Nickson</div>
              <div className="text-xs text-gray-500">Head of Recruitment</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
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

        <main className="flex-1 p-6 overflow-auto">
          {activeScreen === 'dashboard' && renderDashboardScreen()}
          {activeScreen === 'squad' && renderSquadScreen()}
          {activeScreen === 'player-search' && renderPlayerSearchScreen()}
          {activeScreen === 'shortlists' && renderShortlistsScreen()}
          {activeScreen === 'player-profile' && renderPlayerProfileScreen()}
          {activeScreen === 'player-visualizer' && <PlayerVisualizer />}
          {activeScreen === 'player-swipe' && <PlayerSwipe />}
        </main>
      </div>

      {openShortlistPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/30 transition-opacity"
            onClick={() => setOpenShortlistPanel(null)}
          />
          <div className="relative w-[600px] bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            {(() => {
              const shortlist = openShortlistPanel;
              const config = getSeverityConfig(shortlist.severity);
              const rankingKey = shortlist.id;
              const currentRankings = shortlistRankings[rankingKey] || shortlist.planB.map((p, i) => ({ ...p, rank: i + 1 }));
              
              const movePlayer = (index, direction) => {
                const newRankings = [...currentRankings];
                const newIndex = index + direction;
                if (newIndex < 0 || newIndex >= newRankings.length) return;
                [newRankings[index], newRankings[newIndex]] = [newRankings[newIndex], newRankings[index]];
                newRankings.forEach((p, i) => p.rank = i + 1);
                setShortlistRankings({ ...shortlistRankings, [rankingKey]: newRankings });
              };

              return (
                <>
                  <div className={`p-6 border-b border-gray-200 ${config.bg}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${config.bg} ${config.text} flex items-center justify-center font-bold text-lg border-2 ${config.border}`}>
                          {shortlist.position}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{shortlist.title}</h2>
                          <p className="text-sm text-gray-600">{shortlist.trigger}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenShortlistPanel(null)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Budget</div>
                        <div className="font-semibold">{formatBudget(shortlist.budget.transfer)} + {formatBudget(shortlist.budget.wages)}/wk</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ball Holder</div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                            {shortlist.ballHolder.avatar}
                          </div>
                          <span className="font-medium text-sm">{shortlist.ballHolder.name}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Deadline</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                          shortlist.deadline < 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {shortlist.deadline}d left
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs font-semibold text-gray-500">GATES:</span>
                      <GateCheckbox label="Scouting" checked={shortlist.gates.scouting} />
                      <GateCheckbox label="Manager" checked={shortlist.gates.manager} />
                      <GateCheckbox label="Budget" checked={shortlist.gates.budget} />
                      <GateCheckbox label="Medical" checked={shortlist.gates.medical} />
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-6">
                    {shortlist.planA && (
                      <div className="mb-6">
                        <div className="text-xs font-bold text-gray-500 mb-3 tracking-wider">PLAN A: RETAIN</div>
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-lg">{shortlist.planA.player}</div>
                              <div className="text-sm text-gray-500">Age {shortlist.planA.age}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shortlist.planA.statusColor)}`}>
                              {shortlist.planA.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">BLOCKER</div>
                              <div className="text-sm text-red-600">{shortlist.planA.issue}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">NEXT ACTION</div>
                              <div className="text-sm">{shortlist.planA.nextAction}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">CONFIDENCE</span>
                              <span className="font-semibold">{shortlist.planA.confidence}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold text-gray-500 tracking-wider">PLAN B: CANDIDATES ({currentRankings.length})</div>
                        <div className="text-xs text-gray-400">Drag or use arrows to rank</div>
                      </div>
                      
                      <div className="space-y-2">
                        {currentRankings.map((candidate, idx) => (
                          <div
                            key={candidate.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col gap-0.5">
                                <button
                                  onClick={() => movePlayer(idx, -1)}
                                  disabled={idx === 0}
                                  className={`p-1 rounded hover:bg-gray-100 ${idx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => movePlayer(idx, 1)}
                                  disabled={idx === currentRankings.length - 1}
                                  className={`p-1 rounded hover:bg-gray-100 ${idx === currentRankings.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              
                              <PlayerAvatar name={candidate.name} size="md" />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{candidate.name}</span>
                                  <StarRating rating={candidate.rating} />
                                </div>
                                <div className="text-sm text-gray-500">{candidate.club} • Age {candidate.age}</div>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold text-sm">{candidate.fee}</div>
                                <div className="text-xs text-gray-500">{candidate.wages}</div>
                              </div>
                              
                              <div className="pl-3 border-l border-gray-200">
                                <div className="text-xs text-gray-400 mb-1">Pipeline</div>
                                <PipelineIndicator stage={candidate.statusStage} />
                                <div className="text-xs text-gray-600 mt-1">{candidate.status}</div>
                              </div>
                              
                              <div className="flex gap-1 pl-3">
                                <button
                                  onClick={() => openPlayerTimeline(candidate.name, shortlist.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                  title="View Timeline"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => { openEnhancedProfile(candidate.name, shortlist.id); setOpenShortlistPanel(null); }}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                  title="View Profile"
                                >
                                  <User className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Candidate
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        Export
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {openPlayerPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/30 transition-opacity"
            onClick={() => setOpenPlayerPanel(null)}
          />
          <div className="relative w-[600px] bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-800 to-slate-900">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => setOpenPlayerPanel(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="flex-1 flex items-center gap-4 ml-2">
                  <PlayerAvatar name={openPlayerPanel.name} src={openPlayerPanel.image} size="xl" />
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{openPlayerPanel.name}</h2>
                    <p className="text-white/70">{openPlayerPanel.position} • Age {openPlayerPanel.age}</p>
                    <div className="flex gap-2 mt-2">
                      <SourceBadge source="statsbomb" />
                      <SourceBadge source="impect" />
                      <SourceBadge source="scoutastic" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenPlayerPanel(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-700 px-4 py-2 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Home className="h-4 w-4" />
              </div>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-600 rounded text-white/90">
                <Flag className="h-3 w-3" />
                <span>{openPlayerPanel.country || 'England'}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-600 rounded text-white/90">
                <Trophy className="h-3 w-3" />
                <span>{openPlayerPanel.league || 'Premier League'}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-600 rounded text-white/90">
                <Shield className="h-3 w-3" />
                <span>{openPlayerPanel.club}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-600 rounded text-white font-medium">
                <User className="h-3 w-3" />
                <span>({openPlayerPanel.number || '-'}) {openPlayerPanel.name}</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Market Value</div>
                  <div className="text-xl font-bold">{openPlayerPanel.value}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Contract Until</div>
                  <div className="text-xl font-bold">{openPlayerPanel.contract}</div>
                </div>
              </div>

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
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-sm">Medical</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Injury Risk</span>
                    <InjuryBadge risk={openPlayerPanel.injury?.risk || 'low'} daysOut={openPlayerPanel.injury?.daysOut || 0} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minutes Played</span>
                    <span className="font-medium">{openPlayerPanel.minutes || 0}</span>
                  </div>
                </div>
              </div>

              {openPlayerPanel.flag && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">{openPlayerPanel.flag}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button 
                  onClick={() => { handleCreateShortlist(openPlayerPanel); setOpenPlayerPanel(null); }}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Shortlist
                </button>
                <button 
                  onClick={() => { openPlayerTimeline(openPlayerPanel.name, null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EnhancedPlayerProfile
        show={showEnhancedProfile}
        onClose={() => setShowEnhancedProfile(false)}
        playerId={enhancedPlayerId}
        playerImage={enhancedPlayerImage}
        squadPlayer={enhancedSquadPlayer}
        gates={enhancedProfileData.gates}
        activities={enhancedProfileData.activities}
        whatsAppData={enhancedProfileData.whatsAppData}
      />

      <WhatsAppPanel
        show={showWhatsAppPanel}
        onClose={() => setShowWhatsAppPanel(false)}
        shortlistTitle={activeWhatsAppShortlist?.title || ''}
        groupName={activeWhatsAppShortlist ? getWhatsAppGroup(activeWhatsAppShortlist.id).groupName : null}
        hasGroup={activeWhatsAppShortlist ? getWhatsAppGroup(activeWhatsAppShortlist.id).hasGroup : false}
        messages={activeWhatsAppShortlist ? getWhatsAppGroup(activeWhatsAppShortlist.id).messages : []}
        participants={activeWhatsAppShortlist ? getWhatsAppGroup(activeWhatsAppShortlist.id).participants : []}
        onInitiateGroup={handleInitiateWhatsAppGroup}
      />

      <FeedbackButton 
        currentScreen={activeScreen} 
        onOpenPanel={() => setShowIssuesPanel(true)} 
      />
      <IssuesPanel 
        isOpen={showIssuesPanel} 
        onClose={() => setShowIssuesPanel(false)} 
      />

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
