# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~1:25 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **539** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 44. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 44 added OpenStax Fundamentals 21.3 + Med-Surg 11.7 (thickened liquids / aspiration); OpenStax Pharmacology 20.2 + Merck thrombocytopenia (HIT); Merck malignant hyperthermia + GeneReviews/NCBI NBK1146 (dantrolene / stop triggers); Merck thiamine deficiency + OpenStax Psych 19.2 (thiamine before IV glucose / Wernicke); AHRQ TeamSTEPPS CUS + AHA TeamSTEPPS CUS toolkit; OpenStax Clinical Nursing Skills 11.1 + Fundamentals 11.2 (two identifiers); AHA adult BLS + OpenStax Med-Surg 12.2 (CPR 100–120/min).

---

## Wave 44 item inventory (B53-WAVE44)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0060 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0061 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0062 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-PPT-0063 | matrix_multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-PA-0076 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | perioperative-emergency |
| ONRN-PA-0077 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | perioperative-emergency |
| ONRN-PSY-0061 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | alcohol-withdrawal |
| ONRN-PSY-0062 | drop_down_cloze | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | alcohol-withdrawal |
| ONRN-MOC-0080 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0081 | drop_down_cloze | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0062 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0063 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0060 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | resuscitation |
| ONRN-RRP-0061 | drop_down_cloze | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | resuscitation |

### Excluded this wave (0)

No draft topics were logged as excluded this wave. Candidate topics that lacked a clear second independent publisher, conflicted across sources (e.g., inconsistent insulin-mixing air-order PDFs), or duplicated existing enemy groups (heatstroke, diabetic foot care, car seats) were simply not authored.

### Dual-cite method (wave 44)

Live fetch via `tools/fetch_source.py` (and `--register-file` / WebFetch when NCBI/AHA pages blocked curl) for OpenStax Fundamentals/Med-Surg/Pharmacology/Psych/CNS pages; Merck HIT, MH, and thiamine; GeneReviews NBK1146; AHRQ CUS; AHA TeamSTEPPS CUS; AHA adult BLS guidelines. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
