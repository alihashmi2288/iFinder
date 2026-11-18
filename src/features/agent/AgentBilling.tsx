import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Receipt } from 'lucide-react';
import { COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';

export const AgentBilling: React.FC = () => {
  const { pushToast } = useAppStore();
  const [foundingTier, setFoundingTier] = useState(true);
  const [cardName, setCardName] = useState('Gulf Haven Real Estate LLC');
  const [cardLast4, setCardLast4] = useState('4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardSaved, setCardSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim() || cardLast4.trim().length < 4 || !cardExpiry.trim()) {
      setError('Complete all billing method fields.');
      return;
    }
    setError(null);
    setCardSaved(true);
    pushToast(
      'Payment method saved',
      'AED 0 will be charged until your 3-month free period ends.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Billing & plan
        </h1>
        <p className="text-sm text-muted-light">
          Zero charge during your 3-month launch trial. Sample billing figures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-white border border-navy-900/12 p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-900/10 pb-4">
            <div>
              <p className="text-xs font-semibold text-gold-600">Current plan</p>
              <h2 className="font-display text-2xl font-extrabold text-navy-900 mt-0.5">
                {COPY.agentPortal.planHeadline}
              </h2>
              <p className="text-sm text-muted-light mt-0.5">
                {foundingTier
                  ? 'Founding agent rate: AED 299 a month after trial'
                  : 'Standard rate: AED 349 a month after trial'}
              </p>
            </div>
            <div className="rounded-xl bg-gold-100 border border-gold-500 px-3.5 py-2 text-right">
              <p className="text-[11px] font-semibold text-navy-900">
                Free period remaining
              </p>
              <p className="font-display text-xl font-extrabold text-navy-900 tabular-nums">
                74 days left
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-light">
            <span>Next scheduled invoice: 30 January 2027</span>
            <button
              type="button"
              onClick={() => setFoundingTier(!foundingTier)}
              className="font-semibold text-navy-900 underline underline-offset-4"
            >
              Preview {foundingTier ? 'standard AED 349' : 'founding AED 299'} rate
            </button>
          </div>

          {/* Empty Invoice History for Free Period */}
          <div className="rounded-2xl bg-paper border border-navy-900/10 p-5 text-center space-y-1.5">
            <Receipt className="w-6 h-6 text-muted-light mx-auto" strokeWidth={1.75} />
            <p className="text-sm font-bold text-navy-900">No invoices yet</p>
            <p className="text-xs text-muted-light">
              No charge during your 3-month free trial. Invoices will appear
              here after your free period ends.
            </p>
          </div>
        </div>

        {/* Simulated Payment Method Form */}
        <form
          onSubmit={handleSaveCard}
          className="lg:col-span-5 rounded-2xl bg-white border border-navy-900/12 p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-navy-900" strokeWidth={1.75} />
            <h2 className="font-display text-base font-bold text-navy-900">
              Payment method (optional during trial)
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Name on card / corporate entity
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Card ending (sample)
              </label>
              <input
                type="text"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Expiry
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm tabular-nums"
              />
            </div>
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}
          {cardSaved && (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-verified-text">
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
              <span>Card verified for post-trial billing</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[44px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
          >
            Save payment method
          </button>
        </form>
      </div>
    </div>
  );
};
