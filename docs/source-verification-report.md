# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~10:55 AM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **325** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 108 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 28. Leading publishers remain Merck Manual Professional Edition, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 28 added CDC heat-health / West Nile / rabies / flu treatment / pneumococcal pages and AHRQ TeamSTEPPS/PSNet huddle sources.

---

## Wave 28 item inventory (B37-WAVE28)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-HPM-0041 | select_all_that_apply | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0042 | matrix_multiple_choice | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | yes | — |
| ONRN-PA-0061 | multiple_choice | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-PA-0062 | bowtie | Physiological Adaptation | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-MOC-0050 | multiple_choice | Management of Care | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0030 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | yes | mental-health-safety |
| ONRN-BCC-0024 | drop_down_cloze | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-PPT-0042 | multiple_choice | Pharmacological and Parenteral Therapies | General (Canada/US concordant) | 2 | yes | — |
| ONRN-RRP-0043 | multiple_choice | Reduction of Risk Potential | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0031 | select_all_that_apply | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | yes | emergency |
| ONRN-BCC-0025 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-HPM-0043 | select_all_that_apply | Health Promotion and Maintenance | General (Canada/US concordant) | 2 | no | — |

### Excluded this wave (6)

| Draft topic | Reason |
| --- | --- |
| Rabies exact 15-minute wash duration as sole keyed fact | CDC states 15 minutes; Merck stresses thorough immediate soap/water without the same minute count — keyed thorough wash + PEP instead. |
| Pneumococcal adult age cut-off ≥65 vs ≥50 | CDC adult recommendation now ages ≥50; avoided hardcoding a single age threshold. |
| TeamSTEPPS huddle exact 10–15 minute daily briefing as only correct option | PSNet daily safety huddle vs TeamSTEPPS ad-hoc plan adjustment — authored plan-adjustment item. |
| Heatstroke cold-water immersion as exclusive technique for intubated clients | Merck: immersion preferred when available/stable; evaporative also effective. |
| West Nile blood-product screening as primary community teaching key | Community teaching focus is mosquito prevention per CDC. |
| AGS Beers Criteria standalone polypharmacy list item | JAGS/Beers full text not reliably fetchable this session. |

### Dual-cite method (wave 28)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked CDC/AHRQ pages) for Merck, OpenStax, CDC heat-health/West Nile/rabies/flu/pneumococcal/travelers heat, and AHRQ TeamSTEPPS/PSNet. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No HESI/NCLEX/commercial item text used.

Prior waves: see git history of this file and `internal/question-bank/wave*-author-handoff.md`.
