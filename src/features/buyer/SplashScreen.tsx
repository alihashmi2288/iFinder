import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { COPY } from '../../data/copy';
import { useAppStore } from '../../store/AppContext';

interface SplashScreenProps {
  onContinue: () => void;
  onSkipAsSara: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinue,
  onSkipAsSara,
}) => {
  const { state } = useAppStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 bg-navy-900 text-paper flex flex-col justify-between px-6 py-10">
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Logo variant="full" theme="dark" size="lg" showTagline />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-2xl font-display font-bold leading-snug text-paper"
        >
          {COPY.brand.campaignLine}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-3 text-sm text-muted-navy leading-relaxed"
        >
          {COPY.buyerApp.splashSubtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: ready ? 1 : 0.9, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3 pb-2"
      >
        <button
          type="button"
          onClick={onContinue}
          className="w-full min-h-[48px] rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-base flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-paper"
        >
          <span>{COPY.buyerApp.getStarted}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </button>

        {state.demoMode && (
          <button
            type="button"
            onClick={onSkipAsSara}
            className="w-full min-h-[44px] rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-gold-500 font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            <span>{COPY.buyerApp.skipAsSara}</span>
          </button>
        )}

        <p className="text-center text-[11px] text-muted-navy pt-1">
          Free for buyers · Verified DLD listings
        </p>
      </motion.div>
    </div>
  );
};
