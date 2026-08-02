# 01 - Multi-step Agent Workflows

## Notes

### Overview

Everything through Week 7 built single agents that take one request and produce one response (with maybe a tool call or two in between). **Multi-step agent workflows** go further: they chain multiple stages — sometimes multiple agents — together to complete a task that no single prompt-and-respond cycle could handle reliably. This is the shift from "an agent" to "an agent system."

The motivating problem: as a task grows more complex, cramming it all into one agent call increases the chance the model skips a step, loses track of state, or mixes up instructions meant for different stages. Splitting the task into explicit steps trades some flexibility for **predictability and control**.

---

### 1. Why Break a Task Into Steps

- **Reliability**: a focused prompt for one narrow step is far more consistent than one giant prompt trying to do everything at once.
- **Debuggability**: when something goes wrong, you can see exactly which step failed instead of guessing where in a monolithic response the reasoning broke down.
- **Reusability**: individual steps (e.g. "summarize document", "classify intent") can be reused across multiple workflows.
- **Cost/latency control**: cheaper/faster models can handle simple steps, reserving expensive models for the steps that actually need them.

---

### 2. Sequential vs Branching vs Looping Workflows

| Pattern | Shape | Use case |
|---|---|---|
| **Sequential** | Step 1 → Step 2 → Step 3 | Fixed pipeline: fetch → summarize → send |
| **Branching (conditional)** | Step 1 → IF/ELSE → different paths | Route support tickets by category to different handling logic |
| **Looping / iterative** | Step repeats until a condition is met | Keep refining a draft until a quality check passes |
| **Parallel / fan-out–fan-in** | One input triggers several steps at once, results merge | Run 3 research sub-queries simultaneously, combine into one report |

Most real production workflows are a **combination** of these — a sequential backbone with a conditional branch here and a loop there.

---

### 3. Orchestrator vs Sub-agent Pattern

A common architecture for multi-step systems:

- An **orchestrator agent** (or workflow) receives the task, breaks it into sub-tasks, and decides what happens next.
- **Sub-agents** or **sub-workflows** each handle one narrow responsibility and return a result to the orchestrator.
- The orchestrator decides whether to continue, branch, retry, or stop based on each sub-agent's output.

This mirrors the **planning vs execution** split from Week 5 — the orchestrator plans, sub-agents execute.

```text
                ┌─────────────────┐
   Task ───────>│   Orchestrator    │
                └─────────┬────────┘
                          │ decides next step
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  ┌───────────┐    ┌───────────┐     ┌───────────┐
  │ Sub-agent A│    │ Sub-agent B│     │ Sub-agent C│
  │ (research) │    │ (draft)    │     │ (review)   │
  └─────┬─────┘    └─────┬─────┘     └─────┬─────┘
        └─────────────────┴─────────────────┘
                          │ results
                          ▼
                ┌─────────────────┐
                │   Orchestrator    │──> Final output
                └─────────────────┘
```

---

### 4. State and Data Passing Between Steps

- Each step needs a clearly defined **input** and **output** — treat every step like a function with a contract.
- **State** (what's been done so far, intermediate results) must be explicitly carried forward between steps — in n8n this is the data flowing through the workflow; in code it's a shared context object.
- Ambiguous or inconsistent output formats between steps are one of the most common failure points — enforcing structured output (JSON) at each step boundary makes the next step far more reliable.

---

### 5. Error Handling Across Steps

- Decide per step: **retry**, **fallback**, or **fail the whole workflow**.
- A failure in step 2 of 5 shouldn't silently produce a broken final result — it should either halt with a clear error or degrade gracefully (e.g. skip an optional enrichment step).
- Long workflows benefit from **checkpointing**: saving intermediate state so a failure doesn't force re-running expensive earlier steps.

---

### 6. Multi-step Workflows in n8n

n8n is a natural fit for this pattern because a workflow already *is* a graph of steps:

- Each **node** (or AI Agent node) can represent one step in the chain.
- **IF/Switch nodes** implement branching.
- **Loop Over Items** / **SplitInBatches** nodes implement iteration.
- Sub-workflows (**Execute Workflow** node) implement the orchestrator/sub-agent pattern — one workflow calls another as a reusable unit.
- The **Executions** log gives visibility into exactly which node produced what output, making multi-step debugging tractable.

---

### 7. When Multi-step Is Overkill

Not every task needs this. Splitting a simple task into five steps adds latency, cost (multiple LLM calls), and complexity for no real benefit. Multi-step design is worth it when:

- The task has genuinely distinct phases (research → draft → review).
- Different steps benefit from different models, tools, or prompts.
- You need visibility/debuggability into a complex process.

If a single well-crafted prompt reliably does the job, keep it simple.

## Key Points

- Multi-step workflows split a complex task into a chain of focused steps instead of one large agent call, trading some flexibility for reliability and debuggability.
- The three core control-flow shapes are **sequential**, **branching**, and **looping** — most real workflows combine them.
- The **orchestrator/sub-agent pattern** separates planning (what to do next) from execution (doing one narrow thing), mirroring Week 5's planning vs execution split.
- Clear input/output contracts and structured (JSON) data between steps prevent the most common failure mode: ambiguous data passed to the next step.
- Error handling must be decided per step — retry, fallback, or fail — and checkpointing avoids re-running expensive earlier steps after a late failure.
- In n8n, nodes/sub-workflows, IF/Switch nodes, and loop nodes directly implement sequential, branching, and iterative multi-step patterns.
- Multi-step design isn't always worth the added latency and cost — use it when a task has genuinely distinct phases, not by default.

## Examples

- **Content pipeline**: research agent gathers facts → writing agent drafts → review agent checks tone and accuracy → publish step posts the final result.
- **Support ticket triage**: classify ticket → branch by category (billing / technical / general) → route to the matching sub-workflow → escalate to a human if confidence is low.
- **Iterative report refinement**: draft agent produces a report → critique agent scores it → loop back to the draft agent with feedback until the score passes a threshold.
- **Fan-out research**: one query splits into three parallel sub-queries (pricing, competitors, reviews), each handled independently, then merged into a single summary.

## Questions

- How do you decide where to draw the boundary between two steps versus combining them into one?
- What's the best way to enforce structured output between steps so downstream nodes don't break on malformed data?
- How should a multi-step workflow handle a step that fails intermittently — immediate retry, backoff, or route to a fallback path?
- At what point does an orchestrator/sub-agent architecture become worth the added complexity over a single well-designed agent?
- How do you monitor and debug a long multi-step workflow in production without manually inspecting every execution?
