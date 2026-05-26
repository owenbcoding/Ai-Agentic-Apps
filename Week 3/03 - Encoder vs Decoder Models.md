# 03 - Encoder vs Decoder Models

## Notes

- Transformer-based NLP models are often split into two roles: **encoder** (understand input) and **decoder** (generate output).
- **Encoder models** read the full input and build rich internal representations (often used for embeddings, classification, and search).
- **Decoder models** generate text one token at a time, using prior tokens as context (autoregressive generation).
- **Encoder-decoder models** combine both: encoder understands source input, decoder produces target output.
- Encoders usually use **bidirectional attention** (each token can look at tokens before and after it).
- Decoders usually use **causal/masked attention** (each token can only look at previous tokens, not future ones).
- This design prevents the model from "cheating" during text generation by seeing words it has not written yet.

### Visual Mental Model

```text
ENCODER (Understand)
Input:  "Refund policy for annual plans"
         ↓ read all tokens together ↓
Output: rich meaning representation (embedding/context vector)

DECODER (Generate)
Input:  "Write a polite reply about ..."
         ↓ generate step-by-step ↓
Output: "Thanks for reaching out. Our refund policy ..."

ENCODER-DECODER (Translate/Transform)
Source input -> Encoder understands -> Decoder writes new output
Example: long article -> concise summary
```

### Model Families at a Glance

| Type | Typical use | Common examples | Best for |
|---|---|---|---|
| Encoder-only | Understanding, search, classification | BERT, RoBERTa, embedding models | Semantic search, sentiment, NER |
| Decoder-only | Generation, chat, coding assistants | GPT, Llama, Claude-style LLMs | Agents, Q&A drafting, tool-using workflows |
| Encoder-decoder | Input-to-output transformation | T5, BART, original Transformer | Translation, summarization, reformatting |

- In agent systems today, **decoder-only LLMs** are most common for reasoning and response generation.
- **Encoder/embedding models** are commonly used in the retrieval layer (RAG) to find relevant context.
- Many production agent stacks use both:
  - Encoder/embedding model for retrieval
  - Decoder LLM for final answer generation and tool orchestration

## Key Points

- Encoder = "read and represent meaning."
- Decoder = "write the next token repeatedly."
- Encoder-decoder = "read input deeply, then produce transformed output."
- Decoder-only models power most modern chat/agent experiences because they excel at open-ended generation.
- Encoder-only models are strong when the task is understanding/comparing text rather than writing long responses.
- Encoder-decoder models shine when input and output are different forms (for example document -> summary).
- Attention type matters:
  - Bidirectional (encoder): better global understanding of a fixed input
  - Causal (decoder): safe sequential generation
- Choosing model type should follow task shape:
  - Need semantic search/embeddings -> encoder or embedding model
  - Need conversational agent -> decoder LLM
  - Need structured transformation (translate/summarize) -> encoder-decoder
- For grounded agents, combine retrieval (encoder side) with generation (decoder side) instead of relying on model memory alone.

## Examples

- Customer support agent:
  - Encoder/embedding model retrieves policy chunks from a vector database.
  - Decoder LLM generates a customer-facing answer using retrieved context.
- Semantic duplicate detection:
  - Encoder model embeds ticket text; similar vectors indicate likely duplicates.
- Code assistant:
  - Decoder-only LLM generates code and explanations token by token from prompt context.
- Meeting notes workflow:
  - Encoder-decoder style pipeline transforms transcript -> action items summary.
- Translation service:
  - Encoder reads source sentence meaning; decoder writes target-language sentence.
- Classification without generation:
  - Encoder-only model labels emails as spam/not spam using input representation.

## Questions

- Why do decoder models use causal attention instead of bidirectional attention?
- When should I choose encoder-only vs decoder-only vs encoder-decoder architecture?
- Why are most modern agent chat systems built on decoder-only LLMs?
- How do encoder models support RAG even when the final answer comes from a decoder LLM?
- What tasks are encoder-decoder models still better suited for than decoder-only prompting?
- Can one model play both retrieval and generation roles well, or should these be separate?
- In interviews, how would I explain encoder vs decoder to someone who only knows "ChatGPT"?
