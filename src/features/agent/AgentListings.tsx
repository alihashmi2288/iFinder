import React, { useState } from 'react';
import {
  FileUp,
  Loader2,
  Plus,
  RefreshCw,
  UploadCloud,
  X,
} from 'lucide-react';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { ALL_DUBAI_AREAS } from '../../data/copy';
import { importFeedAsync } from '../../services/agentService';
import { verifyAndBuildListing } from '../../services/listingService';
import { useAppStore } from '../../store/AppContext';
import { NearbyAmenity, PropertyType } from '../../types';
import { formatAEDFull, formatSqft } from '../../utils/format';

export const AgentListings: React.FC = () => {
  const { state, addListing, addFeedImport, pushToast } = useAppStore();

  const agentListings = state.listings.filter(
    (l) => l.agentId === state.agentSession.agentId
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [feedModalOpen, setFeedModalOpen] = useState(false);

  // Add listing state
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('JVC');
  const [priceAED, setPriceAED] = useState('1200000');
  const [sizeSqft, setSizeSqft] = useState('760');
  const [beds, setBeds] = useState('1');
  const [baths, setBaths] = useState('2');
  const [roiPercent, setRoiPercent] = useState('6.8');
  const [commuteMinutes, setCommuteMinutes] = useState('15');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [furnished, setFurnished] = useState(false);
  const [permitNo, setPermitNo] = useState('DLD-7901-2026');
  const [nearby, setNearby] = useState<NearbyAmenity[]>(['Metro']);
  const [photoName, setPhotoName] = useState('Listing_Living_Room.jpg');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [verifyingListing, setVerifyingListing] = useState(false);

  // Feed import state
  const [feedSource, setFeedSource] = useState<
    'Property Finder XML' | 'Bayut Feed' | 'CSV Upload'
  >('Property Finder XML');
  const [importingFeed, setImportingFeed] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const toggleNearby = (item: NearbyAmenity) => {
    setNearby((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Enter a listing title (e.g. "1-bed apartment, JVC").');
      return;
    }
    const price = Number(priceAED);
    const size = Number(sizeSqft);
    if (!price || price < 200000 || !size || size < 200) {
      setFormError('Enter a valid AED price and size in sq ft.');
      return;
    }
    setFormError(null);
    setVerifyingListing(true);
    try {
      const built = await verifyAndBuildListing(
        {
          title,
          area,
          priceAED: price,
          sizeSqft: size,
          beds: Number(beds),
          baths: Number(baths),
          roiPercent: Number(roiPercent) || 6.5,
          commuteMinutes: Number(commuteMinutes) || 18,
          nearby,
          propertyType,
          furnished,
          permitNo,
          description,
          agentId: state.agentSession.agentId,
        },
        true
      );
      addListing(built);
      setAddModalOpen(false);
      setTitle('');
      pushToast(
        built.verified ? 'Listing verified & live' : 'Listing saved (Pending)',
        built.verified
          ? `${built.title} is now visible in the Buyer App swipe deck.`
          : `${built.title} saved as Verification pending until a valid DLD permit is added.`,
        built.verified ? 'success' : 'default'
      );
    } finally {
      setVerifyingListing(false);
    }
  };

  const handleImportFeed = async () => {
    setImportingFeed(true);
    setImportProgress(25);
    const timer = window.setInterval(() => {
      setImportProgress((p) => Math.min(90, p + 20));
    }, 300);

    try {
      const result = await importFeedAsync(
        feedSource,
        state.agentSession.agentId
      );
      window.clearInterval(timer);
      setImportProgress(100);
      addFeedImport(result.summary, result.importedListings);
      setFeedModalOpen(false);
      pushToast(
        `${result.summary.importedCount} listings imported`,
        `${result.summary.pendingPermitCount} need a permit number before receiving Verified status.`,
        'success'
      );
    } finally {
      window.clearInterval(timer);
      setImportingFeed(false);
      setImportProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">
            Listings ({agentListings.length})
          </h1>
          <p className="text-sm text-muted-light">
            Verified listings appear in the Buyer App deck automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFeedModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-navy-900/15 hover:bg-navy-900/5 text-navy-900 font-semibold text-xs px-4 py-2.5"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Connect a feed</span>
          </button>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-xs px-4 py-2.5"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>Add listing</span>
          </button>
        </div>
      </div>

      {state.feedImports.length > 0 && (
        <div className="rounded-2xl bg-verified-bg border border-verified-border px-4 py-3 text-xs text-verified-text font-medium">
          Latest feed sync ({state.feedImports[0].source}):{' '}
          {state.feedImports[0].importedCount} listings imported,{' '}
          {state.feedImports[0].pendingPermitCount} need a permit number.
        </div>
      )}

      {/* Listings Table */}
      <div className="rounded-2xl bg-white border border-navy-900/12 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy-900/10 bg-paper/60 text-xs font-semibold text-muted-light">
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Permit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Saves</th>
                <th className="py-3 px-4 text-right">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/10 text-sm">
              {agentListings.map((listing) => {
                const isSavedByBuyer = state.savedIds.includes(listing.id);
                const reqCount = state.viewingRequests.filter(
                  (v) => v.listingId === listing.id
                ).length;
                const baseSaves = (Number(listing.id) || 3) * 3 + 4;
                return (
                  <tr
                    key={listing.id}
                    className="hover:bg-paper/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-bold text-navy-900">{listing.title}</p>
                      <p className="text-xs text-muted-light tabular-nums">
                        {formatSqft(listing.sizeSqft)} · ROI {listing.roiPercent}%
                      </p>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-light tabular-nums">
                      {listing.permitNo}
                    </td>
                    <td className="py-3 px-4">
                      <VerifiedBadge verified={listing.verified} />
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-navy-900 tabular-nums whitespace-nowrap">
                      {formatAEDFull(listing.priceAED)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-navy-900 font-medium">
                      {baseSaves + (isSavedByBuyer ? 1 : 0)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-navy-900 font-medium">
                      {reqCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Listing Modal */}
      {addModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add new listing"
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleCreateListing}
            className="w-full max-w-lg rounded-3xl bg-paper text-ink p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">
                Add property listing
              </h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Close add listing dialog"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Listing title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1-bed apartment, JVC"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm"
                >
                  {ALL_DUBAI_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Property type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value as PropertyType)
                  }
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Price (AED)
                </label>
                <input
                  type="number"
                  value={priceAED}
                  onChange={(e) => setPriceAED(e.target.value)}
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Size (sq ft)
                </label>
                <input
                  type="number"
                  value={sizeSqft}
                  onChange={(e) => setSizeSqft(e.target.value)}
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Beds / Baths
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    aria-label="Bedrooms"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                  />
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    aria-label="Bathrooms"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  ROI % / Commute (min)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={roiPercent}
                    onChange={(e) => setRoiPercent(e.target.value)}
                    aria-label="ROI percent"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                  />
                  <input
                    type="number"
                    value={commuteMinutes}
                    onChange={(e) => setCommuteMinutes(e.target.value)}
                    aria-label="Commute minutes"
                    className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  DLD Trakheesi Permit Number (e.g. DLD-7901-2026)
                </label>
                <input
                  type="text"
                  value={permitNo}
                  onChange={(e) => setPermitNo(e.target.value)}
                  placeholder="Leave blank or PENDING to test pending status"
                  className="w-full rounded-xl border border-navy-900/20 bg-white px-3 py-2 text-sm"
                />
                <p className="text-[11px] text-muted-light mt-1">
                  Valid DLD permit + RERA BRN grants the green Verified badge.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-navy-900 mb-1.5">
                Nearby amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {(['Metro', 'School', 'Mosque'] as NearbyAmenity[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleNearby(n)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${
                      nearby.includes(n)
                        ? 'bg-gold-100 border-gold-500 text-navy-900'
                        : 'bg-white border-navy-900/15 text-navy-900'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <label className="inline-flex items-center gap-1.5 text-xs font-medium ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={furnished}
                    onChange={(e) => setFurnished(e.target.checked)}
                    className="accent-navy-900"
                  />
                  <span>Furnished</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between rounded-xl border border-dashed border-navy-900/25 bg-white px-3.5 py-2.5 text-xs cursor-pointer">
                <span className="inline-flex items-center gap-2 font-medium text-navy-900">
                  <FileUp className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                  <span>Photos: {photoName}</span>
                </span>
                <span className="text-gold-600 font-semibold">Select</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const count = e.target.files?.length ?? 0;
                    if (count > 0) setPhotoName(`${count} photo(s) attached`);
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            {formError && <p className="text-xs text-danger">{formError}</p>}

            <button
              type="submit"
              disabled={verifyingListing}
              className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm flex items-center justify-center gap-2"
            >
              {verifyingListing && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>
                {verifyingListing
                  ? 'Checking RERA & DLD permit...'
                  : 'Verify & publish listing'}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* Connect a Feed Modal */}
      {feedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect a property feed"
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-paper text-ink p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-900">
                Connect a listing feed
              </h2>
              <button
                type="button"
                onClick={() => setFeedModalOpen(false)}
                aria-label="Close feed modal"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-2">
              {(
                [
                  'Property Finder XML',
                  'Bayut Feed',
                  'CSV Upload',
                ] as const
              ).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setFeedSource(src)}
                  className={`w-full text-left rounded-xl px-4 py-3 border text-sm font-semibold flex items-center justify-between ${
                    feedSource === src
                      ? 'bg-gold-100 border-2 border-gold-500 text-navy-900'
                      : 'bg-white border-navy-900/15 text-navy-900'
                  }`}
                >
                  <span>{src}</span>
                  <UploadCloud className="w-4 h-4 text-gold-600" strokeWidth={1.75} />
                </button>
              ))}
            </div>

            {importingFeed && (
              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full bg-navy-900/10 overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all duration-200"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-light">
                  Parsing feed & validating DLD permits...
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={importingFeed}
              onClick={handleImportFeed}
              className="w-full min-h-[46px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm"
            >
              {importingFeed ? 'Importing...' : `Import from ${feedSource}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
