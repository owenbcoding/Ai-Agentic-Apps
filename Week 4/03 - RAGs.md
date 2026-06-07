# 03 - RAGs

## Notes

- **RAG = Retrieval-Augmented Generation**: a technique that gives an LLM access to an external knowledge base at inference time, without changing the model weights.
- Invented to solve the core limitation of LLMs: their knowledge is **frozen at training cutoff** and they **hallucinate** when they don't know something.
- Instead of asking the model to recall facts from memory, you **retrieve** relevant documents and inject them into the prompt so the model can ground its answer in real evidence.

### The Problem RAG Solves

- LLMs have a **knowledge cutoff** — they don't know about events after training ended.
- LLMs **hallucinate** — they confidently generate plausible-sounding but incorrect facts.
- LLMs have a **fixed context window** — you cannot put an entire company knowledge base into every prompt.
- RAG addresses all three: fresh retrieval, grounded answers, and targeted document injection.

### The RAG Pipeline

```text
User Query
   ↓  Embed query into a vector
Query Vector
   ↓  Similarity search against vector store
Top-K relevant document chunks
   ↓  Inject into prompt context
Augmented Prompt  [ System + Retrieved Chunks + User Query ]
   ↓  LLM generates grounded answer
Response
```

### Step 1 — Indexing (Offline)

1. **Collect documents** (PDFs, web pages, databases, code files, etc.).
2. **Chunk** documents into smaller segments (e.g. 512–1024 tokens each).
3. **Embed** each chunk using an embedding model (e.g. OpenAI `text-embedding-3-small`, Sentence-BERT) → dense vector.
4. **Store** vectors + metadata in a **vector database** (Pinecone, Weaviate, Chroma, pgvector, FAISS).

### Step 2 — Retrieval (Online, per query)

1. Embed the user's query using the same embedding model.
2. Run **k-nearest-neighbour (k-NN)** or **approximate nearest-neighbour (ANN)** search in the vector store.
3. Return the top-K most semantically similar chunks (e.g. top 5).

### Step 3 — Generation (Online, per query)

1. Construct a prompt: system instructions + retrieved chunks + user query.
2. Send to LLM.
3. LLM generates an answer grounded in the retrieved context.

### Retrieval Strategies

- **Dense retrieval** (default): embedding similarity via cosine distance — captures semantic meaning.
- **Sparse / keyword retrieval** (BM25): classic TF-IDF style — fast, good for exact-match terms.
- **Hybrid retrieval**: combine dense + sparse with a re-ranker — best of both worlds.
- **Re-ranking**: after initial retrieval, a cross-encoder model re-scores chunks for relevance before passing to the LLM.

### Chunking Strategies

- **Fixed-size chunking**: split every N tokens — simple but may cut mid-sentence.
- **Sentence/paragraph chunking**: split on natural boundaries — better semantic coherence.
- **Recursive chunking**: split on headings, then paragraphs, then sentences — preserves structure.
- **Overlap**: include overlapping tokens between chunks so context isn't lost at boundaries.

### Vector Databases

| Tool | Notes |
|---|---|
| **Pinecone** | Fully managed cloud vector DB, popular for production |
| **Weaviate** | Open-source, supports hybrid search natively |
| **Chroma** | Lightweight, great for local dev and prototyping |
| **FAISS** | Facebook's in-memory library, very fast but not a full DB |
| **pgvector** | Postgres extension — adds vector search to your existing DB |

### RAG vs Fine-Tuning

| | RAG | Fine-Tuning |
|---|---|---|
| Updates knowledge | Easy (re-index docs) | Hard (retrain model) |
| Handles private data | Yes, at query time | Yes, baked into weights |
| Prevents hallucination | Partially (grounding) | Partially (memorised facts) |
| Cost to update | Low | High |
| Interpretable sources | Yes (can cite chunks) | No |

- RAG is preferred when knowledge changes frequently or when you need citeable sources.
- Fine-tuning is preferred when you want the model to adopt a new style, skill, or format.

### Limitations of RAG

- **Retrieval failures**: if the right chunk isn't retrieved, the LLM answers without it (garbage in, garbage out).
- **Context window pressure**: injecting many large chunks can crowd out other instructions.
- **Chunking quality**: poor chunking loses context and degrades retrieval.
- **Embedding model mismatch**: query and document must be embedded with the same model.
- **Latency**: retrieval + embedding add latency vs a direct LLM call.

### Advanced RAG Patterns

- **HyDE (Hypothetical Document Embedding)**: generate a hypothetical answer, embed it, use that embedding for retrieval — often improves recall.
- **Multi-query retrieval**: generate multiple phrasings of the query, retrieve for each, deduplicate — reduces missed retrievals.
- **Agentic RAG**: the agent decides *when* to call retrieval as a tool, rather than always calling it.
- **Self-RAG**: the LLM itself decides whether to retrieve, what to retrieve, and whether the retrieved chunks are relevant.

## Key Points

- RAG grounds LLM outputs in real, retrievable documents — reducing hallucination and enabling up-to-date knowledge.
- The pipeline has two phases: **offline indexing** (embed & store documents) and **online retrieval** (embed query, fetch chunks, generate).
- Chunking strategy and embedding model quality are the biggest levers on retrieval performance.
- Hybrid retrieval (dense + sparse) outperforms either alone in most real-world settings.
- RAG is not fine-tuning — it doesn't change model weights; knowledge lives in the vector store.
- Citeable sources are a major advantage of RAG for trust and debugging.
- Agentic RAG (retrieval as a tool call) is increasingly the preferred pattern in agent architectures.

## Examples

- **Company knowledge base Q&A**: index all internal Confluence docs; employees ask questions and get answers with source links.
- **Legal research assistant**: index case law and statutes; a lawyer queries and the LLM cites the relevant precedents.
- **Code documentation assistant**: index a codebase; ask "how does the auth module work?" and get an answer grounded in the actual source files.
- **Customer support bot**: index product manuals and FAQs; bot answers customer questions using only authoritative documentation.
- **Medical chatbot**: index clinical guidelines; responses are grounded in official WHO/NHS documents, reducing hallucination risk.

## Questions

- What happens when the top-K retrieved chunks don't actually contain the answer — how does the LLM behave?
- How do you choose chunk size, and what are the trade-offs between small and large chunks?
- What is the difference between dense retrieval and sparse (BM25) retrieval, and when does each win?
- How does HyDE improve retrieval, and what are its failure modes?
- In an agentic system, how would you implement "retrieval as a tool" so the agent decides when to search?
- How do you evaluate RAG pipeline quality — what metrics (recall@K, MRR, faithfulness) would you track?
- What are the latency implications of adding RAG to a production LLM system?

