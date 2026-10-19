# DP-900 Quiz: Module 7 — Explore fundamentals of large-scale analytics

**Domain 4:** Describe an analytics workload on Azure (25–30% of exam)
**Learning path:** Introduction to Microsoft Azure Data analytics in Azure
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** What is the difference between an ETL process and an ELT process?

- A) ETL transforms data before loading it; ELT copies data to the store, then transforms it
- B) ETL is used for streaming data, while ELT is used for batch data
- C) ETL can load only into data lakes, while ELT can load only into data warehouses
- D) ETL is supported by Microsoft Fabric, while ELT is supported only by Azure Databricks

**2.** A data warehouse has a central fact table related to several dimension tables, and the Product dimension is further related to a Category table. What is this design called?

- A) Star schema
- B) Normalized OLTP schema
- C) Snowflake schema
- D) Medallion schema

**3.** Which approach do data lakes commonly use to apply structure to semi-structured files?

- A) Schema-on-write, with constraints applied when data is stored
- B) A fixed relational schema enforced during every load
- C) A normalized schema with foreign key relationships
- D) Schema-on-read, defined when the data is read for analysis

**4.** Which Microsoft Fabric feature makes data in external storage, such as Amazon S3, appear in a lakehouse without copying it?

- A) Mirroring
- B) OneLake shortcut
- C) Dataflows Gen2
- D) Eventstream

**5.** Which Fabric feature continuously replicates an external database, such as Azure SQL Database or Snowflake, into OneLake in near-real-time without you authoring a pipeline?

- A) OneLake shortcut
- B) A pipeline Copy activity
- C) A Fabric notebook
- D) Mirroring

**6.** Which Fabric Data Factory tool provides a low-code, visual experience for building reusable transformation logic with Power Query?

- A) Pipelines
- B) Notebooks
- C) Dataflows Gen2
- D) Lakeflow pipelines

**7.** In Azure Databricks, which option lets you declare what output tables should contain, while Databricks handles execution order, dependency tracking, and incremental processing?

- A) Lakeflow pipelines
- B) Unity Catalog
- C) Databricks SQL warehouse
- D) Genie

**8.** Which semantic model storage mode in Microsoft Fabric loads data directly from Delta tables in OneLake, without importing a separate copy into the model?

- A) Import mode
- B) Mirroring mode
- C) Shortcut mode
- D) Direct Lake

---

## Section B: True or false

**9.** Like traditional cubes, modern semantic models pre-aggregate all numeric values in advance rather than computing aggregations at query time.

**10.** When you create a Fabric Lakehouse, a SQL analytics endpoint is created for it automatically.

**11.** A Fabric Warehouse stores its data outside OneLake, which is how it provides strong schema enforcement.

**12.** Unity Catalog provides governance for Azure Databricks, including fine-grained access control, data lineage, and discovery.

**13.** Azure Data Factory uses linked services in the same way that Fabric Data Factory uses connections.

**14.** Genie in Azure Databricks is a low-code designer for building ETL pipelines.

---

## Section C: Scenarios

**15.** A team using Microsoft Fabric has highly structured sales data. Everyone on the team writes SQL, and the solution needs strong schema enforcement and support for many simultaneous users. Which analytical store should they choose?

- A) A Fabric Lakehouse queried mainly through Spark notebooks
- B) An Eventhouse with KQL databases
- C) A Fabric Warehouse queried with T-SQL
- D) A OneLake shortcut to an ADLS Gen2 account

**16.** Compliance rules require a dataset to stay in its existing ADLS Gen2 account, with no copies, but analysts want to query it from a Fabric Lakehouse. Separately, the team must load data nightly from an on-premises SQL Server into Azure SQL Database, outside of Fabric. Which combination fits?

