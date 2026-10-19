# DP-900 Quiz: Module 5 — Explore Azure Storage for nonrelational data

**Domain 3:** Describe considerations for working with non-relational data on Azure (15–20% of exam)
**Learning path:** Introduction to Microsoft Azure Data non-relational data in Azure
**Questions:** 18 (10 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** Which blob type does Azure use to implement virtual disk storage for virtual machines?

- A) Block blob
- B) Append blob
- C) Archive blob
- D) Page blob

**2.** An application writes log entries that are only ever added to the end of a file; existing entries are never changed. Which blob type is optimized for this?

- A) Page blob
- B) Append blob
- C) Block blob
- D) Cool blob

**3.** What is the minimum time data should stay in the Cold access tier to avoid an early deletion penalty?

- A) 90 days
- B) 30 days
- C) 180 days
- D) 60 days

**4.** How do you read a blob that is stored in the Archive tier?

- A) Read it directly, allowing for up to 15 hours of latency
- B) Copy it to an Azure Files share, then read the copy
- C) Change its tier to Hot, Cool, or Cold, and wait for rehydration
- D) Enable the hierarchical namespace on the storage account

**5.** Which redundancy option keeps three copies of your data within a single datacenter?

- A) Zone-redundant storage (ZRS)
- B) Locally redundant storage (LRS)
- C) Geo-redundant storage (GRS)
- D) Read-access geo-zone-redundant storage (RA-GZRS)

**6.** What must you enable on an Azure Storage account to create an Azure Data Lake Storage Gen2 file system?

- A) The Archive access tier
- B) The NFS file-sharing protocol
- C) Read-access geo-redundant storage
- D) The hierarchical namespace setting

**7.** Which statement about upgrading an existing storage account to use a hierarchical namespace is correct?

- A) It's a one-way upgrade; you can't revert to a flat namespace
- B) You can switch between flat and hierarchical at any time
- C) Existing accounts can't be upgraded; you must create a new one
- D) Only SSD-based premium accounts can be upgraded

**8.** Which Azure Files protocol is used by Linux clients and is NOT supported on Windows?

- A) Server Message Block (SMB)
- B) REST over HTTPS
- C) Network File System (NFS)
- D) AzCopy transfer protocol

**9.** In Azure Table Storage, what makes up the unique key for each row?

- A) A partition key and a row key
- B) A row key and a timestamp
- C) A partition key and a timestamp
- D) A primary key and a foreign key

**10.** In which formats does Microsoft OneLake store tables?

- A) CSV or JSON
- B) Avro or ORC
- C) XML or Parquet
- D) Delta Parquet or Iceberg

---

## Section B: True or false

**11.** By default, the virtual folders inside a blob container let you set access permissions at the folder level.

**12.** With a hierarchical namespace enabled, you can use POSIX-compliant access control lists (ACLs) to set permissions on individual files and folders, separate from Azure RBAC.

**13.** Microsoft recommends shared access keys as the preferred way to authenticate to Azure Blob Storage.

**14.** Data in Azure Table Storage is usually denormalized, with each row holding all the data for a logical entity.

**15.** Azure File Sync can synchronize locally cached copies of shared files with the data in Azure Files.

**16.** You can create an NFS share in Azure Files on either the HDD tier or the SSD tier.

---

## Section C: Scenarios

**17.** A company stores invoice PDFs as blobs. Invoices are opened often in their first month, rarely after that, and after a year they must be kept for several more years but are almost never read. The company wants storage costs to drop automatically as invoices age. What should it do?

- A) Upload every invoice directly to the Archive tier to keep costs lowest from day one
- B) Upload to the Hot tier and have an administrator move blobs to cheaper tiers each year
- C) Upload to Hot and add a lifecycle policy that moves blobs to Cool, Cold, then Archive
- D) Store the invoices in Azure Files on the HDD tier and set a quota on each share

**18.** A company's staff use a mapped network drive on an on-premises Windows file server. It wants to move these shares to the cloud so Windows, Linux, and macOS users can all connect, while a branch office keeps fast local cached copies. What should it use?

