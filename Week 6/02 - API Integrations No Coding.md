# 02 - API Integrations No Coding

## Notes

### Overview

An **API** (Application Programming Interface) is how two pieces of software talk to each other. When you "integrate" two apps, you're getting them to exchange data over their APIs.

Traditionally this meant writing code: making HTTP requests, parsing JSON, handling auth tokens, managing errors. **No-code integration** tools like n8n let you do all of this through configuration and visual nodes instead — you fill in fields rather than write `fetch()` calls.

This is the backbone of agentic apps: an agent's "tools" are very often just API calls to external services, and n8n makes wiring those up fast.

---

### 1. API Basics (just enough to integrate)

Most modern APIs are **REST APIs** that communicate over **HTTP**. A request has a few core parts:

| Part | What it is | Example |
|---|---|---|
| **Method** | The action verb | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| **URL / endpoint** | The address of the resource | `https://api.example.com/v1/users` |
| **Headers** | Metadata (auth, content type) | `Authorization: Bearer xyz` |
| **Query params** | Filters in the URL | `?status=active&limit=10` |
| **Body** | Data you send (for POST/PUT) | `{ "name": "Ada", "email": "..." }` |

#### The common HTTP methods
- **GET** — read data (fetch a list of users). No body.
- **POST** — create something new (add a user).
- **PUT / PATCH** — update an existing resource (PUT replaces, PATCH partially updates).
- **DELETE** — remove a resource.

#### Responses
- The API replies with a **status code** and usually a **JSON body**.
- **2xx** = success, **4xx** = your mistake (bad request, unauthorized), **5xx** = server's problem.
- Key codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `429 Too Many Requests`, `500 Server Error`.

---

### 2. Integrating with No Code

There are two ways to integrate an external service in n8n:

#### Option A: Dedicated app nodes (easiest)
n8n ships with hundreds of pre-built integration nodes (Gmail, Slack, Notion, Airtable, Google Sheets, etc.).
- They wrap the API for you — you pick an **operation** ("Send message", "Create row") and fill in fields.
- Auth is handled through n8n's **credentials** system, not raw tokens in the request.
- Best when a node exists for your service.

#### Option B: The HTTP Request node (universal)
When no dedicated node exists, the **HTTP Request** node can call *any* REST API.
- You manually set the **method, URL, headers, query params, and body**.
- This is the "connect to anything" escape hatch.
- Slightly more work but unlimited reach.

---

### 3. Authentication (without writing auth code)

APIs need to know *who* is calling. n8n handles auth through reusable **credentials** you set up once and attach to nodes.

| Auth type | How it works | Where used |
|---|---|---|
| **API Key** | A secret string sent in a header or query param | Many simple APIs |
| **Bearer token** | `Authorization: Bearer <token>` header | OpenAI, many modern APIs |
| **Basic auth** | Username + password encoded in a header | Older / internal APIs |
| **OAuth 2.0** | Login flow that grants a token; n8n manages refresh | Google, Slack, GitHub |

**Why credentials matter:** secrets are stored **separately** from the workflow. You never paste an API key directly into a node parameter — you create a credential once and reference it. This keeps secrets out of exported/shared workflows.

---

### 4. Working With the Data

Once data comes back from an API, you usually need to reshape it before the next step.

#### Expressions
n8n uses **expressions** (`{{ ... }}`) to pull values from previous nodes:
- `{{ $json.user.email }}` — get a nested field from the current item.
- `{{ $node["HTTP Request"].json.id }}` — reference a specific earlier node.

#### Common reshaping tasks
- **Set / Edit Fields node** — rename, add, or remove fields to match what the next API expects.
- **Item Lists / Split** — break an array response into individual items so the next node runs per-item.
- **Mapping** — transform field A from service 1 into field B expected by service 2.

#### Pagination
APIs often return data in **pages** (e.g. 50 results at a time). To get everything you either:
- Use a node's built-in **"Return all" / pagination** option, or
- Loop, incrementing a `page` or `offset` parameter until no more results come back.

---

### 5. Handling Errors and Limits

Real integrations fail sometimes — good ones plan for it.

- **Rate limits (`429`)**: APIs cap how many calls you can make. Respect them by adding **delays** (Wait node) or batching.
- **Retries**: n8n nodes can be set to **retry on failure** automatically.
- **Error branches**: use **"Continue on Fail"** or an **Error Trigger** workflow so one bad item doesn't kill the whole run.
- **Validation**: check the response status before using the data downstream.

---

### Putting It Together

```
Trigger ──> HTTP Request ──> Set (reshape) ──> App Node (e.g. Airtable)
            (GET data from     map fields to     write the result into
             Service A)        Service B's       Service B
                               format
```

A typical integration: pull data from one service, transform it into the shape another service expects, then push it there — all without writing a line of request-handling code.

---

## Key Points

- An **API** is how apps exchange data; most are **REST over HTTP** using methods (GET/POST/PUT/DELETE), headers, params, and a JSON body.
- **Status codes** tell you what happened: 2xx success, 4xx your fault, 5xx server's fault.
- n8n offers two integration paths: **dedicated app nodes** (easy, pre-built) and the **HTTP Request node** (universal, manual).
- **Authentication** is handled via reusable **credentials** — never hard-code API keys into node parameters.
- **Expressions** (`{{ $json.field }}`) let you pull and reuse data from earlier nodes.
- Real integrations must handle **pagination, rate limits (429), retries, and errors**.
- The core pattern is **fetch → reshape → push** between services.

## Examples

- **Dedicated node**: Use the "Google Sheets" node's "Append Row" operation to log form submissions — no API code needed.
- **HTTP Request node**: A service with no n8n node? Call its `/v1/orders` endpoint directly with a Bearer token credential.
- **Mapping between services**: Pull contacts from a CRM, use a Set node to rename `full_name` → `name`, then create them in a mailing-list tool.
- **Rate-limit handling**: When syncing 500 records to an API capped at 60/min, insert a Wait node to space out the calls.

## Questions

- How do you discover the correct endpoint, params, and body shape for an API that has no dedicated n8n node?
- When an OAuth token expires, how does n8n's credential system refresh it automatically?
- What's the cleanest way to handle pagination for an API that returns a `next_page` cursor instead of page numbers?
- How should you decide between "Continue on Fail" vs. stopping the whole workflow when one API call errors?
- Where is the line where no-code stops being enough and you should drop into the Code node?
