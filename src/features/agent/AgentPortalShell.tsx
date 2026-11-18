import React, { useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  Building2,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';
import { AgentBilling } from './AgentBilling';
import { AgentBuyers } from './AgentBuyers';
import { AgentDashboard } from './AgentDashboard';
import { AgentListings } from './AgentListings';
import { AgentSettings } from './AgentSettings';
import { AgentSignUp } from './AgentSignUp';
import { AgentViewings } from './AgentViewings';

const NAV_ITEMS = [
  { to: '/agent', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/agent/listings', label: 'Listings', icon: Building2 },
  { to: '/agent/viewings', label: 'Viewing requests', icon: Calendar },
  { to: '/agent/buyers', label: 'Matched buyers', icon: Users },
  { to: '/agent/billing', label: 'Billing', icon: CreditCard },
  { to: '/agent/settings', label: 'Settings', icon: Settings },
];

export const AgentPortalShell: React.FC = () => {
  const location = useLocation();
  const { state, signOutAgent } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!state.agentSession.signedIn) {
    return <AgentSignUp />;
  }

  const initials = state.agentSession.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const renderSidebarNav = () => (
    <nav aria-label="Agent portal navigation" className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? location.pathname === '/agent' || location.pathname === '/agent/'
          : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-gold-500 text-navy-900'
                : 'text-muted-navy hover:bg-navy-800 hover:text-paper'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[calc(100vh-44px)] bg-paper text-ink flex">
      {/* Desktop Navy Sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy-900 text-paper flex-col justify-between p-5 shrink-0 border-r border-navy-700">
        <div className="space-y-8">
          <div className="px-1">
            <Logo variant="full" theme="dark" size="sm" />
          </div>
          {renderSidebarNav()}
        </div>

        <div className="pt-4 border-t border-navy-700 space-y-3">
          <div className="rounded-xl bg-navy-800 border border-navy-700 p-3 text-xs">
            <p className="font-semibold text-gold-500">Founding agent trial</p>
            <p className="text-muted-navy mt-0.5">74 days free remaining</p>
          </div>
          <button
            type="button"
            onClick={signOutAgent}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-navy hover:text-paper hover:bg-navy-800 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            <span>Switch / sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 bg-navy-900 text-paper p-5 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Logo variant="full" theme="dark" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close portal menu"
                  className="p-2 rounded-lg text-muted-navy hover:text-paper"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>
              {renderSidebarNav()}
            </div>
            <button
              type="button"
              onClick={signOutAgent}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-navy hover:text-paper"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
              <span>Switch / sign out</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-navy-900/10 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open portal navigation"
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-paper text-navy-900"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <span className="font-display text-sm sm:text-base font-bold text-navy-900 truncate">
              {COPY.agentPortal.portalTitle}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-verified-bg border border-verified-border px-2.5 py-1 text-xs font-semibold text-verified-text">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Verified agent · BRN {state.agentSession.reraBrn}</span>
            </span>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-500 font-display text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <span className="hidden md:inline text-sm font-semibold text-navy-900">
                {state.agentSession.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Routes>
            <Route index element={<AgentDashboard />} />
            <Route path="listings" element={<AgentListings />} />
            <Route path="viewings" element={<AgentViewings />} />
            <Route path="buyers" element={<AgentBuyers />} />
            <Route path="billing" element={<AgentBilling />} />
            <Route path="settings" element={<AgentSettings />} />
            <Route path="*" element={<Navigate to="/agent" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
