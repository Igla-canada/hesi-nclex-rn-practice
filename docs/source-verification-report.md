# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~10:20 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **289** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 90 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 197 |
| OpenStax — Medical-Surgical Nursing | 66 |
| OpenStax — Fundamentals of Nursing | 63 |
| U.S. Centers for Disease Control and Prevention (CDC) | 37 |
| College of Nurses of Ontario | 33 |
| OpenStax — Pharmacology for Nurses | 31 |
| OpenStax — Psychiatric-Mental Health Nursing | 25 |
| OpenStax — Maternal-Newborn Nursing | 24 |
| OpenStax — Clinical Nursing Skills | 18 |
| Public Health Agency of Canada / Canada.ca | 13 |
| OpenStax — Population Health for Nurses | 9 |
| Government of Ontario — e-Laws | 7 |
| U.S. National Library of Medicine — DailyMed | 7 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 7 |
| Canadian Paediatric Society | 6 |
| World Health Organization | 5 |
| StatPearls / NCBI Bookshelf | 5 |
| NCBI Bookshelf (Open RN / WisTech Open) | 4 |
| Agency for Healthcare Research and Quality (AHRQ) | 4 |
| Canadian Paediatric Society — Caring for Kids | 4 |
| Public Health Ontario — Provincial Infectious Diseases Advisory Committee (PIDAC) | 3 |
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


## Wave 25 item inventory (B34-WAVE25)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-HPM-0035 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0026 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | — |
| ONRN-PPT-0041 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-PA-0052 | select_all_that_apply | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-PA-0053 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency, high-alert-medication |
| ONRN-PSY-0027 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-PSY-0028 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-HPM-0036 | select_all_that_apply | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PA-0054 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-RRP-0037 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-MOC-0046 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0038 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |

### Excluded this wave (6)

| Draft topic | Reason |
| --- | --- |
| AOM exact amoxicillin mg/kg dosing recall | Dual-confirmed analgesia + selective observation instead; numeric dose not dual-keyed this session. |
| Hypothermia active core rewarming modality sequence | OpenStax lacked matching multi-step active-rewarming algorithm; limited to mild passive rewarming. |
| TeamSTEPPS huddle exact scripted wording | Authored brief (start-of-shift plan sharing) with AHRQ+OpenStax; huddle script deferred. |
| Neonatal phototherapy eye-shield technique as sole key | Retained prior pattern; keyed pathologic first-24h jaundice instead. |
| Preterm labour exact betamethasone 12 mg ×2 schedule | Keyed indication/purpose (lung maturity) rather than dose-schedule recall. |
| Alcohol withdrawal CIWA benzodiazepines | Retained exclusion; Merck alcohol-withdrawal URL not dual-confirmed this session. |

### Dual-cite method (wave 25)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebSearch/WebFetch captured blocked pages) for Merck, OpenStax, CPS Caring for Kids, and AHRQ TeamSTEPPS brief/debrief. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
