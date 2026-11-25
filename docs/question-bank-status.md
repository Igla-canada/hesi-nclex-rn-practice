# Question bank status — Ontario/Canada HESI/NCLEX practice

**Updated:** 2026-11-25, ~8:20 AM (America/New_York)  
**Honesty:** Counts below are **actual**. AI authoring may reach **Source verified** only. **Published / clinically reviewed = 0.** No claim of HESI/NCLEX item authenticity.

Companion: [source-verification-report.md](./source-verification-report.md) · bank root: `/cursor/stores/self/internal/question-bank/`

---

## Headline counts (compiled bank)

| Metric | Count |
| --- | ---: |
| **Total active items** | **118** |
| **Source verified** | **118** |
| Awaiting clinical review | 0 |
| Clinically reviewed | 0 |
| Approved / published | **0** |
| Draft (in compiled bank) | 0 |
| Archived | 0 |
| Excluded draft topics (logged) | 39 |

Source: `internal/question-bank/build/stats.json` generated 2026-11-25 after merge of `B00-PILOT` + `B11-WAVE2` + `B12-WAVE3` + `B13-WAVE4` + `B14-WAVE5` + `B15-WAVE6` + `B16-WAVE7` + `B17-WAVE8` + `B18-WAVE9` + `B19-WAVE10` + `B20-WAVE11`.

---

## By Client Needs subcategory (Source verified)

| Code | Subcategory | Source verified | Gap vs 150-item form quota* |
| --- | --- | ---: | ---: |
| MOC | Management of Care | 12 | 15 |
| SIPC | Safety and Infection Prevention and Control | 14 | 6 |
| HPM | Health Promotion and Maintenance | 13 | 0 |
| PSY | Psychosocial Integrity | 14 | 0† |
| BCC | Basic Care and Comfort | 13 | 0 |
| PPT | Pharmacological and Parenteral Therapies | 17 | 7 |
| RRP | Reduction of Risk Potential | 18 | 0 |
| PA | Physiological Adaptation | 17 | 4 |

\*Quota for one 150-item HESI-style form (see blueprint). Five forms need ~750 Source-verified → clinically reviewed items. **No form is publishable yet.**  
†PSY is 14 vs base quota 13 (one surplus for rotating 14-item forms).

Wave 11 closed thinner Client Needs gaps (MOC 10→12, PPT 12→17, SIPC 12→14, PA 13→17) with dual-cited originals (CNO, Ontario e-Laws, CDC/SHEA, Merck, OpenStax).

---

## By format / jurisdiction

| Format | n |
| --- | ---: |
| multiple_choice | 100 |
| select_all_that_apply | 15 |
| matrix_multiple_choice | 1 |
| calculation | 1 |
| ordered_response | 1 |

| Jurisdiction | n |
| --- | ---: |
| General (Canada/US concordant) | 99 |
| Ontario-specific | 12 |
| Canada-specific | 7 |

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
| B18-WAVE9 | 13 | Source verified (wave 9 — MOC/PSY/BCC/HPM/PA focus) |
| B19-WAVE10 | 11 | Source verified (wave 10 — HPM/BCC/PSY/RRP thinner-gap focus) |
| B20-WAVE11 | 13 | Source verified (wave 11 — MOC/PPT/SIPC/PA thinner-gap focus) |
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

1. Independent verifier pass on B00 + B11–B20 → Awaiting clinical review.  
2. Licensed clinician review (especially high-priority: digoxin, warfarin, DKA, suicide, maternity/RhIg/safe sleep/skin-to-skin/exclusive breastfeeding/prenatal tobacco, Ontario legal/privacy/consent refusal/boundaries/advocacy/restraints/near-miss reporting, dose calc, transfusion/TACO, naloxone, alcohol withdrawal, febrile neutropenia, seizure airway, insulin peak, hallucinations, heparin aPTT, metformin/contrast, IV potassium, anaphylaxis epinephrine, beta-blocker bradycardia, IPV screening, compartment syndrome, asthma SABA, mania safety, cast neurovascular, wound evisceration, lithium monitoring, opioid respiratory depression, ICP positioning, tension pneumothorax, sepsis antibiotics).  
3. Continue authoring toward remaining blueprint gaps (**MOC** largest; then **PPT**, **SIPC**, **PA**) with live-fetched dual sources only.  
4. Do **not** pad counts; exclude when a second independent source cannot be confirmed.
