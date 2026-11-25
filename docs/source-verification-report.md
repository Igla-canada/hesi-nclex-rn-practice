# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~1:50 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **483** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 40. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 40 added MedlinePlus + Merck (oral iron teaching); CDC + PHO PIDAC (artificial nails / short natural nails); CDC + Health Canada (food thermometer / Clean-Separate-Cook-Chill; secondhand smoke no-safe-level / smoke-free home-car); MedlinePlus + OpenStax Maternal-Newborn (umbilical cord stump care); SAMHSA TIP 35 + Merck (+ OpenStax PMH on bowtie) for motivational interviewing / ambivalence.

---

## Wave 40 item inventory (B49-WAVE40)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-PPT-0052 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0053 | matrix_multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0054 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0053 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0054 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0060 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0061 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0062 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0063 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0064 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0065 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0053 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0054 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0055 | bowtie | Psychosocial Integrity | General (Canada/US concordant) | 3 | yes | mental-health-safety |

### Excluded this wave (0)

No draft topics were logged as excluded this wave. Candidate topics that lacked a clear second independent publisher (or duplicated existing enemy groups) were simply not authored.

### Dual-cite method (wave 40)

Live fetch via `tools/fetch_source.py` (and `--register-file` when CDC/Canada.ca/PHO/CNO pages blocked curl) for MedlinePlus + Merck iron teaching; CDC clean-hands + PHO PIDAC hand-hygiene nails; CDC food-safety + Health Canada cooking temperatures; CDC SHS home + Health Canada smoke-free home/car / SHS about; MedlinePlus + OpenStax Maternal-Newborn cord care; SAMHSA TIP 35 (NCBI) + Merck SUD (+ OpenStax PMH attitudes on bowtie). Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
