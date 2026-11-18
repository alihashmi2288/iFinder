export type NearbyAmenity = 'Metro' | 'School' | 'Mosque';

export type PropertyType = 'Apartment' | 'Studio' | 'Townhouse' | 'Villa';

export type BudgetBand = 'under_1m' | '1m_to_2m' | 'over_2m';

export type QuizGoal = 'live' | 'invest' | 'both';

export type TimelineOption = 'within_3m' | '3_to_12m' | 'exploring';

export interface Listing {
  id: string;
  title: string;
  area: string;
  priceAED: number;
  sizeSqft: number;
  beds: number;
  baths: number;
  roiPercent: number;
  commuteMinutes: number;
  nearby: NearbyAmenity[];
  propertyType: PropertyType;
  furnished: boolean;
  yearBuilt: number;
  description: string;
  highlights: string[];
  agentId: string;
  verified: boolean;
  permitNo: string;
  photoSeed: string;
  photoUrl: string;
  galleryUrls: string[];
  listedDaysAgo: number;
  isCustom?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  reraBrn: string;
  initials: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  languages: string[];
  verified: boolean;
}

export interface QuizAnswers {
  goal: QuizGoal | null;
  budgetBand: BudgetBand | null;
  mustBeNear: NearbyAmenity[];
  preferredAreas: string[];
  openToAnywhere: boolean;
  maxCommute: number | null;
  bedrooms: number[] | null; // 0 = Studio, 1, 2, 3 (3+)
  familyWithKids: boolean | null;
  timeline: TimelineOption | null;
}

export interface ConsentSettings {
  accepted: boolean;
  personalisedMatching: boolean;
  shareWithRequestedAgents: boolean;
  productUpdates: boolean;
  acceptedAt?: string;
}

export interface PreferenceVector {
  areaBias: Record<string, number>;
  bedBias: Record<number, number>;
  priceBandBias: Record<BudgetBand, number>;
  amenityBias: Record<NearbyAmenity, number>;
  roiWeight: number;
  commuteWeight: number;
  totalSwipes: number;
}

export interface SwipeRecord {
  listingId: string;
  direction: 'left' | 'right';
  timestamp: string;
}

export type ViewingStatus = 'Requested' | 'Confirmed' | 'Declined' | 'Rescheduled' | 'Completed';

export interface ViewingRequest {
  id: string;
  listingId: string;
  agentId: string;
  buyerName: string;
  buyerMatchPercent: number;
  slotLabel: string;
  slotIsoStart: string;
  status: ViewingStatus;
  suggestedSlot?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  listingId: string;
  agentId: string;
  sender: 'buyer' | 'agent';
  text: string;
  timestamp: string;
}

export interface AgentRating {
  viewingId: string;
  agentId: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface ListingReport {
  id: string;
  listingId: string;
  reason: string;
  details?: string;
  createdAt: string;
}

export interface AgentSession {
  signedIn: boolean;
  agentId: string;
  name: string;
  agency: string;
  email: string;
  phone: string;
  reraBrn: string;
  tradeLicenceFile: string;
  notifyNewRequests: boolean;
  notifyBuyerSaves: boolean;
  notifyWeeklyDigest: boolean;
}

export interface MatchedBuyer {
  id: string;
  firstName: string;
  age: number;
  currentArea: string;
  budgetLabel: string;
  goalLabel: string;
  preferredAreas: string[];
  matchPercent: number;
  savedListingIds: string[];
}

export interface MatchResult {
  listing: Listing;
  score: number;
  reasons: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'danger';
}

export interface FeedImportSummary {
  source: string;
  importedCount: number;
  pendingPermitCount: number;
  timestamp: string;
}
