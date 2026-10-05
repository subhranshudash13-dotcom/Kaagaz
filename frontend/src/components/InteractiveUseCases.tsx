import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play
} from 'lucide-react';

interface InteractiveUseCasesProps {
  onInstantIngestSample: (type: 'electricity' | 'warranty' | 'notice') => void;
  onLaunchApp: () => void;
}

interface UseCaseData {
  id: string;
  type: 'electricity' | 'warranty' | 'notice';
  indexLabel: string;
  category: string;
  modelEngine: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  facts: { label: string; value: string; isHighlight?: boolean }[];
  insightTitle: string;
  insightDesc: string;
  actionLabel: string;
}

export const InteractiveUseCases: React.FC<InteractiveUseCasesProps> = ({
  onInstantIngestSample,
  onLaunchApp,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const useCases: UseCaseData[] = [
    {
      id: 'bills',
      type: 'electricity',
      indexLabel: '01',
      category: 'UTILITY INGESTION',
      modelEngine: 'Local Gemma 2 + TabPFN',
      title: 'Torrent Power Electricity Bill Ingestion',
      imageSrc: '/images/usecase_bill_scan.jpg',
      imageAlt: 'Physical electricity bill scanned on-device',
      description: 'Physical paper bills are parsed entirely on-device. Kaagaz extracts the consumer ID, billing cycle, and payable amount while evaluating consumption against seasonal baselines.',
      facts: [
        { label: 'Consumer ID', value: 'CN-8839210' },
        { label: 'Payable Amount', value: '₹2,500.00' },
        { label: 'Due Date', value: 'Oct 10, 2026', isHighlight: true },
        { label: 'Extraction Fidelity', value: '99.8% On-Device' }
      ],
      insightTitle: '+18% Seasonal Spike Detected',
      insightDesc: 'TabPFN forecast identified an abnormal increase against the 3-month rolling average. Routed directly to Human Confirmation (Rule 3).',
      actionLabel: 'Test Torrent Power Ingestion'
    },
    {
      id: 'warranties',
      type: 'warranty',
      indexLabel: '02',
      category: 'APPLIANCE LIFECYCLE',
      modelEngine: 'On-Device Expiry Radar',
      title: 'Samsung Refrigerator Warranty Ingestion',
      imageSrc: '/images/usecase_warranty.jpg',
      imageAlt: 'Samsung appliance receipt and warranty details',
      description: 'Converts noisy retail receipts and warranty booklets into structured serial records, active coverage countdowns, and pre-formatted helpline tickets.',
      facts: [
        { label: 'Model Number', value: 'RT34T4513S8' },
        { label: 'Serial ID', value: 'SMSG-994827-X' },
        { label: 'Coverage Expiry', value: 'Oct 22, 2026', isHighlight: true },
        { label: 'Toll-Free Helpline', value: '1800-40-SAMSUNG' }
      ],
      insightTitle: '18 Days Remaining on Coverage',
      insightDesc: 'Digital invoice and serial records are compiled for instant one-tap claim generation through official manufacturer channels.',
      actionLabel: 'Test Samsung Warranty Ingestion'
    },
    {
      id: 'notices',
      type: 'notice',
      indexLabel: '03',
      category: 'MUNICIPAL & TAX',
      modelEngine: 'Phishing Defense Shield',
      title: 'Property Tax Notice Verification',
      imageSrc: '/images/usecase_notices.jpg',
      imageAlt: 'Municipal corporation property tax assessment notice',
      description: 'Scans statutory tax assessments, verifies embedded links against official state portals, and highlights early rebate settlement dates.',
      facts: [
        { label: 'Assessment Year', value: 'AY 2026-27' },
        { label: 'Net Property Tax', value: '₹14,280.00' },
        { label: 'Rebate Deadline', value: 'Oct 31, 2026', isHighlight: true },
        { label: 'Gateway Status', value: 'Verified Official .gov.in' }
      ],
      insightTitle: 'Phishing-Proof Direct Link',
      insightDesc: 'Direct authenticated routing to the municipal treasury portal. Early payment secures a 5% statutory rebate before Oct 31.',
      actionLabel: 'Test Property Tax Ingestion'
    }
  ];

  // Auto-slide towards the right
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % useCases.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, useCases.length]);

  const activeCase = useCases[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + useCases.length) % useCases.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % useCases.length);
  };

  return (
    <section id="use-cases" className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--hairline)]">
      <div className="page-container space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-heading tracking-tight text-[var(--primary)]">
            Paperwork, Finally Under Control.
          </h2>
          <p className="text-base sm:text-lg text-[var(--secondary)] leading-relaxed">
            See how Kaagaz translates messy physical documents into verified facts, payment deadlines, and phishing-proof actions.
          </p>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ========================================================
              LEFT COLUMN: CLEAN SLIDING IMAGES
              ======================================================== */}
          <div 
            className="lg:col-span-7 relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Image Slider Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-[var(--hairline)] shadow-xl bg-[var(--surface-raised)] aspect-[16/10.5]">
              
              {/* Carousel Track Moving Towards the Right */}
              <div 
                className="flex h-full transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`
                }}
              >
                {useCases.map((item) => (
                  <div key={item.id} className="w-full h-full shrink-0 relative bg-[var(--surface-raised)]">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Minimal Slider Controls */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[var(--surface)]/90 backdrop-blur-md px-2 py-1 rounded-full border border-[var(--hairline)] text-[var(--primary)] text-xs shadow-sm">
                <button
                  onClick={handlePrev}
                  className="p-1 hover:text-[var(--accent)] transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-1 hover:text-[var(--accent)] transition-colors cursor-pointer"
                  title={isAutoPlaying ? "Pause" : "Play"}
                >
                  {isAutoPlaying ? <Pause size={11} /> : <Play size={11} />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 hover:text-[var(--accent)] transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-[var(--surface)]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--hairline)] shadow-sm">
                {useCases.map((item, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIndex(dotIdx)}
                    className={`text-[11px] font-mono transition-all cursor-pointer px-1.5 py-0.5 rounded ${
                      dotIdx === activeIndex
                        ? 'bg-[var(--accent)] text-white font-bold'
                        : 'text-[var(--secondary)] hover:text-[var(--primary)]'
                    }`}
                  >
                    {item.indexLabel}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: ELEGANT TYPOGRAPHIC BREAKDOWN
              ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Metadata */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-[var(--muted)]">
                <span className="text-[var(--accent)] font-semibold">{activeCase.category}</span>
                <span>/</span>
                <span>{activeCase.modelEngine}</span>
              </div>
              
              <h3 className="text-2xl sm:text-[28px] font-bold text-[var(--primary)] font-heading leading-snug tracking-tight">
                {activeCase.title}
              </h3>
            </div>

            {/* Editorial Description */}
            <p className="text-sm text-[var(--secondary)] leading-relaxed">
              {activeCase.description}
            </p>

            {/* Luxury Ledger Fact List */}
            <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-raised)]/60 divide-y divide-[var(--hairline)]">
              <div className="px-4 py-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--muted)]">
                Structured Extraction
              </div>
              <div className="p-4 space-y-2.5">
                {activeCase.facts.map((fact, fIdx) => (
                  <div key={fIdx} className="flex items-center justify-between text-xs">
                    <span className="text-[var(--secondary)] font-sans">{fact.label}</span>
                    <span className={`font-mono font-semibold ${fact.isHighlight ? 'text-[var(--accent)] font-bold' : 'text-[var(--primary)]'}`}>
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Callout (Clean border accent, no cartoon icons) */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border-l-2 border-l-[var(--accent)] border-y border-r border-[var(--hairline)] space-y-1">
              <div className="text-xs font-bold font-heading text-[var(--primary)]">
                {activeCase.insightTitle}
              </div>
              <p className="text-xs text-[var(--secondary)] leading-relaxed">
                {activeCase.insightDesc}
              </p>
            </div>

            {/* Action Row */}
            <div className="pt-1 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onInstantIngestSample(activeCase.type)}
                className="flex-1 h-11 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
              >
                <span>{activeCase.actionLabel}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onLaunchApp}
                className="h-11 px-5 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] hover:bg-[var(--surface-raised)] text-[var(--primary)] text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Cockpit</span>
                <ChevronRight size={14} className="text-[var(--muted)]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
