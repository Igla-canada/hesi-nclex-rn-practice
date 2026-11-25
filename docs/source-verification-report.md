# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~8:41 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **181** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 57 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 115 |
| OpenStax — Medical-Surgical Nursing | 45 |
| OpenStax — Fundamentals of Nursing | 45 |
| College of Nurses of Ontario | 28 |
| U.S. Centers for Disease Control and Prevention (CDC) | 23 |
| OpenStax — Pharmacology for Nurses | 20 |
| OpenStax — Psychiatric-Mental Health Nursing | 15 |
| OpenStax — Maternal-Newborn Nursing | 10 |
| OpenStax — Clinical Nursing Skills | 10 |
| Public Health Agency of Canada / Canada.ca | 10 |
| Government of Ontario — e-Laws | 7 |
| U.S. National Library of Medicine — DailyMed | 5 |
| Public Health Ontario — Provincial Infectious Diseases Advisory Committee (PIDAC) | 3 |
| Canadian Paediatric Society | 3 |
| OpenStax — Population Health for Nurses | 3 |
| World Health Organization | 3 |
| Agency for Healthcare Research and Quality (AHRQ) | 2 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 1 |
| Canadian Paediatric Society — Caring for Kids | 2 |
| Centers for Disease Control and Prevention | 2 |
| Diabetes Canada | 2 |
| Health Canada / Canada.ca | 2 |
| Health Canada Drug Product Database — Pharmascience Inc. product monograph | 2 |
| NCSBN / American Nurses Association | 2 |
| Government of Ontario (e-Laws) | 1 |
| Health Canada (Hikma Canada) | 1 |
| Health Canada Drug Product Database — Apotex Inc. product monograph | 1 |
| Health Canada Drug Product Database — Laboratoire Riva Inc. product monograph | 1 |
| Health Canada Drug Product Database — Sandoz Canada Inc. product monograph | 1 |
| Health Canada Drug Product Database — Taro Pharmaceuticals Inc. product monograph | 1 |
| Heart & Stroke — Canadian Stroke Best Practices | 1 |
| NCBI Bookshelf (Open RN / WisTech Open) | 1 |
| Public Health Ontario | 1 |
| U.S. Centers for Disease Control and Prevention (CDC) / SHEA (stacks.cdc.gov) | 1 |
| U.S. Centers for Disease Control and Prevention (CDC/HICPAC) | 1 |
| U.S. Department of Homeland Security — Ready.gov | 1 |
| U.S. National Highway Traffic Safety Administration (NHTSA) | 1 |

## Wave 16 item inventory (B25-WAVE16)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | --- | --- | ---: | --- | --- |
| ONRN-PPT-0027 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-RRP-0020 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-BCC-0016 | select_all_that_apply | Basic Care and Comfort | General (Canada/US concordant) | 3 | no | — |
| ONRN-RRP-0021 | matrix_multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0030 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario |
| ONRN-MOC-0031 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0019 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0020 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-PA-0026 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, high-alert-medication |
| ONRN-PPT-0028 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PPT-0029 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PA-0027 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |

Full compiled inventory: `internal/question-bank/build/question-bank.json` / `question-bank.csv` (181 Source-verified items). Prior waves B00 + B11–B24 remain Source verified; no clinical approval.

## Verification method (unchanged)

1. Live-fetch preferred sources with `tools/fetch_source.py` (or WebFetch + `--register-file` when curl blocked).
2. Grep/extract supporting sections; write original stems/rationales.
3. Require ≥2 independent publishers where possible; log exclusions when dual confirmation fails.
4. `tools/validate_bank.py` → `TOTAL ERRORS: 0`; `tools/build_bank.py` regenerates compiled bank + stats.

## Honesty statement

These items are **AI-drafted originals** for practice. They are **not** HESI/NCLEX exam items. **Source verified ≠ clinically reviewed ≠ approved for publication.**
