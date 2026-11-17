/**
 * A genuine client for TourRadar's real, public MCP server.
 *
 * TourRadar publishes a live, no-auth MCP endpoint at https://ai.tourradar.com/mcp/main
 * (see https://www.tourradar.com/mlp/tourradar-mcp) exposing real tour search,
 * itinerary/destination Q&A, live departures and pricing. This module makes a
 * genuine MCP handshake (initialize -> tools/list -> tools/call) against that
 * server at runtime, in the browser.
 *
 * IMPORTANT, HONEST SCOPE NOTE:
 * - SEARCH is wired to attempt a real live call, because it's read-only and
 *   safe to actually invoke against TourRadar's production server.
 * - BOOKING is deliberately NOT wired to the real server. TourRadar's own
 *   docs describe their booking capability as "start a booking from within
 *   the conversation; the user completes and pays on TourRadar's site" --
 *   i.e. even a "real" call wouldn't produce a complete, paid booking inside
 *   this app, and actually invoking it would create a real booking attempt
 *   against TourRadar's live system. That stays a clearly-labeled simulation.
 *
 * Every call here is wrapped so that ANY failure -- CORS rejection, network
 * error, protocol mismatch, an unexpected response shape -- falls back to the
 * existing simulated data path. The caller always gets back a `source` field
 * ('live' | 'simulated') so the UI never has to guess, or imply, which one
 * actually happened.
 */

import { TourPackage } from '../types/travel';

export const TOURRADAR_MCP_ENDPOINT = 'https://ai.tourradar.com/mcp/main';

export interface LiveSearchResult {
  source: 'live';
  toolName: string;
  rawRequest: unknown;
  rawResponse: unknown;
  /**
   * 'tours': the response contained structured, tour-shaped objects we could
   * map into the app's tour cards.
   * 'text': the response was genuinely live but came back as free-form text
   * (common for MCP tools, which typically answer conversationally rather
   * than with a fixed JSON schema) -- still a real round-trip, just shown
   * as the assistant's reply text instead of tour cards.
   */
  kind: 'tours' | 'text';
  tours: TourPackage[];
  text?: string;
}

export interface FallbackResult {
  source: 'simulated';
  reason: string;
}

type JsonRpcId = number;

let nextId: JsonRpcId = 1;

