# Vayo AI Trip Manager — Powered by TourRadar MCP

An interview-prep prototype built with AI Studio and Claude Code to explore what "agentic commerce" actually requires operationally for a multi-day-tour marketplace like TourRadar.

## What it demonstrates

A traveler has a 6-day gap between a Lima arrival and a Cusco departure. An AI concierge queries TourRadar's MCP server for guaranteed-departure multi-day tours, lets the traveler filter by price/style/operator in natural language, and books instantly — all shown as real MCP `tools/call` JSON-RPC requests, inspectable live in the app.

The same flow is reskinned across three distribution channels, each modeling a different partnership archetype:

| Channel | Archetype | What it models |
|---|---|---|
| **Vayo AI** | Autonomous AI travel agent ("the Vayo Play") | A consumer AI assistant booking directly, TourRadar as merchant of record |
| **Capital One Travel** | Bank loyalty / financial ecosystem partner | Miles redemption vs. card payment, points-earn framing |
| **Mastercard Agent Pay** | Agent-initiated, tokenized payment rail | A Verifiable Intent token with a scoped, single-use, per-transaction consent step (Strong Customer Authentication) before the agent can charge — modeled on the PSD2 consent/tokenization pattern that replaced bank screen-scraping |

Toggle **"Show MCP / API Inspector"** in the header to see, per channel:
- The raw MCP JSON-RPC tool-call payload (including the payment-authorization block for Mastercard Agent Pay bookings)
- Partner commercial unit economics: average order value, estimated partner revenue share, merchant-of-record settlement, and the active payment-authorization rail

## What this is — and isn't

This is a **scripted simulation**, not a live LLM integration. The concierge's responses come from keyword-based filtering (`src/data/travelData.ts`), not a model call — despite the `@google/genai` dependency carried over from the AI Studio scaffold, nothing in this code actually calls Gemini. The MCP tool calls, booking confirmations, and payment-authorization tokens are all realistic mock data, not live API responses against TourRadar's real server.

What it's useful for: a concrete, inspectable model of how three different partnership structures (consumer AI agent, bank loyalty, tokenized agent payments) could plug into the same MCP-based discovery-and-booking flow, and what each implies for settlement, consent, and revenue share.

## Running it

```bash
npm install --legacy-peer-deps
npm run dev
```

Opens on `http://localhost:3000`.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS. No backend — all data and MCP responses are mocked client-side in `src/data/travelData.ts`.
