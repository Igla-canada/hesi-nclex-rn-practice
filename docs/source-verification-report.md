# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~10:15 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **277** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 84 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 186 |
| OpenStax — Medical-Surgical Nursing | 65 |
| OpenStax — Fundamentals of Nursing | 61 |
| U.S. Centers for Disease Control and Prevention (CDC) | 37 |
| College of Nurses of Ontario | 33 |
| OpenStax — Pharmacology for Nurses | 31 |
| OpenStax — Psychiatric-Mental Health Nursing | 23 |
| OpenStax — Maternal-Newborn Nursing | 21 |
| OpenStax — Clinical Nursing Skills | 17 |
| Public Health Agency of Canada / Canada.ca | 13 |
| Government of Ontario — e-Laws | 7 |
| U.S. National Library of Medicine — DailyMed | 7 |
| OpenStax — Population Health for Nurses | 7 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 7 |
| Canadian Paediatric Society | 6 |
| World Health Organization | 5 |
| StatPearls / NCBI Bookshelf | 5 |
| NCBI Bookshelf (Open RN / WisTech Open) | 4 |
| Public Health Ontario — Provincial Infectious Diseases Advisory Committee (PIDAC) | 3 |
| Agency for Healthcare Research and Quality (AHRQ) | 3 |
| Canadian Paediatric Society — Caring for Kids | 3 |
| Diabetes Canada | 2 |
| Health Canada Drug Product Database — Pharmascience Inc. product monograph | 2 |
| NCSBN / American Nurses Association | 2 |
| Centers for Disease Control and Prevention | 2 |
| Health Canada / Canada.ca | 2 |
| U.S. Centers for Disease Control and Prevention (CDC/HICPAC) | 1 |
| Health Canada Drug Product Database — Sandoz Canada Inc. product monograph | 1 |
| Health Canada Drug Product Database — Taro Pharmaceuticals Inc. product monograph | 1 |
| Heart & Stroke — Canadian Stroke Best Practices | 1 |
| Government of Ontario (e-Laws) | 1 |
| Public Health Ontario | 1 |
| Health Canada (Hikma Canada) | 1 |
| Health Canada Drug Product Database — Laboratoire Riva Inc. product monograph | 1 |
| Health Canada Drug Product Database — Apotex Inc. product monograph | 1 |
| U.S. Centers for Disease Control and Prevention (CDC) / SHEA (stacks.cdc.gov) | 1 |
| U.S. National Highway Traffic Safety Administration (NHTSA) | 1 |
| U.S. Department of Homeland Security — Ready.gov | 1 |
| American Diabetes Association | 1 |
| OpenStax — Microbiology | 1 |
| OpenStax — Anatomy and Physiology 2e | 1 |


## Wave 24 item inventory (B33-WAVE24)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-PA-0049 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | maternity-newborn, emergency |
| ONRN-HPM-0033 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-BCC-0021 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0040 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | emergency, high-alert-medication |
| ONRN-HPM-0034 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-MOC-0044 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-PA-0050 | select_all_that_apply | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PA-0051 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-RRP-0036 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PSY-0024 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-PSY-0025 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | maternity-newborn, mental-health-safety |
| ONRN-MOC-0045 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |

### Excluded this wave (6)

| Draft topic | Reason |
| --- | --- |
| Tetralogy of Fallot hypercyanotic spell knee-chest positioning | Merck confirms knee-chest/oxygen/fluids; no independent live second publisher this session (NCBI captcha/403). |
| Hypertrophic pyloric stenosis projectile vomiting / pyloromyotomy | Merck confirms projectile vomiting and pyloromyotomy; no independent live second publisher this session. |
| Vitamin K IM prophylaxis for all neonates within 6 hours | Merck Prevention confirms IM phytonadione; OpenStax basic newborn care page lacked dual-cited prophylaxis; CPS/CDC pages unavailable (404/403). |
| Croup glucocorticoids / racemic epinephrine | Merck-only live confirmation; no OpenStax/WHO dual page retrieved. |
| Malignant hyperthermia dantrolene | Merck confirms dantrolene; OpenStax PACU page lacked keyed MH content. |
| Alcohol withdrawal benzodiazepines / CIWA | OpenStax psych confirms benzos; Merck alcohol-withdrawal URL probes returned 404. |

### Dual-cite method (wave 24)

Live fetch via `tools/fetch_source.py` for Merck, OpenStax, WHO, and AHRQ (PSNet + TeamSTEPPS check-back). Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
