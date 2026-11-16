import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Send,
  Star,
} from 'lucide-react';
import {
  BookedTourConfirmation,
  ChatMessage,
  PartnerTheme,
  TourPackage,
} from '../types/travel';

interface ConciergePanelProps {
  theme: PartnerTheme;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSelectTourForBooking: (tour: TourPackage) => void;
  bookedTour: BookedTourConfirmation | null;
  highlightTrigger: number;
}

const QUICK_PROMPTS = [
  'Filter under $1,500',
  'Show hiking only',
  'Show luxury',
  'Show all 3 tours',
];

function TourThumbnail({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 p-3 text-center text-slate-600">
        <Compass className="h-6 w-6 text-slate-400" aria-hidden="true" />
        <span className="mt-1.5 line-clamp-2 text-xs font-medium">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="h-full w-full object-cover"
    />
  );
}

export function ConciergePanel({
  theme,
  messages,
  onSendMessage,
  onSelectTourForBooking,
  bookedTour,
  highlightTrigger,
}: ConciergePanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const streamEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (messages.length > 1) {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (highlightTrigger > 0) {
      setIsHighlighted(true);
      inputRef.current?.focus();
      const timer = setTimeout(() => setIsHighlighted(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [highlightTrigger]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  return (
    <section
      aria-label="AI Concierge and TourRadar Results"
      className={`flex flex-col rounded-xl border bg-white transition-colors duration-200 ${
        isHighlighted ? `${theme.accentBorder} ring-2 ring-offset-1 ring-amber-400/60` : 'border-slate-200'
      }`}
    >
      {/* Concierge Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900 sm:text-lg">
            {theme.assistantName}
          </h2>
          <p className="text-xs text-slate-500">
            Connected to TourRadar MCP Server · 50,000+ multi-day tours indexed
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500">
          {theme.channelType}
        </div>
      </div>

      {/* Chat Stream */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-lg">
                  <div
                    className={`rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-white ${theme.primaryBg}`}
                  >
                    {msg.text}
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-400 tabular-nums">
                    You · {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="space-y-4">
              {/* Assistant Message Bubble */}
              <div className="max-w-3xl">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <span className={`font-semibold ${theme.primaryText}`}>
                    {theme.assistantName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{msg.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    via TourRadar MCP
                  </span>
                </div>
                <div className="rounded-xl rounded-tl-sm border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-relaxed text-slate-800">
                  {msg.text}
                </div>
              </div>

              {/* TourRadar Multi-Day Tour Cards */}
              {msg.tours && msg.tours.length > 0 && (
                <div className="space-y-3">
                  {msg.tours.map((tour) => {
                    const isThisTourBooked = bookedTour?.tour.id === tour.id;
                    const milesEquivalent = (tour.priceUsd * 100).toLocaleString();

                    return (
                      <article
                        key={tour.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Destination Image (4:3 on mobile, fixed width on desktop) */}
                          <div className="aspect-4/3 w-full shrink-0 bg-slate-100 sm:aspect-auto sm:w-52">
                            <TourThumbnail
                              src={tour.imageUrl}
                              alt={tour.imageAlt}
                              title={tour.title}
                            />
                          </div>

                          {/* Card Content */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                            <div>
                              {/* Clean unboxed metadata row (Zero-Pill Discipline) */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">
                                  {tour.operator}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 font-medium text-slate-800 tabular-nums">
                                  <Star
                                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    aria-hidden="true"
                                  />
                                  {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{tour.style}</span>
                              </div>

                              <h3 className="mt-1.5 font-display text-base font-semibold text-slate-900">
                                {tour.title}
                              </h3>

                              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                {tour.highlights.join(' · ')}
                              </p>

                              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                                  <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                  Departure: {tour.departureDate}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">
                                  |
                                </span>
                                <span>
                                  {tour.startCity} → {tour.endCity}
                                </span>
                              </div>
                            </div>

                            {/* Price & Action Footer */}
                            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                                    ${tour.priceUsd.toLocaleString()}
                                  </span>
                                  <span className="text-xs font-medium text-slate-500">
                                    USD
                                  </span>
                                </div>
                                {theme.id === 'capital-one' ? (
                                  <p className="text-[11px] font-medium text-[#004977] tabular-nums">
                                    or {milesEquivalent} Venture miles
                                  </p>
                                ) : theme.id === 'skyscanner' ? (
                                  <p className="text-[11px] text-slate-500">
                                    Operator direct · No OTA markup
                                  </p>
                                ) : (
                                  <p className="text-[11px] text-slate-500">
                                    All taxes, permits &amp; transfers included
                                  </p>
                                )}
                              </div>

                              {isThisTourBooked ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 whitespace-nowrap">
                                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                  Booked ({bookedTour.bookingReference})
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onSelectTourForBooking(tour)}
                                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 whitespace-nowrap sm:text-sm ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.ringFocus}`}
                                >
                                  <span>Instant Book via TourRadar</span>
                                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Empty Filter Result Recovery */}
              {msg.isEmptyFilterResult && (
                <div>
                  <button
                    type="button"
                    onClick={() => onSendMessage('Show all 3 tours')}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${theme.accentBorder} ${theme.accentSurface} ${theme.accentText}`}
                  >
                    Show all 3 tours
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={streamEndRef} />
      </div>

      {/* Chat Filter Input Bar */}
      <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
        {/* Quick Filter Buttons */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500">Try asking:</span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSendMessage(prompt)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <label htmlFor="concierge-chat-input" className="sr-only">
            Filter or ask {theme.assistantName}
          </label>
          <input
            ref={inputRef}
            id="concierge-chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Filter results (e.g. "Filter under $1,500" or "Show hiking only")...'
            className={`h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus-visible:ring-2 ${theme.ringFocus}`}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus-visible:ring-2 ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.ringFocus} whitespace-nowrap`}
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
