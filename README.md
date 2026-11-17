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

**Search now attempts a genuine live call to TourRadar's real, public MCP server** at `https://ai.tourradar.com/mcp/main` (no auth required — see [TourRadar's own MCP docs](https://www.tourradar.com/mlp/tourradar-mcp)). `src/lib/tourradarMcp.ts` does a real MCP handshake — `initialize` → `tools/list` → `tools/call` — directly from the browser, and maps whatever comes back into the app's tour cards.

That live attempt can fail for reasons outside this app's control (CORS, network restrictions, a response shape this code didn't anticipate). **Every failure falls back automatically to the scripted simulation**, and the MCP Inspector always shows which one actually happened — a green "● LIVE" badge for a genuine round-trip to TourRadar's server, or an amber "○ SIMULATED" badge (with the specific fallback reason) otherwise. This was built and tested in a sandboxed environment that cannot reach `ai.tourradar.com` at all, so the fallback path is confirmed working; the live-success path is written to TourRadar's own published protocol but needs a real network to confirm.

**Booking stays a deliberate simulation, by design, not as a fallback.** TourRadar's own docs describe their booking capability as starting a request that the traveler completes and pays for on tourradar.com — so even a "real" call wouldn't produce a complete booking inside this app, and actually invoking it would attempt a real action against TourRadar's live system, which isn't appropriate for a demo. The payment-authorization tokens, consent flow, and booking confirmations are realistic mock data. The concierge's chat replies also still come from keyword-based filtering (`src/data/travelData.ts`), not a model call — despite the `@google/genai` dependency carried over from the AI Studio scaffold, nothing here actually calls Gemini.

What it's useful for: a concrete, inspectable model of how three different partnership structures (consumer AI agent, bank loyalty, tokenized agent payments) could plug into the same MCP-based discovery-and-booking flow — now partly backed by a real MCP round-trip for search — and what each implies for settlement, consent, and revenue share.

## Running it

```bash
npm install --legacy-peer-deps
npm run dev
```

Opens on `http://localhost:3000`.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS. No backend — all data and MCP responses are mocked client-side in `src/data/travelData.ts`.
