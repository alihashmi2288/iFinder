import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Send, ShieldCheck } from 'lucide-react';
import { getAgentById } from '../../data/agents';
import { generateAgentChatReply } from '../../services/viewingService';
import { useAppStore } from '../../store/AppContext';
import { formatAEDCompact } from '../../utils/format';

const QUICK_REPLIES = [
  'Is it still available?',
  'Can I negotiate?',
  'Is parking included?',
];

export const ChatScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, rankedMatches, addChatMessage } = useAppStore();

  const match =
    rankedMatches.find((m) => m.listing.id === id) ?? rankedMatches[0];
  const listing = match.listing;
  const agent = getAgentById(listing.agentId);

  const threadMessages = state.chats.filter((m) => m.listingId === listing.id);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length, typing]);

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean) return;
    setInput('');

    addChatMessage({
      id: `msg-${Date.now()}-b`,
      listingId: listing.id,
      agentId: agent.id,
      sender: 'buyer',
      text: clean,
      timestamp: new Date().toISOString(),
    });

    setTyping(true);
    try {
      const replyText = await generateAgentChatReply({
        buyerText: clean,
        listing,
        agent,
      });
      addChatMessage({
        id: `msg-${Date.now()}-a`,
        listingId: listing.id,
        agentId: agent.id,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex-1 bg-paper text-ink flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-white border-b border-navy-900/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="min-w-[40px] min-h-[40px] -ml-1 flex items-center justify-center rounded-xl hover:bg-navy-900/10"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-500 text-xs font-bold flex items-center justify-center shrink-0">
            {agent.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-navy-900 truncate">
                {agent.name}
              </p>
              <ShieldCheck className="w-3.5 h-3.5 text-verified-text shrink-0" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] text-muted-light truncate">
              {listing.title} · {formatAEDCompact(listing.priceAED)}
            </p>
          </div>
        </div>

        {listing.verified && (
          <button
            type="button"
            onClick={() => navigate(`/app/viewing/${listing.id}`)}
            aria-label="Book viewing"
            className="min-h-[36px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 text-xs font-bold px-2.5 inline-flex items-center gap-1 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Book</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto phone-scroll p-4 space-y-3">
        <div className="rounded-xl bg-white border border-navy-900/10 p-2.5 text-[11px] text-muted-light text-center">
          Direct private thread with {agent.name} ({agent.agency} · BRN{' '}
          {agent.reraBrn}). Never shared with rival agents.
        </div>

        {threadMessages.map((msg) => {
          const isBuyer = msg.sender === 'buyer';
          return (
            <div
              key={msg.id}
              className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isBuyer
                    ? 'bg-navy-900 text-paper rounded-br-sm'
                    : 'bg-white border border-navy-900/10 text-navy-900 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white border border-navy-900/10 px-3.5 py-2.5 text-xs text-muted-light">
              {agent.name} is typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Replies + Input */}
      <div className="p-3 bg-white border-t border-navy-900/10 space-y-2 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_REPLIES.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              className="rounded-xl bg-paper border border-navy-900/15 hover:border-gold-500 px-2.5 py-1.5 text-xs font-medium text-navy-900 whitespace-nowrap shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            aria-label="Chat message"
            className="flex-1 min-h-[44px] rounded-xl border border-navy-900/15 bg-paper px-3.5 text-sm text-navy-900 focus:outline-2 focus:outline-gold-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-navy-900 flex items-center justify-center"
          >
            <Send className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </form>
      </div>
    </div>
  );
};
