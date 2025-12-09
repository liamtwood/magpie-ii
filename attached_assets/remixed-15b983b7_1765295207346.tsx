import React, { useState } from 'react';
import { 
  Users, Search, ClipboardList, User, Target, BarChart3, Video,
  ChevronDown, ChevronUp, Plus, Star, AlertCircle,
  CalendarDays, MessageSquare, Pause, CheckCircle2, 
  Circle, Clock, TrendingUp, Activity, Zap, Heart,
  Send, X, MoreHorizontal, Filter, Phone, Eye
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

export default function MagpieV2() {
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
      { id: 1, type: "scout_visit", date: "2024-12-03", user: "Mark Thompson", title: "Live scouting vs PSG", content: "Excellent defensive positioning. Won 4/5 aerial duels. Recommend progressing." },
      { id: 2, type: "phone_call", date: "2024-12-06", user: "Steve Nickson", title: "Agent call", content: "Player interested in PL. Lille want 15M." },
    ],
    "marc-guehi": [
      { id: 1, type: "scout_visit", date: "2024-12-06", user: "Mark Thompson", title: "Guehi vs Brighton", content: "Dominant performance. Leadership evident." },
      { id: 2, type: "phone_call", date: "2024-12-04", user: "Steve Nickson", title: "Palace DoF call", content: "Starting price 65M but flexible." },
    ],
    "adam-wharton": [
      { id: 1, type: "scout_visit", date: "2024-12-01", user: "Mark Thompson", title: "Wharton vs Man City", content: "Outstanding. Dictated tempo against elite opposition." },
    ],
  });
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hi! I can help you find players or analyze shortlists." }
  ]);
  const [chatInput, setChatInput] = useState('');

  const screens = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'squad', name: 'Squad', icon: Users },
    { id: 'shortlists', name: 'Shortlists', icon: ClipboardList },
    { id: 'player-profile', name: 'Player Profile', icon: User },
  ];

  const currentWindow = { name: 'Summer 2025', end: 'Aug 31', daysRemaining: 85 };

  const squad = [
    // Goalkeepers
    { id: 1, name: 'Nick Pope', position: 'GK', age: 33, contract: '2028', value: '30M', injury: { risk: 'medium', daysOut: 45 }, flag: null, number: 1, nation: 'England', height: "6' 3\"", weight: '168 lbs', stats: { app: 12, sub: 0, saves: 39, ga: 13, a: 0, fc: 0, fa: 1, yc: 1, rc: 0 }, dob: '19/04/1992', joinedFrom: 'Burnley', joinedDate: 'June 2022', fee: '£12M', bio: 'Signed in a bargain move after Burnley\'s relegation. Instantly became Howe\'s No. 1 and has been a key player ever since.', fcRating: 88 },
    { id: 26, name: 'John Ruddy', position: 'GK', age: 39, contract: '2025', value: '1M', injury: { risk: 'low', daysOut: 0 }, flag: 'Contract', number: 26, nation: 'England', height: "6' 4\"", weight: '212 lbs', stats: { app: 0, sub: 0, saves: 0, ga: 0, a: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '24/10/1986', joinedFrom: 'Free Transfer', joinedDate: 'July 2024', fee: 'Free', bio: 'Experienced shot-stopper signed on a free transfer. Acting as the club\'s third-choice keeper.', fcRating: null },
    { id: 29, name: 'Mark Gillespie', position: 'GK', age: 33, contract: '2026', value: '500K', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 29, nation: 'England', height: "6' 4\"", weight: '183 lbs', stats: null, dob: '27/03/1992', joinedFrom: 'Motherwell', joinedDate: 'July 2020', fee: 'Free', bio: 'A return to the club for the boyhood Magpies fan and academy gem. Signed to add depth to the goalkeeping department.', fcRating: null },
    { id: 31, name: 'Max Thompson', position: 'GK', age: 21, contract: '2027', value: '500K', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 31, nation: 'England', height: "6' 2\"", weight: null, stats: null, dob: null, joinedFrom: 'Academy', joinedDate: null, fee: null, bio: 'Young goalkeeper progressing through the academy ranks.', fcRating: null },
    { id: 32, name: 'Aaron Ramsdale', position: 'GK', age: 27, contract: '2026', value: '20M', injury: { risk: 'low', daysOut: 0 }, flag: 'Loan', number: 32, nation: 'England', height: "6' 3\"", weight: '192 lbs', stats: { app: 4, sub: 1, saves: 3, ga: 6, a: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '14/05/1998', joinedFrom: 'Southampton', joinedDate: 'August 2025', fee: '£4M loan', bio: 'Signed on loan from Southampton with option to buy permanently in 2026.', fcRating: 73 },
    // Defenders
    { id: 2, name: 'Kieran Trippier', position: 'RB', age: 35, contract: '2026', value: '12M', injury: { risk: 'high', daysOut: 67 }, flag: 'Contract', number: 2, nation: 'England', height: "5' 10\"", weight: '157 lbs', stats: { app: 9, sub: 1, g: 0, a: 0, sh: 0, st: 0, fc: 13, fa: 8, yc: 1, rc: 0 }, dob: '19/09/1990', joinedFrom: 'Atlético Madrid', joinedDate: 'January 2022', fee: '£12M', bio: 'First major signing under Saudi ownership. Has brought quality and experience, transformative for the club.', fcRating: 81 },
    { id: 3, name: 'Lewis Hall', position: 'LB', age: 21, contract: '2029', value: '25M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 3, nation: 'England', height: "5' 10\"", weight: '161 lbs', stats: { app: 8, sub: 4, g: 0, a: 1, sh: 6, st: 1, fc: 1, fa: 5, yc: 0, rc: 0 }, dob: '08/09/2004', joinedFrom: 'Chelsea', joinedDate: 'August 2023', fee: '£35M', bio: 'Initially signed on loan with obligation to buy. Transfer structured to defer payment due to FFP concerns.', fcRating: null },
    { id: 4, name: 'Sven Botman', position: 'CB', age: 25, contract: '2029', value: '45M', injury: { risk: 'high', daysOut: 180 }, flag: 'ACL', number: 4, nation: 'Netherlands', height: "6' 4\"", weight: '179 lbs', stats: { app: 10, sub: 2, g: 0, a: 0, sh: 2, st: 1, fc: 6, fa: 2, yc: 0, rc: 0 }, dob: '12/01/2000', joinedFrom: 'LOSC Lille', joinedDate: 'July 2022', fee: '£35M', bio: 'Howe\'s top centre-half target. Quality on the pitch but blighted by injuries throughout his time at the club.', fcRating: 71 },
    { id: 5, name: 'Fabian Schär', position: 'CB', age: 33, contract: '2026', value: '8M', injury: { risk: 'low', daysOut: 12 }, flag: null, number: 5, nation: 'Switzerland', height: "6' 1\"", weight: '183 lbs', stats: { app: 10, sub: 4, g: 0, a: 0, sh: 7, st: 1, fc: 9, fa: 4, yc: 0, rc: 0 }, dob: '20/12/1991', joinedFrom: 'Deportivo de la Coruña', joinedDate: 'July 2018', fee: '£3M', bio: 'Rafa Benitez triggered a release clause for this superb bargain signing who has become a fan favourite.', fcRating: 82 },
    { id: 6, name: 'Jamaal Lascelles', position: 'CB', age: 32, contract: '2025', value: '3M', injury: { risk: 'medium', daysOut: 90 }, flag: 'Contract', number: 6, nation: 'England', height: "6' 2\"", weight: '194 lbs', stats: { app: 2, sub: 2, g: 0, a: 0, sh: 1, st: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '11/11/1993', joinedFrom: 'Nottingham Forest', joinedDate: 'August 2014', fee: '£7M', bio: 'Club captain under Rafa Benitez from August 2016. Signed in a double deal that also saw Karl Darlow arrive.', fcRating: 61 },
    { id: 12, name: 'Malick Thiaw', position: 'CB', age: 24, contract: '2029', value: '35M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 12, nation: 'Germany', height: "6' 3\"", weight: '174 lbs', stats: { app: 12, sub: 1, g: 2, a: 0, sh: 10, st: 4, fc: 6, fa: 2, yc: 1, rc: 0 }, dob: '08/08/2001', joinedFrom: 'AC Milan', joinedDate: 'August 2025', fee: '£30M (up to £34.4M)', bio: 'Recruited from AC Milan in summer 2025. Strong, modern centre-back with Serie A experience.', fcRating: 79 },
    { id: 17, name: 'Emil Krafth', position: 'RB', age: 31, contract: '2026', value: '3M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 17, nation: 'Sweden', height: "6' 0\"", weight: '183 lbs', stats: { app: 1, sub: 0, g: 0, a: 0, sh: 0, st: 0, fc: 1, fa: 0, yc: 0, rc: 0 }, dob: '02/08/1994', joinedFrom: 'SC Amiens', joinedDate: 'August 2019', fee: '£5M', bio: 'Solid squad player for the Magpies since joining. Reliable defensive option.', fcRating: 65 },
    { id: 21, name: 'Tino Livramento', position: 'RB', age: 23, contract: '2028', value: '30M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 21, nation: 'England', height: "6' 0\"", weight: '141 lbs', stats: { app: 10, sub: 0, g: 0, a: 1, sh: 2, st: 0, fc: 5, fa: 11, yc: 1, rc: 0 }, dob: '12/11/2002', joinedFrom: 'Southampton', joinedDate: 'August 2023', fee: '£32M', bio: 'Has shone on Tyneside at both right and left-back. Originally a Chelsea academy product.', fcRating: 80 },
    { id: 30, name: 'Harrison Ashby', position: 'RB', age: 24, contract: '2028', value: '5M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 30, nation: 'Scotland', height: "5' 10\"", weight: '137 lbs', stats: null, dob: null, joinedFrom: 'West Ham', joinedDate: 'January 2024', fee: '£3M', bio: 'Young Scottish full-back signed from West Ham for squad depth.', fcRating: null },
    { id: 33, name: 'Dan Burn', position: 'CB', age: 33, contract: '2027', value: '10M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 33, nation: 'England', height: "6' 6\"", weight: '192 lbs', stats: { app: 14, sub: 0, g: 0, a: 2, sh: 3, st: 0, fc: 23, fa: 7, yc: 3, rc: 1 }, dob: '09/05/1992', joinedFrom: 'Brighton', joinedDate: 'January 2022', fee: '£13M', bio: 'Newcastle\'s favourite son. The giant defender returned home and scored in the Carabao Cup final vs Liverpool.', fcRating: 82 },
    { id: 37, name: 'Alex Murphy', position: 'CB', age: 21, contract: '2028', value: '2M', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 37, nation: 'Ireland', height: "6' 2\"", weight: '172 lbs', stats: { app: 0, sub: 0, g: 0, a: 0, sh: 0, st: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '25/06/2004', joinedFrom: 'Galway United', joinedDate: 'July 2022', fee: 'Undisclosed', bio: 'Galway-born defender who joined the youth ranks. Spent second half of 2024-25 on loan at Bolton.', fcRating: null },
    // Midfielders
    { id: 7, name: 'Joelinton', position: 'CM', age: 29, contract: '2028', value: '45M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 7, nation: 'Brazil', height: "6' 1\"", weight: '179 lbs', stats: { app: 13, sub: 1, g: 0, a: 0, sh: 10, st: 3, fc: 18, fa: 14, yc: 3, rc: 0 }, dob: '14/08/1996', joinedFrom: 'TSG Hoffenheim', joinedDate: 'July 2019', fee: '£40M (club record at time)', bio: 'Signed as a striker but brilliant since transitioning to midfielder under Howe. A complete transformation.', fcRating: 77 },
    { id: 8, name: 'Sandro Tonali', position: 'CM', age: 25, contract: '2028', value: '55M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 8, nation: 'Italy', height: "5' 11\"", weight: '172 lbs', stats: { app: 15, sub: 3, g: 0, a: 1, sh: 12, st: 5, fc: 9, fa: 14, yc: 0, rc: 0 }, dob: '08/05/2000', joinedFrom: 'AC Milan', joinedDate: 'July 2023', fee: '£55M', bio: 'Major signing coaxed away from his beloved Milan. Serie A title winner. Sensational since returning from betting ban suspension.', fcRating: 79 },
    { id: 11, name: 'Harvey Barnes', position: 'LW', age: 27, contract: '2028', value: '40M', injury: { risk: 'medium', daysOut: 30 }, flag: null, number: 11, nation: 'England', height: "5' 9\"", weight: '146 lbs', stats: { app: 14, sub: 7, g: 3, a: 0, sh: 20, st: 8, fc: 4, fa: 7, yc: 0, rc: 0 }, dob: '09/12/1997', joinedFrom: 'Leicester City', joinedDate: 'July 2023', fee: '£39M', bio: 'Signed after Leicester\'s relegation. FA Cup winner with the Foxes in 2021. Direct, pacy winger.', fcRating: 80 },
    { id: 23, name: 'Jacob Murphy', position: 'RW', age: 30, contract: '2027', value: '15M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 23, nation: 'England', height: "5' 10\"", weight: '161 lbs', stats: { app: 12, sub: 3, g: 2, a: 1, sh: 30, st: 10, fc: 0, fa: 5, yc: 0, rc: 0 }, dob: '24/02/1995', joinedFrom: 'Norwich City', joinedDate: 'July 2017', fee: '£12M', bio: 'Grew up as a supporter and completed his dream of playing for Newcastle. Persevered after two loan spells to become key under Howe.', fcRating: 81 },
    { id: 28, name: 'Joe Willock', position: 'CM', age: 26, contract: '2027', value: '25M', injury: { risk: 'medium', daysOut: 60 }, flag: null, number: 28, nation: 'England', height: "5' 10\"", weight: '157 lbs', stats: { app: 6, sub: 4, g: 0, a: 0, sh: 2, st: 0, fc: 3, fa: 1, yc: 0, rc: 0 }, dob: '20/08/1999', joinedFrom: 'Arsenal', joinedDate: 'August 2021', fee: '£25M', bio: 'Signed after stunning loan spell where he scored in 7 straight games. Box-to-box midfielder.', fcRating: 67 },
    { id: 39, name: 'Bruno Guimarães', position: 'CM', age: 28, contract: '2028', value: '100M', injury: { risk: 'low', daysOut: 4 }, flag: 'Key', number: 39, nation: 'Brazil', height: "6' 0\"", weight: '161 lbs', stats: { app: 14, sub: 1, g: 5, a: 2, sh: 21, st: 8, fc: 24, fa: 33, yc: 3, rc: 0 }, dob: '16/11/1997', joinedFrom: 'Lyon', joinedDate: 'January 2022', fee: '£35M + £6.5M add-ons', bio: 'Transformative signing. One of the very best midfielders in the Premier League. Club captain.', fcRating: 81 },
    { id: 41, name: 'Jacob Ramsey', position: 'CM', age: 24, contract: '2029', value: '30M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 41, nation: 'England', height: "5' 11\"", weight: '163 lbs', stats: { app: 7, sub: 5, g: 0, a: 0, sh: 3, st: 1, fc: 4, fa: 1, yc: 2, rc: 0 }, dob: '28/05/2001', joinedFrom: 'Aston Villa', joinedDate: 'August 2025', fee: '£43M', bio: 'Joined from boyhood club Aston Villa. Dynamic midfielder with eye for goal.', fcRating: 70 },
    { id: 67, name: 'Lewis Miley', position: 'CM', age: 19, contract: '2029', value: '15M', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 67, nation: 'England', height: "6' 1\"", weight: '159 lbs', stats: { app: 11, sub: 7, g: 1, a: 2, sh: 5, st: 3, fc: 1, fa: 2, yc: 0, rc: 0 }, dob: '01/05/2006', joinedFrom: 'Academy', joinedDate: 'May 2023', fee: 'Academy', bio: 'Newcastle\'s youngest-ever Premier League debutant. Part of youth set-up since age seven. Huge potential.', fcRating: null },
    { id: 85, name: 'Sam Alabi', position: 'CM', age: 16, contract: '2027', value: '500K', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 85, nation: 'England', height: null, weight: null, stats: null, dob: null, joinedFrom: 'Academy', joinedDate: null, fee: 'Academy', bio: 'Exciting young prospect coming through the academy ranks.', fcRating: null },
    // Forwards
    { id: 9, name: 'Yoane Wissa', position: 'CF', age: 29, contract: '2029', value: '50M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 9, nation: 'DR Congo', height: "5' 9\"", weight: '161 lbs', stats: { app: 1, sub: 1, g: 0, a: 0, sh: 0, st: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '03/09/1996', joinedFrom: 'Brentford', joinedDate: 'September 2025', fee: '£50M (up to £55M)', bio: 'Signed to replace Alexander Isak. Prolific goalscorer at Brentford with pace and movement.', fcRating: 81 },
    { id: 10, name: 'Anthony Gordon', position: 'LW', age: 24, contract: '2029', value: '75M', injury: { risk: 'low', daysOut: 0 }, flag: 'Key', number: 10, nation: 'England', height: "6' 0\"", weight: '159 lbs', stats: { app: 10, sub: 2, g: 2, a: 0, sh: 18, st: 7, fc: 8, fa: 16, yc: 0, rc: 1 }, dob: '24/02/2001', joinedFrom: 'Everton', joinedDate: 'January 2023', fee: '£40M + £5M add-ons', bio: 'Rapidly improved after initial struggles. Player of the Year 2023-24. One of Newcastle\'s key men.', fcRating: 72 },
    { id: 18, name: 'William Osula', position: 'CF', age: 22, contract: '2030', value: '15M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 18, nation: 'Denmark', height: "5' 11\"", weight: '179 lbs', stats: { app: 10, sub: 9, g: 1, a: 0, sh: 7, st: 3, fc: 13, fa: 1, yc: 0, rc: 0 }, dob: '04/08/2003', joinedFrom: 'Sheffield United', joinedDate: 'August 2024', fee: '£15M', bio: 'Young striker signed from Championship outfit Sheffield United. Physical presence with room to develop.', fcRating: null },
    { id: 20, name: 'Anthony Elanga', position: 'RW', age: 23, contract: '2029', value: '55M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 20, nation: 'Sweden', height: "5' 10\"", weight: '152 lbs', stats: { app: 15, sub: 9, g: 0, a: 1, sh: 8, st: 3, fc: 3, fa: 10, yc: 0, rc: 0 }, dob: '27/04/2002', joinedFrom: 'Nottingham Forest', joinedDate: 'July 2025', fee: '£55M (up to £60M)', bio: 'First major signing of summer 2025 window. Pacey Swedish winger with Premier League experience.', fcRating: 75 },
    { id: 27, name: 'Nick Woltemade', position: 'CF', age: 23, contract: '2029', value: '65M', injury: { risk: 'low', daysOut: 0 }, flag: null, number: 27, nation: 'Germany', height: "6' 6\"", weight: '196 lbs', stats: { app: 12, sub: 0, g: 5, a: 1, sh: 22, st: 9, fc: 12, fa: 12, yc: 0, rc: 0 }, dob: '14/02/2002', joinedFrom: 'Stuttgart', joinedDate: 'August 2025', fee: '£65M (up to £69M)', bio: 'Club record signing. Towering German striker with Bundesliga pedigree from Stuttgart.', fcRating: 79 },
    { id: 62, name: 'Sean Neave', position: 'CF', age: 18, contract: '2027', value: '500K', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 62, nation: 'England', height: "6' 0\"", weight: null, stats: { app: 0, sub: 0, g: 0, a: 0, sh: 0, st: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: null, joinedFrom: 'Academy', joinedDate: null, fee: 'Academy', bio: 'Young forward progressing through the academy.', fcRating: null },
    { id: 64, name: 'Park Seung-Soo', position: 'RW', age: 18, contract: '2028', value: '3M', injury: { risk: 'low', daysOut: 0 }, flag: 'Prospect', number: 64, nation: 'South Korea', height: "6' 0\"", weight: '137 lbs', stats: { app: 0, sub: 0, g: 0, a: 0, sh: 0, st: 0, fc: 0, fa: 0, yc: 0, rc: 0 }, dob: '17/03/2007', joinedFrom: 'Suwon Bluewings', joinedDate: 'August 2025', fee: 'Undisclosed', bio: 'Exciting winger who impressed in pre-season. May play a role in Howe\'s plans immediately despite young age.', fcRating: null },
  ];

  const shortlistCandidates = {
    'tiago-santos': {
      id: 'tiago-santos',
      name: 'Tiago Santos',
      fullName: 'Tiago Carvalho Santos',
      club: 'LOSC Lille',
      league: 'Ligue 1',
      nation: 'Portugal',
      age: 23,
      dob: '23/07/2002',
      birthplace: 'Lisboa, Portugal',
      height: "5' 9\"",
      heightMetric: '1.75m',
      foot: 'Right',
      position: 'RB',
      otherPositions: ['RW', 'RM'],
      number: 22,
      agent: 'Gestifute',
      contract: '2029',
      joinedClub: '05/07/2023',
      marketValue: '€15M',
      highestValue: '€15M',
      highestValueDate: '06/02/2024',
      fee: '€12M',
      wages: '55K/wk',
      rating: 4,
      statusStage: 5,
      fcRating: null,
      transferHistory: [
        { season: '23/24', from: 'Estoril', to: 'Lille', fee: '€6.50m', mv: '€3.50m' },
        { season: '22/23', from: 'Estoril U23', to: 'Estoril', fee: '-' },
        { season: '21/22', from: 'Sporting CP U23', to: 'Estoril U23', fee: 'Free' },
      ],
      youthClubs: ['Sporting CP', 'AD Oeiras', 'SG Sacavenense', 'Estoril Praia'],
      stats: {
        europaLeague: { app: 4, g: 0, a: 1, yc: 0, rc: 0, mins: 212, startingXI: '60%', minsPct: '47%' },
        ligue1: { app: 2, g: 0, a: 0, yc: 0, rc: 0, mins: 104, startingXI: '12.5%' },
        total: { app: 6, g: 0, a: 1, mins: 316 }
      },
      matchLog: [
        { comp: 'Ligue 1', md: 1, date: '17/08/2025', home: 'Stade Brestois', away: 'Lille', result: '3:3', pos: null, status: 'injured', note: 'Cruciate ligament tear' },
        { comp: 'Ligue 1', md: 2, date: '24/08/2025', home: 'Lille', homeRank: 9, away: 'Monaco', awayRank: 1, result: '1:0', pos: null, status: 'injured', note: 'Cruciate ligament tear' },
        { comp: 'Ligue 1', md: 3, date: '30/08/2025', home: 'FC Lorient', homeRank: 6, away: 'Lille', awayRank: 5, result: '1:7', pos: null, status: 'injured', note: 'Cruciate ligament tear' },
        { comp: 'Ligue 1', md: 4, date: '14/09/2025', home: 'Lille', homeRank: 3, away: 'Toulouse', awayRank: 7, result: '2:1', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 5, date: '20/09/2025', home: 'Lens', homeRank: 9, away: 'Lille', awayRank: 2, result: '3:0', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 6, date: '28/09/2025', home: 'Lille', homeRank: 5, away: 'Lyon', awayRank: 3, result: '0:1', pos: 'RB', status: 'started', mins: 90, subIn: null, subOut: 90 },
        { comp: 'Ligue 1', md: 7, date: '05/10/2025', home: 'Lille', homeRank: 6, away: 'PSG', awayRank: 1, result: '1:1', pos: null, status: 'sub', mins: 14, subIn: 76 },
        { comp: 'Ligue 1', md: 8, date: '19/10/2025', home: 'FC Nantes', homeRank: 15, away: 'Lille', awayRank: 7, result: '0:2', pos: null, status: 'absent' },
        { comp: 'Ligue 1', md: 9, date: '26/10/2025', home: 'Lille', homeRank: 6, away: 'FC Metz', awayRank: 18, result: '6:1', pos: null, status: 'absent' },
        { comp: 'Ligue 1', md: 10, date: '29/10/2025', home: 'Nice', homeRank: 8, away: 'Lille', awayRank: 5, result: '2:0', pos: null, status: 'absent' },
        { comp: 'Ligue 1', md: 11, date: '02/11/2025', home: 'Lille', homeRank: 7, away: 'Angers SCO', awayRank: 13, result: '1:0', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 12, date: '09/11/2025', home: 'R. Strasbourg', homeRank: 7, away: 'Lille', awayRank: 4, result: '2:0', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 13, date: '23/11/2025', home: 'Lille', homeRank: 5, away: 'Paris FC', awayRank: 11, result: '4:2', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 14, date: '30/11/2025', home: 'Le Havre AC', homeRank: 13, away: 'Lille', awayRank: 4, result: '0:1', pos: null, status: 'bench' },
        { comp: 'Ligue 1', md: 15, date: '05/12/2025', home: 'Lille', homeRank: 4, away: 'Marseille', awayRank: 3, result: '1:0', pos: null, status: 'absent' },
        { comp: 'Europa League', md: 'GS', date: '25/09/2025', home: 'Lille', away: 'Brann', result: '2:1', pos: 'RB', status: 'started', mins: 87 },
        { comp: 'Europa League', md: 'GS', date: '02/10/2025', home: 'Roma', homeRank: 4, away: 'Lille', awayRank: 6, result: '0:1', pos: null, status: 'bench' },
        { comp: 'Europa League', md: 'GS', date: '23/10/2025', home: 'Lille', homeRank: 7, away: 'PAOK', awayRank: 29, result: '3:4', pos: 'RB', status: 'started', mins: 45 },
        { comp: 'Europa League', md: 'GS', date: '06/11/2025', home: 'Red Star', homeRank: 30, away: 'Lille', awayRank: 11, result: '1:0', pos: 'RB', status: 'started', mins: 68 },
        { comp: 'Europa League', md: 'GS', date: '27/11/2025', home: 'Lille', homeRank: 19, away: 'Dinamo Zagreb', awayRank: 12, result: '4:0', pos: null, status: 'sub', mins: 12 },
      ],
      injuries: [
        { type: 'Cruciate ligament tear', period: 'Aug 2025', matchesMissed: 3 }
      ],
      scoutingNotes: 'Dynamic attacking full-back from Sporting CP academy. Strong in 1v1 duels, excellent recovery pace. Recently returned from ACL injury - medical assessment critical.',
      pros: ['Attacking threat', 'Recovery pace', 'Young with high ceiling', 'Big game experience (Europa League)'],
      cons: ['Recent ACL injury', 'Limited Ligue 1 minutes this season', 'Adaptation to PL physicality'],
      bio: 'Portuguese right-back who rose through Sporting CP academy before moving to Estoril then Lille. Strong in attack with ability to play as winger. Contract extended in Oct 2024 shows club faith.',
    }
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
      ballHolder: { name: 'Steve Nickson', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: false, medical: false },
      planA: { player: 'Kieran Trippier', age: 34, status: 'Negotiating', statusColor: 'amber', issue: 'Wage demands above budget', confidence: 40 },
      planB: [
        { id: 1, name: 'Tiago Santos', club: 'Lille', age: 22, rating: 4, statusStage: 5, fee: '12M', wages: '55K/wk' },
        { id: 2, name: 'Vanderson', club: 'Monaco', age: 23, rating: 3.5, statusStage: 2, fee: '18M', wages: '70K/wk' },
      ],
    },
    {
      id: 'cb',
      severity: 'critical',
      position: 'CB',
      title: 'CB Cover - Botman ACL',
      trigger: 'Long-term injury',
      budget: { transfer: 25000000, wages: 70000 },
      deadline: 45,
      ballHolder: { name: 'Steve Nickson', avatar: 'SN' },
      gates: { scouting: true, manager: true, budget: true, medical: false },
      planA: null,
      planB: [
        { id: 6, name: 'Marc Guehi', club: 'Crystal Palace', age: 24, rating: 4, statusStage: 6, fee: '65M', wages: '100K/wk' },
        { id: 7, name: 'Castello Lukeba', club: 'RB Leipzig', age: 21, rating: 3.5, statusStage: 3, fee: '35M', wages: '60K/wk' },
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
    const hasLongInjury = player.injury.daysOut >= 90;

    if (isExpiring && isOlder) return { trigger: 'Contract expiring', severity: 'critical', reasoning: `Contract ends soon and at ${player.age}, succession planning critical.` };
    if (isExpiring) return { trigger: 'Contract expiring', severity: 'critical', reasoning: `Contract expiring. Decision needed on renewal vs replacement.` };
    if (hasLongInjury) return { trigger: 'Long-term injury cover', severity: 'critical', reasoning: `${player.injury.daysOut} days missed. Cover needed.` };
    if (isOlder) return { trigger: 'Succession planning', severity: 'moderate', reasoning: `At ${player.age}, succession planning advisable.` };
    return { trigger: 'Succession planning', severity: 'low', reasoning: 'Proactive planning for squad depth.' };
  };

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

  const generateSquadIssues = () => {
    const issues = [];
    squad.forEach(player => {
      const yearsLeft = getContractYear(player.contract) - currentYear;
      const isExpiring = yearsLeft <= 1;
      const hasLongInjury = player.injury.daysOut >= 90;
      const hasTransferInterest = player.flag === 'Saudi Interest';

      if (isExpiring) {
        issues.push({ id: `${player.id}-contract`, player, type: 'contract', severity: 'critical', score: 90, title: 'Contract expiring', description: `Contract ends ${player.contract}. Decision needed.`, recommendation: 'Begin succession planning' });
      }
      if (hasLongInjury) {
        issues.push({ id: `${player.id}-injury`, player, type: 'injury', severity: 'critical', score: 85, title: 'Long-term injury', description: `${player.injury.daysOut} days missed.`, recommendation: 'Source cover' });
      }
      if (hasTransferInterest) {
        issues.push({ id: `${player.id}-transfer`, player, type: 'transfer', severity: 'moderate', score: 70, title: 'Transfer interest', description: 'External interest received.', recommendation: 'Assess commitment' });
      }
    });
    return issues.sort((a, b) => b.score - a.score);
  };

  const squadIssues = generateSquadIssues();
  const activeIssues = squadIssues.filter(i => !dismissedIssues[i.id] && !snoozedIssues[i.id]);
  const criticalIssues = activeIssues.filter(i => i.severity === 'critical');
  const criticalCount = shortlists.filter(s => s.severity === 'critical').length;

  const openPlayerTimeline = (playerName) => {
    setActivePlayerId(getPlayerId(playerName));
    setSelectedPlayer({ name: playerName });
    setShowTimelineModal(true);
  };

  const openAddNoteForPlayer = (playerName) => {
    setActivePlayerId(getPlayerId(playerName));
    setSelectedPlayer({ name: playerName });
    setShowAddNoteModal(true);
  };

  const handleDismiss = (issue) => {
    setDismissingIssue(issue);
    setShowDismissModal(true);
  };

  const confirmDismiss = (note, snooze) => {
    if (snooze) setSnoozedIssues({ ...snoozedIssues, [dismissingIssue.id]: { note } });
    else setDismissedIssues({ ...dismissedIssues, [dismissingIssue.id]: { note } });
    setShowDismissModal(false);
  };

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
              <div className="flex-1">
                <div className="font-semibold">{newShortlistData.player.name}</div>
                <div className="text-sm text-gray-500">{newShortlistData.player.position} - Age {newShortlistData.player.age}</div>
              </div>
              <div className="text-right font-bold">{newShortlistData.player.value}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900">Our assumption</div>
                  <p className="text-sm text-blue-700 mt-1">{newShortlistData.reasoning}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input value={newShortlistData.title} onChange={(e) => setNewShortlistData({...newShortlistData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget: {formatBudget(newShortlistData.budget)}</label>
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
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="font-semibold">{dismissingIssue.player.name}</div>
              <div className="text-sm text-gray-500">{dismissingIssue.title}</div>
            </div>
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

  const TimelineModal = () => {
    if (!showTimelineModal || !activePlayerId) return null;
    const activities = playerActivities[activePlayerId] || [];
    const playerName = selectedPlayer?.name || '';
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">{playerName.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h2 className="font-bold">{playerName}</h2>
                <p className="text-sm text-gray-500">{activities.length} activities</p>
              </div>
            </div>
            <button onClick={() => setShowTimelineModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No activities yet</div>
            ) : (
              <div className="space-y-4">
                {activities.map((a) => {
                  const config = activityTypes[a.type] || activityTypes.discussion;
                  const Icon = config.icon;
                  return (
                    <div key={a.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Icon className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-gray-500">{a.user} - {a.date}</div>
                        <p className="text-sm text-gray-600 mt-1">{a.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t">
            <button onClick={() => { setShowTimelineModal(false); setShowAddNoteModal(true); }} className="w-full py-2 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Note
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
    if (!showAddNoteModal || !activePlayerId) return null;
    const playerName = selectedPlayer?.name || '';
    const handleAdd = () => {
      if (!noteTitle || !noteContent) return;
      const newActivity = { id: Date.now(), type: noteType, date: new Date().toISOString().split('T')[0], user: 'Steve Nickson', title: noteTitle, content: noteContent };
      setPlayerActivities({ ...playerActivities, [activePlayerId]: [newActivity, ...(playerActivities[activePlayerId] || [])] });
      setNoteTitle(''); setNoteContent(''); setShowAddNoteModal(false);
    };
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Add Note - {playerName}</h2>
            <button onClick={() => setShowAddNoteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {Object.entries(activityTypes).map(([key, config]) => (
                <button key={key} onClick={() => setNoteType(key)} className={`px-3 py-1.5 rounded-lg text-sm ${noteType === key ? 'bg-slate-900 text-white' : 'bg-gray-100'}`}>{config.label}</button>
              ))}
            </div>
            <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-2 border rounded-xl" />
            <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Notes..." rows={3} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
            <button onClick={() => setShowAddNoteModal(false)} className="flex-1 py-2 border rounded-xl">Cancel</button>
            <button onClick={handleAdd} className="flex-1 py-2 bg-slate-900 text-white rounded-xl">Add</button>
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
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="text-2xl font-bold text-red-700">{criticalIssues.length}</div>
            <div className="text-xs text-red-600">Critical Issues</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-700">{Object.keys(dismissedIssues).length}</div>
            <div className="text-xs text-green-600">Resolved</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border">
            <div className="text-2xl font-bold">{Object.keys(snoozedIssues).length}</div>
            <div className="text-xs text-gray-600">Snoozed</div>
          </div>
        </div>
      </div>
      {activeIssues.length === 0 ? (
        <div className="bg-green-50 rounded-xl p-8 text-center border border-green-200">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800">All Clear!</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {activeIssues.map(issue => {
            const config = getSeverityConfig(issue.severity);
            return (
              <div key={issue.id} className={`bg-white rounded-xl border-l-4 ${config.border} border p-4`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold">{issue.player.name.split(' ').map(n => n[0]).join('')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{issue.player.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{issue.player.position}</span>
                    </div>
                    <div className={`font-medium ${config.text}`}>{issue.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>{issue.score}%</div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => handleCreateShortlist(issue.player)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm">Create Shortlist</button>
                  <button onClick={() => handleDismiss(issue)} className="flex-1 py-2 border rounded-lg text-sm">Resolve / Snooze</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderSquad = () => {
    const positionOrder = ['GK', 'RB', 'CB', 'LB', 'CM', 'RW', 'LW', 'CF'];
    const sortedSquad = [...squad].sort((a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position));
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-xs font-semibold text-gray-500 uppercase">
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-left">Player</th>
              <th className="px-3 py-3 text-left">Pos</th>
              <th className="px-3 py-3 text-left">Age</th>
              <th className="px-3 py-3 text-center">FC</th>
              <th className="px-3 py-3 text-left">Contract</th>
              <th className="px-3 py-3 text-left">Value</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedSquad.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-500">{p.number}</td>
                <td className="px-3 py-2 cursor-pointer" onClick={() => { setSelectedPlayer(p); setActiveScreen('player-profile'); }}>
                  <div className="font-medium text-sm hover:text-blue-600">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.nation}</div>
                </td>
                <td className="px-3 py-2"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{p.position}</span></td>
                <td className="px-3 py-2 text-sm">{p.age}</td>
                <td className="px-3 py-2 text-center"><FCRatingBadge rating={p.fcRating} /></td>
                <td className="px-3 py-2 text-sm">{p.contract}</td>
                <td className="px-3 py-2 text-sm font-medium">{p.value}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <InjuryBadge risk={p.injury.risk} daysOut={p.injury.daysOut} />
                    {p.flag && <span className={`px-1.5 py-0.5 rounded text-xs ${p.flag === 'Key' ? 'bg-blue-100 text-blue-700' : p.flag === 'Prospect' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.flag}</span>}
                  </div>
                </td>
                <td className="px-3 py-2"><button onClick={() => handleCreateShortlist(p)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">+ Shortlist</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderShortlists = () => (
    <div className="space-y-4">
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div><div className="text-xs text-slate-400">Window</div><div className="font-semibold">{currentWindow.name}</div></div>
          <div className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">{currentWindow.daysRemaining} days left</div>
        </div>
      </div>
      {shortlists.map((shortlist) => {
        const config = getSeverityConfig(shortlist.severity);
        const isExpanded = expandedShortlist === shortlist.id;
        return (
          <div key={shortlist.id} className={`bg-white rounded-xl border overflow-hidden ${isExpanded ? `${config.border} border-l-4` : ''}`}>
            <div onClick={() => setExpandedShortlist(isExpanded ? null : shortlist.id)} className={`p-4 cursor-pointer flex items-center gap-4 ${isExpanded ? config.bg : 'hover:bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.text} flex items-center justify-center font-bold text-sm border-2 ${config.border}`}>{shortlist.position}</div>
              <div className="flex-1">
                <div className="font-semibold">{shortlist.title}</div>
                <div className="text-sm text-gray-500">{shortlist.trigger}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Budget</div>
                <div className="font-semibold">{formatBudget(shortlist.budget.transfer)}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${shortlist.deadline < 50 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{shortlist.deadline}d left</div>
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
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="grid grid-cols-7 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b">
                      <div>#</div>
                      <div className="col-span-2">Player</div>
                      <div>Rating</div>
                      <div>Fee</div>
                      <div>Pipeline</div>
                      <div>Actions</div>
                    </div>
                    {shortlist.planB.map((c, idx) => (
                      <div key={c.id} className="grid grid-cols-7 gap-2 px-4 py-3 items-center hover:bg-gray-50 border-b last:border-0">
                        <div className="text-sm text-gray-400">{idx + 1}</div>
                        <div className="col-span-2 cursor-pointer" onClick={() => { 
                        const candidateId = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
                        const fullData = shortlistCandidates[candidateId] || c;
                        setSelectedPlayer(fullData); 
                        setActiveScreen('player-profile'); 
                      }}>
                          <div className="font-medium hover:text-blue-600">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.club} - {c.age}</div>
                        </div>
                        <div><StarRating rating={c.rating} /></div>
                        <div className="text-sm font-medium">{c.fee}</div>
                        <div><PipelineIndicator stage={c.statusStage} /></div>
                        <div className="flex gap-1">
                          <button onClick={() => openPlayerTimeline(c.name)} className="p-1.5 hover:bg-gray-200 rounded" title="Timeline"><Clock className="h-3.5 w-3.5" /></button>
                          <button onClick={() => openAddNoteForPlayer(c.name)} className="p-1.5 hover:bg-gray-200 rounded" title="Add Note"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
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
    const player = candidateData || squadPlayer || squad.find(p => p.name === 'Bruno Guimarães');
    const isCandidate = !!candidateData;
    const activities = getPlayerActivities(player.name);
    const isGK = player.position === 'GK';
    const stats = player.stats;

    const StatBox = ({ label, value, highlight }) => (
      <div className={`text-center p-3 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
        <div className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value ?? '-'}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    );

    const InfoRow = ({ label, value }) => value ? (
      <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="font-medium text-sm">{value}</span>
      </div>
    ) : null;

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {player.number || player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{player.name}</h1>
                {isCandidate && <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700">Shortlist Candidate</span>}
                {player.flag && <span className={`px-2 py-1 rounded text-xs font-medium ${player.flag === 'Key' ? 'bg-blue-100 text-blue-700' : player.flag === 'Prospect' ? 'bg-green-100 text-green-700' : player.flag === 'Loan' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{player.flag}</span>}
                {player.fcRating && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <FCRatingBadge rating={player.fcRating} />
                    <span className="text-xs text-gray-500">FC Rating</span>
                  </div>
                )}
              </div>
              <div className="text-gray-500 mt-1">{player.club || 'Newcastle United'} • {player.position} • Age {player.age}</div>
              {isCandidate && player.otherPositions && (
                <div className="text-xs text-gray-400 mt-1">Also plays: {player.otherPositions.join(', ')}</div>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>{player.nation}</span>
                {(player.height || player.heightMetric) && <span>• {player.heightMetric || player.height}</span>}
                {player.foot && <span>• {player.foot} footed</span>}
              </div>
              <div className="flex gap-2 mt-3"><SourceBadge source="statsbomb" /><SourceBadge source="impect" />{isCandidate && <SourceBadge source="scoutastic" />}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{player.marketValue || player.fee || player.value}</div>
              <div className="text-sm text-gray-500 mt-1">Contract: {player.contract}</div>
              {isCandidate && player.wages && <div className="text-sm text-gray-400">Est. Wages: {player.wages}</div>}
              {player.injury && player.injury.daysOut > 0 && (
                <div className="mt-2"><InjuryBadge risk={player.injury.risk} daysOut={player.injury.daysOut} /></div>
              )}
            </div>
          </div>
        </div>

        {/* Bio & Transfer Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-400 uppercase mb-3">Player Info</h3>
            <InfoRow label="Full Name" value={player.fullName} />
            <InfoRow label="Date of Birth" value={player.dob} />
            <InfoRow label="Birthplace" value={player.birthplace} />
            <InfoRow label="Nationality" value={player.nation} />
            <InfoRow label="Height" value={player.heightMetric || player.height} />
            <InfoRow label="Weight" value={player.weight} />
            <InfoRow label="Preferred Foot" value={player.foot} />
            <InfoRow label="Agent" value={player.agent} />
            <InfoRow label="Squad Number" value={player.number} />
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-400 uppercase mb-3">Transfer Details</h3>
            <InfoRow label="Current Club" value={player.club} />
            <InfoRow label="League" value={player.league} />
            <InfoRow label="Joined From" value={player.joinedFrom} />
            <InfoRow label="Date Joined" value={player.joinedClub || player.joinedDate} />
            <InfoRow label="Transfer Fee" value={player.fee} />
            <InfoRow label="Contract Until" value={player.contract} />
            <InfoRow label="Market Value" value={player.marketValue || player.value} />
            <InfoRow label="Highest Value" value={player.highestValue ? `${player.highestValue} (${player.highestValueDate})` : null} />
          </div>
        </div>

        {/* Candidate-specific sections */}
        {isCandidate && (
          <>
            {/* Scouting Assessment */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5">
              <h3 className="font-bold text-sm text-indigo-600 uppercase mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" /> Scouting Assessment
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">{player.scoutingNotes}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-green-600 uppercase mb-2">Strengths</div>
                  <ul className="space-y-1">
                    {player.pros?.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-600 uppercase mb-2">Concerns</div>
                  <ul className="space-y-1">
                    {player.cons?.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Injury History */}
            {player.injuries && player.injuries.length > 0 && (
              <div className="bg-red-50 rounded-xl border border-red-100 p-5">
                <h3 className="font-bold text-sm text-red-600 uppercase mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Injury History
                </h3>
                <div className="space-y-2">
                  {player.injuries.map((inj, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div>
                        <span className="font-medium text-red-700">{inj.type}</span>
                        <span className="text-gray-500 text-sm ml-2">({inj.period})</span>
                      </div>
                      <span className="text-sm text-gray-500">{inj.matchesMissed} matches missed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Season Stats by Competition */}
            {stats && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  2025/26 Season Stats
                </h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 text-left">Competition</th>
                        <th className="px-4 py-3 text-center">Apps</th>
                        <th className="px-4 py-3 text-center">Goals</th>
                        <th className="px-4 py-3 text-center">Assists</th>
                        <th className="px-4 py-3 text-center">Mins</th>
                        <th className="px-4 py-3 text-center">Start %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.europaLeague && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">Europa League</td>
                          <td className="px-4 py-3 text-center">{stats.europaLeague.app}</td>
                          <td className="px-4 py-3 text-center">{stats.europaLeague.g}</td>
                          <td className="px-4 py-3 text-center font-medium text-blue-600">{stats.europaLeague.a}</td>
                          <td className="px-4 py-3 text-center">{stats.europaLeague.mins}'</td>
                          <td className="px-4 py-3 text-center">{stats.europaLeague.startingXI}</td>
                        </tr>
                      )}
                      {stats.ligue1 && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">Ligue 1</td>
                          <td className="px-4 py-3 text-center">{stats.ligue1.app}</td>
                          <td className="px-4 py-3 text-center">{stats.ligue1.g}</td>
                          <td className="px-4 py-3 text-center">{stats.ligue1.a}</td>
                          <td className="px-4 py-3 text-center">{stats.ligue1.mins}'</td>
                          <td className="px-4 py-3 text-center">{stats.ligue1.startingXI}</td>
                        </tr>
                      )}
                      {stats.total && (
                        <tr className="bg-gray-50 font-semibold">
                          <td className="px-4 py-3">Total</td>
                          <td className="px-4 py-3 text-center">{stats.total.app}</td>
                          <td className="px-4 py-3 text-center">{stats.total.g}</td>
                          <td className="px-4 py-3 text-center">{stats.total.a}</td>
                          <td className="px-4 py-3 text-center">{stats.total.mins}'</td>
                          <td className="px-4 py-3 text-center">-</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Match Log */}
            {player.matchLog && player.matchLog.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Match Log
                </h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr className="text-gray-500 uppercase">
                        <th className="px-2 py-2 text-left w-8">#</th>
                        <th className="px-2 py-2 text-left">Date</th>
                        <th className="px-2 py-2 text-left">Match</th>
                        <th className="px-2 py-2 text-center">Result</th>
                        <th className="px-2 py-2 text-center">Pos</th>
                        <th className="px-2 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {player.matchLog.filter(m => m.comp === 'Ligue 1').map((m, i) => {
                        const getStatusStyle = (status) => {
                          switch(status) {
                            case 'started': return 'bg-green-100 text-green-700';
                            case 'sub': return 'bg-blue-100 text-blue-700';
                            case 'bench': return 'bg-gray-100 text-gray-600';
                            case 'injured': return 'bg-red-100 text-red-700';
                            case 'absent': return 'bg-gray-50 text-gray-400';
                            default: return 'bg-gray-100 text-gray-600';
                          }
                        };
                        const getStatusLabel = (m) => {
                          if (m.status === 'started') return m.mins ? `${m.mins}'` : 'Started';
                          if (m.status === 'sub') return m.subIn ? `${m.subIn}' (${m.mins}')` : `Sub (${m.mins}')`;
                          if (m.status === 'bench') return 'Bench';
                          if (m.status === 'injured') return m.note || 'Injured';
                          if (m.status === 'absent') return 'Not in squad';
                          return '-';
                        };
                        const isWin = m.result && parseInt(m.result.split(':')[0]) > parseInt(m.result.split(':')[1]) && m.home?.includes('Lille');
                        const isLoss = m.result && parseInt(m.result.split(':')[0]) < parseInt(m.result.split(':')[1]) && m.home?.includes('Lille');
                        
                        return (
                          <tr key={i} className={`hover:bg-gray-50 ${m.status === 'injured' ? 'bg-red-50/50' : ''}`}>
                            <td className="px-2 py-2 text-gray-400">{m.md}</td>
                            <td className="px-2 py-2 text-gray-500">{m.date}</td>
                            <td className="px-2 py-2">
                              <span className={m.home?.includes('Lille') ? 'font-medium' : ''}>{m.home}</span>
                              {m.homeRank && <span className="text-gray-400 text-[10px] ml-1">({m.homeRank}.)</span>}
                              <span className="text-gray-400 mx-1">vs</span>
                              <span className={m.away?.includes('Lille') ? 'font-medium' : ''}>{m.away}</span>
                              {m.awayRank && <span className="text-gray-400 text-[10px] ml-1">({m.awayRank}.)</span>}
                            </td>
                            <td className="px-2 py-2 text-center font-mono font-medium">{m.result}</td>
                            <td className="px-2 py-2 text-center">
                              {m.pos && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium">{m.pos}</span>}
                            </td>
                            <td className="px-2 py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusStyle(m.status)}`}>
                                {getStatusLabel(m)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Europa League matches */}
                {player.matchLog.some(m => m.comp === 'Europa League') && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Europa League</div>
                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full text-xs">
                        <tbody className="divide-y">
                          {player.matchLog.filter(m => m.comp === 'Europa League').map((m, i) => {
                            const getStatusStyle = (status) => {
                              switch(status) {
                                case 'started': return 'bg-green-100 text-green-700';
                                case 'sub': return 'bg-blue-100 text-blue-700';
                                case 'bench': return 'bg-gray-100 text-gray-600';
                                default: return 'bg-gray-100 text-gray-600';
                              }
                            };
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-gray-400 w-12">{m.md}</td>
                                <td className="px-2 py-2 text-gray-500 w-20">{m.date}</td>
                                <td className="px-2 py-2">
                                  <span className={m.home?.includes('Lille') ? 'font-medium' : ''}>{m.home}</span>
                                  <span className="text-gray-400 mx-1">vs</span>
                                  <span className={m.away?.includes('Lille') ? 'font-medium' : ''}>{m.away}</span>
                                </td>
                                <td className="px-2 py-2 text-center font-mono font-medium w-12">{m.result}</td>
                                <td className="px-2 py-2 text-center w-12">
                                  {m.pos && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium">{m.pos}</span>}
                                </td>
                                <td className="px-2 py-2 w-20">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusStyle(m.status)}`}>
                                    {m.status === 'started' ? `${m.mins}'` : m.status === 'sub' ? `Sub (${m.mins}')` : 'Bench'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Summary stats */}
                <div className="mt-4 pt-4 border-t grid grid-cols-5 gap-4 text-center text-xs">
                  <div>
                    <div className="font-bold text-lg">{player.matchLog.filter(m => m.status === 'started' || m.status === 'sub').length}</div>
                    <div className="text-gray-500">Squad</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-600">{player.matchLog.filter(m => m.status === 'started').length}</div>
                    <div className="text-gray-500">Started</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-600">{player.matchLog.filter(m => m.status === 'sub').length}</div>
                    <div className="text-gray-500">Sub In</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{player.matchLog.filter(m => m.status === 'bench').length}</div>
                    <div className="text-gray-500">Bench</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-red-600">{player.matchLog.filter(m => m.status === 'injured').length}</div>
                    <div className="text-gray-500">Injured</div>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer History */}
            {player.transferHistory && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm text-gray-400 uppercase mb-3">Transfer History</h3>
                <div className="space-y-2">
                  {player.transferHistory.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 w-16">{t.season}</span>
                      <span className="flex-1">{t.from} → <span className="font-medium">{t.to}</span></span>
                      <span className="font-medium text-green-600">{t.fee}</span>
                    </div>
                  ))}
                </div>
                {player.youthClubs && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-xs text-gray-400">Youth Clubs: </span>
                    <span className="text-xs text-gray-600">{player.youthClubs.join(' → ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Match Log */}
            {player.matchLog && player.matchLog.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Match Log 2025/26
                </h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr className="text-gray-500 uppercase">
                        <th className="px-2 py-2 text-left w-8">#</th>
                        <th className="px-2 py-2 text-left">Date</th>
                        <th className="px-2 py-2 text-left">Match</th>
                        <th className="px-2 py-2 text-center">Result</th>
                        <th className="px-2 py-2 text-center">Pos</th>
                        <th className="px-2 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {player.matchLog.filter(m => m.comp === 'Ligue 1').map((m, i) => {
                        const getStatusStyle = (status) => {
                          switch(status) {
                            case 'started': return 'bg-green-100 text-green-700';
                            case 'sub': return 'bg-blue-100 text-blue-700';
                            case 'bench': return 'bg-gray-100 text-gray-600';
                            case 'injured': return 'bg-red-100 text-red-700';
                            case 'absent': return 'bg-gray-50 text-gray-400';
                            default: return 'bg-gray-100 text-gray-600';
                          }
                        };
                        const getStatusLabel = (m) => {
                          if (m.status === 'started') return m.mins ? `${m.mins}'` : 'Started';
                          if (m.status === 'sub') return m.subIn ? `${m.subIn}' (${m.mins}')` : `Sub (${m.mins}')`;
                          if (m.status === 'bench') return 'Bench';
                          if (m.status === 'injured') return m.note || 'Injured';
                          if (m.status === 'absent') return 'Not in squad';
                          return '-';
                        };
                        return (
                          <tr key={i} className={`hover:bg-gray-50 ${m.status === 'injured' ? 'bg-red-50/50' : ''}`}>
                            <td className="px-2 py-2 text-gray-400">{m.md}</td>
                            <td className="px-2 py-2 text-gray-500">{m.date}</td>
                            <td className="px-2 py-2">
                              <span className={m.home?.includes('Lille') ? 'font-medium' : ''}>{m.home}</span>
                              {m.homeRank && <span className="text-gray-400 text-[10px] ml-1">({m.homeRank}.)</span>}
                              <span className="text-gray-400 mx-1">-</span>
                              <span className={m.away?.includes('Lille') ? 'font-medium' : ''}>{m.away}</span>
                              {m.awayRank && <span className="text-gray-400 text-[10px] ml-1">({m.awayRank}.)</span>}
                            </td>
                            <td className="px-2 py-2 text-center font-mono font-medium">{m.result}</td>
                            <td className="px-2 py-2 text-center">
                              {m.pos && <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-medium">{m.pos}</span>}
                            </td>
                            <td className="px-2 py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusStyle(m.status)}`}>
                                {getStatusLabel(m)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {player.matchLog.some(m => m.comp === 'Europa League') && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-amber-600 uppercase mb-2 flex items-center gap-1">
                      <Star className="h-3 w-3" /> Europa League
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full text-xs">
                        <tbody className="divide-y">
                          {player.matchLog.filter(m => m.comp === 'Europa League').map((m, i) => {
                            const getStatusStyle = (status) => {
                              switch(status) {
                                case 'started': return 'bg-green-100 text-green-700';
                                case 'sub': return 'bg-blue-100 text-blue-700';
                                case 'bench': return 'bg-gray-100 text-gray-600';
                                default: return 'bg-gray-100 text-gray-600';
                              }
                            };
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-gray-400 w-12">{m.md}</td>
                                <td className="px-2 py-2 text-gray-500 w-24">{m.date}</td>
                                <td className="px-2 py-2">
                                  <span className={m.home?.includes('Lille') ? 'font-medium' : ''}>{m.home}</span>
                                  <span className="text-gray-400 mx-1">-</span>
                                  <span className={m.away?.includes('Lille') ? 'font-medium' : ''}>{m.away}</span>
                                </td>
                                <td className="px-2 py-2 text-center font-mono font-medium w-12">{m.result}</td>
                                <td className="px-2 py-2 text-center w-12">
                                  {m.pos && <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-medium">{m.pos}</span>}
                                </td>
                                <td className="px-2 py-2 w-24">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusStyle(m.status)}`}>
                                    {m.status === 'started' ? `${m.mins}'` : m.status === 'sub' ? `Sub (${m.mins}')` : 'Bench'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t grid grid-cols-5 gap-4 text-center text-xs">
                  <div>
                    <div className="font-bold text-lg">{player.matchLog.filter(m => ['started','sub','bench'].includes(m.status)).length}</div>
                    <div className="text-gray-500">In Squad</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-600">{player.matchLog.filter(m => m.status === 'started').length}</div>
                    <div className="text-gray-500">Started</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-600">{player.matchLog.filter(m => m.status === 'sub').length}</div>
                    <div className="text-gray-500">Sub In</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{player.matchLog.filter(m => m.status === 'bench').length}</div>
                    <div className="text-gray-500">Unused</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-red-600">{player.matchLog.filter(m => m.status === 'injured').length}</div>
                    <div className="text-gray-500">Injured</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Squad player bio */}
        {!isCandidate && player.bio && (
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-400 uppercase mb-2">Profile</h3>
            <p className="text-gray-700 leading-relaxed">{player.bio}</p>
          </div>
        )}

        {/* Squad player Season Stats */}
        {!isCandidate && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              2024/25 Season Stats
            </h3>
            {!stats ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">No stats available for this player</div>
            ) : isGK ? (
              <div className="grid grid-cols-5 gap-4">
                <StatBox label="Appearances" value={stats.app} highlight />
                <StatBox label="Saves" value={stats.saves} highlight />
                <StatBox label="Goals Against" value={stats.ga} />
                <StatBox label="Clean Sheets" value={stats.app > 0 ? Math.max(0, stats.app - Math.ceil(stats.ga / 2)) : 0} />
                <StatBox label="Save %" value={stats.saves > 0 ? `${Math.round((stats.saves / (stats.saves + stats.ga)) * 100)}%` : '-'} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-6 gap-4 mb-4">
                  <StatBox label="Appearances" value={stats.app} />
                  <StatBox label="Goals" value={stats.g} highlight={stats.g > 0} />
                  <StatBox label="Assists" value={stats.a} highlight={stats.a > 0} />
                  <StatBox label="Shots" value={stats.sh} />
                  <StatBox label="On Target" value={stats.st} />
                  <StatBox label="Shot Acc." value={stats.sh > 0 ? `${Math.round((stats.st / stats.sh) * 100)}%` : '-'} />
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <StatBox label="Subs" value={stats.sub} />
                  <StatBox label="Fouls Won" value={stats.fa} />
                  <StatBox label="Fouls Committed" value={stats.fc} />
                  <StatBox label="Yellow Cards" value={stats.yc} />
                  <StatBox label="Red Cards" value={stats.rc} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">Activity Timeline</span>
              <span className="text-xs text-gray-400">{activities.length} activities</span>
            </div>
            <button onClick={() => openAddNoteForPlayer(player.name)} className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add Note
            </button>
          </div>
          {activities.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">No activities yet</div>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => {
                const config = activityTypes[a.type] || activityTypes.discussion;
                const Icon = config.icon;
                return (
                  <div key={a.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Icon className="h-4 w-4 text-blue-600" /></div>
                    <div>
                      <div className="font-medium text-sm">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.date}</div>
                      <p className="text-xs text-gray-600 mt-1">{a.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-medium">
            {isCandidate ? 'Progress in Pipeline' : 'Add to Shortlist'}
          </button>
          <button onClick={() => openPlayerTimeline(player.name)} className="flex-1 py-3 border rounded-xl font-medium">Full Timeline</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CreateShortlistModal />
      <DismissModal />
      <TimelineModal />
      <AddNoteModal />

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
              <s.icon className="h-5 w-5" />
              <span className="font-medium">{s.name}</span>
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
        <header className="bg-white border-b px-6 py-4">
          <h1 className="text-xl font-bold">{screens.find(s => s.id === activeScreen)?.name}</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {activeScreen === 'dashboard' && renderDashboard()}
          {activeScreen === 'squad' && renderSquad()}
          {activeScreen === 'shortlists' && renderShortlists()}
          {activeScreen === 'player-profile' && renderPlayerProfile()}
        </main>
      </div>

      <aside className="w-72 bg-white border-l flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {chatMessages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <div className={`inline-block px-3 py-2 rounded-xl text-sm max-w-[90%] ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-gray-100'}`}>{m.text}</div>
            </div>
          ))}
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
