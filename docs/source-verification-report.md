# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~10:45 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **301** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 96 |

### Citation publishers (citation instances across items)

| Publisher | Citations |
| --- | ---: |
| Merck Manual Professional Edition | 208 |
| OpenStax — Medical-Surgical Nursing | 69 |
| OpenStax — Fundamentals of Nursing | 64 |
| U.S. Centers for Disease Control and Prevention (CDC) | 38 |
| College of Nurses of Ontario | 33 |
| OpenStax — Pharmacology for Nurses | 31 |
| OpenStax — Maternal-Newborn Nursing | 30 |
| OpenStax — Psychiatric-Mental Health Nursing | 26 |
| OpenStax — Clinical Nursing Skills | 18 |
| Public Health Agency of Canada / Canada.ca | 13 |
| OpenStax — Population Health for Nurses | 9 |
| Government of Ontario — e-Laws | 7 |
| U.S. National Library of Medicine — DailyMed | 7 |
| Agency for Healthcare Research and Quality (AHRQ) — PSNet | 7 |
| Canadian Paediatric Society | 6 |
| Agency for Healthcare Research and Quality (AHRQ) | 5 |
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


## Wave 26 item inventory (B35-WAVE26)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-SIPC-0027 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0028 | select_all_that_apply | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-MOC-0047 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-PA-0055 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-PA-0056 | drop_down_cloze | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | maternity-newborn, emergency |
| ONRN-BCC-0022 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-HPM-0037 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-PSY-0029 | select_all_that_apply | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0038 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | pediatric |
| ONRN-RRP-0039 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric, lab-range-varies |
| ONRN-PA-0057 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency, high-alert-medication |
| ONRN-RRP-0040 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | maternity-newborn |

### Excluded this wave (6)

| Draft topic | Reason |
| --- | --- |
| Frostbite rapid warm-water rewarming 37–39°C / avoid rubbing | Merck confirmed; CDC/Ready.gov/Mayo second-source fetches failed — excluded. |
| Hypertrophic pyloric stenosis projectile emesis + olive mass | Merck confirmed; OpenStax lacked pyloric content; StatPearls reCAPTCHA-blocked — excluded. |
| Impetigo honey-crust contagious topical antibiotics | Merck confirmed; CDC 403 this session — excluded. |
| Sports concussion return-to-play staged protocol | Merck/CPS concussion URLs failed this session — excluded. |
| Neonatal hypoglycemia exact mmol/L cut-off as sole key | Thresholds differ across sources; keyed risk-group + feeding/IV dextrose instead. |
| Scabies exact permethrin leave-on hours as calculation key | Authored transmission/contact/laundry matrix instead. |

### Dual-cite method (wave 26)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked pages) for Merck, OpenStax, CDC scabies, and AHRQ TeamSTEPPS debrief. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
