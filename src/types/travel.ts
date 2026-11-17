export type PartnerId = 'vayo' | 'capital-one' | 'mastercard-agentpay';

export interface PartnerTheme {
  id: PartnerId;
  label: string;
  shortName: string;
  assistantName: string;
  channelType: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
  accentSurface: string;
  accentBorder: string;
  accentText: string;
  ringFocus: string;
  checkoutTitle: string;
  paymentBadgeText: string;
}

export interface FlightSegment {
  id: string;
  date: string;
  flightNumber: string;
  airline: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  status: 'Confirmed';
  confirmationCode: string;
}

export interface TourPackage {
  id: string;
  tourCode: string;
  title: string;
  operator: string;
  rating: number;
  reviewCount: number;
  style: 'Hiking & Trekking' | 'Cultural & Classic' | 'Comfort & Luxury';
  priceUsd: number;
  durationDays: number;
  departureDate: string;
  departureStatus: string;
  startCity: string;
  endCity: string;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
  inclusionsSummary: string;
  groupSizeMax: number;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  tours?: TourPackage[];
  isEmptyFilterResult?: boolean;
}

export interface BookedTourConfirmation {
  bookingReference: string;
  tour: TourPackage;
  travelerName: string;
  travelerEmail: string;
  paymentMethodSummary: string;
  totalChargedLabel: string;
  partnerId: PartnerId;
  bookedAt: string;
  /** Present only for agent-initiated, tokenized payment authorizations (e.g. Mastercard Agent Pay). */
  agentPaymentAuthorization?: {
    protocol: string;
    verifiableIntentToken: string;
    consentScope: string;
    scaMethod: string;
  };
}

export interface McpToolCallState {
  method: 'tools/call';
  toolName: string;
  arguments: Record<string, unknown>;
  responseSummary: {
    status: string;
    latencyMs: number;
    resultsCount?: number;
    bookingReference?: string;
    merchantOfRecord: string;
  };
  /**
   * 'live': this call actually round-tripped to TourRadar's real public MCP
   * server (https://ai.tourradar.com/mcp/main) and used its real response.
   * 'simulated': scripted/mocked data -- either by design (booking, which is
   * never fired against TourRadar's production system from this demo) or
   * because a live search attempt failed and fell back.
   */
  source: 'live' | 'simulated';
  /** Present only when source === 'simulated' because a live call failed. */
  fallbackReason?: string;
}
