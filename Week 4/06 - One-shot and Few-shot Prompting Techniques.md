# 06 - One-shot and Few-shot Prompting Techniques

## Notes

- **In-context learning (ICL)** is the ability of an LLM to learn a task pattern purely from examples provided inside the prompt, without updating any weights.
- This is distinct from fine-tuning — the model doesn't change; the prompt teaches it what to do.
- Three main variants based on how many examples are provided:

| Variant | Examples in prompt | Use case |
|---|---|---|
| **Zero-shot** | 0 | Task is well-defined in natural language; model generalises from training |
| **One-shot** | 1 | Show the exact format/style once |
| **Few-shot** | 2–20+ | Show a range of input/output pairs to improve consistency and coverage |

### Zero-Shot Prompting

- No examples given — just an instruction.
- Works well when the task is common in training data (e.g. translation, summarisation, simple Q&A).
- Fails when the task is unusual, requires a precise format, or has ambiguous phrasing.

```text
Prompt: "Translate the following sentence to Spanish: 'The weather is nice today.'"
```

### One-Shot Prompting

- Provide exactly one example of the desired input → output pair.
- Useful when you want to anchor the format or style without writing many examples.
- One example clarifies ambiguity more than any amount of prose instructions.

```text
Prompt:
Classify the sentiment of a product review.

Example:
Review: "This blender broke after one week."
Sentiment: negative

Now classify:
Review: "Arrived on time and works perfectly."
Sentiment:
```

### Few-Shot Prompting

- Provide 3–20 input/output examples before the actual task.
- Helps the model:
  - Learn the precise output format.
  - Handle edge cases (show one example for each tricky case).
  - Adopt the right tone/vocabulary.
- Generally the most reliable technique for consistent structured outputs.

```text
Prompt:
Extract the product name and price from each review snippet.

Input: "I bought the AirPods Pro for $249 last week."
Output: {"product": "AirPods Pro", "price": "$249"}

Input: "The Nike Air Max 90 was on sale for $120."
Output: {"product": "Nike Air Max 90", "price": "$120"}

Input: "Just got the Sony WH-1000XM5 for $280."
Output:
```

### Why Few-Shot Works

- LLMs are trained to predict the next token — examples in the prompt create a strong "pattern" that the model continues.
- The more examples, the clearer the pattern, and the less the model falls back on its general prior.
- Mechanistically, some researchers believe few-shot examples implicitly do "gradient descent in the forward pass" (Meta-SGD hypothesis) — though this is debated.

### Designing Good Few-Shot Examples

1. **Diverse**: cover different input types, edge cases, and lengths.
2. **Representative**: match the distribution of real inputs you'll encounter.
3. **Consistent format**: every example must follow the exact same input/output structure.
4. **Correct**: any wrong examples will actively mislead the model.
5. **Ordered wisely**: put the most representative example last (recency bias means the model weights the final example most).

### Few-Shot vs Fine-Tuning Trade-offs

| | Few-Shot Prompting | Fine-Tuning |
|---|---|---|
| Setup time | Minutes | Hours–days |
| Cost | Higher inference cost (bigger prompt) | One-time training cost |
| Flexibility | Change examples without redeploying | Requires retraining to change |
| Performance ceiling | Limited by context window | Higher ceiling for narrow tasks |
| Works with closed APIs | Yes | Not always (depends on API) |

- Few-shot is the right first step; fine-tune if you need better performance or have >1,000 consistent examples.

### Chain-of-Thought Few-Shot

- Combine few-shot with **chain-of-thought (CoT)**: each example includes step-by-step reasoning before the answer.
- Dramatically improves accuracy on maths, logic, and multi-step reasoning tasks.
- The reasoning in the examples teaches the model *how* to reason, not just what the answer looks like.

```text
Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have?
A: Roger starts with 5 balls. He buys 2 × 3 = 6 more. 5 + 6 = 11. The answer is 11.

Q: The cafeteria had 23 apples. They used 20 for lunch and bought 6 more. How many apples do they have?
A:
```

### Dynamic Few-Shot Selection

- Hardcoding examples is brittle as the task distribution shifts.
- **Dynamic few-shot**: at query time, retrieve the most relevant examples for this specific input from an example bank.
- Use an embedding similarity search (same idea as RAG) to select the best few examples.
- More robust and scales to large example libraries.

### Common Pitfalls

- **Too few examples for a complex task**: one example can't capture enough variation — use more.
- **Inconsistent format across examples**: the model will average across the inconsistencies and produce mixed outputs.
- **Label bias**: if 80% of your examples have label "positive", the model will over-predict positive.
- **Long examples eating the context window**: be concise in examples; don't waste tokens on irrelevant details.
- **Wrong examples teaching wrong behaviour**: any mistakes in your few-shot examples are amplified.

## Key Points

- Zero-shot relies on training knowledge; one-shot/few-shot teach in-context via examples.
- Few-shot prompting is the most reliable prompting technique for consistent structured outputs.
- Good examples are diverse, representative, correct, and consistently formatted.
- Chain-of-thought few-shot dramatically improves reasoning — show reasoning steps, not just answers.
- Dynamic few-shot selection (retrieval from an example bank) is more robust than hard-coded examples.
- Few-shot is the default starting point before fine-tuning — lower cost and more flexible.

## Examples

- **Zero-shot translation**: "Translate to French: 'I love programming.'" — works because translation is well-represented in training data.
- **One-shot format anchor**: show one JSON output example so the model knows the exact key names and structure.
- **Few-shot entity extraction**: provide 5 examples of text → JSON with extracted entities; model reliably extracts new entities.
- **CoT few-shot maths**: show 3 solved maths word problems with reasoning steps; model correctly solves a 4th hard problem it would fail zero-shot.
- **Dynamic few-shot in a support bot**: embed the customer's complaint, retrieve the 3 most similar past resolved tickets as examples, inject into the prompt.

## Questions

- Why does providing examples in the prompt work — what is happening in the attention mechanism when the model sees few-shot examples?
- How many examples are "enough" and how do you determine the optimal number empirically?
- What is the "label bias" problem in few-shot prompting and how do you correct for it?
- How does chain-of-thought few-shot differ from standard few-shot, and why is reasoning in examples so powerful?
- How would you implement dynamic few-shot selection using an embedding store?
- At what point does adding more few-shot examples stop helping and start hurting (due to context window pressure)?
- How do you evaluate whether your few-shot examples are actually improving performance?

