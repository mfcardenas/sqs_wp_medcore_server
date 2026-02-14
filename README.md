# 🏥 MedCore Hospital Simulator Server

**MedCore Hospital Simulator** is an educational serious game designed to teach **Software Engineering ISO Standards** (ISO 29148, ISO 25010, ISO 12207, ISO 9241, ISO 27001, ISO 13485) through a simulated hospital management project.

Students take the role of a project manager and make real software engineering decisions while managing budgets, timelines, stakeholder satisfaction, and 8 ISO quality metrics.

This repository contains the **dedicated server** version with **Node.js/Express** backend and **PostgreSQL** persistence to track student progress, decisions, and outcomes.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser (HTML5 SPA)                            │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ persistence  │→│ medcore-enhanced-game.html│  │
│  │ .js          │  │ (ES / EN versions)       │  │
│  └──────┬──────┘  └──────────────────────────┘  │
│         │ fetch()                                │
├─────────┼───────────────────────────────────────┤
│  Express│Server (server.js) — port 3004         │
│  ┌──────┴──────┐                                │
│  │ REST API    │                                │
│  │ /api/players│                                │
│  │ /api/attempts│                               │
│  │ /api/leaderboard                             │
│  └──────┬──────┘                                │
├─────────┼───────────────────────────────────────┤
│  PostgreSQL                                     │
│  ┌──────┴───────────────────────────────────┐   │
│  │ users → game_profiles → game_attempts    │   │
│  │         (GameKey: MEDCORE_HOSPITAL)       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript
    -   `index.html` — Language selection (🇪🇸 / 🇬🇧)
    -   `medcore-enhanced-game.html` — Spanish version
    -   `medcore-enhanced-game-en.html` — English version
    -   `persistence.js` — Registration modal, badge, logout, API calls
-   **Backend**: Node.js + Express (`server.js`)
-   **Database**: PostgreSQL with tables `users`, `game_profiles`, `game_attempts`

---

## 🚀 Setup & Installation

