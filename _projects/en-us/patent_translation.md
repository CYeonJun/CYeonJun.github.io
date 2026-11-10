---
page_id: patent_translation
layout: project
title: LLM Patent Claim Translation
description: Turning Korean patent claims into US-style English claims with retrieval-augmented LLMs.
importance: 2
img: assets/img/projects/patent_pipeline.svg
context: Industry collaboration with Hyundai Rotem
period: Dec 2025 – Mar 2026
tags: [LLM, RAG, Prompt Engineering, Evaluation, Milvus]
teaser: /assets/img/projects/patent_pipeline.svg
teaser_caption: "The final pipeline. For each Korean claim, five similar Korean–English claim pairs are retrieved and added to a structured prompt. The output is scored against the claim that was actually filed in the US."
tldr: "Hyundai Rotem also files its Korean patents in the US, which means rewriting every claim in US patent style. I built and evaluated an LLM pipeline for this. Showing the model similar past claims worked far better than splitting the task across several agents."
---

## Background

A patent claim defines the legal scope of an invention. A US claim must follow USPTO drafting conventions, such as a single sentence and consistent references to earlier elements, so the task is closer to drafting than word-for-word translation.

- **Data.** 403 pairs of Korean claims and the English claims actually filed in the US, provided by Hyundai Rotem. 398 were used for testing.
- **Starting point.** With the prompt Hyundai Rotem was using, about 40% of claims scored 30 or below in SacreBLEU. The errors fell into three types: wrong technical terms, wording that didn't read like a patent claim, and cases where the US claim had been strategically redrafted.

## My role

<div class="project-role" markdown="1">
- Led ANDLab's work on the project, from experiment design to delivery to the client.
- Designed and ran all experiments: 8 configurations in the first round, then a structured prompt compared across models.
- Built the retrieval pipeline (Milvus, bge-m3) and the evaluation pipeline (SacreBLEU, PatClaimEval).
- Analyzed errors, presented the results at client meetings, and delivered a claim-by-claim result table.
</div>

## Approach

**Round 1: what actually helps?** Using GPT-4o-mini, I compared a three-step multi-agent pipeline (interpret → translate → polish style) against a single prompt. I then added three kinds of help to each: terminology dictionary hints, fixed example claims, and retrieval of the five most similar claim pairs.

**Round 2: a better prompt.** I rewrote the prompt into a structured version with explicit US drafting rules, combined it with retrieval, and compared GPT-4o-mini and Gemini 2.5 Flash.

**Evaluation.** I used two metrics, because BLEU alone can be misleading. In one claim, "cathode" was translated as "anode", a critical error, yet BLEU was still 62.8. PatClaimEval, a model trained to judge patent claim quality, scored it low (0.52).

## Results

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">34.0 → 38.6</span>
    <span class="paper-stat-label">SacreBLEU with retrieval (round 1)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">38.8 → 42.7</span>
    <span class="paper-stat-label">SacreBLEU with structured prompt + retrieval (round 2)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">70%</span>
    <span class="paper-stat-label">Claims improved in round 2</span>
  </div>
</div>

### Round 1: retrieval helps, more agents don't

| SacreBLEU (398 claims) | Plain | + Dictionary | + Fixed examples | + Retrieval |
| :--------------------- | ----: | -----------: | ---------------: | ----------: |
| Multi-agent pipeline   |  24.3 |         24.3 |             24.4 |           – |
| Single prompt          |  34.0 |         32.5 |             34.1 |    **38.6** |

- **Similar examples matter most.** Retrieving similar claims raised SacreBLEU by 4.6 points.
- **More agents made it worse.** The single prompt beat the multi-agent pipeline by about 10 points. Splitting the work across calls lost context between the steps.
- **The dictionary hurt.** Adding terminology hints lowered the score from 34.0 to 32.5.

### Round 2: structured prompt

| 398 claims                                | SacreBLEU | PatClaimEval |
| :---------------------------------------- | --------: | -----------: |
| Baseline prompt (GPT-4o-mini)             |      38.8 |         69.3 |
| Structured + retrieval (GPT-4o-mini)      |      42.7 |         70.2 |
| Structured + retrieval (Gemini 2.5 Flash) |  **43.3** |     **71.1** |

280 of 398 claims (70%) improved. Retrieval can also backfire: in the worst case a retrieved example pushed the model toward the wrong term, and the score fell from 73.8 to 49.3. I proposed skipping retrieval when the baseline output is already strong.

## Limitations and next steps

- The reference is the claim actually filed in the US, which was sometimes strategically redrafted. Even a perfect translation can't match those claims exactly.
- Retrieval searched the same 403-claim pool (excluding the claim itself). A larger, separate corpus is needed to rule out overlap between similar claims.
- A second phase (choosing examples by patent classification, and fine-tuning once 2,000+ pairs are available) was proposed but depended on more data from the client.
