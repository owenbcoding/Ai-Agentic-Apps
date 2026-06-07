# 02 - Tools Memory and Reasoning Loops

## Notes

### Overview

Three concepts underpin almost every AI agent architecture:

1. **Tools** — external capabilities the agent can invoke to interact with the world
2. **Memory** — how the agent stores and retrieves information across steps or sessions
3. **Reasoning loops** — the cycle the agent runs through to decide what to do next

Understanding these three building blocks explains how agents go from "a single LLM call" to "a system that can autonomously complete multi-step tasks."

---

### 1. Tools

A **tool** is any function or API that the agent can call to take an action or retrieve information beyond what is already in the prompt.

#### Why tools matter
The LLM alone is limited to its training data and the content of the current prompt. Tools give it the ability to:
- Fetch live, up-to-date information
- Take actions in external systems
- Perform computation it cannot do reliably in text (e.g. maths, code execution)

#### Common tool categories

| Category | Examples |
|---|---|
| **Search / retrieval** | Web search, vector database lookup, document Q&A |
| **Code execution** | Python REPL, shell commands, SQL queries |
| **External APIs** | CRM (Salesforce), calendar (Google), email (Gmail) |
| **File operations** | Read/write files, parse PDFs, manipulate spreadsheets |
| **Communication** | Send Slack message, post tweet, send email |
| **Browser / UI** | Scrape a webpage, click a button (Playwright, Selenium) |

#### How tool calling works (technically)
Modern LLMs support **function calling** (OpenAI) or **tool use** (Anthropic):

1. You provide the model with a list of tool definitions (name, description, parameters schema).
2. The model outputs a structured tool call instead of free text when it decides a tool is needed.
3. Your code intercepts the call, executes the actual function, and returns the result to the model.
4. The model incorporates the result and continues reasoning.

```text
Model output:  { "tool": "web_search", "query": "current gold price USD" }
Your code:     calls the search API → returns "$2,350/oz as of June 2026"
Model:         incorporates the result and continues
```

#### Tool design principles
- Keep tools **narrow and single-purpose** — one tool, one job.
- Write **clear descriptions** — the model chooses tools based on their description.
- Return **structured output** (JSON) — easier for the model to parse than free text.
- Add **error messages** the model can reason about if a tool fails.

---

### 2. Memory

**Memory** is how the agent retains information across steps within a session, or across multiple sessions over time.

#### Types of memory

##### In-context memory (short-term)
- Everything currently in the **context window** is visible to the model.
- Cheapest and fastest form of memory — no extra infrastructure.
- Hard limit: the context window size (e.g. 128k–200k tokens for current models).
- Forgotten when the session ends.

##### External / persistent memory (long-term)
When information must survive beyond the context window or across sessions, it is stored externally:

| Storage type | What it holds | How it's retrieved |
|---|---|---|
| **Vector store** (e.g. Pinecone, Chroma) | Embeddings of past conversations, documents | Semantic similarity search |
| **Key-value store** (e.g. Redis) | Structured facts, user preferences | Exact key lookup |
| **Relational DB** (e.g. Postgres) | Structured data, task history | SQL query |
| **Document store** (e.g. MongoDB) | Conversation logs, plans | Query by metadata |

##### Episodic vs. semantic memory
- **Episodic**: specific past interactions — "The user said last Tuesday they prefer formal tone."
- **Semantic**: general facts — "The company's refund policy is 30 days."

##### Memory write vs. memory read
- **Write**: the agent decides to save a piece of information (or it's saved automatically).
- **Read**: before responding, the agent retrieves relevant memories and inserts them into the prompt.

This read → insert → reason cycle is the foundation of long-term memory in agents.

---

### 3. Reasoning Loops

A **reasoning loop** (also called an agent loop or action loop) is the repeated cycle the agent runs through to make progress toward a goal.

#### The basic loop

```
┌─────────────────────────────────────────┐
│                                         │
│  1. OBSERVE  ← get current state /      │
│               tool result / user input  │
│       ↓                                 │
│  2. THINK    ← LLM reasons about        │
│               what to do next           │
│       ↓                                 │
│  3. ACT      ← call a tool OR           │
│               return final answer       │
│       ↓                                 │
│  4. REPEAT   ← back to step 1           │
│               until goal is met         │
└─────────────────────────────────────────┘
```

Each iteration is called a **step** or **turn** in the loop. The loop terminates when:
- The model produces a final answer (no tool call)
- A maximum step limit is reached (safety guard)
- An error condition is detected

#### Why loops are necessary
Complex tasks cannot be solved in a single LLM call. The loop allows the agent to:
- Gather information before making a decision
- Verify that an action had the intended effect
- Recover from errors by trying a different approach

#### Loop termination and safety
Unconstrained loops are dangerous — a misbehaving agent can loop indefinitely.

Best practices:
- Set a **max_steps** limit (e.g. 10–20 steps for most tasks)
- Log every step for observability
- Add a **scratchpad** where the model writes its reasoning — makes debugging possible
- Implement **timeout** limits per step (tool calls can hang)

---

### How the Three Work Together

```
User goal: "Find the cheapest flight to Tokyo next month and draft an email with the options."

Loop step 1:
  Think:   "I need to search for flights."
  Act:     call web_search("cheap flights London to Tokyo July 2026")
  Observe: returns top 5 results

Loop step 2:
  Think:   "I need to extract prices. Let me scrape the top result."
  Act:     call browser_scrape(url)
  Observe: returns structured price table

Loop step 3:
  Think:   "I have enough information. Draft the email."
  Act:     return final email draft (no tool call → loop ends)
```

Memory is involved throughout: the results from step 1 and 2 live in the **in-context window** as the agent moves to step 3. If the conversation had a prior preference ("user prefers window seats"), that would be retrieved from a **vector store** and inserted before the loop started.

---

## Key Points

- **Tools** extend the agent beyond its training data — they let it search, compute, and take actions in the real world.
- Tool descriptions are critical — the model selects tools based on their name and description alone.
- **Memory** exists on a spectrum: in-context (fast, temporary) to external stores (persistent, retrievable).
- Long-term memory works by embedding past information, retrieving relevant chunks at query time, and injecting them into the prompt.
- **Reasoning loops** are the engine of agent behaviour — the Observe → Think → Act cycle repeats until the task is complete.
- Always set a maximum step limit to prevent infinite loops; log every step for debuggability.
- These three components are modular — you can swap out tools, memory backends, or loop strategies independently.

## Examples

- **Tool use**: An agent asked "What's the weather in Paris?" calls a `get_weather(city)` tool rather than relying on (potentially stale) training data.
- **In-context memory**: Within one session, the agent remembers earlier tool results automatically because they accumulate in the context window.
- **Long-term memory**: A customer support agent retrieves the user's previous tickets from a vector store before responding to a new message.
- **Reasoning loop**: An agent writing a blog post loops: outline → draft section 1 → web search for stats → insert stats → draft section 2 → review → final output.

## Questions

- How do you decide which pieces of information from a long agent session deserve to be written to long-term memory?
- What happens when the context window fills up mid-loop — how do agents handle context overflow?
- How do you prevent tool abuse — e.g. an agent calling a write tool when it should only be reading?
- How does the choice of maximum steps affect the quality vs. cost trade-off for a given task?
- Can an agent reliably know when it has "enough" information to stop the loop, or does it always need an explicit termination condition?
