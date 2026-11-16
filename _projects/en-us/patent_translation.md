---
page_id: patent_translation
layout: project
title: LLM Patent Claim Translation
description: Verified which LLM techniques actually improve Korean-to-US patent claim translation, with controls for data leakage and metric bias.
importance: 2
img: assets/img/projects/patent_pipeline.svg
context: Industry collaboration with Hyundai Rotem
period: Dec 2025 – Mar 2026
highlight: "7 techniques verified under identical criteria · RAG the only one to improve both metrics"
tags: [LLM, RAG, Evaluation, Prompt Engineering, Milvus]
teaser: /assets/img/projects/patent_pipeline.svg
teaser_caption: "The final pipeline. Five similar Korean–English claim pairs are retrieved and added to the client's prompt, and the output is scored against the claim actually filed in the US."
tldr: "Improving an LLM pipeline that converts Hyundai Rotem's Korean patent claims into English claims for US filing. Seven techniques were verified under identical criteria: unified evaluation, near-duplicate exclusion, dual-metric evaluation, and statistical checks. Retrieval-augmented generation (RAG) with similar claims was the only technique that improved both metrics; the initial gains of a structured prompt and a larger model did not hold up under verification."
glance:
  - label: Period
    value: Dec 2025 – Mar 2026 (4 months)
  - label: Team
    value: ANDLab, Yonsei University · Led the experiments and delivery to the client
  - label: Stack
    value: GPT-4o-mini, GPT-4.1, Milvus, bge-m3, SacreBLEU, PatClaimEval, Python
  - label: Outcome
    value: "Proposed client prompt + RAG. SacreBLEU **35.4 → 37.9**, PatClaimEval **0.661 → 0.676** on 398 claims, near-duplicates excluded"
---

## Background

A patent claim defines the legal scope of an invention. A US claim must follow USPTO drafting conventions, such as a single sentence and consistent references to earlier elements, so the task is closer to redrafting than to translation.

- **Data.** 403 pairs of Korean claims and the English claims actually filed in the US, provided by Hyundai Rotem. 398 were used for evaluation.
- **Existing approach.** With Hyundai Rotem's dedicated patent translation prompt, about 40% of claims scored 30 or below in SacreBLEU. The main error types were mistranslated technical terms, non-patent phrasing, and mismatches caused by strategic redrafting for the US filing.
- **Objective.** Identify improvements that hold up under re-verification, not one-off score gains.

## My role

<div class="project-role" markdown="1">
- Led ANDLab's work on the project, from experiment design to delivery to the client
- Designed and ran all experiments and set the verification criteria
- Built the retrieval pipeline (Milvus, bge-m3) and the evaluation pipeline (SacreBLEU, PatClaimEval)
- Error analysis, result presentations at client meetings, and delivery of a claim-by-claim result table
</div>

## Approach

Seven techniques were verified against the client's prompt. The base model is GPT-4o-mini; other models are marked where used. A result counted only if it met all four criteria below:

1. **Unified evaluation.** All outputs went through the same post-processing and scoring, so results are directly comparable across runs.
2. **Near-duplicate exclusion.** Retrieval searches the same 403 claims used for evaluation, so claims with the same title or similarity ≥ 0.85 were removed from the candidates.
3. **Dual-metric evaluation.** Word overlap was measured with SacreBLEU and claim quality with PatClaimEval, a patent claim quality model. A technique counted only if both improved.
4. **Statistical checks.** Run-to-run variation (0.2 points) was measured, and key differences are reported with 95% confidence intervals.

## Results

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">1 / 7</span>
    <span class="paper-stat-label">Techniques improving both metrics</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">35.4 → 37.9</span>
    <span class="paper-stat-label">SacreBLEU with RAG (near-duplicates excluded)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">0.661 → 0.676</span>
    <span class="paper-stat-label">PatClaimEval with RAG</span>
  </div>
</div>

### Results by technique

| Technique                                | SacreBLEU   | PatClaimEval  | Decision                          |
| :--------------------------------------- | :---------- | :------------ | :-------------------------------- |
| Multi-agent split (3 steps)              | 34.0 → 24.3 | –             | Rejected                          |
| Terminology dictionary hints             | 34.0 → 32.5 | –             | Rejected                          |
| Fixed examples (few-shot)                | 34.0 → 34.1 | –             | No effect                         |
| **Similar-claim retrieval (RAG, top-5)** | 35.4 → 37.9 | 0.661 → 0.676 | **Adopted**                       |
| Similarity-based retrieval gating        | 38.6 → 37.8 | –             | Rejected                          |
| Structured prompt + RAG                  | 37.9 → 36.5 | 0.676 → 0.653 | Rejected                          |
| Larger model (GPT-4.1-mini) + RAG        | 37.9 → 41.3 | 0.676 → 0.660 | Not adopted (SacreBLEU gain only) |

The first three rows are round-1 figures as reported to the client. The rest use the unified evaluation, under which the client's prompt alone scores 35.4.

<figure class="paper-figure paper-figure-wide">
  <img src="/assets/img/projects/patent_round1_sacrebleu.svg" alt="SacreBLEU for five round-1 configurations" loading="lazy">
  <figcaption>Round-1 results (GPT-4o-mini). The "+" rows add one technique to the single prompt; a clear gain appears only with retrieval (blue).</figcaption>
</figure>

### Model and prompt comparison (final runs)

