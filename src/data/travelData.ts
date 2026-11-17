import {
  ChatMessage,
  FlightSegment,
  McpToolCallState,
  PartnerId,
  PartnerTheme,
  TourPackage,
} from '../types/travel';

export const PARTNER_THEMES: Record<PartnerId, PartnerTheme> = {
  vayo: {
    id: 'vayo',
    label: 'Vayo AI (Consumer Travel Agent)',
    shortName: 'Vayo AI',
    assistantName: 'Vayo AI Concierge',
    channelType: 'Consumer AI Assistant',
    primaryBg: 'bg-teal-700',
    primaryHoverBg: 'hover:bg-teal-800',
    primaryText: 'text-teal-700',
    accentSurface: 'bg-teal-50',
    accentBorder: 'border-teal-200',
    accentText: 'text-teal-800',
    ringFocus: 'focus-visible:ring-teal-600',
    checkoutTitle: 'Vayo Express Checkout',
    paymentBadgeText: 'Apple Pay · Visa •••• 4829',
  },
  'capital-one': {
    id: 'capital-one',
    label: 'Capital One Travel (Bank Loyalty Portal)',
    shortName: 'Capital One Travel',
    assistantName: 'Capital One Travel Concierge',
    channelType: 'Bank Loyalty Portal',
    primaryBg: 'bg-[#004977]',
    primaryHoverBg: 'hover:bg-[#003659]',
    primaryText: 'text-[#004977]',
    accentSurface: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText: 'text-[#004977]',
    ringFocus: 'focus-visible:ring-[#004977]',
    checkoutTitle: 'Capital One Venture Rewards Checkout',
    paymentBadgeText: 'Venture X Miles · 245,000 pts available',
  },
  'mastercard-agentpay': {
    id: 'mastercard-agentpay',
    label: 'Mastercard Agent Pay (Tokenized Agent Payments)',
    shortName: 'Mastercard Agent Pay',
    assistantName: 'Agent Pay Travel Concierge',
    channelType: 'Agent-Initiated Payment Rail',
    primaryBg: 'bg-[#EB5A2E]',
    primaryHoverBg: 'hover:bg-[#D14A20]',
    primaryText: 'text-[#D14A20]',
    accentSurface: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-[#D14A20]',
    ringFocus: 'focus-visible:ring-[#D14A20]',
    checkoutTitle: 'Mastercard Agent Pay — Verifiable Intent Authorization',
    paymentBadgeText: 'Tokenized Mandate · No card number shared with merchant',
  },
};

export const INITIAL_FLIGHTS: {
  outbound: FlightSegment;
  inbound: FlightSegment;
} = {
  outbound: {
    id: 'flt-outbound',
    date: 'May 10, 2027',
    flightNumber: 'LA2461',
    airline: 'LATAM Airlines',
    originCity: 'Miami',
    originCode: 'MIA',
    destinationCity: 'Lima',
    destinationCode: 'LIM',
    departureTime: '08:15',
    arrivalTime: '14:40',
    status: 'Confirmed',
    confirmationCode: 'LATM-9K42',
  },
  inbound: {
    id: 'flt-inbound',
    date: 'May 18, 2027',
    flightNumber: 'LA2042',
    airline: 'LATAM Airlines',
    originCity: 'Cusco',
    originCode: 'CUZ',
    destinationCity: 'Miami',
    destinationCode: 'MIA',
    departureTime: '11:20',
    arrivalTime: '19:55',
    status: 'Confirmed',
    confirmationCode: 'LATM-9K42',
  },
};

export const TOURRADAR_TOURS: TourPackage[] = [
  {
    id: 'tr-intrepid-inca-express',
    tourCode: 'TR-INT-2705',
    title: 'Sacred Valley & Inca Trail Express (6 Days)',
    operator: 'Intrepid Travel',
    rating: 4.8,
    reviewCount: 312,
    style: 'Hiking & Trekking',
    priceUsd: 1490,
    durationDays: 6,
    departureDate: 'May 11 guaranteed',
    departureStatus: 'Guaranteed Departure',
    startCity: 'Lima (LIM)',
    endCity: 'Cusco (CUZ)',
    imageUrl: '/src/assets/images/peru_inca_trail_1794846340731.jpg',
    imageAlt: 'Hikers walking along the stone Inca Trail overlooking Machu Picchu at sunrise',
    highlights: ['Sacred Valley', '2-Day Inca Trail Trek', 'Machu Picchu Sunrise', 'Cusco'],
    inclusionsSummary: 'Inca Trail permit, domestic LIM–CUZ transfer, boutique hotels, 5 breakfasts & trek meals',
    groupSizeMax: 12,
  },
  {
    id: 'tr-gadv-peru-highlights',
    tourCode: 'TR-GADV-5410',
    title: 'Highlights of Peru: Lima to Cusco (6 Days)',
    operator: 'G Adventures',
    rating: 4.9,
    reviewCount: 540,
    style: 'Cultural & Classic',
    priceUsd: 1250,
    durationDays: 6,
    departureDate: 'May 11 guaranteed',
    departureStatus: 'Guaranteed Departure',
    startCity: 'Lima (LIM)',
    endCity: 'Cusco (CUZ)',
    imageUrl: '/src/assets/images/peru_cusco_highlights_1794846340502.jpg',
    imageAlt: 'Historic colonial cobblestone street in Cusco Peru with Andean mountains behind',
    highlights: ['Lima Historic Quarter', 'Ollantaytambo', 'Vistadome Train', 'Machu Picchu'],
    inclusionsSummary: 'Regional flight LIM–CUZ, Vistadome panoramic train, Machu Picchu entry & local CEO guide',
    groupSizeMax: 16,
  },
  {
    id: 'tr-trafalgar-luxury-andes',
    tourCode: 'TR-TRAF-8812',
    title: 'Luxury Andes & Machu Picchu Explorer (6 Days)',
    operator: 'Trafalgar',
    rating: 4.7,
    reviewCount: 185,
    style: 'Comfort & Luxury',
    priceUsd: 2380,
    durationDays: 6,
    departureDate: 'May 11 guaranteed',
    departureStatus: 'Guaranteed Departure',
    startCity: 'Lima (LIM)',
    endCity: 'Cusco (CUZ)',
    imageUrl: '/src/assets/images/peru_luxury_andes_1794846338534.jpg',
    imageAlt: 'Panoramic glass-roofed luxury train winding through the Sacred Valley toward Machu Picchu',
    highlights: ['5-Star Sanctuary Lodge', 'Panoramic First-Class Rail', 'Private Archaeologist'],
    inclusionsSummary: 'Business-class domestic flight, 5-star hotels, private transfers & curated Andean dining',
    groupSizeMax: 14,
  },
];

export const INITIAL_PROACTIVE_MESSAGE: ChatMessage = {
  id: 'msg-initial',
  sender: 'assistant',
  timestamp: '08:25 AM',
  text: "I noticed you fly into Lima on May 10 and depart from Cusco on May 18, leaving 6 open days. Instead of piecing together regional flights, buses, and guides yourself, I queried TourRadar's 50,000+ multi-day adventures via MCP. Here are 3 seamless Lima-to-Cusco itineraries that fit your exact dates:",
  tours: TOURRADAR_TOURS,
};

export const INITIAL_MCP_STATE: McpToolCallState = {
  method: 'tools/call',
  toolName: 'tourradar.search_tours',
  arguments: {
    start_city: 'LIM',
    end_city: 'CUZ',
    duration_days: 6,
    start_date: '2027-05-11',
    guaranteed_departure: true,
    currency: 'USD',
  },
  responseSummary: {
    status: '200 OK',
    latencyMs: 184,
    resultsCount: 3,
    merchantOfRecord: 'TourRadar GmbH',
  },
  source: 'simulated',
};

export function evaluateChatFilter(rawQuery: string): {
  replyText: string;
  filteredTours: TourPackage[];
  mcpArgs: Record<string, unknown>;
} {
  const q = rawQuery.trim().toLowerCase();

  // Reset / show all
  if (
    q.includes('all') ||
    q.includes('reset') ||
    q.includes('everything') ||
    q.includes('clear')
  ) {
    return {
      replyText:
        'Showing all 3 guaranteed 6-day Lima-to-Cusco itineraries departing May 11, 2027 via TourRadar MCP:',
      filteredTours: TOURRADAR_TOURS,
      mcpArgs: {
        start_city: 'LIM',
        end_city: 'CUZ',
        duration_days: 6,
        start_date: '2027-05-11',
        guaranteed_departure: true,
        currency: 'USD',
      },
    };
  }

  // Price filter detection (e.g., "under $1,500", "below 1400", "< 1500")
  const priceMatch = q.match(/(?:under|below|less than|max|<|cheaper than)\s*\$?\s*([\d,]+)/);
  let maxPrice: number | null = null;
  if (priceMatch && priceMatch[1]) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  } else if (q.includes('budget') || q.includes('cheapest') || q.includes('affordable')) {
    maxPrice = 1350;
  }

  // Style filter detection
  let styleFilter: TourPackage['style'] | null = null;
  if (q.includes('hik') || q.includes('trek') || q.includes('inca trail') || q.includes('active')) {
    styleFilter = 'Hiking & Trekking';
  } else if (q.includes('cultur') || q.includes('classic') || q.includes('g adventures')) {
    styleFilter = 'Cultural & Classic';
  } else if (q.includes('lux') || q.includes('comfort') || q.includes('5-star') || q.includes('trafalgar')) {
    styleFilter = 'Comfort & Luxury';
  }

  // Operator filter detection
  let operatorFilter: string | null = null;
  if (q.includes('intrepid')) operatorFilter = 'Intrepid Travel';
  if (q.includes('g adventures')) operatorFilter = 'G Adventures';
  if (q.includes('trafalgar')) operatorFilter = 'Trafalgar';

  if (maxPrice !== null || styleFilter !== null || operatorFilter !== null) {
    const matches = TOURRADAR_TOURS.filter((tour) => {
      if (maxPrice !== null && tour.priceUsd > maxPrice) return false;
      if (styleFilter !== null && tour.style !== styleFilter) return false;
      if (operatorFilter !== null && tour.operator !== operatorFilter) return false;
      return true;
    });

    const mcpArgs: Record<string, unknown> = {
      start_city: 'LIM',
      end_city: 'CUZ',
      duration_days: 6,
      start_date: '2027-05-11',
      guaranteed_departure: true,
      currency: 'USD',
      ...(maxPrice !== null ? { max_price_usd: maxPrice } : {}),
      ...(styleFilter !== null ? { travel_style: styleFilter } : {}),
      ...(operatorFilter !== null ? { operator: operatorFilter } : {}),
    };

    if (matches.length === 0) {
      return {
        replyText:
          'I re-queried TourRadar MCP with those constraints, and no guaranteed 6-day May 11 departures matched all criteria. Try increasing your budget or viewing all 3 tours:',
        filteredTours: [],
        mcpArgs,
      };
    }

    const filterParts: string[] = [];
    if (maxPrice !== null) filterParts.push(`under $${maxPrice.toLocaleString()} USD`);
    if (styleFilter !== null) filterParts.push(`${styleFilter} style`);
    if (operatorFilter !== null) filterParts.push(`operated by ${operatorFilter}`);

    return {
      replyText: `Filtered TourRadar MCP results for ${filterParts.join(' and ')} (${matches.length} ${
        matches.length === 1 ? 'itinerary' : 'itineraries'
      } departing May 11):`,
      filteredTours: matches,
      mcpArgs,
    };
  }

  // Informational travel question handling (transfers, flights, inclusions, rating)
  if (q.includes('flight') || q.includes('transfer') || q.includes('lima') || q.includes('cusco')) {
    return {
      replyText:
        'All 3 TourRadar packages include the Lima-to-Cusco regional transfer or domestic flight, airport pickup aligned with LATAM LA2461 on May 10, and drop-off in Cusco ahead of your May 18 LA2042 return flight.',
      filteredTours: TOURRADAR_TOURS,
      mcpArgs: INITIAL_MCP_STATE.arguments,
    };
  }

  if (q.includes('best') || q.includes('top') || q.includes('rat')) {
    const sorted = [...TOURRADAR_TOURS].sort((a, b) => b.rating - a.rating);
    return {
      replyText:
        'Ranked by verified TourRadar traveler reviews — Highlights of Peru (4.9★ across 540 reviews) leads for value and cultural depth:',
      filteredTours: sorted,
      mcpArgs: {
        ...INITIAL_MCP_STATE.arguments,
        sort_by: 'rating_desc',
      },
    };
  }

  return {
    replyText:
      'I queried TourRadar MCP for your May 11–17 Lima-to-Cusco window. You can filter by price (e.g. "Filter under $1,500"), style ("Show hiking only", "Show luxury"), or select any itinerary below to book instantly:',
    filteredTours: TOURRADAR_TOURS,
    mcpArgs: INITIAL_MCP_STATE.arguments,
  };
}
