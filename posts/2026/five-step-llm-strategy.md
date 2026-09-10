---
title: "Five steps from a business problem to an LLM that actually ships"
path: "five-step-llm-strategy"
excerpt: "Understand, prepare, select, customize, productionize. A working order of operations for picking a language model and getting it into production without burning a quarter."
date: 2026-09-10
draft: true
tags: ["LLM"]
---

Most LLM projects I have watched go sideways did not fail on the model. They failed because somebody picked the model first.

That is the whole pathology. A team reads a benchmark table, decides on a model, and only then goes looking for a problem shaped like it. Six weeks later there is a demo nobody can price, evaluate, or hand to the support team. The work was real. The order was wrong.

There is a sequence that avoids this, and it is not complicated: **understand, prepare, select, customize, productionize**. Five steps. The model choice sits in the middle, not at the front, and by the time you get there the decision is mostly made for you.

### 1. Understand

Before anything else, write down what the business actually wants and how you will know if you got it.

Two things belong here that teams usually skip.

**Separate model metrics from business metrics.** Model-centric metrics are the ones your notebook prints: accuracy, F1, perplexity, BLEU, exact match. Business-centric metrics are the ones your director cares about: tickets deflected, hours saved per analyst, invoices processed without human touch, revenue per session. They are not the same number and they do not always move together. I have seen a classifier gain four points of F1 and deflect fewer tickets, because the gain came entirely on a class that was never routed to a human anyway.

Pick both. The model metric is how you steer during development. The business metric is how you decide whether the thing was worth building.

**Look at the data before you promise anything.** Quantity, quality, format. Two thousand labelled examples is a different project from twenty. A folder of scanned PDFs is a different project from a clean database export. If the labels came from three different people over two years with no guidelines, you have a labelling project first and an LLM project second.

Then the non-functionals, which is where most of the honest constraints hide:

- **Cost per call, and calls per day.** A tenth of a cent is nothing until it runs forty thousand times a day.
- **Latency.** Something a user waits for behaves differently from something that runs overnight.
- **Scale.** Peak concurrency, not average.
- **Data residency and privacy.** This one quietly eliminates entire vendors, so find out on day one rather than day sixty.
- **Budget and timeline.** Both the build and the running cost, which are separate budgets and often separate owners.

If you cannot fill in this section, you are not ready to evaluate anything. You are still doing discovery, and that is fine — just call it what it is.

### 2. Prepare

Now you go looking, and the first thing to look for is whether you need an LLM at all.

**Research existing and non-LLM solutions.** A regular expression, a lookup table, a gradient-boosted tree over tabular features, a vendor product someone already licensed. This is not pessimism about LLMs. It is that you need a baseline, and a boring baseline is the most useful object in the whole project. It tells you what "good" costs today. Every later decision gets measured against it. If logistic regression over TF-IDF gets you 88% and the LLM gets you 91%, that three points has a price, and someone other than you should decide whether to pay it.

**Then compare candidate models on the boring attributes first.** Context length, price per million tokens in and out, licence, whether you can self-host, rate limits, how long the provider supports a version before deprecating it. These are facts. They are also usually enough to cut a list of twenty models to four.

**Then benchmarks, leaderboards and arenas — with a healthy suspicion.** Public benchmarks are contaminated, leaderboards drift, and arena rankings measure what humans prefer in a chat window, which may have nothing to do with extracting line items from a purchase order. Use them to shortlist. Never use them to decide. The score that matters is the one your candidates get on your data, and you are about to build that.

**Curate the data: clean, preprocess, split.** Even in a prompting-only project you need a held-out evaluation set. Especially in a prompting-only project, because prompt iteration overfits to whatever examples you keep staring at. Freeze a test set now, before you have opinions about it, and do not look at it again until the end.

A hundred well-chosen examples that cover your real edge cases beat ten thousand scraped rows. Pull the weird ones deliberately: the empty input, the wrong language, the customer who pasted their entire email thread, the malformed number format that only the Belgian office uses.

### 3. Select

This is the step everyone thinks is the whole project, and by now it is almost mechanical.

