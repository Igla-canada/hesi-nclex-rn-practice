# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~11:15 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **313** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 102 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 219 |
| OpenStax — Medical-Surgical Nursing | 72 |
| OpenStax — Fundamentals of Nursing | 65 |
| U.S. Centers for Disease Control and Prevention (CDC) | 42 |
| College of Nurses of Ontario | 33 |
| OpenStax — Pharmacology for Nurses | 32 |
| OpenStax — Maternal-Newborn Nursing | 30 |
| OpenStax — Psychiatric-Mental Health Nursing | 26 |
| OpenStax — Clinical Nursing Skills | 18 |
| Public Health Agency of Canada / Canada.ca | 13 |
| OpenStax — Population Health for Nurses | 9 |
| Government of Ontario — e-Laws | 7 |
| U.S. National Library of Medicine — DailyMed | 7 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 7 |
| Canadian Paediatric Society | 6 |
| Agency for Healthcare Research and Quality (AHRQ) | 7 |
| American Heart Association / American Academy of Pediatrics | 2 |
| World Health Organization | 5 |
| StatPearls / NCBI Bookshelf | 5 |
| NCBI Bookshelf (Open RN / WisTech Open) | 4 |
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


## Wave 27 item inventory (B36-WAVE27)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-HPM-0039 | select_all_that_apply | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-HPM-0040 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PA-0058 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-BCC-0023 | drop_down_cloze | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PA-0059 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, emergency |
| ONRN-PA-0060 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, emergency |
| ONRN-SIPC-0029 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0048 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0049 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0041 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-SIPC-0030 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-RRP-0042 | select_all_that_apply | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | pediatric, emergency |

### Excluded this wave (6)

| Draft topic | Reason |
| --- | --- |
| Wilms “never palpate abdomen” as sole keyed nursing rule | Mass presentation dual-cited; avoid-palpation rule not clearly dual-cited — excluded. |
| AGS Beers Criteria standalone PIM list item | JAGS full-text fetch 403; authored med-reconciliation (Merck+AHRQ) instead. |
| Varicella airborne+contact until crusted | Enemy group already in compiled bank. |
| Pertussis droplet until 5 days antibiotics | Enemy group already in compiled bank. |
| Severe hypoglycemia glucagon if unconscious | Enemy group already in compiled bank. |
| Infant choking as calculation item | Not calculation; authored MC + bowtie instead. |

### Dual-cite method (wave 27)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC pages) for Merck, OpenStax, CDC pinworm/lice/isolation appendix, AHA/AAP Pediatric BLS, and AHRQ MATCH/TeamSTEPPS. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
