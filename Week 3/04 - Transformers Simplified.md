# 04 - Transformers Simplified

## Notes

- The **Transformer** is the neural network architecture behind almost every modern LLM (GPT, Claude, Llama, BERT, etc.).
- Introduced in the 2017 paper *"Attention is All You Need"* by Vaswani et al.
- Before Transformers, sequence models (RNNs, LSTMs) processed text word-by-word in order — slow and hard to parallelise.
- Transformers process **all tokens simultaneously** using a mechanism called **self-attention**, which lets every token look at every other token in the sequence at once.
- The core insight: meaning depends on context, and self-attention directly models that context for every token in parallel.

### The Big Picture Pipeline

```text
Raw text
   ↓  Tokenisation
Token IDs  [101, 2293, 3421 ...]
   ↓  Embedding lookup
Token vectors  (each token → dense float vector)
   ↓  Positional encoding added
Vectors + position info
   ↓  N × Transformer blocks (Attention + Feed-Forward)
Contextualised representations
   ↓  Task head (generate next token / classify / embed)
Output
```

### Self-Attention (The Core Idea)

- For each token, self-attention computes how much it should "attend to" every other token.
- Three learned projections are created from each token vector: **Query (Q)**, **Key (K)**, **Value (V)**.
  - **Query**: "What am I looking for?"
  - **Key**: "What do I advertise about myself?"
  - **Value**: "What information do I carry?"
- Attention score between two tokens = dot product of Q and K, scaled then softmaxed.
- The output for a token is a weighted sum of all Value vectors, weighted by attention scores.
- This lets the model resolve ambiguity: in *"The bank by the river"*, "bank" attends strongly to "river" to mean waterside, not financial.

```text
Attention(Q, K, V) = softmax( Q·Kᵀ / √dₖ ) · V
```

### Multi-Head Attention

- Instead of one set of Q/K/V projections, Transformers run **multiple attention heads in parallel**.
- Each head learns to attend to different kinds of relationships (syntax, coreference, proximity, semantics, etc.).
- Outputs of all heads are concatenated and projected back to the model dimension.
- More heads → richer relational understanding of the sequence.

### Positional Encoding

- Self-attention is inherently order-agnostic (it sees a bag of tokens).
- Positional encodings inject position information into each token vector so the model knows token order.
- Original paper used fixed sinusoidal functions; modern LLMs often use learned or rotary positional embeddings (RoPE).

### Feed-Forward Sub-layer

- After attention, each token vector passes through a small fully-connected network independently.
- Adds non-linearity and allows the model to transform representations beyond what attention alone captures.
- This layer holds a large share of the model's "factual knowledge" (it is where MLP weights store world knowledge).

### Layer Normalisation & Residual Connections

- Each sub-layer (attention + feed-forward) is wrapped in:
  1. A **residual (skip) connection**: output = sub-layer(x) + x — preserves gradient flow.
  2. **Layer normalisation**: stabilises training by normalising activations.
- These make it possible to stack many layers (e.g. GPT-4 has ~96 layers) without vanishing gradients.

### Stacking Transformer Blocks

- A Transformer model is many identical blocks stacked on top of each other.
- Early layers tend to capture local syntax; deeper layers capture abstract semantics and long-range reasoning.
- More layers + wider hidden size = more capable but more expensive model.

## Key Points

- **Self-attention** is the defining innovation — it replaces recurrence with direct token-to-token relationships.
- Transformers are parallelisable during training (unlike RNNs), which enabled training on web-scale data.
- **Multi-head attention** lets the model learn different types of relationships simultaneously.
- **Positional encodings** are essential because attention itself has no concept of order.
- **Residual connections + layer norm** make deep stacking stable and trainable.
- The feed-forward layer is where most of a model's parametric knowledge lives.
- Encoder-only Transformers (BERT) use bidirectional attention; decoder-only (GPT-style) use causal/masked attention.
- Scale matters: more parameters + more data + more compute → qualitatively better emergent capabilities (reasoning, coding, tool use).
- Understanding the Transformer block is the foundation for understanding fine-tuning, RAG, LoRA, and agent tool-use.

## Examples

- **Disambiguation via attention**: in *"I saw the man with the telescope"*, attention heads resolve whether the telescope belongs to the seer or the man.
- **Translation**: encoder encodes French sentence; decoder attends to encoder output while generating English token by token.
- **Code completion**: decoder-only LLM attends to all prior code tokens to predict the next token at each step.
- **Semantic search**: encoder model produces a single embedding vector for a query; cosine similarity finds nearest document vectors.
- **Agent reasoning**: each step in a chain-of-thought prompt sits in the context window; self-attention lets later tokens condition on earlier reasoning steps.
- **Summarisation**: encoder-decoder model attends to a long document (encoder) then generates a short summary (decoder).

## Questions

- Why did self-attention replace recurrence (RNNs/LSTMs) as the dominant approach?
- What exactly is being learned in the Q, K, V weight matrices?
- Why do we scale dot products by √dₖ before softmax?
- How do residual connections prevent vanishing gradients in very deep networks?
- What is the difference between positional encodings and learned positional embeddings?
- Why does the feed-forward layer hold more "knowledge" than the attention layer?
- How does causal masking in a decoder prevent the model from seeing future tokens during training?
- In an interview, how would I explain self-attention to someone who has never seen the formula?
- How does understanding the Transformer architecture help me debug or tune an agentic AI system?
