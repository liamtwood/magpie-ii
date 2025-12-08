import React, { useState } from 'react';
import { 
  Users, ClipboardList, User, Target, BarChart3, Video,
  ChevronDown, ChevronUp, Plus, Star, AlertCircle,
  CalendarDays, MessageSquare, CheckCircle2, 
  Circle, Clock, Activity, Zap, Heart,
  Send, X, Phone, Eye
} from 'lucide-react';

const FCRatingBadge = ({ rating }) => {
  if (!rating) return <span className="text-xs text-gray-400">N/A</span>;
  const getColor = (r) => {
    if (r >= 85) return 'from-emerald-500 to-emerald-600';
    if (r >= 80) return 'from-green-500 to-green-600';
    if (r >= 75) return 'from-lime-500 to-lime-600';
    if (r >= 70) return 'from-yellow-500 to-yellow-600';
    if (r >= 65) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };
  return (
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${getColor(rating)} text-white font-bold text-sm shadow-md`}>
      {rating}
    </div>
  );
};

const SourceBadge = ({ source }) => {
  const sources = {
    statsbomb: { label: 'SB', color: 'bg-blue-600' },
    impect: { label: 'IMP', color: 'bg-purple-600' },
    scoutastic: { label: 'SCT', color: 'bg-green-600' },
  };
  const s = sources[source] || { label: '?', color: 'bg-gray-600' };
  return <span className={`${s.color} text-white px-1.5 py-0.5 rounded text-xs font-medium`}>{s.label}</span>;
};

const InjuryBadge = ({ risk, daysOut }) => {
  const colors = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-red-500' };
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${colors[risk]} bg-opacity-20`}>
      <span className={`w-2 h-2 rounded-full ${colors[risk]}`} />
      <span className="text-xs text-gray-700">{daysOut}d</span>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const safeRating = Math.max(0, Math.min(4, rating || 0));
  const fullStars = Math.floor(safeRating);
  const emptyStars = Math.max(0, 4 - Math.ceil(safeRating));
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3 w-3 text-gray-200" />
      ))}
    </div>
  );
};

const PipelineIndicator = ({ stage }) => (
  <div className="flex gap-1">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} className={`w-2 h-2 rounded-sm ${i < stage ? 'bg-blue-500' : 'bg-gray-200'}`} />
    ))}
  </div>
);

const GateCheckbox = ({ label, checked }) => (
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    {checked ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Circle className="h-3.5 w-3.5 text-gray-300" />}
    {label}
  </div>
);

