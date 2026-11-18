import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, MessageSquare, Star, X } from 'lucide-react';
import { getAgentById } from '../../data/agents';
import { useAppStore } from '../../store/AppContext';
import { ViewingRequest } from '../../types';
import { formatAEDCompact } from '../../utils/format';

export const ViewingsTabScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    updateViewingStatus,
    submitRating,
    pushToast,
  } = useAppStore();

  const [ratingTarget, setRatingTarget] = useState<ViewingRequest | null>(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  // Show Sara's own viewing requests first, plus any created in this session
  const buyerViewings = state.viewingRequests.filter(
    (vr) => vr.buyerName === 'Sara' || !vr.id.startsWith('vr-seed-')
  );

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingTarget) return;
    submitRating({
      viewingId: ratingTarget.id,
      agentId: ratingTarget.agentId,
      stars,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setRatingTarget(null);
    setComment('');
    pushToast('Thank you for rating your agent', `${stars} out of 5 stars saved.`, 'success');
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col overflow-hidden relative">
      <div className="px-4 pt-3 pb-2.5 border-b border-navy-900/10 shrink-0">
        <h1 className="font-display text-lg font-bold text-navy-900">
          Your viewings ({buyerViewings.length})
        </h1>
        <p className="text-xs text-muted-light">
          Live status synced with the Agent Portal
        </p>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll p-4 space-y-3">
        {buyerViewings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-900/8 flex items-center justify-center text-navy-900">
              <Calendar className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              No viewings requested yet
            </h2>
            <p className="text-sm text-muted-light max-w-[240px]">
              Open any verified home from Matches or Saved and pick a weekend
              slot.
            </p>
            <button
              type="button"
              onClick={() => navigate('/app/matches')}
              className="mt-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-5 py-2.5"
            >
              Browse Matches
            </button>
          </div>
        ) : (
          buyerViewings.map((vr) => {
            const listing = state.listings.find((l) => l.id === vr.listingId);
            const agent = getAgentById(vr.agentId);
            const existingRating = state.ratings.find(
              (r) => r.viewingId === vr.id
            );

            const statusStyles =
              vr.status === 'Confirmed' || vr.status === 'Completed'
                ? 'bg-verified-bg text-verified-text border-verified-border'
                : vr.status === 'Declined'
                ? 'bg-danger/10 text-danger border-danger/30'
                : 'bg-gold-100 text-navy-900 border-gold-500';

            return (
              <article
                key={vr.id}
                className="rounded-2xl bg-white border border-navy-900/10 p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-navy-900">
                      {listing ? listing.title : 'Dubai Property'}
                    </p>
                    <p className="text-xs text-muted-light tabular-nums">
                      {listing ? formatAEDCompact(listing.priceAED) : ''} · Slot:{' '}
                      {vr.suggestedSlot || vr.slotLabel}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${statusStyles}`}
                  >
                    {vr.status}
                  </span>
                </div>

                <div className="text-xs text-muted-light">
                  Agent: <strong className="text-navy-900">{agent.name}</strong>{' '}
                  ({agent.agency})
                </div>

                {existingRating ? (
                  <div className="rounded-xl bg-verified-bg/60 border border-verified-border px-3 py-2 flex items-center gap-2 text-xs text-verified-text">
                    <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>
                      Rated {existingRating.stars}/5 stars
                      {existingRating.comment ? ` — “${existingRating.comment}”` : ''}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/app/chat/${vr.listingId}`)}
                      className="flex-1 min-h-[38px] rounded-xl border border-navy-900/15 text-xs font-semibold text-navy-900 inline-flex items-center justify-center gap-1.5 hover:bg-paper"
                    >
                      <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Chat</span>
                    </button>

                    {state.demoMode && vr.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateViewingStatus(vr.id, 'Completed');
                          setRatingTarget(vr);
                        }}
                        className="flex-1 min-h-[38px] rounded-xl bg-navy-900 text-gold-500 text-xs font-semibold px-3"
                      >
                        Simulate viewing done
                      </button>
                    )}

                    {vr.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => setRatingTarget(vr)}
                        className="flex-1 min-h-[38px] rounded-xl bg-gold-500 text-navy-900 text-xs font-bold px-3"
                      >
                        Rate your agent
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Rate Agent Modal */}
      {ratingTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rate your agent"
          className="absolute inset-0 z-50 bg-black/55 flex items-end"
        >
          <form
            onSubmit={handleRatingSubmit}
            className="w-full rounded-t-3xl bg-paper p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Rate your agent
              </h2>
              <button
                type="button"
                onClick={() => setRatingTarget(null)}
                aria-label="Close rating dialog"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-xs text-muted-light">
              How was your viewing with{' '}
              <strong className="text-navy-900">
                {getAgentById(ratingTarget.agentId).name}
              </strong>
              ?
            </p>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  aria-label={`${n} stars`}
                  className="p-2 rounded-xl hover:bg-gold-100"
                >
                  <Star
                    className={`w-7 h-7 ${
                      n <= stars
                        ? 'text-gold-600 fill-gold-500'
                        : 'text-navy-900/20'
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional feedback (e.g. punctual, clear DLD breakdown)..."
              className="w-full rounded-xl border border-navy-900/15 bg-white p-3 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
            />

            <button
              type="submit"
              className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
            >
              Submit rating
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
