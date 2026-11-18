import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark';
  theme?: 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { box: 26, text: 'text-lg', gap: 'gap-2', bar: 'w-8 h-0.5', tag: 'text-xs' },
  sm: { box: 32, text: 'text-xl', gap: 'gap-2.5', bar: 'w-10 h-1', tag: 'text-xs' },
  md: { box: 42, text: 'text-2xl', gap: 'gap-3', bar: 'w-12 h-1', tag: 'text-sm' },
  lg: { box: 58, text: 'text-4xl', gap: 'gap-3.5', bar: 'w-14 h-1', tag: 'text-base' },
  xl: { box: 72, text: 'text-5xl', gap: 'gap-4', bar: 'w-16 h-1.5', tag: 'text-lg' },
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const cfg = SIZE_MAP[size];
  const finderColor = theme === 'dark' ? 'text-paper' : 'text-navy-900';
  const tagColor = theme === 'dark' ? 'text-paper/90' : 'text-muted-light';

  const markSvg = (
    <svg
      width={cfg.box}
      height={cfg.box}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="120" height="120" rx="28" fill="#E8B95C" />
      <g transform="rotate(-9 52 52)" opacity="0.32">
        <rect x="20" y="14" width="56" height="70" rx="10" fill="#18223F" />
      </g>
      <g transform="rotate(6 60 50)">
        <rect x="30" y="14" width="56" height="70" rx="10" fill="#18223F" />
        <path d="M58 30 L74 46 L42 46 Z" fill="#E8B95C" />
        <rect x="47" y="46" width="22" height="18" fill="#E8B95C" />
        <rect x="55" y="52" width="6" height="12" fill="#18223F" />
      </g>
      <path
        d="M22 101 H80"
        stroke="#18223F"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M69 92 L81 101 L69 110"
        fill="none"
        stroke="#18223F"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'mark') {
    return <span className={`inline-flex items-center ${className}`}>{markSvg}</span>;
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className={`inline-flex items-center ${cfg.gap}`}>
        {markSvg}
        <span
          className={`font-display font-extrabold tracking-tight leading-none select-none ${cfg.text}`}
        >
          <span className="text-gold-500">i</span>
          <span className={finderColor}>Finder</span>
        </span>
      </div>
      {showTagline && (
        <div className="mt-4 flex flex-col gap-2.5">
          <span className={`${cfg.bar} rounded-full bg-gold-500 inline-block`} />
          <p className={`${cfg.tag} font-medium ${tagColor}`}>
            Your next right swipe starts here
          </p>
        </div>
      )}
    </div>
  );
};
