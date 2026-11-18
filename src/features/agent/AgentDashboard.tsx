import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import { COPY } from '../../data/copy';
import { WEEKLY_ACTIVITY_SERIES } from '../../data/seed';
import { useAppStore } from '../../store/AppContext';
import { formatAEDCompact } from '../../utils/format';

export const AgentDashboard: React.FC = () => {
  const { state, agentDashboardStats, updateViewingStatus, pushToast } =
    useAppStore();

  const agentRequests = state.viewingRequests.filter(
    (vr) => vr.agentId === state.agentSession.agentId
  );

  const maxSaves = Math.max(...WEEKLY_ACTIVITY_SERIES.map((d) => d.saves), 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">
            Dashboard
          </h1>
          <p className="text-sm text-muted-light">
            Live buyer matches and viewing requests for {state.agentSession.agency}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/agent/listings"
            className="rounded-xl bg-navy-900 hover:bg-navy-800 text-paper font-semibold text-xs px-4 py-2.5 transition-colors"
          >
            Add listing or feed
          </Link>
        </div>
      </div>

      {/* Three Stat Cards matching mockup exactly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-navy-900/12 p-5 flex flex-col justify-between shadow-xs">
          <p className="text-sm font-medium text-muted-light">
            New viewing requests
          </p>
          <p className="font-display text-4xl font-extrabold text-navy-900 tabular-nums my-2">
            {agentDashboardStats.newRequestsCount}
          </p>
          <p className="text-xs text-muted-light">from matched buyers</p>
        </div>

        <div className="rounded-2xl bg-white border border-navy-900/12 p-5 flex flex-col justify-between shadow-xs">
          <p className="text-sm font-medium text-muted-light">
            Buyers who saved your listings
          </p>
          <p className="font-display text-4xl font-extrabold text-navy-900 tabular-nums my-2">
            {agentDashboardStats.weeklySavesCount}
          </p>
          <p className="text-xs text-muted-light">this week</p>
        </div>

        <div className="rounded-2xl bg-gold-100 border-2 border-gold-500 p-5 flex flex-col justify-between shadow-xs">
          <p className="text-sm font-semibold text-navy-900">Your plan</p>
          <p className="font-display text-2xl font-extrabold text-navy-900 my-2">
            {COPY.agentPortal.planHeadline}
          </p>
          <p className="text-xs font-medium text-navy-900/80">
            {COPY.agentPortal.planSubline}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-light">
        {COPY.agentPortal.dashboardFootnote}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Activity Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-navy-900/12 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">
                7-day buyer activity
              </h2>
              <p className="text-xs text-muted-light">
                Saves (navy) & viewing requests (gold) · sample figures
              </p>
            </div>
          </div>

          <div className="pt-2">
            <svg
              viewBox="0 0 320 150"
              className="w-full h-40 overflow-visible"
              role="img"
              aria-label="7-day buyer saves and viewing requests chart"
            >
              {WEEKLY_ACTIVITY_SERIES.map((d, i) => {
                const x = 14 + i * 44;
                const saveHeight = Math.round((d.saves / maxSaves) * 95);
                const reqHeight = d.requests * 22;
                return (
                  <g key={d.day}>
                    <rect
                      x={x}
                      y={115 - saveHeight}
                      width={16}
                      height={saveHeight}
                      rx={4}
                      fill="#18223F"
                    />
                    {d.requests > 0 && (
                      <rect
                        x={x + 18}
                        y={115 - reqHeight}
                        width={10}
                        height={reqHeight}
                        rx={3}
                        fill="#E8B95C"
                      />
                    )}
                    <text
                      x={x + 12}
                      y={136}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#5B627A"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent Viewing Requests */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-navy-900/12 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-900">
              Recent viewing requests
            </h2>
            <Link
              to="/agent/viewings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-gold-600"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="divide-y divide-navy-900/10">
            {agentRequests.slice(0, 5).map((vr) => {
              const listing = state.listings.find((l) => l.id === vr.listingId);
              return (
                <div
                  key={vr.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy-900">
                      {vr.buyerName}{' '}
                      <span className="text-xs font-semibold text-gold-600 tabular-nums">
                        · {vr.buyerMatchPercent}% match
                      </span>
                    </p>
                    <p className="text-xs text-muted-light truncate tabular-nums">
                      {listing?.title} ({listing ? formatAEDCompact(listing.priceAED) : ''}) · {vr.slotLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {vr.status === 'Requested' ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateViewingStatus(vr.id, 'Confirmed');
                          pushToast(
                            'Viewing confirmed',
                            `${vr.buyerName} notified in the Buyer App.`,
                            'success'
                          );
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-xs px-3 py-1.5"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>Confirm</span>
                      </button>
                    ) : (
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          vr.status === 'Confirmed' || vr.status === 'Completed'
                            ? 'bg-verified-bg text-verified-text'
                            : 'bg-paper text-muted-light'
                        }`}
                      >
                        {vr.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
