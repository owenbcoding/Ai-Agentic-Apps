# 03 - ReAct Concept No-code Perspective

## Notes

### What is ReAct?

**ReAct** (Reasoning + Acting) is a prompting framework — and subsequently an agent architecture — introduced in a 2022 research paper by Yao et al. The core idea is simple:

> Interleave **reasoning traces** (thoughts) with **actions**, and feed the observation from each action back into the model before the next reasoning step.

Before ReAct, there were two separate paradigms:
- **Chain of Thought (CoT)**: model reasons step by step but takes no external actions.
- **Action-only agents**: model calls tools but doesn't show its reasoning — hard to debug.

ReAct **combines both**, making agents more accurate and more interpretable.

---

### The ReAct Cycle

Each step of a ReAct agent follows this three-part pattern:

```
Thought:      "I need to find the population of Japan to answer this question."
Action:       web_search("Japan population 2026")
Observation:  "Japan's population is approximately 123 million (2026 estimate)."

Thought:      "I now have the number. I can compute the answer."
Action:       calculator("123,000,000 / 6")
Observation:  "20,500,000"

Thought:      "I have the final answer."
Action:       finish("Each of the 6 regions would cover approximately 20.5 million people.")
```

The model never jumps directly from a question to a final answer. It reasons aloud, acts, observes, reasons again — until it is confident.

---

### Why the Thought Step Matters

The **Thought** is a scratchpad written by the model for itself, not the user. It:

- Surfaces the model's current plan, so you can inspect what it's "thinking"
- Allows the model to decompose a complex goal into sub-tasks explicitly
- Reduces errors by preventing the model from jumping to conclusions
- Makes debugging far easier — you can see exactly where reasoning went wrong

Without the Thought step, you only see actions and results. With it, you can follow the model's logic at every step.

---

### The Full ReAct Loop (Formal)

```
┌──────────────────────────────────────────────────────┐
│  Input: Task / question from user                    │
│                                                      │
│  Loop:                                               │
│    1. THOUGHT   — model reasons about current state  │
│    2. ACTION    — model selects and calls a tool     │
│    3. OBSERVATION — tool result is returned          │
│    ↑_______________________________________________|  │
│                                                      │
│  Until: model outputs a FINISH action with answer    │
└──────────────────────────────────────────────────────┘
```

The loop terminates when the model emits a special "finish" or "final answer" action instead of a tool call.

---

### ReAct from a No-Code Perspective

If you are using a no-code or low-code tool (n8n, Make, Zapier with AI, Flowise, Dify, etc.), you may never write the ReAct prompt yourself — the platform implements it under the hood. But understanding the concept lets you:

- **Configure your agent correctly**: knowing Thought → Action → Observation helps you structure your tool descriptions and system prompts to match what the agent expects.
- **Debug misbehaving agents**: when an agent loops, over-calls a tool, or produces wrong answers, the Thought logs tell you where the reasoning broke down.
- **Design better tool sets**: each tool should map cleanly to one type of Action the agent might reason its way toward calling.

#### How ReAct appears in no-code platforms

| Platform | Where ReAct manifests |
|---|---|
| **Flowise / LangFlow** | ReAct Agent node — the Thought/Action/Observation cycle runs automatically; you configure tools and the system prompt |
| **n8n AI Agent node** | Internally uses an agent loop; you attach tools as sub-nodes; intermediate thoughts can be logged |
| **Make (Integromat) + GPT** | You build a multi-step scenario where an LLM module decides a next step and calls other modules — a manual approximation |
| **Dify** | Visual agent builder; ReAct is the default reasoning strategy; you can inspect thought traces in the debug view |
| **OpenAI Assistants API** | The "Runs" system is a managed ReAct loop; you attach tools and the API handles Thought/Action/Observation internally |

---

### ReAct vs Other Agent Strategies

| Strategy | Reasoning | Actions | Notes |
|---|---|---|---|
| **ReAct** | Interleaved thoughts at each step | Tool calls per step | Most common; good for multi-step tasks |
| **Chain of Thought (CoT)** | Full reasoning before any action | None (or one final action) | Good for pure reasoning, no external tools |
| **Plan-and-Execute** | Full plan upfront | Execute each step | Better for long, structured tasks; less adaptive |
| **Reflection / Self-Critique** | Agent critiques its own output | Revise and retry | Improves quality; more expensive |
| **Tree of Thoughts** | Explores multiple reasoning paths | Picks the best branch | Best for complex, exploratory problems |

ReAct is the default choice for most practical agent builds because it is simple, debuggable, and works well with tool-calling LLMs.

---

### Common Failure Modes in ReAct Agents

- **Thought-Action mismatch**: the Thought says one thing but the Action calls a different tool — usually a sign of a poorly described tool.
- **Reasoning loop**: the agent reaches the same Thought repeatedly without making progress — add a max_steps limit.
- **Over-reasoning**: the agent writes many Thought steps but never commits to an Action — tighten the system prompt to prompt for decisiveness.
- **Observation ignored**: the model ignores the tool result in its next Thought — this is a context length or prompt structure issue; make sure observations are clearly labelled.
- **Premature finish**: the agent calls FINISH before having enough information — add a "verify your answer before finishing" instruction to the system prompt.

---

### Practical Tips for No-Code Builders

1. **Always enable thought logging** in your platform's debug mode — you cannot debug an agent you cannot see thinking.
2. **Write tool descriptions as if explaining to a person**: "Use this tool when you need to find real-time information on the web. Input: a search query string."
3. **Keep the tool list short**: the model struggles to choose well from more than ~10 tools; group related functionality.
4. **Set a max steps / iterations limit**: prevents runaway API costs on looping agents.
5. **Test with edge cases**: give the agent a task where the obvious first action is wrong — see if it recovers via Thought/Observation.

---

## Key Points

- ReAct interleaves **Thought** (reasoning) + **Action** (tool call) + **Observation** (result) in a loop, repeating until the task is complete.
- The Thought step is a scratchpad — it makes the agent's logic transparent and debuggable.
- ReAct improves accuracy over action-only agents because the model checks its own reasoning before each step.
- No-code platforms like Flowise, Dify, and n8n implement the ReAct loop internally — you configure tools and prompts, the loop runs automatically.
- Knowing the Thought → Action → Observation cycle helps you write better tool descriptions and system prompts.
- Common failure modes: reasoning loops, premature finish, and observations being ignored — all diagnosable via thought logs.

## Examples

- **Step-by-step ReAct trace** for "What is the capital of the most populous country in Africa?":
  - Thought: "I need to find the most populous country in Africa."
  - Action: `web_search("most populous country in Africa 2026")`
  - Observation: "Nigeria, ~230 million people."
  - Thought: "Now I need the capital of Nigeria."
  - Action: `web_search("capital of Nigeria")`
  - Observation: "Abuja."
  - Thought: "I have the answer."
  - Action: `finish("Abuja")`

- **No-code example**: In Flowise, you create a ReAct Agent node, attach a "Serper Web Search" tool and a "Calculator" tool, and write a system prompt. The platform handles all Thought/Action/Observation formatting — you see the trace in the debug panel.

## Questions

- Why does interleaving thoughts with actions outperform generating all thoughts first and then all actions (Plan-and-Execute)?
- How does the model "know" when it has enough information to emit a FINISH action rather than another tool call?
- What is the performance cost of the Thought step — does generating reasoning tokens meaningfully increase latency or just token count?
- In a no-code platform, how much control do you have over the exact Thought/Action/Observation prompt format, and does it matter?
- How would you adapt ReAct for a task that requires parallel actions (doing two things simultaneously) rather than strictly sequential steps?
