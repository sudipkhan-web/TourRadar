import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  PlaneLanding,
  PlaneTakeoff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INITIAL_FLIGHTS } from '../data/travelData';
import { BookedTourConfirmation, PartnerTheme } from '../types/travel';

interface ItineraryPanelProps {
  theme: PartnerTheme;
  bookedTour: BookedTourConfirmation | null;
  onAskAiFillGap: () => void;
  onResetBooking: () => void;
}

export function ItineraryPanel({
  theme,
  bookedTour,
  onAskAiFillGap,
  onResetBooking,
}: ItineraryPanelProps) {
  const { outbound, inbound } = INITIAL_FLIGHTS;

  return (
    <section
      aria-label="User Itinerary"
      className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      {/* Trip Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Synced from Inbox</span>
            <span aria-hidden="true">·</span>
            <span>1 Adult Traveler</span>
          </div>
          <span className="tabular-nums text-xs font-medium text-slate-500">
            May 10 – May 18, 2027
          </span>
        </div>

        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-slate-900">
          Peru Adventure — May 2027
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Lima (LIM) arrival to Cusco (CUZ) departure · 8 nights total
        </p>
      </div>

      {/* Itinerary Timeline */}
      <div className="mt-5 flex flex-col gap-4">
        {/* Segment 1: Confirmed Outbound Flight */}
        <article className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
                <PlaneLanding className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 tabular-nums">
                    {outbound.date}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{outbound.airline}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px]">{outbound.confirmationCode}</span>
                </div>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                  Flight {outbound.flightNumber} — {outbound.originCity} ({outbound.originCode}) to{' '}
                  {outbound.destinationCity} ({outbound.destinationCode})
                </h3>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Confirmed
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-2.5 text-xs text-slate-600 tabular-nums">
            <span>
              Departs {outbound.originCode} {outbound.departureTime}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>
              Arrives {outbound.destinationCode} {outbound.arrivalTime}
            </span>
          </div>
        </article>

        {/* Segment 2: Unbooked Gap Alert OR Confirmed Multi-Day Tour */}
        {!bookedTour ? (
          <div
            role="region"
            aria-label="Unbooked itinerary gap alert"
            className="rounded-lg border border-amber-300 bg-amber-50/90 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-white text-amber-600">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-amber-950">
                  ⚠️ 6-Day Unbooked Gap Detected (May 11 – May 17): Lima to Cusco
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900/85">
                  No hotels, regional flights, Machu Picchu permits, or ground transfers are booked
                  between your arrival in Lima and departure from Cusco.
                </p>

                <button
                  type="button"
                  onClick={onAskAiFillGap}
                  className={`mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.ringFocus} sm:text-sm`}
                >
                  <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Ask AI to Fill Gap with Multi-Day Tour</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            role="region"
            aria-label="Confirmed Multi-Day Tour"
            className="rounded-lg border border-emerald-300 bg-emerald-50/80 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-white text-emerald-700">
                  <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-emerald-800">
                    <span className="font-semibold">Confirmed Multi-Day Tour</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] font-medium">
                      {bookedTour.bookingReference}
                    </span>
                  </div>
                  <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                    {bookedTour.tour.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-700">
                    Operated by {bookedTour.tour.operator} · Booked via TourRadar MCP
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-emerald-200/80 pt-3 text-xs text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  May 11 – May 17, 2027 (6 Days)
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {bookedTour.totalChargedLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  Lima (LIM) → Sacred Valley → Cusco (CUZ)
                </span>
                <span className="text-slate-600">{bookedTour.paymentMethodSummary}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-emerald-200/80 pt-2.5">
              <span className="text-xs font-medium text-emerald-800">
                Gap resolved · Transfers & permits included
              </span>
              <button
                type="button"
                onClick={onResetBooking}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset Demo
              </button>
            </div>
          </div>
        )}

        {/* Segment 3: Confirmed Return Flight */}
        <article className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
                <PlaneTakeoff className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 tabular-nums">
                    {inbound.date}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{inbound.airline}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px]">{inbound.confirmationCode}</span>
                </div>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                  Flight {inbound.flightNumber} — {inbound.originCity} ({inbound.originCode}) to{' '}
                  {inbound.destinationCity} ({inbound.destinationCode})
                </h3>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Confirmed
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-2.5 text-xs text-slate-600 tabular-nums">
            <span>
              Departs {inbound.originCode} {inbound.departureTime}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>
              Arrives {inbound.destinationCode} {inbound.arrivalTime}
            </span>
          </div>
        </article>
      </div>

      {/* Concise Itinerary Footer Summary */}
      <div className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Itinerary Completeness</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {bookedTour ? '100% Booked (Flights + 6-Day Tour)' : '2 of 3 Segments Confirmed'}
          </span>
        </div>
      </div>
    </section>
  );
}
