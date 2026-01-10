import { db } from "./db";
import { issues } from "../shared/schema";

const requirements = [
  {
    type: "requirement",
    title: "1. Personal landing pages",
    description: "Custom widgets, shortlisted players, reminders (performance alerts), selected player tracking, to do list (actions).",
    screen: "dashboard",
    status: "new",
    priority: "medium",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: "Personalised 'interesting players' built off your personal preference.",
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "2. Current Squad View (including Academy/Loan options)",
    description: "Player current squad status, ai recommendations/alerts, replacement options, contextual information ie contracts.",
    screen: "squad",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: "What if analysis?",
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "3. Player Rankings",
    description: "Flexible index rankings with live interaction (fixed on NUFC preferred index weighting but allow parameter customisation if scouting rationale changes in window). High to low level (Ability to drill down from theme to specific metric to game by game). Flexible filtering (to change sample on mutes played? position groups?). Different visualisations options (Bar/Radar) Different Analysis (Percentile v Distributions) Different Metric options (add/remove metrics on fly).",
    screen: "squad",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: "Ability to flip metrics from event counts to EPV.",
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "4. Player Profiling",
    description: "Key metric or profile search engine (ability to query context ie player value less than £, custom metrics selection, or use data science workflows, ie positional type attacking fullback).",
    screen: "squad",
    status: "new",
    priority: "medium",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: "Other player considerations from our similarity model.",
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "5. Player Search Engine",
    description: "Key metric or profile search engine (ability to query context ie player value less than £, custom metrics selection, or use data science workflows, ie positional type attacking fullback).",
    screen: "squad",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "6. Player Target Comparison",
    description: "Ability to compare targets quickly & give recommendations.",
    screen: "shortlists",
    status: "new",
    priority: "medium",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: "Dossier Wizard (Customisable for user to extract to PDF)",
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "7. Video Integration on Event level",
    description: "Click through to video examples (lead/lag time)...Save key clips / build playlist (link clips to player profile)",
    screen: "player-profile",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "8. Shortlist Management",
    description: "Push to Scouting, Push to Personal Shortlist, Push to Dept Shortlists (Full audit trial of who moved/when). Full data integration (performance, scouting, context, notes).",
    screen: "shortlists",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "9. AI Assistant",
    description: "Natural language to instant query the database, smart summaries of profiles, or provide recommendations (rolled out across the system)",
    screen: "dashboard",
    status: "new",
    priority: "medium",
    fixBy: "future-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "10. Full synced with our internal data sources across area back to cloud",
    description: "Performance data from 5 providers, scouting data, video integration and data generated in the web app pushed back to cloud.",
    screen: "dashboard",
    status: "new",
    priority: "critical",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "11. Push / Pull to WhatsApp",
    description: "Ability to send profiles, screenshots or alerts to key stakeholder whats apps. Pushing messages to a Magpie bots to pull from whats app.",
    screen: "shortlists",
    status: "new",
    priority: "low",
    fixBy: "future-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "12. Ease to integrate new feature",
    description: "As we scale up internally with metrics / model we need to find a way to allow the seamless integration of this into the web-app. Ie building a Scouting Summary LLM can we host in the web app.",
    screen: "dashboard",
    status: "new",
    priority: "medium",
    fixBy: "future-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
  {
    type: "requirement",
    title: "13. Single Sign On (User Roles)",
    description: "Aligned to club credentials.",
    screen: "dashboard",
    status: "new",
    priority: "high",
    fixBy: "current-release",
    area: "Recruitment",
    ideasToDiscuss: null,
    createdBy: "System",
  },
];

async function seed() {
  console.log("Seeding requirements...");
  
  for (const req of requirements) {
    await db.insert(issues).values(req);
    console.log(`Added: ${req.title}`);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
