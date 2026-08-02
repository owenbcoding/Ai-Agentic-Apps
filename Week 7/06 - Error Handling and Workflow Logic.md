# 06 - Error Handling and Workflow Logic

## Notes

### Overview

Every workflow built across Weeks 6-7 has assumed the happy path: APIs respond, data is well-formed, tools succeed. Real automations don't get that luxury. This lesson covers how n8n handles failure — at the node level, the workflow level, and the system level — plus the control-flow nodes (branching, looping, waiting) that make workflow logic robust instead of brittle.

---

### 1. Where Things Go Wrong

| Failure type | Example |
|---|---|
| **External service failure** | An API times out, returns a 500, or rate-limits the request |
| **Bad input data** | A required field is missing or malformed (e.g. an invalid email) |
| **Auth failure** | An expired token or revoked credential |
| **Logic error** | A branch condition doesn't account for an edge case |
| **Agent-specific failure** | The LLM calls a tool with invalid arguments, or loops without converging |

Good error handling assumes failure is normal and designs for it, rather than treating every failure as a surprise to patch after the fact.

---

### 2. Node-Level Error Handling

Every node in n8n has a **"Continue on Fail"** (error output) setting:
- **Off (default)**: a node failure stops the entire workflow execution immediately.
- **On**: the node outputs an **error branch** instead of stopping — the workflow can catch and handle the failure explicitly (log it, notify someone, use a fallback value).

```
        ┌───────────────┐
        │   HTTP Request │
        └───────┬───────┘
      success ───┤─── error (Continue on Fail = on)
                 │
        ┌────────▼────────┐        ┌──────────────────┐
        │  Continue normal │        │  Log + notify     │
        │  workflow path   │        │  failure path      │
        └──────────────────┘        └──────────────────┘
```

This is n8n's equivalent of a **try/catch**: the "try" is the normal output, the "catch" is the error output branch.

---

### 3. The Error Trigger Workflow

n8n supports a **global catch-all**: a separate workflow with an **Error Trigger** node, which any other workflow can be configured to call automatically whenever it fails (regardless of where the failure happened).

- Centralises failure handling — one place to log errors, alert on-call, or create an incident ticket.
- Receives details about **which workflow failed, which node, and the error message**.
- Complements (doesn't replace) node-level "Continue on Fail" — node-level handling deals with *expected, recoverable* failures inline; the Error Trigger workflow catches *unexpected* failures that weren't specifically handled.

---

### 4. Retry Strategies

| Strategy | How | Best for |
|---|---|---|
| **Built-in node retry** | Most nodes have a "Retry on Fail" option with a configurable attempt count and wait time | Transient failures (network blips, momentary rate limits) |
| **Custom retry loop** | Manually loop back to a node using workflow logic, checking for a specific failure condition | When the retry needs custom logic between attempts |
| **Exponential backoff** | Increase wait time between retries | Rate-limited APIs, where hammering the same endpoint makes things worse |

**Not all failures should be retried** — retrying a request that failed due to bad input just fails again identically. Retries are for **transient** failures, not **deterministic** ones.

---

### 5. Validating Data Early (Guard Clauses)

Catching bad data at the start of a workflow is cheaper than debugging a failure three nodes downstream:
- Use an **IF** or **Switch** node right after the trigger to check required fields exist and are well-formed.
- Route invalid input to an explicit "reject" branch (log it, notify, or return a clear error) rather than letting it flow into nodes that assume valid data.
- This mirrors defensive programming's "fail fast" principle — validate at the boundary, trust the data everywhere after.

---

### 6. Workflow Control Logic

| Node | Purpose |
|---|---|
| **IF** | Two-way branch based on a condition (true/false) |
| **Switch** | Multi-way branch based on a value matching one of several cases |
| **Merge** | Recombine branches back into a single flow |
| **Split in Batches** | Process a large dataset in chunks (loop), useful for rate limits and memory |
| **Wait** | Pause execution for a duration or until a webhook/condition is met |

**Split in Batches** in particular is the standard way to avoid overwhelming an external API: instead of firing 10,000 requests at once, it processes them in controlled chunks, often combined with a **Wait** node between batches to respect rate limits.

---

### 7. Alerting on Failure

An error that fails silently is worse than one that stops the workflow loudly:
- Route error branches (node-level or the global Error Trigger workflow) to a **Slack** notification or **email alert** (Lesson 04) so a human knows something needs attention.
- Include enough context in the alert to act on it: which workflow, which node, the error message, and ideally the input data that caused it.
- For agent-based workflows, also alert on **non-crash failures** — e.g. the agent looping too many times without resolving, or repeatedly calling a tool with invalid arguments — since these don't "error" in the traditional sense but still indicate something is broken.

---

### 8. Designing for Idempotency

Retries and re-runs are only safe if repeating an action doesn't cause harm — this connects back to the **idempotency** principle from Week 6's data pipelines lesson:
- An **Append Row** retried after a false-negative timeout can create duplicate rows unless guarded by a uniqueness check.
- A **"send email" retried** after an ambiguous failure can double-send unless the workflow first checks whether it already succeeded.
- Designing actions to be **safely repeatable** (check-before-write, unique keys, idempotency tokens on API calls) is what makes aggressive retry strategies actually safe to use.

---

## Key Points

- Good error handling assumes failure is the normal case, not an edge case to patch after launch.
- Each node's **"Continue on Fail"** setting turns a hard stop into an inspectable **error branch** — n8n's equivalent of try/catch.
- The **Error Trigger workflow** is a global catch-all for unexpected failures across all workflows — centralising logging and alerting.
- **Retries** (built-in, custom, or with exponential backoff) are for transient failures only — retrying a deterministic failure just fails again.
- **Validate data early** with IF/Switch guard clauses right after the trigger — fail fast instead of letting bad data cascade downstream.
- **IF, Switch, Merge, Split in Batches, and Wait** are the core control-flow nodes for branching, looping, and pacing a workflow.
- Failures should always **surface to a human** (Slack/email alert) with enough context to act — including non-crash agent failures like unresolved loops.
- Retries are only safe when actions are **idempotent** — design writes to be safely repeatable before relying on aggressive retry logic.

## Examples

- **Node-level catch**: An HTTP Request node with "Continue on Fail" routes API failures to a branch that logs the error and notifies Slack, instead of halting the whole workflow.
- **Global catch-all**: A dozen unrelated workflows all point to the same Error Trigger workflow, which posts every failure to a shared `#automation-alerts` Slack channel.
- **Backoff retry**: A workflow calling a rate-limited API retries failed calls with exponentially increasing wait times instead of hammering the endpoint immediately.
- **Idempotency guard**: A "create invoice" workflow checks for an existing invoice with the same order ID before creating a new one, making it safe to retry after a timeout.

## Questions

- How do you decide which failures deserve automatic retry versus immediate human escalation?
- What's the right way to test error-handling branches without waiting for a real failure to happen naturally?
- How should an agent-based workflow detect and break out of a tool-calling loop that isn't converging?
- When using Split in Batches against a rate-limited API, how do you pick batch size and wait time without just guessing?
- How much error context is too much to include in an alert — where's the line between "actionable" and "noisy"?
