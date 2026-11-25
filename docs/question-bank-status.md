# Question bank status — Ontario/Canada HESI/NCLEX practice

**Updated:** 2026-11-25, ~8:50 AM (America/New_York)  
**Honesty:** Counts below are **actual**. AI authoring may reach **Source verified** only. **Published / clinically reviewed = 0.** No claim of HESI/NCLEX item authenticity.

Companion: [source-verification-report.md](./source-verification-report.md) · bank root: `/cursor/stores/self/internal/question-bank/`

---

## Headline counts (compiled bank)

| Metric | Count |
| --- | ---: |
| **Total active items** | **193** |
| **Source verified** | **193** |
| Awaiting clinical review | 0 |
| Clinically reviewed | 0 |
| Approved / published | **0** |
| Draft (in compiled bank) | 0 |
| Archived | 0 |
| Excluded draft topics (logged) | 60 |

Source: `internal/question-bank/build/stats.json` generated 2026-11-25 after merge of `B00-PILOT` + `B11-WAVE2` + `B12-WAVE3` + `B13-WAVE4` + `B14-WAVE5` + `B15-WAVE6` + `B16-WAVE7` + `B17-WAVE8` + `B18-WAVE9` + `B19-WAVE10` + `B20-WAVE11` + `B21-WAVE12` + `B22-WAVE13` + `B23-WAVE14` + `B24-WAVE15` + `B25-WAVE16` + `B26-WAVE17`.

---

## By Client Needs subcategory (Source verified)

| Code | Subcategory | Source verified | Gap vs 150-item form quota* |
| --- | --- | ---: | ---: |
| MOC | Management of Care | 34 | 0† |
| SIPC | Safety and Infection Prevention and Control | 21 | 0† |
| HPM | Health Promotion and Maintenance | 21 | 0† |
| PSY | Psychosocial Integrity | 18 | 0† |
| BCC | Basic Care and Comfort | 17 | 0† |
| PPT | Pharmacological and Parenteral Therapies | 30 | 0† |
| RRP | Reduction of Risk Potential | 23 | 0† |
| PA | Physiological Adaptation | 29 | 0† |

\*Quota for one 150-item HESI-style form (see blueprint). Five forms need ~750 Source-verified → clinically reviewed items. **No form is publishable yet.**  
†Surplus vs base single-form quota supports multi-form depth (MOC 34/27, SIPC 21/20, HPM 21/13–14, PSY 18/13–14, BCC 17/13–14, PPT 30/24, RRP 23/18, PA 29/21).

Wave 17 added multi-exam depth with underrepresented specialties (Gerontology, Pediatrics, Leadership/Management, Community/Public Health) and NGN formats (matrix + ordered response + SATA), dual-cited originals only (Merck, OpenStax, CPS, CNO, CDC). **All eight Client Needs single-form quotas remain met at Source verified.**

---

## By format / jurisdiction

| Format | n |
| --- | ---: |
| multiple_choice | 163 |
| select_all_that_apply | 23 |
| matrix_multiple_choice | 4 |
| ordered_response | 2 |
| calculation | 1 |

| Jurisdiction | n |
| --- | ---: |
| General (Canada/US concordant) | 155 |
| Ontario-specific | 29 |
| Canada-specific | 9 |

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
| B21-WAVE12 | 14 | Source verified (wave 12 — MOC/PPT/SIPC/PA thinner-gap focus) |
| B22-WAVE13 | 13 | Source verified (wave 13 — MOC/PPT/SIPC/PA thinner-gap focus) |
| B23-WAVE14 | 12 | Source verified (wave 14 — MOC/SIPC close + underrepresented specialties) |
| B24-WAVE15 | 12 | Source verified (wave 15 — peds/MH/maternity/community + NGN) |
| B25-WAVE16 | 12 | Source verified (wave 16 — gero/leadership/community/peds + NGN) |
| B26-WAVE17 | 12 | Source verified (wave 17 — gero/peds/leadership/community + NGN) |
| B01–B10 | 0 JSON | Prior fetch logs only; no authored batches completed |

---

## Exam forms (V1–V5)

| Mode | Assigned items | Complete forms |
| --- | ---: | ---: |
| Publishable (Approved+) | 0 | 0 / 5 |
| Provisional (Awaiting clinical review+) | 0 | 0 / 5 |

---

## App import

Compiled bank copied into the GitHub app repo under `data/question-bank/` with an import script that maps items to `SOURCE_VERIFIED` / **not published**. Requires `DATABASE_URL` to run. Seed placeholders remain separate EXAMPLE drafts. Import script retains `Prisma.InputJsonValue` casts with static `import type { Prisma }`.

---

## Next priorities

1. Independent verifier pass on B00 + B11–B26 → Awaiting clinical review.  
2. Licensed clinician review (especially high-priority: digoxin, warfarin, DKA, suicide, maternity/RhIg/safe sleep/skin-to-skin/exclusive breastfeeding/prenatal tobacco/PPH fundal massage/magnesium toxicity/preeclampsia/mastitis, Ontario legal/privacy/consent refusal/boundaries/advocacy/restraints/near-miss reporting/conscientious objection/UCP delegation/assignment/CYFSA reporting/capacity/conflict/social media/documentation/culturally safe care/incomplete orders, dose calc, transfusion/TACO/reaction stop, naloxone, alcohol withdrawal, febrile neutropenia, seizure airway, insulin peak, hallucinations, heparin aPTT, metformin/contrast, IV potassium, anaphylaxis epinephrine, beta-blocker bradycardia, IPV screening, compartment syndrome, asthma SABA, mania safety, cast neurovascular, wound evisceration, lithium monitoring, opioid respiratory depression, ICP positioning, tension pneumothorax, sepsis antibiotics, nitroglycerin/PDE-5, CLABSI hub scrub, measles airborne, PE, aminoglycoside toxicity, varicella, pertussis, hypocalcemia, hypokalemia, meningococcal droplet, childhood immunization aftercare, elder abuse, pressure-injury repositioning, pediatric ORS/bronchiolitis/car seat, SSRI onset/suicidality monitoring, least-restrictive MH care, lead primary prevention, older-adult lowest-dose/polypharmacy, fall-risk medication review, hearing communication, home fall hazards, near-miss reporting, pediatric aspirin/Reye, croup dexamethasone, CF pancreatic enzymes, fracture neurovascular 5 Ps, delirium supportive care/precipitants/anticholinergic-opioid contributors, orthostatic rise-slowly, epiglottitis airway/recognition, UCP competence/Right Circumstance, float competency-based assignment, aspiration mealtime precautions, PPE donning sequence, tertiary stroke rehab).  
3. Continue authoring toward **five-form** depth (~750 Source-verified → clinically reviewed), prioritizing underrepresented specialties (Pediatrics, Gerontology, Community/Public Health, Leadership/Management) with live-fetched dual sources only.  
4. Do **not** pad counts; exclude when a second independent source cannot be confirmed.