async function postJsonRpc(method: string, params: unknown): Promise<unknown> {
  const id = nextId++;
  const res = await fetch(TOURRADAR_MCP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // MCP's Streamable HTTP transport can reply as a single JSON object or
      // as an SSE stream; accept either.
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });

  if (!res.ok) {
    throw new Error(`TourRadar MCP HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  const raw = await res.text();

  if (contentType.includes('text/event-stream')) {
    // Streamable HTTP: parse SSE "data: {...}" lines, take the last valid JSON-RPC message.
    const dataLines = raw
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);
    for (let i = dataLines.length - 1; i >= 0; i -= 1) {
      try {
        return JSON.parse(dataLines[i]);
      } catch {
        // try the previous data line
      }
    }
    throw new Error('No parseable SSE data frame from TourRadar MCP');
  }

  return JSON.parse(raw);
}

interface McpTool {
  name: string;
  description?: string;
  inputSchema?: { properties?: Record<string, unknown> };
}

async function discoverSearchTool(): Promise<McpTool> {
  // Per the MCP spec a client should initialize before calling tools/list.
  await postJsonRpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'vayo-trip-manager-demo', version: '0.1.0' },
  });

  const listResp = (await postJsonRpc('tools/list', {})) as {
    result?: { tools?: McpTool[] };
    error?: { message?: string };
  };

  if (listResp.error) {
    throw new Error(listResp.error.message ?? 'tools/list error');
  }

  const tools = listResp.result?.tools ?? [];
  const searchable = tools.filter((t) => /search|find|discover|list/i.test(t.name));

  if (searchable.length === 0) {
    const names = tools.map((t) => t.name).join(', ') || '(no tools returned)';
    throw new Error(`No search-like tool found in TourRadar MCP tools/list. Tools seen: ${names}`);
  }

  // Prefer tools that sound like they return actual tours/itineraries over
  // pure reference/taxonomy lookups (cities, countries, currencies, etc.).
  const score = (t: McpTool) => {
    const haystack = `${t.name} ${t.description ?? ''}`;
    let s = 0;
    if (/tour|itinerary|trip|adventure|departure/i.test(haystack)) s += 2;
    if (/cit(y|ies)|countr(y|ies)|currency|language/i.test(haystack)) s -= 1;
    return s;
  };

  const best = [...searchable].sort((a, b) => score(b) - score(a))[0];
  return best;
}

interface JsonSchemaProp {
  type?: string;
  enum?: string[];
  items?: { enum?: string[]; type?: string };
}

/**
 * Schema-aware mapping of our known filter concepts onto whatever input
 * schema the live tool actually declares. Learned from a real validation
 * error returned by TourRadar's own server (MCP error -32602) against the
 * `b2b-cities-search` tool: a `search` property that wants an array of
 * keywords (not a sentence), and a required `country_code` property that
 * must be one of a fixed list of ISO alpha-2 codes, also as an array.
 * This demo's whole scenario is a Lima-to-Cusco (Peru) itinerary, so "PE"
 * is a genuinely correct value here, not a guess.
 */
function buildSearchArguments(tool: McpTool, query: string): Record<string, unknown> {
  const props = (tool.inputSchema?.properties ?? {}) as Record<string, JsonSchemaProp>;
  const args: Record<string, unknown> = {};

  for (const [key, schema] of Object.entries(props)) {
    const isArrayType = schema.type === 'array';
    const enumValues = schema.enum ?? schema.items?.enum;

    if (/country/i.test(key) && enumValues) {
      if (enumValues.includes('PE')) {
        args[key] = isArrayType ? ['PE'] : 'PE';
      }
      continue;
    }

    if (/search|query|keyword|text/i.test(key)) {
      if (isArrayType) {
        const terms = query.toLowerCase().match(/[a-z]+/g) ?? [query];
        args[key] = terms;
      } else {
        args[key] = query;
      }
    }
  }

  return args;
}

/** Pull out any MCP text-content blocks (the common shape: {content: [{type: 'text', text: '...'}]}). */
function extractTextBlocks(value: unknown): string[] {
  const texts: string[] = [];
  if (value && typeof value === 'object' && 'content' in (value as Record<string, unknown>)) {
    const content = (value as Record<string, unknown>).content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (
          block &&
          typeof block === 'object' &&
          (block as Record<string, unknown>).type === 'text' &&
          typeof (block as Record<string, unknown>).text === 'string'
        ) {
          texts.push((block as Record<string, unknown>).text as string);
        }
      }
    }
  }
  return texts;
}

/** Walk an arbitrary JSON value looking for an array of tour-shaped objects. */
function extractToursFromResponse(value: unknown): Partial<TourPackage>[] {
  const candidates: Partial<TourPackage>[] = [];

  const looksLikeTour = (obj: unknown): obj is Record<string, unknown> =>
    typeof obj === 'object' &&
    obj !== null &&
    ('title' in obj || 'name' in obj) &&
    ('price' in obj || 'priceUsd' in obj || 'price_usd' in obj);

  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach((item) => {
        if (looksLikeTour(item)) {
          candidates.push(item as Partial<TourPackage>);
        } else {
          walk(item);
        }
      });
    } else if (typeof node === 'object' && node !== null) {
      Object.values(node).forEach(walk);
    }
  };

  walk(value);
  return candidates;
}

function normalizeTour(raw: Record<string, unknown>, idx: number): TourPackage {
  const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
  const num = (v: unknown, fallback: number) => (typeof v === 'number' ? v : fallback);

  return {
    id: str(raw.id, `live-tour-${idx}`),
    tourCode: str(raw.tourCode ?? raw.tour_code, `LIVE-${idx}`),
    title: str(raw.title ?? raw.name, 'TourRadar itinerary'),
    operator: str(raw.operator ?? raw.supplier, 'TourRadar operator'),
    rating: num(raw.rating, 4.5),
    reviewCount: num(raw.reviewCount ?? raw.review_count, 0),
    style: 'Cultural & Classic',
    priceUsd: num(raw.priceUsd ?? raw.price_usd ?? raw.price, 0),
    durationDays: num(raw.durationDays ?? raw.duration_days ?? raw.duration, 0),
    departureDate: str(raw.departureDate ?? raw.departure_date, ''),
    departureStatus: str(raw.departureStatus, 'Live from TourRadar MCP'),
    startCity: str(raw.startCity ?? raw.start_city, ''),
    endCity: str(raw.endCity ?? raw.end_city, ''),
    imageUrl: str(raw.imageUrl ?? raw.image_url, ''),
    imageAlt: str(raw.imageAlt, str(raw.title ?? raw.name, 'Tour')),
    highlights: Array.isArray(raw.highlights) ? (raw.highlights as string[]) : [],
    inclusionsSummary: str(raw.inclusionsSummary, ''),
    groupSizeMax: num(raw.groupSizeMax, 0),
  };
}

/**
 * Attempts a genuine live search against TourRadar's real MCP server.
 * Resolves to a LiveSearchResult on success, or throws -- callers should
 * catch and fall back to the simulated path.
 */
export async function liveSearchTours(query: string): Promise<LiveSearchResult> {
  const tool = await discoverSearchTool();
  const args = buildSearchArguments(tool, query);

  const rawRequest = { name: tool.name, arguments: args };
  const callResp = (await postJsonRpc('tools/call', rawRequest)) as {
    result?: unknown;
    error?: { message?: string };
  };

  if (callResp.error) {
    throw new Error(callResp.error.message ?? 'tools/call error');
  }

  const result = callResp.result;

  // 1. Look for structured tour-shaped objects directly in the result.
  let candidates = extractToursFromResponse(result);

  // 2. MCP tools conventionally answer with text-content blocks. If the result
  // itself wasn't structured, check whether any text block is itself a JSON
  // string containing tour-shaped data.
  const textBlocks = extractTextBlocks(result);
  if (candidates.length === 0) {
    for (const block of textBlocks) {
      try {
        candidates = extractToursFromResponse(JSON.parse(block));
      } catch {
        // Not JSON -- plain conversational text, handled below.
      }
      if (candidates.length > 0) break;
    }
  }

  if (candidates.length > 0) {
    const tours = candidates.slice(0, 6).map((c, i) => normalizeTour(c, i));
    return { source: 'live', kind: 'tours', toolName: tool.name, rawRequest, rawResponse: result, tours };
  }

  // 3. No structured data, but a genuine free-form text answer from
  // TourRadar's real server is still a real live result -- just shown as
  // the assistant's reply text instead of tour cards.
  const joinedText = textBlocks.join('\n\n').trim();
  if (joinedText.length > 0) {
    return { source: 'live', kind: 'text', toolName: tool.name, rawRequest, rawResponse: result, tours: [], text: joinedText };
  }

  const preview = JSON.stringify(result).slice(0, 300);
  throw new Error(`Live TourRadar MCP call returned no recognizable content. Raw result preview: ${preview}`);
}
