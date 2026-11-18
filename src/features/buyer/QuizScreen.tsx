import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ALL_DUBAI_AREAS, COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';
import {
  BudgetBand,
  NearbyAmenity,
  QuizAnswers,
  QuizGoal,
  TimelineOption,
} from '../../types';

interface QuizScreenProps {
  onComplete: () => void;
  onBackToConsent: () => void;
}

const MATCHING_STATUSES = [
  'Checking verified listings',
  'Matching commute and budget',
  'Ranking by your taste',
];

export const QuizScreen: React.FC<QuizScreenProps> = ({
  onComplete,
  onBackToConsent,
}) => {
  const { state, setQuiz, skipAsSara } = useAppStore();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<QuizAnswers>(state.quiz);
  const [matchingPhase, setMatchingPhase] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!matchingPhase) return;
    const t1 = window.setTimeout(() => setStatusIdx(1), 480);
    const t2 = window.setTimeout(() => setStatusIdx(2), 960);
    const t3 = window.setTimeout(() => {
      setQuiz(draft, true);
      onComplete();
    }, 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [matchingPhase, draft, setQuiz, onComplete]);

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return draft.goal !== null;
      case 2:
        return draft.budgetBand !== null;
      case 3:
        return draft.openToAnywhere || draft.preferredAreas.length > 0;
      case 4:
        return draft.maxCommute !== null;
      case 5:
        return (
          draft.bedrooms !== null &&
          draft.bedrooms.length > 0 &&
          draft.familyWithKids !== null
        );
      case 6:
        return draft.timeline !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setQuiz(draft, false);
    if (step < 6) {
      setStep(step + 1);
    } else {
      setMatchingPhase(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBackToConsent();
    }
  };

  const toggleNearby = (item: NearbyAmenity) => {
    const exists = draft.mustBeNear.includes(item);
    setDraft({
      ...draft,
      mustBeNear: exists
        ? draft.mustBeNear.filter((x) => x !== item)
        : [...draft.mustBeNear, item],
    });
  };

  const toggleArea = (area: string) => {
    const exists = draft.preferredAreas.includes(area);
    setDraft({
      ...draft,
      openToAnywhere: false,
      preferredAreas: exists
        ? draft.preferredAreas.filter((a) => a !== area)
        : [...draft.preferredAreas, area],
    });
  };

  const toggleBed = (bed: number) => {
    const current = draft.bedrooms ?? [];
    const exists = current.includes(bed);
    setDraft({
      ...draft,
      bedrooms: exists ? current.filter((b) => b !== bed) : [...current, bed],
    });
  };

  if (matchingPhase) {
    return (
      <div className="flex-1 bg-navy-900 text-paper flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 rounded-2xl border-4 border-navy-700 border-t-gold-500 mb-6"
        />
        <h1 className="font-display text-2xl font-bold text-paper">
          Finding your matches
        </h1>
        <p className="mt-3 text-sm text-gold-500 font-medium min-h-[20px]">
          {MATCHING_STATUSES[statusIdx]}
        </p>
        <p className="mt-2 text-xs text-muted-navy">
          Scoring 20 verified Dubai homes
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col justify-between p-5 overflow-y-auto phone-scroll">
      <div>
        {/* Header bar matching mockup: iFinder · Quiz */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Previous question"
            className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-xl text-navy-900 hover:bg-navy-900/10"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <div className="flex-1 rounded-xl bg-navy-900/8 px-4 py-2 text-center">
            <span className="font-display text-sm font-bold text-navy-900">
              {COPY.buyerApp.quizHeader}
            </span>
          </div>

          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-navy-900/10 overflow-hidden mb-5">
          <div
            className="h-full bg-gold-500 transition-all duration-200 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Demo mode skip shortcut */}
        {state.demoMode && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-gold-100 border border-gold-500/60 px-3 py-2">
            <span className="text-xs font-medium text-navy-900">
              Demo: Sara (JLT · AED 1.2M)
            </span>
            <button
              type="button"
              onClick={() => {
                skipAsSara();
                onComplete();
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-navy-900 text-gold-500 px-2.5 py-1 text-xs font-semibold hover:bg-navy-800"
            >
              <Sparkles className="w-3 h-3" strokeWidth={1.75} />
              <span>Skip as Sara</span>
            </button>
          </div>
        )}

        {/* Question Screens */}
        {step === 1 && (
          <div className="space-y-4">
            <h1 className="font-display text-xl font-bold text-navy-900">
              What is your main goal?
            </h1>
            <div className="space-y-2.5">
              {(
                [
                  {
                    value: 'live',
                    label: 'Live in it',
                    sub: 'Prioritise commute, layout, and daily lifestyle',
                  },
                  {
                    value: 'invest',
                    label: 'Invest in it',
                    sub: 'Prioritise rental ROI, yield, and tenant demand',
                  },
                  {
                    value: 'both',
                    label: 'Both',
                    sub: 'Live now or rent out with strong resale appeal',
                  },
                ] as { value: QuizGoal; label: string; sub: string }[]
              ).map((opt) => {
                const selected = draft.goal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraft({ ...draft, goal: opt.value })}
                    className={`w-full text-left rounded-xl p-3.5 border transition-colors ${
                      selected
                        ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                    }`}
                  >
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className="text-xs text-muted-light mt-0.5">{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-xl font-bold text-navy-900 mb-3">
                What is your budget?
              </h1>
              <div className="space-y-2.5">
                {(
                  [
                    { value: 'under_1m', label: 'Under AED 1M' },
                    { value: '1m_to_2m', label: 'AED 1M to 2M' },
                    { value: 'over_2m', label: 'Over AED 2M' },
                  ] as { value: BudgetBand; label: string }[]
                ).map((opt) => {
                  const selected = draft.budgetBand === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, budgetBand: opt.value })
                      }
                      className={`w-full min-h-[46px] rounded-xl px-4 py-3 text-sm font-semibold border transition-colors ${
                        selected
                          ? 'bg-gold-100 border-2 border-gold-500 text-navy-900 font-bold'
                          : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 mb-2.5">
                Must be near
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {(['Metro', 'School', 'Mosque'] as NearbyAmenity[]).map(
                  (item) => {
                    const selected = draft.mustBeNear.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleNearby(item)}
                        className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-semibold border transition-colors ${
                          selected
                            ? 'bg-gold-100 border-2 border-gold-500 text-navy-900 font-bold'
                            : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="font-display text-xl font-bold text-navy-900">
              Preferred Dubai areas
            </h1>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  openToAnywhere: !draft.openToAnywhere,
                  preferredAreas: !draft.openToAnywhere ? [] : draft.preferredAreas,
                })
              }
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold border flex items-center justify-between transition-colors ${
                draft.openToAnywhere
                  ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                  : 'bg-white border-navy-900/15 text-navy-900'
              }`}
            >
              <span>Open to anywhere in Dubai</span>
              {draft.openToAnywhere && (
                <Check className="w-4 h-4 text-navy-900" strokeWidth={2} />
              )}
            </button>

            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_DUBAI_AREAS.slice(0, 12).map((area) => {
                const selected = draft.preferredAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleArea(area)}
                    className={`min-h-[40px] rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      selected
                        ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h1 className="font-display text-xl font-bold text-navy-900">
              Maximum commute to Downtown / DIFC
            </h1>
            <div className="rounded-2xl bg-white border border-navy-900/10 p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-light">Up to</span>
                <span className="font-display text-3xl font-extrabold text-navy-900 tabular-nums">
                  {draft.maxCommute === 45 ? '45+ min' : `${draft.maxCommute} min`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 45].map((mins) => {
                  const selected = draft.maxCommute === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDraft({ ...draft, maxCommute: mins })}
                      className={`min-h-[44px] rounded-xl text-sm font-semibold border transition-colors tabular-nums ${
                        selected
                          ? 'bg-gold-100 border-2 border-gold-500 text-navy-900 font-bold'
                          : 'bg-paper border-navy-900/15 text-navy-900'
                      }`}
                    >
                      {mins === 45 ? '45+' : `${mins}m`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-xl font-bold text-navy-900 mb-3">
                How many bedrooms?
              </h1>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 0, label: 'Studio' },
                  { val: 1, label: '1' },
                  { val: 2, label: '2' },
                  { val: 3, label: '3+' },
                ].map((b) => {
                  const selected = (draft.bedrooms ?? []).includes(b.val);
                  return (
                    <button
                      key={b.val}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleBed(b.val)}
                      className={`min-h-[46px] rounded-xl text-sm font-semibold border transition-colors ${
                        selected
                          ? 'bg-gold-100 border-2 border-gold-500 text-navy-900 font-bold'
                          : 'bg-white border-navy-900/15 text-navy-900'
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 mb-2.5">
                Family with kids?
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { val: true, label: 'Yes' },
                  { val: false, label: 'No' },
                ].map((opt) => {
                  const selected = draft.familyWithKids === opt.val;
                  return (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() =>
                        setDraft({ ...draft, familyWithKids: opt.val })
                      }
                      className={`min-h-[46px] rounded-xl text-sm font-semibold border transition-colors ${
                        selected
                          ? 'bg-gold-100 border-2 border-gold-500 text-navy-900 font-bold'
                          : 'bg-white border-navy-900/15 text-navy-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h1 className="font-display text-xl font-bold text-navy-900">
              When are you planning to buy?
            </h1>
            <div className="space-y-2.5">
              {(
                [
                  {
                    value: 'within_3m',
                    label: 'Within 3 months',
                    sub: 'Ready for viewings & mortgage/cash offer',
                  },
                  {
                    value: '3_to_12m',
                    label: '3 to 12 months',
                    sub: 'Comparing areas before current lease ends',
                  },
                  {
                    value: 'exploring',
                    label: 'Just exploring',
                    sub: 'Benchmarking prices and yields across Dubai',
                  },
                ] as { value: TimelineOption; label: string; sub: string }[]
              ).map((opt) => {
                const selected = draft.timeline === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraft({ ...draft, timeline: opt.value })}
                    className={`w-full text-left rounded-xl p-3.5 border transition-colors ${
                      selected
                        ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                    }`}
                  >
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className="text-xs text-muted-light mt-0.5">{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 space-y-3">
        <p className="text-center text-xs font-medium text-muted-light tabular-nums">
          Question {step} of 6
        </p>
        <button
          type="button"
          disabled={!canProceed()}
          onClick={handleNext}
          className={`w-full min-h-[48px] rounded-xl font-bold text-base transition-colors focus-visible:outline-2 focus-visible:outline-navy-900 ${
            canProceed()
              ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
              : 'bg-navy-900/10 text-muted-light cursor-not-allowed'
          }`}
        >
          {step === 6 ? 'See my matches' : 'Next'}
        </button>
      </div>
    </div>
  );
};
