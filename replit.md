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

### Key Features
1. **Squad Management** - View and manage current squad with detailed player profiles
2. **Shortlist/CRM** - Track transfer targets through recruitment pipeline stages
3. **Player Profiles** - Comprehensive player data including stats, contract info, and injury tracking
4. **Data Visualization** - Rating badges, injury indicators, and performance metrics

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