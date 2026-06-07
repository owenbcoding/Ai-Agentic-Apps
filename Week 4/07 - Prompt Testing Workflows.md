# 07 - Prompt Testing Workflows

## Notes

- **Prompt testing** is the systematic process of evaluating and improving prompts across a diverse set of inputs to ensure consistent, high-quality LLM outputs in production.
- Ad-hoc testing ("I tried it once and it looked good") is the most common mistake in LLM development — it produces brittle systems that fail on edge cases.
- Treating prompts like software: they need version control, test suites, CI, and monitoring.

### Why Prompt Testing Matters

- LLMs are **non-deterministic** — the same prompt can produce different outputs on different runs.
- A prompt change that improves one input can silently break another.
- Prompts **degrade over time** as model versions change, new input distributions emerge, or business requirements evolve.
- Without a test suite, you have no way to know whether a prompt change is actually an improvement.

### The Prompt Testing Workflow

```text
1. Define the task clearly
        ↓
2. Build an evaluation dataset (golden set)
        ↓
3. Define success metrics
        ↓
4. Run baseline prompt against eval set
        ↓
5. Iterate on the prompt
        ↓
6. Re-run eval — compare metrics to baseline
        ↓
7. Deploy if metrics improve, no regressions
        ↓
8. Monitor in production
```

### Step 1 — Build an Evaluation Dataset

- Create a **golden set**: a curated set of (input, expected output) pairs that covers:
  - Typical/common cases.
  - Edge cases and tricky inputs.
  - Cases where you previously saw failures.
- Minimum viable eval: 20–50 examples. Production-grade: 200–1,000+.
- Store the eval set in version control — it is as valuable as your code.

### Step 2 — Define Metrics

Evaluation metrics fall into two categories:

#### Automated Metrics (scalable, cheap)
- **Exact match**: output exactly equals the expected string. Good for classification labels, entity extraction, structured data.
- **Contains check**: output contains a required substring or key.
- **JSON validity**: output is parseable as valid JSON with the expected schema.
- **Regex match**: output matches a pattern (e.g. valid email, correct date format).
- **BLEU / ROUGE**: n-gram overlap scores for text generation (translation, summarisation) — crude but cheap.
- **Embedding similarity**: cosine similarity between output and expected answer embeddings — better than n-gram overlap for paraphrase tolerance.

#### LLM-as-judge (scalable, higher quality)
- Use a second LLM (often GPT-4) to score or compare outputs against a rubric.
- Ask: "On a scale of 1–5, how faithfully does this answer address the question?"
- More expensive than automated metrics but much better than exact-match for open-ended tasks.
- Risk: judge model can have systematic biases (e.g. preferring longer answers, self-preferring same model family).

#### Human Evaluation (ground truth, expensive)
- Have humans rate outputs on quality, accuracy, helpfulness, safety.
- Use for final validation and to calibrate your automated metrics.
- Too slow for rapid iteration — use sparingly.

### Step 3 — Regression Testing

- Keep a **regression suite** of known-good (input, expected_output) pairs.
- Every prompt change must pass the regression suite before deployment.
- This catches "improving X while silently breaking Y" — the most common prompt iteration failure mode.

### Step 4 — A/B Testing / Shadow Testing

- **A/B test**: route a percentage of live traffic to the new prompt; compare metrics in production.
- **Shadow test**: run the new prompt alongside the old one in production, log both outputs, compare offline — no user impact.
- Use when automated eval is insufficient to detect quality differences.

### Step 5 — Version Control Prompts

- Store prompts in version-controlled files (not hard-coded in application code).
- Use a **prompt management system** to track versions, associate them with eval results, and roll back quickly.
- Tools: **LangSmith**, **Weights & Biases Prompts**, **Helicone**, **PromptLayer**, custom YAML/JSON files in git.

### Step 6 — Production Monitoring

- Log all prompts, outputs, latencies, and costs in production.
- Set up **alerts** for:
  - Output format failures (e.g. invalid JSON rate spikes).
  - Latency regressions.
  - Cost anomalies (unusually long outputs).
  - Safety / refusal rate changes.
- Periodically sample production outputs and run them through your eval metrics.

### Tooling Overview

| Tool | Purpose |
|---|---|
| **LangSmith** | Tracing, eval datasets, prompt versioning for LangChain apps |
| **Weights & Biases (W&B)** | Experiment tracking, prompt logging, LLM eval |
| **Helicone** | LLM observability, cost tracking, caching |
| **PromptLayer** | Prompt versioning and A/B testing |
| **Braintrust** | Eval framework with LLM-as-judge built in |
| **OpenAI Evals** | Open-source framework from OpenAI for model/prompt evaluation |
| **RAGAS** | Evaluation framework specifically for RAG pipelines |

### Prompt Regression Checklist

Before deploying a prompt change, verify:
- [ ] Passes all golden-set expected output checks.
- [ ] Passes regression suite (no previously-working cases broken).
- [ ] Output format is valid (JSON schema, length constraints).
- [ ] Latency is within acceptable bounds.
- [ ] Cost per call has not increased unacceptably.
- [ ] LLM-as-judge score is ≥ baseline.

## Key Points

- Prompt testing is not optional — ad-hoc testing produces brittle production systems.
- A golden eval dataset is the single most valuable asset for reliable prompt development.
- Use automated metrics for fast iteration and LLM-as-judge for higher-quality evaluation of open-ended tasks.
- Regression testing ensures prompt improvements don't silently break previously working cases.
- Version-control your prompts — they are code.
- Production monitoring closes the loop: real traffic reveals edge cases your eval set missed.

## Examples

- **Classification eval**: test a sentiment classifier prompt against 100 labelled reviews; measure accuracy and F1 score.
- **Structured output eval**: test a JSON extraction prompt; measure valid JSON rate, key presence, and value accuracy.
- **LLM-as-judge eval**: use GPT-4 to score a customer support response prompt on helpfulness (1–5) and compare two prompt versions.
- **Regression catch**: a prompt change to improve conciseness accidentally causes the model to omit required JSON keys — regression test catches it before deployment.
- **Production monitoring**: alert fires because valid-JSON rate drops from 99% to 87% after the model API was silently updated to a new version.

## Questions

- How do you build a golden evaluation dataset when you don't yet have labelled examples in a new domain?
- What are the known biases of LLM-as-judge evaluation, and how do you mitigate them?
- How do you decide how large an eval set you need for a given level of statistical confidence?
- What is the difference between shadow testing and A/B testing, and when would you choose each?
- How do you handle non-determinism in LLMs when running evals — do you average over multiple runs?
- How would you set up a CI/CD pipeline that runs prompt evals on every pull request?
- What production signals would tell you that your prompt is degrading over time without any code changes?

