# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~10:45 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **253** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 75 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 169 |
| OpenStax — Fundamentals of Nursing | 58 |
| OpenStax — Medical-Surgical Nursing | 57 |
| U.S. Centers for Disease Control and Prevention (CDC) | 37 |
| College of Nurses of Ontario | 33 |
| OpenStax — Pharmacology for Nurses | 28 |
| OpenStax — Psychiatric-Mental Health Nursing | 22 |
| OpenStax — Clinical Nursing Skills | 16 |
| OpenStax — Maternal-Newborn Nursing | 15 |
| Public Health Agency of Canada / Canada.ca | 13 |
| Government of Ontario — e-Laws | 7 |
| Canadian Paediatric Society | 6 |
| OpenStax — Population Health for Nurses | 5 |
| StatPearls / NCBI Bookshelf | 5 |
| U.S. National Library of Medicine — DailyMed | 5 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 4 |
| NCBI Bookshelf (Open RN / WisTech Open) | 4 |
| Canadian Paediatric Society — Caring for Kids | 3 |
| Public Health Ontario — Provincial Infectious Diseases Advisory Committee (PIDAC) | 3 |
| World Health Organization | 3 |
| Agency for Healthcare Research and Quality (AHRQ) | 2 |
| Centers for Disease Control and Prevention | 2 |
| Diabetes Canada | 2 |
| Health Canada / Canada.ca | 2 |
| Health Canada Drug Product Database — Pharmascience Inc. product monograph | 2 |
| NCSBN / American Nurses Association | 2 |
| American Diabetes Association | 1 |
| Government of Ontario (e-Laws) | 1 |
| Health Canada (Hikma Canada) | 1 |
| Health Canada Drug Product Database — Apotex Inc. product monograph | 1 |
| Health Canada Drug Product Database — Laboratoire Riva Inc. product monograph | 1 |
| Health Canada Drug Product Database — Sandoz Canada Inc. product monograph | 1 |
| Health Canada Drug Product Database — Taro Pharmaceuticals Inc. product monograph | 1 |
| Heart & Stroke — Canadian Stroke Best Practices | 1 |
| OpenStax — Anatomy and Physiology 2e | 1 |
| OpenStax — Microbiology | 1 |
| Public Health Ontario | 1 |
| U.S. Centers for Disease Control and Prevention (CDC) / SHEA (stacks.cdc.gov) | 1 |
| U.S. Centers for Disease Control and Prevention (CDC/HICPAC) | 1 |
| U.S. Department of Homeland Security — Ready.gov | 1 |
| U.S. National Highway Traffic Safety Administration (NHTSA) | 1 |


## Wave 22 item inventory (B31-WAVE22)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | --- | --- | ---: | --- | --- |
| ONRN-PA-0045 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, emergency |
| ONRN-RRP-0032 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | maternity-newborn, emergency |
| ONRN-PA-0046 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-HPM-0030 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0035 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 3 | yes | maternity-newborn, high-alert-medication |
| ONRN-MOC-0042 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0033 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PSY-0022 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-SIPC-0025 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0036 | select_all_that_apply | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-PPT-0037 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | maternity-newborn, high-alert-medication |
| ONRN-BCC-0019 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| Hypertrophic pyloric stenosis projectile vomiting / pyloromyotomy | Could not retrieve StatPearls/CPS second source live this session (NCBI captcha/403); Merck alone insufficient for Source verified. |
| Childhood lead blood-lead action thresholds | Enemy overlap with existing childhood-lead-primary-prevention item; CDC pages 403 this session — deferred rather than single-source. |
| TeamSTEPPS CUS mnemonic as standalone keyed script | Authored escalation via Two-Challenge + chain of command (AHRQ+OpenStax) instead; exact CUS wording not required for dual-cited key. |

### Dual-cite method (wave 22)

Live fetch via `tools/fetch_source.py` / WebFetch register for Merck, OpenStax, StatPearls/NCBI, and AHRQ PSNet. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
