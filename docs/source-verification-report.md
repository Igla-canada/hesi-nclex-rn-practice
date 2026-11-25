# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~8:25 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **157** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 51 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 97 |
| OpenStax — Medical-Surgical Nursing | 43 |
| OpenStax — Fundamentals of Nursing | 39 |
| College of Nurses of Ontario | 27 |
| U.S. Centers for Disease Control and Prevention (CDC) | 20 |
| OpenStax — Pharmacology for Nurses | 18 |
| OpenStax — Psychiatric-Mental Health Nursing | 13 |
| OpenStax — Clinical Nursing Skills | 10 |
| Public Health Agency of Canada / Canada.ca | 10 |
| Government of Ontario — e-Laws | 7 |
| OpenStax — Maternal-Newborn Nursing | 6 |
| U.S. National Library of Medicine — DailyMed | 5 |
| Public Health Ontario — Provincial Infectious Diseases Advisory Committee (PIDAC) | 3 |
| Agency for Healthcare Research and Quality (AHRQ) | 2 |
| Centers for Disease Control and Prevention | 2 |
| Diabetes Canada | 2 |
| Health Canada Drug Product Database — Pharmascience Inc. product monograph | 2 |
| NCSBN / American Nurses Association | 2 |
| World Health Organization | 2 |
| Canadian Paediatric Society | 1 |
| Government of Ontario (e-Laws) | 1 |
| Health Canada (Hikma Canada) | 1 |
| Health Canada / Canada.ca | 1 |
| Health Canada Drug Product Database — Apotex Inc. product monograph | 1 |
| Health Canada Drug Product Database — Laboratoire Riva Inc. product monograph | 1 |
| Health Canada Drug Product Database — Sandoz Canada Inc. product monograph | 1 |
| Health Canada Drug Product Database — Taro Pharmaceuticals Inc. product monograph | 1 |
| Heart & Stroke — Canadian Stroke Best Practices | 1 |
| NCBI Bookshelf (Open RN / WisTech Open) | 1 |
| OpenStax — Population Health for Nurses | 1 |
| Public Health Ontario | 1 |
| U.S. Centers for Disease Control and Prevention (CDC) / SHEA (stacks.cdc.gov) | 1 |
| U.S. Centers for Disease Control and Prevention (CDC/HICPAC) | 1 |

## Wave 14 item inventory (B23-WAVE14)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | --- | --- | ---: | --- | --- |
| ONRN-MOC-0024 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive, high-alert-medication |
| ONRN-MOC-0025 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0026 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0027 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | yes | legal-ontario |
| ONRN-MOC-0028 | multiple_choice | Management of Care | Ontario-specific | 2 | no | legal-ontario, guideline-version-sensitive |
| ONRN-SIPC-0020 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0014 | multiple_choice | Health Promotion and Maintenance | Canada-specific | 3 | yes | pediatric, canada-us-difference |
| ONRN-PA-0022 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | maternity-newborn, emergency |
| ONRN-BCC-0014 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0015 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-MOC-0029 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-HPM-0015 | select_all_that_apply | Health Promotion and Maintenance | Canada-specific | 3 | yes | pediatric, canada-us-difference |

Full compiled inventory: `internal/question-bank/build/question-bank.json` / `question-bank.csv` (157 Source-verified items). Prior waves B00 + B11–B22 remain Source verified; no clinical approval.

## Verification method (unchanged)

1. Live-fetch preferred sources with `tools/fetch_source.py` (or WebFetch + `--register-file` when curl blocked).
2. Grep/extract supporting sections; write original stems/rationales.
3. Require ≥2 independent publishers where possible; log exclusions when dual confirmation fails.
4. `tools/validate_bank.py` → `TOTAL ERRORS: 0`; `tools/build_bank.py` regenerates compiled bank + stats.

## Honesty statement

These items are **AI-drafted originals** for practice. They are **not** HESI/NCLEX exam items. **Source verified ≠ clinically reviewed ≠ approved for publication.**
