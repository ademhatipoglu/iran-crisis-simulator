# Iran Crisis Escalation Simulator
### Interactive Geopolitical Scenario Analysis Platform

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)
![Built with Claude Code](https://img.shields.io/badge/Built_with-Claude_Code-D97706?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat)

> **Live Demo:** [iran-crisis-simulator.vercel.app](#) *(replace with your deployed URL)*

---

![Dashboard Screenshot](docs/screenshot-placeholder.png)
*Dashboard showing the escalation meter, interactive Leaflet map with strategic asset markers, and the six-phase decision tree interface*

---

## Overview

The **Iran Crisis Escalation Simulator** is a browser-based geopolitical scenario modeling tool designed for policy analysis, academic research, and strategic studies education. It models the decision landscape surrounding an Iranian nuclear breakout scenario — one of the most consequential foreign policy challenges of the current decade — using a structured six-phase decision tree, real-time metric dashboards, and an interactive map of strategic assets across the Middle East.

The application simulates how sequential policy decisions by the US, Israel, and international actors cascade into measurable outcomes: escalation intensity, estimated casualties, oil price shocks, regional stability degradation, and humanitarian impact. Each decision node is informed by real strategic context drawn from open-source defense research, with probability weightings reflecting historical base rates from analogous crisis scenarios.

This tool was developed as a portfolio demonstration for think tank and policy research roles, modeled on the scenario planning methodologies used by organizations such as HCSS, RAND Corporation, the International Crisis Group, and the Center for Strategic and International Studies.

---

## Key Capabilities

- **Multi-phase interactive scenario engine** — Navigate a six-phase decision tree from initial nuclear breakout warning through to one of seven distinct terminal outcomes, each with full consequence modeling
- **Live geographic map** — Leaflet-powered dark-theme map showing 28+ strategic military assets at real coordinates, with clickable markers, asset-type filtering, and shipping lane overlays
- **Real-time escalation dashboard** — Six-metric live dashboard tracking escalation index, casualties, oil price, regional stability, international involvement, and humanitarian crisis index — with trajectory charts
- **Intelligence-grade situation room** — WATCHCON alert status, proxy force activity tracker, and urgency-sorted situation report feed
- **Outcome analysis suite** — Terminal metrics grid, analyst verdict quotes, event timeline, scenario comparison charts, and exportable text report
- **Breaking news feed** — Curated headlines panel with urgency tiers, category filters, and simulation alert injection

---

## Features

### Interactive Geographic Map
- Real Leaflet map with **CartoDB Dark Matter** tile layer — professional dark military aesthetic
- **28 strategic asset markers** at verified open-source coordinates:
  - Iranian nuclear sites: Natanz, Fordow, Arak, Isfahan, Parchin
  - IRGC facilities: Aerospace HQ, Imam Ali Missile Base, Khorramabad, Shahroud Space Center
  - Iranian naval: Bandar Abbas, Jask Naval Base
  - US forward bases: Al Udeid (Qatar), NSA Bahrain 5th Fleet, Al Dhafra (UAE), Camp Arifjan (Kuwait), Al Asad (Iraq), Erbil, Diego Garcia
  - Israeli positions: Kirya HQ, Nevatim Air Base, Hatzerim, Dimona, Palmachim
  - Critical chokepoints: Strait of Hormuz, Bab el-Mandeb
  - Oil infrastructure: Ras Tanura, Abqaiq, Kharg Island
- Custom icon system — color-coded by country affiliation, sized by strategic significance, with pulsing indicator on critical-tier assets
- Rich **popup cards** showing asset name, type, description, capabilities list, personnel estimates, and coordinates
- **Shipping lane polylines** with barrel-per-day labels for Hormuz, Gulf, and Bab el-Mandeb routes
- Filter toolbar: filter by country (Iran / USA / Israel / Neutral) or asset type (nuclear / missile / airbase / naval / oil / IRGC / chokepoint)

### Decision Tree Scenario Engine
- **Six-phase narrative arc** beginning with a CRITIC-level intelligence assessment: *"Iranian nuclear breakout within 72 hours"*
- **30+ scenario nodes** spanning: covert sabotage, emergency diplomacy, sanctions surge, limited military strikes, proxy war management, nuclear Iran containment, Chinese mediation, and full-scale regional war
- Each decision card displays:
  - Decision type badge (Diplomatic / Covert / Sanctions / Limited Military / Escalation / De-escalation)
  - Historical probability weighting (%) based on analogous crisis base rates
  - Up to two immediate consequences with severity and category tagging
  - Impact delta badges for all six simulation metrics
  - Expert analysis quote attributed to named specialists
  - Breaking news alert generated on selection
- Intelligence brief panel on each node (amber-styled, classified-document aesthetic)
- Breadcrumb decision history trail
- **Seven terminal outcomes**: Diplomatic Resolution, Frozen Conflict, Limited Conflict, Full-Scale War, Nuclear Iran Containment, Chinese Mediation Accord, Prolonged Pressure Campaign

### Escalation Dashboard
- Segmented 10-point escalation bar with per-segment color gradient (green → yellow → orange → red) and glow effects
- DEFCON analog (1–5) derived from escalation level, displayed in header
- Six live metric cards with trend indicators
- Area chart showing escalation and stability trajectory across the full decision history
- Six-phase progress indicator with descriptive phase labels

### Situation Room
- **WATCHCON alert status** (IV through I + EMCON ALPHA) mapped to escalation level
- Live indicators: Strait of Hormuz traffic status, Brent crude trend, Iranian enrichment percentage
- Urgency-sorted situation report feed (CRITIC → FLASH → PRIORITY → ROUTINE)
- Dynamic **proxy force activity table** — Hezbollah, Hamas, Houthis, PMF Iraq — with status badges that escalate as simulation progresses

### News Feed
- 12 curated sample headlines with realistic source attribution (Reuters, AP, FT, Al Jazeera, Haaretz, BBC, CSIS, Foreign Affairs)
- Four urgency tiers: BREAKING (red) → IMPORTANT (orange) → UPDATE (yellow) → ANALYSIS (blue)
- Filter by urgency and by category (nuclear / military / diplomatic / economic / intelligence)
- Click-to-expand reveals summary paragraph and external article link
- Simulation breaking news injected at top in real-time as decisions are made

### Military Force Comparison
- Tabbed comparison panel for Iran, Israel, and USA
- Active personnel, naval vessels, aircraft, nuclear warheads, defense spending
- Key capabilities and strategic vulnerabilities per actor
- Data sourced from IISS Military Balance and SIPRI

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm 9+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/USERNAME/iran-crisis-dashboard.git
cd iran-crisis-dashboard/iran-crisis-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build

```bash
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

No API keys or environment variables are required. The map uses free CartoDB/OpenStreetMap tiles. The news feed uses static sample data.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 19 | Component-based UI with hooks |
| Language | TypeScript | 5.x | Full type safety across all interfaces |
| Build Tool | Vite | 8.x | Fast HMR development, production bundler |
| Styling | Tailwind CSS | 4.x | Utility-first dark theme via `@tailwindcss/vite` |
| Mapping | Leaflet + react-leaflet | 1.9 / 4.x | Interactive geographic map, custom div icons |
| Tile Layer | CartoDB Dark Matter | — | Free dark map tiles via OpenStreetMap |
| Charts | Recharts | 2.x | Area, bar, and radar charts for metrics |
| AI Development | Claude Code | — | Architecture, components, data modeling |

---

## Project Structure

```
iran-crisis-app/
├── public/                     # Static assets
├── src/
│   ├── types/
│   │   └── index.ts            # All TypeScript interfaces:
│   │                           #   Location, MilitaryForce, ShippingLane,
│   │                           #   Decision, ScenarioNode, TerminalOutcome,
│   │                           #   SimulationState, SituationUpdate, TickerItem
│   │
│   ├── data/
│   │   ├── militaryData.ts     # 28 strategic locations (coordinates,
│   │   │                       #   capabilities, significance ratings),
│   │   │                       #   shipping lane routes, force data
│   │   └── scenarios.ts        # Full decision tree (~30 nodes),
│   │                           #   7 terminal outcomes, situation updates,
│   │                           #   ticker items, comparison scenarios,
│   │                           #   initial simulation state
│   │
│   ├── components/
│   │   ├── Map.tsx             # Leaflet map — tiles, markers, popups, lanes
│   │   ├── DecisionTree.tsx    # Scenario node renderer with intel briefs
│   │   ├── ScenarioCard.tsx    # Individual decision option card
│   │   ├── EscalationMeter.tsx # Escalation bar, metric cards, trajectory chart
│   │   ├── OutcomePanel.tsx    # Terminal outcome display + comparison charts
│   │   ├── MilitaryForces.tsx  # Tabbed force comparison panel
│   │   ├── SituationRoom.tsx   # Alert level, sitrep feed, proxy activity
│   │   ├── NewsTicker.tsx      # Scrolling breaking news ticker (header)
│   │   └── NewsPanel.tsx       # Full news feed with filters and expand
│   │
│   ├── App.tsx                 # Root layout, simulation state machine,
│   │                           #   tab navigation, decision handler
│   ├── App.css                 # Component-level styles
│   └── index.css               # Tailwind v4 entry (@import "tailwindcss")
│
├── index.html
├── vite.config.ts              # Vite + Tailwind CSS v4 plugin config
├── tsconfig.json
└── package.json
```

---

## Data Sources

All data is derived from open-source public research and is used for **educational and simulation purposes only**.

| Source | Usage |
|---|---|
| **IISS Military Balance 2024** | Force structure, personnel counts, equipment inventories |
| **SIPRI Arms Transfers Database** | Weapons system capabilities and delivery ranges |
| **IAEA Safeguards Reports** | Enrichment levels, centrifuge counts, facility descriptions |
| **Congressional Research Service (CRS)** | US force posture in the Gulf region |
| **Open Nuclear Network / Planet Labs** | Facility coordinates and satellite-derived facility details |
| **CSIS Missile Defense Project** | Iranian ballistic missile capabilities and ranges |
| **NTI Nuclear Security Index** | Proliferation risk assessments |
| **Crisis Group / ICG Reporting** | Proxy force structures and escalation dynamics |

> **Note:** Coordinates are approximate open-source estimates. Capabilities and personnel figures reflect publicly available assessments and should not be treated as authoritative intelligence. This tool is for **educational scenario modeling only**.

---

## Usage Guide

### Running a Scenario

1. **Read the intelligence brief** at the top of each node — it provides the strategic context for the decision at hand
2. **Review the decision cards** — each shows the decision type, historical probability, immediate consequences, and metric impact deltas
3. **Select a decision** — all six metrics update in real-time; a breaking news alert may appear
4. **Monitor the dashboard** — watch how escalation, stability, oil price, and humanitarian metrics respond
5. **Reach a terminal outcome** — after 3–5 decisions the simulation resolves into one of seven assessed outcomes

### Interpreting the Metrics

| Metric | What It Measures | Danger Threshold |
|---|---|---|
| **Escalation Index (1–10)** | Conflict intensity | > 7 = active hostilities |
| **Estimated Casualties** | Combined military and civilian fatalities | Pathway-dependent |
| **Oil Price (Brent)** | Spot price crisis premium | > $120 = economic shock |
| **Regional Stability (0–100)** | Composite stability index | < 30 = critical instability |
| **Intl. Involvement (0–100)** | Great power and coalition engagement | > 70 = proxy war risk |
| **Humanitarian Crisis (0–100)** | Displacement and civilian harm index | > 50 = mass displacement |

### Decision Types

| Type | Typical Effect |
|---|---|
| **Diplomatic Track** | Reduces escalation; may not resolve core proliferation issue |
| **Covert Action** | Medium risk; buys time without overt escalation |
| **Economic Pressure** | Slow effect; risks economic retaliation and civilian harm |
| **Limited Military** | High escalation risk; tactical gains possible |
| **Escalation** | Rapid escalation; severe humanitarian and economic impact |
| **De-escalation** | Reduces tension; may be read as strategic weakness |

### Exporting Results

When the simulation reaches a terminal state, click **Export Report** in the Outcome Analysis panel to download a plain-text policy brief summarizing your decision path, final metrics, key consequences, and recommendations.

---

## Methodology

### Scenario Modeling Approach

The decision tree is structured as a directed acyclic graph of scenario nodes. The model draws on:

- **Crisis simulation methodology** as practiced by RAND, HCSS, and the Brookings Institution in structured scenario exercises
- **Historical base rates** from analogous nuclear crises: Cuban Missile Crisis (1962), North Korea Agreed Framework (1994), Libya nuclear rollback (2003), JCPOA negotiations (2013–2015)
- **Metric delta modeling** — each decision applies calibrated changes to six independent metrics rather than binary branching, enabling more granular outcome differentiation
- **Expert consensus synthesis** — probability weightings draw on published analysis from the Arms Control Association, CSIS, Carnegie Endowment for International Peace, and peer-reviewed academic literature

### Assumptions and Limitations

This is a **simplified pedagogical model**, not an operational forecast. Key limitations:

- The decision tree captures major strategic pathways but cannot model the full complexity of interstate crisis bargaining
- Metric deltas are calibrated estimates, not statistically derived predictions
- Actors are modeled as stylized decision-makers, not agent-based models with full domestic political constraints
- The model does not account for intelligence uncertainty, misperception dynamics, or second-order alliance effects beyond what is noted in scenario text
- News headlines and situation reports are **illustrative sample data**

### Academic Context

Iran's nuclear program is one of the most extensively studied proliferation challenges in the academic literature. Key frameworks informing this simulation include Schelling's coercive bargaining theory (*Arms and Influence*, 1966), Fearon's rationalist explanations for war, Sagan's organizational factors in nuclear crises, and contemporary work by Vipin Narang, Suzanne Maloney, and Amos Yadlin on Iranian strategic culture and red lines.

---

## Future Enhancements

- [ ] **Real-time RSS/API news integration** — Live Reuters, AP, and Al Jazeera feeds filtered for Iran/nuclear keywords
- [ ] **Historical scenario comparison** — Load pre-run traces (e.g., "2015 JCPOA pathway") as overlays
- [ ] **PDF report export** — Formatted policy brief with embedded charts
- [ ] **ML outcome calibration** — Refine probability weightings using published conflict datasets
- [ ] **Multi-actor perspective mode** — View scenario from Iran, Israel, or Russia's decision calculus
- [ ] **Multiplayer collaborative mode** — Assign decision authority to different participants for live tabletop exercises
- [ ] **Python analytics backend** — FastAPI + pandas pipeline for batch scenario analysis and sensitivity testing
- [ ] **Multi-language support** — Arabic, Hebrew, Farsi, French interfaces for international use
- [ ] **Timeline scrubbing** — Rewind to any past decision point and branch to a new path
- [ ] **Satellite imagery integration** — Sentinel Hub tiles for facility-level zoom at nuclear sites

---

## Contributing

Contributions are welcome, particularly from researchers in strategic studies, Middle East policy, or data visualization.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/improved-scenario-modeling`
3. Make focused, well-documented commits
4. Ensure the build passes: `npm run build`
5. Open a pull request with a description of the change and its analytical rationale

### Valuable Contribution Areas

- **Scenario accuracy review** — Corrections to capability descriptions, coordinates, or force structure data from subject matter experts
- **Additional decision branches** — New pathways (e.g., Israeli unilateral strike, Gulf state intervention)
- **Data citations** — Adding precise source citations to facility descriptions and capability assessments
- **Accessibility** — Keyboard navigation, screen reader support, color-blind-friendly palette options

### Code of Conduct

This project models a sensitive real-world security situation for educational purposes. All contributions must maintain an analytical, non-partisan framing. Content that presents any actor as uniformly villainous or heroic, advocates for specific policy outcomes, or could reasonably be misread as operational guidance will not be merged.

---

## License

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## Acknowledgments

- **[Claude Code](https://claude.ai/code)** (Anthropic) — AI-assisted development used throughout for architecture, TypeScript design, scenario data modeling, and component implementation
- **[CARTO](https://carto.com/)** — CartoDB Dark Matter tiles
- **[OpenStreetMap contributors](https://www.openstreetmap.org/copyright)** — Underlying geographic data
- **[Recharts](https://recharts.org/)** — Chart components
- **[Leaflet](https://leafletjs.com/)** — Interactive mapping library
- **[HCSS — The Hague Centre for Strategic Studies](https://hcss.nl/)** — Inspiration for scenario planning methodology and professional policy tool design
- **IISS, SIPRI, Arms Control Association, CSIS** — Public research and open-source data informing scenario calibration

---

## Contact

**Repository:** [github.com/USERNAME/iran-crisis-dashboard](#) *(replace with your GitHub URL)*

**Email:** your.email@example.com

**LinkedIn:** linkedin.com/in/yourprofile

---

> *This project is an independent academic exercise. It is not affiliated with, endorsed by, or connected to any government, intelligence agency, or policy organization. All scenario data is derived from publicly available open-source research. For educational and portfolio demonstration purposes only.*
