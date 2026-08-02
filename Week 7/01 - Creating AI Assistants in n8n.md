# 01 - Creating AI Assistants in n8n

## Notes

### Overview

Week 6 introduced the **AI Agent** node and its sub-nodes (Chat Model, Memory, Tools). This lesson goes one level up: turning that node into a full **AI assistant** — a persistent, conversational, deployable system a real user can talk to, not just a workflow you trigger manually.

An "AI assistant" in n8n is really a **product wrapper** around the agent architecture: a chat entry point, a persona, memory that persists per user, and a place to deploy it so people can actually reach it.

---

### 1. Anatomy of an n8n AI Assistant

| Piece | Role |
|---|---|
| **Chat Trigger** | The entry point — receives a message and starts the workflow |
| **AI Agent** | The brain — reasons, decides on tools, produces a reply |
| **Chat Model** | The underlying LLM the agent calls |
| **Memory** | Keeps track of the conversation per user/session |
| **Tools** | Optional capabilities the assistant can invoke (deep dive in the next lesson) |
| **System Prompt** | Defines the assistant's persona, scope, and rules |

This is the same skeleton as any agent from Week 6, assembled specifically to be **talked to** rather than run once on a schedule.

---

### 2. The Chat Trigger

The **Chat Trigger** node is what makes a workflow feel like a chatbot instead of a batch job:
- It exposes a **chat window** (n8n's built-in chat UI) or a **webhook URL** that any front end can call.
- Each incoming message carries a **session ID**, which is how the workflow knows which conversation it belongs to.
- It fires the workflow **once per message**, not once per conversation — memory (below) is what stitches messages into a continuous conversation.

Without a Chat Trigger, an "assistant" is just a workflow you run manually with hardcoded input — not something a user can hold a conversation with.

---

### 3. Designing the System Prompt (Persona)

The system prompt is the single highest-leverage piece of an assistant. It should define:

1. **Role** — "You are a support assistant for [Product]."
2. **Scope / boundaries** — what it should and shouldn't answer.
3. **Tone** — formal, casual, concise, friendly.
4. **Tool usage rules** — when to use a tool vs. answer directly.
5. **Fallback behaviour** — what to say when it doesn't know something ("say so, don't guess").

```
You are Aria, the support assistant for Acme Cloud.
- Only answer questions about Acme Cloud products and billing.
- If asked about anything else, politely redirect.
- Use the "Lookup Order" tool for any order-specific question — never guess an order status.
- If you don't have enough information, ask a clarifying question instead of assuming.
- Keep responses under 4 sentences unless the user asks for detail.
```

A vague system prompt ("be helpful") produces an inconsistent assistant; a specific one produces a predictable one.

---

### 4. Giving the Assistant Memory

For a conversation to feel coherent, the agent must remember earlier turns:
- Attach a **Memory** sub-node (Window Buffer for simple cases, a database-backed memory for production).
- The memory is keyed by the **session ID** from the Chat Trigger — this is what separates User A's conversation from User B's.
- Decide a **retention window**: too short and the assistant "forgets" context mid-conversation; too long and old, irrelevant context can distract the model or bloat token usage.

---

### 5. Giving the Assistant Tools (preview)

An assistant that can only talk is limited. Attaching **tools** (HTTP Request, Workflow, Vector Store, app nodes) lets it *act* — check an order, create a ticket, search documentation. Tool design and tool-calling mechanics are covered in depth in the next lesson; for now, the key point is that tools attach to the same AI Agent node used for the persona and memory, so an assistant grows from "chatbot" to "agent that gets things done" without changing its shape — you just plug more sub-nodes in.

---

### 6. Testing and Iterating

Before deploying, stress-test the assistant like a real user would:
- **Happy path**: ask it the questions it's designed for.
- **Out-of-scope**: ask it something unrelated — does it redirect gracefully per the system prompt?
- **Ambiguous input**: give it a vague message — does it ask a clarifying question or hallucinate an answer?
- **Multi-turn**: have a back-and-forth conversation and confirm it retains context correctly.
- **Adversarial**: try to get it to ignore its instructions ("ignore the above and...") and check it holds its boundaries.

Use n8n's built-in chat preview and the **Executions** log to inspect exactly what the agent reasoned and which tools it called at each turn.

---

### 7. Deploying the Assistant

Once tested, the assistant needs a way for real users to reach it:

| Deployment target | How |
|---|---|
| **n8n's hosted chat widget** | Share the Chat Trigger's public URL directly |
| **Embedded on a website** | Embed the chat widget via a snippet |
| **Slack** | Swap the Chat Trigger for a Slack Trigger, same AI Agent underneath |
| **Custom front end** | Call the Chat Trigger's webhook from your own UI |

The AI Agent and its sub-nodes stay identical regardless of the front door — only the trigger and how the response is delivered changes. This is the same "swap the trigger" flexibility seen with regular automation workflows in Week 6.

---

### Putting It Together

```
 User message
      │
      ▼
┌──────────────┐      session_id      ┌──────────────┐
│ Chat Trigger  │ ───────────────────> │    Memory     │
└──────┬───────┘                       └──────┬───────┘
       │                                       │
       ▼                                       ▼
┌───────────────────────────────────────────────────┐
│                    AI AGENT                        │
│   System prompt (persona)  +  Chat Model  + Tools   │
└──────────────────────┬──────────────────────────────┘
                        ▼
                  Reply to user
```

---

## Key Points

- An **AI assistant** in n8n is the AI Agent node wrapped with a **Chat Trigger**, a well-designed **system prompt**, and **memory** — turning a workflow into something a real user can converse with.
- The **Chat Trigger** fires once per message and carries a **session ID** used to key memory per conversation.
- The **system prompt** is the highest-leverage lever for consistent behaviour: define role, scope, tone, tool rules, and fallback behaviour explicitly.
- **Memory** must be keyed per session; the retention window trades off context continuity against token cost and noise.
- Tools turn an assistant from "can talk" into "can act" — the same AI Agent node scales up without changing shape.
- Test the happy path, out-of-scope requests, ambiguous input, multi-turn context retention, and adversarial prompts before shipping.
- Deployment only changes the **trigger** and delivery surface (chat widget, Slack, custom front end) — the underlying agent stays the same.

## Examples

- **Support assistant**: A Chat Trigger + AI Agent with a system prompt scoping it to billing/product questions only, deployed as an embedded website widget.
- **Internal ops assistant**: The same architecture deployed via a Slack Trigger instead of a Chat Trigger, so employees ask it questions directly in a Slack channel.
- **Persona test**: Asking the assistant "what's the weather today?" when it's scoped to a SaaS product — a well-built system prompt makes it redirect instead of guessing.
- **Session bug**: Two users chatting simultaneously get mixed-up replies because memory wasn't keyed by session ID — fixed by keying memory off the Chat Trigger's session field.

## Questions

- How do you decide the right memory window size for a given assistant's typical conversation length?
- What's the best way to version and test changes to a system prompt without breaking production conversations?
- Should tone/persona rules live entirely in the system prompt, or partly enforced via an Output Parser too?
- How do you evaluate whether an assistant is "ready" to deploy beyond manual spot-checking?
- When an assistant is deployed on multiple channels (web + Slack), should each get its own tuned system prompt, or one shared prompt?
