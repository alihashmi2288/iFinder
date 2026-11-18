import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';

interface ConsentScreenProps {
  onAccepted: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onAccepted }) => {
  const { state, acceptConsent, pushToast } = useAppStore();
  const [personalised, setPersonalised] = useState(
    state.consent.personalisedMatching
  );
  const [shareAgents, setShareAgents] = useState(
    state.consent.shareWithRequestedAgents
  );
  const [updates, setUpdates] = useState(state.consent.productUpdates);
  const [error, setError] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleAccept = () => {
    if (!personalised || !shareAgents) {
      setError(
        'Both personalised matching and agent-request sharing are required to match and book viewings.'
      );
      return;
    }
    setError(null);
    acceptConsent({
      accepted: true,
      personalisedMatching: personalised,
      shareWithRequestedAgents: shareAgents,
      productUpdates: updates,
      acceptedAt: new Date().toISOString(),
    });
    pushToast('Preferences saved', 'Let’s tailor your 60-second quiz.', 'success');
    onAccepted();
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col justify-between p-5 overflow-y-auto phone-scroll">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Logo variant="full" theme="light" size="sm" />
          <span className="text-[11px] font-medium text-muted-light">
            DLD & UAE PDPL
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-navy-900/10 p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-navy-900">
            <ShieldCheck className="w-5 h-5 text-verified-text" strokeWidth={1.75} />
            <h1 className="font-display text-xl font-bold">
              {COPY.buyerApp.consentTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-light leading-relaxed">
            {COPY.buyerApp.consentSummary}
          </p>
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="text-xs font-semibold text-navy-900 underline underline-offset-4 hover:text-gold-600"
          >
            Read full privacy & DLD notice
          </button>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-start justify-between gap-3 rounded-2xl bg-white border border-navy-900/10 p-3.5 cursor-pointer">
            <div className="space-y-0.5">
              <span className="block text-sm font-semibold text-navy-900">
                Personalised matching (required)
              </span>
              <span className="block text-xs text-muted-light">
                Uses your quiz & swipes to rank homes by budget, commute, and ROI.
              </span>
            </div>
            <input
              type="checkbox"
              checked={personalised}
              onChange={(e) => {
                setPersonalised(e.target.checked);
                setError(null);
              }}
              className="mt-1 w-5 h-5 accent-navy-900 shrink-0"
            />
          </label>

          <label className="flex items-start justify-between gap-3 rounded-2xl bg-white border border-navy-900/10 p-3.5 cursor-pointer">
            <div className="space-y-0.5">
              <span className="block text-sm font-semibold text-navy-900">
                Share details with agents I request (required)
              </span>
              <span className="block text-xs text-muted-light">
                Sent only to the verified agent on homes you choose to view.
              </span>
            </div>
            <input
              type="checkbox"
              checked={shareAgents}
              onChange={(e) => {
                setShareAgents(e.target.checked);
                setError(null);
              }}
              className="mt-1 w-5 h-5 accent-navy-900 shrink-0"
            />
          </label>

          <label className="flex items-start justify-between gap-3 rounded-2xl bg-white border border-navy-900/10 p-3.5 cursor-pointer">
            <div className="space-y-0.5">
              <span className="block text-sm font-semibold text-navy-900">
                Product updates (optional)
              </span>
              <span className="block text-xs text-muted-light">
                Occasional alerts when new verified homes match your criteria.
              </span>
            </div>
            <input
              type="checkbox"
              checked={updates}
              onChange={(e) => setUpdates(e.target.checked)}
              className="mt-1 w-5 h-5 accent-navy-900 shrink-0"
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium px-3 py-2"
          >
            {error}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleAccept}
          className="w-full min-h-[48px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-base transition-colors focus-visible:outline-2 focus-visible:outline-navy-900"
        >
          Accept & start quiz
        </button>
      </div>

      {privacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Privacy & DLD notice"
          className="absolute inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3"
        >
          <div className="w-full rounded-3xl bg-paper text-ink p-5 shadow-2xl space-y-3 border border-navy-900/10 max-h-[80%] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Data Privacy & DLD Compliance
              </h2>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label="Close privacy notice"
                className="p-1.5 rounded-lg hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="text-xs text-muted-light space-y-2 leading-relaxed">
              <p>
                1. Purpose limitation: Quiz answers and swipe signals stay inside
                your local matching profile to order verified Dubai properties.
              </p>
              <p>
                2. Zero lead resale: iFinder never broadcasts your phone number or
                email to competing agencies. Only the agent attached to a
                viewing request receives your slot and match summary.
              </p>
              <p>
                3. Verification: All Verified badges require an active 5-digit
                RERA BRN and valid DLD permit number. You can update consent or
                reset your data anytime in Profile.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="w-full rounded-xl bg-navy-900 text-paper font-semibold text-sm py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
