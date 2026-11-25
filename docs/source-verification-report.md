# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~2:05 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **553** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 45. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 45 added OpenStax Fundamentals 41.3 + Psych 14.3 (sundowning); OpenStax Pharmacology 28.3 + Merck diabetes meds (metformin/contrast); OpenStax Med-Surg 11.6 + Open RN/NCBI NBK594490 (dislodged chest tube three-sided dressing); OpenStax CNS 9.5 + Open RN restraints (least restrictive mitts); OpenStax Psych 2.5 + Merck depressive disorders (ECT); CNO reporting guide + Ontario RHPA HPPC s.85.1 (mandatory sexual-abuse report); OpenStax Pharm 2.3 + CNS 12.5 (high-alert insulin double-check).

---

## Wave 45 item inventory (B54-WAVE45)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0062 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0063 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0064 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication; contrast-metformin |
| ONRN-PPT-0065 | matrix_multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication; contrast-metformin |
| ONRN-RRP-0062 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | chest-tube-emergency |
| ONRN-RRP-0063 | drop_down_cloze | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | chest-tube-emergency |
| ONRN-SIPC-0064 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0065 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0063 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | ect-procedure |
| ONRN-PSY-0064 | drop_down_cloze | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | ect-procedure |
| ONRN-MOC-0082 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | ontario-regulator; mandatory-reporting |
| ONRN-MOC-0083 | drop_down_cloze | Management of Care | Ontario-specific | 2 | yes | ontario-regulator; mandatory-reporting |
| ONRN-MOC-0084 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-MOC-0085 | matrix_multiple_choice | Management of Care | General (Canada/US concordant) | 2 | yes | high-alert-medication |

### Excluded this wave (0)

No draft topics were logged as excluded this wave. Candidate topics that duplicated existing enemy groups (transfusion stop, C. diff soap-and-water, digoxin withhold, CLABSI scrub-the-hub, NG x-ray confirmation, lithium/clozapine monitoring) or lacked a clear second independent publisher were simply not authored.

### Dual-cite method (wave 45)

Live fetch via `tools/fetch_source.py` (and `--register-file` / WebFetch when CNO/CDC/NCBI pages blocked curl) for OpenStax Fundamentals/Psych/Pharmacology/CNS/Med-Surg; Merck diabetes meds, depressive disorders/ECT; Open RN restraints + chest tube (NCBI/pressbooks); CNO reporting guide + Boundaries PDF; Ontario RHPA e-Laws s.85.1. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
