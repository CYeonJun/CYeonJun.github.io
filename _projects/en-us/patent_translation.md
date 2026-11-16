---
page_id: patent_translation
layout: project
title: LLM Patent Claim Translation
description: Tested which LLM techniques actually improve Korean-to-US patent claim translation, under controls for leakage and metric bias.
importance: 2
img: assets/img/projects/patent_pipeline.svg
context: Industry collaboration with Hyundai Rotem
period: Dec 2025 – Mar 2026
highlight: "7 ideas tested under the same checks · only retrieval improved both metrics"
tags: [LLM, RAG, Evaluation, Prompt Engineering, Milvus]
teaser: /assets/img/projects/patent_pipeline.svg
teaser_caption: "The recommended pipeline. The client's prompt is kept, and for each Korean claim five similar Korean–English claim pairs are retrieved and added to it. The output is scored against the claim that was actually filed in the US."
tldr: "Hyundai Rotem wanted to improve how an LLM rewrites its Korean patent claims for US filing. I tested seven ideas and put every one through the same checks: one scorer, near-duplicate claims removed from retrieval, a second quality metric, and run-to-run noise. Only retrieving similar past claims survived. Several gains that looked real at first, including my own structured prompt and a larger model, did not."
glance:
  - label: Period
    value: Dec 2025 – Mar 2026 (4 months)
  - label: Team
    value: ANDLab, Yonsei University · I led the experiments and delivery to the client
  - label: Stack
    value: GPT-4o-mini, GPT-4.1, Milvus, bge-m3, SacreBLEU, PatClaimEval, Python
  - label: Outcome
    value: "Recommended the client's prompt + retrieval: SacreBLEU **35.4 → 37.9**, PatClaimEval **0.661 → 0.676** on 398 claims, with near-duplicates excluded"
---

## Background

A patent claim defines the legal scope of an invention. A US claim must follow USPTO drafting conventions, such as a single sentence and consistent references to earlier elements, so the task is closer to drafting than word-for-word translation.

- **Data.** 403 pairs of Korean claims and the English claims actually filed in the US, provided by Hyundai Rotem. 398 were used for testing.
- **Starting point.** Hyundai Rotem already had a patent translation prompt. With it, about 40% of claims scored 30 or below in SacreBLEU. The errors fell into three types: wrong technical terms, wording that didn't read like a patent claim, and cases where the US claim had been strategically redrafted.
- **The real question.** Many ideas can raise a score once. The client needed to know which ones would actually hold up before building on them.

## My role

<div class="project-role" markdown="1">
- Led ANDLab's work on the project, from experiment design to delivery to the client.
- Designed and ran every experiment, and set the checks that each result had to pass.
- Built the retrieval pipeline (Milvus, bge-m3) and the evaluation pipeline (SacreBLEU, PatClaimEval).
- Analyzed errors, presented the results at client meetings, and delivered a claim-by-claim result table.
</div>

## Approach

I tested seven ideas on top of the client's prompt, using GPT-4o-mini unless noted. Every result had to pass four checks before I counted it:

1. **One scorer.** Every output is cleaned and scored the same way, so numbers from different runs are comparable.
2. **No near-duplicates.** Retrieval searches the same 403 claims, so claims with the same title or similarity ≥ 0.85 are excluded. Otherwise a near-identical claim could hand the model the answer.
3. **Two metrics.** SacreBLEU measures word overlap with the filed claim. PatClaimEval, a model trained to judge patent claim quality, checks whether the output is a good claim. A real gain should show up in both.
4. **Noise and confidence.** Re-running the same setting moved the score by 0.2, and key differences are reported with 95% confidence intervals.

## Results

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">1 of 7</span>
    <span class="paper-stat-label">Ideas that improved both metrics</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">35.4 → 37.9</span>
    <span class="paper-stat-label">SacreBLEU with retrieval (near-duplicates excluded)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">0.661 → 0.676</span>
    <span class="paper-stat-label">PatClaimEval with retrieval</span>
  </div>
</div>

### Seven ideas, one kept

| Idea                                    | SacreBLEU   | PatClaimEval  | Verdict                   |
| :-------------------------------------- | :---------- | :------------ | :------------------------ |
| Split into three agents                 | 34.0 → 24.3 | –             | Dropped                   |
| Add terminology dictionary hints        | 34.0 → 32.5 | –             | Dropped                   |
| Add fixed example claims                | 34.0 → 34.1 | –             | No effect                 |
| **Retrieve 5 similar claim pairs**      | 35.4 → 37.9 | 0.661 → 0.676 | **Kept**                  |
| Skip retrieval when similarity is low   | 38.6 → 37.8 | –             | Dropped                   |
| My structured prompt + retrieval        | 37.9 → 36.5 | 0.676 → 0.653 | Dropped                   |
| Larger model (GPT-4.1-mini) + retrieval | 37.9 → 41.3 | 0.676 → 0.660 | Overlap only, not adopted |

The first three rows are round-1 scores as reported to the client. The rest use the unified scorer, under which the client's prompt alone scores 35.4.

<figure class="paper-figure paper-figure-wide">
  <img src="/assets/img/projects/patent_round1_sacrebleu.svg" alt="SacreBLEU for five round-1 configurations" loading="lazy">
  <figcaption>Round 1 with GPT-4o-mini. The three "+" rows add one kind of help to the single prompt. Only retrieval (blue) clearly helped.</figcaption>
</figure>

### All final runs

