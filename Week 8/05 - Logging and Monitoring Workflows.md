# 05 - Logging and Monitoring Workflows

## Notes

### Overview

Week 7 covered error handling *within* a single workflow (catching a failure and reacting to it). This lesson is about **observability**: knowing what your workflows are doing across time, in aggregate, once they're live and running unattended. Without logging and monitoring, a production agent system is a black box — you find out something's broken when a user complains, not when it happens.

---

### 1. Why Observability Matters More for Agent Systems

Agentic workflows are harder to observe than traditional code because:

- The **same input can produce different outputs** (LLM non-determinism), so "it worked once" doesn't mean "it always works."
- Failures are often **silent** — the agent returns a plausible-looking but wrong answer instead of throwing an error.
- Multi-step workflows (previous lesson) have many places a failure or quality drop can originate, making root-causing harder without visibility into each step.

---

### 2. What to Log

| Category | Examples |
|---|---|
| **Execution metadata** | Workflow ID, execution ID, timestamp, trigger source, duration |
| **Inputs/outputs per step** | What each node/agent received and produced (with secrets redacted — see previous lesson) |
| **Tool calls** | Which tools were called, with what parameters, and what they returned |
| **Errors** | Failure type, stack trace/error message, which step failed |
| **LLM-specific metrics** | Token usage, model used, latency per call, cost per execution |
| **User feedback** | Thumbs up/down, corrections, escalations to a human |

---

### 3. Logging in n8n

- The built-in **Executions** log records every workflow run, its status (success/error), and the data at each node — the first line of observability without any extra setup.
- For anything beyond ad-hoc debugging, pipe execution data to an **external logging/observability tool** (e.g. via an HTTP Request node or a dedicated logging integration) so logs persist, are searchable, and can trigger alerts.
- Use a **Function/Code node** or a dedicated logging step to explicitly capture and forward the specific fields that matter (rather than relying only on n8n's default execution view).

---

### 4. Key Metrics to Monitor

- **Success/failure rate**: what percentage of executions complete without error — a sudden drop signals a broken integration or upstream API change.
- **Latency**: time per execution, and per step within it, to catch slow tools or overloaded LLM calls.
- **Cost**: token usage and API spend per execution — LLM costs can silently balloon as usage grows or prompts drift longer.
- **Retrieval/answer quality** (for RAG-backed agents): tracked via the metrics from the previous lesson (recall, faithfulness, zero-result queries).
- **Volume/throughput**: executions per hour/day — useful for both capacity planning and spotting anomalies (a sudden spike can mean abuse or a retry loop).

---

### 5. Alerting

Logging tells you what happened; **alerting** tells you *when to look*. Without alerts, logs only get read after something has already gone wrong for a while.

- Set thresholds on the metrics above (e.g. error rate > 5% over 10 minutes) that trigger a notification (Slack, email, PagerDuty).
- Alert on **silent failure signals** too, not just hard errors — e.g. a spike in "I don't know" responses or zero-result RAG queries can indicate a real problem even though nothing technically crashed.
- Avoid alert fatigue: too many low-signal alerts trains people to ignore them — tune thresholds so alerts are rare and actionable.

---

### 6. Debugging a Live Issue

A practical workflow when something goes wrong in production:

1. **Check the alert/metric** that fired — what specifically crossed a threshold?
2. **Find the failing execution(s)** in the logs — filter by time range, error type, or workflow ID.
3. **Inspect step-by-step data** — in a multi-step workflow, identify exactly which step's output diverged from expected.
4. **Reproduce** with the same input in a test environment if possible.
5. **Fix, then verify** the fix against both the original failing case and the broader test suite (previous weeks' prompt testing practices apply here too).

---

### 7. Dashboards

Aggregating logs into a dashboard (Grafana, Datadog, or even a simple spreadsheet fed by logged data) turns raw logs into a system you can glance at:

- Executions over time (volume trend)
- Error rate over time
- Average latency and cost per execution
- Top failure types/messages

## Key Points

- Agent systems need observability more than traditional code because failures are often **silent** (a wrong-but-plausible answer) rather than a crash, and outputs vary run to run.
- What to log spans execution metadata, per-step inputs/outputs, tool calls, errors, and LLM-specific metrics like token usage and cost.
- n8n's built-in Executions log is the starting point; production systems typically forward logs to an external tool for persistence, search, and alerting.
- Key metrics to track: success/failure rate, latency, cost, quality signals (for RAG), and volume/throughput.
- **Alerting** turns passive logs into active awareness — threshold-based alerts should cover both hard failures and silent quality-degradation signals.
- Debugging a live issue follows a funnel: alert → find the failing execution → inspect step-by-step data → reproduce → fix → verify.
- Dashboards aggregate logs into trends that make degradation visible before it becomes a major incident.

## Examples

- **Silent failure caught**: a monitoring alert fires on a spike in "I don't know" responses from a support bot, revealing that a knowledge base re-index had silently failed the night before.
- **Cost spike investigation**: a token-usage dashboard shows a sudden cost increase traced back to a prompt change that accidentally included an entire document instead of a summary.
- **Step-level debugging**: an execution log for a 5-step multi-agent workflow shows step 3's output was malformed JSON, pinpointing the exact node causing downstream failures.
- **Alert tuning**: an initial "any error" alert firing dozens of times a day gets refined to "error rate > 5% over 10 minutes," cutting noise and restoring trust in the alert.

## Questions

- What's the right balance between logging enough for debugging and the storage/cost overhead of logging everything?
- How would you detect a "silent" quality regression (technically successful executions, but worse answers) purely from logs and metrics?
- What thresholds would you set for alerting on an agent system without either missing real issues or causing alert fatigue?
- How do you correlate a spike in cost or latency with a specific recent change (prompt edit, model swap, new tool) in a fast-moving workflow?
- What would a good on-call runbook look like for a team responsible for a production agentic workflow?
