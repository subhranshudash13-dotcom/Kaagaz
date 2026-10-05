import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Kaagaz?",
    answer: "Kaagaz is a local-first, privacy-respecting life administration system. It ingests your utility bills, appliance warranties, and official municipal notices, extracting key facts and translating them into deterministic calendar alerts, payment deadlines, and verified actions on your computer."
  },
  {
    question: "Does my document leave my computer?",
    answer: "No. Kaagaz is engineered around an air-gapped architecture. Your uploaded PDFs, images, extracted structured facts, and SQLite database reside entirely in your local system directory. No documents are transmitted to external servers or third-party cloud data warehouses."
  },
  {
    question: "What does Gemma do?",
    answer: "Google's Gemma 2 runs on-device via Ollama to perform multimodal parsing of unstructured document text and OCR output. It identifies field entities (such as account numbers, bill amounts, and dates) and maps them into strict structured JSON. Gemma is strictly restricted to extraction—it never makes decisions."
  },
  {
    question: "Can Kaagaz make decisions about my documents?",
    answer: "No. Under the foundational principle 'AI extracts facts, code makes decisions,' language models are never allowed to calculate financial penalties, fabricate deadlines, or trigger external actions. All calculations and deadline logic are computed using deterministic Python rules."
  },
  {
    question: "How does Kaagaz calculate deadlines and actions?",
    answer: "Kaagaz applies transparent, open-source rule engines to confirmed document facts. For example, when an electricity bill due date is confirmed, deterministic code evaluates current calendar days remaining to generate categorized action items (Do Now, Coming Up, or Monitored)."
  },
  {
    question: "What happens before a document enters the vault?",
    answer: "Kaagaz enforces Rule 3: The Human Confirmation Gate. When a document is uploaded, it is held in a provisional staging environment. You inspect the extracted fields, verify the numbers against the document provenance, edit any field if needed, and explicitly click 'Confirm & Save' before records are committed to your SQLite database."
  },
  {
    question: "Can I delete my documents?",
    answer: "Yes, at any time. When you delete a document from the Documents Archive, Kaagaz purges the stored physical file, its OCR index, and all associated facts and action items from your local SQLite database immediately."
  },
  {
    question: "What happens if the AI gets something wrong?",
    answer: "Because Kaagaz validates all model outputs against strict Pydantic schemas and presents every extracted field in an editable Human Review Modal, you can correct any misread number or date before confirming. Your manual correction becomes the authoritative fact of record."
  },
  {
    question: "Does Kaagaz require an account?",
    answer: "No. Kaagaz requires zero account creation, zero email logins, zero subscription tokens, and zero telemetry tracking. You run it locally as your personal paperwork sovereignty vault."
  },
  {
    question: "Can I run Kaagaz without cloud AI?",
    answer: "Yes, 100%. Kaagaz defaults to local Ollama (Gemma 2) and native on-device Windows OCR / Tesseract engines. If Ollama is offline, deterministic regex heuristics extract key facts, ensuring the entire application operates seamlessly without any active internet connection."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[var(--surface)] border-t border-[var(--hairline)]">
      <div className="page-container">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-bold border border-[var(--accent)]/20">
            <HelpCircle size={13} />
            <span>CLARITY & TRANSPARENCY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold font-heading tracking-tight text-[var(--primary)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--secondary)] leading-relaxed">
            Everything you need to know about how Kaagaz processes paperwork, guarantees privacy, and enforces deterministic safety.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const itemKey = `faq-item-${index}`;

            return (
              <div key={itemKey} className="group">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleAccordion(index);
                    }
                  }}
                  aria-expanded={isOpen}
                  className="w-full py-5 sm:py-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm transition-colors group-hover:text-[var(--accent)]"
                >
                  <span className="text-base sm:text-lg font-bold font-heading text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors pr-2">
                    {item.question}
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--hairline)] flex items-center justify-center text-[var(--secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pt-1 text-sm sm:text-[15px] text-[var(--secondary)] leading-relaxed animate-fadeIn font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
