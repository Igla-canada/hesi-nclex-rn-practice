# Question bank status — Ontario/Canada HESI/NCLEX practice

**Updated:** 2026-11-25, ~7:25 AM (America/New_York)  
**Honesty:** Counts below are **actual**. AI authoring may reach **Source verified** only. **Published / clinically reviewed = 0.** No claim of HESI/NCLEX item authenticity.

Companion: [source-verification-report.md](./source-verification-report.md) · bank root: `/cursor/stores/self/internal/question-bank/`

---

## Headline counts (compiled bank)

| Metric | Count |
| --- | ---: |
| **Total active items** | **81** |
| **Source verified** | **81** |
| Awaiting clinical review | 0 |
| Clinically reviewed | 0 |
| Approved / published | **0** |
| Draft (in compiled bank) | 0 |
| Archived | 0 |
| Excluded draft topics (logged) | 27 |

Source: `internal/question-bank/build/stats.json` generated 2026-11-25 after merge of `B00-PILOT` + `B11-WAVE2` + `B12-WAVE3` + `B13-WAVE4` + `B14-WAVE5` + `B15-WAVE6` + `B16-WAVE7` + `B17-WAVE8`.

---

## By Client Needs subcategory (Source verified)

| Code | Subcategory | Source verified | Gap vs 150-item form quota* |
| --- | --- | ---: | ---: |
| MOC | Management of Care | 7 | 20 |
| SIPC | Safety and Infection Prevention and Control | 12 | 8 |
| HPM | Health Promotion and Maintenance | 9 | 4 |
| PSY | Psychosocial Integrity | 8 | 5 |
| BCC | Basic Care and Comfort | 8 | 5 |
| PPT | Pharmacological and Parenteral Therapies | 12 | 12 |
| RRP | Reduction of Risk Potential | 15 | 3 |
| PA | Physiological Adaptation | 10 | 11 |

*Quota for one 150-item HESI-style form (see blueprint). Five forms need ~750 Source-verified → clinically reviewed items. **No form is publishable yet.**

Wave 8 raised thinner Client Needs (SIPC 6→12, RRP 8→15) with dual-cited originals (Merck, OpenStax, CDC).

---

## By format / jurisdiction

| Format | n |
| --- | ---: |
| multiple_choice | 69 |
| select_all_that_apply | 9 |
| matrix_multiple_choice | 1 |
| calculation | 1 |
| ordered_response | 1 |

| Jurisdiction | n |
| --- | ---: |
| General (Canada/US concordant) | 71 |
| Ontario-specific | 5 |
| Canada-specific | 5 |

---

## Batches

| Batch | Items | Status |
| --- | ---: | --- |
| B00-PILOT | 5 | Source verified (pipeline exemplar) |
| B11-WAVE2 | 13 | Source verified (wave 2 expansion) |
| B12-WAVE3 | 10 | Source verified (wave 3 — RRP/HPM/MOC focus) |
| B13-WAVE4 | 9 | Source verified (wave 4 — RRP/HPM/PSY/MOC focus) |
| B14-WAVE5 | 7 | Source verified (wave 5 — BCC/HPM/PSY + PPT/PA) |
| B15-WAVE6 | 12 | Source verified (wave 6 — PPT/PA/RRP/SIPC focus) |
| B16-WAVE7 | 12 | Source verified (wave 7 — MOC/HPM/PSY/BCC focus) |
| B17-WAVE8 | 13 | Source verified (wave 8 — SIPC/RRP focus) |
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

1. Independent verifier pass on B00 + B11–B17 → Awaiting clinical review.  
2. Licensed clinician review (especially high-priority: digoxin, warfarin, DKA, suicide, maternity/RhIg/safe sleep/skin-to-skin, Ontario legal/privacy/consent refusal, dose calc, transfusion, naloxone, alcohol withdrawal, febrile neutropenia, seizure airway, insulin peak, hallucinations, heparin aPTT, metformin/contrast, IV potassium, anaphylaxis epinephrine, beta-blocker bradycardia, IPV screening, compartment syndrome).  
3. Continue authoring toward blueprint gaps (MOC still largest; PA and PPT form-level gaps remain; SIPC/RRP narrowed) with live-fetched dual sources only.  
4. Do **not** pad counts; exclude when a second independent source cannot be confirmed.
