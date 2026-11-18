import {
  AgentSession,
  ChatMessage,
  MatchedBuyer,
  PreferenceVector,
  QuizAnswers,
  ViewingRequest,
} from '../types';

export const INITIAL_QUIZ: QuizAnswers = {
  goal: null,
  budgetBand: null,
  mustBeNear: [],
  preferredAreas: [],
  openToAnywhere: false,
  maxCommute: 25,
  bedrooms: null,
  familyWithKids: null,
  timeline: null,
};

export const INITIAL_PREFERENCE_VECTOR: PreferenceVector = {
  areaBias: {},
  bedBias: {},
  priceBandBias: {
    under_1m: 0,
    '1m_to_2m': 0,
    over_2m: 0,
  },
  amenityBias: {
    Metro: 0,
    School: 0,
    Mosque: 0,
  },
  roiWeight: 0,
  commuteWeight: 0,
  totalSwipes: 0,
};

export const SEED_VIEWING_REQUESTS: ViewingRequest[] = [
  {
    id: 'vr-seed-1',
    listingId: '1',
    agentId: 'agent-1',
    buyerName: 'Omar K.',
    buyerMatchPercent: 94,
    slotLabel: 'Sat 10:00',
    slotIsoStart: '2026-11-21T10:00:00.000Z',
    status: 'Requested',
    createdAt: '2026-11-17T14:20:00.000Z',
  },
  {
    id: 'vr-seed-2',
    listingId: '3',
    agentId: 'agent-1',
    buyerName: 'Maya S.',
    buyerMatchPercent: 91,
    slotLabel: 'Sat 14:00',
    slotIsoStart: '2026-11-21T14:00:00.000Z',
    status: 'Requested',
    createdAt: '2026-11-17T16:10:00.000Z',
  },
  {
    id: 'vr-seed-3',
    listingId: '4',
    agentId: 'agent-1',
    buyerName: 'Daniel R.',
    buyerMatchPercent: 89,
    slotLabel: 'Sun 11:00',
    slotIsoStart: '2026-11-22T11:00:00.000Z',
    status: 'Requested',
    createdAt: '2026-11-17T18:05:00.000Z',
  },
  {
    id: 'vr-seed-4',
    listingId: '12',
    agentId: 'agent-1',
    buyerName: 'Fatima A.',
    buyerMatchPercent: 88,
    slotLabel: 'Sat 10:00',
    slotIsoStart: '2026-11-21T10:00:00.000Z',
    status: 'Confirmed',
    createdAt: '2026-11-16T11:30:00.000Z',
  },
  {
    id: 'vr-seed-5',
    listingId: '20',
    agentId: 'agent-1',
    buyerName: 'Kareem N.',
    buyerMatchPercent: 86,
    slotLabel: 'Sun 11:00',
    slotIsoStart: '2026-11-22T11:00:00.000Z',
    status: 'Requested',
    createdAt: '2026-11-17T20:15:00.000Z',
  },
];

export const SEED_MATCHED_BUYERS: MatchedBuyer[] = [
  {
    id: 'buyer-sara',
    firstName: 'Sara',
    age: 29,
    currentArea: 'Renting 1-bed in JLT',
    budgetLabel: 'AED 1M to 2M',
    goalLabel: 'Live in it & Invest',
    preferredAreas: ['JLT', 'JVC', 'Business Bay'],
    matchPercent: 95,
    savedListingIds: ['1', '3'],
  },
  {
    id: 'buyer-omar',
    firstName: 'Omar',
    age: 33,
    currentArea: 'Renting in DIFC',
    budgetLabel: 'AED 1M to 2M',
    goalLabel: 'Live in it',
    preferredAreas: ['Business Bay', 'Downtown Dubai', 'Meydan'],
    matchPercent: 94,
    savedListingIds: ['4', '20'],
  },
  {
    id: 'buyer-maya',
    firstName: 'Maya',
    age: 31,
    currentArea: 'Renting in Dubai Marina',
    budgetLabel: 'AED 1M to 2M',
    goalLabel: 'Both',
    preferredAreas: ['JLT', 'JVC'],
    matchPercent: 91,
    savedListingIds: ['3', '12'],
  },
  {
    id: 'buyer-fatima',
    firstName: 'Fatima',
    age: 35,
    currentArea: 'Renting in Al Barsha',
    budgetLabel: 'AED 1M to 2M',
    goalLabel: 'Live in it',
    preferredAreas: ['JVC', 'Dubai Creek Harbour'],
    matchPercent: 88,
    savedListingIds: ['1', '12', '16'],
  },
];

export const SEED_CHATS: ChatMessage[] = [
  {
    id: 'msg-seed-1',
    listingId: '1',
    agentId: 'agent-1',
    sender: 'agent',
    text: 'Hi! I’m Aisha from Gulf Haven Real Estate. This JVC 1-bed has a fresh DLD permit and is vacant on transfer. Happy to arrange a viewing anytime this weekend.',
    timestamp: '2026-11-17T10:15:00.000Z',
  },
];

export const SEED_AGENT_SESSION: AgentSession = {
  signedIn: false,
  agentId: 'agent-1',
  name: 'Aisha Rahman',
  agency: 'Gulf Haven Real Estate',
  email: 'aisha@gulfhaven.ae',
  phone: '+971 50 482 9104',
  reraBrn: '48291',
  tradeLicenceFile: 'Gulf_Haven_DED_Licence_2026.pdf',
  notifyNewRequests: true,
  notifyBuyerSaves: true,
  notifyWeeklyDigest: true,
};

export const WEEKLY_ACTIVITY_SERIES = [
  { day: 'Mon', saves: 5, requests: 1 },
  { day: 'Tue', saves: 6, requests: 0 },
  { day: 'Wed', saves: 7, requests: 1 },
  { day: 'Thu', saves: 8, requests: 1 },
  { day: 'Fri', saves: 6, requests: 0 },
  { day: 'Sat', saves: 9, requests: 1 },
  { day: 'Sun', saves: 7, requests: 1 },
];

export const BASE_AGENT_SAVES = 48;
export const BASE_AGENT_VIEWING_REQUESTS = 5;
