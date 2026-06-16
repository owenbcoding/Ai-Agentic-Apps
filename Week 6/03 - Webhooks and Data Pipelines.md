# 03 - Webhooks and Data Pipelines

## Notes

### Overview

This note covers two connected ideas:

1. **Webhooks** — how external systems *push* data into your workflow in real time.
2. **Data pipelines** — how data flows through a series of steps (ingest → transform → deliver) to produce a useful result.

Webhooks are usually the **entry point** of a pipeline, and the pipeline is the chain of nodes that processes whatever the webhook delivers. Together they're how event-driven, automated systems are built with no code.

---

### 1. Webhooks

A **webhook** is a way for one system to notify another that something happened — by sending an **HTTP request** to a URL you provide.

#### Webhook vs. polling
- **Polling**: you repeatedly ask "anything new yet?" on a schedule. Wasteful and delayed.
- **Webhook**: the other system tells *you* the moment something happens. Instant and efficient.

> Polling = "Are we there yet? Are we there yet?"
> Webhook = "I'll text you when we arrive."

#### How a webhook works
1. You create a **Webhook node** in n8n — it generates a unique URL (e.g. `https://your-n8n/webhook/abc123`).
2. You give that URL to the external service (or your app/form).
3. When an event happens, the service sends an **HTTP request** (usually `POST`) to that URL.
4. The request's **body, headers, and query params** become the input data to your workflow.
5. The workflow runs immediately.

#### Webhook node essentials
| Setting | Purpose |
|---|---|
| **HTTP Method** | Which method to listen for (usually `POST`, sometimes `GET`) |
| **Path** | The unique URL path that identifies this webhook |
| **Test vs. Production URL** | Test URL for building; production URL works only when the workflow is **active** |
| **Response mode** | Whether to reply immediately or after the workflow finishes |
| **Authentication** | Optionally require a secret/header so randoms can't trigger it |

#### Responding to a webhook
- The caller often expects a **response**. You can reply immediately (`200 OK`) or run the workflow first and return its result.
- The **Respond to Webhook** node lets you send back custom data — useful when the webhook backs an API or a chat UI.

#### Security
Anyone who knows the URL can call it, so:
- Add a **secret token / header check**.
- Validate the **payload shape** before trusting it.
- Consider **HMAC signature verification** for services that support it (e.g. Stripe, GitHub).

---

### 2. Data Pipelines

A **data pipeline** is a sequence of steps that moves data from a **source**, through **transformations**, to a **destination**. It's the same idea as a factory line for data.

#### The classic stages: ETL / ELT
- **Extract** — pull raw data from a source (webhook, API, database, file).
- **Transform** — clean, reshape, filter, enrich, or combine the data.
- **Load** — write the result to a destination (database, spreadsheet, another API, an LLM).

(**ETL** transforms before loading; **ELT** loads raw first, then transforms — common with data warehouses.)

#### Pipeline stages in n8n terms

| Stage | n8n nodes typically used |
|---|---|
| **Ingest (Extract)** | Webhook, Schedule + HTTP Request, app triggers |
| **Validate** | IF, Switch, Filter |
| **Transform** | Set/Edit Fields, Code, Item Lists, Date & Time |
| **Enrich** | HTTP Request (lookup), AI/LLM nodes, merge with other data |
| **Deliver (Load)** | Database node, Google Sheets, Slack, another HTTP Request |

#### Common transformation operations
- **Filtering** — drop items that don't matter (IF / Filter).
- **Mapping** — rename/restructure fields (Set node).
- **Aggregating** — combine many items into a summary.
- **Splitting** — break one array into many items so downstream nodes run per-item.
- **Merging** — join data from two branches/sources (Merge node).
- **Enriching** — add data from another source (e.g. look up a user's details by ID).

---

### 3. Designing a Good Pipeline

#### Idempotency
Running the same event twice shouldn't create duplicates. Webhooks can fire **more than once**, so:
- Use a unique ID to detect and skip duplicates.
- Prefer "upsert" (update-or-insert) over blind "insert".

#### Error handling and reliability
- **Continue on Fail** so one bad item doesn't crash the whole batch.
- **Retries** for flaky external calls.
- **Dead-letter handling** — route failed items somewhere to inspect later instead of losing them.
- **Logging** — record what came in and what went out for debugging.

#### Batching and throughput
- Large datasets can be split into **batches** (Loop / Split in Batches node) to avoid hitting memory limits or rate limits.
- Add **Wait** nodes to respect downstream API limits.

---

### Example Pipeline

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Webhook  │ ─>│   IF     │ ─>│   Set    │ ─>│   HTTP   │ ─>│ Database │
│ (new     │   │ validate │   │ reshape  │   │ enrich   │   │  store   │
│  order)  │   │ payload  │   │ fields   │   │ via API  │   │  result  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
   INGEST        VALIDATE      TRANSFORM       ENRICH          LOAD
```

An online store sends an order event → n8n validates it → reshapes the fields → looks up the customer's full profile via an API → saves the enriched order to a database. Real-time, no code.

---

## Key Points

- A **webhook** lets external systems **push** data to your workflow instantly via an HTTP request — far better than polling for real-time events.
- The Webhook node gives you a **unique URL**; the request's body/headers/params become your workflow's input.
- Webhooks only work in **production** when the workflow is **active**; use the test URL while building.
- Secure webhooks with **secret tokens, payload validation, and signature checks** — the URL alone isn't protection.
- A **data pipeline** moves data through **Extract → Transform → Load** stages.
- Core transforms: **filter, map, aggregate, split, merge, enrich**.
- Design for **idempotency** (handle duplicate events), **error handling** (continue on fail, retries), and **throughput** (batching, waits).
- Webhooks are usually the **trigger/ingest stage**; the pipeline is everything that processes the payload afterward.

## Examples

- **Webhook ingest**: A Typeform submission POSTs to an n8n webhook, kicking off a lead-processing pipeline.
- **Respond to Webhook**: A chat widget calls a webhook; the workflow runs an LLM and returns the answer as the HTTP response.
- **Transform stage**: Incoming order JSON is filtered (ignore test orders), mapped to internal field names, then enriched with shipping cost from a rates API.
- **Idempotency**: Each order carries an `order_id`; the pipeline checks the DB and skips it if already stored, preventing duplicate records on webhook retries.

## Questions

- How do you reliably detect and discard duplicate webhook deliveries without a database lookup on every event?
- When should a webhook respond immediately vs. wait for the whole pipeline to finish before responding?
- What's the best way to verify a webhook genuinely came from the expected service (signatures, IP allowlists, secrets)?
- How do you choose batch sizes when loading thousands of items into a rate-limited destination?
- Where should failed pipeline items go so they can be retried or inspected without blocking the rest of the run?
