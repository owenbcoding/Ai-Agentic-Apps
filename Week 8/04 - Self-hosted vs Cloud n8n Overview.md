# 04 - Self-hosted vs Cloud n8n Overview

## Notes

### Overview

Every workflow so far has been built without much thought to *where* n8n itself runs. Before putting a workflow in front of real users, that becomes a real decision: use **n8n Cloud** (managed hosting) or **self-host** n8n on your own infrastructure. The right choice depends on cost, control, compliance, and how much operational overhead the team is willing to own.

---

### 1. The Two Options

| | n8n Cloud | Self-hosted |
|---|---|---|
| **Hosting** | Managed by n8n | You run it (Docker, VM, Kubernetes, etc.) |
| **Setup effort** | Minutes — sign up and start building | Requires provisioning infra, DB, reverse proxy, TLS |
| **Maintenance** | Handled by n8n | You handle updates, backups, scaling, uptime |
| **Cost model** | Subscription tiers, usage-based limits | Infrastructure cost (server, DB) — no per-seat fee |
| **Data residency** | Data lives on n8n's infrastructure | Full control over where data lives |
| **Customization** | Limited to what the platform exposes | Full access — custom nodes, networking, scaling config |
| **Scaling** | Handled automatically by the platform | You configure workers, queues, and scaling yourself |

---

### 2. When Cloud Makes Sense

- Small teams or individuals who want to **start fast** without managing infrastructure.
- Workflows that don't have strict data residency or compliance requirements.
- Teams without dedicated DevOps capacity to maintain uptime, backups, and security patches.
- Predictable, moderate workflow volume that fits within a subscription tier's limits.

---

### 3. When Self-hosting Makes Sense

- **Compliance/data residency**: regulated industries (healthcare, finance, government) often require data to stay within specific infrastructure the org controls.
- **Cost at scale**: high execution volume can make self-hosted infrastructure cheaper than cloud subscription tiers over time.
- **Custom requirements**: need for custom nodes, non-standard networking, or integration with internal systems that aren't cloud-accessible.
- **Full control**: teams that already run their own infrastructure and want workflows to live alongside the rest of their stack.

---

### 4. Self-hosting Architecture Basics

```text
                ┌──────────────┐
   Users ──────>│ Reverse Proxy │  (TLS termination, e.g. nginx/Caddy)
                └──────┬───────┘
                       ▼
                ┌──────────────┐
                │   n8n (main)  │  (UI, webhook triggers, editor)
                └──────┬───────┘
                       ▼
            ┌──────────────────────┐
            │  Postgres (or SQLite) │  (workflow/execution data)
            └──────────────────────┘
                       │
             (optional, at scale)
                       ▼
              ┌──────────────────┐
              │  Queue + Workers   │  (Redis + n8n worker processes)
              └──────────────────┘
```

- **Database**: SQLite works for small/single-instance setups; Postgres is recommended for production (concurrency, reliability, backups).
- **Queue mode**: for higher volume, n8n can run in **queue mode** — a main instance plus separate worker processes pulling jobs from Redis — so execution load is distributed instead of bottlenecked on one process.
- **Reverse proxy + TLS**: required for any production deployment exposed to the internet (webhooks, chat triggers).

---

### 5. Operational Responsibilities When Self-hosting

| Responsibility | What it involves |
|---|---|
| **Updates** | Applying n8n version upgrades, testing for breaking changes |
| **Backups** | Regular database backups (workflow definitions, execution history, credentials) |
| **Uptime/monitoring** | Ensuring the instance stays up, alerting on downtime |
| **Security patching** | Keeping the host OS, Docker images, and dependencies current |
| **Scaling** | Adding workers/queue mode as execution volume grows |
| **Access control** | Managing who can log in, edit workflows, and view credentials |

Self-hosting trades cost/control for **owning all of this** — it's not a one-time setup, it's ongoing operational work.

---

### 6. Hybrid Consideration

Some teams start on **Cloud** to validate a workflow quickly, then migrate to **self-hosted** once volume, compliance needs, or cost justify the operational overhead. n8n workflows are portable (exportable as JSON), which makes this migration path realistic rather than a full rebuild.

## Key Points

- n8n Cloud trades control and customization for **speed and zero operational overhead**; self-hosting trades setup/maintenance effort for **full control and potential cost savings at scale**.
- Cloud is the better default for small teams, low-to-moderate volume, and no strict compliance requirements.
- Self-hosting is justified by compliance/data-residency needs, high execution volume, custom infrastructure requirements, or an existing internal ops capability.
- A production self-hosted setup needs a real database (Postgres over SQLite), a reverse proxy with TLS, and — at scale — **queue mode** with separate worker processes.
- Self-hosting means owning updates, backups, uptime monitoring, security patching, and scaling as ongoing responsibilities, not one-time setup tasks.
- Because workflows export as portable JSON, starting on Cloud and migrating to self-hosted later is a realistic path, not a rebuild.

## Examples

- **Startup MVP**: a small team validates an agent product on n8n Cloud to move fast, without hiring DevOps support.
- **Healthcare compliance**: a hospital system self-hosts n8n inside its own VPC because patient data cannot legally leave its controlled infrastructure.
- **Scaling pain point**: a company on Cloud hits execution volume limits and migrates to a self-hosted, queue-mode deployment to cut per-execution cost.
- **Migration workflow**: a team exports all workflow JSON from Cloud, imports it into a self-hosted instance, and reconnects credentials — validating the portability of the platform.

## Questions

- At what execution volume does self-hosting typically become cheaper than a Cloud subscription tier?
- What's involved in migrating a live production workflow from Cloud to self-hosted with minimal downtime?
- How does queue mode change failure handling compared to a single-instance n8n deployment?
- What compliance certifications (SOC 2, HIPAA, etc.) does n8n Cloud offer, and when do they fall short of an org's requirements?
- How would you design a backup/disaster-recovery plan for a self-hosted n8n instance running business-critical workflows?
