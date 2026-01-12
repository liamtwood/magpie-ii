# Product FM - Feature Management App

A standalone feature and requirements management application that can be shared across projects.

## Features

- **Dashboard** - Overview of epics, stories, and domain objects with status stats
- **Feature Management** - Three view modes:
  - **List View** - Table of all issues
  - **Epic View** - Manage epics and their stories
  - **Object View** - Manage domain objects and linked stories
- **Feedback System** - Floating button to submit bugs/requirements
- **Issues Panel** - View and filter all issues

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up database (requires DATABASE_URL environment variable):
   ```bash
   npm run db:push
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Folder Structure

```
src/
├── pages/           # Top-level pages (Dashboard, FeatureManagement)
├── features/        # Feature modules
│   ├── epics/       # Epic components (EpicTable, EpicPanel)
│   ├── stories/     # Story components (StoryModal)
│   ├── objects/     # Object components (ObjectList, ObjectPanel)
│   └── feedback/    # Feedback system (FeedbackButton, IssuesPanel)
├── components/      # Shared UI components (Modal, Badge, Panel)
├── hooks/           # Custom hooks (useIssues, useObjects, useTargets)
├── services/        # API service functions
└── App.jsx          # Main app with navigation

server/
├── index.ts         # Express server setup
├── routes.ts        # API endpoints
├── storage.ts       # Database operations
└── db.ts            # Database connection

shared/
└── schema.ts        # Drizzle database schema
```

## Database Schema

- `issues` - Epics, Stories, Bugs, Requirements
- `objects` - Domain objects (Player, Club, etc.)
- `delivery_targets` - Pages and widgets
- `issue_assignments` - Links issues to targets
