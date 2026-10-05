import React from 'react';

interface KaagazLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const KaagazLogo: React.FC<KaagazLogoProps> = ({
  size = 32,
  className = '',
  showText = true,
  textColor = 'text-[var(--primary)]',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Origami 'K' + Verified Checkmark Geometric Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="kaagaz-stem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="kaagaz-upper-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="kaagaz-lower-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="kaagaz-check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <filter id="kaagaz-subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Stem: Vertical Folded Paper Spine */}
        <rect
          x="8"
          y="6"
          width="10"
          height="36"
          rx="3"
          fill="url(#kaagaz-stem-grad)"
          filter="url(#kaagaz-subtle-shadow)"
        />

        {/* Upper Arm: Folded Geometric Paper Facet */}
        <path
          d="M18 24 L36 8 C37.5 6.7 40 7.8 40 9.8 L40 16.5 C40 17.8 39.2 19 38 19.8 L26 27.5 Z"
          fill="url(#kaagaz-upper-grad)"
          filter="url(#kaagaz-subtle-shadow)"
        />

        {/* Lower Arm: Grounded Base Paper Fold */}
        <path
          d="M23 23 L37.8 38.2 C39 39.4 40 40.5 38.8 42 L33.5 42 C32.2 42 31 41.3 30.2 40.3 L18 27 Z"
          fill="url(#kaagaz-lower-grad)"
          filter="url(#kaagaz-subtle-shadow)"
        />

        {/* Integrated Golden Checkmark Accent in Center Fold */}
        <path
          d="M17 25 L22 30 L32 18"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#kaagaz-subtle-shadow)"
        />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          className={`font-extrabold tracking-tight font-heading ${textColor} transition-colors group-hover:text-[var(--accent)]`}
          style={{ fontSize: `${Math.max(16, size * 0.58)}px` }}
        >
          Kaagaz<span className="text-[var(--accent)]">.</span>
        </span>
      )}
    </div>
  );
};
