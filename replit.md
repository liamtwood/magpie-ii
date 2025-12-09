# MAGPIE II - Newcastle United Recruitment Platform

## Overview

MAGPIE II is a football (soccer) recruitment and squad management platform designed for Newcastle United. The application provides tools for managing player data, tracking transfer targets, analyzing squad composition, and monitoring player statistics. It serves as a comprehensive CRM-style system for football club recruitment operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **Styling**: Tailwind CSS for utility-first styling with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **State Management**: React's built-in useState hooks (no external state management library)

### Application Structure
The application follows a client-side only architecture with no backend:
- `/src` - Main source directory containing React components and data files
- `/src/App.jsx` - Main application component with all screens and features
- `/src/main.jsx` - Application entry point
- `/src/index.css` - Tailwind CSS imports
- `/src/data-*.js` - Static data files for squad and shortlist information
- `/src/utils-helpers-js.js` - Shared utility functions for formatting and calculations

### Data Management
- **Static Data Pattern**: Player data, squad information, and shortlist candidates are stored in JavaScript modules as exported objects/arrays
- **No Database**: Currently operates without a backend database - all data is client-side
- **Data Structure**: Players have comprehensive attributes including personal info, contract details, statistics, transfer history, and performance ratings

### Component Patterns
- Functional components with React hooks
- Inline styling mixed with Tailwind utility classes
- Reusable badge components for ratings, sources, and status indicators
- Rating systems include FC ratings (numerical) and star ratings (visual)

## Key Features

### 1. Dashboard with Squad Health Check
- **Proactive Risk Detection**: Auto-generates issues from squad data analysis
- **Issue Cards**: Critical/moderate/low priority categorization with risk scores
- **Smart Recommendations**: Each issue includes actionable suggestions
- **Quick Actions**: "Create Shortlist" and "Resolve/Snooze" buttons on each issue

### 2. CRM-style Shortlists
- **Plan A + Plan B Layout**: Retain current player vs. replacement candidates view
- **Ball Holder Assignment**: Track who owns each recruitment action
- **Gates Workflow**: Four-stage pipeline (Scouting → Manager → Budget → Medical)
- **Pipeline Stage Indicators**: Visual progress through recruitment stages
- **Budget Tracking**: Transfer fee and wages tracking per shortlist
- **Severity Levels**: Priority indicators with deadline tracking

### 3. Rich Player Activity Timeline
- **Pre-populated Activities**: Seven players with realistic activity histories
- **Activity Types**: Phone calls, scout visits, video reviews, meetings, discussions, status changes, emails
- **Timeline Modal**: Visual timeline display with chronological activity log

### 4. Smart Create Shortlist Modal
- **AI Inference Box**: Shows reasoning and assumptions for auto-populated fields
- **Auto-population**: Title, trigger, severity, and budget derived from player data
- **Quick Creation**: Streamlined workflow from issue to actionable shortlist

### 5. Dismiss/Snooze Modal
- **Resolve Option**: Mark issues as addressed
- **Snooze Duration**: Multiple timeframe options (1 day, 1 week, 1 month, etc.)
- **Issue Management**: Clean workflow for handling non-urgent items

### 6. AI Assistant Chat Panel
- **Side Panel Interface**: Slide-out panel for queries
- **Natural Language**: Ask questions about squad, players, or recruitment

### 7. Navigation & UI
- **Light Theme Sidebar**: Clean navigation with badge counts
- **Multiple Screens**: Dashboard, Squad, Shortlists views
- **Slide-out Panels**: Player profiles and shortlist details open as right-side panels
- **Responsive Design**: Optimized for desktop recruitment workflow

### 8. Player Avatars
- **Real Headshots**: Player photos displayed throughout the app
- **Initials Fallback**: Gradient circles with initials for players without photos
- **Easy to Add**: Update `playerAvatars` object in App.jsx to add new player photos

## External Dependencies

### NPM Packages
| Package | Purpose |
|---------|---------|
| react / react-dom | Core UI framework |
| lucide-react | Icon library |
| vite | Development server and build tool |
| tailwindcss | Utility-first CSS framework |
| postcss / autoprefixer | CSS processing |

### Data Sources (Referenced in UI)
The application references several football data providers through badge components:
- StatsBomb (player statistics)
- Impect (performance data)
- Second Spectrum (tracking data)
- SkillCorner (physical metrics)
- Noisefeed (media monitoring)
- Scoutastic (scouting reports)
- Transfer Room (market intelligence)

*Note: These are display labels only - no actual API integrations exist currently.*

### No Backend Services
- No database connection
- No authentication system
- No server-side API
- All data is static and bundled with the frontend