| 398 claims                                  | SacreBLEU | PatClaimEval |
| :------------------------------------------ | --------: | -----------: |
| GPT-4o-mini, no retrieval                   |      35.4 |        0.661 |
| GPT-4o-mini + retrieval                     |      37.9 |    **0.676** |
| GPT-4o-mini + structured prompt + retrieval |      36.5 |        0.653 |
| GPT-4.1-mini, no retrieval                  |      39.4 |        0.654 |
| GPT-4.1-mini + retrieval                    |      41.3 |        0.660 |
| GPT-4.1 + retrieval                         |  **41.8** |        0.663 |

Retrieval rows exclude near-duplicates. Within the same model, retrieval raised SacreBLEU (GPT-4.1-mini: +1.9, 95% CI +1.2 to +2.6). GPT-4o-mini with retrieval is the only setup that clearly improved both metrics, and it is also the cheapest, so it is the recommended setup.

## Troubleshooting

<div class="project-issue" markdown="1">
#### 1. Was retrieval just copying near-identical claims?

**Problem.** Retrieval searched the same 403 claims, so a near-identical claim from the same patent family could hand the model the answer.

**Cause.** 59 claims had retrieved a claim with the same title, and the gain was largest when the retrieved claim was very similar (+9.4 points for the 46 most similar cases).

**Fix.** Re-ran retrieval excluding claims with the same title and any claim with similarity ≥ 0.85, and re-ran the original setting once more to measure run-to-run noise.

**Result.** SacreBLEU 37.9, against 38.9 for the original rule (run-to-run difference 0.2) and 35.4 without retrieval. 64% of claims still improved, and PatClaimEval stayed the same (0.676 vs 0.677). About 1 point of the gain came from near-duplicates; the rest holds.

</div>

<div class="project-issue" markdown="1">
#### 2. My structured prompt's gain didn't hold up

**Problem.** I rewrote the prompt with explicit US drafting rules, and in round 2 it looked about 4 points better than the client's prompt.

**Cause.** That gain could not be reproduced. When the saved round-2 outputs were re-scored with the same scorer as everything else, they scored 38.3–38.5, about the same as the client's prompt with retrieval.

**Fix.** Re-ran both prompts with the same retrieval, the same model, and the same scorer.

**Result.** The structured prompt was worse on both metrics (SacreBLEU 36.5 vs 37.9, PatClaimEval 0.653 vs 0.676), so I kept the client's simpler prompt.

</div>

<div class="project-issue" markdown="1">
#### 3. A larger model raised BLEU but not claim quality

**Problem.** Switching to GPT-4.1-mini raised SacreBLEU from 37.9 to 41.3, but PatClaimEval did not rise (0.660 vs 0.676).

**Cause.** The larger models' wording was closer to the filed claims, but the quality model did not rate them as better claims. GPT-4.1 was not clearly better than GPT-4.1-mini either (+0.5 SacreBLEU, 95% CI −0.3 to +1.2).

**Fix.** Reported both metrics side by side instead of picking the setup with the highest BLEU.

**Result.** Recommended GPT-4o-mini with retrieval, the only setup that improved both metrics and the cheapest. Which metric to trust when they disagree needs review by patent attorneys.

</div>

<div class="project-issue" markdown="1">
#### 4. BLEU missed a critical error

**Problem.** In one claim "cathode" was translated as "anode", which reverses the meaning, yet BLEU was still 62.8.

**Cause.** BLEU only counts word overlap, so one wrong word barely moves it, while a valid synonym can cost many points.

**Fix.** Added PatClaimEval and compared the two metrics on every claim.

**Result.** PatClaimEval scored that claim low (0.52). From then on every result was reported with both metrics.

</div>

<div class="project-issue" markdown="1">
#### 5. Retrieval sometimes pulled the wrong wording

**Problem.** In the worst case SacreBLEU fell from 73.8 to 49.3 after adding retrieval.

**Cause.** A retrieved example used "refrigeration unit" where the claim needed "refrigerator", and the model copied it. Other models (Claude, Gemini) dropped on this claim too.

**Fix.** Tested a gate that skips retrieval when the best retrieved example is not similar enough to the claim. The decision uses only that similarity, never the reference.

**Result.** It didn't work. At a 0.70 threshold, large drops (over 10 points) went from 6 claims to 3, but the average fell from 38.6 to 37.8, because even less similar examples help on average. Similarity alone can't tell when retrieval will hurt.

</div>

<div class="project-issue" markdown="1">
#### 6. More agents, lower scores

**Problem.** Splitting the work into interpret → translate → polish agents scored 24.3, about 10 points below a single prompt (34.0). A general term dictionary (about 850K entries) also lowered the score, from 34.0 to 32.5.

**Cause.** Each agent step was a separate call, so context was lost between steps; the final style step no longer saw how the first step had read the claim's scope. The dictionary's contribution stayed small even in a later 60-claim ablation.

**Fix.** Kept a single prompt and put the effort into retrieving better examples instead.

**Result.** Retrieval gave +4.6 points in round 1, the largest single gain.

</div>

## Limitations and next steps

- The reference is the claim actually filed in the US, which was sometimes strategically redrafted. Even a perfect translation can't match those claims exactly.
- Near-duplicates were excluded by title and similarity. Claims from the same patent family with different titles can't be identified without family data, so a separate corpus would still be the cleanest test.
- SacreBLEU and PatClaimEval disagreed on the larger models. A small review by patent attorneys would show which one tracks real claim quality.
- A second phase (choosing examples by patent classification, and fine-tuning once 2,000+ pairs are available) was proposed but depended on more data from the client.
