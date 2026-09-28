# Backend API — AI-Driven Scheme Matcher (SIH 2026 PS 26092)

## 📌 Architecture
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL (with `pgvector` for semantic search) / SQLite fallback
- **Authentication:** Unified single login with phone OTP & Supabase JWT support
- **Core Engines:**
  - `EligibilityEngine`: Pure deterministic rule evaluation against statutory NSFDC guidelines
  - `ConfidenceEngine`: Dynamic confidence scoring (`HIGH` vs `MEDIUM` with unverified rules tracking)
  - `RankingEngine`: Optimal scheme matching and sorting
  - `PartnerRoutingEngine`: Geo-spatial distance computation (Haversine) with NPA eligibility safety

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Seed Database
```bash
python scripts/seed_database.py
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger Documentation available at:
👉 `http://localhost:8000/docs`

### 4. Run Unit Tests
```bash
pytest tests/
```
