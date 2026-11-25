# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~11:40 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **386** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 129 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 33. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 33 added OpenStax Pharmacology (K-sparing diuretics, thyroid, nonopioids), Maternal-Newborn (RhIG, Apgar), PMH (anorexia), Fundamentals PPE; Merck HF MRA / APAP poisoning / postpartum Rh / neonatal Apgar / anorexia; DailyMed levothyroxine; CDC norovirus + PPE sequence + safe sleep; CPS Caring for Kids safe sleep.

---

## Wave 33 item inventory (B42-WAVE33)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-PPT-0044 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication, lab-range-varies |
| ONRN-PPT-0045 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0046 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-PA-0070 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency, high-alert-medication, mental-health-safety |
| ONRN-SIPC-0032 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0033 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0053 | multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | yes | pediatric |
| ONRN-HPM-0054 | matrix_multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | yes | pediatric |
| ONRN-RRP-0048 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-HPM-0055 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-PSY-0038 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, pediatric, emergency |
| ONRN-PSY-0039 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| PPE doffing exact glove→goggle→gown→mask ordered_response | OpenStax defers to CDC without listing each removal step; kept dual-cited MC on remove-PPE-except-respirator-before-exit. |
| Incentive spirometry numeric frequency teaching | Could not dual-cite a specific frequency/technique target from two independent live sources. |
| Health Canada APO-levothyroxine monograph empty-stomach wording | PDF fetch failed (pypdf unavailable); used OpenStax + DailyMed for levothyroxine timing. |

### Dual-cite method (wave 33)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/CPS pages) for OpenStax Pharmacology/Fundamentals/Maternal-Newborn/PMH, Merck HF/APAP/postpartum/Apgar/anorexia, DailyMed levothyroxine, CDC norovirus/PPE/safe sleep, CPS Caring for Kids safe sleep. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.
