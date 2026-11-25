# Question bank status — Ontario/Canada HESI/NCLEX practice

**Updated:** 2026-11-25, ~6:45 AM (America/New_York)  
**Honesty:** Counts below are **actual**. AI authoring may reach **Source verified** only. **Published / clinically reviewed = 0.** No claim of HESI/NCLEX item authenticity.

Companion: [source-verification-report.md](./source-verification-report.md) · bank root: `/cursor/stores/self/internal/question-bank/`

---

## Headline counts (compiled bank)

| Metric | Count |
| --- | ---: |
| **Total active items** | **18** |
| **Source verified** | **18** |
| Awaiting clinical review | 0 |
| Clinically reviewed | 0 |
| Approved / published | **0** |
| Draft (in compiled bank) | 0 |
| Archived | 0 |
| Excluded draft topics (logged) | 4 |

Source: `internal/question-bank/build/stats.json` generated 2026-11-25 after merge of `B00-PILOT` + `B11-WAVE2`.

---

## By Client Needs subcategory (Source verified)

| Code | Subcategory | Source verified | Gap vs 150-item form quota* |
| --- | --- | ---: | ---: |
| MOC | Management of Care | 2 | 25 |
| SIPC | Safety and Infection Prevention and Control | 3 | 17 |
| HPM | Health Promotion and Maintenance | 1 | 12–13 |
| PSY | Psychosocial Integrity | 2 | 11–12 |
| BCC | Basic Care and Comfort | 2 | 11–12 |
| PPT | Pharmacological and Parenteral Therapies | 4 | 20 |
| RRP | Reduction of Risk Potential | 1 | 17 |
| PA | Physiological Adaptation | 3 | 18 |

\*Quota for one 150-item HESI-style form (see blueprint). Five forms need ~750 Source-verified → clinically reviewed items. **No form is publishable yet.**

---

## By format / jurisdiction

| Format | n |
| --- | ---: |
| multiple_choice | 14 |
| select_all_that_apply | 2 |
| matrix_multiple_choice | 1 |
| calculation | 1 |

| Jurisdiction | n |
| --- | ---: |
| General (Canada/US concordant) | 15 |
| Ontario-specific | 2 |
| Canada-specific | 1 |

---

## Batches

| Batch | Items | Status |
| --- | ---: | --- |
| B00-PILOT | 5 | Source verified (pipeline exemplar) |
| B11-WAVE2 | 13 | Source verified (wave 2 expansion) |
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

1. Independent verifier pass on B00 + B11 → Awaiting clinical review.  
2. Licensed clinician review (especially high-priority: digoxin, warfarin, DKA, suicide, maternity, Ontario legal, dose calc).  
3. Continue authoring toward blueprint gaps (RRP, HPM, MOC volume) with live-fetched dual sources only.  
4. Do **not** pad counts; exclude when a second independent source cannot be confirmed.
