import React, { useState } from 'react';
import { Calendar, Check, Clock, X } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { formatAEDCompact } from '../../utils/format';

export const AgentViewings: React.FC = () => {
  const { state, updateViewingStatus, pushToast } = useAppStore();
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState('Sun 16:00');

  const requests = state.viewingRequests.filter(
    (vr) => vr.agentId === state.agentSession.agentId
  );

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId || !newSlot.trim()) return;
    updateViewingStatus(rescheduleId, 'Rescheduled', newSlot.trim());
    setRescheduleId(null);
    pushToast(
      'Alternative slot suggested',
      `Buyer notified of ${newSlot.trim()} in the Buyer App.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Viewing requests ({requests.length})
        </h1>
        <p className="text-sm text-muted-light">
          Leads shown here are matched exclusively to your listings. Confirming
          updates the buyer’s app immediately.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((vr) => {
          const listing = state.listings.find((l) => l.id === vr.listingId);
          return (
            <div
              key={vr.id}
              className="rounded-2xl bg-white border border-navy-900/12 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold text-navy-900">
                    {vr.buyerName}
                  </span>
                  <span className="rounded-lg bg-gold-100 text-navy-900 px-2 py-0.5 text-xs font-bold tabular-nums">
                    {vr.buyerMatchPercent}% match
                  </span>
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                      vr.status === 'Confirmed' || vr.status === 'Completed'
                        ? 'bg-verified-bg text-verified-text'
                        : vr.status === 'Declined'
                        ? 'bg-danger/10 text-danger'
                        : 'bg-paper text-navy-900'
                    }`}
                  >
                    {vr.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-navy-900">
                  {listing?.title}{' '}
                  <span className="text-muted-light font-normal tabular-nums">
                    ({listing ? formatAEDCompact(listing.priceAED) : ''})
                  </span>
                </p>

                <p className="text-xs text-muted-light inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-600" strokeWidth={1.75} />
                  <span>
                    Requested slot: <strong>{vr.suggestedSlot || vr.slotLabel}</strong>
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={vr.status === 'Confirmed'}
                  onClick={() => {
                    updateViewingStatus(vr.id, 'Confirmed');
                    pushToast(
                      'Viewing confirmed',
                      `${vr.buyerName}’s Viewings tab is now Confirmed.`,
                      'success'
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold ${
                    vr.status === 'Confirmed'
                      ? 'bg-verified-bg text-verified-text cursor-default'
                      : 'bg-gold-500 hover:bg-gold-600 text-navy-900'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{vr.status === 'Confirmed' ? 'Confirmed' : 'Confirm'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRescheduleId(vr.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-paper border border-navy-900/15 hover:bg-navy-900/5 px-3 py-2 text-xs font-semibold text-navy-900"
                >
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Suggest slot</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateViewingStatus(vr.id, 'Declined');
                    pushToast('Request declined', `${vr.buyerName} notified.`);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 px-3 py-2 text-xs font-semibold"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rescheduleId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Suggest another viewing slot"
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleSuggestSubmit}
            className="w-full max-w-sm rounded-3xl bg-paper p-6 space-y-4 shadow-2xl"
          >
            <h2 className="font-display text-lg font-bold text-navy-900">
              Suggest another slot
            </h2>
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="e.g. Sun 16:00"
              className="w-full rounded-xl border border-navy-900/20 bg-white px-3.5 py-2.5 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRescheduleId(null)}
                className="flex-1 rounded-xl border border-navy-900/15 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm py-2.5"
              >
                Send slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
