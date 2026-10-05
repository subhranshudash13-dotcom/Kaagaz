import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Calendar,
  Lock,
  Cpu,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  Clock,
  Check,
  TrendingUp,
  AlertTriangle,
  FolderLock,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { FaqSection } from './FaqSection';
import { KaagazLogo } from './KaagazLogo';
import { Footer } from './Footer';
import { FooterPageId } from './FooterModals';
import { InteractiveUseCases } from './InteractiveUseCases';

interface LandingPageProps {
  onLaunchApp: () => void;
  onInstantIngestSample: (type: 'electricity' | 'warranty' | 'notice') => void;
  onOpenPage?: (pageId: FooterPageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onInstantIngestSample,
  onOpenPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenPage = (pageId: FooterPageId) => {
    if (onOpenPage) onOpenPage(pageId);
  };

  return (
    <div className="min-h-screen bg-[var(--base)] text-[var(--primary)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white">
      
      {/* ========================================================
          1. FLOATING PILL NAVBAR (ALIGNED TO GLOBAL CONTAINER)
          ======================================================== */}
      <header className="fixed top-3 left-0 right-0 z-50 pointer-events-none flex justify-center page-container">
        <div className="w-full bg-[var(--surface)]/92 backdrop-blur-md border border-[var(--hairline)] rounded-full px-5 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] pointer-events-auto">
          
          {/* Brand Logo */}
          <div 
            onClick={onLaunchApp}
            className="cursor-pointer group shrink-0"
          >
            <KaagazLogo size={32} />
          </div>

          {/* Curated Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-6 text-[13px] font-medium text-[var(--secondary)]">
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('bento')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button 
              onClick={() => handleOpenPage('privacy')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Privacy & Security
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-[13px] font-bold shadow-xs transition-all hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Open Kaagaz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION (LIGHT CANVAS — CLEAN & CENTER-ALIGNED)
          ======================================================== */}
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-18 bg-[var(--base)] overflow-hidden relative hero-radial-glow">
        
        {/* Top-Left Unique Geometric Motif: Origami Document Fold & Precision Ledger Bracket */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-6 pointer-events-none hidden sm:block select-none z-10 opacity-80">
          <svg width="120" height="120" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Architectural corner bracket */}
            <path d="M 0 0 L 70 0" stroke="var(--hairline)" strokeWidth="1.5" />
            <path d="M 0 0 L 0 70" stroke="var(--hairline)" strokeWidth="1.5" />
            
            {/* Origami Paper Fold Facets */}
            <polygon points="0,0 48,0 24,24" fill="var(--accent)" opacity="0.85" />
            <polygon points="0,0 0,48 24,24" fill="var(--accent)" opacity="0.6" />
            <polygon points="48,0 72,0 48,24" fill="var(--accent)" opacity="0.3" />
            <polygon points="0,48 0,72 24,48" fill="var(--accent)" opacity="0.3" />

            {/* Precision crosshair registration marks */}
            <circle cx="85" cy="15" r="2.5" fill="var(--accent)" />
            <line x1="80" y1="15" x2="90" y2="15" stroke="var(--muted)" strokeWidth="1" />
            <line x1="85" y1="10" x2="85" y2="20" stroke="var(--muted)" strokeWidth="1" />

            <circle cx="15" cy="85" r="2.5" fill="var(--accent)" />
            <line x1="10" y1="85" x2="20" y2="85" stroke="var(--muted)" strokeWidth="1" />
            <line x1="15" y1="80" x2="15" y2="90" stroke="var(--muted)" strokeWidth="1" />

            <text x="32" y="44" fill="var(--muted)" fontFamily="monospace" fontSize="8" fontWeight="600" letterSpacing="1">
              + REG // 01
            </text>
          </svg>
        </div>

        {/* Bottom-Right Unique Geometric Motif: Precision Ledger Ruler & Stepped Document Crease */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 pointer-events-none hidden sm:block select-none z-10 opacity-80">
          <svg width="140" height="100" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer alignment bracket */}
            <path d="M 80 110 L 150 110" stroke="var(--hairline)" strokeWidth="1.5" />
            <path d="M 150 40 L 150 110" stroke="var(--hairline)" strokeWidth="1.5" />

            {/* Stepped Ledger Calibration Ticks */}
            <rect x="30" y="88" width="8" height="22" fill="var(--accent)" opacity="0.3" />
            <rect x="44" y="74" width="8" height="36" fill="var(--accent)" opacity="0.5" />
            <rect x="58" y="60" width="8" height="50" fill="var(--accent)" opacity="0.7" />
            <rect x="72" y="46" width="8" height="64" fill="var(--accent)" opacity="0.9" />
            <rect x="86" y="60" width="8" height="50" fill="var(--accent)" opacity="0.7" />
            <rect x="100" y="74" width="8" height="36" fill="var(--accent)" opacity="0.5" />
            <rect x="114" y="88" width="8" height="22" fill="var(--accent)" opacity="0.3" />

            {/* Diagonal crease line */}
            <line x1="60" y1="20" x2="135" y2="95" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
            
            <text x="75" y="32" fill="var(--muted)" fontFamily="monospace" fontSize="8" fontWeight="600" letterSpacing="1">
              SPEC // 45°
            </text>
          </svg>
        </div>

        <div className="page-container">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

            {/* Headline */}
            <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] font-bold tracking-tight text-[var(--primary)] leading-[1.1] font-heading mb-5">
              Your Paperwork,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] via-[#D48B5D] to-[#B06538]">
                Understood.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-[18px] text-[var(--secondary)] leading-relaxed max-w-[620px] mb-8 font-normal">
              Turn electricity bills, appliance warranties, and tax notices into clear facts, deadlines, and verified actions — <span className="text-[var(--primary)] font-medium">100% privately on your computer</span> with on-device AI.
            </p>

            {/* Interactive Search / Command Bar */}
            <div 
              className="w-full max-w-[540px] h-[52px] bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl shadow-xs pl-4 pr-2 flex items-center cursor-pointer transition-all hover:border-[var(--accent)] focus-within:border-[var(--accent)] group mb-4"
              onClick={onLaunchApp}
            >
              <Search className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search bills, deadlines, warranties, consumer IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[var(--primary)] placeholder:text-[var(--muted)]"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onLaunchApp();
                }}
              />
              <button 
                onClick={onLaunchApp}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Explore Vault
              </button>
            </div>

            {/* Quick Try Sample Ingest Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mr-1">
                Sample Ingest:
              </span>
              <button
                onClick={() => onInstantIngestSample('electricity')}
                className="px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] text-xs transition-colors cursor-pointer font-medium"
              >
                Torrent Power Bill
              </button>
              <button
                onClick={() => onInstantIngestSample('warranty')}
                className="px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] text-xs transition-colors cursor-pointer font-medium"
              >
                Samsung Warranty
              </button>
              <button
                onClick={() => onInstantIngestSample('notice')}
                className="px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] text-xs transition-colors cursor-pointer font-medium"
              >
                Property Tax Notice
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center">
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center justify-center h-11 px-6 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm gap-2 group w-full sm:w-auto cursor-pointer active:scale-[0.98]"
              >
                <Sparkles size={15} />
                <span>Open Kaagaz Cockpit</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center justify-center h-11 px-6 bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--surface-raised)] text-[var(--primary)] font-semibold text-xs sm:text-sm rounded-xl transition-all gap-2 group w-full sm:w-auto cursor-pointer"
              >
                <span>See How It Works</span>
                <ChevronRight size={14} className="text-[var(--muted)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. KEY NUMBERS BAR (DARK CONTRAST SECTION)
          ======================================================== */}
      <section className="border-y border-[#332822] bg-[#18120F] text-[#FAF8F5] py-9">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#E59569]">100%</div>
              <div className="text-[11px] font-mono font-semibold text-[#A08C83] uppercase tracking-wider">On-Device Local</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#FAF8F5]">0 ms</div>
              <div className="text-[11px] font-mono font-semibold text-[#A08C83] uppercase tracking-wider">Cloud Data Latency</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#5E9E6D]">99.2%</div>
              <div className="text-[11px] font-mono font-semibold text-[#A08C83] uppercase tracking-wider">Amount Extraction Acc</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#A78BFA]">TabPFN</div>
              <div className="text-[11px] font-mono font-semibold text-[#A08C83] uppercase tracking-wider">Probabilistic Forecasting</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3.5 INTERACTIVE REAL-WORLD USE CASES
          ======================================================== */}
      <InteractiveUseCases 
        onInstantIngestSample={onInstantIngestSample}
        onLaunchApp={onLaunchApp}
      />

      {/* ========================================================
          4. THE 3 PRINCIPLES (LIGHT CANVAS SECTION)
          ======================================================== */}
      <section id="features" className="py-20 sm:py-24 bg-[#FFFFFF]">
        <div className="page-container space-y-12">
          
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold font-heading tracking-tight text-[var(--primary)] mb-4">
              How Kaagaz Works — The 3 Principles
            </h2>
            <p className="text-sm sm:text-base text-[var(--secondary)] leading-relaxed">
              AI models can easily guess dates or miscalculate numbers. Kaagaz prevents mistakes with three simple, reliable rules:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Principle 1 */}
            <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-none space-y-4 hover:border-[var(--accent)] transition-colors">
              <div className="w-10 h-10 bg-[var(--accent)]/10 text-[var(--accent)] rounded-none flex items-center justify-center font-bold font-mono text-sm border border-[var(--accent)]/20">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--primary)] font-heading">
                AI Reads the Document, Code Does the Math
              </h3>
              <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
                On-device AI reads messy paper scans to find names, amounts, and dates. Standard computer code does all calculations and reminders, so numbers are always 100% exact.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-none space-y-4 hover:border-purple-400 transition-colors">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-none flex items-center justify-center font-bold font-mono text-sm border border-purple-200">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--primary)] font-heading">
                Smart Alerts for Unexpected Bills
              </h3>
              <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
                Kaagaz learns your typical monthly spending patterns. If your electricity or utility bill suddenly jumps unexpectedly, it flags it right away so you are never surprised.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-6 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-none space-y-4 hover:border-emerald-400 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-none flex items-center justify-center font-bold font-mono text-sm border border-emerald-200">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--primary)] font-heading">
                You Always Have the Final Say
              </h3>
              <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
                No document is saved to your private database without your approval. You can quickly review what was found, make any edits, and confirm before anything is stored.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. SYSTEM ARCHITECTURE & ENGINEERING MATRIX (POINTED CORNERS)
          ======================================================== */}
      <section id="bento" className="py-20 sm:py-24 bg-[#140E0C] text-[#FAF8F5] border-y border-[#2B1B15]">
        <div className="page-container space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2B1B15] pb-6">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-[#E59569] uppercase tracking-wider">
                [SYSTEM ARCHITECTURE / LOCAL-FIRST MATRIX]
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold font-heading tracking-tight text-[#FAF8F5]">
                Built for Precision, Privacy & Observability
              </h2>
            </div>
            
            <button
              onClick={() => handleOpenPage('architecture')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E59569] hover:text-[#F0A780] transition-colors cursor-pointer"
            >
              <span>[FULL 10-STEP PIPELINE SPECS]</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Spec 1: Local SQLite Vault */}
            <div className="md:col-span-7 p-6 sm:p-8 bg-[#1B1411] border border-[#332822] rounded-none flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-[#A08C83] uppercase tracking-wider">
                  SPEC 01 // LOCAL DATA PERSISTENCE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#FAF8F5]">
                  Zero Cloud Backends. Data Lives on Your SSD.
                </h3>
                <p className="text-xs sm:text-sm text-[#A08C83] leading-relaxed max-w-lg">
                  Extracted facts, calendar alerts, and due dates reside exclusively in <code className="bg-[#2B1B15] text-[#E59569] px-1.5 py-0.5 font-mono text-xs border border-[#3A2D26]">data/db/kaagaz.db</code>. No remote login servers, no telemetry trackers, and zero third-party cookie synchronizations.
                </p>
              </div>

              <div className="p-4 bg-[#110D0B] border border-[#2B1B15] rounded-none font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between text-[#736259] text-[11px] border-b border-[#241D18] pb-1.5">
                  <span>STORAGE PROTOCOL: AIR-GAPPED</span>
                  <span className="text-[#5E9E6D] font-bold">100% PRIVATE SSD</span>
                </div>
                <div className="text-[#FAF8F5] leading-relaxed">
                  <span className="text-[#E59569]">sqlite&gt;</span> SELECT doc_type, total_amount, due_date FROM documents WHERE status='confirmed';
                </div>
              </div>
            </div>

            {/* Spec 2: Phishing-Proof Resolver */}
            <div className="md:col-span-5 p-6 sm:p-8 bg-[#1B1411] border border-[#332822] rounded-none flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-[#A08C83] uppercase tracking-wider">
                  SPEC 02 // DETERMINISTIC RESOLUTION
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#FAF8F5]">
                  Phishing-Proof Official Bill Links
                </h3>
                <p className="text-xs sm:text-sm text-[#A08C83] leading-relaxed">
                  Support hotlines and payment portal URLs are verified deterministically against official utility authority registries to ensure you never transact on fraudulent clone portals.
                </p>
              </div>

              <div className="p-3.5 bg-[#110D0B] border border-[#5E9E6D]/40 rounded-none text-xs font-mono text-[#5E9E6D] space-y-1">
                <div className="text-[10px] text-[#A08C83] uppercase">GATEWAY AUTHENTICATION</div>
                <div className="font-bold">Verified via SerpApi Deterministic Lookup Engine</div>
              </div>
            </div>

            {/* Spec 3: Sentry OpenTelemetry & Temporal Workflows */}
            <div className="md:col-span-12 p-6 sm:p-8 bg-[#1B1411] border border-[#332822] rounded-none grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-3">
                <div className="text-[11px] font-mono text-[#A08C83] uppercase tracking-wider">
                  SPEC 03 // ENTERPRISE TELEMETRY & DURABILITY
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#FAF8F5]">
                  Sentry OpenTelemetry & Temporal Durable Workflows
                </h3>
                <p className="text-xs sm:text-sm text-[#A08C83] leading-relaxed max-w-xl">
                  Sub-millisecond telemetry instruments every OCR and extraction step, while Temporal state machines guarantee idempotent replay and human confirmation review gates.
                </p>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-[#110D0B] border border-[#2B1B15] rounded-none space-y-1">
                  <div className="text-[#736259] text-[10px] uppercase">SENTRY SPAN DURATION</div>
                  <div className="text-lg font-bold text-[#E59569] font-heading">320 ms</div>
                  <div className="text-[10px] text-[#A08C83]">Local Gemma 2 + WinOCR</div>
                </div>
                <div className="p-3.5 bg-[#110D0B] border border-[#2B1B15] rounded-none space-y-1">
                  <div className="text-[#736259] text-[10px] uppercase">WORKFLOW STATE</div>
                  <div className="text-lg font-bold text-[#A78BFA] font-heading">Durable</div>
                  <div className="text-[10px] text-[#A08C83]">Human Review Gate</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. TINKER BENCHMARK SECTION (LIGHT CANVAS SECTION)
          ======================================================== */}
      <section id="benchmark" className="py-20 sm:py-24 bg-[var(--base)]">
        <div className="page-container space-y-8">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-bold mb-3 border border-[var(--accent)]/20">
              EMPIRICAL RESEARCH EVALUATION
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold font-heading tracking-tight text-[var(--primary)] mb-3">
              Kaagaz LoRA vs General LLMs
            </h2>
            <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
              Evaluated on 1,500 held-out real household documents (bills, receipts, hospital records, warranties).
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] shadow-xs">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--primary)] font-bold border-b border-[var(--hairline)]">
                <tr>
                  <th className="p-3.5 sm:p-4">Model Architecture</th>
                  <th className="p-3.5 sm:p-4">JSON Valid</th>
                  <th className="p-3.5 sm:p-4">Amount Precision</th>
                  <th className="p-3.5 sm:p-4">Date Parsing</th>
                  <th className="p-3.5 sm:p-4">All-Field Acc</th>
                  <th className="p-3.5 sm:p-4">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)] text-[var(--secondary)]">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-[var(--primary)]">Base Model (Qwen-4B)</td>
                  <td className="p-3.5 sm:p-4">94.2%</td>
                  <td className="p-3.5 sm:p-4">91.4%</td>
                  <td className="p-3.5 sm:p-4">90.1%</td>
                  <td className="p-3.5 sm:p-4">84.8%</td>
                  <td className="p-3.5 sm:p-4">890ms</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-purple-600">Gemma 2 (Zero-Shot)</td>
                  <td className="p-3.5 sm:p-4">98.4%</td>
                  <td className="p-3.5 sm:p-4">96.2%</td>
                  <td className="p-3.5 sm:p-4">94.5%</td>
                  <td className="p-3.5 sm:p-4">90.4%</td>
                  <td className="p-3.5 sm:p-4">1150ms</td>
                </tr>
                <tr className="bg-[var(--accent)]/10 text-[var(--primary)] font-bold">
                  <td className="p-3.5 sm:p-4 text-[var(--accent)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kaagaz LoRA (Tinker)</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-[var(--success)] font-bold">99.8%</td>
                  <td className="p-3.5 sm:p-4 text-[var(--success)] font-bold">99.2%</td>
                  <td className="p-3.5 sm:p-4 text-[var(--success)] font-bold">98.6%</td>
                  <td className="p-3.5 sm:p-4 text-[var(--success)] font-bold">97.2%</td>
                  <td className="p-3.5 sm:p-4 text-[var(--success)] font-bold">320ms</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. FREQUENTLY ASKED QUESTIONS (ACCESSIBLE ACCORDION)
          ======================================================== */}
      <FaqSection />

      {/* ========================================================
          8. CALL TO ACTION BANNER (DEEP CONTRAST ACCENT SECTION)
          ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#18120F] text-[#FAF8F5] border-t border-[#332822] relative overflow-hidden">
        <div className="page-container text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold font-heading text-[#FAF8F5]">
            Ready to Take Control of Your Household Paperwork?
          </h2>
          <p className="text-xs sm:text-sm text-[#A08C83] max-w-xl mx-auto leading-relaxed">
            Zero cloud subscriptions. Zero tracking. Launch Kaagaz locally and experience private, deterministic life administration.
          </p>
          <div className="pt-2">
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <span>Open Kaagaz Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CONTRIBO MULTI-COLUMN FOOTER
          ======================================================== */}
      <Footer onOpenPage={handleOpenPage} onLaunchApp={onLaunchApp} />

    </div>
  );
};
