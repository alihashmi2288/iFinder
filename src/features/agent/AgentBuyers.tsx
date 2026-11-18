import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { MatchedBuyer } from '../../types';
import { formatAEDCompact } from '../../utils/format';

export const AgentBuyers: React.FC = () => {
  const { state, addChatMessage, pushToast } = useAppStore();
  const [activeBuyer, setActiveBuyer] = useState<MatchedBuyer | null>(null);
  const [replyText, setReplyText] = useState('');

  const activeListingId =
    activeBuyer?.savedListingIds[0] ?? '1';
  const thread = state.chats.filter((m) => m.listingId === activeListingId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = replyText.trim();
    if (!clean || !activeBuyer) return;
    addChatMessage({
      id: `msg-agent-${Date.now()}`,
      listingId: activeListingId,
      agentId: state.agentSession.agentId,
      sender: 'agent',
      text: clean,
      timestamp: new Date().toISOString(),
    });
    setReplyText('');
    pushToast(
      `Message sent to ${activeBuyer.firstName}`,
      'Visible in the Buyer App chat thread.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Matched buyers ({state.matchedBuyers.length})
        </h1>
        <p className="text-sm text-muted-light">
          Anonymised profiles of buyers whose quiz & swipes match your verified
          inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.matchedBuyers.map((buyer) => {
          const savedListings = state.listings.filter((l) =>
            buyer.savedListingIds.includes(l.id)
          );
          return (
            <div
              key={buyer.id}
              className="rounded-2xl bg-white border border-navy-900/12 p-5 flex flex-col justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy-900">
                      {buyer.firstName}, {buyer.age}
                    </h2>
                    <p className="text-xs text-muted-light">
                      {buyer.currentArea}
                    </p>
                  </div>
                  <span className="rounded-lg bg-gold-100 text-navy-900 px-2.5 py-1 text-xs font-bold tabular-nums">
                    {buyer.matchPercent}% match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="rounded-xl bg-paper p-2.5">
                    <p className="text-muted-light">Budget</p>
                    <p className="font-bold text-navy-900 mt-0.5">
                      {buyer.budgetLabel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-paper p-2.5">
                    <p className="text-muted-light">Goal</p>
                    <p className="font-bold text-navy-900 mt-0.5">
                      {buyer.goalLabel}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-light">
                  <strong className="text-navy-900">Preferred areas:</strong>{' '}
                  {buyer.preferredAreas.join(', ')}
                </p>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-navy-900">
                    Saved of your listings:
                  </p>
                  <div className="space-y-1">
                    {savedListings.slice(0, 3).map((l) => (
                      <p
                        key={l.id}
                        className="text-xs text-muted-light tabular-nums"
                      >
                        · {l.title} ({formatAEDCompact(l.priceAED)})
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveBuyer(buyer)}
                className="w-full min-h-[42px] rounded-xl bg-navy-900 hover:bg-navy-800 text-paper font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-gold-500" strokeWidth={1.75} />
                <span>Message {buyer.firstName}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Shared Chat Drawer */}
      {activeBuyer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Chat with ${activeBuyer.firstName}`}
          className="fixed inset-0 z-50 bg-black/50 flex justify-end"
        >
          <div className="w-full max-w-md bg-paper text-ink h-full flex flex-col shadow-2xl">
            <div className="p-4 bg-white border-b border-navy-900/10 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-navy-900">
                  Chat with {activeBuyer.firstName}
                </h2>
                <p className="text-xs text-muted-light">
                  Synced with Buyer App thread
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveBuyer(null)}
                aria-label="Close chat drawer"
                className="p-2 rounded-xl hover:bg-navy-900/10"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {thread.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        isAgent
                          ? 'bg-navy-900 text-paper rounded-br-sm'
                          : 'bg-white border border-navy-900/10 text-navy-900 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-navy-900/10 flex gap-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${activeBuyer.firstName}...`}
                className="flex-1 rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2.5 text-sm focus:outline-2 focus:outline-gold-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                aria-label="Send message"
                className="min-w-[44px] min-h-[44px] rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-navy-900 flex items-center justify-center"
              >
                <Send className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
