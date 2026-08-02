# 07 - Interview Preparation

## Notes

### Overview

The final piece: being able to talk through everything from Weeks 1–8 out loud, under interview conditions, whether the interviewer is technical or not. This lesson isn't new material — it's a framework for organizing and rehearsing the material already covered, plus the kinds of questions likely to come up.

---

### 1. Structuring How You Talk About the Project

A reliable structure for walking through this project in an interview:

1. **Context** — what the project was and why (learning production-grade agentic AI systems end-to-end).
2. **Architecture** — the high-level system: triggers, agents, tools, memory, RAG, integrations.
3. **A specific technical decision** — pick one (e.g. why RAG over fine-tuning, or why a multi-agent orchestrator pattern) and explain the trade-off reasoning.
4. **A challenge and how it was solved** — every real build has one; this is what interviewers actually remember.
5. **What you'd do differently / next** — shows reflection, not just execution.

This mirrors the classic **STAR** format (Situation, Task, Action, Result) but adapted for a technical walkthrough rather than a behavioral story.

---

### 2. Likely Conceptual Questions (and where the answer lives)

| Question | Covered in |
|---|---|
| "What's the difference between an AI agent and a simple workflow automation?" | Week 5 |
| "How does RAG work, and why not just fine-tune the model?" | Week 4, Week 8/02 |
| "What is prompt injection, and how do you defend against it?" | Week 8/03 |
| "How do agents decide when and which tool to call?" | Week 5, Week 6/7 |
| "What's the difference between single-agent and multi-agent systems?" | Week 5, Week 8/01 |
| "How would you keep a RAG knowledge base up to date in production?" | Week 8/02 |
| "How do you monitor an LLM-powered system once it's live?" | Week 8/05 |
| "Self-hosted vs cloud — how would you decide?" | Week 8/04 |

Being able to answer each **in under 60–90 seconds**, with a concrete example from the actual project, is the target — not a comprehensive lecture.

---

### 3. Explaining Technical Concepts to a Non-technical Interviewer

- Lead with the **problem being solved**, not the mechanism: *"The bot needed to answer questions using our company's documents, not just what the model already knew"* before explaining vector embeddings.
- Use **analogies** sparingly but usefully: RAG as "giving the model an open-book exam instead of relying on memory."
- Avoid jargon stacking — introduce one new term at a time, and define it in a half-sentence before moving on.
- Check for understanding by pausing, not by asking "does that make sense?" reflexively — read the room.

---

### 4. Explaining Technical Concepts to a Technical Interviewer

- It's safe to go deeper faster — architecture diagrams, trade-offs, specific tools/APIs used.
- Be ready to defend **design decisions**, not just describe them: *why* a particular chunking strategy, *why* a particular orchestration pattern, *why* n8n over a code-first framework.
- Expect follow-up "what if" questions (what if the vector store goes down, what if two agents disagree, what if the tool call fails) — these test depth of understanding, not memorized facts.

---

### 5. Common Follow-up / Probing Questions

- "What would break first if this had 100x the users?"
- "How would you test this system before shipping a change?"
- "What's the failure mode if the LLM hallucinates a tool call with bad parameters?"
- "How is this different from just writing the automation in traditional code?"
- "What's a limitation of the current design you'd want to fix?"

Having honest, thought-through answers to "what's a limitation" and "what would you do differently" tends to land better than pretending the project has no weaknesses — it signals real understanding over rehearsed pitch.

---

### 6. Practicing Out Loud

- Reading notes silently is not the same skill as explaining them under time pressure — rehearse answers **out loud**, ideally to another person or recorded.
- Time yourself on the "walk me through this project" question — it should land around 2–3 minutes unprompted before pausing for questions.
- Practice the **one specific technical decision** deep-dive (point 3 above) until it's fluent — this is almost always where an interview goes deeper.

---

### 7. Questions to Ask the Interviewer

Interviews are two-directional — asking informed questions signals genuine engagement:

- "What does your team's agent/automation stack look like today?"
- "How do you currently handle [RAG freshness / prompt injection / monitoring] in production?"
- "What's been the biggest operational challenge running LLM-based systems at your scale?"

## Key Points

- Structure a project walkthrough as: context → architecture → one specific decision → a challenge and its resolution → reflection — not a linear recap of every week.
- Prepare concise (60–90 second), example-backed answers to the core conceptual questions spanning agents, RAG, security, and production operations from across the course.
- Calibrate depth and jargon to the interviewer: problem-first and analogy-driven for non-technical interviewers, decision-and-trade-off-focused for technical ones.
- Expect "what if" and "what would break" follow-ups that test understanding beyond the happy path — these probe depth, not memorization.
- Being honest about a limitation or something you'd do differently reads as stronger than claiming the project is flawless.
- Rehearsing out loud (not just reviewing notes) is a distinct skill from understanding the material — practice the full walkthrough and the deep-dive separately.
- Prepare a few genuine questions to ask the interviewer about their own agentic/automation stack.

## Examples

- **60-second RAG answer**: "Our support bot needed to answer from internal docs the model was never trained on. We chunked and embedded the docs into a vector store, and at query time retrieved the most relevant chunks to ground the model's answer — that's Retrieval-Augmented Generation. We chose it over fine-tuning because our docs update weekly and RAG lets us re-index instead of retraining."
- **Challenge-and-solution story**: describing the session-memory bug from Week 7 where two users' conversations got mixed up, and how keying memory by session ID fixed it — a concrete, specific story beats a general claim of "I debugged issues."
- **Honest limitation**: "Right now retrieval quality isn't automatically monitored — I'd add recall and faithfulness tracking before calling this production-ready," said in response to a "what would you improve" question.
- **Question back to interviewer**: asking "how do you handle prompt injection risk for agents that read external content?" after describing the project's own mitigations.

## Questions

- Which single project decision would be the strongest one to go deep on if asked to elaborate?
- What's a limitation of this project that's honest to admit without undermining confidence in the work?
- How would you adjust the explanation of RAG or agent architecture on the fly if you could tell the interviewer wasn't following?
- What's a "what if it broke at scale" question you don't yet have a confident answer for?
- How do you keep a 2-3 minute project walkthrough tight without leaving out something important?
