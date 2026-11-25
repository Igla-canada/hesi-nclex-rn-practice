# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~1:00 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **497** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 41. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 41 added AHRQ PSNet + OpenStax Fundamentals (just culture / reporting); CNO Code + AHRQ/OpenStax (QA accountability); CNO Privacy + CTCMPAO PHIPA guide (breach complaints); PHO PIDAC + CDC HH clinical (4 Moments); OpenStax + OSHA (sharps/needlestick); OpenStax Pharmacology + Merck (+ MedlinePlus on matrix) for rapid-acting insulin / glargine no-mix; RadiologyInfo + FDA (MRI screening); MedlinePlus + Merck Consumer (cataract postop).

---

## Wave 41 item inventory (B50-WAVE41)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-MOC-0075 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0076 | matrix_multiple_choice | Management of Care | General (Canada/US concordant) | 3 | no | — |
| ONRN-MOC-0077 | multiple_choice | Management of Care | Ontario-specific | 2 | no | — |
| ONRN-MOC-0078 | drop_down_cloze | Management of Care | Ontario-specific | 2 | no | — |
| ONRN-MOC-0079 | multiple_choice | Management of Care | Ontario-specific | 2 | no | — |
| ONRN-SIPC-0055 | multiple_choice | Safety and Infection Prevention and Control | Canada-specific | 2 | no | — |
| ONRN-SIPC-0056 | matrix_multiple_choice | Safety and Infection Prevention and Control | Canada-specific | 2 | no | — |
| ONRN-SIPC-0057 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0055 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0056 | matrix_multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 3 | no | — |
| ONRN-PPT-0057 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0056 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0057 | matrix_multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0055 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |

### Excluded this wave (0)

No draft topics were logged as excluded this wave. Candidate topics that lacked a clear second independent publisher (or duplicated existing enemy groups) were simply not authored.

### Dual-cite method (wave 41)

Live fetch via `tools/fetch_source.py` (and `--register-file` when CDC/OSHA pages blocked curl; `pypdf` for PHO/CNO/CTCMPAO PDFs) for AHRQ PSNet culture-of-safety + reporting; OpenStax Fundamentals 9.1 / 10.4 and Pharmacology 28.2; CNO Code of Conduct + Confidentiality/Privacy PDFs; CTCMPAO PHIPA guide; PHO PIDAC hand-hygiene PDF (4 Moments); CDC clinical hand hygiene; OSHA bloodborne pathogens needlestick first aid; Merck DM medications + cataract consumer; MedlinePlus insulin injection + cataract removal; RadiologyInfo MRI safety; FDA MRI benefits/risks. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
