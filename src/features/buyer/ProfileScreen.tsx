import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Sliders, User } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateConsent, retakeQuiz, resetDemo, pushToast } =
    useAppStore();

  const budgetText =
    state.quiz.budgetBand === 'under_1m'
      ? 'Under AED 1M'
      : state.quiz.budgetBand === 'over_2m'
      ? 'Over AED 2M'
      : 'AED 1M to 2M';

  return (
    <div className="flex-1 bg-paper text-ink p-4 overflow-y-auto phone-scroll space-y-4">
      <div className="rounded-2xl bg-navy-900 text-paper p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gold-500 text-navy-900 flex items-center justify-center shrink-0">
          <User className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold">Sara (Demo Buyer)</h1>
          <p className="text-xs text-muted-navy">
            29 · Renting 1-bed in JLT · Budget ~AED 1.2M
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-navy-900/10 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-navy-900">
            Your quiz summary
          </h2>
          <button
            type="button"
            onClick={() => {
              retakeQuiz();
              navigate('/app/quiz');
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-navy-900"
          >
            <Sliders className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Edit quiz answers</span>
          </button>
        </div>

        <div className="text-xs text-muted-light space-y-1.5 pt-1">
          <p>
            <strong className="text-navy-900">Budget:</strong> {budgetText}
          </p>
          <p>
            <strong className="text-navy-900">Must be near:</strong>{' '}
            {state.quiz.mustBeNear.length > 0
              ? state.quiz.mustBeNear.join(', ')
              : 'No strict requirement'}
          </p>
          <p>
            <strong className="text-navy-900">Preferred areas:</strong>{' '}
            {state.quiz.openToAnywhere
              ? 'Open to anywhere'
              : state.quiz.preferredAreas.join(', ') || 'All Dubai'}
          </p>
          <p>
            <strong className="text-navy-900">Max commute:</strong>{' '}
            {state.quiz.maxCommute ?? 20} min
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-navy-900/10 p-4 space-y-3">
        <h2 className="font-display text-sm font-bold text-navy-900">
          Data & consent settings
        </h2>
        <label className="flex items-center justify-between text-xs text-navy-900 cursor-pointer">
          <span>Personalised swipe ranking</span>
          <input
            type="checkbox"
            checked={state.consent.personalisedMatching}
            onChange={(e) => {
              updateConsent({ personalisedMatching: e.target.checked });
              pushToast('Consent updated');
            }}
            className="w-4 h-4 accent-navy-900"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-navy-900 cursor-pointer">
          <span>Product alerts on new matches</span>
          <input
            type="checkbox"
            checked={state.consent.productUpdates}
            onChange={(e) => {
              updateConsent({ productUpdates: e.target.checked });
              pushToast('Alert preference saved');
            }}
            className="w-4 h-4 accent-navy-900"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          resetDemo();
          navigate('/app');
        }}
        className="w-full min-h-[44px] rounded-xl bg-white border border-navy-900/15 text-navy-900 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-navy-900/5"
      >
        <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
        <span>Reset demo</span>
      </button>
    </div>
  );
};
