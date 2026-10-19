# DP-900 Quiz: Module 9 — Explore fundamentals of data visualization

**Domain 4:** Describe an analytics workload on Azure (25–30% of exam)
**Learning path:** Introduction to Microsoft Azure Data analytics in Azure
**Questions:** 16 (8 multiple choice, 6 true/false, 2 scenarios)

---

## Section A: Multiple choice

**1.** A typical Power BI workflow starts with which tool, used to import data, build a data model, and create reports?

- A) The Power BI service
- B) The Power BI phone app
- C) Power BI Desktop
- D) A Fabric Real-Time Dashboard

**2.** Which visualization is best for comparing two numeric measures, such as marketing spend and revenue, to find a correlation?

- A) Scatter plot
- B) Pie chart
- C) Line chart
- D) Map

**3.** In a semantic model, what are the numeric values you analyze called, and what are the entities you aggregate them by called?

- A) Dimensions; measures
- B) Facts; hierarchies
- C) Attributes; keys
- D) Measures; dimensions

**4.** When you import data into a semantic model, which engine stores it in an in-memory columnar store?

- A) Direct Lake
- B) VertiPaq
- C) Delta Lake
- D) Kusto

**5.** Which AI-powered Power BI visual identifies the factors that most strongly drive a selected metric?

- A) Decomposition tree
- B) Key influencers
- C) Smart narrative
- D) Q&A visual

**6.** Copilot is the recommended replacement for which Power BI feature?

- A) Smart narratives
- B) Key influencers
- C) Decomposition tree
- D) The Q&A visual

**7.** In Direct Lake mode, what is the lightweight refresh operation that updates a semantic model to reference the latest data called?

- A) Mirroring
- B) Rehydration
- C) Framing
- D) Shortcutting

**8.** In Power BI Desktop, where do you create relationships between fact and dimension tables and define hierarchies?

- A) Model view
- B) Report view
- C) A Power BI service dashboard
- D) The Fabric real-time hub

---

## Section B: True or false

**9.** The Power BI service provides the same full data modeling functionality in a web browser as Power BI Desktop.

**10.** In a Power BI report, selecting a category in one visualization automatically filters and highlights that category in related visualizations.

**11.** Most analytical models include a Time dimension so measures can be aggregated across time periods.

**12.** Copilot in Power BI works in any workspace, including workspaces without a paid Fabric or Power BI Premium capacity.

**13.** Hierarchies let users drill down from yearly totals to monthly totals, with the model computing aggregated values at each level at query time.

**14.** A star schema is a design where dimension tables relate to further detail tables, such as a Category table linked to a Product table.

---

## Section C: Scenarios

**15.** A regional sales manager wants a report that (1) compares revenue across six product categories and (2) shows how revenue varies by state. Which pair of visualizations fits best?

- A) A pie chart for categories; a scatter plot for states
- B) A line chart for categories; a table for states
- C) A scatter plot for categories; a column chart for states
- D) A column chart for categories; a map for states

**16.** A company's large sales dataset is stored as Delta tables in OneLake. Analysts want in-memory query speed without copying the data into the semantic model, and business users want to view the reports on their phones. Which approach fits?

- A) An Import mode semantic model, with reports exported to PDF for users
- B) A Direct Lake semantic model, with reports in the Power BI service and phone app
- C) A semantic model over CSV exports, with reports available only in Power BI Desktop
- D) An Import mode semantic model, shown on a Fabric Real-Time Dashboard

---
---

# Answer key

> Stop here if you're still taking the quiz.

**1. C** — The typical workflow starts in Power BI Desktop (a Windows app), then publishes to the Power BI service. *Not A:* the service offers only limited modeling and is where reports are published and shared. *Not B:* the phone app is for consuming reports. *Not D:* Real-Time Dashboards are part of Fabric Real-Time Intelligence.

**2. A** — Scatter plots compare two numeric measures to find a relationship or correlation. *Not B:* pie charts show proportions of a total. *Not C:* line charts show trends, often over time. *Not D:* maps compare values by geography.

**3. D** — Measures are the numeric values you analyze (such as revenue); dimensions are the entities you aggregate by (such as product, customer, and time). *Not A:* this swaps them — the common trap. *Not B/C:* facts are tables that hold measures; hierarchies, attributes, and keys are other model elements.

**4. B** — In Import mode, Power BI stores data in an in-memory columnar store using the VertiPaq engine. *Not A:* Direct Lake loads from OneLake Delta tables *without* importing. *Not C:* Delta Lake is a storage format. *Not D:* Kusto relates to KQL and Eventhouse.

**5. B** — Key influencers identifies which factors most strongly drive a selected metric. *Not A:* the decomposition tree lets you drill down across dimensions to see what contributes to a value — close, but different. *Not C:* smart narratives write text summaries. *Not D:* Q&A is being retired in favor of Copilot.

**6. D** — Copilot is the recommended replacement for the Q&A visual, which is being retired in February 2027. *Not A/B/C:* these AI features remain available.

**7. C** — Framing is the lightweight refresh that points a Direct Lake model at the latest data. *Not A:* Mirroring replicates external databases into OneLake. *Not B:* rehydration is reading back archived blobs. *Not D:* shortcuts reference external storage.

**8. A** — Model view in Power BI Desktop is where you create relationships, define hierarchies, and set data types and formats. *Not B:* Report view is for building visualizations. *Not C/D:* these aren't modeling surfaces.

**9. False** — You can do some basic modeling and report editing in the service, but its functionality is limited compared to Power BI Desktop.

**10. True** — Visuals for related data in a report are automatically linked, so selecting a category filters and highlights it elsewhere.

**11. True** — The module notes that most analytical models include a Time dimension.

**12. False** — Copilot requires a workspace on a paid Fabric capacity (F2 or higher), Power BI Premium capacity (P1 or higher), or a Fabric Copilot capacity.

**13. True** — Hierarchies support drill up and drill down, with aggregates computed at each level at query time.

**14. False** — That describes a *snowflake* schema. In a star schema, the fact table relates directly to the dimension tables.

**15. D** — Column charts compare values across discrete categories, and maps compare values across geographic areas. *Not A:* pie charts show proportions and scatter plots compare two numeric measures. *Not B:* line charts suit trends over time, and a table loses the geographic view. *Not C:* scatter plots don't fit categorical comparison.

**16. B** — Direct Lake loads Delta tables from OneLake into memory without copying them into the model; reports in the Power BI service can be viewed on mobile with the Power BI phone app. *Not A/D:* Import mode copies data into the model. *Not C:* Desktop-only reports can't be consumed by business users on their phones.

---

## Score guide

| Score | What it means |
|---|---|
| 14–16 | Exam-ready on this module — move on |
| 12–13 | Solid; review the concepts you missed |
| 9–11 | Re-read the units behind your misses before moving on |
| 0–8 | Work back through the module and retake |

## Sources (Microsoft Learn)

- [Describe Power BI tools and workflow](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-data-visualization/2-power-bi)
- [Describe core concepts of data modeling](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-data-visualization/3-data-modeling)
- [Describe considerations for data visualization](https://learn.microsoft.com/en-us/training/modules/explore-fundamentals-data-visualization/4-data-visualizations)
