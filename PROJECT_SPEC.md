# AI-Driven Scheme Matcher (SIH 2026 · PS 26092)
## Master Project Specification & Knowledge Base

**Prepared for:** Varun (Arigonda Varun Teja) — B.Tech AI & Data Science, SIMATS  
**Role:** Senior Full-Stack Engineer & Product Architect  
**Project Repository:** `26091-Matcher` / `PS 26092`  
**Standing Directive:** This document serves as the project spec and knowledge base. All future tasks adhere to these architectural, design, and functional constraints.

---

## 1. Problem Statement & Context

- **PS ID:** 26092 (SIH 2026)
- **Title:** AI-Driven Scheme Matching for Marginalized Entrepreneurs
- **Category / Theme:** Software / Smart Automation / Smart Governance / Digital Empowerment
- **Sponsoring Ministry:** Ministry of Social Justice and Empowerment (MoSJE)
- **Sponsoring Department:** Department of Social Justice and Empowerment
- **Implementing Agency:** National Scheduled Castes Finance and Development Corporation (NSFDC)
- **Target Beneficiaries:** Scheduled Caste (SC) citizens with annual family income up to ₹5.00 Lakhs, eligible for concessional financial assistance & educational loans covering up to 90% of project/course cost at highly concessional interest rates (~6.5% - 8% to 15% p.a.).
- **The Core Problem:**
  - Direct loan applications are **not** entertained by the ministry. Funds are routed strictly through a **Channel Finance System** of 100+ Channel Partners: State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs.
  - Citizens face offline confusion, lack of awareness of loan categories (Micro Finance vs. Term Loan vs. Educational Loans), and misrouted applications.
  - Citizens cannot easily locate authorized channel partners in good standing (e.g. partners not choked with high NPAs/overdues).

---

## 2. The Three Mandatory Core Modules

Every other feature (dashboards, chat, notifications) directly supports these three:

1. **Smart Scheme Recommender**
   - **Inputs:** Project type, estimated cost, annual family income, education status, gender, location/state/district.
   - **Engine:** Deterministic rule filter + pgvector semantic re-rank + plain-language explanation generation.
   - **Outputs:** Ranked matches with confidence labels (`Likely eligible` [green] vs. `Maybe eligible — verify X` [amber]) and explicit "Why You Qualify" breakdown.

2. **Financial Calculator**
   - **Inputs:** Scheme type, project/loan amount, repayment tenure.
   - **Logic:** Honors scheme-specific caps, interest rate bands (6.5% - 15%), and moratorium periods (3 to 12 months).
   - **UI:** Dynamic slider/stepper-driven live EMI recomputation without page reload.

3. **Geo-Spatial Partner Locator & Router**
   - **Inputs:** Citizen location (GPS / pincode / district).
   - **Filter:** Distance + Partner Type (SCA, PSB, RRB, NBFC-MFI) + **Current Fund-Utilisation / NPA Eligibility Status Flag** (prevents routing to non-functional or NPA-choked partners).
   - **UI:** Map on top half + draggable/scrollable bottom sheet of ranked partners with eligibility badges.

---

## 3. Seed Reference Data (NSFDC Schemes)

| Scheme Type | Typical Ceiling | Typical Rate | Moratorium & Features |
| :--- | :--- | :--- | :--- |
| **Micro Finance / Micro Credit Scheme** | Up to ₹1.40 Lakh (some variants ₹1.25 Lakh) | ~5% - 6% p.a. | Fast processing, SHG/individual micro enterprise |
| **Term Loan** | Up to ₹50.00 Lakh (project-based) | ~6% - 10% p.a. | Medium/large ventures, up to 90% project cost covered |
| **Educational Loan Scheme** | Up to ₹10 Lakh (India) / ₹20 Lakh (Abroad) | ~4% - 6.5% p.a. | Special interest rebates for women, moratorium during study + 6-12 months |
| **Specialized Schemes (SEED, VISVAS)** | Varies per guideline | Concessional subvention | Specific targeting for sanitation workers, artisans, SHGs |

---

## 4. Non-Negotiable System Principles

1. **Deterministic Rule-Based Eligibility:** Decisions are evaluated strictly by code/rules based on database records. An LLM never makes the eligibility verdict on its own.
2. **Grounded AI / No Hallucinations:** LLM/AI layers only re-rank, translate to plain language, and power conversational query grounded strictly via Retrieval-Augmented Generation (RAG) against verified database rows.
3. **Real Scheme Data:** Use authentic NSFDC, myScheme, and data.gov.in structures and figures; no placeholder or fake schemes.
4. **Transparent Explainability:** Every match displays exact criteria matched (e.g. *Income <= ₹5L*, *SC category verified*, *Project cost within ₹1.4L cap*).
5. **Multilingual First:** Complete UI and audio/voice support in English + at least one regional language (e.g., Hindi, Tamil, Telugu).

---

## 5. System Architecture & Tech Stack

- **Mobile / Citizen App:** React Native (Expo) — Android build ready for on-ground demos.
- **Web Dashboards (Facilitator + Admin):** React + Vite + Tailwind CSS.
- **Backend API:** Python + FastAPI (async, auto-generated Swagger / OpenAPI docs at `/docs`).
- **Database:** PostgreSQL with `pgvector` extension for semantic embeddings alongside relational tables.
- **Cache:** Redis for hot scheme and channel partner geo-queries.
- **AI / LLM Layer:** Claude API / Gemini API with strict system prompts and retrieval-grounded context.
- **Geo / Maps:** Google Maps Platform (Places + Distance Matrix API) with Leaflet/OpenStreetMap fallback.
- **Authentication:** Single unified Firebase Auth (Phone Number + OTP) with role-based routing (`citizen`, `facilitator`, `admin`) plus a zero-login **Guest Quick-Check** path.
- **Notifications:** Firebase Cloud Messaging (FCM) + SMS Gateway (MSG91/Twilio fallback).
- **Hosting Targets:** Render / Railway (Backend API), Vercel (Web Dashboards), Supabase (Managed Postgres with pgvector).

