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
The application follows a full-stack architecture with React frontend and Express backend:
- `/src` - Main source directory containing React components and data files
- `/src/App.jsx` - Main application component with all screens and features
- `/src/main.jsx` - Application entry point
- `/src/index.css` - Tailwind CSS imports
- `/src/data-*.js` - Static data files for squad and shortlist information
- `/src/utils-helpers-js.js` - Shared utility functions for formatting and calculations
- `/src/ui/` - Reusable UI components (modals, panels)
- `/server` - Express backend with API endpoints
- `/shared` - Shared TypeScript schemas (Drizzle ORM)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints for issues/requirements management
- **Port**: Backend runs on port 3001, proxied via Vite

### Data Management
- **Static Data Pattern**: Player data, squad information, and shortlist candidates are stored in JavaScript modules as exported objects/arrays
- **Database**: Issues and requirements are stored in PostgreSQL database
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

### 9. WhatsApp Integration (Mock)
- **WhatsApp Panel**: View mock WhatsApp conversations related to each shortlist
- **Group Chat UI**: Shows participants, message history with timestamps
- **Initiate Chat**: For shortlists without a WhatsApp group, users can create one
- **Mock Data**: Pre-populated conversations for 'trippier' and 'cb' shortlists
- **State Management**: `whatsAppGroups` state in App.jsx tracks group data per shortlist
- **Component**: `src/ui/WhatsAppPanel.jsx` - reusable WhatsApp-style modal

### 10. Interactive Pitch View
- **View Toggle**: Switch between List and Pitch views on Squad screen
- **4-3-3 Formation**: Visual soccer pitch with positioned player markers
- **Player Avatars**: Real player photos displayed on pitch positions
- **Shortlist Indicators**: Red badges show candidate count per position
- **Position Panel**: Click any position to see current player(s) vs replacement candidates
- **Quick Navigation**: Links to player profiles and full shortlists from pitch view
- **State Management**: `squadViewMode` and `selectedPitchPosition` in App.jsx

### 11. Player Visualizer (GameScope)
- **Radial Metrics Display**: SVG-based visualization showing 9 performance categories in a ring around player
- **Interactive Metric Selection**: Click any metric node to see detailed breakdown panel
- **Metric Categories**: Overall, Distribution, Progression, Finishing, Dribbling, Physical (Def), Physical (Ath), Defending, Pressing
- **Score & Percentile**: Each metric shows score (0-10) and percentile vs position group
- **Data Source Badges**: Color-coded badges showing which providers contribute to each metric
- **Detail Panel**: Shows composite formula, source data, and component metrics when a category is selected
- **Currently Hardcoded**: Shows Tiago Santos data as demo (ready to accept dynamic player data)
- **Component**: `src/ui/PlayerVisualizer.jsx`

### 12. Dashboard Issue Tabs
- **Tabbed Interface**: Issues filtered by Critical, Moderate, Resolved, Snoozed categories
- **Count Badges**: Each tab shows count of issues in that category
- **Visual Styling**: Color-coded tabs matching issue severity (red, amber, green, gray)
- **Empty States**: Friendly messages when no issues exist in a category

### 14. Feedback & Requirements System (Database-Backed)
- **Floating Button**: Always-visible button in bottom-right corner on all screens
- **Context-Aware**: Automatically captures which screen the issue was reported from
- **Issue Types**: Bug, Enhancement, Question, Requirement
- **Priority Levels**: Low, Medium, High, Critical
- **Fix By Options**: Immediately, Current Release, Future Release
- **Status Tracking**: New, In Progress, Resolved, Closed
- **Issues Panel**: Slide-out panel to view/manage all issues with filtering by type, status, and screen
- **Database Persistence**: Issues stored in PostgreSQL database via REST API
- **Requirements Tracking**: 13 pre-populated Web-App Phase 1 requirements with screen assignments and "Ideas to Discuss" notes
- **Area Field**: Track which area (e.g., Recruitment) the requirement belongs to
- **Hierarchical Requirements**: Parent-child relationships allow breaking high-level requirements into child stories
- **Tree View**: Expand/collapse requirements to see child stories with visual hierarchy indicators
- **Add Story Button**: Create child stories directly from parent requirements
- **Delivery Targets**: Assign requirements to pages (Dashboard, Squad, etc.) or widgets (AI Assistant, Player Panel, etc.)
- **Grouped Filtering**: Filter panel shows pages and widgets in separate optgroups
- **API Endpoints**: GET/POST/PATCH/DELETE at `/api/issues`, GET at `/api/delivery-targets`
- **Database Tables**: `issues` (with parentId), `delivery_targets`, `issue_assignments`
- **Component**: `src/ui/FeedbackSystem.jsx`

### 13. Player Swipe (Dating App Style)
- **Issue Cards View**: Large cards showing squad issues (contract expiring, injuries, succession) with risk percentages
- **Card Sizing**: Card size and glow intensity reflects issue criticality (higher risk = bigger/brighter)
- **Shortlist Summary**: After selecting an issue, shows exec summary with ranked replacement candidates
- **Candidate Stack**: Visual stack of candidates ranked 1-3 with ratings and key info
- **Candidate Deep Dive**: Full-screen player card with background styling and detailed stats overlay
- **Swipe Navigation**: Swipe right/left for next/previous candidate, swipe up for more details
- **Keyboard Support**: Arrow keys for navigation (desktop fallback)
- **Action Buttons**: Like/pass buttons similar to dating apps for quick candidate decisions
- **Component**: `src/ui/PlayerSwipe.jsx`

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

### Backend Services
- **Database**: PostgreSQL (Neon-backed) for issues/requirements storage
- **API Server**: Express.js running on port 3001
- **ORM**: Drizzle ORM for database schema and queries
- **No authentication system** (yet)
- Player data remains static and bundled with the frontend
