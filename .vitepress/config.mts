import { defineConfig } from 'vitepress'

const weekOverview = [
  { text: 'Week 1 — Introduction to ML/AI', link: '/Week 1/' },
  { text: 'Week 2 — Deep Learning in a Nutshell', link: '/Week 2/' },
  { text: 'Week 3 — NLP Basics and Transformers', link: '/Week 3/' },
  { text: 'Week 4 — Gen AI & Prompt Engineering', link: '/Week 4/' },
  { text: 'Week 5 — Agentic AI Fundamentals', link: '/Week 5/' },
  { text: 'Week 6 — No-Code Automation with n8n', link: '/Week 6/' },
  { text: 'Week 7 — Real Agentic Workflows', link: '/Week 7/' },
  { text: 'Week 8 — Production & Interview Prep', link: '/Week 8/' },
]

export default defineConfig({
  title: 'Agentic AI Applications',
  description: 'An 8-week study companion for building agentic AI applications — from AI/ML foundations to production-ready n8n automations.',
  base: '/Ai-Agentic-Apps/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Ai-Agentic-Apps/favicon.svg' }],
  ],

  markdown: {
    // Notes contain literal `{{ ... }}` n8n expression syntax in inline code
    // (e.g. `{{ $json.email }}`). Fenced code blocks are auto-protected by
    // VitePress, but inline `code` spans aren't — without this, Vue's
    // template compiler tries to parse that text as an interpolation and
    // the build fails. Marking those spans `v-pre` tells Vue to leave them
    // as literal text, with zero changes to any note's source content.
    config(md) {
      const defaultCodeInline = md.renderer.rules.code_inline!
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.content.includes('{{')) {
          token.attrSet('v-pre', '')
        }
        return defaultCodeInline(tokens, idx, options, env, self)
      }
    },
  },

  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Start Here', link: '/start here' },
      { text: 'Weeks', items: weekOverview },
    ],

    sidebar: {
      '/': [{ text: 'All Weeks', collapsed: false, items: weekOverview }],

      '/Week 1/': [
        {
          text: 'Week 1 — Introduction to ML/AI',
          items: [
            { text: '01 · What is AI vs ML vs Generative AI', link: '/Week 1/01 - What is AI vs ML vs Generative AI' },
            { text: '02 · Predictive AI vs Agentic AI', link: '/Week 1/02 - Predictive AI vs Agentic AI' },
            { text: '03 · Classification Use Cases', link: '/Week 1/03 - Classification Use Cases' },
            { text: '04 · Regression Use Cases', link: '/Week 1/04 - Regression Use Cases' },
          ],
        },
      ],

      '/Week 2/': [
        {
          text: 'Week 2 — Deep Learning in a Nutshell',
          items: [
            { text: '01 · Neural Networks Simplified', link: '/Week 2/01 - Neural Networks Simplified' },
            { text: '02 · What are CNNs', link: '/Week 2/02 - What are CNNs' },
            { text: '03 · Neural Network Deep Dive', link: '/Week 2/03 - Neural Network Deep Dive' },
            { text: '04 · Forward Pass and Backpropagation', link: '/Week 2/04 - Forward Pass and Backpropagation' },
            { text: '05 · Gen AI and LLM Basics', link: '/Week 2/05 - Gen AI and LLM Basics' },
          ],
        },
      ],

      '/Week 3/': [
        {
          text: 'Week 3 — NLP Basics and Transformers',
          items: [
            { text: '01 · What is NLP and Why it Powers Agents', link: '/Week 3/01 - What is NLP and Why it Powers Agents' },
            { text: '02 · Embeddings Explained Visually', link: '/Week 3/02 - Embeddings Explained Visually' },
            { text: '03 · Encoder vs Decoder Models', link: '/Week 3/03 - Encoder vs Decoder Models' },
            { text: '04 · Transformers Simplified', link: '/Week 3/04 - Transformers Simplified' },
          ],
        },
      ],

      '/Week 4/': [
        {
          text: 'Week 4 — Gen AI & Prompt Engineering',
          items: [
            { text: '01 · LLMs vs SLMs', link: '/Week 4/01 - LLMs vs SLMs' },
            { text: '02 · APIs vs Open Source', link: '/Week 4/02 - APIs vs Open Source' },
            { text: '03 · RAGs', link: '/Week 4/03 - RAGs' },
            { text: '04 · Fine Tuning in LLMs', link: '/Week 4/04 - Fine Tuning in LLMs' },
            { text: '05 · Prompt Engineering Basics', link: '/Week 4/05 - Prompt Engineering Basics' },
            { text: '06 · One-shot and Few-shot Prompting Techniques', link: '/Week 4/06 - One-shot and Few-shot Prompting Techniques' },
            { text: '07 · Prompt Testing Workflows', link: '/Week 4/07 - Prompt Testing Workflows' },
          ],
        },
      ],

      '/Week 5/': [
        {
          text: 'Week 5 — Agentic AI Fundamentals',
          items: [
            { text: '01 · AI Agent vs Workflow Automation', link: '/Week 5/01 - AI Agent vs Workflow Automation' },
            { text: '02 · Tools, Memory and Reasoning Loops', link: '/Week 5/02 - Tools Memory and Reasoning Loops' },
            { text: '03 · ReAct Concept (No-code Perspective)', link: '/Week 5/03 - ReAct Concept No-code Perspective' },
            { text: '04 · Single-agent vs Multi-agent Systems', link: '/Week 5/04 - Single-agent vs Multi-agent Systems' },
            { text: '05 · Planning vs Execution Logic', link: '/Week 5/05 - Planning vs Execution Logic' },
          ],
        },
      ],

      '/Week 6/': [
        {
          text: 'Week 6 — No-Code Automation with n8n',
          items: [
            { text: '01 · n8n Interface, Nodes, Triggers, Workflows', link: '/Week 6/01 - n8n Interface Nodes Triggers Workflows' },
            { text: '02 · API Integrations (No Coding)', link: '/Week 6/02 - API Integrations No Coding' },
            { text: '03 · Webhooks and Data Pipelines', link: '/Week 6/03 - Webhooks and Data Pipelines' },
            { text: '04 · Connecting LLMs inside n8n', link: '/Week 6/04 - Connecting LLMs inside n8n' },
          ],
        },
      ],

      '/Week 7/': [
        {
          text: 'Week 7 — Real Agentic Workflows',
          items: [
            { text: '01 · Creating AI Assistants in n8n', link: '/Week 7/01 - Creating AI Assistants in n8n' },
            { text: '02 · Tool Calling and Automation Flows', link: '/Week 7/02 - Tool Calling and Automation Flows' },
            { text: '03 · RAG in Automation Systems', link: '/Week 7/03 - RAG in Automation Systems' },
            { text: '04 · Integrating Google Sheets, Slack, Email', link: '/Week 7/04 - Integrating Google Sheets Slack Email' },
            { text: '05 · Chunking and Document Ingestion Workflows', link: '/Week 7/05 - Chunking and Document Ingestion Workflows' },
            { text: '06 · Error Handling and Workflow Logic', link: '/Week 7/06 - Error Handling and Workflow Logic' },
          ],
        },
      ],

      '/Week 8/': [
        {
          text: 'Week 8 — Production & Interview Prep',
          items: [
            { text: '01 · Multi-step Agent Workflows', link: '/Week 8/01 - Multi-step Agent Workflows' },
            { text: '02 · RAG in Production', link: '/Week 8/02 - RAG in Production' },
            { text: '03 · Security and API Key Management', link: '/Week 8/03 - Security and API Key Management' },
            { text: '04 · Self-hosted vs Cloud n8n Overview', link: '/Week 8/04 - Self-hosted vs Cloud n8n Overview' },
            { text: '05 · Logging and Monitoring Workflows', link: '/Week 8/05 - Logging and Monitoring Workflows' },
            { text: '06 · Resume Preparation', link: '/Week 8/06 - Resume Preparation' },
            { text: '07 · Interview Preparation', link: '/Week 8/07 - Interview Preparation' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/owenbcoding/Ai-Agentic-Apps' },
    ],

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    footer: {
      message: 'Notes from an 8-week Agentic AI Applications study path.',
      copyright: 'Built with VitePress',
    },

    editLink: {
      pattern: 'https://github.com/owenbcoding/Ai-Agentic-Apps/edit/master/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
