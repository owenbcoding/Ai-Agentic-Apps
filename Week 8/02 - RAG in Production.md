# 02 - RAG in Production

## Notes

### Overview

Week 4 and Week 7 covered how RAG works and how to wire a basic RAG pipeline in n8n. This lesson covers what changes once that pipeline has to **stay correct over time**, serving real users against a knowledge base that keeps changing. A RAG pipeline that works great in a demo can quietly go stale, slow, or wrong in production if indexing and retrieval aren't actively maintained.

The core production problem RAG adds on top of a normal deployed workflow: **the knowledge base is a second thing that can go out of date**, separate from the workflow logic itself.

---

### 1. The Production RAG Lifecycle

```text
Source documents change
        │
        ▼
  Change detection  ──────>  Re-chunk & re-embed changed docs
        │                              │
        ▼                              ▼
  Delete stale vectors  <───────  Upsert new vectors
        │
        ▼
   Index stays in sync with source of truth
```

Unlike a one-time indexing job, production RAG needs this loop to run continuously or on a schedule — not just once when the pipeline was first built.

---

### 2. Keeping the Knowledge Base Updated

- **Scheduled re-indexing**: periodically re-crawl/re-fetch source documents and re-embed anything that changed (simplest, but can miss fast-moving changes and wastes compute re-embedding unchanged docs).
- **Event-driven updates**: trigger re-indexing when a source document actually changes (e.g. a webhook from Notion/Confluence/Google Drive on edit) — more efficient and closer to real-time.
- **Content hashing**: store a hash of each source document; only re-chunk/re-embed if the hash changed, to avoid needless recomputation.
- **Deletion handling**: when a source document is removed, its vectors must be explicitly deleted from the store — orphaned vectors cause the system to retrieve and cite content that no longer exists.

---

### 3. Versioning and Freshness

- Tag each vector/chunk with **metadata**: source ID, version/timestamp, document type.
- Freshness metadata lets you **filter or boost recent content** at retrieval time (e.g. prefer the latest policy doc over an older superseded one).
- Without versioning, updating a document can leave both the old and new chunks in the index simultaneously, and the model may retrieve and blend contradictory information.

---

### 4. Monitoring Retrieval Quality

Indexing correctly is necessary but not sufficient — retrieval quality has to be actively monitored, not assumed:

| Signal | What it tells you |
|---|---|
| **Recall@K** | Whether the right chunk is even in the top-K results |
| **Faithfulness / groundedness** | Whether the generated answer actually reflects retrieved content (vs hallucinating anyway) |
| **Zero-result queries** | Questions where nothing relevant was retrieved — a gap in the knowledge base |
| **User feedback (thumbs up/down)** | Direct signal on answer quality, cheap to collect in production |
| **Latency per query** | Retrieval + generation time, especially as the index grows |

---

### 5. Scaling the Vector Store

- **Index growth**: as document count grows, retrieval latency and storage cost grow too — approximate nearest-neighbour (ANN) indexing trades a small accuracy loss for large speed gains at scale.
- **Sharding/partitioning**: large knowledge bases can be split by tenant, document type, or namespace so queries only search the relevant partition.
- **Cost**: managed vector databases (Pinecone, Weaviate Cloud) charge by storage and query volume — re-embedding the entire corpus on every change is expensive at scale, which is why incremental updates matter.

---

### 6. Handling Multi-tenant / Access-controlled Knowledge

- Production RAG often needs to ensure **User A can't retrieve User B's private documents**.
- Common approaches: separate namespaces/indexes per tenant, or metadata filters applied at query time (e.g. `tenant_id = X`) enforced *before* results reach the LLM.
- This access control must happen at the retrieval layer — filtering after generation is too late, since the model has already seen the content.

---

### 7. Production RAG in n8n

- A **scheduled trigger** (or webhook from the document source) runs the indexing sub-workflow independently from the user-facing chat workflow.
- The indexing sub-workflow: fetch changed docs → chunk → embed → upsert to vector store → delete stale vectors for removed docs.
- The chat/agent workflow only *queries* the vector store — keeping indexing and retrieval as separate, independently-schedulable workflows is what makes the system maintainable.

## Key Points

- Production RAG's core challenge beyond a working prototype is keeping the **index in sync** with a knowledge base that keeps changing.
- Re-indexing can be **scheduled** (simple, can be stale) or **event-driven** (efficient, closer to real-time); content hashing avoids re-embedding unchanged documents.
- Deleting vectors for removed/changed source documents is as important as adding new ones — orphaned vectors cause retrieval of stale or nonexistent content.
- Metadata (timestamps, versions, source IDs) enables freshness filtering and prevents old and new versions of a document from being blended together.
- Retrieval quality must be actively monitored in production via recall@K, faithfulness, zero-result queries, and user feedback — not assumed to still work.
- At scale, ANN indexing, sharding, and incremental updates control latency and cost as the corpus grows.
- Multi-tenant RAG requires access control enforced at the retrieval layer (namespaces or metadata filters), not after generation.
- In n8n, separating the indexing workflow from the user-facing query workflow keeps the system maintainable and independently schedulable.

## Examples

- **Docs site assistant**: a webhook fires on every merge to the documentation repo, triggering re-indexing of only the changed pages within minutes.
- **HR policy bot**: policy documents are versioned; when a policy is updated, the old version's vectors are deleted so the bot never cites outdated rules.
- **Multi-tenant SaaS knowledge base**: each customer's documents live in a separate vector namespace, so a query from Customer A can never retrieve Customer B's content.
- **Stale index bug**: a support bot kept answering with a discontinued product's specs because deleted source documents were never removed from the vector store — fixed by adding explicit deletion handling to the indexing workflow.

## Questions

- How do you decide between scheduled and event-driven re-indexing for a given knowledge base's rate of change?
- What's the right way to detect and handle a source document being deleted versus just updated?
- How would you design metadata filtering so multi-tenant retrieval is enforced reliably, not just by convention?
- What metrics would you put on a dashboard to catch retrieval quality degrading before users start complaining?
- At what index size does it become worth sharding or partitioning the vector store, and how would you decide the partition key?
