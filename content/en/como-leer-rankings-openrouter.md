---
slug: como-leer-rankings-openrouter
title: How to read the OpenRouter rankings
type: guide
order: 13
summary: A guide to interpreting OpenRouter usage, spend, speed and benchmarks, following its thirteen text sections and turning the signals into comparable tests.
tags: [openrouter, models, rankings, benchmarks, evaluation, costs, harness]
related: [guia-escalado-modelos, comparar-harness-cli-codex-claude-opencode-cline, modelos-guiados-el-entorno-es-la-politica]
area: Gobierno de agentes
glyph: △
hue: rgba(168,106,255,.24)
---

# How to read the OpenRouter rankings

*A tracking guide for choosing which models to test*

Reviewed on October 3, 2026 · The main page showed usage data through October 2, 2026

A ranking is useful when it helps you make a concrete decision: which model is worth testing, for what work and at what cost if you get it wrong. The problem arises when a position becomes a conclusion that the measurement never promised.

OpenRouter brings together signals of real usage, spend, speed and capability evaluations. This guide proposes a tour of its sections, identifying what each one counts and turning them into a repeatable tracking process. **First we choose what to observe; then we check whether that signal improves our work.**

The main tour covers the thirteen subsections of Text. It also includes the other Rankings tabs and their units. Names and controls correspond to the review date above; the numerical examples are illustrative and do not present current winners. [[1]](https://openrouter.ai/rankings)

## The question to ask before looking at first place

Before comparing two models, write down five things: unit, population, time window, aggregation and conditions. This minimal record prevents sweeping conclusions from small numbers.

- **Unit:** tokens, requests, dollars, seconds or benchmark points. Changing the unit changes the question.

- **Population:** all eligible traffic, a classified sample, a language, an application or a specific test.

- **Window:** a full day, seven days, thirty days or the date of an experiment. The access date does not replace the date of the data.

- **Aggregation:** sum, share, change, median or composite index. An average and a median can tell different stories.

- **Conditions:** version, variant, provider, reasoning effort, cache, tools and harness. The same name can cover different configurations.

OpenRouter observes the traffic that passes through its platform and enters each public dataset. That population alone does not let you infer a lab's worldwide market share, its number of customers or its entire business. Private data and documented exclusions also matter. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

## A tour of the thirteen sections

### 1 Top Models

This is the historical overview of weekly token volume. It lets you see which models sustain activity, which appear suddenly and how the total size of traffic changes. The visualization highlights nine models and groups the rest under Others. The unit adds input and output; each variant is treated separately. [[1]](https://openrouter.ai/rankings)

**How to track it:** compare several weeks, record the scale and look at the total as well as each color. A linear scale helps put absolute differences in perspective; a logarithmic scale makes orders of magnitude easier to see. Changing the scale does not change the data, but it does change their appearance.

**What to avoid:** interpreting more tokens as more people or more productivity. An agent that rereads a repository, chains turns together or generates long responses can produce a lot of volume. Tokenizers also do not segment text identically across providers. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

### 2 Leaderboard

The table lets you rank that usage and choose open models, closed models or all models. Today, This Week and This Month cover 1, 7 and 30 full days respectively, ending in UTC. New & Trending compares the last seven days with the previous seven; it requires one million tokens in the current window and may place up to five new models first. [[1]](https://openrouter.ai/rankings)

Growth compares volumes: going from 10 to 15 million tokens represents a 50% increase. It does not mean gaining fifty percentage points of share. And new indicates the lack of a comparable prior baseline, not an infinite growth rate.

**How to track it:** keep a weekly view for the trend and a monthly view for persistence. Separate launches, free variants and stable versions. An openness filter changes the set being compared; it does not certify licenses, usage permissions or model quality.

### 3 Top models by task

This section brings the ranking closer to concrete work. It lets you switch between **Share of spend** and **Share of tokens**. Tasks are inferred from a sample of prompts, and the interface says it adjusts the figures for sampling. The Auto Router documentation associates the spend view with a rolling seven-day window. [[3]](https://openrouter.ai/docs/guides/routing/routers/auto-router) [[4]](https://openrouter.ai/blog/announcements/introducing-the-new-auto-router/)

The rectangle map, or treemap, contains two levels that should be read separately. A task's area indicates how much it represents within the total for the selected metric. When you open it, the list shows each model's share within that task. The size of Classification and a model's percentage in Classification have different denominators.

**Example:** if a task accounts for 10% of spend and a model accounts for 20% of that task's spend, its portion of the total would be 2%, provided both percentages share the same population and window. Reading the 20% as a share of all OpenRouter would inflate the interpretation tenfold.

Colors distinguish four families. There were 29 labels at the time of review; preserving their names makes them easier to find even if their position in the chart changes:

- **General:** Classification, Content Writing, Roleplay & Fiction, Q&A & Knowledge, Conversation, Research & Reports, Customer Support, Summarization, Security Audit, Math, Finance & Trading, Translation and DevOps

- **Agent:** Workflow Execution, Multi-step Planning, Tool Dispatch, Web Search and Memory Extraction

- **Code:** Code Generation, Debugging, File I/O, Code Review, Shell Execution, Frontend & UI, Repo Scanning, DevOps & Config and SQL & Database

- **Data:** Data Extraction and Data Transformation

**How to track it:** choose the task closest to your work and switch between spend and tokens. If a model takes up much more space in spend, investigate price, length, reasoning and the mix of work. If it gains in tokens, investigate volume and free variants. Neither difference identifies, by itself, which responses were correct.

The classification is an estimate of the prompt's intent. A programming session may move through planning, file reading, search, generation and review. Avoid treating each box as a separate industry or adding up their positions to invent an overall score.

**Methodological limit:** the interface explains that deltas compare with the previous window, but does not spell out all the details there. Before publishing a change as percentage points, check the specific definition. These views also do not publish a complete account of sample size, classifier accuracy, confidence intervals and the accounting treatment of spend.

There is another relevant difference for anyone who wants to automate tracking: the classifications API documents shares of requests and tokens, excludes other from the denominator and ranks models by requests. Those fields do not automatically replace the treemap's spend share. A similar name does not guarantee the same calculation. [[5]](https://openrouter.ai/docs/api/api-reference/classifications/task-classification-market-share)

### 4 Cost per session

Here the question shifts to the observed cost of an agent session. The unit is USD per session and the summary statistic is the median, separated by harness. The reviewed interface showed Hermes Agent, Claude Code, Kilo Code and Codex, with ranges of 1, 2 to 9, 10 to 49 and 50 or more turns.

The tooltip specifies a 30-day window, paid usage and a logarithmic scale. A session is attributed to a model when that model processed at least 80% of its tokens. The dataset reference confirms that applications are not mixed together, that medians are published and that the snapshot is updated weekly. [[1]](https://openrouter.ai/rankings) [[6]](https://openrouter.ai/docs/api/api-reference/datasets/cost-per-session-by-harness-and-model)

**How to track it:** fix the harness first, then choose a comparable range. The median describes the center of the distribution: half the sessions fall below it and the other half above it. It does not show how much the tail of difficult sessions costs, nor is it enough to budget for a full month.

A cheap session may have been simple, short, aborted or unsuccessful. A long one may have completed valuable work. To decide in your own environment, add success, retries and review time. The 80% rule also limits how you can interpret workflows that spread a lot of work across several models. The exact session boundaries and publication thresholds are not specified in the reference consulted.

### 5 Market Share

This groups by model author and counts text requests. Absolute shows quantities; Percentage shows each author's portion of the period's total. The model author is not necessarily the company serving the endpoint. [[1]](https://openrouter.ai/rankings)

**How to track it:** look at both views. If an author goes from 100 to 120 requests while the total goes from 200 to 300, its volume grows by 20% and its share falls from 50% to 40%. Both observations are compatible.

This section helps identify changes in the composition of traffic. Explaining the cause requires more evidence: launches, availability, prices, integrations or routing decisions. Two curves moving at the same time is not enough. Also keep the date of the observed point; the summary text and the chart may refer to different cutoffs.

### 6 Benchmarks

This is the section for comparing evaluation results. The reviewed selector brought together thirteen metrics from three families: evaluations run by OpenRouter, Artificial Analysis indices and Design Arena ratings. Keep that provenance alongside the score. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

- **GPQA Diamond, τ²-Bench Airline and VGI-Bench:** the panel presents accuracy. For GPQA Diamond and VGI-Bench, the tooltip specifies median accuracy across providers, measured by OpenRouter. Each test has its own protocol; open its detail page before interpreting the percentage.

- **Intelligence Index, Coding Index and Agentic Index:** these are composite indices from Artificial Analysis. They are useful for an initial general, coding or agent shortlist. An index value should not automatically be read as the percentage of tasks solved.

- **Code Categories, UI Component, Game Development, Data Visualization, 3D, Image and SVG ELO:** these are Design Arena ratings for head-to-head comparisons. Their scale is relative to the evaluation system and its participants; 1,500 Elo points do not equal 75% quality.

In an accuracy evaluation, the denominator is the cases evaluated under a protocol. A composite index involves several tests and their combination rules. Elo involves comparisons and relative results. These methodologies answer different questions: they should not be averaged as if they shared a scale.

**GPQA Diamond** uses a fixed set of scientific questions. Its detail page aggregates runs from the last 90 days, weighted by question count, with a minimum coverage requirement per model-provider pair whose number is not specified. There is a difference worth preserving: while the widget tooltip describes a median across providers, the detail page prioritizes the result with default routing and uses the median when that result is missing. Cite the exact view your figure comes from. [[23]](https://openrouter.ai/benchmarks/gpqa-diamond/)

**VGI-Bench** stands for Video General Intelligence Bench and evaluates understanding of long videos. OpenRouter's implementation supplies the video and a multiple-choice question in a single turn, with temperature 0, and grades the final letter. It uses a public set of 439 questions, requires at least 395 answers for a run to be included and considers the last 90 days. It is useful for investigating temporal and audiovisual understanding; its accuracy is not a video-generation score. [[21]](https://openrouter.ai/benchmarks/vgi-bench)

**τ²-Bench Airline** evaluates customer service with a simulated user and airline tools. Success requires the expected final database state and the required messages, with no partial credit. The detail page fixes the simulator, limits a run to 200 steps and aggregates tests from 90 days, weighted by tasks, with a minimum of 45 per model-provider pair. Its main result uses default routing if available; otherwise, the median across providers. That rule from the detail page should not be generalized to the entire widget. [[22]](https://openrouter.ai/benchmarks/tau2-bench-airline/)

The economic axis also changes. The chart offers Weighted Avg Input Price, Input List Price and Avg Price Per 100 Requests. The first two views are expressed per million input tokens; the third uses requests. The effective price on detail pages incorporates observed usage, where caching and discounts may cause it to differ from the published price. [[9]](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b/pricing)

**How to track it:** fix the benchmark and price axis before comparing. Input price leaves out output and other components of your bill; the average per request depends on the size of those requests. Neither automatically equals cost per solved task.

Show Pareto helps identify options that are not simultaneously outperformed on both selected dimensions. If two candidates have the same score and one costs less, the more expensive one is dominated in that chart. That conclusion may change when you add latency, reliability, permissions or performance in Spanish. The visible frontier also does not represent models the chart did not include.

The View all benchmarks link leads to a broader catalog with Agents, Media, Artifacts, Reasoning and Search families. Its experiments may also evaluate tools, search engines and budgets. Review the specific run: the catalog's latest overall date does not retrospectively update every card. [[8]](https://openrouter.ai/benchmarks)

### 7 Fastest models

This has two modes: Highest throughput and Lowest latency. The eligibility tooltip admits models with at least 100,000 requests in the last 24 hours. That threshold describes who can appear; on its own, it does not specify how all performance values were aggregated.

Throughput expresses generation speed in tokens per second. Latency requires reading its definition in the corresponding view: waiting for the first token and receiving the complete response are different experiences. OpenRouter's performance pages distinguish TTFT and latency measures; do not assume that every panel uses the same percentile or window. [[10]](https://openrouter.ai/docs/guides/best-practices/latency-and-performance) [[11]](https://openrouter.ai/amazon/nova-2-lite-v1/performance)

**How to track it:** compare the same endpoint, context and configuration. Sustained speed matters for a long response; the initial wait may dominate a brief interaction. For an agent, also add tools, turns and retries. A model that writes quickly may take longer to finish the work.

Do not automatically attribute one provider's best performance to every provider serving that model. If the view does not state the percentile, window or weighting across providers, retain that limitation in the comparison.

### 8 Languages

This lets you segment by natural language and switch between absolute quantity and percentage. Language data comes from extrapolated samples; the public reference treats it as weekly estimates. Share is interpreted within the selected language, not across all languages. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**How to track it:** for a product in Spanish, look at Spanish even if English dominates the overall picture. Then test real tasks: understanding instructions, register, regional expressions, extraction and the faithfulness of responses. Traffic in a language does not, by itself, evaluate quality in that language.

A conversation may mix languages, code and quotations. Without a published definition of the classifier and its error, small changes deserve caution. Extrapolation provides a volume estimate; it does not remove selection bias or guarantee that the sample represents all use of Spanish.

### 9 Programming

This applies a similar approach to programming languages, with Python as the initial selection at the time of review. It shows token usage in a classified sample. The absolute and percentage views retain the segment's unit, which is not a problem-solving rate. [[1]](https://openrouter.ai/rankings) [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**How to track it:** compare your repository's language and cross-reference it with Coding Index or a relevant coding benchmark. That builds a candidate list. Your own test should include understanding the project, a change with tests, a bug and a diff review.

A model appearing frequently in Python may reflect an application's integration or the volume of a heavy user. Nor does it identify the framework, difficulty, version or final outcome. A change in share warrants investigation; replacing the model requires verifying an improvement.

### 10 Context Length

This counts requests by the observed length of prompt and completion. The selector offers less than 1K, 1K to 10K, 10K to 100K, 100K to 1M and 1M to 10M tokens. The chart's unit is requests, with an absolute or percentage view. [[1]](https://openrouter.ai/rankings)

**How to track it:** choose the range of your workloads. Seeing usage with long inputs and outputs may indicate that a model is worth testing for long documents or large repositories. The advertised maximum window requires a separate check of the model's detail page.

Nominal capacity, the length actually used and the quality of information retrieval are three different measurements. To validate long context, use relevant data placed in different parts of the material and verify relationships between them. Fitting within the limit does not demonstrate understanding.

### 11 Tool Calls

This presents the distribution of tool activity across models. The public tool_calling filter identifies requests in which at least one call was recorded; that does not let you automatically equate requests with the number of individual calls. When exporting data, preserve the field counted by that view. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**How to track it:** use it to identify models present in workflows with tools. Then measure tool selection, valid arguments, interpretation of results, error recovery and respect for permissions.

More activity may accompany a useful agent or an unproductive loop. It may also change because of how the harness divides an operation. The chart's share does not reveal what percentage of calls succeeded or what percentage of all that model's traffic used tools.

### 12 Images

Within Text, Images shows images processed by models and lets you switch between volume and share. It is important to distinguish this block from the top-level Image tab, which focuses on image generation. The dataset separately documents image input and image_output output. [[1]](https://openrouter.ai/rankings) [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**How to track it:** to understand screenshots, invoices or charts, look at multimodal usage and build concrete reading tests. To generate illustrations, choose the generation tab and its corresponding evaluations.

A request may contain more than one image. Image counts, requests with images and image tokens are not interchangeable. And processing many images does not demonstrate accuracy in OCR, counting, spatial interpretation or visually following instructions.

### 13 Top Apps

This ranks applications and agents that participate in public usage attribution. Volume is expressed in tokens, and the selector lets you change the period. Hidden or private apps are excluded; the dataset may consolidate aliases of the same application. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

**How to track it:** cross-reference it with model movements. A large integration can alter demand without the model having changed. The app adds instructions, tools, memory and routing, so it should be evaluated as a system.

The ranking does not count installations, active users or all of an application's activity outside OpenRouter. Nor do all controls called trending share a formula: the apps API describes excess absolute growth relative to three previous periods, while the model ranking compares percentage growth between two windows. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

## The other tabs also change the unit

The top bar lets you leave Text. In Image, Video, Speech, Embeddings, Rerank and Transcription, tables are ranked by requests and the chart above may offer another unit. Batch starts with subrequests and also allows ranking by tokens. Check which of the two components changes with each selector. [[13]](https://openrouter.ai/rankings/image) [[14]](https://openrouter.ai/rankings/video) [[15]](https://openrouter.ai/rankings/speech) [[16]](https://openrouter.ai/rankings/embeddings) [[17]](https://openrouter.ai/rankings/rerank) [[18]](https://openrouter.ai/rankings/transcription) [[19]](https://openrouter.ai/rankings/batch)

- **Image:** the chart switches between requests and images. A request that returns several images counts once in the requests table.

- **Video:** requests or hours in the chart. A request count does not tell you the clips' total duration, resolution or cost.

- **Speech:** requests in the reviewed view. For your own test, audio duration, intelligibility, pronunciation and adherence to style also matter.

- **Embeddings:** requests or tokens in the chart. Also evaluate retrieval with your corpus; more volume does not demonstrate better semantic neighbors.

- **Rerank:** requests or documents. One request may reorder many documents, so the two volumes answer different questions.

- **Transcription:** the chart switches between requests and characters; the table keeps requests. It assesses speech-to-text transcription usage. To choose, measure errors on representative audio, accents and acoustic conditions.

- **Batch:** the Subrequests or Tokens selector changes both the chart and the table. It offers a filter for text, embeddings or all modalities. Subrequests count the work inside batches, not the number of batches. Add completion time, failures and cost when comparing alternatives.

The first six tabs include Top Models, Leaderboard and Market Share. The latter retains requests by author. Batch includes the first two. Not every modality replicates Text's thirteen sections.

The tables retain period controls such as Today, This Week, This Month and New & Trending. A control being available is not enough to attribute all the text ranking's thresholds and rules to it; check that modality's methodological note before reusing its calculation.

## Five mistakes that change a decision

- **Confusing share and growth.** Going from 10% to 15% means gaining 5 percentage points and growing 50% relative to the initial share. State which one you calculated.

- **Reading a share without its total.** A segment may gain share while its volume falls. Save both when available.

- **Comparing different cutoffs.** A partial day, a UTC close and a classification week do not describe exactly the same period.

- **Treating absence as zero.** A model outside the visible top group, without enough data or without a published score may simply be unobservable in that view.

- **Explaining correlations as causes.** A launch, a free offer or a routing change remains a hypothesis until there is additional evidence.

The most important limitation runs throughout this guide: **observed usage helps choose candidates; fitness for our work is established through results.** OpenRouter also recommends checking general benchmarks against real prompts and cost per completed task. [[12]](https://openrouter.ai/blog/tutorials/choose-best-ai-model/)

## A tracking routine that ends in a test

There is no need to look at every panel every day. Keep a stable question and use the sections that provide evidence to answer it.

1. **Define the work.** For example, reviewing changes to a Python backend with tests available and no production access. Agree on what counts as success before seeing the responses.

2. **Choose the segment.** Open Code Review, Programming in Python and the usual context range. Use the overall ranking as context.

3. **Save the observation.** Record the access date, data date, unit, filter, period, exact variant and source. If using the API, also preserve the metadata.

4. **Build a shortlist.** Include the current model, a lower-cost candidate and another that promises greater capability. A usage spike is enough to enter the test, not to win it.

5. **Set comparable conditions.** The same set of cases, context, tools, budget and evaluation criteria. Record provider, effort and limits; document any necessary differences.

6. **Measure the complete outcome.** Success, relevant errors, attempts, time to a usable result, total cost and human review. Count failures and abandoned attempts too.

7. **Repeat where there is variation.** Use multiple attempts when appropriate, keep difficult cases and treat small differences cautiously. Separate consistent improvements from a single good run.

8. **Make a reversible decision.** Keep the current model, test in a bounded environment or replace it. Define what deterioration would justify returning to the previous model and when to review again.

The internal economic metric can be as concrete as spend across all attempts divided by accepted tasks. For example, USD 12 for 30 accepted tasks gives USD 0.40 per accepted task. A second model that spent USD 9 but completed only 15 comes to USD 0.60. The price per token did not make that difference visible.

Human review cost should be recorded separately and, if it matters for the decision, incorporated using an explicit criterion. There is no need to pretend to have precision that does not yet exist: a consistent record is worth more than a very exact figure whose denominator changes every week.

## What deserves a place in the record

A useful record can fit in ten lines: objective; cases and acceptance criterion; date; model and variant; provider; harness and tools; configuration; successes over attempts; cost and time; decision. For public tracking, add the exact OpenRouter view and its unit.

If a panel does not publish sample size, uncertainty, window or the treatment of caching and discounts, write not published rather than filling the gap by intuition. The historical State of AI study and a current panel may use different taxonomies or methods; an explanation from 2025 should not automatically be applied to the 2026 interface.

For republishing data, OpenRouter allows reuse with attribution under CC BY 4.0. Save the snapshot, cite the source and its actual date, and identify your transformations. Documentation response examples describe the format: their figures are not current observations. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api) [[20]](https://creativecommons.org/licenses/by/4.0/)

## A policy that survives the next launch

The value of Rankings lies in narrowing the search space. It helps identify where activity is growing, which tasks attract investment and which alternatives deserve evaluation. The benefit appears when that observation leads to a well-defined test.

For Golden Path, the final criterion is practical: **choose the combination of model, provider and harness that solves the work with sufficient quality, cost and control.** Preserving the evidence behind that choice makes it possible to revisit it when the catalog changes, without starting from scratch or chasing every new first-place model.

## Sources and direct access

Official sources consulted on October 3, 2026. Rankings links open dynamic views; their values may change after this review. The reference screenshots provided for the guide cover Text navigation and Top models by task.

1. [Rankings and interface controls](https://openrouter.ai/rankings)

2. [Data API and public dataset criteria](https://openrouter.ai/docs/cookbook/administration/data-api)

3. [Auto Router and task classification](https://openrouter.ai/docs/guides/routing/routers/auto-router)

4. [Introducing classification by spend](https://openrouter.ai/blog/announcements/introducing-the-new-auto-router/)

5. [Classifications API and denominators](https://openrouter.ai/docs/api/api-reference/classifications/task-classification-market-share)

6. [Cost per session and harness](https://openrouter.ai/docs/api/api-reference/datasets/cost-per-session-by-harness-and-model)

7. [Rankings dataset and filters](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

8. [Benchmark catalog](https://openrouter.ai/benchmarks)

9. [Example of an effective and list pricing page](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b/pricing)

10. [Latency and performance on OpenRouter](https://openrouter.ai/docs/guides/best-practices/latency-and-performance)

11. [Example of a performance page](https://openrouter.ai/amazon/nova-2-lite-v1/performance)

12. [How to choose a model for the task](https://openrouter.ai/blog/tutorials/choose-best-ai-model/)

13. [Image-generation rankings](https://openrouter.ai/rankings/image)

14. [Video rankings](https://openrouter.ai/rankings/video)

15. [Speech rankings](https://openrouter.ai/rankings/speech)

16. [Embedding rankings](https://openrouter.ai/rankings/embeddings)

17. [Reranking rankings](https://openrouter.ai/rankings/rerank)

18. [Transcription rankings](https://openrouter.ai/rankings/transcription)

19. [Batch rankings](https://openrouter.ai/rankings/batch)

20. [Data reuse license](https://creativecommons.org/licenses/by/4.0/)

21. [VGI Bench protocol](https://openrouter.ai/benchmarks/vgi-bench)

22. [tau2 Bench Airline protocol](https://openrouter.ai/benchmarks/tau2-bench-airline/)

23. [GPQA Diamond protocol](https://openrouter.ai/benchmarks/gpqa-diamond/)
