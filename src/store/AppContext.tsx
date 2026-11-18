import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { SEED_AGENTS } from '../data/agents';
import { SARA_QUIZ_PRESET } from '../data/copy';
import { SEED_LISTINGS } from '../data/listings';
import {
  BASE_AGENT_SAVES,
  BASE_AGENT_VIEWING_REQUESTS,
  INITIAL_PREFERENCE_VECTOR,
  INITIAL_QUIZ,
  SEED_AGENT_SESSION,
  SEED_CHATS,
  SEED_MATCHED_BUYERS,
  SEED_VIEWING_REQUESTS,
} from '../data/seed';
import {
  getLearningInsightToast,
  rankListings,
  updatePreferenceVector,
} from '../services/matchingService';
import {
  Agent,
  AgentRating,
  AgentSession,
  ChatMessage,
  ConsentSettings,
  FeedImportSummary,
  Listing,
  ListingReport,
  MatchedBuyer,
  MatchResult,
  PreferenceVector,
  QuizAnswers,
  SwipeRecord,
  ToastMessage,
  ViewingRequest,
  ViewingStatus,
} from '../types';

const STORAGE_KEY = 'ifinder_prototype_state_v1';

interface AppState {
  demoMode: boolean;
  consent: ConsentSettings;
  quizCompleted: boolean;
  quiz: QuizAnswers;
  preferenceVector: PreferenceVector;
  swipes: SwipeRecord[];
  savedIds: string[];
  listings: Listing[];
  agents: Agent[];
  viewingRequests: ViewingRequest[];
  chats: ChatMessage[];
  ratings: AgentRating[];
  reports: ListingReport[];
  agentSession: AgentSession;
  matchedBuyers: MatchedBuyer[];
  feedImports: FeedImportSummary[];
  toasts: ToastMessage[];
  // Tracks whether buyer swiped all 20 and wants to review skipped cards
  reviewingSkipped: boolean;
}

function getInitialState(): AppState {
  const defaultState: AppState = {
    demoMode: true,
    consent: {
      accepted: false,
      personalisedMatching: true,
      shareWithRequestedAgents: true,
      productUpdates: false,
    },
    quizCompleted: false,
    quiz: INITIAL_QUIZ,
    preferenceVector: INITIAL_PREFERENCE_VECTOR,
    swipes: [],
    savedIds: [],
    listings: SEED_LISTINGS,
    agents: SEED_AGENTS,
    viewingRequests: SEED_VIEWING_REQUESTS,
    chats: SEED_CHATS,
    ratings: [],
    reports: [],
    agentSession: SEED_AGENT_SESSION,
    matchedBuyers: SEED_MATCHED_BUYERS,
    feedImports: [],
    toasts: [],
    reviewingSkipped: false,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      toasts: [],
    };
  } catch {
    return defaultState;
  }
}

