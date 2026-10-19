# DP-900 Quiz: Module 3 — Explore fundamental relational data concepts

**Domain 2:** Identify considerations for relational data on Azure (20–25% of exam)
**Learning path:** Introduction to Microsoft Azure Data relational data in Azure
**Questions:** 18 (10 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** In a relational table, what does each row represent?

- A) One attribute of an entity
- B) A single instance of an entity
- C) A relationship between two tables
- D) A data type that a column enforces

**2.** Which of the following is NOT one of the practical steps of normalization described in this module?

- A) Store each entity in its own table
- B) Put each discrete attribute in its own column
- C) Identify each row uniquely with a primary key
- D) Group related attributes into one column

**3.** A LineItem table identifies each row by the unique combination of OrderNo and ItemNo. What is this kind of key called?

- A) A composite key
- B) A foreign key
- C) A surrogate key
- D) A partition key

**4.** To which category of SQL statement does GRANT belong?

- A) Data Definition Language (DDL)
- B) Data Manipulation Language (DML)
- C) Data Control Language (DCL)
- D) Transaction Control Language (TCL)

**5.** Which of these is a DDL statement?

- A) UPDATE
- B) INSERT
- C) REVOKE
- D) ALTER

**6.** Which SQL dialect does Azure SQL Managed Instance use?

- A) PL/SQL
- B) Transact-SQL
- C) PL/pgSQL
- D) CQL

**7.** What happens when you run `DELETE FROM Product;` with no WHERE clause?

- A) Every row in the Product table is removed
- B) The Product table itself is dropped from the database
- C) The database asks you to confirm before deleting rows
- D) Only rows that contain NULL values are removed

**8.** Which database object is a virtual table based on the results of a SELECT query?

- A) Index
- B) Stored procedure
- C) View
- D) Foreign key

**9.** What is the main trade-off of creating many indexes on a table?

- A) Queries that filter on the indexed columns become slower
- B) Insert, update, and delete operations can become slower
- C) The table can no longer be given a primary key
- D) Any views based on the table must be recreated

**10.** What is a column defined with NOT NULL called?

- A) A primary key column
- B) A foreign key column
- C) A composite column
- D) A mandatory column

---

## Section B: True or false

**11.** A relational database management system can enforce referential integrity, for example preventing an order from referencing a customer that doesn't exist.

**12.** SQL enforces the rule that every table must have a primary key.

**13.** A SELECT query that returns many rows always returns them in primary key order unless you add an ORDER BY clause.

**14.** For a table with very few rows, the query optimizer may ignore an index and simply read the whole table.

**15.** In a normalized schema, changing a customer's address requires modifying only a single row.

**16.** Stored procedures and user account management are part of the ANSI SQL standard, so they work identically across SQL Server, PostgreSQL, and MySQL.

---

## Section C: Scenarios

**17.** An application frequently needs to change a product's name, given the product's ID. The team wants this logic encapsulated inside the database and run on demand with parameters. What should they create?

- A) A view that joins the Product and Order tables
- B) An index on the Name column of the Product table
- C) A stored procedure that takes the product ID and new name
- D) An ALTER TABLE statement that renames the Name column

**18.** A company tracks sales in a spreadsheet. Each row is one item sold, and the customer's name and full address are stored together in one cell that repeats on every row. When a customer moves, many rows must be edited, and it's hard to filter customers by city. What's the best fix?

- A) Split the data into entity tables linked by keys, with address parts in separate columns
- B) Add an index on the combined CustomerAddress column so that updates run faster
- C) Create a view over the spreadsheet data that returns each customer only once
- D) Store each order as a JSON document that includes the full customer details

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. B** — Each row represents a single instance of an entity, such as one customer or one order. *Not A:* attributes are columns. *Not C:* relationships are expressed with keys. *Not D:* data types are defined per column.

**2. D** — Normalization does the opposite: it separates each discrete attribute into its own column. The other three options are steps from the module's simple definition (the fourth step is using foreign keys to link entities).

**3. A** — A composite key is a key based on a unique combination of multiple columns; the module uses this exact LineItem example. *Not B:* a foreign key references another table's primary key. *Not C:* surrogate keys aren't covered here. *Not D:* partition keys belong to Azure Table storage and Cosmos DB, not relational tables.

**4. C** — GRANT, DENY, and REVOKE are DCL statements for managing permissions. *Not A:* DDL creates and changes objects. *Not B:* DML reads and changes rows. *Not D:* TCL isn't one of the three groups in this module.

**5. D** — ALTER modifies an object's structure, so it's DDL (with CREATE, DROP, RENAME). *Not A/B:* UPDATE and INSERT are DML. *Not C:* REVOKE is DCL.

**6. B** — Transact-SQL is used by SQL Server, Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VMs. *Not A:* PL/SQL is Oracle. *Not C:* PL/pgSQL is PostgreSQL. *Not D:* CQL is Cassandra's query language.

**7. A** — Without WHERE, DELETE removes every row. *Not B:* removing the table is DROP, a DDL statement. *Not C:* SQL has no "are you sure?" prompt. *Not D:* there's no implicit filter.

**8. C** — A view is a virtual table based on a SELECT query. *Not A:* an index is a sorted copy of column data with pointers to rows. *Not B:* a stored procedure is SQL code run on command. *Not D:* a foreign key is a column that references another table.

**9. B** — Every insert, update, and delete must also maintain the indexes, which can slow those operations; indexes also consume storage. *Not A:* indexes speed up those queries. *Not C/D:* indexes don't affect primary keys or views.

**10. D** — NOT NULL columns are called mandatory columns. *Not A:* a primary key uniquely identifies rows; NOT NULL alone doesn't make a column a key. *Not B/C:* those describe key roles, not nullability.

**11. True** — An RDBMS can enforce referential integrity so a foreign key value must match an existing primary key.

**12. False** — Every table *should* have a primary key, but SQL doesn't enforce this rule.

**13. False** — Without ORDER BY, rows don't necessarily appear in any specific sequence.

**14. True** — For small tables, an index may be no more efficient than a full read, and the query optimizer ignores it.

**15. True** — Because each customer is stored once in an entity table, an address change touches one row.

**16. False** — These are proprietary extensions, not part of the standard. T-SQL, PL/pgSQL, and MySQL each implement them differently.

**17. C** — A stored procedure encapsulates programmatic logic with parameters; the module's RenameProduct example matches this exactly. *Not A:* a view only reads data. *Not B:* an index only speeds up searches. *Not D:* renaming the *column* changes the schema, not a product's name value.

**18. A** — This is normalization: each entity in its own table, each discrete attribute in its own column, linked by keys. The address is then stored once and city becomes filterable. *Not B:* an index doesn't remove duplication. *Not C:* a view doesn't change how data is stored, so updates still hit many rows. *Not D:* embedding full customer details keeps the duplication.

---

## Score guide

| Score | What it means |
|---|---|
| 16–18 | Exam-ready on this module — move on |
| 13–15 | Solid; review the concepts you missed |
| 10–12 | Re-read the units behind your misses before moving on |
| 0–9 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Understand relational data](https://learn.microsoft.com/en-us/training/modules/explore-relational-data-offerings/2-understand-relational-data)
- [Understand normalization](https://learn.microsoft.com/en-us/training/modules/explore-relational-data-offerings/3-normalization)
- [Explore SQL](https://learn.microsoft.com/en-us/training/modules/explore-relational-data-offerings/4-query-with-sql)
- [Describe database objects](https://learn.microsoft.com/en-us/training/modules/explore-relational-data-offerings/5-database-objects)