// END PART 1 - Continue with Part 2

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [expandedShortlist, setExpandedShortlist] = useState('trippier');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShortlistData, setNewShortlistData] = useState(null);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissingIssue, setDismissingIssue] = useState(null);
  const [dismissedIssues, setDismissedIssues] = useState({});
  const [snoozedIssues, setSnoozedIssues] = useState({});
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [playerActivities, setPlayerActivities] = useState({
    "tiago-santos": [
      { id: 1, type: "scout_visit", date: "2024-12-03", user: "Mark Thompson", title: "Live scouting vs PSG", content: "Excellent defensive positioning. Won 4/5 aerial duels." },
      { id: 2, type: "phone_call", date: "2024-12-06", user: "Steve Nickson", title: "Agent call", content: "Player interested in PL. Lille want 15M." },
    ],
    "marc-guehi": [
      { id: 1, type: "scout_visit", date: "2024-12-06", user: "Mark Thompson", title: "Guehi vs Brighton", content: "Dominant performance. Leadership evident." },
    ],
  });
  const [chatMessages] = useState([{ role: 'assistant', text: "Hi! I can help you find players or analyze shortlists." }]);
  const [chatInput, setChatInput] = useState('');

  const screens = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'squad', name: 'Squad', icon: Users },
    { id: 'shortlists', name: 'Shortlists', icon: ClipboardList },
    { id: 'player-profile', name: 'Player Profile', icon: User },
  ];

  const currentWindow = { name: 'Summer 2025', end: 'Aug 31', daysRemaining: 85 };

  const squad = [
    { id: 1, name: 'Nick Pope', position: 'GK', age: 33, contract: '2028', value: '30M', injury: { risk: 'medium', daysOut: 45 }, flag: null, number: 1, nation: 'England', height: "6' 3\"", weight: '168 lbs', stats: { app: 12, sub: 0, saves: 39, ga: 13, fc: 0, fa: 1, yc: 1, rc: 0 }, dob: '19/04/1992', joinedFrom: 'Burnley', joinedDate: 'June 2022', fee: '£12M', bio: 'Signed in a bargain move after Burnley relegation.', fcRating: 88 },
    { id: 26, name: 'John Ruddy', position: 'GK', age: 39, contract: '2025', value: '1M', injury: { risk: 'low', daysOut: 0 }, flag: 'Contract', number: 26, nation: 'England', height: "6' 4\"", weight: '212 lbs', stats: { app: 0, sub: 0, saves: 0, ga: 0 }, dob: '24/10/1986', joinedFrom: 'Free Transfer', joinedDate: 'July 2024', fee: 'Free', bio: 'Third-choice keeper.', fcRating: null },
    { id: 32, name: 'Aaron Ramsdale', position: 'GK', age: 27, contract: '2026', value: '20M', injury: { risk: 'low', daysOut: 0 }, flag: 'Loan', number: 32, nation: 'England', height: "6' 3\"", weight: '192 lbs', stats: { app: 4, sub: 1, saves: 3, ga: 6 }, dob: '14/05/1998', joinedFrom: 'Southampton', joinedDate: 'August 2025', fee: '£4M loan', bio: 'On loan with option to buy.', fcRating: 73 },
    { id: 2, name: 'Kieran Trippier', position: 'RB', age: 35, contract: '2026', value: '12M', injury: { risk: 'high', daysOut: 67 }, flag: 'Contract', number: 2, nation: 'England', height: "5' 10\"", weight: '157 lbs', stats: { app: 9, sub: 1, g: 0, a: 0, sh: 0, st: 0, fc: 13, fa: 8, yc: 1, rc: 0 }, dob: '19/09/1990', joinedFrom: 'Atlético Madrid', joinedDate: 'January 2022', fee: '£12M', bio: 'First major signing under Saudi ownership.', fcRating: 81 },
    { id: 3, name: 'Lewis Hall', position: 'LB', age: 21, contract: '2029', value: '25M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 3, nation: 'England', height: "5' 10\"", weight: '161 lbs', stats: { app: 8, sub: 4, g: 0, a: 1, sh: 6, st: 1, fc: 1, fa: 5, yc: 0, rc: 0 }, dob: '08/09/2004', joinedFrom: 'Chelsea', joinedDate: 'August 2023', fee: '£35M', bio: 'Young left-back signed from Chelsea.', fcRating: null },
    { id: 4, name: 'Sven Botman', position: 'CB', age: 25, contract: '2029', value: '45M', injury: { risk: 'high', daysOut: 180 }, flag: 'ACL', number: 4, nation: 'Netherlands', height: "6' 4\"", weight: '179 lbs', stats: { app: 10, sub: 2, g: 0, a: 0, sh: 2, st: 1, fc: 6, fa: 2, yc: 0, rc: 0 }, dob: '12/01/2000', joinedFrom: 'LOSC Lille', joinedDate: 'July 2022', fee: '£35M', bio: 'Top centre-half target, injury prone.', fcRating: 71 },
    { id: 5, name: 'Fabian Schär', position: 'CB', age: 33, contract: '2026', value: '8M', injury: { risk: 'low', daysOut: 12 }, flag: null, number: 5, nation: 'Switzerland', height: "6' 1\"", weight: '183 lbs', stats: { app: 10, sub: 4, g: 0, a: 0, sh: 7, st: 1, fc: 9, fa: 4, yc: 0, rc: 0 }, dob: '20/12/1991', joinedFrom: 'Deportivo', joinedDate: 'July 2018', fee: '£3M', bio: 'Bargain signing, fan favourite.', fcRating: 82 },
    { id: 6, name: 'Jamaal Lascelles', position: 'CB', age: 32, contract: '2025', value: '3M', injury: { risk: 'medium', daysOut: 90 }, flag: 'Contract', number: 6, nation: 'England', height: "6' 2\"", weight: '194 lbs', stats: { app: 2, sub: 2, g: 0, a: 0 }, dob: '11/11/1993', joinedFrom: 'Nottingham Forest', joinedDate: 'August 2014', fee: '£7M', bio: 'Former club captain.', fcRating: 61 },
    { id: 12, name: 'Malick Thiaw', position: 'CB', age: 24, contract: '2029', value: '35M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 12, nation: 'Germany', height: "6' 3\"", weight: '174 lbs', stats: { app: 12, sub: 1, g: 2, a: 0, sh: 10, st: 4, fc: 6, fa: 2, yc: 1, rc: 0 }, dob: '08/08/2001', joinedFrom: 'AC Milan', joinedDate: 'August 2025', fee: '£30M', bio: 'Signed from AC Milan.', fcRating: 79 },
    { id: 21, name: 'Tino Livramento', position: 'RB', age: 23, contract: '2028', value: '30M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 21, nation: 'England', height: "6' 0\"", weight: '141 lbs', stats: { app: 10, sub: 0, g: 0, a: 1, sh: 2, st: 0, fc: 5, fa: 11, yc: 1, rc: 0 }, dob: '12/11/2002', joinedFrom: 'Southampton', joinedDate: 'August 2023', fee: '£32M', bio: 'Versatile full-back.', fcRating: 80 },
    { id: 33, name: 'Dan Burn', position: 'CB', age: 33, contract: '2027', value: '10M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 33, nation: 'England', height: "6' 6\"", weight: '192 lbs', stats: { app: 14, sub: 0, g: 0, a: 2, sh: 3, st: 0, fc: 23, fa: 7, yc: 3, rc: 1 }, dob: '09/05/1992', joinedFrom: 'Brighton', joinedDate: 'January 2022', fee: '£13M', bio: 'Newcastle favourite son.', fcRating: 82 },
    { id: 7, name: 'Joelinton', position: 'CM', age: 29, contract: '2028', value: '45M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 7, nation: 'Brazil', height: "6' 1\"", weight: '179 lbs', stats: { app: 13, sub: 1, g: 0, a: 0, sh: 10, st: 3, fc: 18, fa: 14, yc: 3, rc: 0 }, dob: '14/08/1996', joinedFrom: 'Hoffenheim', joinedDate: 'July 2019', fee: '£40M', bio: 'Transformed from striker to midfielder.', fcRating: 77 },
    { id: 8, name: 'Sandro Tonali', position: 'CM', age: 25, contract: '2028', value: '55M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 8, nation: 'Italy', height: "5' 11\"", weight: '172 lbs', stats: { app: 15, sub: 3, g: 0, a: 1, sh: 12, st: 5, fc: 9, fa: 14, yc: 0, rc: 0 }, dob: '08/05/2000', joinedFrom: 'AC Milan', joinedDate: 'July 2023', fee: '£55M', bio: 'Serie A title winner.', fcRating: 79 },
    { id: 39, name: 'Bruno Guimarães', position: 'CM', age: 28, contract: '2028', value: '100M', injury: { risk: 'low', daysOut: 4 }, flag: 'Key', number: 39, nation: 'Brazil', height: "6' 0\"", weight: '161 lbs', stats: { app: 14, sub: 1, g: 5, a: 2, sh: 21, st: 8, fc: 24, fa: 33, yc: 3, rc: 0 }, dob: '16/11/1997', joinedFrom: 'Lyon', joinedDate: 'January 2022', fee: '£35M', bio: 'Club captain. Best midfielder in PL.', fcRating: 81 },
    { id: 67, name: 'Lewis Miley', position: 'CM', age: 19, contract: '2029', value: '15M', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 67, nation: 'England', height: "6' 1\"", weight: '159 lbs', stats: { app: 11, sub: 7, g: 1, a: 2, sh: 5, st: 3, fc: 1, fa: 2, yc: 0, rc: 0 }, dob: '01/05/2006', joinedFrom: 'Academy', joinedDate: 'May 2023', fee: 'Academy', bio: 'Youngest ever PL debutant for Newcastle.', fcRating: null },
    { id: 10, name: 'Anthony Gordon', position: 'LW', age: 24, contract: '2029', value: '75M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 10, nation: 'England', height: "6' 0\"", weight: '159 lbs', stats: { app: 10, sub: 2, g: 2, a: 0, sh: 18, st: 7, fc: 8, fa: 16, yc: 0, rc: 1 }, dob: '24/02/2001', joinedFrom: 'Everton', joinedDate: 'January 2023', fee: '£45M', bio: 'Player of the Year 2023-24.', fcRating: 72 },
    { id: 11, name: 'Harvey Barnes', position: 'LW', age: 27, contract: '2028', value: '40M', injury: { risk: 'medium', daysOut: 30 }, flag: null, number: 11, nation: 'England', height: "5' 9\"", weight: '146 lbs', stats: { app: 14, sub: 7, g: 3, a: 0, sh: 20, st: 8, fc: 4, fa: 7, yc: 0, rc: 0 }, dob: '09/12/1997', joinedFrom: 'Leicester', joinedDate: 'July 2023', fee: '£39M', bio: 'FA Cup winner with Leicester.', fcRating: 80 },
    { id: 9, name: 'Yoane Wissa', position: 'CF', age: 29, contract: '2029', value: '50M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 9, nation: 'DR Congo', height: "5' 9\"", weight: '161 lbs', stats: { app: 1, sub: 1, g: 0, a: 0 }, dob: '03/09/1996', joinedFrom: 'Brentford', joinedDate: 'September 2025', fee: '£50M', bio: 'Signed to replace Isak.', fcRating: 81 },
    { id: 27, name: 'Nick Woltemade', position: 'CF', age: 23, contract: '2029', value: '65M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 27, nation: 'Germany', height: "6' 6\"", weight: '196 lbs', stats: { app: 12, sub: 0, g: 5, a: 1, sh: 22, st: 9, fc: 12, fa: 12, yc: 0, rc: 0 }, dob: '14/02/2002', joinedFrom: 'Stuttgart', joinedDate: 'August 2025', fee: '£65M', bio: 'Club record signing.', fcRating: 79 },
  ];

