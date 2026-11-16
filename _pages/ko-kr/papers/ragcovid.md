---
page_id: paper-ragcovid
layout: paper
paper: ragcovid
title: RAG 기반 뉴스 정보와 LLM을 활용한 시계열 예측
description: "RAG 기반 뉴스 정보와 LLM을 활용한 시계열 예측: COVID-19 데이터를 중심으로 (JICS 2025)"
permalink: /publications/ragcovid/
teaser_caption: "예측 모델의 입력 구조. 최근 14일 확진자 수를 자연어 문장으로 변환하고, 검색한 뉴스 기사를 LLM으로 요약한 뒤, 두 정보를 하나의 프롬프트로 결합해 다음 날 확진자 수를 예측합니다."
tldr: "기존 수치 기반 예측 모델과 LLM 예측은 정책 변화·집단 감염 등 외부 요인을 반영하지 못합니다. 예측일 직전 3일간의 뉴스를 검색·요약해 LLM 입력에 통합하는 시계열 예측 방법을 제안했으며, 국내 COVID-19 일별 확진자 예측에서 LSTM·Transformer 등 수치 기반 모델과 뉴스 미사용 LLM보다 낮은 오차를 기록했습니다."
---

## 연구 배경

수치 기반 예측 모델(LSTM, TCN, Transformer, Informer)은 과거 수치만 입력받아 외부 요인에 의한 급변을 포착하지 못합니다. PromptCast, TimeRAG 등 기존 LLM 기반 예측 역시 사전 학습 지식이나 과거 수치 패턴에만 의존해, 학습 이후 발생한 정보를 반영할 수 없습니다. COVID-19 확진자 수는 사회적 거리두기, 집단 감염 등에 따라 단기간에 급변하므로, 외부 정보 반영 효과를 평가하기에 적합합니다.

## 방법

- **데이터.** 질병관리청 일별 신규 확진자 수(2020년 1월 ~ 2023년 8월). 테스트 구간은 2022년 8월 ~ 2023년 8월입니다.
- **뉴스 DB.** 네이버 뉴스의 코로나 확진자 관련 기사를 날짜별 최대 50건 수집해 Milvus 벡터 DB에 구축했습니다.
- **검색·요약.** 예측일 이전 3일간 날짜별로 bge-m3 기반 상위 3건(총 9건)을 검색하고, GPT-4o-mini로 기사별 최대 2문장으로 요약했습니다.
- **입력 구성.** 최근 14일 확진자 수를 자연어 템플릿으로 변환해 요약문과 함께 GPT-4o-mini에 입력하고, 다음 날 확진자 수를 예측했습니다.
- **실험 조건.** 뉴스 사용·요약·Few-shot 여부에 따른 LLM 6개 조건을 수치 기반 모델 4종과 비교했습니다.

## 결과

뉴스를 사용한 4개 조건 모두 수치 기반 모델 4종보다 RMSE·MAE가 낮았으며, 뉴스 요약 시 오차가 추가로 감소했습니다.

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">13,764</span>
    <span class="paper-stat-label">뉴스 요약 + Zero-shot RMSE (전체 최저)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">−14.6%</span>
    <span class="paper-stat-label">최고 수치 모델(Transformer) 대비 RMSE</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">−22.3%</span>
    <span class="paper-stat-label">최고 수치 모델(LSTM) 대비 MAE</span>
  </div>
</div>

| 모델                         |          RMSE |          MAE |
| :--------------------------- | ------------: | -----------: |
| LSTM                         |     16,306.46 |    10,783.12 |
| TCN                          |     20,209.95 |    14,368.54 |
| Transformer                  |     16,117.97 |    11,421.68 |
| Informer                     |     21,077.38 |    15,680.75 |
| LLM, 뉴스 미사용 Zero-shot   |     16,243.38 |     9,470.53 |
| LLM, 뉴스 미사용 Few-shot    |     17,116.12 |     9,705.56 |
| LLM, 뉴스 원문 Zero-shot     |     15,818.04 |     9,434.50 |
| LLM, 뉴스 원문 Few-shot      |     14,607.35 |     8,912.60 |
| **LLM, 뉴스 요약 Zero-shot** | **13,764.36** | **8,380.23** |
| LLM, 뉴스 요약 Few-shot      |     14,553.25 |     9,067.30 |

뉴스 미사용 LLM 대비 뉴스 요약 적용 시 RMSE 15.3%, MAE 11.5% 감소했습니다. 요약은 핵심 정보를 압축해 긴 기사로 인한 입력 잡음을 줄입니다.
