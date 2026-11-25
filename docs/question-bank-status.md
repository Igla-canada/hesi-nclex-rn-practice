# Question bank status — Ontario/Canada HESI/NCLEX practice

**Updated:** 2026-11-25, ~6:45 AM (America/New_York)  
**Honesty:** Counts below are **actual**. AI authoring may reach **Source verified** only. **Published / clinically reviewed = 0.** No claim of HESI/NCLEX item authenticity.

Companion: [source-verification-report.md](./source-verification-report.md) · bank root: `/cursor/stores/self/internal/question-bank/`

---

## Headline counts (compiled bank)

| Metric | Count |
| --- | ---: |
| **Total active items** | **44** |
| **Source verified** | **44** |
| Awaiting clinical review | 0 |
| Clinically reviewed | 0 |
| Approved / published | **0** |
| Draft (in compiled bank) | 0 |
| Archived | 0 |
| Excluded draft topics (logged) | 14 |

Source: `internal/question-bank/build/stats.json` generated 2026-11-25 after merge of `B00-PILOT` + `B11-WAVE2` + `B12-WAVE3` + `B13-WAVE4` + `B14-WAVE5`.

---

## By Client Needs subcategory (Source verified)

| Code | Subcategory | Source verified | Gap vs 150-item form quota* |
| --- | --- | ---: | ---: |
| MOC | Management of Care | 5 | 22 |
| SIPC | Safety and Infection Prevention and Control | 5 | 15 |
| HPM | Health Promotion and Maintenance | 5 | 8 |
| PSY | Psychosocial Integrity | 5 | 8 |
| BCC | Basic Care and Comfort | 5 | 8 |
| PPT | Pharmacological and Parenteral Therapies | 7 | 17 |
| RRP | Reduction of Risk Potential | 6 | 12 |
| PA | Physiological Adaptation | 6 | 15 |

*Quota for one 150-item HESI-style form (see blueprint). Five forms need ~750 Source-verified → clinically reviewed items. **No form is publishable yet.**

Wave 5 raised the previously thinnest buckets (BCC 3→5, HPM 4→5, PSY 4→5) and added PPT/PA dual-cited items.

---

## By format / jurisdiction

| Format | n |
| --- | ---: |
| multiple_choice | 36 |
| select_all_that_apply | 5 |
| matrix_multiple_choice | 1 |
| calculation | 1 |
| ordered_response | 1 |

| Jurisdiction | n |
| --- | ---: |
| General (Canada/US concordant) | 37 |
| Ontario-specific | 4 |
| Canada-specific | 3 |

---

## Batches

| Batch | Items | Status |
| --- | ---: | --- |
| B00-PILOT | 5 | Source verified (pipeline exemplar) |
| B11-WAVE2 | 13 | Source verified (wave 2 expansion) |
| B12-WAVE3 | 10 | Source verified (wave 3 — RRP/HPM/MOC focus) |
| B13-WAVE4 | 9 | Source verified (wave 4 — RRP/HPM/PSY/MOC focus) |
| B14-WAVE5 | 7 | Source verified (wave 5 — BCC/HPM/PSY + PPT/PA) |
| B01–B10 | 0 JSON | Prior fetch logs only; no authored batches completed |

---

## Exam forms (V1–V5)

| Mode | Assigned items | Complete forms |
| --- | ---: | ---: |
| Publishable (Approved+) | 0 | 0 / 5 |
| Provisional (Awaiting clinical review+) | 0 | 0 / 5 |

---

## App import

Compiled bank copied into the GitHub app repo under `data/question-bank/` with an import script that maps items to `SOURCE_VERIFIED` / **not published**. Requires `DATABASE_URL` to run. Seed placeholders remain separate EXAMPLE drafts.

---

## Next priorities

1. Independent verifier pass on B00 + B11 + B12 + B13 + B14 → Awaiting clinical review.  
2. Licensed clinician review (especially high-priority: digoxin, warfarin, DKA, suicide, maternity/RhIg/safe sleep, Ontario legal/privacy, dose calc, transfusion, naloxone, alcohol withdrawal, febrile neutropenia, seizure airway, insulin peak, hallucinations).  
3. Continue authoring toward blueprint gaps (PPT, PA, SIPC, MOC volume; remaining BCC/HPM/PSY) with live-fetched dual sources only.  
4. Do **not** pad counts; exclude when a second independent source cannot be confirmed.
