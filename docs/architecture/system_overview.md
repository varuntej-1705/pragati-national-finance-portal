# System Architecture & Layer Overview
**AI-Driven Scheme Matching Platform (SIH 2026 PS 26092)**

## High-Level Topology
```
[ Citizen Mobile App (React Native) ]
[ Admin Web Dashboard (React + Vite) ]  <---> [ FastAPI Gateway (Port 8000) ]
[ Facilitator Dashboard (React + Vite) ]               │
                                                       ├───> [ Eligibility Engine (Deterministic Rules) ]
                                                       ├───> [ Confidence Engine (High/Med/Low) ]
                                                       ├───> [ Financial Calculator (EMI & Moratorium) ]
                                                       ├───> [ Partner Routing Engine (Haversine & NPA filter) ]
                                                       ├───> [ Grounded AI / Explanation Layer ]
                                                       └───> [ PostgreSQL + pgvector / Redis Cache ]
```

## Architectural Separation of Concerns
1. **Frontend Presentation**: `apps/citizen-app`, `apps/admin-dashboard`, `apps/facilitator-dashboard` handle user interactions, state management, and display.
2. **Deterministic Eligibility**: `backend/app/engines/eligibility_engine.py` evaluates statutory rules without LLM dependency.
3. **Grounded AI**: `backend/app/ai/explanation.py` translates rule evaluation into plain-language explanations without hallucinations.
4. **Geo-Spatial Router**: `backend/app/engines/partner_routing_engine.py` strictly excludes NPA-blocked branches and ranks by proximity and fund-utilisation score.