Take your shortlist. Run it against the evaluation set you just froze. Compare against the boring baseline. Include the cheap small model even when you are sure it will lose — it wins often enough to be worth the twenty minutes, and when it loses you get a defensible reason to spend more.

Two habits worth keeping:

**Log every run.** Model version, prompt version, parameters, cost, latency, the actual outputs. Three weeks from now someone will ask why you chose this one, and "I remember it being better" is not an answer. Model versions also shift under you; without a log you cannot tell a regression from a memory.

**Do not select a single model reflexively.** Routing is a legitimate design: a small fast model handles the 80% of easy cases, a larger one takes the rest. Cost drops sharply, and you need a confidence signal to route on anyway.

If you are fine-tuning, this is where you train and validate. If you are not, this is where you conclude you do not need to, which is a real outcome and worth stating out loud.

### 4. Customize

Four levers, and they are not equal. Three of them act at inference time, one at training time.

**Prompting** is first, always. It is the cheapest thing you can change and the fastest to test. Few-shot examples, an explicit output schema, a clear description of the role and the constraints. Teams routinely jump past this to fine-tuning and discover afterwards that a better prompt closed most of the gap for free.

**RAG** is the answer to "the model does not know our stuff". Retrieval puts the relevant document in front of the model at the moment it answers. It is what you want for knowledge that changes — policies, prices, product docs, tickets — because updating an index is trivial and retraining is not. Most RAG disappointments are retrieval disappointments: the model answered fine given what it was handed, and what it was handed was the wrong three chunks.

**Agents** let the model take actions in a loop: call a tool, read the result, decide what to do next. Right for tasks with genuine branching, where the sequence of steps depends on what you find. Wrong, and expensive, for anything you could have written as a fixed pipeline. If you can draw the flowchart, write the flowchart.

**Fine-tuning** is the only one that changes the model's weights, and the only one that happens at training time rather than inference time. It is the right tool for form — consistent tone, a rigid output format, a domain's vocabulary and conventions. It is a poor tool for facts, because retraining to update a fact is absurd when an index update does the same job in seconds. It also gives you a model you now own the lifecycle of: versions, retraining, drift, storage. That is not a reason to avoid it. It is a reason to be sure the first three levers were not enough.

The order is deliberate. Prompt, then retrieve, then add agency, then fine-tune. Each step up costs more to build and more to maintain, and each one is harder to undo.

### 5. Productionize

The gap between a working notebook and a working service is where most of the calendar actually goes.

**Define the API between the model and everything else.** A clean boundary — request in, structured response out — is what lets you swap models later without touching the product. You will swap models. Something cheaper or better ships every few months, and a team that wired the provider SDK directly into three controllers cannot take advantage of it.

**Decide hosting and deployment.** Vendor API, managed endpoint, or your own GPUs. This follows from step 1's non-functionals, not from preference. Data residency, latency floor and volume decide it between them.

**Handle the operational surface.** Scaling and queueing under burst. Timeouts and retries, because providers do fail. Monitoring on latency, error rate and spend, with an alert on spend specifically — a retry loop against a metered API is an expensive kind of bug. Security around prompt injection, especially anywhere the model output feeds something that executes. Compliance and audit logging. Observability that captures inputs and outputs, so that when someone reports a bad answer you can find the request rather than guessing.

**Run evals against the business metrics from step 1.** This is what closes the loop. Not the offline F1 you tracked during development — the tickets deflected, the hours saved, the invoices cleared. Model-metric dashboards look reassuring and tell you very little about whether the project earned its keep.

**Then keep measuring.** Inputs drift, providers update models beneath you, and the thing that worked in March quietly degrades by September. Schedule the re-evaluation. Set a threshold that triggers a look. Retrain or re-tune when it fires, not when someone happens to notice.

### The part that matters

Read the five steps back and notice what the first one and the last one have in common. Step 1 defines the business metric. Step 5 measures it. Everything in between is machinery.

That is the actual discipline here. The strategy is not really about selecting a model — the model tends to fall out of the constraints once you have written them down honestly. It is about deciding in advance what success means, in terms the business recognises, and then being willing to check.

Skip step 1 and you will still ship something. You just will not be able to tell anyone whether it worked.
