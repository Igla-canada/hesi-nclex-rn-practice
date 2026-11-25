# Source verification report — Ontario/Canada question bank

**Updated:** 2026-11-25, ~1:15 PM (America/New_York)
**Scope:** Author-level **Source verified** only. Not an independent verifier pass. Not clinical review.
**Rule:** Every keyed answer and rationale rests on sources fetched in-session; citations were not invented.

---

## Summary

| Metric | Count |
| --- | ---: |
| Items Source verified | **469** |
| Items with independent verifier `confirmed` | 0 |
| Items clinically reviewed / approved / published | **0** |
| Excluded draft topics logged | 147 |

### Citation publishers (citation instances across items)

Compiled from `internal/question-bank/build/stats.json` / item sources after wave 39. Leading publishers remain Merck Manual, OpenStax nursing texts, CDC, CNO, AHRQ, and Canadian regulators. Wave 39 added MedlinePlus + AAOS (cane height/stairs); MedlinePlus + Mayo (heating pad never-sleep); CDC + PHO/Simcoe Muskoka (blood spill); NIOSH + OSHA (N95 user seal check); OpenStax Fundamentals + PMH (therapeutic open-ended / barriers); Merck + OpenStax (acute anxiety bowtie); CNO Social Media/Code + PHIPA guide (no client PHI/photos on social media).

---

## Wave 39 item inventory (B48-WAVE39)

| ID | Format | Client Needs | Jurisdiction | Sources | High-priority clinical review | Flags |
| --- | --- | ---: | --- | ---: | --- | --- |
| ONRN-BCC-0049 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0050 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0051 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0052 | drop_down_cloze | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0053 | multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-BCC-0054 | matrix_multiple_choice | Basic Care and Comfort | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0049 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0050 | matrix_multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0051 | multiple_choice | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-SIPC-0052 | drop_down_cloze | Safety and Infection Prevention and Control | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0050 | multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0051 | matrix_multiple_choice | Psychosocial Integrity | General (Canada/US concordant) | 2 | no | — |
| ONRN-PSY-0052 | bowtie | Psychosocial Integrity | General (Canada/US concordant) | 3 | yes | mental-health-safety |
| ONRN-MOC-0074 | multiple_choice | Management of Care | Ontario-specific | 3 | yes | legal-ontario |

### Excluded this wave (3)

| Draft topic | Reason |
| --- | --- |
| Elastic bandage distal-to-proximal wrap as primary key | MedlinePlus supports calf-to-knee wrap after knee arthroscopy, but AAOS sprain page confirms elastic compression without clear distal-to-proximal sequencing; deferred. |
| CNO controlled-substance orders must be direct (not directives) | CNO Medication confirms the fact, but Directives PDF 404'd; deferred rather than single-source pad. |
| Therapeutic communication — changing the subject / false reassurance | Already covered by ONRN-PSY-0002/0032/0033/0040; used open-ended vs why/minimizing instead. |

### Dual-cite method (wave 39)

Live fetch via `tools/fetch_source.py` (and `--register-file` when WebFetch captured blocked Mayo/NIOSH/CNO pages) for MedlinePlus cane/heat, AAOS OrthoInfo cane, Mayo heat teaching, CDC environmental services + PHO IPAC + Simcoe Muskoka blood-spill PDFs, NIOSH seal-check FAQ + OSHA 1910.134, OpenStax Fundamentals/PMH therapeutic communication, Merck anxiety overview, CNO Social Media + Code of Conduct, PHIPA regulated-professionals guide. Grep confirmed keyed facts before authoring. Validator: `TOTAL ERRORS: 0`.

### Honesty constraints

- AI may set **Source verified** only — never Clinically reviewed / Approved.
- **Approved / published = 0**; no exam forms assignable.
- No claim that items are authentic HESI/NCLEX items.
