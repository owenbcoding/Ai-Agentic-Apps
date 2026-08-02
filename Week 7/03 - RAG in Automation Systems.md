# 03 - RAG in Automation Systems

## Notes

### Overview

Week 6 introduced RAG as a way to ground a single agent's answers in your own documents (index → retrieve → augment → generate). This lesson zooms out: RAG isn't only a chatbot feature — it's a **retrieval capability you can drop into any automation system**, wherever a workflow needs to reason over unstructured company knowledge instead of just structured API data.

---

### 1. RAG Recap

The four-step pattern from Week 6 still holds:

```
Documents ──> Chunk ──> Embed ──> Store (Vector DB)      [INDEXING]

User query ──> Embed ──> Similarity search ──> Top-k chunks
                                                    │
                                                    ▼
                                     Insert into prompt ──> LLM ──> Grounded answer   [RETRIEVAL]
```

This lesson focuses on the **retrieval half** in more depth, and on using it outside a chat window. Chunking and the indexing pipeline get their own full lesson next.

---

### 2. RAG as Part of a Larger System

RAG doesn't have to sit only behind a chat agent. It can be a **node in any workflow**:

| Where RAG fits | Example |
|---|---|
| **Inside an AI Agent** (as a tool) | Chatbot answers questions from a knowledge base |
| **As a direct retrieval step** | A workflow classifies a support ticket by first retrieving similar past tickets |
| **As a pre-processing stage** | Before generating a report, retrieve relevant background sections to include |
| **As a validation step** | Check if an incoming claim/request contradicts known policy documents |

The common thread: whenever a workflow needs "relevant background information it doesn't already have in the input," retrieval is the tool — whether or not there's a human chatting at the other end.

---

### 3. Vector Store Options in n8n

| Vector store | Notes |
|---|---|
| **In-memory / Simple Vector Store** | Fast to set up, resets on restart — good for prototyping |
| **Pinecone / Qdrant / Weaviate** | Managed, persistent, scalable — production-grade |
| **Supabase / Postgres (pgvector)** | Good if you're already using Postgres — keeps data in one place |
| **Redis** | Fast, in-memory with persistence options |

Choice depends on: **scale** (how many chunks), **persistence** (must it survive restarts), and **infrastructure fit** (do you already run one of these).

---

### 4. The Embeddings Node

Both indexing and querying need an **embeddings model** to turn text into vectors:
- The **same embeddings model** must be used for indexing and querying — mixing models produces meaningless similarity scores.
- Embedding dimension and provider (OpenAI, Cohere, open-source) must match what the vector store expects.
- Embeddings cost tokens too — batch documents during indexing rather than embedding one chunk at a time where possible.

---

### 5. Retrieval Strategies

Simple "top-k similarity search" isn't always enough:

| Strategy | What it does | When to use |
|---|---|---|
| **Top-k similarity search** | Returns the k most similar chunks | Default, works for most cases |
| **Metadata filtering** | Restrict search to chunks matching a filter (e.g. `department: "billing"`) | Multi-tenant or multi-category knowledge bases |
| **Hybrid search** | Combines keyword (exact match) and semantic search | Queries with specific terms/IDs that pure semantic search can miss |
| **Re-ranking** | A second pass scores retrieved chunks more precisely before use | High-stakes answers where top-k alone isn't precise enough |

**Metadata filtering** is especially important in automation systems where documents come from multiple sources (e.g. only search "HR policy" docs for an HR-scoped agent, never mixing in engineering docs).

---

### 6. Vector Store as Tool vs. Direct Retriever

There are two ways to wire retrieval into a workflow:

- **As an Agent Tool**: the AI Agent decides *whether and when* to search — good for conversational assistants where not every message needs retrieval.
- **As a Direct Retriever step**: the workflow always retrieves before generating, no decision involved — good for pipelines where every run genuinely needs grounding context (e.g. "always pull the latest policy before answering a compliance question").

Direct retrieval is more predictable and auditable (you always know what was retrieved); tool-based retrieval is more flexible (it only spends the extra retrieval step when actually needed).

---

### 7. Grounding and Reducing Hallucination

RAG reduces but doesn't eliminate hallucination. Reinforce grounding by:
- Instructing the model explicitly: *"Answer only using the provided context. If the answer isn't in the context, say you don't know."*
- Returning **source citations** (document name, section) alongside the answer so a human can verify.
- Setting a **similarity score threshold** — if the best-matching chunk is still a poor match, skip generation and say so rather than answering from a weak match.

---

### 8. Evaluating RAG Quality

Before trusting a RAG system in production, check:
- **Retrieval quality**: for a sample of test queries, are the retrieved chunks actually relevant?
- **Answer faithfulness**: does the generated answer stick to what the retrieved chunks say, or does it add unsupported claims?
- **Coverage**: are there common queries the knowledge base simply doesn't have good chunks for (a gap in the source documents, not a retrieval bug)?

---

## Key Points

- RAG is a **retrieval capability**, not just a chatbot feature — it can sit inside an agent as a tool, or as a direct step in any workflow.
- The **same embeddings model** must be used for both indexing and querying, or similarity scores become meaningless.
- Vector store choice (in-memory, Pinecone/Qdrant, pgvector, Redis) depends on scale, persistence needs, and existing infrastructure.
- **Metadata filtering** and **hybrid search** improve on plain top-k similarity search, especially for multi-source or ID-heavy knowledge bases.
- Wiring retrieval as an **Agent Tool** gives flexibility (retrieve only when needed); wiring it as a **direct retriever step** gives predictability (always grounded).
- Reduce hallucination with explicit "answer only from context" instructions, source citations, and similarity score thresholds.
- Evaluate RAG systems on **retrieval quality**, **answer faithfulness**, and **coverage gaps** — not just "does it sound plausible."

## Examples

- **Non-chat RAG**: A ticket-triage workflow retrieves similar past tickets before an LLM node suggests a category and priority — no chat interface involved.
- **Metadata filtering**: An HR assistant's Vector Store Tool is filtered to `category: "hr-policy"` so it can never accidentally answer from engineering runbooks stored in the same vector DB.
- **Hybrid search**: A support agent needs to find a doc mentioning error code "E-4021" — pure semantic search misses it, but hybrid keyword+semantic search catches the exact code.
- **Threshold gate**: A compliance-answering workflow is configured to respond "I don't have enough information" whenever the best retrieved chunk scores below a similarity threshold, instead of guessing.

## Questions

- How do you decide between tool-based retrieval (agent chooses) and direct retrieval (always runs) for a given workflow?
- What's a practical way to test retrieval quality without manually reviewing every query?
- How often should a knowledge base's coverage gaps be reviewed, and who owns updating the source documents?
- When is hybrid search worth the added complexity over plain semantic search?
- How do you decide on a similarity score threshold, and how does it vary by embeddings model or vector store?
