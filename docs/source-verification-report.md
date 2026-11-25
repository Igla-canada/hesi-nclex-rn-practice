# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~1:05 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **511** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 42. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 42 added OpenStax Pharmacology 13.1 + Merck depression medications (SSRI suicide monitoring); OpenStax Psychiatric-Mental Health 23.3 + Merck ASD (sensory/routines); OpenStax Maternal-Newborn 20.3 + MedlinePlus + Merck postpartum (perineal ice); OpenStax 24.1 + MedlinePlus circumcision aftercare; CPS vitamin K + Merck newborn preventive care; OpenStax 23.1 + Merck birth injuries (caput/cephalohematoma); OpenStax formula safety + CDC infant formula prep; CPS Caring for Kids water safety + CDC drowning prevention.

---

## Wave 42 item inventory (B51-WAVE42)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-PSY-0056 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-PSY-0057 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-PSY-0058 | drop_down_cloze | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-PSY-0059 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PSY-0060 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-BCC-0056 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 3 | yes | maternity-newborn |
| ONRN-BCC-0057 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-BCC-0058 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-BCC-0059 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-HPM-0066 | multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | yes | maternity-newborn, pediatric |
| ONRN-HPM-0067 | matrix_multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | yes | maternity-newborn, pediatric, canada-us-difference |
| ONRN-HPM-0068 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-HPM-0069 | drop_down_cloze | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-HPM-0070 | multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | yes | pediatric |

### Excluded this wave (0)

No draft topics were logged as excluded this wave. Candidate topics that lacked a clear second independent publisher (or duplicated existing enemy groups) were simply not authored.

### Dual-cite method (wave 42)

Live fetch via `tools/fetch_source.py` (and `--register-file` / WebFetch when CDC pages blocked curl) for OpenStax Pharmacology 13.1, Psychiatric-Mental Health 23.3, Maternal-Newborn 20.3/23.1/24.1; Merck depression medications, ASD, newborn preventive care, birth injuries, postpartum care; MedlinePlus vaginal delivery + circumcision aftercare; CPS vitamin K statement + Caring for Kids water safety; CDC infant formula preparation + drowning prevention. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
