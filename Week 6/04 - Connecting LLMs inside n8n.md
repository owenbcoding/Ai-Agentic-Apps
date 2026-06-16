# 04 - Connecting LLMs inside n8n

## Notes

### Overview

This is where the no-code automation skills from earlier in the week meet the **agentic AI** concepts from Week 5. n8n has a dedicated set of **AI nodes** (built on **LangChain**) that let you call LLMs, give them **tools** and **memory**, and build full **agents** — all visually.

The big idea: everything you learned conceptually about agents (tools, memory, reasoning loops, ReAct) maps directly onto n8n nodes you can drag and connect.

---

### 1. The AI Node Family

n8n's AI nodes come in a few groups. Some are **root nodes** (the main brain) and others are **sub-nodes** that plug *into* a root node.

| Node | Role |
|---|---|
| **AI Agent** | The orchestrator — runs the reasoning loop, decides when to use tools |
| **Basic LLM Chain** | A simple "prompt in → text out" call, no tools/loop |
| **Chat Model** (e.g. OpenAI, Anthropic) | The actual LLM the agent/chain talks to |
| **Memory** (e.g. Window Buffer, Postgres) | Stores conversation history |
| **Tool** nodes | Capabilities the agent can call (HTTP, Code, Calculator, sub-workflows) |
| **Vector Store** | Long-term/semantic memory and retrieval (RAG) |
| **Output Parser** | Forces the LLM's output into a structured format |

#### Root nodes vs. sub-nodes
- A **root node** (like AI Agent) appears in the main data flow.
- **Sub-nodes** attach to it via special connection points underneath (not the normal left-right flow): you connect a **Chat Model**, a **Memory**, and one or more **Tools** *into* the agent.
- This visual structure mirrors the agent architecture: brain (model) + memory + tools.

---

### 2. Calling an LLM (the simple case)

The simplest way to use an LLM is the **Basic LLM Chain** node:
1. Connect a **Chat Model** sub-node (e.g. OpenAI Chat Model) and add its credential.
2. Write a **prompt**, using expressions to inject data: `Summarise this: {{ $json.text }}`.
3. The node returns the model's text output, which flows to the next node.

Use this when you just need a single transformation — summarise, classify, rewrite, extract — with **no tools and no loop**.

#### Prompt structure
- **System prompt** — sets the role/behaviour ("You are a helpful support assistant").
- **User prompt** — the actual input/question, often built from incoming data via expressions.

---

### 3. Building an Agent (the powerful case)

The **AI Agent** node implements the full **reasoning loop** (the ReAct pattern from Week 5): the model can **think**, **call tools**, observe results, and loop until it has an answer.

To build one, attach sub-nodes to the AI Agent:

| Attach this | To give the agent... |
|---|---|
| **Chat Model** | Its reasoning engine (required) |
| **Memory** | The ability to remember earlier turns in a conversation |
| **Tool** nodes | Capabilities — search, call an API, run code, query a DB |

#### How the agent loop runs (under the hood)
1. The agent receives input (e.g. a chat message).
2. The **model reasons** about whether it needs a tool.
3. If yes, it **calls a tool**; n8n executes it and feeds the result back.
4. The model **observes** and reasons again — repeating until it can answer.
5. It returns a final response.

This is exactly the **Observe → Think → Act** loop, but n8n handles the plumbing.

---

### 4. Tools for the Agent

A **tool** in n8n is a node the agent can decide to invoke. Common ones:

| Tool | What it lets the agent do |
|---|---|
| **HTTP Request Tool** | Call any external API |
| **Code Tool** | Run custom JS/Python logic |
| **Calculator** | Do reliable maths |
| **Vector Store Tool** | Retrieve relevant documents (RAG) |
| **Workflow Tool** | Call another n8n workflow as a tool |
| **App tools** (Gmail, Slack, etc.) | Take actions in specific services |

**Key principle (same as Week 5):** the agent picks tools based on their **name and description**, so write clear, specific descriptions. One tool = one job.