### Prerequisites
-   **Node.js** (v16+)
-   **PostgreSQL** (v13+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env.local` in the project root:
```env
PORT=3004
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name
```

### 3. Database Initialization
Register the `MEDCORE_HOSPITAL` GameKey in PostgreSQL:
```bash
node db/init_game_key.js
```

---

## 🏃 Running the Server

```bash
# Production
npm start

# Development (auto-reload with nodemon)
npm run dev
```

The server starts at **http://localhost:3004**.

---

## 📂 Project Structure

```
sqs_wp_medcore_server/
├── db/
│   ├── index.js               # PostgreSQL connection pool
│   └── init_game_key.js       # Registers MEDCORE_HOSPITAL GameKey
├── index.html                 # Landing page (language selection)
├── medcore-enhanced-game.html # Game (Spanish)
├── medcore-enhanced-game-en.html # Game (English)
├── medcore-enhanced-styles.css   # Styles (Spanish)
├── medcore-enhanced-styles-en.css # Styles (English)
├── persistence.js             # Client-side persistence (registration, API calls)
├── server.js                  # Express server + REST API
├── package.json
├── .env.local                 # Environment variables (not committed)
└── README.md
```

---

## 🔌 API Reference

### POST `/api/players` — Register Player
```json
// Request
{ "nickname": "Student1", "university": "UFV Madrid" }

// Response
{ "ok": true, "userId": "uuid", "profileId": "uuid" }
```

### POST `/api/attempts` — Start Game Session
```json
// Request
{
  "userId": "uuid",
  "scenarioId": "medcore_es",
  "scenarioTitle": "MedCore Hospital (ES)",
  "nickname": "Student1",
  "university": "UFV Madrid"
}

// Response
{ "ok": true, "attemptId": "uuid" }
```

### PUT `/api/attempts/:id` — Complete Game Session
```json
// Request
{
  "score": 85,
  "maxScore": 100,
  "correctCount": 8,
  "incorrectCount": 0,
  "durationMs": 720000,
  "metadata": {
    "assessmentLevel": "ÓPTIMO",
    "assessmentSummary": "...",
    "projectStatus": "...",
    "recommendation": "...",
    "metrics": {
      "functionality": 90, "usability": 75,
      "security": 85, "performance": 70,
      "reliability": 80, "efficiency": 72,
      "maintainability": 68, "portability": 60
    },
    "metricsAverage": 75.0,
    "stakeholders": { "maria": 80, "carlos": 75, "ana": 70 },
    "stakeholderAverage": 75.0,
    "initialBudget": 2500000,
    "finalBudget": 1200000,
    "budgetSpent": 1300000,
    "budgetEfficiency": 48.0,
    "initialTime": 18,
    "finalTimeRemaining": 8,
    "timeUsed": 10,
    "timeEfficiency": 44.44,
    "scoreBreakdown": {
      "metricsComponent": 30.0,
      "stakeholderComponent": 22.5,
      "budgetComponent": 7.2,
      "timeComponent": 6.67,
      "decisionsBonus": 16
    },
    "selectedRequirements": ["patient_mgmt", "clinical_history", "..."],
    "totalRequirementsSelected": 6,
    "decisionsHistory": [
      { "phase": 1, "decision": "req_approach", "option": "agile_hybrid", "impact": {...} }
    ],
    "totalDecisions": 8,
    "currentPhase": 4,
    "totalPhases": 4,
    "completionDate": "2026-02-14T04:30:00.000Z",
    "durationMinutes": 12,
    "language": "es",
    "version": "enhanced"
  }
}

// Response
{ "ok": true }
```

### GET `/api/leaderboard` — Top Scores
```json
// Response
{
  "ok": true,
  "leaderboard": [
    { "nickname": "Student1", "university": "UFV", "score": 85, "scenario": "MedCore Hospital (ES)" }
  ]
}
```

---

## 💾 Database Schema

| Table           | Description                            |
| --------------- | -------------------------------------- |
| `users`         | Unique identity per student            |
| `game_profiles` | Nickname + University linked to a user |
| `game_attempts` | Every game session with full metadata  |

### `game_attempts` Key Columns:
| Column                | Type      | Description                                  |
| --------------------- | --------- | -------------------------------------------- |
| `id`                  | UUID      | Attempt identifier                           |
| `user_id`             | UUID      | FK to `users`                                |
| `game_key`            | Enum      | `'MEDCORE_HOSPITAL'`                         |
| `status`              | Text      | `'STARTED'` → `'COMPLETED'`                  |
| `score`               | Integer   | Final calculated score (0–100+)              |
| `max_score`           | Integer   | Maximum possible score (100)                 |
| `correct_count`       | Integer   | Number of decisions made                     |
| `duration_ms`         | Integer   | Session duration in milliseconds             |
| `nickname_snapshot`   | Text      | Nickname at time of play                     |
| `university_snapshot` | Text      | University at time of play                   |
| `metadata`            | JSONB     | Full game state (see metadata section below) |
| `started_at`          | Timestamp | When the game started                        |
| `completed_at`        | Timestamp | When the game completed                      |

### Metadata JSONB Structure

The `metadata` column stores comprehensive game data:

```
metadata
├── assessmentLevel        # "ÓPTIMO" | "ACEPTABLE" | "CRÍTICO"
├── assessmentSummary      # Final assessment text
├── projectStatus          # Project status description
├── recommendation         # Recommended next steps
├── metrics                # All 8 ISO 25010 quality attributes
│   ├── functionality      # 0-100
│   ├── usability          # 0-100
│   ├── security           # 0-100
│   ├── performance        # 0-100
│   ├── reliability        # 0-100
│   ├── efficiency         # 0-100
│   ├── maintainability    # 0-100
│   └── portability        # 0-100
├── metricsAverage         # Average of all 8 metrics
├── stakeholders
│   ├── maria              # Satisfaction 0-100 (Medical Director)
│   ├── carlos             # Satisfaction 0-100 (IT Director)
│   └── ana                # Satisfaction 0-100 (Operations Manager)
├── stakeholderAverage     # Average stakeholder satisfaction
├── initialBudget          # €2,500,000
├── finalBudget            # Remaining budget
├── budgetSpent            # Money spent
├── budgetEfficiency       # % of budget remaining
├── initialTime            # 18 months
├── finalTimeRemaining     # Months remaining
├── timeUsed               # Months consumed
├── timeEfficiency         # % of time remaining
├── scoreBreakdown
│   ├── metricsComponent   # 40% weight
│   ├── stakeholderComponent # 30% weight
│   ├── budgetComponent    # 15% weight
│   ├── timeComponent      # 15% weight
│   └── decisionsBonus     # Up to +20 bonus
├── selectedRequirements[] # Array of requirement IDs selected
├── totalRequirementsSelected
├── decisionsHistory[]     # Full decision log
│   ├── phase              # Phase number (1-4)
│   ├── decision           # Decision ID
│   ├── option             # Option chosen
│   ├── timestamp          # When decided
│   └── impact             # Metric impacts {key: value}
├── totalDecisions
├── currentPhase           # Phase reached (1-4)
├── totalPhases            # Always 4
├── completionDate         # ISO timestamp
├── durationMinutes        # Session length in minutes
├── language               # "es" | "en"
└── version                # "enhanced"
```

---

## 📊 SQL Queries for Session Analysis

### Basic Queries

#### All completed sessions
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.university_snapshot AS university,
    ga.score,
    ga.duration_ms / 60000 AS duration_minutes,
    ga.started_at,
    ga.completed_at
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY ga.completed_at DESC;
```

#### Leaderboard by score
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.university_snapshot AS university,
    ga.score,
    ga.metadata->>'assessmentLevel' AS assessment,
    ga.metadata->>'durationMinutes' AS minutes_played
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY ga.score DESC
LIMIT 20;
```

### ISO Metrics Analysis

#### Average ISO 25010 metrics across all students
```sql
SELECT
    ROUND(AVG((ga.metadata->'metrics'->>'functionality')::numeric), 1) AS avg_functionality,
    ROUND(AVG((ga.metadata->'metrics'->>'usability')::numeric), 1) AS avg_usability,
    ROUND(AVG((ga.metadata->'metrics'->>'security')::numeric), 1) AS avg_security,
    ROUND(AVG((ga.metadata->'metrics'->>'performance')::numeric), 1) AS avg_performance,
    ROUND(AVG((ga.metadata->'metrics'->>'reliability')::numeric), 1) AS avg_reliability,
    ROUND(AVG((ga.metadata->'metrics'->>'efficiency')::numeric), 1) AS avg_efficiency,
    ROUND(AVG((ga.metadata->'metrics'->>'maintainability')::numeric), 1) AS avg_maintainability,
    ROUND(AVG((ga.metadata->'metrics'->>'portability')::numeric), 1) AS avg_portability,
    ROUND(AVG((ga.metadata->>'metricsAverage')::numeric), 1) AS avg_overall
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED';
```

#### Individual student metrics breakdown
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.score,
    ga.metadata->'metrics'->>'functionality' AS functionality,
    ga.metadata->'metrics'->>'usability' AS usability,
    ga.metadata->'metrics'->>'security' AS security,
    ga.metadata->'metrics'->>'performance' AS performance,
    ga.metadata->'metrics'->>'reliability' AS reliability,
    ga.metadata->'metrics'->>'efficiency' AS efficiency,
    ga.metadata->'metrics'->>'maintainability' AS maintainability,
    ga.metadata->'metrics'->>'portability' AS portability
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY ga.score DESC;
```

### Stakeholder Satisfaction

#### Average stakeholder satisfaction
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.score,
    (ga.metadata->'stakeholders'->>'maria')::int AS maria_satisfaction,
    (ga.metadata->'stakeholders'->>'carlos')::int AS carlos_satisfaction,
    (ga.metadata->'stakeholders'->>'ana')::int AS ana_satisfaction,
    ROUND((ga.metadata->>'stakeholderAverage')::numeric, 1) AS avg_satisfaction
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY avg_satisfaction DESC;
```

### Budget & Time Management

#### Budget efficiency analysis
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.score,
    (ga.metadata->>'initialBudget')::int AS initial_budget,
    (ga.metadata->>'finalBudget')::int AS final_budget,
    (ga.metadata->>'budgetSpent')::int AS budget_spent,
    ROUND((ga.metadata->>'budgetEfficiency')::numeric, 1) AS budget_efficiency_pct,
    (ga.metadata->>'timeUsed')::int AS months_used,
    (ga.metadata->>'finalTimeRemaining')::int AS months_remaining
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY budget_efficiency_pct DESC;
```

### Decision Analysis

#### Number of decisions per student
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.score,
    (ga.metadata->>'totalDecisions')::int AS decisions_made,
    (ga.metadata->>'totalRequirementsSelected')::int AS requirements_selected,
    ga.metadata->>'assessmentLevel' AS assessment
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY ga.score DESC;
```

#### Full decision history for a specific student
```sql
SELECT
    ga.nickname_snapshot AS student,
    decision->>'phase' AS phase,
    decision->>'decision' AS decision_id,
    decision->>'option' AS option_chosen,
    decision->>'timestamp' AS decided_at
FROM game_attempts ga,
     jsonb_array_elements(ga.metadata->'decisionsHistory') AS decision
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
  AND ga.nickname_snapshot = 'Student1'
ORDER BY (decision->>'phase')::int;
```

### Score Breakdown

#### Score component analysis
```sql
SELECT
    ga.nickname_snapshot AS student,
    ga.score AS total_score,
    ROUND((ga.metadata->'scoreBreakdown'->>'metricsComponent')::numeric, 1) AS metrics_40pct,
    ROUND((ga.metadata->'scoreBreakdown'->>'stakeholderComponent')::numeric, 1) AS stakeholder_30pct,
    ROUND((ga.metadata->'scoreBreakdown'->>'budgetComponent')::numeric, 1) AS budget_15pct,
    ROUND((ga.metadata->'scoreBreakdown'->>'timeComponent')::numeric, 1) AS time_15pct,
    (ga.metadata->'scoreBreakdown'->>'decisionsBonus')::int AS decisions_bonus
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
ORDER BY ga.score DESC;
```

### University Statistics

#### Aggregate stats by university
```sql
SELECT
    ga.university_snapshot AS university,
    COUNT(*) AS total_sessions,
    ROUND(AVG(ga.score), 1) AS avg_score,
    MAX(ga.score) AS top_score,
    MIN(ga.score) AS lowest_score,
    ROUND(AVG((ga.metadata->>'metricsAverage')::numeric), 1) AS avg_iso_metrics,
    ROUND(AVG((ga.metadata->>'stakeholderAverage')::numeric), 1) AS avg_stakeholder,
    ROUND(AVG((ga.metadata->>'durationMinutes')::numeric), 0) AS avg_duration_min
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
GROUP BY ga.university_snapshot
ORDER BY avg_score DESC;
```

### Assessment Distribution

#### Count of each assessment level
```sql
SELECT
    ga.metadata->>'assessmentLevel' AS assessment_level,
    COUNT(*) AS count,
    ROUND(AVG(ga.score), 1) AS avg_score,
    ROUND(AVG((ga.metadata->>'durationMinutes')::numeric), 0) AS avg_duration
FROM game_attempts ga
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
GROUP BY ga.metadata->>'assessmentLevel'
ORDER BY avg_score DESC;
```

### Requirements Analysis

#### Most selected requirements across all sessions
```sql
SELECT
    req AS requirement_id,
    COUNT(*) AS times_selected
FROM game_attempts ga,
     jsonb_array_elements_text(ga.metadata->'selectedRequirements') AS req
WHERE ga.game_key = 'MEDCORE_HOSPITAL'
  AND ga.status = 'COMPLETED'
GROUP BY req
ORDER BY times_selected DESC;
```

---

## 🎮 Game Flow & Persistence

```
1. Player opens index.html → selects language (ES/EN)
2. persistence.js loads → shows Registration Modal (Nickname + University)
3. Player registers → POST /api/players → stored in DB
4. Game starts (tutorial or skip) → startRealGame()
   → POST /api/attempts → session created (status: STARTED)
5. Player progresses through 4 phases:
   Phase 1: Requirements Analysis (ISO 29148)
   Phase 2: Architecture Design (ISO 25010)
   Phase 3: Development & Testing (ISO 12207)
   Phase 4: Deployment & Maintenance (ISO 27001)
6. Player completes project → completeProject()
   → PUT /api/attempts/:id → session saved (status: COMPLETED)
   → Full metadata: metrics, stakeholders, decisions, budget, time, score
```

---

## 📜 ISO Standards Covered

| Standard      | Phase      | Application                              |
| ------------- | ---------- | ---------------------------------------- |
| **ISO 29148** | Phase 1    | Requirements Engineering                 |
| **ISO 25010** | All phases | 8 Quality Attributes (metrics dashboard) |
| **ISO 12207** | Phase 3    | Software Life Cycle Processes            |
| **ISO 9241**  | All phases | Human-System Interaction (stakeholders)  |
| **ISO 27001** | Phase 4    | Information Security Management          |
| **ISO 13485** | Phase 4    | Medical Device Quality Management        |

---

## 🔧 Troubleshooting

| Problem                           | Solution                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| Registration modal doesn't appear | Clear `localStorage` key `iso9241QuestPlayer` in browser DevTools                      |
| Data not stored in DB             | Check server logs; verify `persistence.js` is loaded (`<script src="persistence.js">`) |
| Server won't start                | Verify `.env.local` has correct `DATABASE_URL` and run `node db/init_game_key.js`      |
| Port conflict                     | Change `PORT` in `.env.local` and update `API_BASE` in `persistence.js`                |
