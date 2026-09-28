# Database Schema Design
**Database:** PostgreSQL with `pgvector`

## Entities & Relationships

### `citizens`
- `id` (UUID PK)
- `phone` (VARCHAR UNIQUE)
- `role` (VARCHAR: `citizen`, `facilitator`, `admin`, `guest`)
- `annual_family_income` (FLOAT NOT NULL)
- `category` (VARCHAR: `SC`, `ST`, `OBC`, `General`)
- `state`, `district`, `pincode`
- `language_pref` (VARCHAR)

### `schemes`
- `id` (VARCHAR PK)
- `code` (VARCHAR UNIQUE)
- `name` (VARCHAR)
- `scheme_type` (VARCHAR: `MICRO_FINANCE`, `TERM_LOAN`, `EDUCATIONAL_LOAN`, `SPECIAL_WOMEN_SHG`)
- `max_loan_amount`, `max_coverage_percent`
- `interest_rate_min`, `interest_rate_max`, `women_rebate_percent`
- `moratorium_months_min`, `moratorium_months_max`, `max_repayment_years`
- `income_ceiling` (Default ₹5,00,000 for NSFDC)

### `eligibility_rules`
- `id` (UUID PK)
- `scheme_id` (FK -> `schemes.id`)
- `field_name`, `operator`, `rule_value`, `is_mandatory`

### `channel_partners`
- `id` (VARCHAR PK)
- `name`, `partner_type` (`SCA`, `PSB`, `RRB`, `NBFC_MFI`)
- `address`, `district`, `state`, `pincode`
- `latitude`, `longitude`
- `npa_status` (`ELIGIBLE`, `OVERDUE_RESTRICTED`, `HIGH_NPA_BLOCKED`)
- `npa_ratio_percent`, `fund_utilisation_score`

### `matches`
- `id` (UUID PK)
- `citizen_id` (FK -> `citizens.id`)
- `scheme_id` (FK -> `schemes.id`)
- `confidence` (`HIGH`, `MEDIUM`, `LOW`)
- `match_score` (FLOAT)
- `match_reasons` (JSON)
