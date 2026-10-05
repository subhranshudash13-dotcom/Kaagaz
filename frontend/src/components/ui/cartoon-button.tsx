import React from 'react';

interface CartoonButtonProps {
  label: string;
  color?: string;
  hasHighlight?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass';
}

export function CartoonButton({
  label,
  hasHighlight = true,
  disabled = false,
  onClick,
}: CartoonButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div className={`inline-block ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <button
        disabled={disabled}
        onClick={handleClick}
        className="liquid-glass-btn relative h-12 px-7 text-base rounded-full font-bold transition-all duration-300 overflow-hidden group flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, #D9553C 100%)',
          color: '#ffffff',
          boxShadow: '0 8px 24px -4px rgba(235, 104, 79, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(12px)',
          letterSpacing: '-0.01em',
        }}
      >
        <span className="relative z-10 whitespace-nowrap">{label}</span>
        {hasHighlight && !disabled && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full pointer-events-none" />
        )}
      </button>
    </div>
  );
}
