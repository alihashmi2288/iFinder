import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { getAgentById } from '../../data/agents';
import { COPY } from '../../data/copy';
import { createViewingRequest } from '../../services/viewingService';
import { useAppStore } from '../../store/AppContext';
import {
  downloadViewingICS,
  formatAEDCompact,
  getUpcomingViewingSlots,
} from '../../utils/format';

export const ViewingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rankedMatches, addViewingRequest, pushToast } = useAppStore();

  const match =
    rankedMatches.find((m) => m.listing.id === id) ?? rankedMatches[0];
  const listing = match.listing;
  const agent = getAgentById(listing.agentId);

  const slots = useMemo(() => getUpcomingViewingSlots(), []);
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<{
    shortLabel: string;
    fullDateLabel: string;
    isoStart: string;
  } | null>(null);

  const activeSlot = slots.find((s) => s.id === selectedSlotId) ?? slots[0];

  const handleRequestViewing = async () => {
    if (!listing.verified || submitting) return;
    setSubmitting(true);
    try {
      const req = await createViewingRequest({
        listing,
        agent,
        buyerName: 'Sara',
        buyerMatchPercent: match.score,
        slotLabel: activeSlot.shortLabel,
        slotIsoStart: activeSlot.isoStart,
      });
      addViewingRequest(req);
      setConfirmedSlot(activeSlot);
      pushToast(
        'Viewing requested',
        `Sent to ${agent.name} for ${activeSlot.shortLabel}.`,
        'success'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col justify-between p-5 overflow-y-auto phone-scroll relative">
      <div className="space-y-5">
        {/* Header bar matching mockup: iFinder · Viewing */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-xl text-navy-900 hover:bg-navy-900/10"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="flex-1 rounded-xl bg-navy-900/8 px-4 py-2 text-center">
            <span className="font-display text-sm font-bold text-navy-900">
              {COPY.buyerApp.viewingHeader}
            </span>
          </div>
          <div className="w-9" />
        </div>

        <h1 className="font-display text-2xl font-bold text-navy-900">
          Request a viewing
        </h1>

        {/* Verified Agent Card matching mockup */}
        <div className="rounded-2xl bg-white border border-navy-900/12 p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-base font-bold text-navy-900">
              Verified agent
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-verified-bg border border-verified-border px-2 py-0.5 text-[11px] font-semibold text-verified-text">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>BRN {agent.reraBrn}</span>
            </span>
          </div>
          <p className="text-sm text-muted-light">RERA licence checked</p>
          <div className="pt-2 border-t border-navy-900/10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-500 text-xs font-bold flex items-center justify-center shrink-0">
              {agent.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy-900 truncate">
                {agent.name}
              </p>
              <p className="text-xs text-muted-light truncate">
                {agent.agency} · {listing.title} ({formatAEDCompact(listing.priceAED)})
              </p>
            </div>
          </div>
        </div>

        {/* Pick a slot matching mockup */}
        <div className="space-y-2.5">
          <h2 className="font-display text-lg font-bold text-navy-900">
            Pick a slot
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {slots.map((slot) => {
              const selected = slot.id === selectedSlotId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`min-h-[48px] rounded-xl px-3.5 py-2.5 text-left border transition-colors ${
                    selected
                      ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                      : 'bg-white border-navy-900/15 text-navy-900 hover:border-navy-900/35'
                  }`}
                >
                  <span className="block text-sm font-bold tabular-nums">
                    {slot.shortLabel}
                  </span>
                  <span className="block text-[11px] text-muted-light tabular-nums">
                    {slot.fullDateLabel.split('·')[0].trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary + Secondary CTAs matching mockup */}
      <div className="pt-6 space-y-2.5">
        <button
          type="button"
          disabled={!listing.verified || submitting}
          onClick={handleRequestViewing}
          className={`w-full min-h-[48px] rounded-xl font-bold text-base transition-colors ${
            listing.verified
              ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
              : 'bg-navy-900/10 text-muted-light cursor-not-allowed'
          }`}
        >
          {submitting ? 'Sending request...' : 'Request viewing'}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/app/chat/${listing.id}`)}
          className="w-full min-h-[46px] rounded-xl bg-white border border-navy-900/20 text-navy-900 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-navy-900/5"
        >
          <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
          <span>Chat with agent</span>
        </button>
      </div>

      {/* Confirmation Success Sheet */}
      {confirmedSlot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Viewing request confirmation"
          className="absolute inset-0 z-50 bg-black/55 flex items-end"
        >
          <div className="w-full rounded-t-3xl bg-paper p-6 space-y-4 shadow-2xl border-t border-navy-900/10">
            <div className="w-12 h-12 rounded-2xl bg-verified-bg border border-verified-border text-verified-text flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-extrabold text-navy-900">
                Request sent to {agent.name}
              </h2>
              <p className="text-sm text-muted-light leading-relaxed">
                Slot: <strong className="text-navy-900">{confirmedSlot.fullDateLabel}</strong>.
                You’ll get a reminder 24 hours before. Your details were shared
                only with {agent.agency}.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  downloadViewingICS({
                    title: listing.title,
                    location: listing.area,
                    agentName: agent.name,
                    agency: agent.agency,
                    isoStart: confirmedSlot.isoStart,
                  });
                  pushToast('Calendar file downloaded', 'ifinder-viewing.ics', 'success');
                }}
                className="w-full min-h-[46px] rounded-xl bg-white border border-navy-900/20 text-navy-900 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gold-100"
              >
                <CalendarPlus className="w-4 h-4" strokeWidth={1.75} />
                <span>Add to calendar</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/matches')}
                className="w-full min-h-[48px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
              >
                Back to matches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
