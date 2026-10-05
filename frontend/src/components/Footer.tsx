import React from 'react';
import { FooterPageId } from './FooterModals';
import { KaagazLogo } from './KaagazLogo';
import { ExternalLink, Mail, Shield, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPage: (pageId: FooterPageId) => void;
  onLaunchApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage, onLaunchApp }) => {
  return (
    <footer className="w-full border-t border-[var(--hairline)] bg-[var(--surface)] pt-16 pb-12 text-[var(--primary)] font-sans">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <KaagazLogo size={28} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent)] font-bold px-2 py-0.5 bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20">
                v1.0 Local
              </span>
            </div>

            <p className="text-[var(--secondary)] text-sm max-w-sm font-normal leading-relaxed">
              Your air-gapped life administration copilot. Turning bills, warranties, and notices into clear facts, deadlines, and deterministic actions — privately on your hardware.
            </p>

            <div className="flex items-center gap-3.5 text-[var(--muted)] pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[var(--accent)] transition-colors p-1"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[var(--accent)] transition-colors p-1"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="mailto:support@kaagaz.local" 
                className="hover:text-[var(--accent)] transition-colors p-1"
                aria-label="Email support"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Column 3: Product */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-4 font-mono">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--secondary)]">
              <li>
                <button 
                  onClick={() => onOpenPage('how-it-works')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={onLaunchApp}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Cockpit Vault</span>
                  <Sparkles size={12} className="text-[var(--accent)]" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('emergency-guide')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  OCR Intelligence Guide
                </button>
              </li>
            </ul>
          </div>


          {/* Column 4: Engineering */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-4 font-mono">
              ENGINEERING
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--secondary)]">
              <li>
                <button 
                  onClick={() => onOpenPage('architecture')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  ML Architecture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('benchmark')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  Tinker Benchmark
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('architecture')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  TabPFN Forecaster
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Privacy */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-4 font-mono">
              TRUST
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--secondary)]">
              <li>
                <button 
                  onClick={() => onOpenPage('privacy')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer font-medium text-[var(--accent)]"
                >
                  Privacy Manifesto
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('terms')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  Terms & Safety
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('privacy')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  Zero Cloud Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: Community */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--primary)] mb-4 font-mono">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--secondary)]">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] transition-colors flex items-center gap-1"
                >
                  <span>GitHub Repo</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPage('about')}
                  className="hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                >
                  About Kaagaz
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Philosophy Bar */}
        <div className="pt-8 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span>© 2026 Kaagaz</span>
            <span>•</span>
            <span className="text-[var(--success)] font-semibold">Local-First Vault</span>
          </div>
          
          <div className="text-[var(--secondary)]">
            AI understands • Code decides • You confirm.
          </div>
        </div>
      </div>
    </footer>
  );
};
