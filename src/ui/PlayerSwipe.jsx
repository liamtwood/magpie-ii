import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, AlertTriangle, Heart, X, Star, Play, Pause, Info, ArrowLeft, Users, Calendar, DollarSign, TrendingUp, Shield, Target } from 'lucide-react';

const playerAvatars = {
  'Nick Pope': '/players/pope_1765339295872.png',
  'Sven Botman': '/players/botman_1765339295866.png',
  'Kieran Trippier': '/players/trippier_1765339295873.png',
  'Tino Livramento': '/players/livramento_1765339295869.png',
  'Tiago Santos': '/players/santos_1765321431388.webp',
  'Marc Guéhi': 'https://img.a.transfermarkt.technology/portrait/medium/554846-1714647992.jpg',
  'Castello Lukeba': 'https://img.a.transfermarkt.technology/portrait/medium/676924-1698847409.jpg',
  'Malo Gusto': '/players/gusto_1765337067.jpg',
  'Giorgi Mamardashvili': 'https://img.a.transfermarkt.technology/portrait/medium/433629-1663232878.jpg',
  'James Trafford': 'https://img.a.transfermarkt.technology/portrait/medium/610777-1693558871.jpg',
  'Odysseas Vlachodimos': 'https://img.a.transfermarkt.technology/portrait/medium/169949-1695722091.jpg',
  'Gonçalo Inácio': 'https://img.a.transfermarkt.technology/portrait/medium/503132-1686650853.jpg',
};

