import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from 'motion/react';
import {
  Building2,
  Flag,
  GraduationCap,
  Heart,
  RotateCcw,
  SlidersHorizontal,
  TrainFront,
  X,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { PropertyImage } from '../../components/PropertyImage';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';
import { BudgetBand, MatchResult, NearbyAmenity } from '../../types';
import {
  formatAEDCompact,
  formatNearbySentence,
  formatSqft,
} from '../../utils/format';

interface SwipeCardProps {
  match: MatchResult;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (dir: 'left' | 'right') => void;
  onOpenDetail: () => void;
  onReport: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  match,
  isTop,
  stackIndex,
  onSwipe,
  onOpenDetail,
  onReport,
}) => {
  const { listing, score, reasons } = match;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const saveOpacity = useTransform(x, [30, 120], [0, 1]);
  const skipOpacity = useTransform(x, [-120, -30], [1, 0]);
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setDragging(false);
    if (info.offset.x > 110 || info.velocity.x > 450) {
      onSwipe('right');
    } else if (info.offset.x < -110 || info.velocity.x < -450) {
      onSwipe('left');
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 10;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 20 - stackIndex,
      }}
      initial={{ scale: 0.94, opacity: 0, y: 14 }}
      animate={{ scale, opacity: 1, y: translateY }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 rounded-3xl bg-white border border-navy-900/12 shadow-lg overflow-hidden flex flex-col select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* Photo + Badges */}
      <div
        role="button"
        tabIndex={isTop ? 0 : -1}
        aria-label={`View details for ${listing.title}`}
        onClick={() => {
          if (!dragging && isTop) onOpenDetail();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && isTop) onOpenDetail();
        }}
        className="relative shrink-0 text-left focus-visible:outline-2 focus-visible:outline-gold-500"
      >
        <PropertyImage
          src={listing.photoUrl}
          alt={listing.title}
          aspectClass="aspect-[4/3]"
        />

        {/* Top-left Verified / Pending badge */}
        <div className="absolute top-3 left-3">
          <VerifiedBadge verified={listing.verified} />
        </div>

        {/* Top-right Match % pill */}
        <div className="absolute top-3 right-3 rounded-lg bg-navy-900/90 text-gold-500 px-2.5 py-1 text-xs font-bold tabular-nums shadow-sm">
          {score}% match
        </div>

        {/* Drag Stamps */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: saveOpacity }}
              className="pointer-events-none absolute top-12 left-4 rounded-xl border-4 border-gold-500 bg-navy-900/85 px-3 py-1 text-gold-500 font-display text-lg font-extrabold tracking-wider -rotate-12"
            >
              SAVE
            </motion.div>
            <motion.div
              style={{ opacity: skipOpacity }}
              className="pointer-events-none absolute top-12 right-4 rounded-xl border-4 border-muted-navy bg-navy-900/85 px-3 py-1 text-muted-navy font-display text-lg font-extrabold tracking-wider rotate-12"
            >
              SKIP
            </motion.div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              tabIndex={isTop ? 0 : -1}
              onClick={() => {
                if (!dragging && isTop) onOpenDetail();
              }}
              className="text-left font-display text-lg font-bold text-navy-900 leading-snug hover:underline focus-visible:outline-2 focus-visible:outline-gold-500 rounded"
            >
              {listing.title}
            </button>
            <button
              type="button"
              tabIndex={isTop ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                onReport();
              }}
              aria-label={`Report ${listing.title}`}
              className="p-1.5 -mr-1 -mt-1 rounded-lg text-muted-light hover:text-danger hover:bg-danger/10 shrink-0"
            >
              <Flag className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <p className="text-sm font-semibold text-navy-900 tabular-nums">
            {formatAEDCompact(listing.priceAED)} · {formatSqft(listing.sizeSqft)}
          </p>

          <p className="text-xs text-muted-light tabular-nums">
            ROI {listing.roiPercent % 1 === 0 ? listing.roiPercent.toFixed(0) : listing.roiPercent.toFixed(1)}% · {listing.commuteMinutes} min commute
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-light pt-0.5">
            <span className="inline-flex items-center gap-1">
              {listing.nearby.includes('Metro') && (
                <TrainFront className="w-3.5 h-3.5 text-navy-900" strokeWidth={1.75} />
              )}
              {listing.nearby.includes('School') && (
                <GraduationCap className="w-3.5 h-3.5 text-navy-900" strokeWidth={1.75} />
              )}
              {listing.nearby.includes('Mosque') && (
                <Building2 className="w-3.5 h-3.5 text-navy-900" strokeWidth={1.75} />
              )}
              <span>{formatNearbySentence(listing.nearby)}</span>
            </span>
          </div>

          {listing.highlights.length > 0 && (
            <p className="text-[11px] text-navy-900/75 font-medium truncate pt-0.5">
              {listing.highlights.join(' · ')}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-navy-900/10">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {reasons.map((reason) => (
              <span
                key={reason}
                className="rounded-lg bg-gold-100 text-navy-900 px-2 py-0.5 text-[11px] font-semibold truncate"
              >
                {reason}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-muted-light shrink-0">
            {COPY.buyerApp.sampleListing}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    rankedMatches,
    remainingDeck,
    savedMatches,
    recordSwipe,
    undoLastSwipe,
    reviewSkipped,
    retakeQuiz,
    setQuiz,
    submitReport,
    pushToast,
  } = useAppStore();

  const [filterOpen, setFilterOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Price is wrong');
  const [savePulse, setSavePulse] = useState(false);

  const totalCount = rankedMatches.length;
  const seenCount = Math.min(totalCount, totalCount - remainingDeck.length + 1);
  const visibleCards = useMemo(() => remainingDeck.slice(0, 3), [remainingDeck]);
  const topCard = visibleCards[0];

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (!topCard) return;
      if (direction === 'right') {
        setSavePulse(true);
        window.setTimeout(() => setSavePulse(false), 300);
      }
      recordSwipe(topCard.listing, direction);
    },
    [topCard, recordSwipe]
  );

  // Keyboard support: Left, Right, Z
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (filterOpen || reportTargetId) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('left');
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoLastSwipe();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSwipe, undoLastSwipe, filterOpen, reportTargetId]);

  const toggleNearbyFilter = (item: NearbyAmenity) => {
    const current = state.quiz.mustBeNear;
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    setQuiz({ ...state.quiz, mustBeNear: next }, true);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTargetId) return;
    submitReport({
      id: `rep-${Date.now()}`,
      listingId: reportTargetId,
      reason: reportReason,
      createdAt: new Date().toISOString(),
    });
    setReportTargetId(null);
    pushToast('Report submitted', 'Our verification team will review this listing.', 'success');
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col justify-between p-4 overflow-hidden relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-2">
        <Logo variant="mark" size="xs" />

        <div className="flex-1 rounded-xl bg-navy-900/8 px-3 py-2 flex items-center justify-center gap-2">
          <span className="font-display text-sm font-bold text-navy-900">
            {COPY.buyerApp.matchesHeader}
          </span>
          {remainingDeck.length > 0 && (
            <span className="text-xs font-semibold text-muted-light tabular-nums">
              · {seenCount} of {totalCount}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-label="Filter matches"
          className="min-w-[44px] min-h-[44px] rounded-xl bg-white border border-navy-900/12 flex items-center justify-center text-navy-900 hover:bg-gold-100 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Main Card Stack or End State */}
      {remainingDeck.length > 0 ? (
        <>
          <div className="relative flex-1 min-h-[380px] max-h-[470px] my-1">
            <AnimatePresence>
              {visibleCards
                .slice()
                .reverse()
                .map((match) => {
                  const idx = visibleCards.findIndex(
                    (m) => m.listing.id === match.listing.id
                  );
                  return (
                    <SwipeCard
                      key={match.listing.id}
                      match={match}
                      isTop={idx === 0}
                      stackIndex={idx}
                      onSwipe={handleSwipe}
                      onOpenDetail={() =>
                        navigate(`/app/listing/${match.listing.id}`)
                      }
                      onReport={() => setReportTargetId(match.listing.id)}
                    />
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Controls matching mockup: Skip / Undo / Save */}
          <div className="shrink-0 pt-2 pb-1 space-y-1.5">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSwipe('left')}
                aria-label="Skip listing"
                className="w-16 h-16 rounded-full bg-white border border-navy-900/20 text-muted-light hover:text-navy-900 hover:border-navy-900/40 font-semibold text-sm flex items-center justify-center shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-navy-900"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={undoLastSwipe}
                disabled={state.swipes.length === 0}
                aria-label="Undo last swipe"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                  state.swipes.length === 0
                    ? 'bg-paper border-navy-900/10 text-muted-light/40 cursor-not-allowed'
                    : 'bg-white border-navy-900/20 text-navy-900 hover:bg-navy-900/5'
                }`}
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
              </button>

              <motion.button
                type="button"
                animate={savePulse ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleSwipe('right')}
                aria-label="Save listing"
                className="w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-600 border-2 border-gold-600 text-navy-900 font-bold text-sm flex items-center justify-center shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-navy-900"
              >
                Save
              </motion.button>
            </div>

            <p className="text-center text-xs text-muted-light">
              {state.demoMode
                ? 'Right swipe = save · Left = skip · Tap card for details'
                : COPY.buyerApp.swipeHint}
            </p>
          </div>
        </>
      ) : (
        /* End State after 20 cards */
        <div className="flex-1 overflow-y-auto phone-scroll py-3 space-y-4">
          <div className="rounded-2xl bg-navy-900 text-paper p-5 text-center space-y-1.5">
            <h1 className="font-display text-xl font-bold">
              You’ve seen all {totalCount} matches
            </h1>
            <p className="text-sm text-muted-navy">
              You saved{' '}
              <span className="font-bold text-gold-500 tabular-nums">
                {savedMatches.length}
              </span>{' '}
              {savedMatches.length === 1 ? 'home' : 'homes'} matching your
              profile.
            </p>
          </div>

          {savedMatches.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-light">
                Top saved homes
              </p>
              {savedMatches.slice(0, 3).map((m) => (
                <button
                  key={m.listing.id}
                  type="button"
                  onClick={() => navigate(`/app/listing/${m.listing.id}`)}
                  className="w-full text-left rounded-2xl bg-white border border-navy-900/10 p-3 flex items-center gap-3 hover:border-gold-500 transition-colors"
                >
                  <PropertyImage
                    src={m.listing.photoUrl}
                    alt={m.listing.title}
                    aspectClass="w-16 h-14 rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-900 truncate">
                      {m.listing.title}
                    </p>
                    <p className="text-xs text-muted-light tabular-nums">
                      {formatAEDCompact(m.listing.priceAED)} · {m.score}% match
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-1">
            {savedMatches.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/app/viewing/${
                      savedMatches.find((m) => m.listing.verified)?.listing.id ??
                      savedMatches[0].listing.id
                    }`
                  )
                }
                className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
              >
                Request viewing
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/app/saved')}
              className="w-full min-h-[44px] rounded-xl bg-white border border-navy-900/15 text-navy-900 font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
              <span>View saved homes ({savedMatches.length})</span>
            </button>
            {state.swipes.some((s) => s.direction === 'left') && (
              <button
                type="button"
                onClick={reviewSkipped}
                className="w-full min-h-[44px] rounded-xl bg-white border border-navy-900/15 text-navy-900 font-semibold text-sm"
              >
                Review skipped homes
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                retakeQuiz();
                navigate('/app/quiz');
              }}
              className="w-full min-h-[40px] text-xs font-semibold text-muted-light hover:text-navy-900"
            >
              Retake quiz
            </button>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      {filterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Adjust match filters"
          className="absolute inset-0 z-40 bg-black/50 flex items-end"
        >
          <div className="w-full rounded-t-3xl bg-paper p-5 space-y-4 shadow-2xl border-t border-navy-900/10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Adjust live filters
              </h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-light mb-2">
                Budget band
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'under_1m', label: '< AED 1M' },
                    { value: '1m_to_2m', label: '1M – 2M' },
                    { value: 'over_2m', label: '> AED 2M' },
                  ] as { value: BudgetBand; label: string }[]
                ).map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() =>
                      setQuiz({ ...state.quiz, budgetBand: b.value }, true)
                    }
                    className={`min-h-[40px] rounded-xl text-xs font-semibold border ${
                      state.quiz.budgetBand === b.value
                        ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-light mb-2">
                Must be near
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['Metro', 'School', 'Mosque'] as NearbyAmenity[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleNearbyFilter(n)}
                    className={`min-h-[40px] rounded-xl text-xs font-semibold border ${
                      state.quiz.mustBeNear.includes(n)
                        ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilterOpen(false);
                pushToast('Matches re-ranked', 'Updated scores based on your new filters.');
              }}
              className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}

      {/* Report Listing Modal */}
      {reportTargetId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report wrong listing"
          className="absolute inset-0 z-40 bg-black/50 flex items-end"
        >
          <form
            onSubmit={handleReportSubmit}
            className="w-full rounded-t-3xl bg-paper p-5 space-y-3 shadow-2xl border-t border-navy-900/10"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Report wrong listing
              </h2>
              <button
                type="button"
                onClick={() => setReportTargetId(null)}
                aria-label="Close report dialog"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                'Price is wrong',
                'Already sold/rented',
                'Photos don’t match',
                'Other',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-3 rounded-xl bg-white border border-navy-900/10 px-3.5 py-2.5 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-navy-900"
                  />
                  <span className="font-medium text-navy-900">{reason}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="w-full min-h-[46px] rounded-xl bg-danger text-paper font-bold text-sm"
            >
              Submit report
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
