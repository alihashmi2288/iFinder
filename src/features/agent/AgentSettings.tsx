import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';

export const AgentSettings: React.FC = () => {
  const { state, updateAgentSession, pushToast } = useAppStore();
  const [name, setName] = useState(state.agentSession.name);
  const [agency, setAgency] = useState(state.agentSession.agency);
  const [phone, setPhone] = useState(state.agentSession.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgentSession({ name, agency, phone });
    pushToast('Settings saved', 'Agent profile updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Settings
        </h1>
        <p className="text-sm text-muted-light">
          Manage brokerage contact details and RERA verification status.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl bg-white border border-navy-900/12 p-6 space-y-4 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Agency
            </label>
            <input
              type="text"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Mobile phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-navy-900/20 bg-paper px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              RERA Broker Number (verified, read-only)
            </label>
            <div className="flex items-center justify-between rounded-xl border border-verified-border bg-verified-bg/60 px-3.5 py-2 text-sm font-bold text-verified-text tabular-nums">
              <span>BRN {state.agentSession.reraBrn}</span>
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-navy-900/10 space-y-2.5">
          <p className="text-xs font-semibold text-navy-900">Notifications</p>
          <label className="flex items-center justify-between text-sm text-navy-900 cursor-pointer">
            <span>Instant alerts on new viewing requests</span>
            <input
              type="checkbox"
              checked={state.agentSession.notifyNewRequests}
              onChange={(e) =>
                updateAgentSession({ notifyNewRequests: e.target.checked })
              }
              className="w-4 h-4 accent-navy-900"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-navy-900 cursor-pointer">
            <span>Notify when a matched buyer saves my listing</span>
            <input
              type="checkbox"
              checked={state.agentSession.notifyBuyerSaves}
              onChange={(e) =>
                updateAgentSession({ notifyBuyerSaves: e.target.checked })
              }
              className="w-4 h-4 accent-navy-900"
            />
          </label>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-5 py-2.5"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};
