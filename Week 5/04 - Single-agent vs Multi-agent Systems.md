# 04 - Single-agent vs Multi-agent Systems

## Notes

### What is a Single-Agent System?

A **single-agent system** is an architecture where one LLM-powered agent handles an entire task end-to-end. It has access to a set of tools and follows a reasoning loop (e.g. ReAct) until the task is complete.

```
User → [Single Agent (LLM + tools + memory)] → Output
```

The agent is responsible for:
- Understanding the goal
- Planning the steps
- Selecting and calling tools
- Synthesising the final result

This is the simplest possible agent architecture and the right starting point for most tasks.

---

### What is a Multi-Agent System?

A **multi-agent system (MAS)** is an architecture where multiple specialised agents collaborate — each responsible for a sub-task — coordinated by an orchestrator or a defined communication protocol.

```
User → [Orchestrator Agent]
              ├── [Research Agent]   → web search, summarisation
              ├── [Coder Agent]      → writes and tests code
              └── [Reviewer Agent]  → checks output quality
                        ↓
                    Final Output
```

Each agent has its own:
- System prompt (role and constraints)
- Tool set (only the tools it needs)
- Memory (optionally isolated)

---

### Single-Agent vs Multi-Agent: Key Comparison

| Dimension | Single-Agent | Multi-Agent |
|---|---|---|
| **Complexity** | Simple to build and debug | More complex — coordination overhead |
| **Context window** | One context window for everything | Each agent has its own context — avoids overflow |
| **Specialisation** | Generalist — one model does everything | Specialists — each agent is expert in its role |
| **Parallelism** | Sequential by default | Agents can run in parallel |
| **Failure surface** | Single point of failure | Failures can be isolated per agent |
| **Cost** | Fewer LLM calls | More LLM calls — higher cost |
| **Debugging** | Inspect one trace | Must trace across multiple agents |
| **Best for** | Focused, bounded tasks | Complex, long-horizon, or parallelisable tasks |

---

### Multi-Agent Topologies

There is no single "correct" structure for multi-agent systems. Common topologies include:

#### 1. Orchestrator–Subagent (Hub and Spoke)
A central **orchestrator** receives the user's goal, breaks it into sub-tasks, delegates to specialised subagents, and assembles the final response.

```
Orchestrator
   ├── SearchAgent
   ├── WriterAgent
   └── FactCheckerAgent
```

Best for: tasks that decompose cleanly into independent specialisations.

#### 2. Sequential Pipeline
Each agent passes its output to the next as input — like an assembly line.

```
User input → [Agent A: Parse] → [Agent B: Enrich] → [Agent C: Format] → Output
```

Best for: structured transformations where each step builds on the last.

#### 3. Peer-to-Peer / Debate
Multiple agents work on the same problem independently and compare or critique each other's outputs. A final agent (or majority vote) resolves disagreements.

```
Agent A: "Answer is X"  ┐
Agent B: "Answer is Y"  ├→ [Judge/Aggregator] → Final Answer
Agent C: "Answer is X"  ┘
```

Best for: high-stakes decisions where accuracy matters and hallucination risk is high.

#### 4. Recursive / Nested
An agent can spawn sub-agents dynamically mid-task to handle portions of work it discovers it cannot complete alone.

Best for: open-ended research or coding tasks where the scope is not known upfront.

---

### Why Multi-Agent?

The main motivations for going multi-agent are:

1. **Context window limits**: a very long task would overflow a single agent's context. Splitting across agents keeps each context focused and manageable.
2. **Specialisation**: a coding agent fine-tuned (or prompted) for code is better at code than a generalist agent; similarly for research, writing, QA, etc.
3. **Parallelism**: independent sub-tasks can be run simultaneously, reducing total wall-clock time.
4. **Fault isolation**: if one agent fails, the others can continue or the orchestrator can retry just that sub-task.
5. **Role clarity**: separate system prompts keep each agent's behaviour tightly scoped and easier to test.

---

### The Coordination Problem

Multi-agent systems introduce a **coordination overhead** that single-agent systems avoid:

- **Communication protocol**: how do agents pass information to each other? (shared memory, message queues, direct API calls)
- **State management**: what does each agent know, and when? Who owns the authoritative state?
- **Error propagation**: if Agent B gets bad output from Agent A, how does the system recover?
- **Deadlock / dependency cycles**: Agent A waiting for Agent B waiting for Agent A.

These are engineering problems, not AI problems — they require careful system design.

---

### When to Use Each

**Use a single agent when:**
- The task fits comfortably within one context window
- You need fast iteration and simple debugging
- The task does not decompose cleanly into parallel sub-tasks
- You are prototyping — always start here

**Use multi-agent when:**
- The task is too long or complex for one context window
- Distinct expertise is needed for different parts (e.g. code + research + writing)
- Sub-tasks can run in parallel and time matters
- You need independent verification / fact-checking of outputs
- The system must be resilient to partial failures

---

### Multi-Agent in No-Code Platforms

| Platform | Multi-Agent Support |
|---|---|
| **Flowise** | Multi-agent canvas — connect orchestrator and subagent nodes visually |
| **LangGraph** | Explicit graph-based agent topologies; nodes are agents, edges are transitions |
| **AutoGen (Microsoft)** | Framework specifically built for multi-agent conversations |
| **CrewAI** | Defines "crews" of agents with roles, goals, and a shared backstory |
| **n8n** | Can approximate multi-agent by chaining AI Agent nodes with different system prompts |

---

## Key Points

- A **single agent** handles everything end-to-end; a **multi-agent system** distributes work across specialised agents coordinated by an orchestrator.
- Single-agent is simpler, cheaper, and easier to debug — always start here.
- Multi-agent is justified when a task exceeds context limits, requires specialisation, benefits from parallelism, or needs independent verification.
- Common topologies: hub-and-spoke (orchestrator + subagents), sequential pipeline, peer debate, and recursive/nested.
- Multi-agent introduces coordination overhead — communication, state management, error propagation, and dependency management become engineering concerns.
- No-code platforms like Flowise, CrewAI, and LangGraph make multi-agent architectures accessible without writing orchestration code from scratch.

## Examples

- **Single-agent**: A ReAct agent with web search and a calculator that answers the question "How much would £1,000 invested in the S&P 500 five years ago be worth today?"
- **Multi-agent (orchestrator + subagents)**: An automated research report tool — the orchestrator assigns web research to a SearchAgent, data analysis to an AnalystAgent, and final drafting to a WriterAgent.
- **Sequential pipeline**: A content moderation system — Agent 1 extracts claims from user text → Agent 2 fact-checks each claim → Agent 3 generates a moderation verdict.
- **Peer debate**: Three agents each generate an answer to a medical question; a fourth agent evaluates and selects the most well-reasoned response.

## Questions

- How do you decide where to draw the boundary between what one agent handles and what gets delegated to a subagent?
- How do multi-agent systems handle situations where subagents produce contradictory outputs?
- What communication protocols are used between agents — function calls, shared databases, message queues?
- How do you test a multi-agent system end-to-end when each agent is itself non-deterministic?
- Is there a point of diminishing returns where adding more specialised agents makes a system less reliable rather than more capable?
