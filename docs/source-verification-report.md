# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~12:10 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **428** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 138 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 36. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 36 added MedlinePlus + COPD Foundation (home oxygen fire safety); OpenStax Med-Surg postop DVT ambulation + Merck DVT Prevention; CDC Isolation Appendix A + Merck rubella; CDC Appendix A + CDC shingles IC (disseminated zoster; same publisher, flagged); OpenStax Pharmacology + MedlinePlus insulin sites; OpenStax CNS IV + NCBI Open RN IV therapy; OpenStax PMH bipolar + Merck bipolar; OpenStax Pharm antipsychotics + Merck antipsychotic adverse-effect table; CNO Consent + Code of Conduct (Ontario capacity treatment-specific; single regulatory publisher, flagged).

---

## Wave 36 item inventory (B45-WAVE36)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0036 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-BCC-0037 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-BCC-0038 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0038 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-SIPC-0039 | drop_down_cloze | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-SIPC-0040 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2* | yes | single-source |
| ONRN-PPT-0049 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-PPT-0050 | drop_down_cloze | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication |
| ONRN-RRP-0054 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-RRP-0055 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0041 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-PSY-0042 | bowtie | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, high-alert-medication |
| ONRN-PSY-0043 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-MOC-0071 | multiple_choice | Management of Care | Ontario-specific | 2* | yes | legal-ontario, single-source |

\*SIPC-0040 uses two CDC publications (Appendix A + shingles IC). MOC-0071 uses two CNO documents (Consent + Code of Conduct). Flagged `single-source` because both cites share one publisher.

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| Antiembolism stocking wrinkle-smoothing numeric fit rules | OpenStax supports wrinkle teaching; could not confirm a second independent publisher with the same application details without commercial skill sites. |
| Hearing aid battery/water care specifics | OpenStax FON encourages hearing-aid use but lacked dual-cited device-care steps from a second authoritative page fetched this session. |
| NFPA medical oxygen tip-sheet numeric distances | NFPA tip-sheet URL returned 404; oxygen items dual-cited MedlinePlus + COPD Foundation instead. |

### Dual-cite method (wave 36)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/CNO/NCBI pages) for MedlinePlus oxygen + insulin, COPD Foundation oxygen, OpenStax MS/CNS/Pharm/PMH, Merck DVT Prevention/rubella/bipolar/antipsychotics, CDC Isolation Appendix A + shingles IC, NCBI Open RN IV therapy, CNO Consent + Code of Conduct. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.
