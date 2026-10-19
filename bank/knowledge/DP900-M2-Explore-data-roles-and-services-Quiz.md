# DP-900 Quiz: Module 2 — Explore data roles and services

**Domain 1:** Describe core data concepts (25–30% of exam)
**Learning path:** Introduction to Microsoft Azure Data core data concepts
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** Which role is responsible for granting or denying users access to data in a database, and for implementing backup and recovery plans?

- A) Data engineer
- B) Data analyst
- C) AI engineer
- D) Database administrator

**2.** Which role identifies data governance rules, applies data cleaning routines, and owns the management and monitoring of data pipelines?

- A) Data engineer
- B) Database administrator
- C) Data analyst
- D) Data architect

**3.** Which Azure SQL option gives maximum configurability, along with full management responsibility for the owner?

- A) Azure SQL Database
- B) Azure SQL VM (SQL Server on a virtual machine)
- C) Azure SQL Managed Instance
- D) Azure Database for PostgreSQL

**4.** Which service is described as a hybrid relational-object database that lets you store custom data types with their own nonrelational properties?

- A) Azure Database for MySQL
- B) Azure SQL Managed Instance
- C) Azure Cosmos DB
- D) Azure Database for PostgreSQL

**5.** Data engineers use Azure Storage to host data lakes. What turns blob storage into a data lake?

- A) Moving blobs into the Archive access tier
- B) Storing data as page blobs instead of block blobs
- C) A hierarchical namespace that organizes files into folders
- D) Grouping files into Azure Table storage partitions

**6.** A data analyst needs a fully managed, standalone big data analytics platform for high-performance querying of log files and IoT telemetry that include a timestamp. Which service fits best?

- A) Azure Data Explorer
- B) Azure Stream Analytics
- C) Microsoft Purview
- D) Azure Data Factory

**7.** Which service creates a map of your data and tracks data lineage across multiple sources to support enterprise-wide governance?

- A) Microsoft Fabric IQ
- B) Azure Data Explorer
- C) Azure Databricks
- D) Microsoft Purview

**8.** What is the single, shared storage layer that Microsoft Fabric is built on?

- A) Azure Files
- B) OneLake
- C) Delta Lake
- D) Unity Catalog

---

## Section B: True or false

**9.** In some organizations, the same person might act as a database administrator when provisioning a database and as a data engineer when building a pipeline from it.

**10.** Azure SQL Managed Instance allows *less* flexible configuration than Azure SQL Database, in exchange for *less* administrative responsibility.

**11.** Microsoft Fabric is a platform-as-a-service (PaaS) offering in which you provision and manage your own Spark clusters.

**12.** Azure Data Factory's capabilities are built into Microsoft Fabric as Fabric Data Factory.

**13.** Azure Cosmos DB instances are always provisioned and managed by database administrators, never by software developers.

**14.** Microsoft Foundry is the platform that AI engineers use to build, test, and deploy AI-powered solutions.

---

## Section C: Scenarios

**15.** A company runs an on-premises web application built on a Linux, Apache, MySQL, and PHP stack. It wants a managed relational database in Azure that needs minimal changes to the application. Which service should it choose?

- A) Azure Database for MySQL
- B) Azure Database for PostgreSQL
- C) Azure SQL Database
- D) Azure Cosmos DB

**16.** A data engineering team already has Apache Spark skills and wants a code-first, notebook-based platform for large-scale data engineering over Delta Lake tables. Analysts on the team also want to query and visualize data in the same notebooks. Which service fits best?

- A) Azure Stream Analytics
- B) Azure Data Explorer
- C) Azure Databricks
- D) Azure Data Factory

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. D** — Database administrators manage permissions, backups, and restores, and are responsible for availability and performance. *Not A:* data engineers build pipelines and integration. *Not B:* analysts explore data and build visualizations. *Not C:* AI engineers build AI-powered features.

**2. A** — Data engineers manage data integration infrastructure: cleaning routines, governance rules, and pipelines, including monitoring them. *Not B:* DBAs manage the databases themselves. *Not C:* analysts consume data for insights. *Not D:* data architect is mentioned only as an additional role, without these responsibilities attached.

**3. B** — Azure SQL VM is a virtual machine with SQL Server installed, giving maximum configurability with full management responsibility. *Not A:* Azure SQL Database is fully managed PaaS with the least configuration control. *Not C:* Managed Instance sits in the middle. *Not D:* PostgreSQL isn't part of the Azure SQL family.

**4. D** — PostgreSQL is a hybrid relational-object database that supports custom data types. *Not A:* MySQL is described as simple-to-use and common in LAMP apps. *Not B:* Managed Instance is SQL Server. *Not C:* Cosmos DB is a nonrelational NoSQL database.

**5. C** — A data lake is blob storage with a hierarchical namespace, so files can be organized in folders in a distributed file system. *Not A:* Archive is a cost tier. *Not B:* page blobs are for random read/write such as VM disks. *Not D:* Table storage is key-value storage, not a data lake.

**6. A** — Azure Data Explorer is a standalone big data analytics platform for high-performance querying of timestamped log and telemetry data. *Not B:* Stream Analytics processes data streams in real time with a query and writes to an output; it's not described as the place analysts query logs. *Not C:* Purview is governance. *Not D:* Data Factory builds pipelines.

**7. D** — Microsoft Purview maps data and tracks lineage for governance and discoverability. *Not A:* Fabric IQ provides shared business-entity definitions (and is in preview). *Not B:* Data Explorer queries telemetry. *Not C:* Databricks is a Spark analytics platform.

**8. B** — Fabric runs on one shared storage layer called OneLake. *Not A:* Azure Files is a network file share service. *Not C:* Delta Lake is a storage *format*, not the storage layer. *Not D:* Unity Catalog is Azure Databricks' governance layer.

**9. True** — Roles define responsibilities, not people; the module gives exactly this example of one person doing both.

**10. False** — It's reversed. Managed Instance allows *more* flexible configuration than Azure SQL Database, with *more* administrative responsibility.

**11. False** — Fabric is software-as-a-service (SaaS). You don't manage servers or clusters; you create workspaces and items, and Microsoft runs the infrastructure.

**12. True** — Fabric Data Factory is described as the next generation of Azure Data Factory, built into Fabric.

**13. False** — DBAs sometimes manage Cosmos DB, but often software developers manage NoSQL storage as part of the application architecture.

**14. True** — Microsoft Foundry is Microsoft's PaaS for enterprise AI that AI engineers use to design, test, and deploy solutions.

**15. A** — Azure Database for MySQL is the managed service for MySQL, which is commonly used in LAMP stack apps. *Not B:* PostgreSQL is a different engine and would require migration work. *Not C:* Azure SQL Database runs the SQL Server engine. *Not D:* Cosmos DB is nonrelational.

**16. C** — Azure Databricks is built on Apache Spark, optimized for large-scale data engineering over Delta Lake, suits code-first notebook workflows, and lets analysts query and visualize data in notebooks. *Not A:* Stream Analytics is a real-time stream processing engine. *Not B:* Data Explorer focuses on log and telemetry queries. *Not D:* Data Factory is a pipeline service, not a notebook platform.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Explore job roles in the world of data](https://learn.microsoft.com/en-us/training/modules/explore-roles-responsibilities-world-of-data/2-explore-job-roles)
- [Identify data services](https://learn.microsoft.com/en-us/training/modules/explore-roles-responsibilities-world-of-data/3-data-services)