// END PART 2 - Continue with Part 3

const shortlistCandidates = {
    'tiago-santos': {
      id: 'tiago-santos', name: 'Tiago Santos', fullName: 'Tiago Carvalho Santos',
      photoUrl: 'https://i.imgur.com/YB4ZRUc.jpg',
      club: 'LOSC Lille', league: 'Ligue 1', nation: 'Portugal', age: 23,
      dob: '23/07/2002', birthplace: 'Lisboa, Portugal', height: "5' 9\"", heightMetric: '1.75m',
      foot: 'Right', position: 'RB', otherPositions: ['RW', 'RM'], number: 22,
      agent: 'Gestifute', contract: '2029', joinedClub: '05/07/2023',
      marketValue: '€15M', fee: '€12M', wages: '55K/wk', rating: 4, statusStage: 5,
      transferHistory: [
        { season: '23/24', from: 'Estoril', to: 'Lille', fee: '€6.50m' },
        { season: '22/23', from: 'Estoril U23', to: 'Estoril', fee: '-' },
      ],
      youthClubs: ['Sporting CP', 'AD Oeiras', 'Estoril Praia'],
      stats: {
        europaLeague: { app: 4, g: 0, a: 1, mins: 212, startingXI: '60%' },
        ligue1: { app: 2, g: 0, a: 0, mins: 104, startingXI: '12.5%' },
        total: { app: 6, g: 0, a: 1, mins: 316 }
      },
      matchLog: [
        { comp: 'Ligue 1', md: 1, date: '17/08/2025', home: 'Stade Brestois', away: 'Lille', result: '3:3', status: 'injured', note: 'ACL tear' },
        { comp: 'Ligue 1', md: 2, date: '24/08/2025', home: 'Lille', away: 'Monaco', result: '1:0', status: 'injured', note: 'ACL tear' },
        { comp: 'Ligue 1', md: 3, date: '30/08/2025', home: 'FC Lorient', away: 'Lille', result: '1:7', status: 'injured', note: 'ACL tear' },
        { comp: 'Ligue 1', md: 6, date: '28/09/2025', home: 'Lille', away: 'Lyon', result: '0:1', pos: 'RB', status: 'started', mins: 90 },
        { comp: 'Ligue 1', md: 7, date: '05/10/2025', home: 'Lille', away: 'PSG', result: '1:1', status: 'sub', mins: 14, subIn: 76 },
        { comp: 'Europa League', md: 'GS', date: '25/09/2025', home: 'Lille', away: 'Brann', result: '2:1', pos: 'RB', status: 'started', mins: 87 },
        { comp: 'Europa League', md: 'GS', date: '06/11/2025', home: 'Red Star', away: 'Lille', result: '1:0', pos: 'RB', status: 'started', mins: 68 },
      ],
      injuries: [{ type: 'Cruciate ligament tear', period: 'Aug 2025', matchesMissed: 3 }],
      scoutingNotes: 'Dynamic attacking full-back. Strong in 1v1 duels, excellent recovery pace. Recently returned from ACL injury.',
      pros: ['Attacking threat', 'Recovery pace', 'Young with high ceiling', 'Europa League experience'],
      cons: ['Recent ACL injury', 'Limited minutes this season', 'PL physicality adaptation'],
    }
  };

  const shortlists = [
    {
      id: 'trippier', severity: 'critical', position: 'RB', title: 'RB Cover - Trippier',
      trigger: 'Contract expiring', budget: { transfer: 15000000, wages: 80000 }, deadline: 82,
      ballHolder: { name: 'Steve Nickson', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: false, medical: false },
      planB: [
        { id: 1, name: 'Tiago Santos', club: 'Lille', age: 23, rating: 4, statusStage: 5, fee: '€12M', wages: '55K/wk' },
        { id: 2, name: 'Vanderson', club: 'Monaco', age: 23, rating: 3.5, statusStage: 2, fee: '€18M', wages: '70K/wk' },
      ],
    },
    {
      id: 'cb', severity: 'critical', position: 'CB', title: 'CB Cover - Botman ACL',
      trigger: 'Long-term injury', budget: { transfer: 25000000, wages: 70000 }, deadline: 45,
      ballHolder: { name: 'Steve Nickson', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: true, medical: false },
      planB: [
        { id: 6, name: 'Marc Guehi', club: 'Crystal Palace', age: 24, rating: 4, statusStage: 6, fee: '£65M', wages: '100K/wk' },
        { id: 7, name: 'Castello Lukeba', club: 'RB Leipzig', age: 21, rating: 3.5, statusStage: 3, fee: '£35M', wages: '60K/wk' },
      ],
    },
  ];

  const currentYear = 2025;
  const getContractYear = (c) => parseInt(c) || 2030;
  const parseValue = (v) => parseFloat(v.replace(/[^0-9.]/g, '')) * 1000000;
  const formatBudget = (a) => a >= 1000000 ? `£${a / 1000000}M` : `£${a / 1000}K`;
  const getPlayerId = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  const getPlayerActivities = (name) => playerActivities[getPlayerId(name)] || [];

  const getSeverityConfig = (severity) => ({
    critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', dot: 'bg-red-500' },
    moderate: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },
    low: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', dot: 'bg-green-500' },
  }[severity]);

  const activityTypes = {
    discussion: { label: 'Discussion', icon: MessageSquare, color: 'blue' },
    phone_call: { label: 'Phone Call', icon: Phone, color: 'green' },
    scout_visit: { label: 'Scouting Visit', icon: Eye, color: 'purple' },
    video_review: { label: 'Video Review', icon: Video, color: 'orange' },
    meeting: { label: 'Meeting', icon: Users, color: 'cyan' },
  };

  const inferShortlistReason = (player) => {
    const yearsLeft = getContractYear(player.contract) - currentYear;
    const isOlder = player.age >= 32;
    const isExpiring = yearsLeft <= 1;
    const hasLongInjury = player.injury?.daysOut >= 90;
    if (isExpiring && isOlder) return { trigger: 'Contract expiring', severity: 'critical', reasoning: `Contract ends soon and at ${player.age}, succession planning critical.` };
    if (isExpiring) return { trigger: 'Contract expiring', severity: 'critical', reasoning: `Contract expiring. Decision needed.` };
    if (hasLongInjury) return { trigger: 'Long-term injury cover', severity: 'critical', reasoning: `${player.injury.daysOut} days missed.` };
    return { trigger: 'Succession planning', severity: 'moderate', reasoning: 'Proactive squad planning.' };
  };

  const handleCreateShortlist = (player) => {
    const inference = inferShortlistReason(player);
    setNewShortlistData({ player, title: `${player.position} - ${player.name} Replacement`, ...inference, budget: parseValue(player.value), wages: 80000 });
    setShowCreateModal(true);
  };

  const generateSquadIssues = () => {
    const issues = [];
    squad.forEach(player => {
      const yearsLeft = getContractYear(player.contract) - currentYear;
      if (yearsLeft <= 1) issues.push({ id: `${player.id}-contract`, player, type: 'contract', severity: 'critical', score: 90, title: 'Contract expiring', description: `Contract ends ${player.contract}.` });
      if (player.injury?.daysOut >= 90) issues.push({ id: `${player.id}-injury`, player, type: 'injury', severity: 'critical', score: 85, title: 'Long-term injury', description: `${player.injury.daysOut} days missed.` });
    });
    return issues.sort((a, b) => b.score - a.score);
  };

  const squadIssues = generateSquadIssues();
  const activeIssues = squadIssues.filter(i => !dismissedIssues[i.id] && !snoozedIssues[i.id]);
  const criticalIssues = activeIssues.filter(i => i.severity === 'critical');

  const openPlayerTimeline = (playerName) => { setActivePlayerId(getPlayerId(playerName)); setSelectedPlayer({ name: playerName }); setShowTimelineModal(true); };
  const openAddNoteForPlayer = (playerName) => { setActivePlayerId(getPlayerId(playerName)); setSelectedPlayer({ name: playerName }); setShowAddNoteModal(true); };
  const handleDismiss = (issue) => { setDismissingIssue(issue); setShowDismissModal(true); };
  const confirmDismiss = (note, snooze) => {
    if (snooze) setSnoozedIssues({ ...snoozedIssues, [dismissingIssue.id]: { note } });
    else setDismissedIssues({ ...dismissedIssues, [dismissingIssue.id]: { note } });
    setShowDismissModal(false);
  };

