// Helper functions for MAGPIE II

// Format player value
export const formatValue = (value) => {
  if (!value) return '£0';
  if (typeof value === 'string') return value;
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
};

// Format wages
export const formatWages = (wages) => {
  if (!wages) return '£0/week';
  if (typeof wages === 'string') return wages;
  return `£${(wages / 1000).toFixed(0)}K/week`;
};

// Format budget amounts
export const formatBudget = (amount) => {
  if (amount >= 1000000) return `£${amount / 1000000}M`;
  if (amount >= 1000) return `£${amount / 1000}K`;
  return `£${amount}`;
};

// Get player ID from name
export const getPlayerId = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
};

// Parse contract year
export const getContractYear = (contract) => parseInt(contract) || 2030;

// Parse value string to number
export const parseValue = (value) => {
  if (!value) return 0;
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (value.includes('M')) return num * 1000000;
  if (value.includes('K')) return num * 1000;
  return num;
};

// Calculate days until date
export const daysUntil = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  const diff = targetDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Format date relative (e.g., "3 days ago")
export const formatRelativeDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// Calculate issue age in days
export const calculateIssueAge = (createdDate) => {
  const created = new Date(createdDate);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
};

// Severity configuration
export const getSeverityConfig = (severity) => {
  const configs = {
    critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', dot: 'bg-red-500', label: 'Critical' },
    high: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', dot: 'bg-orange-500', label: 'High' },
    moderate: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moderate' },
    low: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', dot: 'bg-green-500', label: 'Low' },
  };
  return configs[severity] || configs.moderate;
};

// Activity type configuration
export const activityTypes = {
  discussion: { label: 'Discussion', color: 'blue' },
  phone_call: { label: 'Phone Call', color: 'green' },
  scout_visit: { label: 'Scouting Visit', color: 'purple' },
  video_review: { label: 'Video Review', color: 'orange' },
  meeting: { label: 'Meeting', color: 'cyan' },
  medical: { label: 'Medical Check', color: 'red' },
  contract: { label: 'Contract Discussion', color: 'indigo' },
  status_change: { label: 'Status Change', color: 'gray' },
};

// Calculate player match score (AI replacement)
export const calculateMatchScore = (player, targetPlayer) => {
  if (!player.attributes || !targetPlayer.attributes) return 50;
  
  let score = 0;
  let count = 0;
  
  // Compare common attributes
  for (const attr in targetPlayer.attributes) {
    if (player.attributes[attr]) {
      const diff = Math.abs(player.attributes[attr] - targetPlayer.attributes[attr]);
      score += Math.max(0, 100 - diff * 2);
      count++;
    }
  }
  
  // Position match bonus
  if (player.position === targetPlayer.position) score += 100;
  
  // Age factor (younger is bonus for replacement)
  if (player.age < targetPlayer.age) score += (targetPlayer.age - player.age) * 5;
  
  return count > 0 ? Math.round((score / (count + 1)) * 100) / 100 : 50;
};

