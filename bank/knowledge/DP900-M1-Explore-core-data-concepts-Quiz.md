# DP-900 Quiz: Module 1 — Explore core data concepts

**Domain 1:** Describe core data concepts (25–30% of exam)
**Learning path:** Introduction to Microsoft Azure Data core data concepts
**Questions:** 18 (10 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** A collection of customer JSON documents in which some customers have two email addresses, some have one, and some have none is an example of which kind of data?

- A) Structured data
- B) Unstructured data
- C) Semi-structured data
- D) Vector data

**2.** Which file format is columnar and widely used in data lakes and lakehouses?

- A) Parquet
- B) Avro
- C) CSV
- D) XML

**3.** Which statement correctly describes the Avro file format?

- A) It stores column data together in row groups, with metadata describing each chunk
- B) It adds a transaction log on top of another format to support ACID transactions
- C) It's a human-readable format that defines elements using tags in angle brackets
- D) It's row-based, with a JSON header describing the structure of binary record blocks

**4.** Delta Lake builds on which file format by adding a transaction log?

- A) Avro
- B) Parquet
- C) JSON
- D) CSV

**5.** In a document database, what is stored as the value for each key?

- A) A JSON document that the system is optimized to parse and query
- B) A set of columns divided into logically related column families
- C) A node that is linked to other nodes to define relationships
- D) A value in any format that the database stores without interpreting

**6.** Which of the following is NOT one of the four common types of nonrelational database described in this module?

- A) Key-value
- B) Graph
- C) Column family
- D) Time-series

**7.** While $40 is being transferred from Account A to Account B, a separate query checks both balances. Which ACID property ensures that query can't return A's balance *after* the debit alongside B's balance *before* the credit?

- A) Atomicity
- B) Consistency
- C) Isolation
- D) Durability

**8.** In a medallion architecture, which layer holds cleansed, conformed data with duplicates removed and data types standardized?

- A) Bronze
- B) Silver
- C) Gold
- D) Semantic

**9.** Which pattern extracts and loads data first, then applies transformations afterward, and is common in modern lakehouses?

- A) ETL
- B) OLAP
- C) Schema-on-write
- D) ELT

**10.** Which type of analytical store combines the flexible, scalable storage of a data lake with the relational querying semantics of a data warehouse?

- A) Data lakehouse
- B) OLAP cube
- C) Data lake
- D) Semantic model

---

## Section B: True or false

**11.** In a relational database, normalization means intentionally storing a customer's details on every order row so queries run faster.

**12.** An Avro file stores its header (describing the data structure) as JSON, but stores the data itself as binary.

**13.** In a typical enterprise analytics architecture, data scientists often work directly with files in the data lake, while business users more commonly consume preaggregated data through reports or dashboards.

**14.** XML has largely replaced JSON for representing data because XML is less verbose.

**15.** OLTP systems are optimized mainly for read operations, which is why they're typically described as read-only or read-mostly.

**16.** The Bronze layer of a medallion architecture keeps data as it arrived from source systems, so it can be reprocessed if requirements change.

---

## Section C: Scenarios

**17.** A retailer needs to store product photos, customer-uploaded PDF receipts, and recordings of support calls in a central location for later analysis. How is this data best classified, and what are these files commonly called?

- A) Semi-structured data, stored as JSON documents
- B) Unstructured data, commonly referred to as BLOBs
- C) Structured data, stored as delimited text files
- D) Semi-structured data, stored in a column family database

**18.** A banking application starts a transfer of $40 from Account A (balance $100) to Account B (balance $50). The server loses power after Account A is debited but before Account B is credited. When the system restarts, Account A still shows $100. Which ACID property explains this, and what kind of workload is this?

- A) Durability; an OLTP workload
- B) Isolation; an OLTP workload
- C) Atomicity; an OLTP workload
- D) Atomicity; an OLAP workload

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. C** — Semi-structured data has some structure but allows variation between instances, such as a varying number of email addresses; JSON is a common format for it. *Not A:* structured data uses a fixed schema where every record has the same fields. *Not B:* unstructured data (images, audio, documents) has no specific structure, but these documents do. *Not D:* vector data is a numerical representation (embeddings) of content used for semantic similarity.

