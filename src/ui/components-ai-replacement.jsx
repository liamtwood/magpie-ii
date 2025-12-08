import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Star, ChevronRight, Filter, TrendingUp, AlertCircle, Play, MapPin, Check, Plus, Loader2 } from 'lucide-react';

const replacementDatabase = {
  'RB': [
    { id: 'tiago-santos', name: 'Tiago Santos', club: 'Lille', league: 'Ligue 1', age: 22, value: '€15M', wages: '€55k/wk', nationality: 'Portugal', fitScore: 92, rating: 3.5, strengths: ['Attacking threat', 'Recovery pace', 'High ceiling'], concerns: ['Recent ACL', 'Limited minutes'], highlights: '4 assists in Europa League, 2.3 key passes/90', available: true },
    { id: 'jeremie-frimpong', name: 'Jeremie Frimpong', club: 'Bayer Leverkusen', league: 'Bundesliga', age: 23, value: '€40M', wages: '€90k/wk', nationality: 'Netherlands', fitScore: 88, rating: 4, strengths: ['Elite pace', '1v1 ability', 'Big game experience'], concerns: ['High price', 'Multiple suitors'], highlights: 'Bundesliga champion, 8 G+A last season', available: true },
    { id: 'devyne-rensch', name: 'Devyne Rensch', club: 'Ajax', league: 'Eredivisie', age: 21, value: '€20M', wages: '€45k/wk', nationality: 'Netherlands', fitScore: 85, rating: 3, strengths: ['Good value', 'Dutch pedigree', 'Versatile'], concerns: ['Step up in quality', 'Ajax instability'], highlights: 'Netherlands international, Ajax academy product', available: true },
    { id: 'malo-gusto', name: 'Malo Gusto', club: 'Chelsea', league: 'Premier League', age: 21, value: '€35M', wages: '€80k/wk', nationality: 'France', fitScore: 88, rating: 3.5, strengths: ['PL proven', 'Physical', 'Young'], concerns: ['Chelsea reluctant', 'High wages'], highlights: 'Started 28 PL games, France U21 captain', available: false },
  ],
  'CB': [
    { id: 'marc-guehi', name: 'Marc Guéhi', club: 'Crystal Palace', league: 'Premier League', age: 24, value: '€65M', wages: '€80k/wk', nationality: 'England', fitScore: 95, rating: 4, strengths: ['Leadership', 'Ball-playing', 'PL proven', 'England intl'], concerns: ['Price tag', 'Multiple suitors'], highlights: 'Euro 2024 starter, 89% pass completion', available: true },
    { id: 'goncalo-inacio', name: 'Gonçalo Inácio', club: 'Sporting CP', league: 'Liga Portugal', age: 23, value: '€45M', wages: '€60k/wk', nationality: 'Portugal', fitScore: 90, rating: 3.5, strengths: ['Left-footed', 'Progressive passing', 'UCL experience'], concerns: ['Adaptation needed', 'Release clause'], highlights: 'Portugal international, Liga Portugal champion', available: true },
    { id: 'castello-lukeba', name: 'Castello Lukeba', club: 'RB Leipzig', league: 'Bundesliga', age: 21, value: '€40M', wages: '€55k/wk', nationality: 'France', fitScore: 87, rating: 3.5, strengths: ['Athletic', 'Young', 'Ball recovery'], concerns: ['Leipzig price', 'Injury history'], highlights: 'France international, Bundesliga regular', available: true },
  ],
  'CM': [
    { id: 'adam-wharton', name: 'Adam Wharton', club: 'Crystal Palace', league: 'Premier League', age: 20, value: '€50M', wages: '€60k/wk', nationality: 'England', fitScore: 93, rating: 4, strengths: ['Tempo control', 'Vision', 'English', 'Young'], concerns: ['Limited experience', 'High price'], highlights: 'England call-up, 91% pass completion', available: true },
    { id: 'enzo-le-fee', name: 'Enzo Le Fée', club: 'Roma', league: 'Serie A', age: 24, value: '€25M', wages: '€50k/wk', nationality: 'France', fitScore: 82, rating: 3, strengths: ['Technical', 'Work rate', 'Good value'], concerns: ['Physical step up', 'Adaptation'], highlights: 'Ligue 1 POTY nominee, progressive passer', available: true },
  ],
  'LW': [
    { id: 'johan-bakayoko', name: 'Johan Bakayoko', club: 'PSV', league: 'Eredivisie', age: 21, value: '€40M', wages: '€45k/wk', nationality: 'Belgium', fitScore: 89, rating: 3.5, strengths: ['Pace', 'Dribbling', 'G+A output'], concerns: ['Step up needed', 'Right-footed on left'], highlights: '15 G+A in Eredivisie, Belgium international', available: true },
  ]
};

