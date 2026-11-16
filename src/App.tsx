import { useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { ConciergePanel } from './components/ConciergePanel';
import { ItineraryPanel } from './components/ItineraryPanel';
import { McpInspectorDrawer } from './components/McpInspectorDrawer';
import { TopNavBar } from './components/TopNavBar';
import {
  evaluateChatFilter,
  INITIAL_MCP_STATE,
  INITIAL_PROACTIVE_MESSAGE,
  PARTNER_THEMES,
  TOURRADAR_TOURS,
} from './data/travelData';
import {
  BookedTourConfirmation,
  ChatMessage,
  McpToolCallState,
  PartnerId,
  TourPackage,
} from './types/travel';

export default function App() {
  const [partnerId, setPartnerId] = useState<PartnerId>('vayo');
  const [showInspector, setShowInspector] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_PROACTIVE_MESSAGE]);
  const [mcpState, setMcpState] = useState<McpToolCallState>(INITIAL_MCP_STATE);
  const [selectedTourForModal, setSelectedTourForModal] = useState<TourPackage | null>(null);
  const [bookedTour, setBookedTour] = useState<BookedTourConfirmation | null>(null);
  const [highlightTrigger, setHighlightTrigger] = useState(0);

  const theme = PARTNER_THEMES[partnerId];

  const handleAskAiFillGap = () => {
    setHighlightTrigger((prev) => prev + 1);
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.id === INITIAL_PROACTIVE_MESSAGE.id) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `msg-gap-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: 'Here are all 3 guaranteed 6-day TourRadar itineraries departing Lima on May 11 and ending in Cusco on May 17 to bridge your flight gap:',
          tours: TOURRADAR_TOURS,
        },
      ];
    });
    setMcpState(INITIAL_MCP_STATE);
  };

  const handleSendMessage = (userText: string) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: nowTime,
    };

    const { replyText, filteredTours, mcpArgs } = evaluateChatFilter(userText);

    const assistantMsg: ChatMessage = {
      id: `msg-ai-${Date.now() + 1}`,
      sender: 'assistant',
      text: replyText,
      timestamp: nowTime,
      tours: filteredTours.length > 0 ? filteredTours : undefined,
      isEmptyFilterResult: filteredTours.length === 0,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setMcpState({
      method: 'tools/call',
      toolName: 'tourradar.search_tours',
      arguments: mcpArgs,
      responseSummary: {
        status: '200 OK',
        latencyMs: 142,
        resultsCount: filteredTours.length,
        merchantOfRecord: 'TourRadar GmbH',
      },
    });
  };

  const handleConfirmBooking = (confirmation: BookedTourConfirmation) => {
    setBookedTour(confirmation);
    setSelectedTourForModal(null);

    const confirmMsg: ChatMessage = {
      id: `msg-booked-${Date.now()}`,
      sender: 'assistant',
      timestamp: confirmation.bookedAt,
      text: `Booking confirmed! Reference ${confirmation.bookingReference} is now synced to your "Peru Adventure — May 2027" itinerary. ${confirmation.tour.operator} has locked in your May 11 Lima-to-Cusco departure (${confirmation.totalChargedLabel} via ${confirmation.paymentMethodSummary}).`,
    };

    setMessages((prev) => [...prev, confirmMsg]);
    setMcpState({
      method: 'tools/call',
      toolName: 'tourradar.create_booking',
      arguments: {
        tour_code: confirmation.tour.tourCode,
        departure_date: '2027-05-11',
        traveler_name: confirmation.travelerName,
        traveler_email: confirmation.travelerEmail,
        partner_channel: theme.id,
        payment_method: confirmation.paymentMethodSummary,
        amount_usd: confirmation.tour.priceUsd,
      },
      responseSummary: {
        status: '201 CREATED',
        latencyMs: 268,
        bookingReference: confirmation.bookingReference,
        merchantOfRecord: 'TourRadar GmbH',
      },
    });
  };

  const handleResetBooking = () => {
    setBookedTour(null);
    setMessages([INITIAL_PROACTIVE_MESSAGE]);
    setMcpState(INITIAL_MCP_STATE);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNavBar
        partnerId={partnerId}
        onPartnerChange={setPartnerId}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector((prev) => !prev)}
        theme={theme}
      />

      <main
        className={`mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 ${
          showInspector ? 'pb-80' : 'pb-10'
        }`}
      >
        {/* Split-Screen Layout: Left 40% (2/5) / Right 60% (3/5) */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ItineraryPanel
              theme={theme}
              bookedTour={bookedTour}
              onAskAiFillGap={handleAskAiFillGap}
              onResetBooking={handleResetBooking}
            />
          </div>

          <div className="lg:col-span-3">
            <ConciergePanel
              theme={theme}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSelectTourForBooking={setSelectedTourForModal}
              bookedTour={bookedTour}
              highlightTrigger={highlightTrigger}
            />
          </div>
        </div>
      </main>

      <BookingModal
        tour={selectedTourForModal}
        theme={theme}
        onClose={() => setSelectedTourForModal(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      <McpInspectorDrawer
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        mcpState={mcpState}
        theme={theme}
        bookedTour={bookedTour}
      />
    </div>
  );
}
