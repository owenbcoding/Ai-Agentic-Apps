# 05 - Planning vs Execution Logic

## Notes

### The Core Distinction

Every non-trivial agent task involves two fundamentally different cognitive activities:

- **Planning**: deciding *what* to do and *in what order* — decomposing a goal into sub-tasks.
- **Execution**: actually *doing* each sub-task — calling tools, retrieving data, writing outputs.

In simple ReAct agents, these two activities are **interleaved** at every step (think → act → observe → think again). In more sophisticated architectures, they are **separated** into distinct phases with different models, prompts, or agents handling each.

Understanding the distinction helps you design agents that are both capable and controllable.

---

### Planning Logic

**Planning** is the process by which an agent figures out the steps needed to achieve a goal before (or while) executing them.

#### Types of planning

##### 1. Reactive / Inline Planning (ReAct style)
The agent plans one step at a time inside the reasoning loop. No upfront plan is produced — the agent figures out the next action based on the current state.

```
Goal: "Write a market analysis report on EV batteries."

Step 1 — Thought: "I'll start by searching for recent market data."
Step 2 — Thought: "I found data. Now I'll look for key players."
Step 3 — Thought: "I have enough. I'll draft the report section by section."
```

Pros: adaptive — the plan adjusts based on what the agent discovers.
Cons: can be inefficient — the agent may take redundant steps or lose sight of the overall goal.

##### 2. Upfront Planning (Plan-and-Execute)
The agent first generates a **complete plan** as an ordered list of steps, then hands that plan to an executor to carry out.

```
Phase 1 — PLANNER:
  1. Search for EV battery market size data (2024–2026)
  2. Search for top 5 EV battery manufacturers
  3. Search for recent regulatory changes
  4. Compile findings into a structured report

Phase 2 — EXECUTOR:
  Executes steps 1 → 2 → 3 → 4 in order
```

Pros: efficient, auditable, easier to parallelise.
Cons: rigid — if step 2 reveals the plan is wrong, re-planning requires a new LLM call.

##### 3. Hierarchical Planning
The planner produces a **high-level plan** with abstract steps. Each abstract step is handed to a sub-planner or sub-agent that produces a detailed execution plan for that step.

```
High-level plan: Research → Analyse → Write → Review

Research sub-plan: search_web → scrape_sources → summarise
Analyse sub-plan: extract_data → run_stats → identify_trends
```

Best for: very complex, long-horizon tasks where a single flat plan would be unwieldy.

---

### Execution Logic

**Execution** is the step-by-step carrying out of planned actions — calling tools, processing results, and producing outputs.

#### Key principles of good execution logic

1. **One action per step**: each execution step should call exactly one tool and wait for its result before proceeding. Parallel tool calls are possible but add complexity.

2. **Observe before continuing**: the result of every tool call must be fed back before the next step — this is the Observation phase of ReAct.

3. **Handle errors gracefully**: tool calls fail. The executor should have a strategy for each failure type:
   - Retry with the same parameters (transient failures)
   - Retry with modified parameters (bad input)
   - Skip and flag to the planner (unrecoverable failure)
   - Abort the task and surface the error to the user

4. **Track state**: the executor maintains a record of which steps have been completed, what results were returned, and what still needs to be done.

---

### Planning vs Execution: Separated Architecture

In a **Plan-and-Execute** architecture, the two phases are handled by different components:

```
┌──────────────────────────────────────────────────────┐
│                   PLANNER (LLM)                      │
│  Input:  User goal                                   │
│  Output: Ordered list of steps                       │
└──────────────────┬───────────────────────────────────┘
                   │  Plan
                   ▼
┌──────────────────────────────────────────────────────┐
│                  EXECUTOR (LLM + tools)              │
│  Input:  One step from the plan                      │
│  Output: Result / observation                        │
│  Loop:   Move to next step when current is complete  │
└──────────────────┬───────────────────────────────────┘
                   │  All steps done
                   ▼
              Final Output
```

The planner and executor can use:
- **The same LLM** with different prompts
- **Different LLMs** (e.g. a powerful model for planning, a cheaper model for execution)
- **Different agents** in a multi-agent system

---

### Re-planning

A pure Plan-and-Execute system is fragile — the plan is made before the agent has seen the results of any actions. **Re-planning** adds adaptability:

