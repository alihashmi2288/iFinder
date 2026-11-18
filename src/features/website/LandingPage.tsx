import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { PropertyImage } from '../../components/PropertyImage';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { COPY } from '../../data/copy';
import { SEED_LISTINGS } from '../../data/listings';
import { useAppStore } from '../../store/AppContext';
import { formatAEDCompact, formatSqft } from '../../utils/format';

export const LandingPage: React.FC = () => {
  const { pushToast } = useAppStore();
  const [heroSaved, setHeroSaved] = useState<'idle' | 'saved' | 'skipped'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    agency: '',
    email: '',
    phone: '',
  });
  const [demoErrors, setDemoErrors] = useState<Record<string, string>>({});
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const featuredListing = SEED_LISTINGS[0]; // 1-bed apartment, JVC

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!demoForm.name.trim()) errs.name = 'Enter your full name.';
    if (!demoForm.agency.trim()) errs.agency = 'Enter your brokerage name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoForm.email.trim())) {
      errs.email = 'Enter a valid work email.';
    }
    if (demoForm.phone.trim().length < 7) {
      errs.phone = 'Enter a valid UAE phone number.';
    }
    setDemoErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setDemoSubmitted(true);
    pushToast(
      'Demo request booked',
      `We’ll email ${demoForm.email} with a 10-minute walkthrough link.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-navy-900 text-paper">
      {/* Sticky Top Bar (3-zone contract) */}
      <header className="sticky top-11 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-gold-500 rounded-lg"
          >
            <Logo variant="full" theme="dark" size="sm" />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-navy"
          >
            <a
              href="#how-it-works"
              className="hover:text-paper transition-colors whitespace-nowrap shrink-0"
            >
              How it works
            </a>
            <a
              href="#why-trust"
              className="hover:text-paper transition-colors whitespace-nowrap shrink-0"
            >
              Why buyers trust it
            </a>
            <a
              href="#for-agents"
              className="hover:text-paper transition-colors whitespace-nowrap shrink-0"
            >
              For agents
            </a>
            <a
              href="#faq"
              className="hover:text-paper transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/app"
              className="inline-flex items-center justify-center rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm px-4 py-2.5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-paper"
            >
              Try the app
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-navy-700/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 space-y-6"
            >
              <Logo variant="full" theme="dark" size="lg" showTagline />

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-paper leading-[1.06] text-balance pt-2">
                {COPY.website.heroHeadline}
              </h1>

              <p className="text-lg sm:text-xl text-muted-navy max-w-xl leading-relaxed">
                {COPY.website.heroSub}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-base px-6 py-3.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-paper"
                >
                  <span>Try the app</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
                <Link
                  to="/agent"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-paper font-semibold text-base px-6 py-3.5 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-gold-500"
                >
                  <span>For agents</span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-navy">
                <span>100% free for Dubai buyers</span>
                <span aria-hidden="true">·</span>
                <span>RERA licence + DLD permit checked</span>
                <span aria-hidden="true">·</span>
                <span>Direct to matched agent</span>
              </div>
            </motion.div>

            {/* Right: Live miniature interactive swipe card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-[350px] relative">
                {/* Back stacked card decoration */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-4 -top-3 bottom-3 rounded-3xl bg-navy-800 border border-navy-700 rotate-[-3deg]"
                />

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-3xl bg-paper text-ink shadow-2xl overflow-hidden border border-navy-700/20 p-4"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-3.5">
                    <PropertyImage
                      src={featuredListing.photoUrl}
                      alt={featuredListing.title}
                      aspectClass="aspect-[4/3]"
                    />
                    <div className="absolute top-3 left-3">
                      <VerifiedBadge verified={featuredListing.verified} />
                    </div>
                    <div className="absolute top-3 right-3 rounded-lg bg-navy-900/90 text-gold-500 px-2.5 py-1 text-xs font-bold tabular-nums">
                      95% match
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-xl font-bold text-navy-900 leading-tight">
                        {featuredListing.title}
                      </h2>
                    </div>
                    <p className="text-sm font-semibold text-navy-900 tabular-nums">
                      {formatAEDCompact(featuredListing.priceAED)} ·{' '}
                      {formatSqft(featuredListing.sizeSqft)}
                    </p>
                    <p className="text-sm text-muted-light tabular-nums">
                      ROI {featuredListing.roiPercent.toFixed(0)}% ·{' '}
                      {featuredListing.commuteMinutes} min commute
                    </p>
                    <p className="text-xs text-muted-light">
                      Near a school and mosque · Sample listing
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-navy-900/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSaved('skipped');
                        pushToast('Skipped sample card', 'Open the Buyer App to swipe all 20 listings.');
                      }}
                      className={`flex-1 min-h-[44px] rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-navy-900 ${
                        heroSaved === 'skipped'
                          ? 'bg-navy-900/10 border-navy-900/30 text-navy-900'
                          : 'bg-paper border-navy-900/15 text-muted-light hover:text-navy-900 hover:border-navy-900/30'
                      }`}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSaved('saved');
                        pushToast('Saved 1-bed apartment, JVC', 'Try the full 20-home swipe deck in Buyer App.', 'success');
                      }}
                      className={`flex-1 min-h-[44px] rounded-xl text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-navy-900 ${
                        heroSaved === 'saved'
                          ? 'bg-verified-bg text-verified-text border border-verified-border'
                          : 'bg-gold-500 hover:bg-gold-600 text-navy-900'
                      }`}
                    >
                      <Heart className="w-4 h-4" strokeWidth={1.75} />
                      <span>{heroSaved === 'saved' ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-paper text-ink py-16 sm:py-20 border-b border-navy-900/10"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-gold-600 mb-2">
                Three steps from quiz to keys
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 text-balance">
                Three screens take a buyer from quiz to viewing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Quiz */}
              <div className="rounded-3xl bg-white border border-navy-900/10 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-light mb-3">
                    01. Quiz (60 seconds)
                  </p>
                  <div className="rounded-2xl bg-paper border border-navy-900/10 p-4 space-y-3 mb-5">
                    <div className="rounded-lg bg-navy-900 text-paper text-center py-1.5 text-xs font-bold">
                      iFinder · Quiz
                    </div>
                    <p className="text-sm font-bold text-navy-900">
                      What is your budget?
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-muted-light">
                        Under AED 1M
                      </div>
                      <div className="rounded-lg border-2 border-gold-500 bg-gold-100 px-3 py-2 font-bold text-navy-900">
                        AED 1M to 2M
                      </div>
                      <div className="rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-muted-light">
                        Over AED 2M
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-navy-900 pt-1">
                      Must be near: Metro · School
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    Share your lifestyle, not just filters
                  </h3>
                  <p className="text-sm text-muted-light mt-1 leading-relaxed">
                    Set budget, commute cap, Metro or school proximity, and
                    whether you are buying to live in or invest.
                  </p>
                </div>
              </div>

              {/* Step 2: Swipe */}
              <div className="rounded-3xl bg-white border border-navy-900/10 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-light mb-3">
                    02. Swipe matched homes
                  </p>
                  <div className="rounded-2xl bg-paper border border-navy-900/10 p-4 space-y-3 mb-5">
                    <div className="rounded-lg bg-navy-900 text-paper text-center py-1.5 text-xs font-bold">
                      iFinder · Matches
                    </div>
                    <div className="rounded-xl bg-white border border-navy-900/10 p-3 space-y-1.5">
                      <VerifiedBadge verified />
                      <p className="text-sm font-bold text-navy-900 pt-1">
                        1-bed apartment, JVC
                      </p>
                      <p className="text-xs text-muted-light tabular-nums">
                        AED 1.1M · 720 sq ft · ROI 7%
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <span className="w-10 h-10 rounded-full border border-navy-900/20 bg-white flex items-center justify-center text-xs font-semibold text-muted-light">
                        Skip
                      </span>
                      <span className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-navy-900">
                        Save
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    AI learns with every swipe
                  </h3>
                  <p className="text-sm text-muted-light mt-1 leading-relaxed">
                    Swipe right to save, left to skip. iFinder spots patterns in
                    areas, yield, and layout and re-ranks remaining homes live.
                  </p>
                </div>
              </div>

              {/* Step 3: Viewing */}
              <div className="rounded-3xl bg-white border border-navy-900/10 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-light mb-3">
                    03. Request a viewing
                  </p>
                  <div className="rounded-2xl bg-paper border border-navy-900/10 p-4 space-y-3 mb-5">
                    <div className="rounded-lg bg-navy-900 text-paper text-center py-1.5 text-xs font-bold">
                      iFinder · Viewing
                    </div>
                    <div className="rounded-xl bg-white border border-navy-900/10 p-3">
                      <p className="text-xs font-bold text-navy-900">
                        Verified agent
                      </p>
                      <p className="text-xs text-muted-light">
                        RERA licence checked
                      </p>
                    </div>
                    <div className="flex gap-1.5 text-xs">
                      <span className="rounded-lg bg-gold-100 border border-gold-500 px-2.5 py-1 font-bold text-navy-900">
                        Sat 10:00
                      </span>
                      <span className="rounded-lg bg-white border border-navy-900/15 px-2.5 py-1 text-muted-light">
                        Sat 14:00
                      </span>
                    </div>
                    <div className="rounded-lg bg-gold-500 text-navy-900 text-center py-2 text-xs font-bold">
                      Request viewing
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    Book one verified agent directly
                  </h3>
                  <p className="text-sm text-muted-light mt-1 leading-relaxed">
                    Pick a weekend slot or chat in-app. Your details go only to
                    that listing’s RERA-licensed agent—never sold to rival teams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY BUYERS TRUST IT */}
        <section
          id="why-trust"
          className="bg-navy-900 text-paper py-16 sm:py-20 border-b border-navy-700/70"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm font-semibold text-gold-500">
                Built for Dubai first-time buyers & investors
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                No outdated listings. No spam calls.
              </h2>
              <p className="text-base text-muted-navy leading-relaxed">
                Property portals overwhelm busy renters with duplicate units and
                expired prices. iFinder checks licences and DLD permits before a
                home ever earns the green Verified badge.
              </p>
              <div className="pt-2">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm px-5 py-3 transition-colors"
                >
                  <span>Start Sara’s 60-second demo</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-navy-800 border border-navy-700 p-6 space-y-2.5">
                <ShieldCheck className="w-6 h-6 text-gold-500" strokeWidth={1.75} />
                <h3 className="font-display text-lg font-bold">
                  Licence + DLD permit checked
                </h3>
                <p className="text-sm text-muted-navy leading-relaxed">
                  Unverified properties show “Verification pending” with viewing
                  requests locked until permits pass.
                </p>
              </div>

              <div className="rounded-2xl bg-navy-800 border border-navy-700 p-6 space-y-2.5">
                <UserCheck className="w-6 h-6 text-gold-500" strokeWidth={1.75} />
                <h3 className="font-display text-lg font-bold">
                  Free for buyers, always
                </h3>
                <p className="text-sm text-muted-navy leading-relaxed">
                  Quiz matching, saving homes, in-app chat, and viewing
                  appointments cost buyers AED 0.
                </p>
              </div>

              <div className="rounded-2xl bg-navy-800 border border-navy-700 p-6 space-y-2.5">
                <MapPin className="w-6 h-6 text-gold-500" strokeWidth={1.75} />
                <h3 className="font-display text-lg font-bold">
                  Matched to real Dubai life
                </h3>
                <p className="text-sm text-muted-navy leading-relaxed">
                  Rank homes by DIFC/Downtown commute, walking distance to
                  Metro, schools, mosques, and bedroom needs.
                </p>
              </div>

              <div className="rounded-2xl bg-navy-800 border border-navy-700 p-6 space-y-2.5">
                <TrendingUp className="w-6 h-6 text-gold-500" strokeWidth={1.75} />
                <h3 className="font-display text-lg font-bold">
                  Clear ROI & yield upfront
                </h3>
                <p className="text-sm text-muted-navy leading-relaxed">
                  Every card surfaces net yield % and estimated annual rental
                  income alongside price per sq ft.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FOR AGENTS */}
        <section
          id="for-agents"
          className="bg-paper text-ink py-16 sm:py-20 border-b border-navy-900/10"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-sm font-semibold text-gold-600">
                For RERA-licensed Dubai agents
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 text-balance">
                High-intent buyers matched to your exact listings
              </h2>
              <p className="text-base text-muted-light leading-relaxed">
                Stop paying for shared portals where five rival brokers race the
                same cold lead. On iFinder, viewing requests go exclusively to
                you—with the buyer’s budget, timeline, and match score upfront.
              </p>

              <ul className="space-y-3 text-sm text-navy-900">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-verified-text shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span>
                    RERA broker number (BRN) verified at sign-up for instant
                    buyer trust
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-verified-text shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span>
                    Upload listings manually or sync Property Finder XML, Bayut,
                    or CSV feeds
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-verified-text shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span>
                    Leads never shared with rival brokerages
                  </span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/agent"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-paper font-semibold text-sm px-5 py-3 transition-colors"
                >
                  <span>Open agent portal</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setDemoSubmitted(false);
                    setDemoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm px-5 py-3 transition-colors"
                >
                  <Clock className="w-4 h-4" strokeWidth={1.75} />
                  <span>Book 10-minute demo</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-navy-900 text-paper p-7 sm:p-8 border border-navy-700 shadow-xl space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-navy-700 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-gold-500">
                      Founding agent offer
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
                      Free for 3 months
                    </h3>
                    <p className="text-sm text-muted-navy mt-1">
                      Then AED 349/month standard
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gold-500 text-navy-900 px-4 py-3 text-right shrink-0">
                    <p className="text-xs font-bold">Founding rate</p>
                    <p className="font-display text-xl font-extrabold tabular-nums">
                      AED 299/mo
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-navy-800 border border-navy-700 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-paper">
                      First 100 founding agents lock AED 299/month
                    </p>
                    <p className="text-xs text-muted-navy mt-0.5">
                      Sample counter · No card charged during 3-month trial
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gold-500 tabular-nums whitespace-nowrap">
                    37 of 100 left
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-navy-800/70 border border-navy-700 p-4">
                    <p className="text-xs text-muted-navy">Avg. match score</p>
                    <p className="font-display text-2xl font-bold text-paper tabular-nums mt-1">
                      91%
                    </p>
                  </div>
                  <div className="rounded-xl bg-navy-800/70 border border-navy-700 p-4">
                    <p className="text-xs text-muted-navy">Lead exclusivity</p>
                    <p className="font-display text-2xl font-bold text-gold-500 mt-1">
                      1-to-1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DOWNLOAD SECTION */}
        <section className="bg-navy-800 text-paper py-14 border-b border-navy-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Take iFinder on your weekend property tours
              </h2>
              <p className="text-sm sm:text-base text-muted-navy">
                Coming to iOS and Android—or test the interactive mobile
                prototype right now in your browser.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  pushToast('App Store build in beta', 'Use "Open web prototype" to test the full mobile experience.');
                }}
                className="inline-flex items-center gap-2.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-gold-500 px-4 py-2.5 text-left transition-colors"
              >
                <Smartphone className="w-5 h-5 text-gold-500" strokeWidth={1.75} />
                <div>
                  <span className="block text-[10px] text-muted-navy leading-none">
                    Download on the
                  </span>
                  <span className="block text-sm font-bold text-paper leading-tight">
                    App Store
                  </span>
                </div>
              </a>

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  pushToast('Google Play build in beta', 'Use "Open web prototype" to test the full mobile experience.');
                }}
                className="inline-flex items-center gap-2.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-gold-500 px-4 py-2.5 text-left transition-colors"
              >
                <Sparkles className="w-5 h-5 text-gold-500" strokeWidth={1.75} />
                <div>
                  <span className="block text-[10px] text-muted-navy leading-none">
                    Get it on
                  </span>
                  <span className="block text-sm font-bold text-paper leading-tight">
                    Google Play
                  </span>
                </div>
              </a>

              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-5 py-3 transition-colors whitespace-nowrap"
              >
                <span>Open web prototype</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section id="faq" className="bg-paper text-ink py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="mb-10">
              <p className="text-sm font-semibold text-gold-600 mb-2">
                Questions & answers
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">
                Frequently asked questions
              </h2>
            </div>

            <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
              {COPY.website.faq.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="py-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left py-1.5 focus-visible:outline-2 focus-visible:outline-navy-900 rounded-lg"
                    >
                      <span className="font-display text-base sm:text-lg font-bold text-navy-900">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-light shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-navy-900' : ''
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 pr-8 text-sm sm:text-base text-muted-light leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-navy-900 text-paper border-t border-navy-700 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <Logo variant="full" theme="dark" size="sm" />
            <p className="text-xs text-muted-navy leading-relaxed">
              Privacy & consent: Quiz answers and swipe preferences are used
              solely to rank verified Dubai listings. Contact details are shared
              only with the single RERA-licensed agent you request a viewing
              with, aligned with DLD regulations and UAE data protection law.
            </p>
            <p className="text-xs font-medium text-gold-500">
              {COPY.brand.sampleFooter}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-paper">Explore</p>
              <ul className="space-y-1.5 text-muted-navy">
                <li>
                  <Link to="/app" className="hover:text-paper transition-colors">
                    Buyer Mobile App
                  </Link>
                </li>
                <li>
                  <Link to="/agent" className="hover:text-paper transition-colors">
                    Agent Web Portal
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-paper transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-paper">Contact</p>
              <ul className="space-y-1.5 text-muted-navy">
                <li>hello@ifinder.ae</li>
                <li>DIFC Innovation Hub, Dubai</li>
                <li className="text-xs">RERA & DLD compliance demo</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* 10-Minute Agent Demo Modal */}
      {demoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-paper text-ink p-6 shadow-2xl border border-navy-900/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-gold-600" strokeWidth={1.75} />
                <h3
                  id="demo-modal-title"
                  className="font-display text-xl font-bold text-navy-900"
                >
                  Book a 10-minute agent demo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                aria-label="Close demo dialog"
                className="p-2 rounded-xl hover:bg-navy-900/10 text-muted-light"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {demoSubmitted ? (
              <div className="space-y-4 py-3">
                <div className="rounded-2xl bg-verified-bg border border-verified-border p-4 text-verified-text text-sm">
                  <p className="font-bold">Walkthrough scheduled</p>
                  <p className="mt-1">
                    Thanks, {demoForm.name}. We’ve reserved a 10-minute portal
                    demo for {demoForm.agency} and sent details to{' '}
                    {demoForm.email}.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/agent"
                    onClick={() => setDemoModalOpen(false)}
                    className="flex-1 text-center rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm py-2.5"
                  >
                    Try agent portal now
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm font-semibold text-navy-900"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3.5" noValidate>
                <div>
                  <label
                    htmlFor="demo-name"
                    className="block text-xs font-semibold text-navy-900 mb-1"
                  >
                    Full name
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    value={demoForm.name}
                    onChange={(e) =>
                      setDemoForm({ ...demoForm, name: e.target.value })
                    }
                    placeholder="e.g. Tariq Al Mansoori"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                  />
                  {demoErrors.name && (
                    <p className="text-xs text-danger mt-1">{demoErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="demo-agency"
                    className="block text-xs font-semibold text-navy-900 mb-1"
                  >
                    Brokerage / agency
                  </label>
                  <input
                    id="demo-agency"
                    type="text"
                    value={demoForm.agency}
                    onChange={(e) =>
                      setDemoForm({ ...demoForm, agency: e.target.value })
                    }
                    placeholder="e.g. Gulf Haven Real Estate"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                  />
                  {demoErrors.agency && (
                    <p className="text-xs text-danger mt-1">{demoErrors.agency}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="demo-email"
                      className="block text-xs font-semibold text-navy-900 mb-1"
                    >
                      Work email
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      value={demoForm.email}
                      onChange={(e) =>
                        setDemoForm({ ...demoForm, email: e.target.value })
                      }
                      placeholder="name@agency.ae"
                      className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                    />
                    {demoErrors.email && (
                      <p className="text-xs text-danger mt-1">
                        {demoErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="demo-phone"
                      className="block text-xs font-semibold text-navy-900 mb-1"
                    >
                      UAE phone
                    </label>
                    <input
                      id="demo-phone"
                      type="tel"
                      value={demoForm.phone}
                      onChange={(e) =>
                        setDemoForm({ ...demoForm, phone: e.target.value })
                      }
                      placeholder="+971 50 000 0000"
                      className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
                    />
                    {demoErrors.phone && (
                      <p className="text-xs text-danger mt-1">
                        {demoErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm py-3 transition-colors mt-2"
                >
                  Confirm 10-minute demo
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