**2. A** — Parquet is a columnar Apache format widely used in data lakes and lakehouses. *Not B:* Avro is the classic trap — it's row-based. *Not C/D:* CSV and XML are human-readable text formats, not optimized columnar formats.

**3. D** — Avro is row-based; each file has a JSON header describing the structure, and data is stored as binary in blocks of records. *Not A:* that describes Parquet (row groups, column chunks, metadata). *Not B:* that describes Delta Lake. *Not C:* that describes XML.

**4. B** — Delta Lake is Parquet plus a transaction log, enabling ACID transactions, versioning, and reliable updates on data lake files. *Not A, C, D:* Delta Lake doesn't build on Avro, JSON, or CSV.

**5. A** — A document database is a specific form of key-value database where the value is a JSON document the system is optimized to parse and query. *Not B:* that's a column family database. *Not C:* that's a graph database. *Not D:* that's a plain key-value database — close, but the point of a document store is that the database *does* understand the JSON.

**6. D** — The four types covered are key-value, document, column family, and graph. Time-series stores exist, but they aren't one of the four this module (and the exam objective) uses.

**7. C** — Isolation means concurrent transactions can't interfere with one another, so the balance check sees a consistent state. *Not A:* atomicity is "all or nothing" for the transfer itself. *Not B:* consistency means a transaction moves the database from one valid state to another. *Not D:* durability means committed changes survive a restart.

**8. B** — Silver holds cleansed and conformed data. *Not A:* Bronze is raw, as-is data. *Not C:* Gold is aggregated, business-ready data. *Not D:* "semantic" isn't a medallion layer; a semantic model is an analytical model used by Power BI.

**9. D** — ELT loads data first and transforms afterward, common in modern lakehouses. *Not A:* ETL transforms before loading. *Not B:* OLAP is an analytical model, not a load pattern. *Not C:* schema-on-write enforces structure when data is stored.

**10. A** — A data lakehouse combines data lake storage with data warehouse-style relational querying. *Not B/D:* an OLAP cube or semantic model is an analytical model layered on top of a store, not a storage architecture. *Not C:* a plain data lake is file storage without the warehouse semantics.

**11. False** — Normalization *eliminates* duplicate values so a customer's details are stored only once and referenced by key. Introducing duplication to speed up queries is *denormalization*, which is sometimes used in lakehouse table schemas.

**12. True** — Avro stores the header describing the data structure as JSON, and the data as binary in blocks of records.

**13. True** — The module describes data scientists working with files in the data lake, data analysts querying the warehouse, and business users consuming preaggregated data in reports or dashboards.

**14. False** — It's the other way around: XML has largely been superseded by the less verbose JSON format.

**15. False** — OLTP databases are optimized for both reads *and* writes to support CRUD operations. "Read-only or read-mostly" describes analytical processing systems.

**16. True** — Bronze stores raw data as-is, with no transformations, preserving the original records for reprocessing.

**17. B** — Images, documents, and audio are unstructured data, and binary files like these are commonly called BLOBs (Binary Large Objects). *Not A/D:* there's no field-based structure to call these semi-structured. *Not C:* structured data has a fixed tabular schema.

**18. C** — Atomicity means a transaction succeeds completely or fails completely; because the credit never happened, the debit is rolled back. Bank transfers are a classic OLTP workload. *Not A:* durability applies to *committed* transactions, and this one never committed. *Not B:* isolation is about concurrent transactions. *Not D:* the property is right, but OLAP is analytical, read-mostly processing.

---

## Score guide

| Score | What it means |
|---|---|
| 16–18 | Exam-ready on this module — move on |
| 13–15 | Solid; review the concepts you missed |
| 10–12 | Re-read the units behind your misses before moving on |
| 0–9 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Identify data formats](https://learn.microsoft.com/en-us/training/modules/explore-core-data-concepts/2-data-formats)
- [Explore file storage](https://learn.microsoft.com/en-us/training/modules/explore-core-data-concepts/3-file-storage)
- [Explore databases](https://learn.microsoft.com/en-us/training/modules/explore-core-data-concepts/4-databases)
- [Explore transactional data processing](https://learn.microsoft.com/en-us/training/modules/explore-core-data-concepts/5-transactional-data-processing)
- [Explore analytical data processing](https://learn.microsoft.com/en-us/training/modules/explore-core-data-concepts/6-analytical-processing)