---

## 6. Unified Authentication & Role-Based Access Model

- **Single Sign-On Flow:** One phone + OTP entry point.
- **Roles:**
  - `citizen` (Default role assigned on self-registration).
  - `facilitator` (Assigned only via Admin — Common Service Center / NGO operators).
  - `admin` (Assigned via backend/admin seed — MoSJE / NSFDC scheme analysts).
- **Guest Mode:** Direct access to Recommender and Financial Calculator without account creation (bookmarks & official tracking require OTP login).

---

## 7. Core Data Model Entities

1. `Citizen`: `id`, `phone`, `age`, `income_band`, `occupation`, `state`, `district`, `pincode`, `category`, `gender`, `disability_status`, `language_pref`, `role`
2. `Scheme`: `id`, `name`, `code`, `ministry`, `implementing_agency`, `category`, `max_loan_amount`, `interest_rate_min`, `interest_rate_max`, `moratorium_months_min`, `moratorium_months_max`, `benefits`, `description`, `official_portal_url`, `last_synced_at`
3. `EligibilityRule`: `id`, `scheme_id`, `field_name`, `operator` (`<=`, `>=`, `==`, `IN`), `rule_value`, `is_mandatory`
4. `ChannelPartner`: `id`, `name`, `partner_type` (`SCA`, `PSB`, `RRB`, `NBFC_MFI`), `address`, `district`, `state`, `pincode`, `latitude`, `longitude`, `phone`, `email`, `eligible_scheme_types`, `is_active`, `npa_status_flag` (`ELIGIBLE`, `OVERDUE_RESTRICTED`, `HIGH_NPA_BLOCKED`), `fund_utilisation_score`
5. `Match`: `id`, `citizen_id`, `scheme_id`, `confidence` (`HIGH`, `MEDIUM`, `LOW`), `match_reasons` (JSON), `explanation_text`, `matched_at`
6. `ApplicationStatus`: `id`, `citizen_id`, `scheme_id`, `channel_partner_id`, `status` (`NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED_TO_PARTNER`, `SANCTIONED`, `DISBURSED`), `notes`, `updated_at`
7. `Document`: `id`, `citizen_id`, `doc_type`, `file_ref`, `uploaded_at`, `status`
8. `AnalyticsEvent`: `id`, `event_type`, `scheme_id`, `region`, `metadata`, `timestamp`

---

## 8. Required App States (Judges' Evaluation Checklist)

Every screen handling data must explicitly provide:
1. **Initial Loading:** Skeleton screens matching the final layout (never blank white screens).
2. **Empty State:** Contextual guidance (e.g. "Complete profile to view eligible concessional schemes") with CTA.
3. **Offline / No Connection:** Persistent status banner with cached read-only data access and sync queues.
4. **Slow Connection / Timeout:** Informative timeout message with retry trigger.
5. **Error State (4xx/5xx):** Human-readable recovery message + retry button (no raw stack traces).
6. **Permission Denied (GPS):** Explains value of location and provides instant manual pincode/district fallback.
7. **Session Expired:** Silent refresh where possible; otherwise graceful redirect preserving in-progress form inputs.
8. **Action Feedback:** Instant toast or inline confirmation for saves, uploads, and status updates.
9. **Low-Confidence Matches:** Amber "Maybe eligible — verify [X]" rather than a false yes/no.

---

## 9. Design System & UI Consistency (Unified Across 3 Frontends)

- **Palette:**
  - Primary CTA / High Match: Forest Green / Institutional Deep Teal (`#0D5C3A` / `#107C41`)
  - Accent / Pending / Maybe Eligible: Warm Amber (`#D97706` / `#F59E0B`)
  - Alert / High NPA / Ineligible: Rose / Burgundy (`#BE123C`)
  - Neutrals: Slate greys with crisp contrast for high outdoor readability.
- **Typography:** Clear readable sans-serif (Inter / Outfit) with defined 5-level type scale.
- **Standard Radius & Spacing:** 8px / 12px / 16px grid; unified card elevation and border styles across mobile and web.

---

## 10. Execution Roadmap & Build Order

1. **Scaffold Repositories:** FastAPI backend + PostgreSQL/pgvector + React Native (Expo) + React Web Dashboards (Vite + Tailwind).
2. **Database & Seed Data:** NSFDC scheme catalog + Eligibility Rules + Geocoded Channel Partners with NPA flags.
3. **Core Module 1 — Smart Scheme Recommender:** Deterministic engine + LLM explainability.
4. **Core Module 2 — Dynamic Financial Calculator:** Live EMI computation + moratorium slider.
5. **Core Module 3 — Geo-Spatial Channel Partner Locator:** Distance matrix + NPA eligibility filtering.
6. **Auth & Multi-Role Support:** Unified OTP login + Guest quick-check.
7. **Dashboards:** Citizen Mobile Experience, Facilitator Case Assist, Admin Scheme & Partner Manager.
8. **UI States & Offline / Multilingual Polish:** Full coverage of required app states and regional language translation.
