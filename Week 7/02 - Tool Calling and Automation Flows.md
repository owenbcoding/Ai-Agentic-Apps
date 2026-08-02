# 02 - Tool Calling and Automation Flows

## Notes

### Overview

An assistant that only talks is a chatbot. An assistant that can **call tools** is an agent — it can look things up, take actions, and trigger downstream automation instead of just generating text. This lesson goes under the hood of how tool calling actually works, the tool types available in n8n, and how a single tool call can kick off an entire automation flow rather than just returning a value.

---

### 1. What "Tool Calling" Means

Modern LLMs support **function calling**: alongside its text response, the model can output a structured request to invoke a named function with specific arguments. The runtime (n8n, in this case) executes that function and feeds the result back to the model as an **observation**, which the model then reasons over.

```
Model output:  "I need to call `get_order_status` with { orderId: "1234" }"
n8n:           executes the HTTP Request tool node with those arguments
n8n:           feeds the result back to the model as an observation
Model:         reasons over the result and responds to the user
```

This is the mechanical implementation of the **ReAct loop** from Week 5 — "tool calling" is just the API-level name for the Act step.

---

### 2. How the Agent Decides to Call a Tool

The model chooses a tool based on:
- **The tool's name and description** — the model matches the user's request against these, so vague descriptions cause wrong or missed tool calls.
- **The tool's parameter schema** — defines what arguments it expects (e.g. `orderId: string`), which the model must fill in correctly.
- **The conversation context** — if the answer is already available from memory or a prior tool result, a well-prompted agent won't call a tool redundantly.

**Rule of thumb:** if a human support agent would need to "go look something up" to answer, that's a tool. If they'd know the answer off the top of their head, it's just conversation.

---

### 3. Types of Tools in n8n

| Tool type | What it does | Typical use |
|---|---|---|
| **HTTP Request Tool** | Calls any REST API | Look up order status, weather, external data |
| **Code Tool** | Runs custom JS/Python | Custom calculations, data transforms |
| **Calculator** | Reliable arithmetic | Anything involving exact maths (LLMs are unreliable at this) |
| **Vector Store Tool** | Semantic search over documents | RAG — covered in the next lesson |
| **Workflow Tool** | Calls another n8n workflow | Reusing existing automations as agent capabilities |
| **App tools** (Gmail, Slack, Sheets, etc.) | Take action in a specific service | Send an email, post a message, log a row |

---

### 4. The Workflow Tool: Composability

The **Workflow Tool** is the most powerful pattern for agentic automation: it lets the agent call an **entire existing n8n workflow** as if it were a single function.

Why this matters:
- You can build and test a complex multi-step automation (validate → transform → call three APIs → format) as its own standalone workflow.
- The agent only sees a clean interface: a name, a description, and an input schema — it doesn't need to know (or reason about) the internal complexity.
- The same sub-workflow can be reused across multiple assistants/agents without duplicating logic.

```
AI Agent
   │  calls tool "create_support_ticket"
   ▼
┌─────────────────────────────────────────┐
│  Workflow Tool → sub-workflow            │
│  1. Validate input fields                │
│  2. Create ticket in helpdesk system     │
│  3. Post notification to Slack           │
│  4. Return ticket ID + status            │
└─────────────────────────────────────────┘
   │  returns { ticketId: "T-482", status: "open" }
   ▼
Agent continues reasoning with the result
```

This is where "tool calling" and "automation flow" become the same thing: a single tool call by the agent is the trigger for a whole multi-step business process.

---

### 5. Designing Good Tool Descriptions and Schemas

Poorly described tools are the #1 cause of unreliable agents. Guidelines:

- **One tool, one job.** Don't build a single "do everything" tool — split into `get_order_status`, `cancel_order`, `issue_refund`.
- **Describe *when* to use it, not just *what* it does.** "Use this to check the current status of an order when the user provides an order ID" is far better than "gets order data."
- **Constrain parameters tightly.** Use enums, required fields, and clear types so the model can't pass malformed input.
- **Return concise, structured results.** A tool that dumps a huge raw JSON blob back to the model wastes tokens and can confuse reasoning — shape the output first.

---

### 6. Multi-Tool Agents and Tool Selection

As an agent gains more tools, selection accuracy becomes the main risk:
- **Overlapping tools** (two tools that could both plausibly answer a request) cause inconsistent choices — keep responsibilities distinct.
- **Too many tools** on one agent degrades reasoning quality — consider splitting into a **multi-agent system** (Week 5) where a router delegates to specialised sub-agents, each with a smaller toolset.
- **Ordering matters implicitly** — if a task needs tool A's output as tool B's input, the agent must infer that from context; explicit instructions in the system prompt ("always look up the order before issuing a refund") make this reliable instead of hopeful.

---

### 7. From Tool Call to Automation Flow

The key mental shift for this lesson: a tool call is not just "the agent fetched a fact." It can be the trigger for a **real business process** — creating a record, notifying a team, updating a system of record. Designed well, an n8n agent becomes a natural-language front end over your existing automations: the user asks in plain English, the agent picks the right existing workflow, and the automation you already trust does the rest.

---

## Key Points

- **Tool calling** is the mechanical implementation of the ReAct Act step: the model requests a function call, n8n executes it, and the result is fed back as an observation.
- The agent selects tools based on **name, description, parameter schema, and conversation context** — vague descriptions cause wrong or missed calls.
- n8n offers HTTP Request, Code, Calculator, Vector Store, Workflow, and app-specific tools.
- The **Workflow Tool** lets an entire multi-step automation be exposed to the agent as a single callable function — the key pattern for composable, reusable agentic automation.
- Good tools follow **one tool, one job**, describe *when* to use them, constrain parameters tightly, and return concise structured results.
- Too many or overlapping tools degrade an agent's tool-selection accuracy — split into multiple specialised agents if the toolset grows too large.
- A tool call can trigger a **real automation flow** (create a ticket, notify Slack, update a record) — not just return a fact.

## Examples

- **Order lookup**: An HTTP Request tool `get_order_status(orderId)` lets a support assistant answer "where's my order?" with live data instead of guessing.
- **Composable ticketing**: A Workflow Tool wraps an existing "create support ticket" automation (validate → create → notify) so any agent can call it as `create_support_ticket(subject, description)`.
- **Overlapping tools bug**: An agent with both `search_faq` and `search_docs` inconsistently picks one over the other until their descriptions are rewritten to cover clearly distinct scopes.
- **Multi-step trigger**: A user says "cancel my subscription and refund my last payment" — the agent calls two tools in sequence, each of which is itself a multi-step workflow.

## Questions

- How do you debug a case where the agent calls the wrong tool despite a seemingly clear description?
- What's the right granularity for splitting one large capability into multiple smaller tools vs. keeping it as one?
- How should an agent handle a tool call that partially succeeds (e.g. ticket created but notification failed)?
- At what number of tools does it make sense to split a single agent into a multi-agent system with a router?
- Should tool results always be summarised before being fed back to the model, or does that risk losing information the model needs?
