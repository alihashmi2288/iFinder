import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verified,
  size = 'sm',
  className = '',
}) => {
  const padding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  if (verified) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold whitespace-nowrap shrink-0 bg-verified-bg text-verified-text border-verified-border ${padding} ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
        <span>Verified</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold whitespace-nowrap shrink-0 bg-gold-100 text-navy-900 border-gold-600/40 ${padding} ${className}`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      <span>Verification pending</span>
    </span>
  );
};
