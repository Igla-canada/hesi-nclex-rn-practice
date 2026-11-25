# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~11:20 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **361** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 123 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 31. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 31 added CNO Professional Boundaries + Virtual Care PDFs, AHRQ check-back / formative feedback (+ TeamSTEPPS pocket guide), AHA closed-loop toolkit page, Health Canada radon factsheet/guide, CDC radon testing/reduce pages, Merck delirium/dementia overview + aspiration pneumonia prevention, and OpenStax PMH/Med-Surg/Fundamentals dual cites.

---

## Wave 31 item inventory (B40-WAVE31)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-MOC-0057 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0058 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0059 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0060 | drop_down_cloze | Management of Care | General (Canada/US concordant) | 3 | no | — |
| ONRN-MOC-0061 | multiple_choice | Management of Care | General (Canada/US concordant) | 3 | no | — |
| ONRN-MOC-0062 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-HPM-0049 | multiple_choice | Health Promotion and Maintenance | Canada-specific | 2 | no | canada-us-difference |
| ONRN-HPM-0050 | select_all_that_apply | Health Promotion and Maintenance | Canada-specific | 3 | no | canada-us-difference |
| ONRN-RRP-0046 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | yes | — |
| ONRN-RRP-0047 | matrix_multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 3 | yes | — |
| ONRN-BCC-0027 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | yes | — |
| ONRN-PA-0068 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |

### Excluded this wave (4)

| Draft topic | Reason |
| --- | --- |
| Breast cancer mammogram start age / interval | USPSTF (biennial from 40) vs ACS (annual from 45 with optional earlier start) conflict; excluded rather than key a contested number. |
| Radon numeric action level as the keyed fact | Canada 200 Bq/m³ vs US EPA 4 pCi/L; keyed only concordant testing/mitigation/smoking-risk teaching. |
| TeamSTEPPS check-back for client teach-back understanding | Enemy overlap risk with ONRN-MOC-0045; used closed-loop sender/receiver/confirm for verbal orders instead. |
| Aspiration HOB >30° as sole new item | Already covered (e.g., ONRN-BCC-0006); authored oral-hygiene prevention angle instead. |

### Dual-cite method (wave 31)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CNO/CDC/canada.ca/AHA pages) for CNO Boundaries + Virtual Care, AHRQ TeamSTEPPS check-back/feedback + pocket guide, AHA closed-loop page, Health Canada radon, CDC radon, Merck delirium/aspiration, and OpenStax PMH/Med-Surg/Fundamentals. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.
