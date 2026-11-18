import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useAppStore } from '../store/AppContext';

interface PhoneFrameProps {
  children: React.ReactNode;
  darkScreen?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  darkScreen = false,
}) => {
  const { state, skipAsSara } = useAppStore();

  return (
    <div className="min-h-[calc(100vh-44px)] bg-navy-900 text-paper flex flex-col sm:flex-row items-center justify-center sm:gap-10 lg:gap-14 sm:px-6 sm:py-6">
      {/* Desktop Phone Device Frame (390x844); full-screen on mobile <640px */}
      <div className="w-full h-[calc(100vh-44px)] sm:w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-68px)] sm:rounded-[44px] sm:border-[8px] sm:border-navy-700 sm:shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden relative flex flex-col bg-paper text-ink shrink-0">
        {/* Status Bar (visible inside frame on desktop) */}
        <div
          className={`hidden sm:flex items-center justify-between px-7 pt-3 pb-1.5 text-xs font-semibold shrink-0 relative z-30 select-none ${
            darkScreen ? 'bg-navy-900 text-paper' : 'bg-paper text-navy-900'
          }`}
        >
          <span className="tabular-nums w-12">9:41</span>
          {/* Dynamic Island */}
          <div
            aria-hidden="true"
            className="w-[104px] h-[26px] rounded-full bg-black mx-auto shadow-inner"
          />
          <div className="flex items-center gap-1.5 w-12 justify-end">
            <Signal className="w-3.5 h-3.5" strokeWidth={1.75} />
            <Wifi className="w-3.5 h-3.5" strokeWidth={1.75} />
            <Battery className="w-4 h-4" strokeWidth={1.75} />
          </div>
        </div>

        {/* Main App Content Viewport */}
        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Home Indicator */}
        <div
          className={`hidden sm:flex items-center justify-center py-2 shrink-0 ${
            darkScreen ? 'bg-navy-900' : 'bg-paper'
          }`}
        >
          <div
            aria-hidden="true"
            className={`w-32 h-1 rounded-full ${
              darkScreen ? 'bg-paper/30' : 'bg-navy-900/20'
            }`}
          />
        </div>
      </div>

      {/* Helpful Presenter Caption beside phone on desktop */}
      <aside className="hidden lg:flex flex-col max-w-sm gap-5 py-6">
        <Logo variant="full" theme="dark" size="md" showTagline />
        <div className="rounded-2xl bg-navy-800 border border-navy-700 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-500">
            Live Buyer Prototype
          </p>
          <h2 className="font-display text-xl font-bold text-paper leading-snug">
            Sara, 29 · Renting 1-bed in JLT
          </h2>
          <p className="text-sm text-muted-navy leading-relaxed">
            Budget around AED 1.2M. Every swipe right saves a home and updates
            Aisha Rahman’s live counters in the{' '}
            <Link
              to="/agent"
              className="text-gold-500 underline underline-offset-4 hover:text-gold-100"
            >
              Agent Portal
            </Link>
            .
          </p>
          <div className="pt-2 border-t border-navy-700 text-xs text-muted-navy space-y-1.5">
            <p>
              <strong className="text-paper">Keyboard:</strong> Left arrow = Skip,
              Right arrow = Save, Z = Undo
            </p>
            <p>
              <strong className="text-paper">Verification check:</strong> Listing
              #7 (Studio, Arjan) shows “Verification pending” with viewing
              disabled.
            </p>
          </div>
          {state.demoMode && !state.quizCompleted && (
            <button
              type="button"
              onClick={skipAsSara}
              className="w-full mt-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm py-2.5 px-4 transition-colors focus-visible:outline-2 focus-visible:outline-paper"
            >
              Skip quiz as Sara
            </button>
          )}
        </div>
        <p className="text-xs text-muted-navy">
          Prototype with sample data. Not final design.
        </p>
      </aside>
    </div>
  );
};