// END PART 3 - Continue with Part 4

// MODALS
  const CreateShortlistModal = () => {
    if (!showCreateModal || !newShortlistData) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Create Shortlist</h2>
            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold">{newShortlistData.player.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="flex-1"><div className="font-semibold">{newShortlistData.player.name}</div><div className="text-sm text-gray-500">{newShortlistData.player.position} - Age {newShortlistData.player.age}</div></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3"><Zap className="h-5 w-5 text-blue-600" /><div><div className="text-sm font-medium text-blue-900">Our assumption</div><p className="text-sm text-blue-700 mt-1">{newShortlistData.reasoning}</p></div></div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border rounded-xl">Cancel</button>
            <button onClick={() => { setShowCreateModal(false); setActiveScreen('shortlists'); }} className="flex-1 py-2 bg-slate-900 text-white rounded-xl">Create</button>
          </div>
        </div>
      </div>
    );
  };

  const DismissModal = () => {
    const [note, setNote] = useState('');
    if (!showDismissModal || !dismissingIssue) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Resolve Issue</h2>
            <button onClick={() => setShowDismissModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4"><div className="font-semibold">{dismissingIssue.player.name}</div></div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why is this resolved?" rows={3} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
            <button onClick={() => confirmDismiss(note, true)} className="flex-1 py-2 border rounded-xl">Snooze</button>
            <button onClick={() => confirmDismiss(note, false)} className="flex-1 py-2 bg-green-600 text-white rounded-xl">Resolve</button>
          </div>
        </div>
      </div>
    );
  };

  // SCREENS
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">Squad Health Check</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-100"><div className="text-2xl font-bold text-red-700">{criticalIssues.length}</div><div className="text-xs text-red-600">Critical Issues</div></div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100"><div className="text-2xl font-bold text-green-700">{Object.keys(dismissedIssues).length}</div><div className="text-xs text-green-600">Resolved</div></div>
          <div className="bg-gray-50 rounded-xl p-4 border"><div className="text-2xl font-bold">{Object.keys(snoozedIssues).length}</div><div className="text-xs text-gray-600">Snoozed</div></div>
        </div>
      </div>
      {activeIssues.length === 0 ? (
        <div className="bg-green-50 rounded-xl p-8 text-center border border-green-200"><CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" /><h3 className="text-lg font-semibold text-green-800">All Clear!</h3></div>
      ) : (
        <div className="space-y-3">
          {activeIssues.map(issue => {
            const config = getSeverityConfig(issue.severity);
            return (
              <div key={issue.id} className={`bg-white rounded-xl border-l-4 ${config.border} border p-4`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold">{issue.player.name.split(' ').map(n => n[0]).join('')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="font-semibold">{issue.player.name}</span><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{issue.player.position}</span></div>
                    <div className={`font-medium ${config.text}`}>{issue.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>{issue.score}%</div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => handleCreateShortlist(issue.player)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm">Create Shortlist</button>
                  <button onClick={() => handleDismiss(issue)} className="flex-1 py-2 border rounded-lg text-sm">Resolve</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderSquad = () => (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr className="text-xs font-semibold text-gray-500 uppercase">
            <th className="px-3 py-3 text-left">#</th><th className="px-3 py-3 text-left">Player</th><th className="px-3 py-3 text-left">Pos</th>
            <th className="px-3 py-3 text-left">Age</th><th className="px-3 py-3 text-center">FC</th><th className="px-3 py-3 text-left">Value</th><th className="px-3 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {squad.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-sm text-gray-500">{p.number}</td>
              <td className="px-3 py-2 cursor-pointer" onClick={() => { setSelectedPlayer(p); setActiveScreen('player-profile'); }}>
                <div className="font-medium text-sm hover:text-blue-600">{p.name}</div><div className="text-xs text-gray-500">{p.nation}</div>
              </td>
              <td className="px-3 py-2"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{p.position}</span></td>
              <td className="px-3 py-2 text-sm">{p.age}</td>
              <td className="px-3 py-2 text-center"><FCRatingBadge rating={p.fcRating} /></td>
              <td className="px-3 py-2 text-sm font-medium">{p.value}</td>
              <td className="px-3 py-2"><button onClick={() => handleCreateShortlist(p)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">+ Shortlist</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderShortlists = () => (
    <div className="space-y-4">
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4"><div><div className="text-xs text-slate-400">Window</div><div className="font-semibold">{currentWindow.name}</div></div>
        <div className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">{currentWindow.daysRemaining} days left</div></div>
      </div>
      {shortlists.map((shortlist) => {
        const config = getSeverityConfig(shortlist.severity);
        const isExpanded = expandedShortlist === shortlist.id;
        return (
          <div key={shortlist.id} className={`bg-white rounded-xl border overflow-hidden ${isExpanded ? `${config.border} border-l-4` : ''}`}>
            <div onClick={() => setExpandedShortlist(isExpanded ? null : shortlist.id)} className={`p-4 cursor-pointer flex items-center gap-4 ${isExpanded ? config.bg : 'hover:bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.text} flex items-center justify-center font-bold text-sm border-2 ${config.border}`}>{shortlist.position}</div>
              <div className="flex-1"><div className="font-semibold">{shortlist.title}</div><div className="text-sm text-gray-500">{shortlist.trigger}</div></div>
              <div className="text-right"><div className="text-xs text-gray-400">Budget</div><div className="font-semibold">{formatBudget(shortlist.budget.transfer)}</div></div>
              <div className={`px-3 py-1 rounded-full text-sm ${shortlist.deadline < 50 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{shortlist.deadline}d</div>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
            {isExpanded && (
              <div className="border-t">
                <div className="px-4 py-2 bg-gray-50 border-b flex gap-4">
                  <GateCheckbox label="Scouting" checked={shortlist.gates.scouting} />
                  <GateCheckbox label="Manager" checked={shortlist.gates.manager} />
                  <GateCheckbox label="Budget" checked={shortlist.gates.budget} />
                  <GateCheckbox label="Medical" checked={shortlist.gates.medical} />
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-gray-500 mb-3">CANDIDATES ({shortlist.planB.length})</div>
                  <div className="space-y-2">
                    {shortlist.planB.map((c, idx) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { 
                        const candidateId = c.name.toLowerCase().replace(/\s+/g, '-');
                        setSelectedPlayer(shortlistCandidates[candidateId] || c); 
                        setActiveScreen('player-profile'); 
                      }}>
                        <span className="text-gray-400 w-6">{idx + 1}</span>
                        <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.club} • {c.age}</div></div>
                        <StarRating rating={c.rating} />
                        <div className="text-sm font-medium w-16">{c.fee}</div>
                        <PipelineIndicator stage={c.statusStage} />
                        <button onClick={(e) => { e.stopPropagation(); openAddNoteForPlayer(c.name); }} className="p-1.5 hover:bg-gray-200 rounded"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPlayerProfile = () => {
    const playerId = selectedPlayer?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
    const candidateData = shortlistCandidates[playerId];
    const squadPlayer = squad.find(p => p.name === selectedPlayer?.name);
    const player = candidateData || squadPlayer || squad[0];
    const isCandidate = !!candidateData;
    const activities = getPlayerActivities(player.name);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-6">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.name} className="w-24 h-24 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">{player.number || 'TS'}</div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{player.name}</h1>
                {isCandidate && <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700">Shortlist Candidate</span>}
                {player.flag && <span className={`px-2 py-1 rounded text-xs font-medium ${player.flag === 'Key' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{player.flag}</span>}
                {player.fcRating && <FCRatingBadge rating={player.fcRating} />}
              </div>
              <div className="text-gray-500 mt-1">{player.club || 'Newcastle United'} • {player.position} • Age {player.age}</div>
              {player.otherPositions && <div className="text-xs text-gray-400 mt-1">Also plays: {player.otherPositions.join(', ')}</div>}
              <div className="flex gap-2 mt-3"><SourceBadge source="statsbomb" /><SourceBadge source="impect" /></div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{player.marketValue || player.value}</div>
              <div className="text-sm text-gray-500">Contract: {player.contract}</div>
            </div>
          </div>
        </div>

        {isCandidate && player.scoutingNotes && (
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
            <h3 className="font-bold text-indigo-600 mb-2 flex items-center gap-2"><Target className="h-4 w-4" /> Scouting Assessment</h3>
            <p className="text-gray-700 mb-4">{player.scoutingNotes}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs font-semibold text-green-600 mb-2">Strengths</div>
                {player.pros?.map((p, i) => <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />{p}</div>)}
              </div>
              <div><div className="text-xs font-semibold text-red-600 mb-2">Concerns</div>
                {player.cons?.map((c, i) => <div key={i} className="flex items-center gap-2 text-sm"><AlertCircle className="h-3.5 w-3.5 text-red-500" />{c}</div>)}
              </div>
            </div>
          </div>
        )}

        {isCandidate && player.matchLog && (
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-gray-400 uppercase text-sm mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Match Log</h3>
            <div className="space-y-1 text-sm">
              {player.matchLog.slice(0, 8).map((m, i) => (
                <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded ${m.status === 'injured' ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <span className="text-gray-400 w-8">{m.md}</span>
                  <span className="text-gray-500 w-24">{m.date}</span>
                  <span className="flex-1">{m.home} - {m.away}</span>
                  <span className="font-mono w-10">{m.result}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${m.status === 'started' ? 'bg-green-100 text-green-700' : m.status === 'sub' ? 'bg-blue-100 text-blue-700' : m.status === 'injured' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {m.status === 'started' ? `${m.mins}'` : m.status === 'sub' ? `Sub ${m.mins}'` : m.status === 'injured' ? m.note : 'Bench'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /><span className="font-semibold">Activity Timeline</span></div>
            <button onClick={() => openAddNoteForPlayer(player.name)} className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg flex items-center gap-1"><Plus className="h-3 w-3" /> Add Note</button>
          </div>
          {activities.length === 0 ? <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">No activities yet</div> : (
            <div className="space-y-3">
              {activities.map((a) => {
                const Icon = activityTypes[a.type]?.icon || MessageSquare;
                return (
                  <div key={a.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Icon className="h-4 w-4 text-blue-600" /></div>
                    <div><div className="font-medium text-sm">{a.title}</div><div className="text-xs text-gray-500">{a.date}</div><p className="text-xs text-gray-600 mt-1">{a.content}</p></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CreateShortlistModal />
      <DismissModal />

      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center"><span className="text-white font-bold">M</span></div>
            <div><div className="font-bold">MAGPIE II</div><div className="text-xs text-gray-500">Recruitment</div></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {screens.map((s) => (
            <button key={s.id} onClick={() => setActiveScreen(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeScreen === s.id ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <s.icon className="h-5 w-5" /><span className="font-medium">{s.name}</span>
              {s.id === 'dashboard' && criticalIssues.length > 0 && <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeScreen === s.id ? 'bg-red-500' : 'bg-red-100 text-red-700'}`}>{criticalIssues.length}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">SN</div>
            <div><div className="text-sm font-medium">Steve Nickson</div><div className="text-xs text-gray-500">Head of Recruitment</div></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4"><h1 className="text-xl font-bold">{screens.find(s => s.id === activeScreen)?.name}</h1></header>
        <main className="flex-1 p-6 overflow-auto">
          {activeScreen === 'dashboard' && renderDashboard()}
          {activeScreen === 'squad' && renderSquad()}
          {activeScreen === 'shortlists' && renderShortlists()}
          {activeScreen === 'player-profile' && renderPlayerProfile()}
        </main>
      </div>

      <aside className="w-72 bg-white border-l flex flex-col">
        <div className="p-4 border-b flex items-center gap-2"><Zap className="h-5 w-5 text-amber-500" /><span className="font-semibold">AI Assistant</span></div>
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {chatMessages.map((m, i) => (<div key={i} className={`inline-block px-3 py-2 rounded-xl text-sm max-w-[90%] ${m.role === 'user' ? 'bg-slate-900 text-white ml-auto' : 'bg-gray-100'}`}>{m.text}</div>))}
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about players..." className="flex-1 px-3 py-2 border rounded-xl text-sm" />
            <button className="p-2 bg-slate-900 text-white rounded-xl"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>
    </div>
  );
}