// Find similar players
export const findSimilarPlayers = (targetPlayer, candidatePool, limit = 5) => {
  const scored = candidatePool.map(candidate => ({
    ...candidate,
    matchScore: calculateMatchScore(candidate, targetPlayer)
  }));
  
  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

// Position display names
export const positionNames = {
  GK: 'Goalkeeper',
  CB: 'Centre Back',
  LB: 'Left Back',
  RB: 'Right Back',
  LWB: 'Left Wing Back',
  RWB: 'Right Wing Back',
  CDM: 'Defensive Midfield',
  CM: 'Central Midfield',
  CAM: 'Attacking Midfield',
  LM: 'Left Midfield',
  RM: 'Right Midfield',
  LW: 'Left Wing',
  RW: 'Right Wing',
  CF: 'Centre Forward',
  ST: 'Striker',
};

// FC Rating color
export const getFCRatingColor = (rating) => {
  if (!rating) return 'bg-gray-400';
  if (rating >= 85) return 'from-emerald-500 to-emerald-600';
  if (rating >= 80) return 'from-green-500 to-green-600';
  if (rating >= 75) return 'from-lime-500 to-lime-600';
  if (rating >= 70) return 'from-yellow-500 to-yellow-600';
  if (rating >= 65) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
};

// Infer shortlist reason based on player data
export const inferShortlistReason = (player) => {
  const currentYear = 2025;
  const yearsLeft = getContractYear(player.contract) - currentYear;
  const isOlder = player.age >= 32;
  const isExpiring = yearsLeft <= 1;
  const hasLongInjury = player.injury && player.injury.daysOut >= 90;
  const hasMediumInjury = player.injury && player.injury.daysOut >= 30 && player.injury.daysOut < 90;
  const isHighInjuryRisk = player.injury && player.injury.risk === 'high';
  const hasTransferInterest = player.flag === 'Saudi Interest' || player.flag === 'Key';
  const isLoanPlayer = player.flag === 'Loan';
  const hasLowMinutes = player.minutes !== undefined && player.minutes < 500 && player.position !== 'GK';
  const isHighValue = player.value && parseValue(player.value) >= 40000000;

  if (isExpiring && isOlder) {
    return { 
      trigger: 'Contract expiring', 
      severity: 'critical', 
      reasoning: `Contract ends soon and at ${player.age}, succession planning critical.` 
    };
  }
  if (isExpiring) {
    return { 
      trigger: 'Contract expiring', 
      severity: 'critical', 
      reasoning: `Contract expiring. Decision needed on renewal vs replacement.` 
    };
  }
  if (hasLongInjury) {
    return { 
      trigger: 'Long-term injury cover', 
      severity: 'critical', 
      reasoning: `${player.injury.daysOut} days missed. Cover needed.` 
    };
  }
  if (hasTransferInterest) {
    return { 
      trigger: 'Transfer interest', 
      severity: 'high', 
      reasoning: `External interest reported. Contingency planning recommended.` 
    };
  }
  if (isLoanPlayer) {
    return { 
      trigger: 'Loan decision', 
      severity: 'moderate', 
      reasoning: `Loan player - decision needed on permanent signing or replacement.` 
    };
  }
  if (isOlder && isHighInjuryRisk) {
    return { 
      trigger: 'Injury risk management', 
      severity: 'high', 
      reasoning: `Age ${player.age} with high injury risk. Consider succession.` 
    };
  }
  if (hasMediumInjury && isHighValue) {
    return { 
      trigger: 'Injury concern', 
      severity: 'moderate', 
      reasoning: `${player.injury.daysOut} days missed. Monitor and consider cover.` 
    };
  }
  if (hasLowMinutes && !isLoanPlayer) {
    return { 
      trigger: 'Low game time', 
      severity: 'low', 
      reasoning: `Only ${player.minutes} minutes played. Assess role or consider move.` 
    };
  }
  if (isOlder) {
    return { 
      trigger: 'Succession planning', 
      severity: 'moderate', 
      reasoning: `At ${player.age}, succession planning advisable.` 
    };
  }
  return { 
    trigger: 'Succession planning', 
    severity: 'low', 
    reasoning: 'Proactive planning for squad depth.' 
  };
};

// Generate squad issues from squad data
export const generateSquadIssues = (squad) => {
  const currentYear = 2025;
  const issues = [];
  
  squad.forEach(player => {
    const yearsLeft = getContractYear(player.contract) - currentYear;
    const isExpiring = yearsLeft <= 1;
    const hasLongInjury = player.injury && player.injury.daysOut >= 90;
    const hasTransferInterest = player.flag === 'Saudi Interest' || player.flag === 'Key';

    if (isExpiring) {
      issues.push({ 
        id: `${player.id}-contract`, 
        player, 
        type: 'contract', 
        severity: 'critical', 
        score: 90, 
        title: 'Contract expiring', 
        description: `Contract ends ${player.contract}. Decision needed.`, 
        recommendation: 'Begin succession planning' 
      });
    }
    if (hasLongInjury) {
      issues.push({ 
        id: `${player.id}-injury`, 
        player, 
        type: 'injury', 
        severity: 'critical', 
        score: 85, 
        title: 'Long-term injury', 
        description: `${player.injury.daysOut} days missed.`, 
        recommendation: 'Source cover' 
      });
    }
    if (hasTransferInterest && player.flag === 'Key') {
      issues.push({ 
        id: `${player.id}-key`, 
        player, 
        type: 'retention', 
        severity: 'moderate', 
        score: 70, 
        title: 'Key player', 
        description: 'Essential to squad. Monitor commitment.', 
        recommendation: 'Contingency planning' 
      });
    }
  });
  
  return issues.sort((a, b) => b.score - a.score);
};

// Get player activities by ID
export const getPlayerActivities = (playerActivities, name) => {
  const playerId = getPlayerId(name);
  return playerActivities[playerId] || [];
};
