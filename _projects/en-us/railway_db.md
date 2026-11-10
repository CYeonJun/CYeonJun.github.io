---
page_id: railway_db
layout: project
title: Open-Source Data Platform for Railway Control
description: Replacing a commercial database in a railway control system with TiDB + ClickHouse, validated end to end.
importance: 1
img: assets/img/projects/railway_db_architecture.svg
context: Industry collaboration with Hyundai Rotem
period: Mar 2026 – Aug 2026
tags: [TiDB, ClickHouse, Kafka, PostgreSQL, Benchmarking, Python]
teaser: /assets/img/projects/railway_db_architecture.svg
teaser_caption: "The validated pipeline. Simulated train-control messages flow through Kafka into TiDB (system of record) and ClickHouse (analytics), then out to Parquet files for the AI server."
tldr: "Hyundai Rotem wanted to know whether its railway control system could move from a commercial database to open-source software. I generated realistic test data, compared six database setups, and tuned a Kafka → TiDB → ClickHouse pipeline until it met the client's latency targets in a 12-hour run."
---

## Background

A railway control (CBTC) system writes a constant stream of train states and events, and at the same time needs fast analytic queries for monitoring and AI models. It ran on a commercial distributed database inside a closed, on-premises network, and Hyundai Rotem wanted to know whether an open-source setup could replace it.

- **No real data.** Operational data could not leave the client. Only a column specification (about 45 tables and 600 columns) was available.
- **Client targets.** Analytic queries at P95 ≤ 50 ms and P99 ≤ 100 ms, and a stable 12-hour run. The client also asked for duplicate handling, data freshness, failure recovery, and MySQL compatibility.

## My role

<div class="project-role" markdown="1">
- Led ANDLab's side of the project and was the main contact with the client. I presented results at every meeting from March to August and wrote the final handover.
- Built the synthetic data generator.
- Designed and ran all database benchmarks and the end-to-end pipeline tests.
- Found the bottlenecks and implemented the optimizations, including batched writes across workers.
</div>

## Approach

**1. Generate realistic data.** I built a generator that reads the column specification and infers a rule for each column (value lists, ranges, formats). Master tables are generated first so that every reference between tables stays valid. Train states change over time with per-column probabilities, and events cluster around rush hours.

**2. Compare six candidates.** MySQL, PostgreSQL, TiDB, ClickHouse, and the two combinations TiDB + ClickHouse and PostgreSQL + ClickHouse. Each was tested on loading speed, mixed write-and-query load, failover, and replay of duplicate data.

**3. Validate the whole pipeline.** Kafka (73 topics) → processing workers → database → ClickHouse → Parquet → mock AI server, on two servers and two PCs, at up to 1,000 messages per second.

**4. Optimize and run for 12 hours.** I profiled where time was spent, fixed the bottlenecks one by one, and ran the final setup for 12 hours.

## Results

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">293M rows</span>
    <span class="paper-stat-label">Synthetic data across 44 tables, all references valid</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">219.9 → 18.3 ms</span>
    <span class="paper-stat-label">Analytic query P95 after optimization</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">24.57M</span>
    <span class="paper-stat-label">Records processed in 12 hours with no loss</span>
  </div>
</div>

### Single databases can't do both jobs

With 10M rows per candidate on four hosts, every single database slowed down sharply when it had to handle writes and analytic queries at the same time. Adding ClickHouse for analytics kept query latency low.

| Candidate       | Load (rows/s) | Mixed load, query P95 | Long run, query P99 |
| :-------------- | ------------: | --------------------: | ------------------: |
| MySQL           |        28,817 |              2,486 ms |           11,348 ms |
| TiDB            |        10,420 |                671 ms |              714 ms |
| PostgreSQL      |        33,484 |                154 ms |              308 ms |
| TiDB + CH       |        27,067 |                136 ms |         **66.2 ms** |
| PostgreSQL + CH |        33,059 |           **99.7 ms** |              112 ms |

### Finding and fixing bottlenecks

| Problem                                      | Fix                                                                 | Result                                                                |
| :------------------------------------------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| Analytic queries recomputed the full history | Per-topic summary table                                             | Query P95 219.9 → **18.3 ms**                                         |
| Kafka messages piled up under load           | Reused connections, merged writes, removed a read before each write | Lag P95 **−43.8%**                                                    |
| Each worker wrote small batches              | Batched writes across workers                                       | Write calls **14.3× fewer**, peak lag 11,894 → 1,406 (**8.5×** lower) |

### 12-hour run

The final setup processed all 24.57M records with no restarts and no write failures. Row counts and checksums matched between TiDB and ClickHouse, and query latency was P95 26.46 ms and P99 77.01 ms, within the client's targets.

**Recommendation delivered to the client:** TiDB + ClickHouse. TiDB speaks the MySQL protocol, so existing code needs few changes, and it scales by adding nodes. PostgreSQL + ClickHouse also passed and was documented as an alternative.

## Limitations and next steps

- Everything was validated on synthetic data and lab hardware. Moving to production needs another round of measurement with real data and equipment.
- Batched writes trade slightly higher lag in normal operation (median 93 → 194 messages) for much lower peaks. The remaining peak of 1,406 is still above our internal goal of 1,000.
- Some operational checks, such as file transfer to the storage server and failover of whole machines, could not be tested in the lab and were handed over as open items.