const playerProfiles = {
  'kieran-trippier': { name: 'Kieran Trippier', position: 'RB', age: 34, contract: '2026', value: '€12M', wages: '€120k/wk', issues: ['Contract expiring', '67 injury days this season', 'Age 34'] },
  'sven-botman': { name: 'Sven Botman', position: 'CB', age: 24, contract: '2029', value: '€45M', wages: '€85k/wk', issues: ['ACL injury - 6 months out', 'Only 450 minutes this season'] },
  'bruno-guimaraes': { name: 'Bruno Guimaraes', position: 'CM', age: 26, contract: '2028', value: '€85M', wages: '€150k/wk', issues: ['Saudi interest', 'PSG interest', '£100M release clause'] },
  'anthony-gordon': { name: 'Anthony Gordon', position: 'LW', age: 23, contract: '2028', value: '€70M', wages: '€100k/wk', issues: ['Liverpool interest', 'PSR discussions', 'May need to sell'] },
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex gap-0.5">
      {[...Array(4)].map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
};

const PlayerAvatar = ({ name, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-semibold border-2 border-gray-300`}>
      {initials}
    </div>
  );
};

export default function PlayerReplacementAI({ isOpen, onClose, playerId, onAddToShortlist }) {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({ maxValue: 100, maxAge: 30, availableOnly: false });
  const [showFilters, setShowFilters] = useState(false);
  const [addedToShortlist, setAddedToShortlist] = useState([]);

  const player = playerProfiles[playerId];

  useEffect(() => {
    if (isOpen && player) {
      setIsLoading(true);
      setSelectedCandidate(null);
      setAddedToShortlist([]);
      const timer = setTimeout(() => {
        setCandidates(replacementDatabase[player.position] || []);
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, playerId, player]);

  const filteredCandidates = candidates.filter(c => {
    const valueNum = parseInt(c.value.replace(/[€M]/g, ''));
    if (valueNum > filters.maxValue) return false;
    if (c.age > filters.maxAge) return false;
    if (filters.availableOnly && !c.available) return false;
    return true;
  });

  const handleAddToShortlist = (candidate) => {
    setAddedToShortlist(prev => [...prev, candidate.id]);
    if (onAddToShortlist) onAddToShortlist(candidate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Player Replacement</h2>
              <p className="text-gray-400 text-sm">Finding alternatives for {player?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-72 border-r border-gray-200 p-5 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-4">Replacing</div>
            {player && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <PlayerAvatar name={player.name} size="lg" />
                  <div>
                    <div className="font-bold text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.position} • {player.age} yrs</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="font-medium">{player.value}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Wages</span><span className="font-medium">{player.wages}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Contract</span><span className="font-medium">{player.contract}</span></div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Issues</div>
                  <div className="space-y-1.5">
                    {player.issues.map((issue, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4" />Filters
                <ChevronRight className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
              </button>
              {showFilters && (
                <div className="mt-3 space-y-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div>
                    <label className="text-xs text-gray-500">Max Value (€M)</label>
                    <input type="range" min="10" max="100" value={filters.maxValue} onChange={(e) => setFilters(prev => ({ ...prev, maxValue: parseInt(e.target.value) }))} className="w-full" />
                    <div className="text-xs text-right text-gray-600">€{filters.maxValue}M</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Max Age</label>
                    <input type="range" min="18" max="35" value={filters.maxAge} onChange={(e) => setFilters(prev => ({ ...prev, maxAge: parseInt(e.target.value) }))} className="w-full" />
                    <div className="text-xs text-right text-gray-600">{filters.maxAge} years</div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" checked={filters.availableOnly} onChange={(e) => setFilters(prev => ({ ...prev, availableOnly: e.target.checked }))} className="rounded" />
                    Available only
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                </div>
                <div className="font-medium text-gray-900 mb-1">Analyzing replacement options...</div>
                <div className="text-sm">Scanning player database • Calculating fit scores</div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{filteredCandidates.length} Replacement{filteredCandidates.length !== 1 ? 's' : ''} Found</h3>
                    <p className="text-sm text-gray-500">Ranked by fit score for {player?.position} position</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredCandidates.map((candidate, index) => (
                    <div key={candidate.id} onClick={() => setSelectedCandidate(selectedCandidate?.id === candidate.id ? null : candidate)} className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${selectedCandidate?.id === candidate.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>{index + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <PlayerAvatar name={candidate.name} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{candidate.name}</span>
                                {!candidate.available && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded">Unlikely</span>}
                                {index === 0 && candidate.available && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded">Top Pick</span>}
                              </div>
                              <div className="text-sm text-gray-500">{candidate.club} • {candidate.league} • {candidate.age} yrs</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div><span className="text-gray-500">Value:</span><span className="font-medium text-gray-900 ml-1">{candidate.value}</span></div>
                            <div><span className="text-gray-500">Wages:</span><span className="font-medium text-gray-900 ml-1">{candidate.wages}</span></div>
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400" /><span className="text-gray-600">{candidate.nationality}</span></div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-500">Fit Score</span><span className="font-semibold text-gray-900">{candidate.fitScore}%</span></div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${candidate.fitScore >= 90 ? 'bg-green-500' : candidate.fitScore >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${candidate.fitScore}%` }} />
                            </div>
                          </div>
                          {selectedCandidate?.id === candidate.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Strengths</div>
                                  <div className="space-y-1">{candidate.strengths.map((s, i) => (<div key={i} className="flex items-center gap-2 text-sm"><TrendingUp className="h-3 w-3 text-green-500" /><span className="text-gray-700">{s}</span></div>))}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Concerns</div>
                                  <div className="space-y-1">{candidate.concerns.map((c, i) => (<div key={i} className="flex items-center gap-2 text-sm"><AlertCircle className="h-3 w-3 text-amber-500" /><span className="text-gray-700">{c}</span></div>))}</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">AI Analysis</div>
                                <p className="text-sm text-gray-700">{candidate.highlights}</p>
                              </div>
                              <div className="flex gap-2">
                                {addedToShortlist.includes(candidate.id) ? (
                                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm"><Check className="h-4 w-4" />Added to Shortlist</button>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); handleAddToShortlist(candidate); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"><Plus className="h-4 w-4" />Add to Shortlist</button>
                                )}
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"><Play className="h-4 w-4" />Watch Clips</button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right"><StarRating rating={candidate.rating} /><div className="text-[10px] text-gray-500 mt-1">Scout Rating</div></div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredCandidates.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <div className="font-medium">No candidates match your filters</div>
                    <div className="text-sm">Try adjusting the filters to see more options</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500"><Sparkles className="h-4 w-4 inline mr-1 text-purple-500" />Powered by MAGPIE AI • Data from StatsBomb, Impect, Scoutastic</div>
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">Done</button>
        </div>
      </div>
    </div>
  );
}
