import { db } from "./db";
import { deliveryTargets } from "../shared/schema";

const targets = [
  { type: "page", key: "dashboard", name: "Dashboard", description: "Main dashboard with squad health check and issues" },
  { type: "page", key: "squad", name: "Squad", description: "Squad management with list and pitch views" },
  { type: "page", key: "player-search", name: "Player Search", description: "Search engine for finding players" },
  { type: "page", key: "shortlists", name: "Shortlists", description: "Shortlist management and pipeline tracking" },
  { type: "page", key: "player-profile", name: "Player Profile", description: "Detailed player profile view" },
  { type: "page", key: "player-visualizer", name: "Player Visualizer", description: "GameScope radial metrics visualization" },
  { type: "page", key: "player-swipe", name: "Player Swipe", description: "Dating app style player comparison" },
  
  { type: "widget", key: "ai-assistant", name: "AI Assistant", description: "Natural language query sidebar widget" },
  { type: "widget", key: "player-panel", name: "Player Panel", description: "Slide-out player details panel" },
  { type: "widget", key: "feedback-system", name: "Feedback System", description: "Issue/requirement tracking system" },
  { type: "widget", key: "shortlist-panel", name: "Shortlist Panel", description: "Slide-out shortlist details panel" },
  { type: "widget", key: "timeline-modal", name: "Timeline Modal", description: "Player activity timeline" },
  { type: "widget", key: "pitch-view", name: "Pitch View", description: "Interactive formation pitch display" },
  { type: "widget", key: "whatsapp-panel", name: "WhatsApp Panel", description: "WhatsApp group chat integration" },
  { type: "widget", key: "create-shortlist-modal", name: "Create Shortlist Modal", description: "AI-assisted shortlist creation" },
  { type: "widget", key: "data-sources", name: "Data Sources", description: "Integration with StatsBomb, Impect, etc." },
  
  { type: "widget", key: "squad-health-check", name: "Squad Health Check", description: "Proactive risk detection across your squad" },
  { type: "widget", key: "issue-filter", name: "Issue Filter", description: "Filter issues by Critical, Moderate, Resolved, Snoozed" },
  { type: "widget", key: "issue-cards", name: "Issue Cards", description: "Individual issue cards with recommendations and actions" },
  { type: "widget", key: "squad-list", name: "Squad List", description: "Tabular view of all squad players" },
  { type: "widget", key: "search-filters", name: "Search Filters", description: "Position, age, and attribute filters" },
  { type: "widget", key: "search-results", name: "Search Results", description: "Player search results grid" },
  { type: "widget", key: "shortlist-cards", name: "Shortlist Cards", description: "Overview of all active shortlists" },
];

async function seedTargets() {
  console.log("Seeding delivery targets...");
  
  for (const target of targets) {
    try {
      await db.insert(deliveryTargets).values(target).onConflictDoNothing();
      console.log(`Added: ${target.name} (${target.type})`);
    } catch (error) {
      console.log(`Skipped (already exists): ${target.name}`);
    }
  }
  
  console.log("Delivery targets seeding complete!");
  process.exit(0);
}

seedTargets().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
