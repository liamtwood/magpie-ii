import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, AlertTriangle, Heart, X, Star, Play, Pause, Info, ArrowLeft, Users, Calendar, DollarSign, TrendingUp, Shield, Target } from 'lucide-react';
import YouTube from 'react-youtube';

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

const clubBadges = {
  'Newcastle': 'https://tmssl.akamaized.net/images/wappen/head/762.png',
  'Lille': 'https://tmssl.akamaized.net/images/wappen/head/1082.png',
  'Chelsea': 'https://tmssl.akamaized.net/images/wappen/head/631.png',
  'Valencia': 'https://tmssl.akamaized.net/images/wappen/head/1049.png',
  'Burnley': 'https://tmssl.akamaized.net/images/wappen/head/1132.png',
  'Nottingham Forest': 'https://tmssl.akamaized.net/images/wappen/head/703.png',
  'Sporting': 'https://tmssl.akamaized.net/images/wappen/head/336.png',
  'Lyon': 'https://tmssl.akamaized.net/images/wappen/head/1041.png',
  'Crystal Palace': 'https://tmssl.akamaized.net/images/wappen/head/873.png',
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

const GustoVideoCircle = ({ videoId = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  return (
    <div 
      className="w-64 h-64 scale-90 hover:scale-100 transition-transform duration-300 ease-out origin-center"
      style={{
        animation: 'slideInRight 0.4s ease-out forwards'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-teal-500/50 cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Static content - shown when not hovered */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered && videoId ? 'opacity-0' : 'opacity-100'}`}>
          <img 
            src={clubBadges['Chelsea']} 
            alt="Chelsea" 
            className="w-16 h-16 object-contain mb-3"
          />
          <h3 className="text-white font-bold text-lg">Malo Gusto</h3>
          <p className="text-teal-400 font-semibold">£35M</p>
        </div>
        
        {/* Video - shown on hover (if videoId provided) */}
        {isHovered && videoId && (
          <div className="absolute inset-0 scale-[2]">
            <YouTube
              videoId={videoId}
              className="w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  disablekb: 1,
                },
              }}
              onReady={(event) => {
                playerRef.current = event.target;
              }}
              onStateChange={(event) => {
                if (event.data === 1) {
                  setTimeout(() => {
                    event.target.pauseVideo();
                  }, 5000);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const KieranVideoCircle = () => {
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  return (
    <div 
      className="w-64 h-64 transition-transform duration-300 ease-out origin-center z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-500/50 cursor-pointer bg-gradient-to-br from-slate-700 to-slate-800">
        {/* Static content - shown when not hovered */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <img 
            src={clubBadges['Newcastle']} 
            alt="Newcastle" 
            className="w-16 h-16 object-contain mb-3"
          />
          <h3 className="text-white font-bold text-lg">Kieran Trippier</h3>
          <p className="text-amber-400 font-semibold">CURRENT</p>
        </div>
        
        {/* Video - shown on hover */}
        {isHovered && (
          <div className="absolute inset-0 scale-[2]">
            <YouTube
              videoId="CCOxEw2wKrA"
              className="w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  disablekb: 1,
                  start: 4,
                },
              }}
              onReady={(event) => {
                playerRef.current = event.target;
              }}
              onStateChange={(event) => {
                if (event.data === 1) {
                  setTimeout(() => {
                    event.target.pauseVideo();
                  }, 5000);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const TiagoVideoCircle = () => {
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  return (
    <div 
      className="w-64 h-64 scale-90 hover:scale-100 transition-transform duration-300 ease-out origin-center"
      style={{
        animation: 'slideInLeft 0.4s ease-out forwards'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-teal-500/50 cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Static content - shown when not hovered */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <img 
            src={clubBadges['Lille']} 
            alt="Lille" 
            className="w-16 h-16 object-contain mb-3"
          />
          <h3 className="text-white font-bold text-lg">Tiago Santos</h3>
          <p className="text-teal-400 font-semibold">£12M</p>
        </div>
        
        {/* Video - shown on hover */}
        {isHovered && (
          <div className="absolute inset-0 scale-[2]">
            <YouTube
              videoId="AtAfGUdYwdg"
              className="w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  disablekb: 1,
                },
              }}
              onReady={(event) => {
                playerRef.current = event.target;
              }}
              onStateChange={(event) => {
                if (event.data === 1) {
                  setTimeout(() => {
                    event.target.pauseVideo();
                  }, 7000);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerSwipe = () => {
  const [view, setView] = useState('issues'); // 'issues', 'shortlist', 'candidate'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [candidateScrollIndex, setCandidateScrollIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  
  // Animation states - single page mode
  const [animatingIssue, setAnimatingIssue] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'center', 'expanded'

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setAnimatingIssue(issue.id);
    setAnimationPhase('center');
    setCurrentCandidateIndex(0);
    setCandidateScrollIndex(0);
    
    // Phase 1: Move selected card to center, fade others
    setTimeout(() => {
      setAnimationPhase('expanded');
    }, 500);
  };
  
  const handleBackToIssues = () => {
    setAnimationPhase('center');
    setTimeout(() => {
      setAnimationPhase('idle');
      setAnimatingIssue(null);
      setSelectedIssue(null);
    }, 400);
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
      {/* Single Page View - Everything animates in place */}
      {view === 'issues' && (
        <div className="h-full flex flex-col p-6 relative">
          {/* Header - changes based on state */}
          <div className={`text-center mb-8 transition-all duration-500`}>
            {animationPhase === 'idle' ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">Squad Issues</h1>
                <p className="text-slate-400">Tap to explore replacement options</p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleBackToIssues}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedIssue?.player} Replacement</h1>
                  <p className="text-slate-400 text-sm">{selectedIssue?.candidates?.length} candidates ranked</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Replacement circles on sides during expanded phase */}
            {animationPhase === 'expanded' && selectedIssue && (
              <>
                {/* Left - Tiago Santos */}
                <div className="absolute" style={{ right: 'calc(50% + 180px)' }}>
                  <TiagoVideoCircle />
                </div>
                
                {/* Right - Malo Gusto */}
                <div className="absolute" style={{ left: 'calc(50% + 180px)' }}>
                  <GustoVideoCircle videoId="fd5f4Akuieg" />
                </div>
              </>
            )}
            
            {/* Issue cards / Current player card */}
            <div className="flex gap-6 justify-center relative z-10">
              {issueCards.map((issue) => {
                const isSelected = animatingIssue === issue.id;
                const isOther = animatingIssue && !isSelected;
                
                // Calculate offset to center the selected card
                const cardPositions = { pope: -312, botman: 0, trippier: 312 };
                const offset = cardPositions[issue.id] || 0;
                
                // Don't render other cards when expanded
                if (isOther && animationPhase === 'expanded') return null;
                
                return (
                  <div
                    key={issue.id}
                    onClick={() => animationPhase === 'idle' && handleIssueSelect(issue)}
                    className={`group relative w-72 h-[480px] shrink-0 transition-all duration-500 ease-out
                      ${animationPhase === 'idle' ? 'cursor-pointer hover:scale-105' : ''}`}
                    style={{
                      transform: isSelected && animationPhase === 'center'
                        ? `translateX(${-offset}px) scale(1.02)` 
                        : 'translateX(0) scale(1)',
                      opacity: isOther ? 0 : 1,
                      zIndex: isSelected ? 10 : 1,
                      pointerEvents: animationPhase !== 'idle' && !isSelected ? 'none' : 'auto'
                    }}
                  >
                    {/* Glow effect */}
                    <div 
                      className={`absolute inset-0 rounded-3xl blur-xl transition-opacity
                        ${animationPhase === 'idle' ? 'opacity-50 group-hover:opacity-80' : 'opacity-30'}`}
                      style={{
                        background: isSelected && animationPhase !== 'idle'
                          ? 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)'
                          : issue.risk > 90 
                            ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
                            : issue.risk > 80 
                              ? 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(250,204,21,0.4) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className={`relative backdrop-blur-sm rounded-3xl overflow-hidden border transition-all duration-500 h-full flex flex-col
                      ${isSelected && animationPhase !== 'idle' 
                        ? 'bg-slate-600/60 border-amber-500/50' 
                        : 'bg-slate-800/80 border-slate-700/50 hover:border-slate-500/50'}`}>
                      {/* Player Image */}
                      <div className="relative h-64 bg-gradient-to-b from-slate-700/50 to-slate-800/50 shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayerAvatarSwipe name={issue.player} size="issue" />
                        </div>
                        
                        {/* Current badge for selected */}
                        {isSelected && animationPhase !== 'idle' && (
                          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-900 text-xs font-bold">
                            CURRENT
                          </div>
                        )}
                        
                        {/* Risk Badge - show only in idle */}
                        {animationPhase === 'idle' && (
                          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5
                            ${issue.risk > 90 ? 'bg-red-500/90 text-white' : 
                              issue.risk > 80 ? 'bg-orange-500/90 text-white' : 
                              'bg-yellow-500/90 text-slate-900'}`}>
                            <AlertTriangle className="w-4 h-4" />
                            {issue.risk}%
                          </div>
                        )}
                        
                        {/* Position Badge - show only in idle */}
                        {animationPhase === 'idle' && (
                          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 text-xs font-medium">
                            {issue.position}
                          </div>
                        )}
                      </div>
                      
                      {/* Player Info */}
                      <div className="p-5 flex-1">
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
                        
                        {/* Candidates Preview - show only in idle */}
                        {animationPhase === 'idle' && (
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
          
          {/* Carousel with Kieran + 2 candidates visible */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="flex items-center gap-4 max-w-6xl w-full">
              {/* Left Arrow (if scrolled) */}
              {candidateScrollIndex > 0 && (
                <button 
                  onClick={() => setCandidateScrollIndex(Math.max(0, candidateScrollIndex - 1))}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors shrink-0"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {candidateScrollIndex === 0 && <div className="w-12 shrink-0" />}
              
              {/* Cards Container */}
              <div className="flex gap-6 flex-1 justify-center">
                {/* Kieran Trippier Card (Current Player) - Only show when scroll is at 0 */}
                {candidateScrollIndex === 0 && (
                  <div className="group relative w-72 h-[480px] shrink-0">
                    <div className="relative bg-slate-600/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-500/50 h-full flex flex-col">
                      {/* Player Image */}
                      <div className="relative h-64 bg-gradient-to-b from-slate-500/30 to-slate-600/30 shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayerAvatarSwipe name={selectedIssue.player} size="issue" />
                        </div>
                        
                        {/* Current Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-500/90 text-white text-sm font-bold">
                          Current
                        </div>
                        
                        {/* Club Badge */}
                        <div className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-900/80">
                          <img 
                            src={clubBadges['Newcastle']} 
                            alt="Newcastle"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Player Info */}
                      <div className="p-5 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{selectedIssue.player}</h3>
                          <span className="text-slate-300 text-sm">{selectedIssue.age} yrs</span>
                        </div>
                        <p className={`text-sm font-medium mb-3 ${
                          selectedIssue.type === 'contract' ? 'text-orange-400' : 
                          selectedIssue.type === 'injury' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {selectedIssue.issue}
                        </p>
                        <p className="text-slate-400 text-sm line-clamp-2">{selectedIssue.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Visible Candidates (2 at a time) */}
                {selectedIssue.candidates.slice(candidateScrollIndex, candidateScrollIndex + 2).map((candidate, idx) => {
                  const actualIndex = candidateScrollIndex + idx;
                  return (
                    <div
                      key={actualIndex}
                      onClick={() => handleCandidateSelect(actualIndex)}
                      className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 w-72 h-[480px] shrink-0"
                    >
                      {/* Glow effect based on rank */}
                      <div 
                        className="absolute inset-0 rounded-3xl blur-xl opacity-50 transition-opacity group-hover:opacity-80"
                        style={{
                          background: actualIndex === 0 
                            ? 'radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)'
                            : actualIndex === 1 
                              ? 'radial-gradient(circle, rgba(148,163,184,0.3) 0%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(100,116,139,0.3) 0%, transparent 70%)'
                        }}
                      />
                      
                      <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700/50 hover:border-slate-500/50 transition-colors h-full flex flex-col">
                        {/* Player Image */}
                        <div className="relative h-64 bg-gradient-to-b from-slate-700/50 to-slate-800/50 shrink-0">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayerAvatarSwipe name={candidate.name} size="issue" />
                          </div>
                          
                          {/* Rank Badge */}
                          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5
                            ${actualIndex === 0 ? 'bg-yellow-500/90 text-slate-900' : 
                              actualIndex === 1 ? 'bg-slate-400/90 text-slate-900' : 
                              'bg-slate-600/90 text-white'}`}>
                            #{candidate.rank}
                          </div>
                          
                          {/* Club Badge */}
                          <div className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-900/80">
                            {clubBadges[candidate.club] ? (
                              <img 
                                src={clubBadges[candidate.club]} 
                                alt={candidate.club}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="text-slate-300 text-xs font-medium px-1">{candidate.club}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Player Info */}
                        <div className="p-5 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                            <span className="text-slate-400 text-sm">{candidate.age} yrs</span>
                          </div>
                          <p className="text-sm font-medium mb-3 text-green-400">
                            {candidate.value}
                          </p>
                          <p className="text-slate-500 text-sm line-clamp-2">{candidate.highlights}</p>
                          
                          {/* Confidence Preview */}
                          <div className="mt-4 flex items-center gap-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              candidate.confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                              candidate.confidence >= 50 ? 'bg-amber-500/20 text-amber-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {candidate.confidence}% confidence
                            </div>
                            <span className="text-slate-500 text-xs">FC {candidate.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Right Arrow (if more candidates) */}
              {candidateScrollIndex + 2 < selectedIssue.candidates.length && (
                <button 
                  onClick={() => setCandidateScrollIndex(Math.min(selectedIssue.candidates.length - 2, candidateScrollIndex + 1))}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors shrink-0"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
              {candidateScrollIndex + 2 >= selectedIssue.candidates.length && <div className="w-12 shrink-0" />}
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
