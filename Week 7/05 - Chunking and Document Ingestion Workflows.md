# 05 - Chunking and Document Ingestion Workflows

## Notes

### Overview

Lesson 03 covered the **retrieval** half of RAG. This lesson covers the other half: getting documents *into* the vector store in the first place — the **ingestion pipeline**. Ingestion quality is the ceiling on RAG quality: no amount of clever retrieval or prompting fixes a knowledge base that was chunked or loaded badly.

---

### 1. The Ingestion Pipeline

Every RAG ingestion workflow follows the same four stages:

```
┌──────────┐    ┌───────────┐    ┌───────────┐    ┌────────────┐
│  LOAD    │──> │  SPLIT     │──> │  EMBED     │──> │  STORE      │
│ (docs in)│    │ (chunks)   │    │ (vectors)  │    │ (vector DB) │
└──────────┘    └───────────┘    └───────────┘    └────────────┘
```

1. **Load** — pull raw content from a source (file, URL, database).
2. **Split** — break it into chunks small enough to embed and retrieve meaningfully.
3. **Embed** — convert each chunk into a vector using an embeddings model.
4. **Store** — write the vector + original text + metadata into the vector store.

---

### 2. Document Loaders in n8n

| Loader | Source | Notes |
|---|---|---|
| **PDF Loader** | PDF files | Extracts text; scanned/image PDFs need OCR first |
| **CSV / Spreadsheet Loader** | Tabular data | Each row can become a chunk, or rows can be grouped |
| **Text/Markdown Loader** | Plain text, `.md` files | Simplest case — often already close to chunk-sized |
| **HTML/Web Loader** | Scraped web pages | Needs cleanup to strip nav/boilerplate before chunking |
| **Binary/Generic file loader** | Any file via HTTP Request | Used when a dedicated loader node doesn't exist |

The loading step should also **strip noise** — headers, footers, navigation menus, repeated boilerplate — since anything ingested becomes something that can be retrieved and shown to a user.

---

### 3. Chunking Strategies

| Strategy | How it splits | Trade-off |
|---|---|---|
| **Fixed-size (character/token count)** | Every N characters/tokens | Simple, fast, but can cut sentences or ideas in half |
| **Recursive character splitting** | Tries paragraph → sentence → word boundaries, falling back as needed | Better at respecting natural text structure |
| **Semantic chunking** | Splits at meaning boundaries (topic shifts) using embeddings | Highest quality, more expensive to compute |
| **Structure-aware (Markdown/HTML)** | Splits along headings/sections | Great when source docs are already well-structured |

**Default recommendation:** recursive character splitting is the standard starting point — simple fixed-size splitting is usually a false economy, since it produces chunks that cut off mid-thought.

---

### 4. Chunk Size and Overlap Trade-offs

Two parameters control almost every chunking decision:

| Parameter | Too small | Too large |
|---|---|---|
| **Chunk size** | Loses context — chunk doesn't contain a full idea | Wastes tokens, dilutes similarity search, less precise retrieval |
| **Overlap** | Related content ends up split across chunks with no continuity | Redundant storage, more chunks retrieved say the same thing |

- A common starting point is **chunks of a few hundred tokens** with **10-20% overlap** between consecutive chunks, then tuned based on retrieval testing.
- **Overlap** exists specifically so an idea that spans a chunk boundary still appears whole in at least one chunk.
- The right size also depends on the **embeddings model's context window** and the **LLM's prompt budget** once several chunks are retrieved together.

---

### 5. Metadata and Why It Matters

Every chunk stored in the vector store should carry metadata alongside its vector and text:

| Metadata field | Why it matters |
|---|---|
| **Source document / title** | Lets the answer cite where information came from |
| **Section / page number** | Helps a human verify the source quickly |
| **Category / department / tags** | Enables metadata filtering during retrieval (Lesson 03) |
| **Ingestion date / version** | Lets you identify and purge stale content |

Without metadata, a vector store is just a bag of anonymous text fragments — useful for search, useless for trust, filtering, or maintenance.

---

### 6. Building the Ingestion Workflow

A typical n8n ingestion workflow:

```
Trigger (new file uploaded / schedule / manual)
        │
        ▼
  Load document (PDF/Text/HTML loader)
        │
        ▼
  Clean text (Code node — strip boilerplate)
        │
        ▼
  Split into chunks (Text Splitter node)
        │
        ▼
  Attach metadata (Set node — source, date, category)
        │
        ▼
  Generate embeddings (Embeddings node)
        │
        ▼
  Upsert into Vector Store
```

Triggering this on **new file upload** (e.g. a watched folder or storage bucket event) keeps the knowledge base current automatically instead of requiring a manual re-run every time source documents change.

---

### 7. Keeping the Index Fresh

Ingestion isn't a one-time job — knowledge bases go stale:

- **Updates**: if a source document changes, re-ingesting it should **replace** its old chunks, not just add new ones alongside outdated copies (usually done by deleting-by-source-id before re-inserting).
- **Deletes**: when a document is removed from the source, its chunks should be removed from the vector store — otherwise retrieval can surface content that no longer exists or is no longer valid.
- **Scheduled re-sync**: a periodic workflow (Schedule Trigger) that diffs the source against what's indexed catches drift that event-based triggers might miss.

A vector store with no update/delete strategy slowly accumulates stale, contradictory, or duplicate information — which quietly degrades every downstream RAG answer.

---

## Key Points

- The ingestion pipeline is **Load → Split → Embed → Store** — quality here is the ceiling on all downstream RAG quality.
- n8n loaders cover PDF, CSV, text/Markdown, and HTML/web sources; loading should also strip boilerplate noise.
- **Recursive character splitting** is the standard default; **semantic** and **structure-aware** chunking give higher quality at higher cost.
- **Chunk size and overlap** trade off context completeness against retrieval precision and token cost — tune based on testing, not guessing.
- **Metadata** (source, section, category, date) turns a vector store from an anonymous text bag into something filterable, citable, and maintainable.
- Ingestion workflows should be **triggered automatically** (file upload, schedule) so the knowledge base stays current without manual re-runs.
- **Updates and deletes** must be handled explicitly — re-ingesting a changed document should replace, not duplicate, its old chunks; removed source documents must be purged from the vector store too.

## Examples

- **PDF policy ingestion**: A new HR policy PDF uploaded to a folder triggers load → clean → chunk (recursive, 500 tokens, 15% overlap) → embed → store, tagged with `category: "hr-policy"`.
- **Stale content bug**: A product FAQ is updated, but the old version's chunks were never deleted — the agent occasionally cites the outdated policy until a delete-then-reinsert step is added.
- **Structure-aware chunking**: A well-formatted Markdown handbook is split along its `##` headings instead of fixed character counts, keeping each section intact as one chunk.
- **Scheduled re-sync**: A nightly workflow compares a source Google Drive folder against what's indexed and re-ingests any files whose modified date changed.

## Questions

- How do you measure whether a chosen chunk size/overlap is actually improving retrieval quality versus just guessing at "reasonable" numbers?
- What's the best way to handle documents that mix structured and unstructured content (e.g. a PDF with both prose and tables)?
- How should ingestion handle duplicate or near-duplicate documents from multiple sources?
- What's a reliable way to detect that a source document was deleted so its chunks get purged, especially for sources without delete-event triggers?
- At what point does a growing knowledge base need a dedicated re-ranking or evaluation step rather than just tuning chunking parameters?