- A) Blob storage with a hierarchical namespace and Azure RBAC permissions
- B) An Azure Files SMB share, with Azure File Sync at the branch office
- C) An Azure Files NFS share on the SSD tier with a private endpoint
- D) Azure Table Storage with a separate partition for each office

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. D** — Page blobs are collections of 512-byte pages optimized for random read and write, and Azure uses them for VM virtual disks. *Not A:* block blobs suit large objects that change infrequently. *Not B:* append blobs only support adding to the end. *Not C:* Archive is an access tier, not a blob type.

**2. B** — Append blobs support adding blocks to the end only; updating or deleting existing blocks isn't supported. *Not A:* page blobs are for random access. *Not C:* block blobs work but aren't optimized for append. *Not D:* Cool is an access tier, not a blob type.

**3. A** — Cold requires 90 days. *Not B:* 30 days is Cool. *Not C:* 180 days is Archive. *Not D:* 60 days isn't a tier minimum.

**4. C** — Archive blobs are effectively offline. You change the tier to Hot, Cool, or Cold, the blob is rehydrated, and you can read it only after rehydration completes (which can take up to 15 hours). *Not A:* you can't read Archive blobs directly. *Not B/D:* neither applies.

**5. B** — LRS keeps three copies in a single datacenter. *Not A:* ZRS spreads copies across three availability zones. *Not C/D:* GRS and RA-GZRS replicate to a secondary region.

**6. D** — ADLS Gen2 requires the hierarchical namespace setting. *Not A/B/C:* tiers, protocols, and redundancy options don't create a data lake file system.

**7. A** — You can enable the hierarchical namespace at creation or upgrade an existing account, but upgrading is one-way. *Not B:* no reverting. *Not C:* existing accounts *can* be upgraded. *Not D:* no such restriction is described.

**8. C** — NFS shares are used by Linux clients and aren't supported on Windows. *Not A:* SMB works across Windows, Linux, and macOS. *Not B/D:* these aren't the two file-sharing protocols the module describes.

**9. A** — Each row's unique key combines a partition key and a row key. *Not B/C:* the timestamp records when a row was modified; it isn't part of the key. *Not D:* Table Storage has no foreign keys.

**10. D** — OneLake stores tables in Delta Parquet or Iceberg, both open formats. *Not A/B/C:* none of these pairs is what OneLake uses for tables (OneLake can hold any file type, but tables use these formats).

**11. False** — By default, folders are only a "/" in the blob name. They're purely virtual, so you can't control access or run bulk operations at folder level. The hierarchical namespace (ADLS Gen2) is what adds real folders.

**12. True** — The hierarchical namespace enables POSIX-compliant ACLs for fine-grained read, write, and execute permissions, separate from RBAC.

**13. False** — Microsoft Entra ID authentication is the recommended sign-in method, with permissions assigned through Azure RBAC.

**14. True** — Table Storage rows are usually denormalized; for example, one customer row can hold multiple phone numbers and addresses.

**15. True** — Azure File Sync synchronizes locally cached copies of shared files with Azure Files.

**16. False** — NFS shares require the SSD tier, with access controlled through a private endpoint or service endpoint in a virtual network.

**17. C** — A lifecycle management policy moves blobs from Hot to Cool to Cold to Archive based on days since modification, so costs drop automatically. *Not A:* first-month reads from Archive would take hours and cost more to access. *Not B:* manual moves aren't automatic. *Not D:* Azure Files doesn't offer access-tier lifecycle movement.

**18. B** — Azure Files provides cloud network shares; SMB works across Windows, Linux, and macOS, and Azure File Sync keeps local cached copies in sync. *Not A:* blob storage isn't a mapped network drive. *Not C:* NFS isn't supported on Windows. *Not D:* Table Storage holds key-value data, not files.

---

## Score guide

| Score | What it means |
|---|---|
| 16–18 | Exam-ready on this module — move on |
| 13–15 | Solid; review the concepts you missed |
| 10–12 | Re-read the units behind your misses before moving on |
| 0–9 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Explore Azure blob storage](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-non-relational-data-services-azure/2-azure-blob-storage)
- [Explore Azure Data Lake Storage Gen2](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-non-relational-data-services-azure/3-azure-data-lake-gen2)
- [Explore Microsoft OneLake in Fabric](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-non-relational-data-services-azure/3a-one-lake)
- [Explore Azure Files](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-non-relational-data-services-azure/4-azure-files)
- [Explore Azure Tables](https://learn.microsoft.com/en-us/training/modules/explore-provision-deploy-non-relational-data-services-azure/5-azure-tables)
