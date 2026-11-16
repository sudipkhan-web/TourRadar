import { FormEvent, useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Fingerprint,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import {
  BookedTourConfirmation,
  PartnerTheme,
  TourPackage,
} from '../types/travel';

interface BookingModalProps {
  tour: TourPackage | null;
  theme: PartnerTheme;
  onClose: () => void;
  onConfirmBooking: (confirmation: BookedTourConfirmation) => void;
}

export function BookingModal({
  tour,
  theme,
  onClose,
  onConfirmBooking,
}: BookingModalProps) {
  const [travelerName, setTravelerName] = useState('Sudip Khan');
  const [travelerEmail, setTravelerEmail] = useState('sudip.khan@gmail.com');
  const [travelerPhone, setTravelerPhone] = useState('+1 (305) 555-0194');
  const [vayoUseCredit, setVayoUseCredit] = useState(true);
  const [capitalOneMode, setCapitalOneMode] = useState<'miles' | 'card'>('miles');
  const [scaAuthorized, setScaAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    if (tour) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tour, isSubmitting, onClose]);

  useEffect(() => {
    // Consent is per-transaction: a fresh tour (or closing/reopening the modal)
    // must not carry over a prior authorization.
    setScaAuthorized(false);
  }, [tour]);

  if (!tour) return null;

  const milesRequired = tour.priceUsd * 100;
  const vayoFinalPrice = vayoUseCredit ? Math.max(0, tour.priceUsd - 75) : tour.priceUsd;
  const isMastercardAgentPay = theme.id === 'mastercard-agentpay';
  const verifiableIntentToken = `VIT-${tour.tourCode.replace(/[^A-Z0-9]/gi, '')}-${new Date().getTime().toString().slice(-4)}`;
  const consentScope = `Single-use · Max $${tour.priceUsd.toLocaleString()} USD · Merchant category: Travel (TourRadar GmbH) · Expires in 10 min`;
  const scaMethod = 'Biometric passkey (device-bound)';

  let paymentMethodSummary = '';
  let totalChargedLabel = '';

  if (theme.id === 'capital-one') {
    if (capitalOneMode === 'miles') {
      paymentMethodSummary = 'Venture X Miles Redeemed';
      totalChargedLabel = `${milesRequired.toLocaleString()} miles ($0.00 due)`;
    } else {
      paymentMethodSummary = 'Capital One •••• 7710 (10x Miles)';
      totalChargedLabel = `$${tour.priceUsd.toLocaleString()} USD`;
    }
  } else if (isMastercardAgentPay) {
    paymentMethodSummary = `Mastercard Agent Pay · Verifiable Intent ${verifiableIntentToken}`;
    totalChargedLabel = `$${tour.priceUsd.toLocaleString()} USD`;
  } else {
    paymentMethodSummary = vayoUseCredit
      ? 'Apple Pay + $75 Vayo Credit'
      : 'Apple Pay · Visa •••• 4829';
    totalChargedLabel = `$${vayoFinalPrice.toLocaleString()} USD`;
  }

  const canSubmit = !isMastercardAgentPay || scaAuthorized;

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const refNum = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
      onConfirmBooking({
        bookingReference: refNum,
        tour,
        travelerName: travelerName.trim() || 'Sudip Khan',
        travelerEmail: travelerEmail.trim() || 'sudip.khan@gmail.com',
        paymentMethodSummary,
        totalChargedLabel,
        partnerId: theme.id,
        bookedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        ...(isMastercardAgentPay
          ? {
              agentPaymentAuthorization: {
                protocol: 'Mastercard Agent Pay',
                verifiableIntentToken,
                consentScope,
                scaMethod,
              },
            }
          : {}),
      });
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <p className={`text-xs font-semibold ${theme.primaryText}`}>
              {theme.checkoutTitle}
            </p>
            <h2
              id="booking-modal-title"
              className="mt-0.5 font-display text-lg font-semibold text-slate-900"
            >
              Instant Book via TourRadar MCP
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close booking modal"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-5 px-6 py-5">
          {/* Tour Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {tour.operator} · {tour.style}
                </p>
                <h3 className="mt-0.5 font-display text-sm font-semibold text-slate-900">
                  {tour.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  May 11 – May 17, 2027 · {tour.startCity} to {tour.endCity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-base font-bold text-slate-900 tabular-nums">
                  ${tour.priceUsd.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Guaranteed
                </p>
              </div>
            </div>
          </div>

          {/* Pre-filled Traveler Details */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <User className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                Traveler Details (Pre-filled from Itinerary)
              </h4>
              <span className="text-[11px] text-emerald-700 font-medium">
                Passport on file · Synced with LA2461
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="traveler-name"
                  className="block text-xs font-medium text-slate-600"
                >
                  Full Name (as on passport)
                </label>
                <input
                  id="traveler-name"
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="traveler-email"
                  className="block text-xs font-medium text-slate-600"
                >
                  Confirmation Email
                </label>
                <input
                  id="traveler-email"
                  type="email"
                  required
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="traveler-phone"
                  className="block text-xs font-medium text-slate-600"
                >
                  Mobile Number (for Lima Airport Pickup &amp; Guide WhatsApp)
                </label>
                <input
                  id="traveler-phone"
                  type="tel"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Partner-Adaptive Payment / Points Redemption */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              Payment &amp; Loyalty Redemption ({theme.shortName})
            </h4>

            {theme.id === 'capital-one' && (
              <div className="space-y-2.5">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    capitalOneMode === 'miles'
                      ? 'border-[#004977] bg-sky-50/70'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="c1-payment"
                      checked={capitalOneMode === 'miles'}
                      onChange={() => setCapitalOneMode('miles')}
                      className="h-4 w-4 accent-[#004977]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Redeem Venture X Miles
                      </p>
                      <p className="text-xs text-slate-600 tabular-nums">
                        Balance: 245,000 miles · Remaining after booking:{' '}
                        {(245000 - milesRequired).toLocaleString()} miles
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#004977] tabular-nums">
                    {milesRequired.toLocaleString()} pts
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    capitalOneMode === 'card'
                      ? 'border-[#004977] bg-sky-50/70'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="c1-payment"
                      checked={capitalOneMode === 'card'}
                      onChange={() => setCapitalOneMode('card')}
                      className="h-4 w-4 accent-[#004977]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Capital One Venture X •••• 7710
                      </p>
                      <p className="text-xs text-emerald-700 font-medium tabular-nums">
                        Earn 10x Miles (+{(tour.priceUsd * 10).toLocaleString()} miles) on TourRadar
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    ${tour.priceUsd.toLocaleString()}
                  </span>
                </label>
              </div>
            )}

            {isMastercardAgentPay && (
              <div className="space-y-2.5">
                <div className="rounded-lg border border-orange-200 bg-orange-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Verifiable Intent Token
                    </p>
                    <span className="font-mono text-xs font-semibold text-[#D14A20]">
                      {verifiableIntentToken}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{consentScope}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    Card number never shared with TourRadar or the operator — Mastercard settles via
                    a single-use token bound to this mandate.
                  </p>
                </div>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    scaAuthorized
                      ? 'border-[#D14A20] bg-orange-50/70'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={scaAuthorized}
                    onChange={(e) => setScaAuthorized(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#D14A20]"
                  />
                  <span className="text-xs text-slate-700">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Fingerprint className="h-3.5 w-3.5 text-[#D14A20]" aria-hidden="true" />
                      Authorize this agent-initiated payment
                    </span>
                    <span className="mt-0.5 block text-slate-600">
                      Strong Customer Authentication via {scaMethod}. Scope limited to this single
                      booking — the agent cannot reuse this mandate for another charge.
                    </span>
                  </span>
                </label>
              </div>
            )}

            {theme.id === 'vayo' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50/60 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Apple Pay · Visa •••• 4829
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Instant 1-click authorization via Vayo Wallet
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    ${vayoFinalPrice.toLocaleString()}
                  </span>
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={vayoUseCredit}
                      onChange={(e) => setVayoUseCredit(e.target.checked)}
                      className="h-4 w-4 rounded accent-teal-700"
                    />
                    <Sparkles className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                    Apply $75 Vayo Concierge Travel Credit
                  </span>
                  <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                    -$75 USD
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Total & Merchant of Record Notice */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Total Due Today</span>
              <span className="font-display text-base font-bold text-slate-900 tabular-nums">
                {totalChargedLabel}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>
                Merchant of Record: TourRadar GmbH · Instant operator confirmation with{' '}
                {tour.operator}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              title={!canSubmit ? 'Authorize the agent-initiated payment above to continue' : undefined}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.ringFocus} disabled:opacity-70`}
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Confirming via MCP...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
