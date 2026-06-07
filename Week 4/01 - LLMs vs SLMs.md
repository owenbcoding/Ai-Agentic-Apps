# 01 - LLMs vs SLMs

## Notes

- **LLM (Large Language Model)**: A model trained on massive datasets with billions (or trillions) of parameters. Examples: GPT-4, Claude 3, Llama 3 70B, Gemini Ultra.
- **SLM (Small Language Model)**: A model with far fewer parameters (typically under 10B), designed to run efficiently on limited hardware. Examples: Phi-3 Mini, Gemma 2B, Llama 3.2 1B.
- The distinction is not perfectly defined — "large" and "small" are relative, but the practical threshold is usually whether the model can run on a consumer device (laptop/phone) vs requiring cloud GPUs.

### What Makes a Model "Large"?

- Parameter count is the most common measure: LLMs typically have 70B–1T+ parameters; SLMs sit under ~10B.
- More parameters generally mean greater world knowledge, stronger reasoning, and broader task coverage.
- Larger models require more VRAM, more compute, and more energy to run.

### Key Differences

| Dimension | LLM | SLM |
|---|---|---|
| Parameter count | Billions–Trillions | Millions–low Billions |
| Hardware required | Cloud GPUs / TPUs | Consumer CPU/GPU, mobile |
| Inference cost | High | Low |
| Latency | Higher (network round-trip if API) | Low (local, no round-trip) |
| Generalisation | Strong across many tasks | Narrower, may need fine-tuning |
| Privacy | Data leaves device (API) | Data stays on device |
| Offline capability | No (API) | Yes (local) |
| Fine-tuning cost | Very expensive | Cheap (LoRA on a single GPU) |

### When to Use an LLM

- Complex reasoning, multi-step planning, coding generation.
- Broad general knowledge queries without domain restriction.
- Rapid prototyping where accuracy matters more than cost.
- When you don't have the hardware or time to run a local model.

### When to Use an SLM

- Edge / on-device inference (IoT, mobile apps, laptops).
- Low-latency, high-throughput pipelines (many requests per second).
- Privacy-sensitive workloads where data must not leave the device.
- Specific narrow tasks where a fine-tuned small model can match a large general model.
- Cost-sensitive production systems.

### Emergent Capabilities

- LLMs exhibit **emergent capabilities** — abilities (e.g. multi-step reasoning, in-context learning) that appear unpredictably once a model reaches a certain scale.
- SLMs generally lack these emergent behaviours unless specifically trained or distilled from a larger model.

### Knowledge Distillation

- A popular technique: train a small model to mimic the outputs of a large model (the "teacher").
- Allows SLMs to punch above their weight on specific tasks.
- Examples: Phi-3 Mini was trained with distillation from GPT-4 data — strong reasoning despite small size.

### Relevance to Agentic AI

- Agents often need **fast, cheap sub-calls** (tool selection, slot filling) where an SLM shines.
- The "planner" or "orchestrator" role may still benefit from an LLM.
- Hybrid architectures: route simple subtasks to SLMs, complex reasoning to LLMs.

## Key Points

- LLMs offer breadth and emergent reasoning; SLMs offer speed, cost, and privacy.
- Parameter count is the primary proxy for size, but training data quality matters too (Phi-3 proved this).
- SLMs are increasingly competitive on narrow tasks thanks to distillation and instruction tuning.
- Choosing LLM vs SLM is an engineering trade-off, not a quality-only decision.
- In agentic systems, hybrid routing (SLM for fast calls, LLM for hard reasoning) is often optimal.
- Quantisation (e.g. 4-bit) lets SLMs run on even weaker hardware with minimal quality loss.

## Examples

- **LLM use case**: An agentic coding assistant that reads a whole codebase and writes a complex multi-file refactor — needs GPT-4 level reasoning.
- **SLM use case**: A voice assistant on a phone that classifies user intent locally before sending a targeted API request — Phi-3 Mini running on-device.
- **Hybrid**: An AI customer support system where an SLM handles FAQ routing, and escalates complex billing disputes to a cloud LLM.
- **Distillation example**: Microsoft Phi-3 Mini (3.8B params) outperforms models 10× its size on maths benchmarks because it was trained on high-quality synthetic data from GPT-4.

## Questions

- What is the exact parameter count threshold that separates an SLM from an LLM, and does it even matter?
- How does knowledge distillation allow a small model to retain the capabilities of a much larger one?
- In an agentic pipeline, how would you decide which subtasks get routed to an SLM vs an LLM?
- What role does quantisation play in making SLMs more deployable, and what quality is sacrificed?
- How does the training data quality of Phi-3 challenge the assumption that bigger always means better?
- What privacy guarantees does running an SLM locally actually provide, and what are the limits?

