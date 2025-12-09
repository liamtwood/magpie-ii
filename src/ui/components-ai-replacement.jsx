import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Star, ChevronRight, Filter, TrendingUp, AlertCircle, Play, MapPin, Check, Plus, Loader2 } from 'lucide-react';

const replacementDatabase = {
  'RB': [
    { id: 'tiago-santos', name: 'Tiago Santos', club: 'Lille', league: 'Ligue 1', age: 22, value: '15M', wages: '55k/wk', nationality: 'Portugal', fitScore: 92, rating: 3.5, strengths: ['Attacking threat', 'Recovery pace', 'High ceiling'], concerns: ['Recent ACL', 'Limited minutes'], highlights: '4 assists in Europa League', available: true },
    { id: 'jeremie-frimpong', name: 'Jeremie Frimpong', club: 'Bayer Leverkusen', league: 'Bundesliga', age: 23, value: '40M', wages: '90k/wk', nationality: 'Netherlands', fitScore: 88, rating: 4, strengths: ['Elite pace', '1v1 ability', 'Big game experience'], concerns: ['High price', 'Multiple suitors'], highlights: 'Bundesliga champion', available: true },
    { id: 'devyne-rensch', name: 'Devyne Rensch', club: 'Ajax', league: 'Eredivisie', age: 21, value: '20M', wages: '45k/wk', nationality: 'Netherlands', fitScore: 85, rating: 3, strengths: ['Good value', 'Dutch pedigree', 'Versatile'], concerns: ['Step up in quality'], highlights: 'Netherlands international', available: true },
  ],
  'CB': [
    { id: 'marc-guehi', name: 'Marc Guehi', club: 'Crystal Palace', league: 'Premier League', age: 24, value: '65M', wages: '80k/wk', nationality: 'England', fitScore: 95, rating: 4, strengths: ['Leadership', 'Ball-playing', 'PL proven'], concerns: ['Price tag', 'Multiple suitors'], highlights: 'Euro 2024 starter', available: true },
    { id: 'goncalo-inacio', name: 'Goncalo Inacio', club: 'Sporting CP', league: 'Liga Portugal', age: 23, value: '45M', wages: '60k/wk', nationality: 'Portugal', fitScore: 90, rating: 3.5, strengths: ['Left-footed', 'Progressive passing'], concerns: ['Adaptation needed'], highlights: 'Portugal international', available: true },
  ],
  'CM': [
    { id: 'adam-wharton', name: 'Adam Wharton', club: 'Crystal Palace', league: 'Premier League', age: 20, value: '50M', wages: '60k/wk', nationality: 'England', fitScore: 93, rating: 4, strengths: ['Tempo control', 'Vision', 'English'], concerns: ['Limited experience'], highlights: 'England call-up', available: true },
  ],
  'LW': [
    { id: 'johan-bakayoko', name: 'Johan Bakayoko', club: 'PSV', league: 'Eredivisie', age: 21, value: '40M', wages: '45k/wk', nationality: 'Belgium', fitScore: 89, rating: 3.5, strengths: ['Pace', 'Dribbling'], concerns: ['Step up needed'], highlights: '15 G+A in Eredivisie', available: true },
  ]
};

const playerProfiles = {
  'kieran-trippier': { name: 'Kieran Trippier', position: 'RB', age: 34, contract: '2026', value: '12M', wages: '120k/wk', issues: ['Contract expiring', '67 injury days', 'Age 34'] },
  'sven-botman': { name: 'Sven Botman', position: 'CB', age: 24, contract: '2029', value: '45M', wages: '85k/wk', issues: ['ACL injury - 6 months out'] },
  'bruno-guimaraes': { name: 'Bruno Guimaraes', position: 'CM', age: 26, contract: '2028', value: '85M', wages: '150k/wk', issues: ['Saudi interest', 'PSG interest'] },
  'anthony-gordon': { name: 'Anthony Gordon', position: 'LW', age: 23, contract: '2028', value: '70M', wages: '100k/wk', issues: ['Liverpool interest', 'PSR discussions'] },
};

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(4)].map((_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
    ))}
  </div>
);

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

  const handleAddToShortlist = (candidate) => {
    setAddedToShortlist(prev => [...prev, candidate.id]);
    if (onAddToShortlist) onAddToShortlist(candidate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
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
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex">
          <div className="w-64 border-r border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Replacing</div>
            {player && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <PlayerAvatar name={player.name} size="lg" />
                  <div>
                    <div className="font-bold text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.position} - {player.age}yrs</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="font-medium">{player.value}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Wages</span><span className="font-medium">{player.wages}</span></div>
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Issues</div>
                  {player.issues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs mb-1">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span className="text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                <div className="font-medium text-gray-900">Analyzing replacements...</div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">{candidates.length} Replacements Found</h3>
                <div className="space-y-3">
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} onClick={() => setSelectedCandidate(selectedCandidate?.id === candidate.id ? null : candidate)} className={`bg-white border rounded-xl p-4 cursor-pointer ${selectedCandidate?.id === candidate.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{index + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <PlayerAvatar name={candidate.name} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{candidate.name}</span>
                                {index === 0 && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Top Pick</span>}
                              </div>
                              <div className="text-sm text-gray-500">{candidate.club} - {candidate.age}yrs</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span><span className="text-gray-500">Value:</span> {candidate.value}</span>
                            <span><span className="text-gray-500">Wages:</span> {candidate.wages}</span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Fit Score</span><span className="font-semibold">{candidate.fitScore}%</span></div>
                            <div className="h-2 bg-gray-100 rounded-full"><div className={`h-full rounded-full ${candidate.fitScore >= 90 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${candidate.fitScore}%` }} /></div>
                          </div>
                          {selectedCandidate?.id === candidate.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Strengths</div>
                                  {candidate.strengths.map((s, i) => (<div key={i} className="flex items-center gap-2 text-sm"><TrendingUp className="h-3 w-3 text-green-500" />{s}</div>))}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Concerns</div>
                                  {candidate.concerns.map((c, i) => (<div key={i} className="flex items-center gap-2 text-sm"><AlertCircle className="h-3 w-3 text-amber-500" />{c}</div>))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {addedToShortlist.includes(candidate.id) ? (
                                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm"><Check className="h-4 w-4" />Added</button>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); handleAddToShortlist(candidate); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"><Plus className="h-4 w-4" />Add to Shortlist</button>
                                )}
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"><Play className="h-4 w-4" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                        <StarRating rating={candidate.rating} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500"><Sparkles className="h-4 w-4 inline mr-1 text-purple-500" />MAGPIE AI</span>
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Done</button>
        </div>
      </div>
    </div>
  );
}