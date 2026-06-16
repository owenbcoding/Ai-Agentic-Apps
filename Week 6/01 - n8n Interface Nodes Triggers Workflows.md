# 01 - n8n Interface Nodes Triggers Workflows

## Notes

### Overview

**n8n** (pronounced "n-eight-n", short for "nodemation") is an open-source **workflow automation** tool. It lets you connect apps, APIs, and AI models together using a **visual, node-based editor** rather than writing glue code by hand.

The core idea: instead of writing a script that calls API A, transforms the data, then calls API B, you drag **nodes** onto a canvas and wire them together. Each node performs one step; data flows from left to right through the connections.

This makes it a natural fit for building **agentic applications** with little to no code — you can orchestrate LLM calls, tools, memory, and external services visually.

---

### 1. The n8n Interface

When you open the editor you are working on a **canvas** (also called the workflow editor).

| Area | What it does |
|---|---|
| **Canvas** | The main grid where you place and connect nodes |
| **Node panel** | Search/add new nodes (opens with `Tab` or the `+` button) |
| **Node settings** | Opens when you click a node — configure parameters, credentials, options |
| **Execution log / output** | Shows the data each node produced after a run |
| **Top bar** | Save, activate/deactivate the workflow, execute manually |

Key interactions:
- **Add a node**: click the `+` or press `Tab`, then search.
- **Connect nodes**: drag from the small circle on the right of one node to the left of another.
- **Run a workflow manually**: click **Execute Workflow** (or **Test Workflow**) to run it once for debugging.
- **Inspect data**: click any node after a run to see its **input** and **output** JSON.

---

### 2. Nodes

A **node** is a single step in a workflow. Each node takes **input data**, does something with it, and passes **output data** to the next node.

#### Node categories

| Type | Purpose | Examples |
|---|---|---|
| **Trigger nodes** | Start a workflow | Webhook, Schedule, Manual Trigger, app events |
| **Action / app nodes** | Do something in an external service | Send Gmail, create Notion page, post to Slack |
| **Core nodes** | Built-in logic and data handling | HTTP Request, Set, IF, Switch, Code, Merge |
| **AI / LangChain nodes** | LLMs, agents, memory, vector stores | AI Agent, OpenAI Chat Model, Vector Store |

#### How data flows through nodes
- Data in n8n moves as an **array of items**, where each item is a JSON object: `[{ "json": { ... } }, ...]`.
- A node typically runs **once per input item** — if 10 items come in, an action node fires 10 times.
- You reference data from earlier nodes using **expressions**, e.g. `{{ $json.email }}` pulls the `email` field from the current item.

#### Common core nodes worth knowing
- **Set / Edit Fields** — create or reshape fields in the data.
- **IF** — branch the workflow based on a condition (true/false outputs).
- **Switch** — branch into multiple paths based on a value.
- **Merge** — combine data from two branches back together.
- **HTTP Request** — call any REST API (the universal "connect to anything" node).
- **Code** — drop into JavaScript/Python when no-code isn't enough.

---

### 3. Triggers

A **trigger** is the node that **starts** a workflow. Every workflow needs exactly one trigger to run automatically. Without a trigger, you can only run it manually.

#### Common trigger types

| Trigger | Fires when... | Typical use |
|---|---|---|
| **Manual Trigger** | You click "Execute" | Testing and development |
| **Schedule (Cron)** | A time/interval is reached | Daily reports, hourly syncs |
| **Webhook** | An external system sends an HTTP request | Real-time events from other apps |
| **App event triggers** | Something happens in an app (new email, new row) | Reacting to external changes |
| **Chat Trigger** | A user sends a chat message | Conversational AI agents |

#### Polling vs. push triggers
- **Push (event-driven)**: the external service notifies n8n instantly (e.g. Webhook). Fast, efficient.
- **Polling**: n8n checks the service on a schedule for new data (e.g. "every 5 min, any new emails?"). Simpler but has delay.

---

### 4. Workflows

A **workflow** is the whole connected chain: **trigger → nodes → output**. It represents one complete automation.

#### Workflow lifecycle
1. **Build** — drag nodes onto the canvas and connect them.
2. **Test** — run manually and inspect each node's output.
3. **Activate** — toggle the workflow **active** so its trigger listens for events automatically.
4. **Monitor** — check **Executions** to see past runs, successes, and failures.

#### Active vs. inactive
- An **inactive** workflow only runs when you manually execute it.
- An **active** workflow runs automatically whenever its trigger fires (e.g. a webhook is hit, or the schedule is due).
- **Important:** Manual triggers don't work in active mode — production workflows need a real trigger (webhook, schedule, app event).

#### Executions
Every run is recorded as an **execution**. You can:
- See whether it **succeeded or failed**
- Inspect the data at **every node** for that run
- **Re-run** a failed execution after fixing a problem

---

### How It Fits Together

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│  TRIGGER   │ --> │   NODE 1   │ --> │   NODE 2   │ --> │   NODE 3   │
│ (Webhook)  │     │ (Set data) │     │ (IF branch)│     │(Send email)│
└────────────┘     └────────────┘     └────────────┘     └────────────┘
   starts the        reshapes the       decides the         performs the
   workflow          incoming data      path                final action
```

Data enters at the trigger, flows item-by-item through each node, and the workflow ends when the last node finishes. This visual chain is the foundation everything else in n8n builds on.

---

## Key Points

- **n8n** is an open-source, node-based workflow automation tool — build automations visually instead of writing glue code.
- A **workflow** = one **trigger** + connected **nodes**, with data flowing left to right.
- **Nodes** are single steps; they come in four main flavours: triggers, app/action nodes, core logic nodes, and AI nodes.
- Data moves as an **array of JSON items**; nodes usually run once per item.
- Every workflow needs a **trigger** to run automatically — Manual, Schedule, Webhook, or app events.
- Triggers are either **push** (event-driven, instant) or **polling** (checks on a schedule, has delay).
- A workflow must be **activated** to run automatically; manual triggers only work when running by hand.
- The **HTTP Request** and **Code** nodes are the escape hatches when a dedicated node doesn't exist.
- Every run is logged as an **execution** you can inspect node-by-node for debugging.

## Examples

- **Manual + Set + HTTP**: A test workflow that runs on click, sets a `city` field, then calls a weather API and shows the result.
- **Schedule trigger**: "Every weekday at 9am, fetch yesterday's sales from the database and post a summary to Slack."
- **Webhook trigger**: A form on a website POSTs to an n8n webhook; the workflow validates the data and creates a CRM contact.
- **IF branch**: After fetching an order, an IF node checks if `total > 100` — high-value orders go to a manager, others get an auto-reply.

## Questions

- When should you use a dedicated app node (e.g. "Gmail") vs. the generic HTTP Request node?
- How does running "once per item" affect rate limits when an action node fires 100 times for 100 items?
- What's the right choice between a polling trigger and a webhook when both are available for the same service?
- How do you handle a node failing partway through a workflow — does the whole execution stop, or can you continue on error?
- Where should secrets/API keys live, and how do credentials differ from putting keys directly in node parameters?
