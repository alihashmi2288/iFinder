import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Heart, Trash2 } from 'lucide-react';
import { PropertyImage } from '../../components/PropertyImage';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { useAppStore } from '../../store/AppContext';
import { formatAEDCompact, formatSqft } from '../../utils/format';

export const SavedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { savedMatches, removeSaved, pushToast } = useAppStore();
  const [sortBy, setSortBy] = useState<'match' | 'price'>('match');

  const sorted = useMemo(() => {
    const copy = [...savedMatches];
    if (sortBy === 'price') {
      return copy.sort((a, b) => a.listing.priceAED - b.listing.priceAED);
    }
    return copy.sort((a, b) => b.score - a.score);
  }, [savedMatches, sortBy]);

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-navy-900/10 shrink-0">
        <div>
          <h1 className="font-display text-lg font-bold text-navy-900">
            Saved homes ({sorted.length})
          </h1>
          <p className="text-xs text-muted-light">
            Shortlist matched to your quiz
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSortBy(sortBy === 'match' ? 'price' : 'match')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-navy-900/15 px-3 py-2 text-xs font-semibold text-navy-900 hover:bg-gold-100"
        >
          <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>{sortBy === 'match' ? 'Best match' : 'Price low–high'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto phone-scroll p-4 space-y-3">
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-900/8 flex items-center justify-center text-navy-900">
              <Heart className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              No saved homes yet
            </h2>
            <p className="text-sm text-muted-light max-w-[240px]">
              Swipe right or tap Save on properties in Matches to compare them
              and book a viewing.
            </p>
            <button
              type="button"
              onClick={() => navigate('/app/matches')}
              className="mt-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-5 py-2.5"
            >
              Back to Matches
            </button>
          </div>
        ) : (
          sorted.map(({ listing, score }) => (
            <article
              key={listing.id}
              className="rounded-2xl bg-white border border-navy-900/10 overflow-hidden shadow-xs"
            >
              <div className="flex gap-3 p-3">
                <button
                  type="button"
                  onClick={() => navigate(`/app/listing/${listing.id}`)}
                  className="w-24 h-24 rounded-xl overflow-hidden shrink-0"
                  aria-label={`Open ${listing.title}`}
                >
                  <PropertyImage
                    src={listing.photoUrl}
                    alt={listing.title}
                    aspectClass="w-24 h-24"
                  />
                </button>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/app/listing/${listing.id}`)}
                        className="text-left font-display text-sm font-bold text-navy-900 hover:underline leading-snug line-clamp-1"
                      >
                        {listing.title}
                      </button>
                      <span className="text-xs font-bold text-navy-900 bg-gold-100 px-2 py-0.5 rounded-md tabular-nums shrink-0">
                        {score}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-navy-900 tabular-nums mt-0.5">
                      {formatAEDCompact(listing.priceAED)} ·{' '}
                      {formatSqft(listing.sizeSqft)} · ROI {listing.roiPercent}%
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <VerifiedBadge verified={listing.verified} />
                    <button
                      type="button"
                      onClick={() => {
                        removeSaved(listing.id);
                        pushToast('Removed from saved', listing.title);
                      }}
                      aria-label={`Remove ${listing.title} from saved`}
                      className="p-2 rounded-lg text-muted-light hover:text-danger hover:bg-danger/10"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-3 pb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/app/listing/${listing.id}`)}
                  className="flex-1 min-h-[40px] rounded-xl border border-navy-900/15 text-xs font-semibold text-navy-900 hover:bg-paper"
                >
                  Details
                </button>
                <button
                  type="button"
                  disabled={!listing.verified}
                  onClick={() => navigate(`/app/viewing/${listing.id}`)}
                  className={`flex-1 min-h-[40px] rounded-xl text-xs font-bold ${
                    listing.verified
                      ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
                      : 'bg-navy-900/10 text-muted-light cursor-not-allowed'
                  }`}
                >
                  {listing.verified ? 'Request viewing' : 'Pending check'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
