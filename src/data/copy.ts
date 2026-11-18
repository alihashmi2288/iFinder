import { QuizAnswers } from '../types';

export const COPY = {
  brand: {
    name: 'iFinder',
    tagline: 'Your next right swipe starts here',
    campaignLine: 'Stop scrolling. Start swiping.',
    sampleFooter: 'Prototype with sample data. Not final design.',
  },
  buyerApp: {
    splashSubtitle: 'Dubai homes matched to your life in 60 seconds.',
    getStarted: 'Get started',
    skipAsSara: 'Skip quiz as Sara',
    consentTitle: 'Before we match you',
    consentSummary:
      'iFinder uses your quiz answers and swipe choices to rank verified Dubai properties. Your contact details are shared only with the agent you explicitly request a viewing from, in line with Dubai Land Department (DLD) rules and UAE Federal Decree-Law No. 45 on Personal Data Protection.',
    quizHeader: 'iFinder · Quiz',
    matchesHeader: 'iFinder · Matches',
    viewingHeader: 'iFinder · Viewing',
    sampleListing: 'Sample listing',
    swipeHint: 'Swipe left or right',
  },
  agentPortal: {
    portalTitle: 'iFinder agent portal (web)',
    dashboardFootnote:
      'Upload listings or connect a feed · RERA number verified at sign-up · sample figures',
    planHeadline: 'Free for 3 months',
    planSubline: 'then AED 349 a month',
    foundingHeadline: 'First 100 agents pay AED 299 a month',
    foundingSpotsLeft: 37,
  },
  website: {
    heroHeadline: 'Stop scrolling. Start swiping.',
    heroSub:
      'Answer a 60-second quiz. Swipe homes matched to your life. Meet a verified agent.',
    faq: [
      {
        q: 'Is iFinder free for home buyers?',
        a: 'Yes. iFinder is 100% free for buyers and investors—from taking the lifestyle quiz and swiping matched homes to chatting and booking viewings with verified agents.',
      },
      {
        q: 'How are listings and agents verified?',
        a: 'Every agent submits a valid 5-digit RERA Broker Registration Number (BRN) and brokerage trade licence at sign-up. Each property requires a matching DLD permit number before receiving the green Verified badge. Listings awaiting checks appear clearly as Verification pending.',
      },
      {
        q: 'How does the AI property matching work?',
        a: 'Your 60-second quiz scores every home across budget fit, preferred neighbourhoods, commute time, nearby Metro/schools/mosques, bedrooms, and rental ROI. As you swipe left or right, iFinder updates your preference profile and re-ranks remaining cards in real time.',
      },
      {
        q: 'Who sees my contact details and swipe data?',
        a: 'Only you—until you request a viewing or start a chat. Your request goes exclusively to the single verified agent representing that home, never sold to rival brokerages or call centres.',
      },
      {
        q: 'Do I buy the property directly through iFinder?',
        a: 'No. iFinder connects you cleanly to the verified listing agent. The viewing, offer, and DLD transfer happen directly with the licensed brokerage, and we can connect you with a vetted UAE mortgage advisor if needed.',
      },
      {
        q: 'How do Dubai agents join and connect listings?',
        a: 'Agents register in under three minutes with their RERA BRN and trade licence, then either add individual listings with DLD permits or connect a Property Finder XML, Bayut feed, or CSV export.',
      },
      {
        q: 'What does iFinder cost for agents?',
        a: 'Every verified agent gets 3 months free, then AED 349/month. Our first 100 founding agents lock in AED 299/month—with no per-lead auction fees and leads routed exclusively to the listing agent.',
      },
    ],
  },
};

export const SARA_QUIZ_PRESET: QuizAnswers = {
  goal: 'both',
  budgetBand: '1m_to_2m',
  mustBeNear: ['Metro', 'School'],
  preferredAreas: ['JLT', 'JVC', 'Business Bay'],
  openToAnywhere: false,
  maxCommute: 20,
  bedrooms: [1, 2],
  familyWithKids: false,
  timeline: '3_to_12m',
};

export const ALL_DUBAI_AREAS = [
  'JVC',
  'JLT',
  'Business Bay',
  'Dubai Marina',
  'Downtown Dubai',
  'Dubai Hills Estate',
  'Al Furjan',
  'Arjan',
  'Mirdif',
  'Town Square',
  'Dubai Creek Harbour',
  'Meydan',
  'Dubai Silicon Oasis',
  'Dubai South',
  'Dubai Sports City',
  'Al Barsha South',
  'Discovery Gardens',
  'Damac Hills 2',
  'Palm Jumeirah',
];
