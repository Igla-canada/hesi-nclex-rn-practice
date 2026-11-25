# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~12:18 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **441** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 141 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 37. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 37 added MedlinePlus + Merck (ice cloth barrier); Alberta MyHealth + OpenStax CNS (wheelchair brakes); SHEA + ACS/SIS (SSI clippers not razors); CDC CDI guidance + Public Health Ontario (C. diff sporicidal cleaning); NCBI StatPearls + Ohio Fire Marshal (RACE); OpenStax PMH + Merck antipsychotics (TD/AIMS; akathisia; command-hallucination safety); CNO Documentation + Code of Conduct (timely documentation; single regulatory publisher, flagged).

---

## Wave 37 item inventory (B46-WAVE37)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0039 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0040 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0041 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0042 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0041 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0042 | drop_down_cloze | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0043 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0044 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PSY-0044 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | high-alert-medication, mental-health-safety |
| ONRN-PSY-0045 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | high-alert-medication, mental-health-safety |
| ONRN-PSY-0046 | bowtie | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety, emergency |
| ONRN-PPT-0051 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | high-alert-medication, mental-health-safety |
| ONRN-MOC-0072 | multiple_choice | Management of Care | Ontario-specific | 2* | yes | legal-ontario, single-source |

\*MOC-0072 uses two CNO documents (Documentation + Code of Conduct). Flagged `single-source` because both cites share one publisher.

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| Localized immunocompetent zoster Contact vs Standard Precautions | CDC Appendix A lists Standard for localized immunocompetent containable lesions, while many nursing texts teach Contact — sources conflict; excluded. |
| Heat therapy numeric time limits / heating pad settings | Could not dual-cite the same numeric application limits from two independent publishers this session. |
| MDI/spacer step sequence | OpenStax pharmacology TOC slug unavailable this session; deferred rather than single-source. |

### Dual-cite method (wave 37)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/Alberta/PHO/NCBI pages) for MedlinePlus ice, Merck soft-tissue ice wrap, Alberta wheelchair transfer, OpenStax CNS transfers + PMH schizophrenia, SHEA SSI 2014 PMC + ACS/SIS 2016, CDC CDI clinical guidance + PHO environmental cleaning FAQ, NCBI OSHA fire + Ohio RACE tip sheet, Merck antipsychotics, CNO Documentation + Code of Conduct. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
