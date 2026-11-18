import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Flag,
  GraduationCap,
  Heart,
  MessageSquare,
  ShieldCheck,
  Star,
  TrainFront,
  TrendingUp,
} from 'lucide-react';
import { PropertyImage } from '../../components/PropertyImage';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { getAgentById } from '../../data/agents';
import { useAppStore } from '../../store/AppContext';
import { formatAEDFull, formatSqft } from '../../utils/format';

export const ListingDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, rankedMatches, recordSwipe, removeSaved, submitReport, pushToast } =
    useAppStore();

  const match =
    rankedMatches.find((m) => m.listing.id === id) ?? rankedMatches[0];
  const listing = match.listing;
  const agent = getAgentById(listing.agentId);
  const isSaved = state.savedIds.includes(listing.id);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Price is wrong');

  const photos =
    listing.galleryUrls.length > 0 ? listing.galleryUrls : [listing.photoUrl];
  const estimatedAnnualRent = Math.round(
    listing.priceAED * (listing.roiPercent / 100)
  );

  const toggleSave = () => {
    if (isSaved) {
      removeSaved(listing.id);
      pushToast('Removed from saved', listing.title);
    } else {
      recordSwipe(listing, 'right');
      pushToast('Saved to shortlist', listing.title, 'success');
    }
  };

  const walkMinutes = (amenity: 'Metro' | 'School' | 'Mosque') => {
    if (amenity === 'Metro') return `${Math.max(4, Math.round(listing.commuteMinutes * 0.4))} min walk`;
    if (amenity === 'School') return `${Math.max(3, Math.round(listing.commuteMinutes * 0.3))} min walk`;
    return '3 min walk';
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col overflow-hidden relative">
      {/* Top Overlay Header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-navy-900/10 bg-paper shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="min-w-[40px] min-h-[40px] -ml-1.5 flex items-center justify-center rounded-xl hover:bg-navy-900/10 text-navy-900"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <span className="font-display text-sm font-bold text-navy-900 truncate px-2">
          {listing.area} · {match.score}% match
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSave}
            aria-label={isSaved ? 'Remove from saved' : 'Save home'}
            className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl transition-colors ${
              isSaved
                ? 'bg-gold-500 text-navy-900'
                : 'hover:bg-navy-900/10 text-navy-900'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-navy-900' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            aria-label="Report listing"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl hover:bg-danger/10 text-muted-light hover:text-danger"
          >
            <Flag className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Carousel */}
        <div className="relative">
          <PropertyImage
            src={photos[photoIdx]}
            alt={`${listing.title} photo ${photoIdx + 1}`}
            aspectClass="aspect-[4/3]"
          />
          <div className="absolute top-3 left-3">
            <VerifiedBadge verified={listing.verified} />
          </div>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() =>
                  setPhotoIdx((photoIdx - 1 + photos.length) % photos.length)
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/75 text-paper flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setPhotoIdx((photoIdx + 1) % photos.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/75 text-paper flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Show photo ${idx + 1}`}
                    onClick={() => setPhotoIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === photoIdx ? 'w-5 bg-gold-500' : 'w-1.5 bg-paper/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h1 className="font-display text-xl font-extrabold text-navy-900 leading-tight">
                {listing.title}
              </h1>
              <span className="text-[11px] text-muted-light shrink-0 pt-1">
                Sample listing
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-navy-900 tabular-nums mt-1">
              {formatAEDFull(listing.priceAED)}
            </p>
            <p className="text-xs text-muted-light mt-0.5">
              Permit: {listing.permitNo} · Listed {listing.listedDaysAgo === 0 ? 'today' : `${listing.listedDaysAgo}d ago`}
            </p>
          </div>

          {!listing.verified && (
            <div className="rounded-2xl bg-gold-100 border border-gold-600/40 p-3.5 flex items-start gap-2.5 text-navy-900">
              <AlertCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-xs leading-relaxed">
                <p className="font-bold">Verification pending</p>
                <p>
                  Waiting for agent licence and DLD permit check. Viewing
                  requests unlock once verified.
                </p>
              </div>
            </div>
          )}

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: 'Bedrooms',
                val: listing.beds === 0 ? 'Studio' : `${listing.beds} bed`,
              },
              { label: 'Bathrooms', val: `${listing.baths} bath` },
              { label: 'Size', val: formatSqft(listing.sizeSqft) },
              { label: 'Est. ROI', val: `${listing.roiPercent}%` },
              { label: 'Commute', val: `${listing.commuteMinutes} min` },
              {
                label: 'Furnished',
                val: listing.furnished ? 'Yes' : 'Unfurnished',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white border border-navy-900/10 p-2.5"
              >
                <p className="text-[11px] text-muted-light">{stat.label}</p>
                <p className="text-xs font-bold text-navy-900 tabular-nums mt-0.5">
                  {stat.val}
                </p>
              </div>
            ))}
          </div>

          {/* ROI Explainer */}
          <div className="rounded-2xl bg-navy-900 text-paper p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <TrendingUp className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <p className="text-xs font-semibold text-gold-500">
                  Estimated annual rent
                </p>
                <p className="text-xs text-muted-navy">
                  Price × {listing.roiPercent}% net yield (sample figure)
                </p>
              </div>
            </div>
            <p className="font-display text-base font-extrabold tabular-nums text-paper shrink-0">
              {formatAEDFull(estimatedAnnualRent)}/yr
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h2 className="font-display text-sm font-bold text-navy-900">
              About this home
            </h2>
            <p className="text-sm text-muted-light leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Nearby */}
          <div className="space-y-2">
            <h2 className="font-display text-sm font-bold text-navy-900">
              Nearby
            </h2>
            <div className="rounded-2xl bg-white border border-navy-900/10 divide-y divide-navy-900/10">
              {listing.nearby.length === 0 ? (
                <p className="p-3 text-xs text-muted-light">
                  Quiet residential district · 10 min drive to retail centre
                </p>
              ) : (
                listing.nearby.map((item) => (
                  <div
                    key={item}
                    className="px-3.5 py-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="inline-flex items-center gap-2 font-semibold text-navy-900">
                      {item === 'Metro' && (
                        <TrainFront className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                      )}
                      {item === 'School' && (
                        <GraduationCap className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                      )}
                      {item === 'Mosque' && (
                        <Building2 className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                      )}
                      <span>Nearest {item.toLowerCase()}</span>
                    </span>
                    <span className="text-muted-light tabular-nums">
                      {walkMinutes(item)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Verified Agent Card */}
          <div className="rounded-2xl bg-white border border-navy-900/10 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-navy-900 text-gold-500 font-display font-bold flex items-center justify-center shrink-0">
              {agent.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-navy-900 truncate">
                  {agent.name}
                </p>
                <ShieldCheck className="w-4 h-4 text-verified-text shrink-0" strokeWidth={1.75} />
              </div>
              <p className="text-xs text-muted-light truncate">
                {agent.agency} · BRN {agent.reraBrn}
              </p>
              <p className="text-[11px] text-muted-light inline-flex items-center gap-1 mt-0.5 tabular-nums">
                <Star className="w-3 h-3 text-gold-600 fill-gold-500" strokeWidth={1.75} />
                <span>
                  {agent.rating} ({agent.reviewCount}) · {agent.responseTime}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-paper/95 backdrop-blur-sm border-t border-navy-900/10 p-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/app/chat/${listing.id}`)}
          className="min-h-[46px] px-3.5 rounded-xl bg-white border border-navy-900/20 text-navy-900 font-semibold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-navy-900/5 shrink-0"
        >
          <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
          <span>Chat with agent</span>
        </button>

        <button
          type="button"
          disabled={!listing.verified}
          onClick={() => navigate(`/app/viewing/${listing.id}`)}
          className={`flex-1 min-h-[46px] rounded-xl font-bold text-sm transition-colors ${
            listing.verified
              ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
              : 'bg-navy-900/10 text-muted-light cursor-not-allowed'
          }`}
        >
          {listing.verified ? 'Request viewing' : 'Verification pending'}
        </button>
      </div>

      {/* Report Dialog */}
      {reportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report wrong listing"
          className="absolute inset-0 z-50 bg-black/50 flex items-end"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReport({
                id: `rep-${Date.now()}`,
                listingId: listing.id,
                reason: reportReason,
                createdAt: new Date().toISOString(),
              });
              setReportOpen(false);
              pushToast('Report submitted', 'Our verification team will review this listing.', 'success');
            }}
            className="w-full rounded-t-3xl bg-paper p-5 space-y-3"
          >
            <h2 className="font-display text-lg font-bold text-navy-900">
              Report wrong listing
            </h2>
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
                  name="detail-report"
                  checked={reportReason === reason}
                  onChange={() => setReportReason(reason)}
                  className="accent-navy-900"
                />
                <span className="font-medium">{reason}</span>
              </label>
            ))}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-navy-900/15 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-xl bg-danger text-paper text-sm font-bold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
