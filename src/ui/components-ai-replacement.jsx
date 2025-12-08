import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, Target, TrendingUp, AlertCircle, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { FCRatingBadge, MatchScoreBadge, PositionBadge, PlayerAvatar, StarRating } from '../ui/Badges';
import { shortlistCandidates } from '../../data/shortlistCandidates';
import { formatBudget, calculateMatchScore } from '../../utils/helpers';

// Simulated AI candidate database (in production, this would be an API call)
const globalCandidatePool = [
  ...Object.values(shortlistCandidates),
  // Add more candidates for demo
  {
    id: 'malo-gusto',
    name: 'Malo Gusto',
    club: 'Chelsea',
    nation: 'France',
    nationFlag: '🇫🇷',
    age: 21,
    position: 'RB',
    otherPositions: ['RWB'],
    marketValue: '€35M',
    fcRating: 77,
    attributes: { crossing: 76, defending: 78, pace: 88, dribbling: 78, stamina: 86 },
    pros: ['Young', 'PL experience', 'Versatile'],
    cons: ['Chelsea reluctant to sell', 'High price'],
  },
  {
    id: 'jeremie-frimpong',
    name: 'Jeremie Frimpong',
    club: 'Bayer Leverkusen',
    nation: 'Netherlands',
    nationFlag: '🇳🇱',
    age: 24,
    position: 'RB',
    otherPositions: ['RWB', 'RW'],
    marketValue: '€50M',
    fcRating: 84,
    attributes: { crossing: 82, defending: 70, pace: 94, dribbling: 85, stamina: 90 },
    pros: ['Elite pace', 'Bundesliga champion', 'Attacking threat'],
    cons: ['Very expensive', 'Defensive questions'],
  },
  {
    id: 'devyne-rensch',
    name: 'Devyne Rensch',
    club: 'Ajax',
    nation: 'Netherlands',
    nationFlag: '🇳🇱',
    age: 22,
    position: 'RB',
    otherPositions: ['CB'],
    marketValue: '€15M',
    fcRating: 74,
    attributes: { crossing: 74, defending: 80, pace: 80, dribbling: 75, stamina: 82 },
    pros: ['Versatile', 'Good value', 'CL experience'],
    cons: ['Ajax form dipped', 'Step up to PL'],
  },
  {
    id: 'joachim-andersen',
    name: 'Joachim Andersen',
    club: 'Fulham',
    nation: 'Denmark',
    nationFlag: '🇩🇰',
    age: 28,
    position: 'CB',
    otherPositions: [],
    marketValue: '€30M',
    fcRating: 80,
    attributes: { aerialAbility: 85, tackling: 84, passing: 82, pace: 72, positioning: 86 },
    pros: ['PL proven', 'Leader', 'Ball-playing'],
    cons: ['Age', 'Fulham want big fee'],
  },
  {
    id: 'goncalo-inacio',
    name: 'Gonçalo Inácio',
    club: 'Sporting CP',
    nation: 'Portugal',
    nationFlag: '🇵🇹',
    age: 23,
    position: 'CB',
    otherPositions: ['LB'],
    marketValue: '€45M',
    fcRating: 81,
    attributes: { aerialAbility: 80, tackling: 82, passing: 85, pace: 78, positioning: 80 },
    pros: ['Left-footed', 'Great passer', 'Young'],
    cons: ['Release clause high', 'Adapting to PL'],
  },
];

export default function PlayerReplacementAI({ isOpen, onClose, targetPlayer, onSelectCandidate }) {
  const [searchMode, setSearchMode] = useState('replace'); // 'replace' or 'clone'
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    maxAge: 30,
    maxFee: 50000000,
    position: targetPlayer?.position || 'RB',
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Run AI search when modal opens or filters change
  useEffect(() => {
    if (isOpen && targetPlayer) {
      runAISearch();
    }
  }, [isOpen, targetPlayer, searchMode, filters]);

  const runAISearch = async () => {
    setIsSearching(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter candidates by position and criteria
    let candidates = globalCandidatePool.filter(c => {
      const positionMatch = c.position === filters.position || c.otherPositions?.includes(filters.position);
      const ageMatch = c.age <= filters.maxAge;
      const feeMatch = parseFloat(c.marketValue?.replace(/[^0-9.]/g, '')) * 1000000 <= filters.maxFee;
      return positionMatch && ageMatch && feeMatch && c.id !== targetPlayer?.id;
    });

    // Calculate match scores
    candidates = candidates.map(c => ({
      ...c,
      matchScore: calculateMatchScore(c, targetPlayer) || Math.floor(Math.random() * 30) + 60,
    }));

    // Sort by match score
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    setResults(candidates.slice(0, 6));
    setIsSearching(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Player