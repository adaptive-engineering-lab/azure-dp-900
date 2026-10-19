# DP-900 Quiz: Module 6 — Explore fundamentals of Azure Cosmos DB

**Domain 3:** Describe considerations for working with non-relational data on Azure (15–20% of exam)
**Learning path:** Introduction to Microsoft Azure Data non-relational data in Azure
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** In the Azure Cosmos DB resource hierarchy, at which level do you configure the partition key, throughput, indexing policy, and optional time-to-live (TTL)?

- A) Account
- B) Container
- C) Database
- D) Item

**2.** Which Cosmos DB consistency level is the most widely used for both single-region and globally distributed applications?

- A) Session
- B) Strong
- C) Bounded staleness
- D) Eventual

**3.** Which consistency level guarantees that reads never see writes out of order, but may return stale data?

- A) Session
- B) Eventual
- C) Consistent prefix
- D) Bounded staleness

**4.** One request unit (RU) is roughly the cost of which operation?

- A) Writing a 1-KB item and indexing all of its properties
- B) Running a query that scans across every partition
- C) Storing 1 GB of data in a container for one hour
- D) Reading a single 1-KB item by its ID and partition key

**5.** How much data can a single logical partition in Cosmos DB hold?

- A) Up to 20 GB
- B) Up to 10 GB
- C) Up to 50 GB
- D) Up to 100 GB

**6.** Which API is the native Cosmos DB API and was previously called the SQL API?

- A) Table
- B) NoSQL
- C) MongoDB
- D) Apache Cassandra

**7.** Which query language does Azure Cosmos DB for Apache Cassandra use?

- A) MongoDB Query Language (MQL)
- B) Kusto Query Language (KQL)
- C) Gremlin
- D) Cassandra Query Language (CQL)

**8.** Which of the following is NOT one of the five Cosmos DB APIs presented in this module?

- A) Table
- B) Apache Gremlin
- C) PostgreSQL
- D) MongoDB

---

## Section B: True or false

**9.** Items stored in the same Cosmos DB container don't need to share the same structure.

**10.** In Cosmos DB, you must manually define an index on each property you plan to query.

**11.** Serverless Cosmos DB accounts are limited to a single Azure region.

**12.** Shared throughput is set at the database level and can be shared across an unlimited number of containers.

**13.** Cosmos DB is the best fit for workloads that depend on complex multi-table joins.

**14.** Cosmos DB for NoSQL supports Fabric mirroring, which replicates operational data into Microsoft Fabric without consuming request units from the transactional workload.

---

## Section C: Scenarios

**15.** A social networking app stores users, posts, and friendships. Its key feature is recommending "friends of friends," which means traversing relationships between people. Which Cosmos DB API fits best?

- A) Apache Gremlin
- B) Apache Cassandra
- C) Table
- D) MongoDB

**16.** A gaming company has players on three continents. Each player must read and write to the nearest region with low latency, and the company needs a 99.999% availability SLA. Traffic is hard to predict, but the company wants to cap its maximum throughput. Which configuration fits?

- A) A serverless account replicated to three regions
- B) Provisioned autoscale throughput with multi-region writes in three regions
- C) A serverless account in one region with Strong consistency
- D) Shared throughput across 30 containers in a single region

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. B** — The container is the primary unit of storage and scaling, where you set the partition key, throughput, indexing policy, and TTL. *Not A:* the account is the top-level Azure resource. *Not C:* a database is a logical namespace grouping containers (shared throughput can be set there, but not the partition key or indexing policy). *Not D:* items are the data itself.

**2. A** — Session is the most widely used level; consistency is guaranteed within a single client session. *Not B:* Strong is the strictest. *Not C/D:* not described as most widely used.

**3. C** — Consistent prefix: reads never see out-of-order writes, but data may be stale. *Not A:* Session guarantees consistency within a client session. *Not B:* Eventual only promises that replicas converge over time. *Not D:* Bounded staleness lets reads lag by a configurable time or version count.

**4. D** — One RU is roughly the cost of reading a single 1-KB item by its ID and partition key. *Not A/B:* writes and cross-partition queries usually consume more RUs. *Not C:* storage isn't measured in RUs.

**5. A** — Each logical partition can hold up to 20 GB, which is why a partition key with many distinct, evenly spread values matters.

**6. B** — Cosmos DB for NoSQL is the native API (formerly the SQL API); it stores JSON and uses SQL-like queries. *Not A/C/D:* these are compatibility APIs for Table Storage, MongoDB, and Cassandra workloads.

**7. D** — Cassandra uses CQL, which has SQL-like syntax. *Not A:* MQL is for the MongoDB API. *Not B:* KQL is for Azure Data Explorer and Fabric Eventhouse. *Not C:* Gremlin is for graph data.

**8. C** — The five APIs are NoSQL, MongoDB, Table, Apache Cassandra, and Apache Gremlin. Azure Cosmos DB for PostgreSQL is a separate offering on a retirement path and isn't recommended for new projects.

**9. True** — Cosmos DB is schema-agnostic; one item can have five properties and another in the same container 15 different ones.

**10. False** — Cosmos DB automatically creates and maintains indexes on all item properties by default.

**11. True** — Serverless accounts are single-region; global distribution requires a provisioned throughput account.

**12. False** — Shared database-level throughput can be shared across up to 25 containers.

**13. False** — The module says that if your app depends on complex multi-table joins, Azure SQL Database is better suited.

**14. True** — Fabric mirroring replicates NoSQL API data into Fabric with no ETL pipeline, without consuming RUs or affecting the transactional workload.

**15. A** — Gremlin is for graph data (vertices and edges), suited to social networks and recommendation engines where relationships matter as much as the data. *Not B:* Cassandra is a column-family model. *Not C:* Table is key-value. *Not D:* MongoDB is a document model.

**16. B** — Multi-region writes give each region low-latency writes and the 99.999% SLA; autoscale lets you set a maximum RU/s and adjusts within it. *Not A/C:* serverless accounts are limited to one region. *Not D:* a single region can't serve three continents with low latency, and shared throughput allows up to 25 containers.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Describe Azure Cosmos DB](https://learn.microsoft.com/en-us/training/modules/explore-non-relational-data-stores-azure/2-describe-azure-cosmos-db)
- [Identify Azure Cosmos DB APIs](https://learn.microsoft.com/en-us/training/modules/explore-non-relational-data-stores-azure/3-cosmos-db-apis)