- A) Mirroring for the ADLS Gen2 data; Fabric notebooks for the nightly load
- B) A OneLake shortcut for the ADLS Gen2 data; Azure Data Factory for the nightly load
- C) Dataflows Gen2 for the ADLS Gen2 data; Eventstream for the nightly load
- D) A OneLake shortcut for the ADLS Gen2 data; Fabric Mirroring for the nightly load

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. A** — In ETL, data is transformed before loading into the analytical store; in ELT, it's copied to the store and then transformed. *Not B:* both describe loading; ingestion covers both batch and streaming. *Not C/D:* neither is limited to one store type or platform.

**2. C** — Adding tables related to dimension tables (such as Product → Category) to represent hierarchies extends a star schema into a snowflake schema. *Not A:* a star schema has dimensions related only to the fact table. *Not B:* OLTP schemas aren't fact/dimension designs. *Not D:* medallion is a lakehouse layering pattern (Bronze/Silver/Gold).

**3. D** — Data lakes often use schema-on-read: tabular schemas are defined when data is read, with no constraints applied when it's stored. *Not A/B/C:* these describe enforcing structure at write time, which is how data warehouses work.

**4. B** — A shortcut is a live reference to external storage (ADLS Gen2, Amazon S3, Google Cloud Storage, or OneLake) that makes data appear in your lakehouse with no movement or duplication. *Not A:* Mirroring *replicates* data into OneLake. *Not C:* Dataflows Gen2 transforms data. *Not D:* Eventstream ingests streaming events.

**5. D** — Mirroring continuously replicates an external database into OneLake in near-real-time, handling change tracking automatically. *Not A:* a shortcut references storage rather than replicating a database. *Not B/C:* these would require you to author the ingestion.

**6. C** — Dataflows Gen2 is the low-code, visual Power Query tool. *Not A:* pipelines orchestrate multi-step workflows. *Not B:* notebooks are code-first. *Not D:* Lakeflow pipelines are an Azure Databricks feature.

**7. A** — Lakeflow pipelines are declarative: you define the outputs, Databricks handles the rest. *Not B:* Unity Catalog is governance. *Not C:* a SQL warehouse runs analytical queries. *Not D:* Genie answers natural language questions.

**8. D** — Direct Lake loads data from Delta tables in OneLake without importing a separate copy. *Not A:* Import mode copies data into the model. *Not B/C:* Mirroring and shortcuts are ingestion features, not semantic model modes.

**9. False** — Historically, cubes pre-aggregated data. Today's semantic models define measures in DAX and compute aggregations at query time.

**10. True** — A SQL analytics endpoint is created automatically with every Fabric Lakehouse.

**11. False** — Fabric Warehouse data lives in OneLake too, giving the Lakehouse and Warehouse a unified storage foundation.

**12. True** — Unity Catalog is Azure Databricks' unified governance layer for access control, lineage, and discovery.

**13. True** — Azure Data Factory's pipeline model uses linked services in place of Fabric connections, so skills transfer between the two.

**14. False** — Genie is an AI-powered conversational interface: users ask natural language questions, and Genie generates and runs SQL.

**15. C** — Fabric Warehouse is the right choice for structured data, SQL-writing teams, strong schema enforcement, and high concurrency. *Not A:* a Lakehouse suits mixed or semi-structured data and ML work. *Not B:* Eventhouse is for time-series and event data. *Not D:* a shortcut isn't an analytical store.

**16. B** — A shortcut lets Fabric query data that stays in place, which meets the no-copy rule. Azure Data Factory is the standalone service for pipelines outside Fabric, including on-premises sources and Azure SQL Database destinations. *Not A:* Mirroring would copy data into OneLake. *Not C:* Eventstream is for streaming events. *Not D:* Mirroring replicates *into OneLake*, not into Azure SQL Database.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Describe data warehousing architecture](https://learn.microsoft.com/en-us/training/modules/examine-components-of-modern-data-warehouse/2-describe-warehousing)
- [Explore data ingestion pipelines](https://learn.microsoft.com/en-us/training/modules/examine-components-of-modern-data-warehouse/3-data-ingestion-pipelines)
- [Explore analytical data stores](https://learn.microsoft.com/en-us/training/modules/examine-components-of-modern-data-warehouse/4-analytical-data-stores)
