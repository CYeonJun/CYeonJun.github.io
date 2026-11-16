---
page_id: paper-ragcovid
layout: paper
paper: ragcovid
title: RAG-based News for Time Series Forecasting
description: "Time Series Forecasting Using RAG-based News Information and Large Language Models: A Case Study on COVID-19 Data (JICS 2025)"
permalink: /publications/ragcovid/
teaser_caption: "Input structure of the forecasting model. The last 14 days of case counts are converted into a natural-language sentence, retrieved news articles are summarized by an LLM, and both are combined into a single prompt that asks for the next day's case count."
tldr: "Numerical forecasting models and existing LLM-based forecasting cannot reflect external factors such as policy changes or cluster outbreaks. We retrieve and summarize news from the three days before the target date and add it to the LLM input. On daily COVID-19 cases in South Korea, this produced lower errors than numerical models such as LSTM and Transformer and than LLM forecasting without news."
---

## Motivation

Numerical forecasting models (LSTM, TCN, Transformer, Informer) take only past values as input, so they cannot capture sudden changes driven by external events. Existing LLM-based forecasting methods such as PromptCast and TimeRAG rely on pre-trained knowledge or on past numerical patterns, and cannot reflect information that appears after training. COVID-19 case counts change sharply with social distancing measures and cluster outbreaks, which makes them a suitable test of whether external information improves forecasting.

## Method

- **Data.** Daily confirmed cases from the Korea Disease Control and Prevention Agency (Jan 2020 – Aug 2023). The test period is Aug 2022 – Aug 2023.
- **News database.** Articles on COVID-19 cases from Naver News, up to 50 per day, stored in a Milvus vector database.
- **Retrieval and summarization.** For each of the three days before the target date, the top 3 articles are retrieved with bge-m3 (9 in total), and GPT-4o-mini summarizes each into at most two sentences.
- **Input.** The last 14 days of case counts are converted into a natural-language template and given to GPT-4o-mini together with the summaries, which predicts the next day's count.
- **Conditions.** Six LLM conditions (news or no news, raw or summarized news, zero-shot or few-shot) were compared with four numerical models.

## Results

All four conditions that used news outperformed the four numerical models on both RMSE and MAE, and summarizing the news reduced errors further.

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">13,764</span>
    <span class="paper-stat-label">RMSE with summarized news, zero-shot (lowest overall)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">−14.6%</span>
    <span class="paper-stat-label">RMSE vs. the best numerical model (Transformer)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">−22.3%</span>
    <span class="paper-stat-label">MAE vs. the best numerical model (LSTM)</span>
  </div>
</div>

| Model                               |          RMSE |          MAE |
| :---------------------------------- | ------------: | -----------: |
| LSTM                                |     16,306.46 |    10,783.12 |
| TCN                                 |     20,209.95 |    14,368.54 |
| Transformer                         |     16,117.97 |    11,421.68 |
| Informer                            |     21,077.38 |    15,680.75 |
| LLM, no news, zero-shot             |     16,243.38 |     9,470.53 |
| LLM, no news, few-shot              |     17,116.12 |     9,705.56 |
| LLM, raw news, zero-shot            |     15,818.04 |     9,434.50 |
| LLM, raw news, few-shot             |     14,607.35 |     8,912.60 |
| **LLM, summarized news, zero-shot** | **13,764.36** | **8,380.23** |
| LLM, summarized news, few-shot      |     14,553.25 |     9,067.30 |

Compared with the LLM without news, summarized news reduced RMSE by 15.3% and MAE by 11.5%. Summaries condense the key information and reduce the noise of long articles in the input.
