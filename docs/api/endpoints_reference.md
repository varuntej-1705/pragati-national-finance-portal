# API Endpoints Reference
**Base URL:** `/api/v1`

## 1. Authentication
- `POST /auth/otp/request` — Send OTP to citizen phone number
- `POST /auth/otp/verify` — Verify OTP and receive JWT with assigned role
- `POST /auth/guest` — Generate zero-login guest session for immediate eligibility check

## 2. Smart Scheme Recommender
- `POST /match/` — Evaluate statutory rules, compute confidence (`HIGH` / `MEDIUM`), rank matches, and generate plain-language explanations
- `GET /schemes/` — List all active NSFDC schemes
- `GET /schemes/{id}` — Fetch specific scheme details, rules, and documents

## 3. Dynamic Financial Calculator
- `POST /calculator/calculate` — Live-recomputing EMI, moratorium interest, yearly amortization schedule, and comparison with commercial bank loans

## 4. Geo-Spatial Partner Locator & Router
- `GET /partners/` — List active channel partners filtered by district/state
- `POST /partners/locate` — Find nearest eligible channel partners filtered by coordinates, distance, scheme capability, and NPA standing flag

## 5. Administration & Back-Office
- `GET /admin/overview` — High-level platform KPIs, beneficiary counts, and sanctions
- `GET /admin/partners` — Complete channel partner registry with NPA status control
- `GET /admin/schemes` — Scheme rule catalogue and sync indicators