- After each execution step (or after a batch of steps), the planner is invoked again.
- It receives the original goal + the current observations and updates the remaining plan.
- This creates a feedback loop: plan → execute → observe → re-plan → execute → ...

```
Initial plan: [A, B, C, D]
After A completes: observation reveals C is unnecessary
Re-plan:       [B, D, E]   ← updated based on new information
```

Re-planning trades efficiency (more planner LLM calls) for robustness.

---

### Comparing Inline vs Separated Planning

| Aspect | Inline (ReAct) | Separated (Plan-and-Execute) |
|---|---|---|
| **Adaptability** | High — adjusts every step | Low unless re-planning is added |
| **Efficiency** | Can be redundant | Structured, fewer wasted steps |
| **Parallelism** | Difficult | Easy — executor can parallelise independent steps |
| **Auditability** | Hard — plan buried in trace | Easy — plan is explicit and inspectable |
| **Complexity** | Low — one loop | Higher — two components to coordinate |
| **Best for** | Exploratory, unpredictable tasks | Structured, well-defined tasks |

---

### Planning in No-Code Platforms

| Platform | Planning approach |
|---|---|
| **Flowise / Dify** | Mostly inline ReAct; some support for a Planner node that generates a task list |
| **LangGraph** | Explicit graph nodes for Planner and Executor; state is passed between them |
| **AutoGen** | The "AssistantAgent" plans and the "UserProxy" (or a tool executor) acts |
| **CrewAI** | Tasks are pre-defined by the user (explicit plan); agents execute assigned tasks |
| **n8n** | Manual plan baked into the workflow graph; an AI node can dynamically generate a sub-plan |

---

### Practical Design Guidance

1. **Start with inline (ReAct)** — it is simpler and often good enough for tasks with 5–10 steps.
2. **Switch to Plan-and-Execute** when:
   - Tasks regularly exceed 15+ steps
   - You need a human to review the plan before execution begins
   - Steps can run in parallel and you want to exploit that
   - You need a clear audit trail of what was intended vs. what happened
3. **Add re-planning** when execution frequently reveals that the original plan was wrong.
4. **Separate the planner LLM** from the executor LLM if cost matters — use a powerful model to plan and a cheaper/faster model to execute each step.
5. **Always expose the plan** to the user or a logging system — a plan that cannot be inspected is a plan that cannot be debugged.

---

## Key Points

- **Planning** determines what steps to take; **execution** carries those steps out — in simple agents they are interleaved, in sophisticated systems they are separated.
- **Inline planning (ReAct)** decides one step at a time — highly adaptive but can be inefficient.
- **Upfront planning (Plan-and-Execute)** generates a complete plan first, then executes — efficient and auditable but rigid.
- **Re-planning** adds adaptability to Plan-and-Execute by updating the remaining plan after each observation.
- Separated planning enables parallelism, human-in-the-loop plan review, and use of different (e.g. cheaper) models for execution.
- Good execution logic handles errors gracefully: retry, skip, or abort with clear escalation paths.
- Start with inline ReAct; move to separated planning only when task length, parallelism, or auditability demands it.

## Examples

- **Inline planning**: A ReAct agent writing a blog post decides mid-task to add a statistics section after finding a compelling data source it wasn't initially planning to use.
- **Plan-and-Execute**: An agent given "Book me a flight and hotel in Berlin for next weekend" produces a plan: [1. Search flights, 2. Search hotels, 3. Compare options, 4. Present summary] and executes each step in order.
- **Re-planning**: An agent planning to scrape data from a website discovers in step 1 that the site requires login. It re-plans to use a public API instead, then continues.
- **Hierarchical planning**: An agent building a full software feature plans: [Design, Code, Test, Document]. The "Code" step is handed to a sub-planner that produces: [Write function, Write tests, Run linter, Fix errors].

## Questions

- How does a planner know when a plan is "good enough" to pass to the executor — what are the quality criteria?
- When re-planning mid-task, how much of the original plan should be preserved vs. discarded to avoid thrashing?
- In a Plan-and-Execute system with a human review step, what format should the plan be presented in to make it most useful to a non-technical reviewer?
- How do you handle a situation where the executor completes a step but the result is ambiguous — how does it decide whether to continue or trigger re-planning?
- Can planning and execution ever be fully parallelised, or is there always a dependency where execution results must inform the next planning decision?
