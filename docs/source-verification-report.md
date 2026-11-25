# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~11:45 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **349** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 119 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 30. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 30 added CNO Discontinuing Care + Professional Boundaries PDFs, AHRQ I’M SAFE + STEP tools, CDC hepatitis B / pertussis / HFMD pages, Merck Hep B / Tdap / HFMD / pyloric stenosis pages, and NCBI StatPearls stomach physiology (pyloric).

---

## Wave 30 item inventory (B39-WAVE30)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-MOC-0053 | multiple_choice | Management of Care | Ontario-specific | 3 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0054 | multiple_choice | Management of Care | Ontario-specific | 2 | yes | legal-ontario, guideline-version-sensitive |
| ONRN-MOC-0055 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-MOC-0056 | drop_down_cloze | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0046 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0047 | multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | maternity-newborn |
| ONRN-PSY-0032 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0033 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0034 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-PA-0066 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, emergency |
| ONRN-HPM-0048 | select_all_that_apply | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | pediatric |
| ONRN-PA-0067 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | pediatric, emergency |

### Excluded this wave (5)

| Draft topic | Reason |
| --- | --- |
| Alcohol withdrawal benzodiazepines + thiamine (MC/bowtie) | Enemy duplicate with ONRN-PSY-0004. |
| False reassurance as sole MC focus | Enemy duplicate with ONRN-PSY-0002; covered inside NGN matrix barriers instead. |
| TeamSTEPPS cross-monitoring sterile-field call-out | Dedicated AHRQ cross-monitoring tool URL 404 this session. |
| DESC script formative feedback checklist | Prior-wave exclusion / single-publisher risk; not reopened. |
| C. difficile soap vs ABHS | Known source conflict from prior waves; not reopened. |

### Dual-cite method (wave 30)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/NCBI pages) for CNO PDFs, AHRQ TeamSTEPPS I’M SAFE/STEP, OpenStax, Merck, CDC hepatitis B / pertussis / HFMD, and NCBI stomach physiology. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.
