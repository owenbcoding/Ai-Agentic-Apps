# 02 - APIs vs Open Source

## Notes

- When building with LLMs you face a foundational choice: use a **hosted API** (pay-per-token, model managed by someone else) or an **open-source model** you host yourself.
- Neither is universally better — the right choice depends on your use case, budget, data sensitivity, and engineering capacity.

### Hosted APIs

- You call a vendor's endpoint (e.g. OpenAI, Anthropic, Google AI, Cohere) and pay per token used.
- The vendor handles model training, infrastructure, scaling, and updates.
- Examples: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro.

**Advantages:**
- Zero infrastructure setup — just an API key and HTTP calls.
- Access to state-of-the-art models you couldn't train yourself.
- Automatic scaling: handles spikes without you provisioning servers.
- Regular model updates included in the service.
- Reliable uptime with SLAs.

**Disadvantages:**
- **Data privacy**: your prompts and data leave your environment.
- **Cost at scale**: token costs compound quickly in high-throughput production.
- **Vendor lock-in**: API breaking changes, deprecations, or price increases affect your product.
- **Limited control**: you cannot change model weights, context window, or inference parameters beyond what the API exposes.
- **Latency**: network round-trip on every inference call.

### Open-Source Models

- You download model weights and run inference on your own hardware or cloud VMs.
- Examples: Meta Llama 3, Mistral 7B, Falcon, Phi-3, Gemma.
- "Open-source" is a spectrum — some models release weights but not training data or code (e.g. Llama's community licence).

**Advantages:**
- **Full data privacy**: data never leaves your infrastructure.
- **Cost control**: pay for compute, not per token — cheaper at high volume.
- **Customisation**: fine-tune, quantise, or modify the model however you need.
- **No vendor dependency**: you own the weights.
- **Offline capability**: works in air-gapped environments.

**Disadvantages:**
- **Operational burden**: you must manage servers, CUDA drivers, batching, monitoring.
- **Hardware cost**: good GPUs are expensive (A100, H100).
- **Model quality gap**: open-source models often lag the best proprietary APIs (though the gap is closing fast).
- **Security**: you are responsible for access control to the model.

### Comparison Table

| Dimension | Hosted API | Open-Source (Self-hosted) |
|---|---|---|
| Setup time | Minutes | Days–weeks |
| Data privacy | Low (data sent to vendor) | High (data stays local) |
| Model quality | Highest (frontier models) | Varies; competitive for many tasks |
| Cost at high volume | High | Lower (only compute) |
| Customisability | Low | Full |
| Maintenance | None | High |
| Offline support | No | Yes |
| Vendor risk | High | None |

### Hybrid Approaches

- Many production systems use both: an open-source SLM for high-volume, privacy-sensitive tasks, and a proprietary API for rare but complex reasoning tasks.
- **Local fallback**: use an open-source model when the API is unavailable or rate-limited.
- **Router pattern**: a lightweight classifier decides whether to send a request to a cheap local model or an expensive API based on query complexity.

### Licensing Considerations

- Not all "open" models have permissive licences. Always check before commercial use.
  - **MIT / Apache 2.0**: truly open, commercial use allowed (e.g. Phi-3 MIT).
  - **Llama 3 Community Licence**: commercial use allowed under certain conditions.
  - **Research-only licences**: cannot be used in products.

### Relevance to Agentic AI

- Agents make many LLM calls per user turn — API costs can spiral quickly.
- Tools like **Ollama**, **vLLM**, and **LM Studio** make self-hosting open-source models much simpler.
- When an agent handles sensitive documents (medical, legal, financial), self-hosting is often a compliance requirement.

## Key Points

- APIs are fast to start with but expensive and privacy-risky at scale.
- Open-source models give full control but require significant engineering and hardware investment.
- The quality gap between open-source and proprietary is shrinking — Llama 3 70B is competitive with GPT-3.5.
- Data privacy and compliance requirements often force the open-source route regardless of quality.
- A hybrid routing strategy (local SLM + cloud LLM for hard tasks) is increasingly the production best practice.
- Always check open-source licences before shipping a commercial product.

## Examples

- **API use case**: A startup building an MVP chat product — no infra team, just calls OpenAI GPT-4o and ships in days.
- **Open-source use case**: A hospital building a patient note summariser — data cannot leave on-premise servers, so they self-host Llama 3 on a hospital GPU cluster.
- **Hybrid use case**: A legal SaaS tool uses Mistral 7B locally for document classification (high volume, privacy-sensitive) and calls GPT-4o for complex contract drafting (low volume, high complexity).
- **Ollama example**: A developer runs `ollama run llama3` on their MacBook Pro and gets a local chat endpoint in 60 seconds — no cloud needed.

## Questions

- What are the specific compliance standards (HIPAA, GDPR) that might force you to use a self-hosted model instead of an API?
- How do you calculate the breakeven point where self-hosting becomes cheaper than paying API fees?
- What infrastructure tools (vLLM, Ollama, Triton) make self-hosting practical, and how do they differ?
- How do open-source model licences (MIT, Apache, Llama community) affect commercial use?
- What is the current quality gap between the best open-source models and GPT-4o, and on which benchmarks?
- How would you implement a router that automatically decides between a local model and a remote API?

