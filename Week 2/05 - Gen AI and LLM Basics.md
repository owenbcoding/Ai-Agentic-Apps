# 05 - Gen AI and LLM Basics

## Notes

- Generative AI creates new content such as text, code, images, audio, and video.
- LLM stands for Large Language Model, a type of generative AI model trained on massive text datasets.
- LLMs predict the next token (word/subword) repeatedly to generate coherent responses.
- Foundation concepts:
  - Tokens: chunks of text processed by the model
  - Context window: how much text the model can consider at once
  - Prompt: instruction/input provided to model
  - Completion/response: model output
- Common capabilities:
  - Summarization
  - Translation
  - Question answering
  - Drafting emails/content
  - Code generation
- Limitations:
  - Hallucinations (confident but incorrect outputs)
  - Knowledge cutoffs/outdated facts
  - Prompt sensitivity (small prompt changes can alter output quality)
- Better reliability often comes from combining LLMs with tools and retrieval (RAG) rather than using model memory alone.

## Key Points

- Generative AI focuses on content creation; traditional predictive ML focuses on classification/regression outcomes.
- LLM quality depends heavily on:
  - Prompt clarity
  - Context quality
  - Model choice
  - Output constraints
- Temperature and sampling settings affect creativity vs consistency:
  - Lower temperature -> more deterministic
  - Higher temperature -> more diverse/creative
- Prompt design basics:
  - Define role/task clearly
  - Provide context and constraints
  - Specify output format
  - Add examples when needed (few-shot prompting)
- Production-safe usage usually needs:
  - Guardrails/content filtering
  - Output validation
  - Human review for high-risk actions
  - Monitoring for cost, latency, and quality
- Agentic systems extend LLMs by adding planning, tool calling, memory, and iterative reasoning loops.

## Examples

- Customer support assistant:
  - Uses an LLM to draft responses from policy documents and conversation history.
- Document summarizer:
  - Ingests long reports and returns concise executive summaries with bullet points.
- Code assistant:
  - Generates boilerplate code and explains logic, then developer reviews and tests output.
- RAG chatbot:
  - Retrieves chunks from a vector database and passes them to the LLM for grounded answers.
- Multi-step agent example:
  - LLM plans task -> calls search/API tools -> compiles answer -> returns structured result.

## Questions

- What is the practical difference between an LLM and a traditional NLP model?
- How do I reduce hallucinations in real applications?
- When should I use RAG versus fine-tuning?
- How do temperature, top-p, and max tokens influence output behavior?
- What are the minimum safety checks needed before using LLM outputs in production workflows?
- In interviews, how should I explain the difference between a plain LLM app and an agentic AI system?