type Action =
  | { type: 'SET_DEMO_MODE'; value: boolean }
  | { type: 'ACCEPT_CONSENT'; consent: ConsentSettings }
  | { type: 'UPDATE_CONSENT'; consent: Partial<ConsentSettings> }
  | { type: 'SET_QUIZ'; quiz: QuizAnswers; completed?: boolean }
  | { type: 'SKIP_AS_SARA' }
  | { type: 'SWIPE'; listing: Listing; direction: 'left' | 'right' }
  | { type: 'UNDO_SWIPE' }
  | { type: 'REMOVE_SAVED'; listingId: string }
  | { type: 'REVIEW_SKIPPED' }
  | { type: 'RETAKE_QUIZ' }
  | { type: 'ADD_VIEWING_REQUEST'; request: ViewingRequest }
  | {
      type: 'UPDATE_VIEWING_STATUS';
      id: string;
      status: ViewingStatus;
      suggestedSlot?: string;
    }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'ADD_RATING'; rating: AgentRating }
  | { type: 'ADD_REPORT'; report: ListingReport }
  | { type: 'SET_AGENT_SESSION'; session: Partial<AgentSession> }
  | { type: 'SIGN_OUT_AGENT' }
  | { type: 'ADD_LISTING'; listing: Listing }
  | { type: 'ADD_FEED_IMPORT'; summary: FeedImportSummary; listings: Listing[] }
  | { type: 'PUSH_TOAST'; toast: ToastMessage }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'RESET_DEMO' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.value };

    case 'ACCEPT_CONSENT':
      return { ...state, consent: action.consent };

    case 'UPDATE_CONSENT':
      return {
        ...state,
        consent: { ...state.consent, ...action.consent },
      };

    case 'SET_QUIZ':
      return {
        ...state,
        quiz: action.quiz,
        quizCompleted: action.completed ?? state.quizCompleted,
      };

    case 'SKIP_AS_SARA':
      return {
        ...state,
        consent: {
          accepted: true,
          personalisedMatching: true,
          shareWithRequestedAgents: true,
          productUpdates: false,
          acceptedAt: new Date().toISOString(),
        },
        quiz: SARA_QUIZ_PRESET,
        quizCompleted: true,
        reviewingSkipped: false,
      };

    case 'SWIPE': {
      const alreadySwiped = state.swipes.some(
        (s) => s.listingId === action.listing.id
      );
      const nextSwipes = alreadySwiped
        ? state.swipes.map((s) =>
            s.listingId === action.listing.id
              ? {
                  listingId: action.listing.id,
                  direction: action.direction,
                  timestamp: new Date().toISOString(),
                }
              : s
          )
        : [
            ...state.swipes,
            {
              listingId: action.listing.id,
              direction: action.direction,
              timestamp: new Date().toISOString(),
            },
          ];

      const nextSavedIds =
        action.direction === 'right'
          ? state.savedIds.includes(action.listing.id)
            ? state.savedIds
            : [...state.savedIds, action.listing.id]
          : state.savedIds.filter((id) => id !== action.listing.id);

      const nextVector = updatePreferenceVector(
        state.preferenceVector,
        action.listing,
        action.direction
      );

      // Update Sara's buyer card in agent portal
      const updatedBuyers = state.matchedBuyers.map((b) =>
        b.id === 'buyer-sara'
          ? {
              ...b,
              savedListingIds:
                nextSavedIds.length > 0 ? nextSavedIds : b.savedListingIds,
            }
          : b
      );

      return {
        ...state,
        swipes: nextSwipes,
        savedIds: nextSavedIds,
        preferenceVector: nextVector,
        matchedBuyers: updatedBuyers,
      };
    }

    case 'UNDO_SWIPE': {
      if (state.swipes.length === 0) return state;
      const last = state.swipes[state.swipes.length - 1];
      const nextSwipes = state.swipes.slice(0, -1);
      const nextSavedIds =
        last.direction === 'right'
          ? state.savedIds.filter((id) => id !== last.listingId)
          : state.savedIds;

      return {
        ...state,
        swipes: nextSwipes,
        savedIds: nextSavedIds,
      };
    }

    case 'REMOVE_SAVED':
      return {
        ...state,
        savedIds: state.savedIds.filter((id) => id !== action.listingId),
      };

    case 'REVIEW_SKIPPED': {
      // Remove left-swipes from swipes array so skipped cards return to the deck
      const rightSwipes = state.swipes.filter((s) => s.direction === 'right');
      return {
        ...state,
        swipes: rightSwipes,
        reviewingSkipped: true,
      };
    }

    case 'RETAKE_QUIZ':
      return {
        ...state,
        quizCompleted: false,
        swipes: [],
        reviewingSkipped: false,
      };

    case 'ADD_VIEWING_REQUEST':
      return {
        ...state,
        viewingRequests: [action.request, ...state.viewingRequests],
      };

    case 'UPDATE_VIEWING_STATUS':
      return {
        ...state,
        viewingRequests: state.viewingRequests.map((vr) =>
          vr.id === action.id
            ? {
                ...vr,
                status: action.status,
                suggestedSlot: action.suggestedSlot ?? vr.suggestedSlot,
              }
            : vr
        ),
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chats: [...state.chats, action.message],
      };

    case 'ADD_RATING':
      return {
        ...state,
        ratings: [...state.ratings, action.rating],
        viewingRequests: state.viewingRequests.map((vr) =>
          vr.id === action.rating.viewingId
            ? { ...vr, status: 'Completed' }
            : vr
        ),
      };

    case 'ADD_REPORT':
      return {
        ...state,
        reports: [...state.reports, action.report],
      };

    case 'SET_AGENT_SESSION':
      return {
        ...state,
        agentSession: { ...state.agentSession, ...action.session },
      };

    case 'SIGN_OUT_AGENT':
      return {
        ...state,
        agentSession: { ...state.agentSession, signedIn: false },
      };

    case 'ADD_LISTING':
      return {
        ...state,
        listings: [action.listing, ...state.listings],
      };

    case 'ADD_FEED_IMPORT':
      return {
        ...state,
        feedImports: [action.summary, ...state.feedImports],
        listings: [...action.listings, ...state.listings],
      };

    case 'PUSH_TOAST':
      return {
        ...state,
        toasts: [...state.toasts.slice(-2), action.toast],
      };

    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    case 'RESET_DEMO': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        demoMode: true,
        consent: {
          accepted: false,
          personalisedMatching: true,
          shareWithRequestedAgents: true,
          productUpdates: false,
        },
        quizCompleted: false,
        quiz: INITIAL_QUIZ,
        preferenceVector: INITIAL_PREFERENCE_VECTOR,
        swipes: [],
        savedIds: [],
        listings: SEED_LISTINGS,
        agents: SEED_AGENTS,
        viewingRequests: SEED_VIEWING_REQUESTS,
        chats: SEED_CHATS,
        ratings: [],
        reports: [],
        agentSession: SEED_AGENT_SESSION,
        matchedBuyers: SEED_MATCHED_BUYERS,
        feedImports: [],
        toasts: [
          {
            id: `toast-reset-${Date.now()}`,
            title: 'Demo reset',
            description: 'Quiz, swipes, viewings, and portal counters restored.',
            variant: 'success',
          },
        ],
        reviewingSkipped: false,
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  rankedMatches: MatchResult[];
  remainingDeck: MatchResult[];
  savedMatches: MatchResult[];
  agentDashboardStats: {
    newRequestsCount: number;
    weeklySavesCount: number;
  };
  pushToast: (
    title: string,
    description?: string,
    variant?: ToastMessage['variant']
  ) => void;
  dismissToast: (id: string) => void;
  setDemoMode: (value: boolean) => void;
  acceptConsent: (consent: ConsentSettings) => void;
  updateConsent: (consent: Partial<ConsentSettings>) => void;
  setQuiz: (quiz: QuizAnswers, completed?: boolean) => void;
  skipAsSara: () => void;
  recordSwipe: (listing: Listing, direction: 'left' | 'right') => void;
  undoLastSwipe: () => void;
  removeSaved: (listingId: string) => void;
  reviewSkipped: () => void;
  retakeQuiz: () => void;
  addViewingRequest: (request: ViewingRequest) => void;
  updateViewingStatus: (
    id: string,
    status: ViewingStatus,
    suggestedSlot?: string
  ) => void;
  addChatMessage: (message: ChatMessage) => void;
  submitRating: (rating: AgentRating) => void;
  submitReport: (report: ListingReport) => void;
  updateAgentSession: (session: Partial<AgentSession>) => void;
  signOutAgent: () => void;
  addListing: (listing: Listing) => void;
  addFeedImport: (summary: FeedImportSummary, listings: Listing[]) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist to localStorage (excluding ephemeral toasts)
  useEffect(() => {
    try {
      const { toasts: _ignored, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Listen for cross-tab storage updates
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        // Reload page state naturally on external tab changes if needed
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pushToast = useCallback(
    (
      title: string,
      description?: string,
      variant: ToastMessage['variant'] = 'default'
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      dispatch({
        type: 'PUSH_TOAST',
        toast: { id, title, description, variant },
      });
      window.setTimeout(() => {
        dispatch({ type: 'DISMISS_TOAST', id });
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  const rankedMatches = useMemo(() => {
    return rankListings(state.listings, state.quiz, state.preferenceVector);
  }, [state.listings, state.quiz, state.preferenceVector]);

  const swipedSet = useMemo(
    () => new Set(state.swipes.map((s) => s.listingId)),
    [state.swipes]
  );

  const remainingDeck = useMemo(
    () => rankedMatches.filter((m) => !swipedSet.has(m.listing.id)),
    [rankedMatches, swipedSet]
  );

  const savedMatches = useMemo(() => {
    const savedSet = new Set(state.savedIds);
    return rankedMatches.filter((m) => savedSet.has(m.listing.id));
  }, [rankedMatches, state.savedIds]);

  const agentDashboardStats = useMemo(() => {
    const activeAgentId = state.agentSession.agentId || 'agent-1';
    const liveRequestsForAgent = state.viewingRequests.filter(
      (vr) => vr.agentId === activeAgentId && !vr.id.startsWith('vr-seed-')
    ).length;

    const agentListingIds = new Set(
      state.listings
        .filter((l) => l.agentId === activeAgentId)
        .map((l) => l.id)
    );
    const liveSavesForAgent = state.savedIds.filter((id) =>
      agentListingIds.has(id)
    ).length;

    return {
      newRequestsCount: BASE_AGENT_VIEWING_REQUESTS + liveRequestsForAgent,
      weeklySavesCount: BASE_AGENT_SAVES + liveSavesForAgent,
    };
  }, [
    state.agentSession.agentId,
    state.viewingRequests,
    state.listings,
    state.savedIds,
  ]);

  const recordSwipe = useCallback(
    (listing: Listing, direction: 'left' | 'right') => {
      const nextCount = state.swipes.length + 1;
      dispatch({ type: 'SWIPE', listing, direction });

      if (nextCount === 3 || nextCount === 8 || nextCount === 14) {
        const nextVec = updatePreferenceVector(
          state.preferenceVector,
          listing,
          direction
        );
        const msg = getLearningInsightToast(nextVec);
        if (msg) {
          pushToast(msg, 'Remaining homes re-ranked to match your taste.', 'default');
        }
      }
    },
    [state.swipes.length, state.preferenceVector, pushToast]
  );

  const value: AppContextValue = {
    state,
    rankedMatches,
    remainingDeck,
    savedMatches,
    agentDashboardStats,
    pushToast,
    dismissToast,
    setDemoMode: (v) => dispatch({ type: 'SET_DEMO_MODE', value: v }),
    acceptConsent: (c) => dispatch({ type: 'ACCEPT_CONSENT', consent: c }),
    updateConsent: (c) => dispatch({ type: 'UPDATE_CONSENT', consent: c }),
    setQuiz: (quiz, completed) =>
      dispatch({ type: 'SET_QUIZ', quiz, completed }),
    skipAsSara: () => {
      dispatch({ type: 'SKIP_AS_SARA' });
      pushToast('Loaded Sara’s profile', '29 · Renting 1-bed in JLT · AED 1M–2M', 'success');
    },
    recordSwipe,
    undoLastSwipe: () => dispatch({ type: 'UNDO_SWIPE' }),
    removeSaved: (id) => dispatch({ type: 'REMOVE_SAVED', listingId: id }),
    reviewSkipped: () => dispatch({ type: 'REVIEW_SKIPPED' }),
    retakeQuiz: () => dispatch({ type: 'RETAKE_QUIZ' }),
    addViewingRequest: (request) =>
      dispatch({ type: 'ADD_VIEWING_REQUEST', request }),
    updateViewingStatus: (id, status, suggestedSlot) =>
      dispatch({ type: 'UPDATE_VIEWING_STATUS', id, status, suggestedSlot }),
    addChatMessage: (message) =>
      dispatch({ type: 'ADD_CHAT_MESSAGE', message }),
    submitRating: (rating) => dispatch({ type: 'ADD_RATING', rating }),
    submitReport: (report) => dispatch({ type: 'ADD_REPORT', report }),
    updateAgentSession: (session) =>
      dispatch({ type: 'SET_AGENT_SESSION', session }),
    signOutAgent: () => dispatch({ type: 'SIGN_OUT_AGENT' }),
    addListing: (listing) => dispatch({ type: 'ADD_LISTING', listing }),
    addFeedImport: (summary, listings) =>
      dispatch({ type: 'ADD_FEED_IMPORT', summary, listings }),
    resetDemo: () => dispatch({ type: 'RESET_DEMO' }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppStore must be used inside AppProvider');
  }
  return ctx;
}