---

### 5. Memory

Memory gives the agent continuity across messages.

| Memory type | Holds | Notes |
|---|---|---|
| **Window Buffer Memory** | Last N messages | Simple, in-memory, resets easily |
| **Database-backed** (Postgres/Redis) | Full history keyed by session | Survives restarts, multi-session |
| **Vector Store** | Embedded documents/past info | Semantic retrieval (long-term / RAG) |

- A **session ID** keys the memory so different users/conversations stay separate.
- Short-term memory = conversation buffer; long-term/knowledge = vector store.

---

### 6. Retrieval-Augmented Generation (RAG)

To let an LLM answer from **your own documents**:
1. **Index**: split documents into chunks, create **embeddings**, store them in a **Vector Store**.
2. **Retrieve**: at query time, embed the question and pull the most similar chunks.
3. **Augment**: insert those chunks into the prompt.
4. **Generate**: the LLM answers grounded in your data.

In n8n this is built from a **Vector Store** node (+ an embeddings model) connected to the agent as a **tool** or retriever — reducing hallucination and giving domain-specific answers.

---

### 7. Structured Output

LLMs return free text by default, which is hard to use downstream. An **Output Parser** forces the response into a defined **JSON schema** (e.g. `{ "sentiment": "...", "score": ... }`), so the next nodes can rely on the shape.

---

### Putting It Together

```
              ┌─────────────────────────────┐
 Chat ──────> │         AI AGENT            │ ──────> Response
 Trigger      │   (runs the reason loop)    │
              └─────────────────────────────┘
                 │          │           │
          ┌──────┘    ┌─────┘     ┌─────┴──────┐
          ▼           ▼           ▼            ▼
     Chat Model    Memory     HTTP Tool    Vector Store
     (the brain)  (history)  (call API)   (RAG / docs)
```

The agent sits in the main flow; the model, memory, and tools hang off it as sub-nodes. A chat message comes in, the agent loops (think → use tools → observe), and returns a grounded answer — a complete agentic application built visually.

---

## Key Points

- n8n's **AI nodes** (built on LangChain) let you call LLMs, and build agents with tools and memory — no code.
- **Root nodes** (AI Agent, LLM Chain) sit in the main flow; **sub-nodes** (Chat Model, Memory, Tools) attach underneath them.
- Use **Basic LLM Chain** for single-shot tasks (summarise, classify); use **AI Agent** when you need tools and a reasoning loop.
- The **AI Agent** node implements the **ReAct / Observe-Think-Act loop** from Week 5 — n8n handles the plumbing.
- **Tools** are nodes the agent can call; it chooses them by **name + description**, so write them clearly.
- **Memory** ranges from a simple message buffer (short-term) to vector stores (long-term / RAG), keyed by **session ID**.
- **RAG** grounds answers in your own documents: index → retrieve → augment → generate.
- **Output Parsers** force structured JSON output so downstream nodes can use it reliably.

## Examples

- **LLM Chain**: An incoming support email is passed to a Basic LLM Chain that classifies it as "billing", "technical", or "general".
- **Agent with tools**: A chat agent has an HTTP Request tool (check order status) and a Calculator tool (compute refunds), looping to answer customer questions.
- **RAG bot**: Company policy PDFs are embedded into a vector store; an agent retrieves relevant sections to answer "How many holiday days do I get?"
- **Structured output**: An LLM extracts `{ name, email, company }` from messy text via an Output Parser, then a Set node feeds it straight into a CRM node.

## Questions

- When is a full AI Agent overkill, and a simple LLM Chain (or even a plain IF node) the better choice?
- How do you keep tool descriptions distinct enough that the agent reliably picks the right one?
- What's the right memory backend for a multi-user chatbot that must remember conversations across days?
- How do chunk size and overlap in RAG affect answer quality, and how do you tune them?
- How do you guard against an agent looping too long or calling expensive tools unnecessarily (cost/safety limits)?
