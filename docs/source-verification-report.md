# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~12:05 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **414** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 135 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 35. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 35 added OpenStax Clinical Nursing Skills (crutches), Med-Surg (ostomy, Cushing, pneumothorax/chest tube, ICP/GCS, thyroid/myxedema), Fundamentals (NG x-ray), Maternal-Newborn (phototherapy); StatPearls crutches; MedlinePlus ostomy stoma care; CDC Isolation Appendix A + Merck mumps; NCBI Open RN NG placement + newborn phototherapy; CNO MAID guidance (single regulatory authority).

---

## Wave 35 item inventory (B44-WAVE35)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0033 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0034 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | — |
| ONRN-BCC-0035 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | — |
| ONRN-SIPC-0036 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-SIPC-0037 | drop_down_cloze | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-RRP-0051 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | — |
| ONRN-RRP-0052 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PA-0072 | select_all_that_apply | Physiological Adaptation | General (Canada/US concordant) | 2 | no | — |
| ONRN-PA-0073 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency, high-alert-medication |
| ONRN-RRP-0053 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-MOC-0069 | multiple_choice | Management of Care | Ontario-specific | 1 | yes | legal-ontario, single-source |
| ONRN-MOC-0070 | multiple_choice | Management of Care | Ontario-specific | 1 | yes | legal-ontario, single-source |
| ONRN-HPM-0058 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |
| ONRN-HPM-0059 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn, pediatric |

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| Standard walker step-into gait teaching | OpenStax CNS states step-into technique, but Open RN mobility chapter lacked matching gait-step detail for a second independent publisher. |
| Ostomy pouch empty at one-third to one-half full | Clear numeric empty threshold found in OpenStax QSEN steps; MedlinePlus only says empty several times daily without the 1/3–1/2 rule. |
| Chest tube dislodged three-sided occlusive dressing sequence | OpenStax supports three-sided dressing; Merck emphasizes one-way valves without that checklist — redirected to one-way drainage item. |

### Dual-cite method (wave 35)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/NCBI/CNO pages) for OpenStax CNS/Fund/MS/MN, StatPearls crutches, MedlinePlus ostomy, CDC Appendix A, Merck mumps/Cushing/hypothyroid/coma/pneumothorax, NCBI Open RN NG + newborn, CNO MAID PDF. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.
