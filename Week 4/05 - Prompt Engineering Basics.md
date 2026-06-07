# 05 - Prompt Engineering Basics

## Notes

- **Prompt engineering** is the practice of designing and refining the text inputs sent to an LLM to get the most accurate, relevant, and useful outputs.
- The prompt is your primary interface to the model — before fine-tuning, before RAG, the first tool you should reach for.
- LLMs are next-token predictors; a better prompt shapes the probability distribution toward the output you want.

### Anatomy of a Prompt

Most prompts to instruction-tuned models have some combination of:

```text
[System message]     - role, rules, output format, constraints
[Context]            - background information, documents, retrieved chunks
[Examples]           - few-shot demonstrations (optional)
[User instruction]   - the actual task or question
[Output prefix]      - (optional) start of the desired output to steer the model
```

### Core Principles

#### 1. Be Specific and Explicit
- Vague instructions produce vague outputs.
- State the desired format, length, tone, and audience explicitly.
- Bad: "Summarise this."
- Good: "Summarise the following article in 3 bullet points, each under 20 words, for a non-technical audience."

#### 2. Assign a Role / Persona
- Tell the model who it is: "You are an expert Python developer" or "You are a helpful customer support agent."
- Role assignment primes the model's style, vocabulary, and knowledge domain.
- Relevant for system messages in chat models.

#### 3. Provide Context
- The model only knows what is in the prompt (plus its training). Give it what it needs.
- Paste in the relevant document, code snippet, or data before the instruction.
- Don't assume the model "knows" your codebase, your company, or your requirements.

#### 4. Specify the Output Format
- If you need JSON, say so and show the schema.
- If you need markdown, say so.
- If you need exactly 5 items, say so.
- LLMs follow explicit format instructions much better than implicit ones.

#### 5. Use Delimiters
- Use clear markers to separate sections of the prompt:
  - Triple quotes: `"""`
  - XML-style tags: `<document>...</document>`, `<instruction>...</instruction>`
  - Markdown headers: `### Context`, `### Task`
- Prevents the model from conflating instruction and data.

#### 6. Chain of Thought (CoT)
- For reasoning tasks, instruct the model to "think step by step" before giving the final answer.
- Dramatically improves accuracy on maths, logic, and multi-step problems.
- Works because it forces the model to generate intermediate reasoning tokens rather than jumping to a conclusion.

```text
Prompt:  "Solve the following problem. Think step by step before giving your final answer."
```

#### 7. Instruction Ordering Matters
- LLMs tend to weight the **beginning** and **end** of a prompt more than the middle (recency + primacy bias).
- Put the most critical instructions at the start of the system prompt and/or repeat key constraints at the end.

#### 8. Avoid Negations Where Possible
- LLMs handle positive instructions better than prohibitions.
- Bad: "Don't use bullet points."
- Better: "Write in flowing prose paragraphs."

### Prompt Components Cheat Sheet

| Component | Purpose | Example |
|---|---|---|
| Role | Set model persona | "You are a senior data analyst." |
| Task | What to do | "Classify the sentiment of each review." |
| Context | Background info | "The reviews are from a hotel booking site." |
| Format | Output structure | "Return a JSON array: [{review_id, sentiment}]" |
| Constraints | Limits / rules | "Only output 'positive', 'neutral', or 'negative'." |
| Examples | Few-shot guidance | "Review: 'Great stay!' → positive" |

### Iterative Prompt Development

Prompt engineering is empirical — you iterate until the output is consistently good:

1. Write a first draft prompt.
2. Test against a representative set of inputs.
3. Identify failure modes (wrong format, missed edge cases, hallucinations).
4. Refine the prompt to address failures.
5. Repeat until quality meets the bar.

### Common Failure Modes

- **Ignoring instructions**: model follows training distribution rather than your prompt — add more explicit constraints.
- **Hallucination**: model makes up facts — ground the prompt with retrieved context (RAG).
- **Format drift**: model stops following JSON schema mid-conversation — add a format reminder in system prompt and/or use structured output APIs.
- **Over-refusal**: safety guardrails block legitimate requests — rephrase or clarify the intent.
- **Verbosity**: model produces far more text than needed — add "Be concise. Limit response to N words."

### Structured Outputs (JSON Mode)

- Most modern APIs (OpenAI, Anthropic) support **structured output** or **JSON mode**.
- Forces the model to produce valid JSON matching a schema.
- Use this in production agentic systems instead of parsing free-text.

## Key Points

- Prompt engineering is the fastest, cheapest way to improve LLM output quality — do it before fine-tuning.
- Specificity, role assignment, context provision, and format constraints are the four most impactful levers.
- Chain of thought prompting ("think step by step") significantly boosts reasoning accuracy.
- Use delimiters to prevent the model conflating instructions with data.
- Prompt development is iterative — treat prompts like code: test, measure, and refine.
- Structured output APIs (JSON mode) are essential for reliable agentic systems.

## Examples

- **Before**: "Write an email." → generic, unhelpful.
- **After**: "You are a professional business writer. Write a 3-sentence follow-up email to a client who missed a meeting. Tone: polite but firm. Do not include a subject line."
- **CoT example**: "A train travels 60 km/h for 2 hours, then 80 km/h for 1 hour. What is the total distance? Think step by step."
- **Format example**: "Return the result as a JSON object with keys: name (string), score (integer 0–100), reason (string). Do not include any text outside the JSON."
- **Delimiter example**: `<article>{{article_text}}</article>\n\nSummarise the article above in one sentence.`

## Questions

- Why does "think step by step" improve reasoning accuracy — what is happening mechanistically?
- How does the position of an instruction in a long prompt affect whether the model follows it?
- What is the difference between a system prompt and a user prompt, and when does each take priority?
- When does prompt engineering hit a ceiling and fine-tuning or RAG become necessary?
- How do structured output APIs (JSON mode) work under the hood — are they constrained decoding?
- How would you build a systematic process for evaluating whether a prompt change is actually an improvement?

