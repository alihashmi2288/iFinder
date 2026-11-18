import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, RotateCcw, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { useAppStore } from '../store/AppContext';

export const PresenterBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { state, setDemoMode, resetDemo } = useAppStore();

  const isWebsite = location.pathname === '/';
  const isBuyer = location.pathname.startsWith('/app');
  const isAgent = location.pathname.startsWith('/agent');

  if (collapsed) {
    return (
      <div className="fixed top-2 right-3 z-[80]">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand presenter bar"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800/95 border border-navy-700 px-3 py-1.5 text-xs font-medium text-paper shadow-md hover:bg-navy-700 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
        >
          <Logo variant="mark" size="xs" />
          <span>Presenter</span>
          <ChevronDown className="w-3.5 h-3.5 text-gold-500" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Presenter controls"
      className="sticky top-0 z-[80] w-full bg-navy-900/95 backdrop-blur-sm border-b border-navy-700 text-paper"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/"
            aria-label="iFinder Home"
            className="inline-flex items-center gap-2 shrink-0 focus-visible:outline-2 focus-visible:outline-gold-500 rounded-md"
          >
            <Logo variant="mark" size="xs" />
            <span className="hidden md:inline text-xs font-semibold text-muted-navy whitespace-nowrap">
              Presenter
            </span>
          </Link>

          <nav
            aria-label="Prototype switcher"
            className="flex items-center gap-1 bg-navy-800 border border-navy-700 rounded-lg p-0.5"
          >
            <Link
              to="/"
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isWebsite
                  ? 'bg-gold-500 text-navy-900 font-semibold'
                  : 'text-muted-navy hover:text-paper'
              }`}
            >
              Website
            </Link>
            <Link
              to="/app"
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isBuyer
                  ? 'bg-gold-500 text-navy-900 font-semibold'
                  : 'text-muted-navy hover:text-paper'
              }`}
            >
              Buyer App
            </Link>
            <Link
              to="/agent"
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isAgent
                  ? 'bg-gold-500 text-navy-900 font-semibold'
                  : 'text-muted-navy hover:text-paper'
              }`}
            >
              Agent Portal
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={state.demoMode}
            onClick={() => setDemoMode(!state.demoMode)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500 ${
              state.demoMode
                ? 'bg-gold-500/15 border-gold-500/60 text-gold-500'
                : 'bg-navy-800 border-navy-700 text-muted-navy hover:text-paper'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Demo mode: {state.demoMode ? 'On' : 'Off'}</span>
            <span className="sm:hidden">{state.demoMode ? 'Demo On' : 'Demo Off'}</span>
          </button>

          <button
            type="button"
            onClick={resetDemo}
            aria-label="Reset demo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 border border-navy-700 px-2 py-1 sm:px-2.5 text-xs font-medium text-paper hover:bg-navy-700 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <RotateCcw className="w-3.5 h-3.5 text-muted-navy" strokeWidth={1.75} />
            <span className="hidden sm:inline">Reset demo</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse presenter bar"
            className="p-1.5 rounded-lg text-muted-navy hover:text-paper hover:bg-navy-800 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <ChevronUp className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
};