const PlayerAvatarSwipe = ({ name, size = 'md', className = '' }) => {
  const imageUrl = playerAvatars[name];
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-4xl',
    issue: 'w-32 h-32 text-4xl',
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-xl object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center font-bold ${className}`}>
      {initials}
    </div>
  );
};

const issueCards = [
  {
    id: 'pope',
    player: 'Nick Pope',
    position: 'GK',
    age: 33,
    image: '/players/pope.png',
    issue: 'Contract expiring + Age concern',
    risk: 95,
    type: 'contract',
    summary: 'Contract ends 2026. At 33, likely final major contract. High departure risk.',
    shortlistId: 'gk-succession',
    candidates: [
      { rank: 1, name: 'Giorgi Mamardashvili', age: 24, club: 'Valencia', value: '€35M', rating: 8.4, image: '/players/mamardashvili.png', highlights: 'Elite shot-stopper, commanding presence', pros: ['World-class reflexes', 'Strong aerial', 'Distribution improving'], cons: ['Limited PL experience', 'High fee'] },
      { rank: 2, name: 'James Trafford', age: 22, club: 'Burnley', value: '€18M', rating: 7.8, image: '/players/trafford.png', highlights: 'English talent, high potential', pros: ['Homegrown', 'Great feet', 'Young'], cons: ['Relegated with Burnley', 'Needs development'] },
      { rank: 3, name: 'Odysseas Vlachodimos', age: 30, club: 'Nottingham Forest', value: '€8M', rating: 7.5, image: '/players/vlachodimos.png', highlights: 'Experienced, PL proven', pros: ['PL experience', 'Affordable', 'Reliable'], cons: ['Age 30', 'Not elite level'] },
    ]
  },
  {
    id: 'botman',
    player: 'Sven Botman',
    position: 'CB',
    age: 24,
    image: '/players/botman.png',
    issue: 'Long-term injury (ACL)',
    risk: 88,
    type: 'injury',
    summary: 'ACL injury sustained March 2024. Expected return unclear. Need cover.',
    shortlistId: 'cb-cover',
    candidates: [
      { rank: 1, name: 'Marc Guéhi', age: 24, club: 'Crystal Palace', value: '€65M', rating: 8.6, image: '/players/guehi.png', highlights: 'England international, ball-playing CB', pros: ['PL proven', 'Leadership', 'Ball progression'], cons: ['Very expensive', 'Palace reluctant'] },
      { rank: 2, name: 'Castello Lukeba', age: 21, club: 'RB Leipzig', value: '€45M', rating: 8.2, image: '/players/lukeba.png', highlights: 'French talent, rapid development', pros: ['Young', 'Pace', 'UCL experience'], cons: ['Limited PL knowledge', 'Leipzig price'] },
      { rank: 3, name: 'Gonçalo Inácio', age: 23, club: 'Sporting CP', value: '€40M', rating: 8.0, image: '/players/inacio.png', highlights: 'Portuguese international, composed', pros: ['Release clause', 'Left-footed', 'Technical'], cons: ['Liga Portugal only', 'Physical questions'] },
    ]
  },
  {
    id: 'trippier',
    player: 'Kieran Trippier',
    position: 'RB',
    age: 34,
    image: '/players/trippier.png',
    issue: 'Age + succession planning',
    risk: 82,
    type: 'succession',
    summary: 'At 34, needs succession plan. Still performing but timeline critical.',
    shortlistId: 'rb-succession',
    candidates: [
      { rank: 1, name: 'Tiago Santos', age: 23, club: 'Lille', value: '€18M', rating: 8.3, confidence: 85, image: '/players/santos_1765321431388.webp', highlights: 'Dynamic attacking fullback from Portugal', pros: ['Young', 'Attacking threat', 'Affordable'], cons: ['Defensive work needed', 'Ligue 1 only'] },
      { rank: 2, name: 'Malo Gusto', age: 21, club: 'Chelsea', value: '€35M', rating: 8.1, confidence: 45, image: '/players/gusto.png', highlights: 'French youth star, Chelsea first choice', pros: ['PL adapted', 'Versatile', 'Young'], cons: ['Chelsea unlikely to sell', 'High price'] },
      { rank: 3, name: 'Tino Livramento', age: 22, club: 'Newcastle', value: '€25M', rating: 7.9, confidence: 92, image: '/players/livramento.png', highlights: 'Already at club, needs minutes', pros: ['In squad', 'Knows system', 'English'], cons: ['Injury history', 'Unproven starter'] },
    ]
  },
];

const PlayerSwipe = () => {
  const [view, setView] = useState('issues'); // 'issues', 'shortlist', 'candidate'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setCurrentCandidateIndex(0);
    setView('shortlist');
  };

  const handleCandidateSelect = (index) => {
    setCurrentCandidateIndex(index);
    setView('candidate');
    setShowDetails(false);
  };

  const handleSwipeRight = () => {
    if (view === 'candidate' && selectedIssue) {
      setSwipeDirection('right');
      setTimeout(() => {
        const nextIndex = (currentCandidateIndex + 1) % selectedIssue.candidates.length;
        setCurrentCandidateIndex(nextIndex);
        setSwipeDirection(null);
        setShowDetails(false);
      }, 300);
    }
  };

  const handleSwipeLeft = () => {
    if (view === 'candidate' && selectedIssue) {
      setSwipeDirection('left');
      setTimeout(() => {
        const prevIndex = currentCandidateIndex === 0 
          ? selectedIssue.candidates.length - 1 
          : currentCandidateIndex - 1;
        setCurrentCandidateIndex(prevIndex);
        setSwipeDirection(null);
        setShowDetails(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (view === 'candidate') {
      setView('shortlist');
      setShowDetails(false);
    } else if (view === 'shortlist') {
      setView('issues');
      setSelectedIssue(null);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchStartY) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStart - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) handleSwipeRight();
        else handleSwipeLeft();
      }
    } else {
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          setShowDetails(true);
        } else {
          setShowDetails(false);
        }
      }
    }
    setTouchStart(null);
    setTouchStartY(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== 'candidate') return;
      if (e.key === 'ArrowRight') handleSwipeRight();
      else if (e.key === 'ArrowLeft') handleSwipeLeft();
      else if (e.key === 'ArrowDown') setShowDetails(true);
      else if (e.key === 'ArrowUp') setShowDetails(false);
      else if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentCandidateIndex, selectedIssue]);

  const currentCandidate = selectedIssue?.candidates[currentCandidateIndex];

  return (
    <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Issues View - Card Selection */}
      {view === 'issues' && (
        <div className="h-full flex flex-col p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Squad Issues</h1>
            <p className="text-slate-400">Tap to explore replacement options</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {issueCards.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => handleIssueSelect(issue)}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  style={{
                    transform: `scale(${0.85 + (issue.risk / 100) * 0.15})`,
                  }}
                >
                  {/* Glow effect based on risk */}
                  <div 
                    className="absolute inset-0 rounded-3xl blur-xl opacity-50 transition-opacity group-hover:opacity-80"
                    style={{
                      background: issue.risk > 90 
                        ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
                        : issue.risk > 80 
                          ? 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(250,204,21,0.4) 0%, transparent 70%)'
                    }}
                  />
                  
                  <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700/50 hover:border-slate-500/50 transition-colors">
                    {/* Player Image */}
                    <div className="relative h-64 bg-gradient-to-b from-slate-700/50 to-slate-800/50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayerAvatarSwipe name={issue.player} size="issue" />
                      </div>
                      
                      {/* Risk Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5
                        ${issue.risk > 90 ? 'bg-red-500/90 text-white' : 
                          issue.risk > 80 ? 'bg-orange-500/90 text-white' : 
                          'bg-yellow-500/90 text-slate-900'}`}>
                        <AlertTriangle className="w-4 h-4" />
                        {issue.risk}%
                      </div>
                      
                      {/* Position Badge */}
                      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 text-xs font-medium">
                        {issue.position}
                      </div>
                    </div>
                    
                    {/* Player Info */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{issue.player}</h3>
                        <span className="text-slate-400 text-sm">{issue.age} yrs</span>
                      </div>
                      <p className={`text-sm font-medium mb-3
                        ${issue.type === 'contract' ? 'text-orange-400' : 
                          issue.type === 'injury' ? 'text-red-400' : 
                          'text-amber-400'}`}>
                        {issue.issue}
                      </p>
                      <p className="text-slate-500 text-sm line-clamp-2">{issue.summary}</p>
                      
                      {/* Candidates Preview */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {issue.candidates.slice(0, 3).map((c, i) => (
                            <div key={i} className="border-2 border-slate-800 rounded-lg">
                              <PlayerAvatarSwipe name={c.name} size="sm" />
                            </div>
                          ))}
                        </div>
                        <span className="text-slate-400 text-xs">{issue.candidates.length} candidates</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shortlist View */}
      {view === 'shortlist' && selectedIssue && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <button onClick={handleBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">{selectedIssue.player} Replacement</h2>
              <p className="text-slate-400 text-sm">{selectedIssue.candidates.length} candidates ranked</p>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Exec Summary */}
          <div className="p-4 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              {/* Player Avatar */}
              <PlayerAvatarSwipe name={selectedIssue.player} size="lg" className="shrink-0" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedIssue.type === 'contract' ? 'bg-orange-500/20 text-orange-400' : 
                    selectedIssue.type === 'injury' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {selectedIssue.issue}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedIssue.summary}</p>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm border-t border-slate-700 pt-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-4 h-4" />
                <span className="font-medium text-white">{selectedIssue.candidates.length}</span>
                <span>options</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-white">{selectedIssue.candidates[selectedIssue.candidates.length-1].value} - {selectedIssue.candidates[0].value}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium text-green-400">High</span>
                <span>confidence</span>
              </div>
            </div>
          </div>
          
          {/* Candidate Stack */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {selectedIssue.candidates.map((candidate, index) => (
                <div
                  key={index}
                  onClick={() => handleCandidateSelect(index)}
                  className="group relative cursor-pointer"
                >
                  <div className={`relative bg-slate-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300
                    ${index === 0 ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-slate-700/50 hover:border-slate-500/50'}`}>
                    <div className="flex items-center p-4 gap-4">
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900' : 
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                          'bg-slate-700 text-slate-300'}`}>
                        {candidate.rank}
                      </div>
                      
                      {/* Avatar */}
                      <PlayerAvatarSwipe name={candidate.name} size="md" className="rounded-xl shrink-0" />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">{candidate.name}</h3>
                          <span className="text-slate-500 text-sm shrink-0">{candidate.age}</span>
                        </div>
                        <div className="text-slate-400 text-sm mb-2">{candidate.club} • {candidate.value}</div>
                        <p className="text-slate-500 text-sm truncate">{candidate.highlights}</p>
                      </div>
                      
                      {/* Rating & Confidence */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-white">{candidate.rating}</div>
                        <div className="text-xs text-slate-500 mb-1">FC Rating</div>
                        {candidate.confidence && (
                          <div className={`text-xs font-medium px-2 py-0.5 rounded ${
                            candidate.confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                            candidate.confidence >= 50 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {candidate.confidence}% conf
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Deep Dive View */}
      {view === 'candidate' && selectedIssue && currentCandidate && (
        <div 
          className="h-full flex flex-col relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Video/Highlights Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-[200px] font-black text-slate-700">
                {currentCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            {/* Simulated video overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          </div>
          
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4">
            <button onClick={handleBack} className="p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-colors"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Swipe indicators */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <button onClick={handleSwipeLeft} className="p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button onClick={handleSwipeRight} className="p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Player Card - Main Content */}
          <div className={`relative z-10 flex-1 flex flex-col justify-end p-6 transition-all duration-300
            ${swipeDirection === 'right' ? 'translate-x-full opacity-0' : 
              swipeDirection === 'left' ? '-translate-x-full opacity-0' : ''}`}>
            
            {/* Swipe hint */}
            {!showDetails && (
              <div className="flex justify-center mb-4 animate-bounce">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                  <ChevronUp className="w-4 h-4 text-white/60" />
                  <span className="text-xs text-white/60">Swipe up for details</span>
                </div>
              </div>
            )}
            
            {/* Candidate indicator dots */}
            <div className="flex justify-center gap-2 mb-6">
              {selectedIssue.candidates.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentCandidateIndex ? 'w-6 bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            {/* Player Info Card */}
            <div className={`bg-black/60 backdrop-blur-xl rounded-3xl p-6 transition-all duration-300
              ${showDetails ? 'max-h-[600px]' : 'max-h-[300px]'} overflow-hidden`}>
              
              {/* Basic Info */}
              <div className="flex items-start gap-4 mb-4">
                <PlayerAvatarSwipe name={currentCandidate.name} size="lg" className="rounded-2xl shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                      ${currentCandidate.rank === 1 ? 'bg-yellow-500 text-slate-900' : 
                        currentCandidate.rank === 2 ? 'bg-slate-300 text-slate-900' : 
                        'bg-slate-600 text-white'}`}>
                      #{currentCandidate.rank}
                    </span>
                    <span className="text-slate-400 text-sm">{currentCandidate.age} years</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{currentCandidate.name}</h2>
                  <p className="text-slate-400">{currentCandidate.club} • {currentCandidate.value}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{currentCandidate.rating}</div>
                  <div className="text-xs text-slate-500">FC Rating</div>
                </div>
              </div>
              
              {/* Highlights */}
              <p className="text-white/80 text-sm mb-4 italic">"{currentCandidate.highlights}"</p>
              
              {/* Expand for Details */}
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <span className="text-sm">{showDetails ? 'Less details' : 'More details'}</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {/* Extended Details */}
              {showDetails && (
                <div className="pt-4 border-t border-white/10 space-y-4">
                  {/* Pros */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-green-500/20 rounded">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-semibold text-green-400">Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.pros.map((pro, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-300 text-sm">
                          {pro}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Cons */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-red-500/20 rounded">
                        <Shield className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-sm font-semibold text-red-400">Concerns</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.cons.map((con, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-300 text-sm">
                          {con}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={handleSwipeLeft}
                className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
              </button>
              <button className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                <Heart className="w-7 h-7 text-white" />
              </button>
              <button 
                onClick={handleSwipeRight}
                className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/50 transition-all group"
              >
                <Star className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSwipe;