| Configuration (398 claims)            | SacreBLEU | PatClaimEval |
| :------------------------------------ | --------: | -----------: |
| GPT-4o-mini, no retrieval             |      35.4 |        0.661 |
| GPT-4o-mini + RAG                     |      37.9 |    **0.676** |
| GPT-4o-mini + structured prompt + RAG |      36.5 |        0.653 |
| GPT-4.1-mini, no retrieval            |      39.4 |        0.654 |
| GPT-4.1-mini + RAG                    |      41.3 |        0.660 |
| GPT-4.1 + RAG                         |  **41.8** |        0.663 |

All RAG configurations exclude near-duplicates. Within the same model, RAG raised SacreBLEU by +1.9 for GPT-4.1-mini (95% CI +1.2 to +2.6). GPT-4o-mini + RAG is the only configuration that significantly improved both metrics, and also the cheapest, so it was proposed as the final configuration.

## Troubleshooting

<div class="project-issue" markdown="1">
#### 1. Data leakage from near-duplicate claims

**Problem.** Retrieval and evaluation used the same 403 claims, so a near-identical claim from the same patent family could effectively supply the answer.

**Cause.** 59 claims retrieved an example with the same title, and the gain grew with example similarity (+9.4 points for the 46 most similar cases).

**Fix.** Re-ran with claims of the same title or similarity ≥ 0.85 excluded from the candidates, and re-ran the original setting to measure run-to-run variation.

**Result.** SacreBLEU 37.9 (original setting re-run 38.9, run-to-run variation 0.2, no retrieval 35.4). 64% of claims still improved, and PatClaimEval was unchanged (0.676 vs 0.677). About 1 point of the gain came from near-duplicates; the rest is a real effect.

</div>

<div class="project-issue" markdown="1">
#### 2. Structured prompt gain not reproducible

**Problem.** A structured prompt with explicit US drafting rules was reported about 4 points above the client's prompt in round 2.

**Cause.** The gain could not be reproduced. Re-scoring the saved round-2 outputs under the unified evaluation gave 38.3–38.5, on par with the client's prompt + RAG.

**Fix.** Re-ran both prompts with the same retrieval, model, and evaluation.

**Result.** The structured prompt was worse on both metrics (SacreBLEU 36.5 vs 37.9, PatClaimEval 0.653 vs 0.676). The client's prompt was kept in the final configuration.

</div>

<div class="project-issue" markdown="1">
#### 3. Metric disagreement on larger models

**Problem.** With GPT-4.1-mini, SacreBLEU rose from 37.9 to 41.3, but PatClaimEval did not improve (0.660 vs 0.676).

**Cause.** The larger models' wording was closer to the filed claims, but no advantage appeared in claim quality. The difference between GPT-4.1 and GPT-4.1-mini was not significant either (+0.5 SacreBLEU, 95% CI −0.3 to +1.2).

**Fix.** Reported both metrics side by side instead of selecting the best configuration on a single metric.

**Result.** Proposed GPT-4o-mini + RAG, which improved both metrics at the lowest cost. Interpreting the disagreement requires review by patent attorneys.

</div>

<div class="project-issue" markdown="1">
#### 4. Critical mistranslation missed by BLEU

**Problem.** A claim in which "cathode" was translated as "anode", reversing the meaning, still scored 62.8 in BLEU.

**Cause.** BLEU measures only word overlap, so it is insensitive to a single critical mistranslation while heavily penalizing valid synonyms.

**Fix.** Introduced PatClaimEval and evaluated every claim on both metrics.

**Result.** PatClaimEval scored that claim low (0.52); all subsequent results were reported on both metrics.

</div>

<div class="project-issue" markdown="1">
#### 5. Inappropriate wording transferred from retrieved examples

**Problem.** In the worst case, SacreBLEU fell from 73.8 to 49.3 after applying RAG.

**Cause.** The retrieved example's "refrigeration unit" was carried over where "refrigerator" was required. Other models (Claude, Gemini) also dropped on this claim.

**Fix.** Applied gating that skips retrieval when similarity to the input claim is below a threshold. The decision used only similarity, never the reference.

**Result.** Not effective. At a 0.70 threshold, claims dropping more than 10 points fell from 6 to 3, but the average fell from 38.6 to 37.8. Less similar examples still help on average, so similarity alone cannot predict when retrieval will hurt.

</div>

<div class="project-issue" markdown="1">
#### 6. Performance loss from multi-agent split and terminology dictionary

**Problem.** A three-step multi-agent setup (interpret → translate → style correction) scored 24.3, about 10 points below a single prompt (34.0). Hints from a general Korean–English dictionary (about 850K entries) also lowered the score from 34.0 to 32.5.

**Cause.** Separate calls per step broke the context between steps, so the style-correction step did not reflect the claim-scope interpretation. The dictionary's contribution also stayed low in a 60-claim ablation.

**Fix.** Kept a single-prompt structure and focused on improving retrieved examples.

**Result.** RAG gave the largest round-1 gain, +4.6 points.

</div>

## Limitations and future work

- Some reference claims (the claims actually filed in the US) were strategically redrafted, so even an accurate translation cannot match them exactly.
- Near-duplicates were excluded by title and similarity, but claims from the same patent family with different titles cannot be identified without family data. Verification on a separate dataset would be the most reliable.
- SacreBLEU and PatClaimEval disagreed on larger models. A sample review by patent attorneys is needed to determine which metric reflects actual quality.
- Classification-based example selection and fine-tuning with 2,000+ pairs were proposed as a second phase, conditional on additional data from the client.
