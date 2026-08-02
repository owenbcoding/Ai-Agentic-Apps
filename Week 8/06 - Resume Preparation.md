# 06 - Resume Preparation

## Notes

### Overview

Eight weeks of notes and hands-on n8n workflows are only useful for a job search if they translate into language a resume and a recruiter's first scan can actually pick up. This lesson is about converting the *project experience* built across Weeks 5–8 into resume content that reads as real, demonstrable skill rather than a list of course topics.

---

### 1. What This Project Actually Demonstrates

Before writing anything, it's worth naming the underlying skills the coursework actually built, since these are what a resume should highlight — not "took a course":

- Designing and building **AI agents** (tools, memory, reasoning loops) — not just calling an LLM API.
- **RAG pipeline** design: chunking, embedding, indexing, retrieval, and keeping it correct in production.
- **Workflow automation** with n8n: triggers, branching logic, error handling, integrations (Slack, Sheets, Email).
- **Production concerns**: security/credential management, logging/monitoring, self-hosted vs cloud trade-offs.
- **Systems thinking**: multi-step/multi-agent orchestration, not just single prompt-response interactions.

---

### 2. Framing Project Experience — Bullet Structure

Use the **action + tool + outcome/scale** structure rather than describing what the course covered:

> Weak: *"Learned about AI agents and RAG in n8n."*
>
> Strong: *"Built a multi-step AI agent system in n8n integrating RAG-based retrieval, Slack/email automation, and tool-calling workflows, with production logging and error handling."*

General pattern:

```text
[Action verb] + [what was built] + [technologies/tools] + [why it mattered / what it handled]
```

- Lead with a strong verb: *Built, Designed, Implemented, Architected, Automated, Deployed.*
- Name concrete tools/technologies: n8n, RAG, vector databases, LLM APIs (be specific if you used a specific provider/model).
- Where possible, quantify: number of workflows, integrations, or a concrete capability ("processes X requests," "integrates 4 external systems").

---

### 3. Example Resume Bullets

- *"Designed and deployed a multi-agent workflow system in n8n orchestrating research, drafting, and review agents with conditional branching and error recovery."*
- *"Built a production RAG pipeline with automated document re-indexing, metadata-based freshness filtering, and retrieval quality monitoring."*
- *"Implemented secure credential management and prompt-injection mitigations for an LLM-powered support assistant handling real customer data."*
- *"Integrated Slack, Google Sheets, and email into an automated agentic workflow, reducing manual triage time for [a described task]."*
- *"Set up logging, alerting, and dashboards for production automation workflows to monitor error rate, latency, and cost."*

---

### 4. Where This Fits on a Resume

| Resume section | How to use this project |
|---|---|
| **Projects** | Best fit if this was self-directed/course-based — a dedicated project entry with 2–4 bullets |
| **Experience** | If applied within a job/internship context, frame it as work experience with business impact |
| **Skills** | Pull out the concrete tools/concepts: n8n, RAG, LLM APIs, agent orchestration, vector databases |
| **Summary/headline** | If pursuing AI/automation-focused roles, a line like *"Experience building production agentic AI workflows"* signals relevance immediately |

---

### 5. Tailoring to the Role

- **AI/ML-focused roles**: emphasize RAG design, agent architecture, prompt engineering, and evaluation/quality metrics.
- **Automation/ops-focused roles**: emphasize n8n workflow design, integrations, error handling, and production reliability (logging, monitoring, security).
- **General software roles**: emphasize the systems-thinking angle — multi-step orchestration, state management, and production readiness — since these transfer beyond any specific AI tooling.
- Mirror keywords from the job description where genuinely true (e.g. if a posting says "workflow automation," don't only say "AI agents" — use both if applicable).

---

### 6. Common Resume Mistakes to Avoid

- Listing the **course/curriculum topics** verbatim instead of translating them into what was *built*.
- Being vague about tools ("used AI tools") instead of specific ("used n8n's AI Agent node with a RAG-backed vector store").
- Overclaiming production scale that wasn't real — better to describe project scope honestly and let the technical depth speak for itself.
- Forgetting the **"why it mattered"** half of a bullet — a tool list without an outcome reads as a tutorial completion, not a demonstrated skill.

## Key Points

- Resume bullets should describe **what was built and with what outcome**, not which course topics were covered.
- Use the action + tool + outcome structure, leading with a strong verb and naming concrete technologies.
- This project demonstrates agent design, RAG pipelines, workflow automation, and production concerns (security, logging, deployment trade-offs) — all resume-worthy, distinct skills.
- Place this experience under Projects or Experience depending on context, and pull specific tools into the Skills section.
- Tailor emphasis to the role: AI/ML roles favor RAG/agent depth, automation/ops roles favor n8n/integration/reliability depth.
- Avoid vague tool references, overclaimed scale, and bullets that list activities without stating why they mattered.

## Examples

- **Before/after rewrite**: *"Learned n8n and AI agents"* → *"Built a production-style multi-agent n8n workflow with RAG retrieval, Slack integration, and monitoring/alerting."*
- **Tailored for an AI role**: emphasizing *"Designed a RAG pipeline with automated re-indexing and retrieval quality monitoring."*
- **Tailored for an automation/ops role**: emphasizing *"Automated multi-step business workflows across Slack, Email, and Sheets with error handling and production logging."*
- **Skills section addition**: n8n, RAG, LLM APIs, vector databases, workflow automation, agent orchestration, prompt engineering.

## Questions

- How much technical depth should a resume bullet include before it becomes too jargon-heavy for a non-technical recruiter's first pass?
- Should this project be framed differently depending on whether the target role is AI-focused versus general software engineering?
- How do you honestly represent project scope (a learning project) without underselling the actual skills demonstrated?
- What's the best way to surface this experience to pass an ATS (applicant tracking system) keyword scan?
- Should specific model/provider names be included, given how fast the underlying tools change?
