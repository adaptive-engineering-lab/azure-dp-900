# DP-900 Quiz: Module 4 — Explore relational database services in Azure

**Domain 2:** Identify considerations for relational data on Azure (20–25% of exam)
**Learning path:** Introduction to Microsoft Azure Data relational data in Azure
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** Which Azure SQL option is an infrastructure-as-a-service (IaaS) solution?

- A) Azure SQL Database (single database)
- B) Azure SQL Managed Instance
- C) SQL Server on Azure Virtual Machines
- D) Azure SQL Database (elastic pool)

**2.** Which option provides near-100% compatibility with on-premises SQL Server while automating backups, patching, and other maintenance?

- A) Azure SQL Database
- B) Azure SQL Managed Instance
- C) SQL Server on Azure Virtual Machines
- D) Azure Database for MySQL

**3.** For SQL Server on Azure Virtual Machines, what does the availability SLA cover?

- A) The SQL Server processes and all hosted databases
- B) Both the virtual machine and the SQL Server engine
- C) Only databases configured for zone redundancy
- D) The virtual machines, not the SQL Server processes on them

**4.** Which Azure SQL Database option lets several databases share a set of resources, reducing cost when their workloads peak at different times?

- A) Elastic pool
- B) Hyperscale
- C) Serverless compute tier
- D) Instance pool

**5.** According to this module, how large can a database in the Azure SQL Database Hyperscale tier grow?

- A) Up to 4 TB
- B) Up to 16 TB
- C) Up to 128 TB
- D) Up to 1 PB

**6.** Azure Database for MySQL is based on which MySQL edition?

- A) Enterprise
- B) Community
- C) Standard
- D) Developer

**7.** What point-in-time restore retention does Azure Database for MySQL provide?

- A) 7 days by default, up to 14 days
- B) 14 days by default, up to 35 days
- C) 7 days by default, up to 35 days
- D) 35 days by default, up to 90 days

**8.** When Query Store is enabled in Azure Database for PostgreSQL, where is the captured query information saved?

- A) In a query_store table inside each user database
- B) In the pgAdmin tool's local repository
- C) In an audit log in an Azure Storage account
- D) In a database named azure_sys

---

## Section B: True or false

**9.** An Azure SQL Database server is a physical machine dedicated to hosting your databases.

**10.** In the General Purpose service tier, a serverless Azure SQL Database can pause automatically when it's inactive.

**11.** Azure SQL Managed Instance supports both SQL Server logins (username and password) and logins integrated with Microsoft Entra ID.

**12.** You can use pgAdmin with Azure Database for PostgreSQL to perform server backup and restore, just as you would on-premises.

**13.** Advanced Threat Protection in Microsoft Defender for SQL can raise alerts about potential SQL injection attacks.

**14.** Azure SQL Database is fully compatible with on-premises SQL Server, so any on-premises application can move to it without changes.

---

## Section C: Scenarios

**15.** A company wants to move an on-premises SQL Server instance, with several databases and some advanced instance-level features, to Azure with minimal application changes. It doesn't want to manage operating system patching or backups. Which option should it choose?

- A) SQL Server on Azure Virtual Machines
- B) Azure SQL Managed Instance
- C) Azure SQL Database (single database)
- D) Azure SQL Database (elastic pool)

**16.** An organization's SQL Server application relies on operating system features that aren't supported at the PaaS level. It needs full administrative rights over both the operating system and the DBMS, and it already has IT staff to maintain servers. Which option fits?

- A) SQL Server on Azure Virtual Machines
- B) Azure SQL Managed Instance
- C) Azure SQL Database Hyperscale
- D) Azure Database for PostgreSQL flexible server

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. C** — SQL Server on Azure VMs virtualizes compute, storage, and networking, which makes it IaaS. *Not A/B/D:* Azure SQL Database (single or elastic pool) and Managed Instance are both PaaS.

**2. B** — Managed Instance offers near-100% compatibility with on-premises SQL Server plus automated updates, backups, and recovery. *Not A:* Azure SQL Database supports most core *database-level* capabilities but isn't fully compatible. *Not C:* VMs are fully compatible but you manage backups and patching yourself. *Not D:* MySQL isn't SQL Server.

**3. D** — The SLA covers the VMs, not the SQL Server processes running on them. *Not A/B:* this is the trap; the SQL Server engine is your responsibility. *Not C:* zone redundancy affects the SLA for PaaS options, not this.

**4. A** — An elastic pool lets multiple databases share pooled resources, ideal when workloads vary over time (the module's payroll and reporting example). *Not B:* Hyperscale is for very large databases. *Not C:* serverless scales compute for a *single* database. *Not D:* instance pools are a Managed Instance feature.

**5. C** — The module states Hyperscale supports databases up to 128 TB, with rapid scaling and fast backup and restore regardless of size.

**6. B** — Azure Database for MySQL is based on MySQL Community Edition. *Not A/C:* Standard and Enterprise are the commercial editions. *Not D:* not mentioned.

**7. C** — Automatic backups support point-in-time restore for up to 35 days, with seven days by default.

**8. D** — Query Store data is saved in a database named azure_sys, and you query the query_store.qs_view view to see it. *Not A/B/C:* none of these is where Query Store data goes.

**9. False** — A SQL Database server is a *logical* construct: a central administrative point for databases, logins, firewall rules, auditing, and failover groups.

**10. True** — In the serverless tier you're billed for compute used, and in General Purpose the database can pause automatically when inactive.

**11. True** — Managed Instance supports SQL Server Database engine logins and Microsoft Entra ID logins (which enable single sign-on).

**12. False** — You can still connect with pgAdmin, but server-focused functions like backup and restore aren't available because Microsoft manages the server.

**13. True** — Advanced Threat Protection monitors for suspicious activity and alerts on vulnerabilities, SQL injection attacks, and anomalous access.

**14. False** — Azure SQL Database isn't fully compatible with on-premises SQL Server; some features an app depends on might not be available. It suits new cloud apps or apps with minimal instance-level dependencies.

**15. B** — Managed Instance is the choice for lifting and shifting a whole instance with advanced features and minimal changes, without the overhead of managing a VM. *Not A:* VMs would work, but you'd manage patching and backups. *Not C/D:* Azure SQL Database lacks some instance-level features.

**16. A** — VMs give full administrative rights over the OS and DBMS and support OS features unavailable at the PaaS level, which suits organizations with existing IT staff. *Not B/C:* PaaS options abstract the OS. *Not D:* PostgreSQL is a different engine and is also PaaS.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Describe Azure SQL services and capabilities](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-relational-database-offerings-azure/2-azure-sql)
- [Describe Azure services for open-source databases](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-relational-database-offerings-azure/3-azure-database-open-source)
