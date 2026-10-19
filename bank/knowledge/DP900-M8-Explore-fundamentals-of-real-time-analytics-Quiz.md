# DP-900 Quiz: Module 8 — Explore fundamentals of real-time analytics

**Domain 4:** Describe an analytics workload on Azure (25–30% of exam)
**Learning path:** Introduction to Microsoft Azure Data analytics in Azure
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** Which of these is the module's real-world example of batch processing?

- A) A building monitor that triggers fire alarms and unlocks doors
- B) A credit card company sending one bill for a month of purchases
- C) A bank rebalancing portfolios as stock prices move
- D) A real-estate site recommending homes based on a phone's location

**2.** What is the typical latency of stream processing?

- A) A few hours
- B) Several minutes to an hour
- C) Overnight, during off-peak periods
- D) Seconds or milliseconds

**3.** In a stream processing architecture, what is the continuously running query that selects, projects, or aggregates event data over time windows called?

- A) A perpetual query
- B) A sink
- C) A batch job
- D) A micro batch

**4.** Which component of Microsoft Fabric Real-Time Intelligence triggers automated actions when streaming data meets defined conditions?

- A) Eventstream
- B) Eventhouse
- C) Activator
- D) Real-time hub

**5.** Which ingestion service is similar to Azure Event Hubs but optimized for managing event data from Internet-of-things devices?

- A) Azure IoT Hub
- B) Azure Event Hubs Premium
- C) Apache Kafka
- D) Azure Data Lake Storage Gen2

**6.** Which language do you use to query data in a Fabric Eventhouse?

- A) Transact-SQL (T-SQL)
- B) Data Analysis Expressions (DAX)
- C) Cassandra Query Language (CQL)
- D) Kusto Query Language (KQL)

**7.** Which architecture removes the separate batch layer, treating all data as a continuous stream and replaying it when historical reprocessing is needed?

- A) Lambda architecture
- B) Kappa architecture
- C) Delta architecture
- D) Medallion architecture

**8.** Which part of Fabric Real-Time Intelligence acts as a centralized catalog for discovering and sharing streaming data across an organization?

- A) Real-time hub
- B) Eventstream
- C) OneLake file explorer
- D) Microsoft Purview

---

## Section B: True or false

**9.** Azure Event Hubs delivers events in order within a partition and guarantees at-least-once delivery.

**10.** Stream processing is typically used for complex analytics across an entire dataset, while batch processing is used for simple rolling averages.

**11.** Azure Stream Analytics is available only inside Microsoft Fabric.

**12.** The same Delta table can be used as a streaming sink and as a source for batch queries.

**13.** Azure Data Lake Storage Gen2 is used only in batch processing and can't act as a source of streaming data.

**14.** Even when real-time analysis isn't required, streaming technologies are often used to capture real-time data and store it for later batch processing.

---

## Section C: Scenarios

**15.** A factory's sensors send a temperature reading every second. Within Microsoft Fabric, the operations team wants a live dashboard of the average temperature per minute, an automatic alert when a reading crosses a threshold, and storage they can query later. Which design fits?

- A) An hourly Fabric Data Factory pipeline into a Warehouse, with a Power BI report on top
- B) Azure Data Explorer for queries, with Microsoft Purview to raise threshold alerts
- C) A nightly Spark notebook job that writes readings to a Lakehouse Delta table
- D) An Eventstream into an Eventhouse, with a Real-Time Dashboard and Activator alerts

**16.** A data engineering team already uses Apache Spark in Azure Databricks for batch processing. It now wants to process events from Azure Event Hubs in real time, and keep a single data store that serves both live ingestion and historical analysis. What should it use?

- A) An Azure Stream Analytics job that writes results to Azure SQL Database
- B) Fabric Real-Time Dashboards built over an Eventhouse KQL database
- C) Spark Structured Streaming that writes results to Delta Lake tables
- D) A nightly Azure Data Factory job that copies Event Hubs data to Blob storage

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. B** — Monthly credit card billing collects purchases and processes them together, which is batch. *Not A:* fire monitoring is the module's time-critical streaming example. *Not C/D:* stock rebalancing and geo-based recommendations are its streaming examples.

**2. D** — Stream processing latency is typically seconds or milliseconds. *Not A:* a few hours is typical for batch. *Not B/C:* these describe batch-style delays.

**3. A** — A perpetual query runs continuously on event data, often aggregating over temporal windows such as per minute. *Not B:* the sink is the output. *Not C:* batch jobs process stored groups of data. *Not D:* a micro batch is a small group of records, not the query.

**4. C** — Activator triggers automated actions when conditions are met. *Not A:* Eventstream ingests, routes, and transforms streaming data. *Not B:* Eventhouse stores and queries time-series and event data. *Not D:* the real-time hub is the catalog of streaming data.

**5. A** — IoT Hub is similar to Event Hubs but optimized for IoT device data. *Not B:* not described in the module. *Not C:* Kafka is an open-source ingestion option commonly used with Spark. *Not D:* ADLS Gen2 is storage, mostly for batch.

**6. D** — Eventhouse is queried with KQL (Kusto Query Language). *Not A:* T-SQL is for Fabric Warehouse and Azure SQL. *Not B:* DAX is for semantic model measures. *Not C:* CQL is for Cassandra.

**7. B** — Kappa eliminates the separate batch layer. *Not A:* the lambda architecture *combines* batch and stream layers. *Not C:* delta is another combined architecture. *Not D:* medallion is a lakehouse data-quality layering pattern.

**8. A** — The real-time hub catalogs streaming data sources so teams can discover and share them. *Not B:* Eventstream processes streams. *Not C:* OneLake file explorer browses OneLake files from Windows. *Not D:* Purview is enterprise governance, not the Real-Time Intelligence catalog.

**9. True** — Events within a partition are delivered in order, with at-least-once delivery.

**10. False** — It's reversed. Batch processing suits complex analytics over full datasets; stream processing suits simple responses, aggregates, and rolling averages over recent data or time windows.

**11. False** — Azure Stream Analytics is a PaaS service you can use for standalone or hybrid streaming *outside* Fabric.

**12. True** — Delta Lake unifies batch and streaming: one table can be a streaming sink and a batch source.

**13. False** — ADLS Gen2 is often used in batch scenarios but can also be a source of streaming data.

**14. True** — Streaming tech often captures data for later batch processing — like directing all the cars into a parking lot before counting them.

**15. D** — Eventstream ingests the sensor data, Eventhouse stores it for querying, a Real-Time Dashboard shows live per-minute averages, and Activator raises alerts on thresholds, all within Fabric. *Not A/C:* hourly or nightly batches aren't real-time. *Not B:* Purview handles governance, not alerting, and Data Explorer is outside Fabric.

**16. C** — Spark Structured Streaming suits teams already using Spark, and writing to Delta Lake gives one store for real-time ingestion and historical analysis. *Not A:* Stream Analytics works, but doesn't extend existing Spark work and splits storage from the data lake. *Not B:* that's a Fabric solution, not an extension of Databricks Spark. *Not D:* nightly copies aren't real-time.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Understand batch and stream processing](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-stream-processing/2-batch-stream)
- [Explore common elements of stream processing architecture](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-stream-processing/3-explore-common-elements)
- [Explore Microsoft Fabric Real-Time Intelligence](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-stream-processing/4-fabric-real-time-intelligence)
- [Explore Apache Spark structured streaming](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-stream-processing/5-spark-streaming)
