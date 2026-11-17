import { useState } from 'react';
import { Check, Copy, DollarSign, ShieldCheck, Terminal, X } from 'lucide-react';
import { BookedTourConfirmation, McpToolCallState, PartnerTheme } from '../types/travel';

interface McpInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mcpState: McpToolCallState;
  theme: PartnerTheme;
  bookedTour: BookedTourConfirmation | null;
}

export function McpInspectorDrawer({
  isOpen,
  onClose,
  mcpState,
  theme,
  bookedTour,
}: McpInspectorDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonRpcPayload = {
    jsonrpc: '2.0',
    id: bookedTour ? 'req_tr_book_02' : 'req_tr_search_01',
    method: mcpState.method,
    params: {
      name: mcpState.toolName,
      arguments: mcpState.arguments,
      partner_context: {
        partner_id: theme.id,
        channel: theme.channelType,
      },
      ...(bookedTour?.agentPaymentAuthorization
        ? {
            payment_authorization: {
              protocol: bookedTour.agentPaymentAuthorization.protocol,
              verifiable_intent_token: bookedTour.agentPaymentAuthorization.verifiableIntentToken,
              consent_scope: bookedTour.agentPaymentAuthorization.consentScope,
              sca_method: bookedTour.agentPaymentAuthorization.scaMethod,
            },
          }
        : {}),
    },
    _meta: {
      response_status: mcpState.responseSummary.status,
      latency_ms: mcpState.responseSummary.latencyMs,
      ...(mcpState.responseSummary.resultsCount !== undefined
        ? { results_returned: mcpState.responseSummary.resultsCount }
        : {}),
      ...(mcpState.responseSummary.bookingReference
        ? { booking_reference: mcpState.responseSummary.bookingReference }
        : {}),
    },
  };

  const formattedJson = JSON.stringify(jsonRpcPayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
  };

  const activeOrderValue = bookedTour ? bookedTour.tour.priceUsd : 1706;
  const activePartnerShare = (activeOrderValue * 0.12).toFixed(2);

  return (
    <aside
      aria-label="Developer and Commercial MCP Inspector"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950 text-slate-100 shadow-2xl"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <h2 className="font-display text-sm font-semibold tracking-wide text-slate-100">
              MCP &amp; Commercial Unit Economics Inspector
            </h2>
            <span className="hidden text-xs text-slate-400 sm:inline">
              · Active Tool: <code className="font-mono text-emerald-300">{mcpState.toolName}</code>
            </span>
            {mcpState.source === 'live' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                ● LIVE &mdash; real ai.tourradar.com/mcp/main response
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300"
                title={mcpState.fallbackReason}
              >
                ○ SIMULATED{mcpState.fallbackReason ? ' (fallback)' : ''}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close MCP Inspector"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Drawer Body: Two Columns */}
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left 7 cols: JSON-RPC / MCP Tool Call Payload */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-xs font-medium text-slate-300">
                JSON-RPC / MCP Tool Call Payload
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded-lg border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs leading-relaxed text-emerald-300">
              <code>{formattedJson}</code>
            </pre>
          </div>

          {/* Right 5 cols: Commercial Unit Economics Summary Box */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-100">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    Partner Commercial Unit Economics
                  </h3>
                  <span className="text-[11px] text-slate-400">{theme.shortName}</span>
                </div>

                <dl className="mt-3 divide-y divide-slate-800 text-xs">
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-400">Average Order Value (AOV)</dt>
                    <dd className="font-mono font-semibold text-white tabular-nums">
                      $1,706
                      {bookedTour ? (
                        <span className="ml-1.5 text-[11px] font-normal text-emerald-400">
                          (Booked: ${bookedTour.tour.priceUsd.toLocaleString()})
                        </span>
                      ) : null}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <dt className="text-slate-400">Partner Revenue Share (Est. 12%)</dt>
                    <dd className="font-mono font-semibold text-emerald-400 tabular-nums">
                      $204.72 per booking
                      {bookedTour ? (
                        <span className="ml-1.5 text-[11px] font-normal text-emerald-300">
                          (Earned: ${activePartnerShare})
                        </span>
                      ) : null}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2">
                    <dt className="text-slate-400">Merchant of Record &amp; Operator Settlement</dt>
                    <dd className="text-right font-medium text-slate-200">
                      Handled 100% by TourRadar
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2">
                    <dt className="text-slate-400">Payment Authorization Rail</dt>
                    <dd className="text-right font-medium text-slate-200">
                      {bookedTour?.agentPaymentAuthorization
                        ? `${bookedTour.agentPaymentAuthorization.protocol} · tokenized`
                        : theme.id === 'mastercard-agentpay'
                          ? 'Mastercard Agent Pay · tokenized, per-transaction consent'
                          : 'Stored credential / loyalty balance'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-2 flex items-center gap-2 border-t border-slate-800 pt-2.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  Zero inventory liability · PCI-DSS &amp; multi-operator settlement abstracted by
                  TourRadar MCP
                </span>
              </div>

              {mcpState.fallbackReason ? (
                <div className="mt-2 rounded-md border border-amber-900/50 bg-amber-950/30 p-2 text-[11px] text-amber-200">
                  Fell back to simulated data: {mcpState.fallbackReason}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
