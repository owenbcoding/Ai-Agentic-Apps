# 02 - Embeddings Explained Visually

## Notes

- An **embedding** is a list of numbers (a vector) that represents the meaning of text.
- Instead of treating words as isolated symbols, embeddings place similar meanings **close together** in vector space.
- Simple vectorization (one-hot, bag-of-words, TF-IDF) counts word presence but often misses context and relationships.
- Embeddings are **learned** from data, usually by neural networks that predict context (for example: "king" is near "queen").
- Think of embeddings like coordinates on a map:
  - "cat" and "dog" sit near each other (both animals/pets)
  - "car" sits farther away (different topic)
  - "kitten" sits very close to "cat" (strong semantic overlap)
- Real embedding models use many dimensions (often 384, 768, 1536, or more), not just 2D.
- We visualize in 2D/3D for intuition, but models operate in high-dimensional space where distance still works.
- Common distance/similarity metric: **cosine similarity** (measures angle between vectors, not just length).
- Embeddings can represent:
  - Single words
  - Sentences
  - Paragraphs
  - Documents
  - Images/audio (multimodal embeddings)
- In agent systems, embeddings power retrieval: find relevant knowledge before the LLM answers.

### Visual Mental Model (2D Simplified)

```text
        animal cluster
           cat •  dog •
                 \
                  kitten •

   vehicle cluster
      car •   truck •

   unrelated
      banana •
```

- In practice, clusters overlap and are fuzzy, but the core idea stays the same: **meaning -> location in vector space**.

### Vectorization vs Embeddings

| Approach | What it captures | Example limitation |
|---|---|---|
| One-hot / bag-of-words | Word presence/count | "bank" (river) vs "bank" (finance) look identical |
| TF-IDF | Important words in a document | Still sparse and weak on synonyms |
| Embeddings | Contextual/semantic meaning | Better synonym and paraphrase matching |

## Key Points

- Embeddings turn language into math so computers can compare meaning quickly.
- Similar text -> vectors point in similar directions (high cosine similarity).
- Dissimilar text -> vectors point in different directions (low cosine similarity).
- Embedding quality depends on:
  - Training data/domain
  - Model size/architecture
  - Task fit (general vs domain-specific)
- For RAG and agents:
  1. Split documents into chunks
  2. Convert chunks to embeddings
  3. Store in a vector database
  4. Embed user query at runtime
  5. Retrieve top similar chunks
  6. Pass retrieved context to the LLM
- Good chunking + good embeddings often improve answer quality more than prompt tweaks alone.
- Embedding models are usually smaller/faster than full LLMs, so retrieval can be cheap at scale.
- Re-embed when content changes; stale vectors can cause outdated retrieval.

## Examples

- Semantic search:
  - Query: "How do I reset my password?"
  - Retrieves docs containing "forgot login credentials" even without exact keyword match.
- Support agent workflow:
  - User asks about refund policy -> embedding search finds policy section -> LLM drafts grounded response.
- Duplicate ticket detection:
  - New ticket embedding compared to past tickets; high similarity suggests duplicate issue.
- Product recommendation:
  - Item descriptions embedded; similar vectors suggest related products.
- Clustering customer feedback:
  - Embed reviews -> group by vector proximity -> discover recurring themes.
- Cosine similarity intuition:
  - "I love coding" vs "I enjoy programming" -> high similarity
  - "I love coding" vs "The weather is rainy" -> low similarity

## Questions

- What is the difference between vectorization and embeddings?
- Why do we use cosine similarity instead of only Euclidean distance?
- How many dimensions are "enough," and what trade-offs come with higher dimensions?
- When should I use a general embedding model vs a domain-specific one?
- What causes retrieval to fail even when embeddings are used correctly?
- How do chunk size and overlap affect embedding search quality in RAG?
- In interviews, how would I explain embeddings to a non-technical stakeholder in one minute?
