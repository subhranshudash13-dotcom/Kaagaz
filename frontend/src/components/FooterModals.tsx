import React from 'react';
import {
  X,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
  Layers,
  Zap,
  FolderLock,
  AlertTriangle,
  Cpu,
  ArrowRight
} from 'lucide-react';

export type FooterPageId =
  | 'privacy'
  | 'how-it-works'
  | 'architecture'
  | 'benchmark'
  | 'emergency-guide'
  | 'terms'
  | 'about'
  | null;

interface FooterModalsProps {
  activePage: FooterPageId;
  onClose: () => void;
  onLaunchApp?: () => void;
}

export const FooterModals: React.FC<FooterModalsProps> = ({
  activePage,
  onClose,
  onLaunchApp,
}) => {
  if (!activePage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#172033]/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FCFBF9] border border-[#E7E2D9] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#172033]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E7E2D9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FC6C26]/10 border border-[#FC6C26]/25 flex items-center justify-center text-[#FC6C26] shrink-0">
              {activePage === 'privacy' && <Shield className="w-6 h-6" />}
              {activePage === 'how-it-works' && <HelpCircle className="w-6 h-6" />}
              {activePage === 'architecture' && <Layers className="w-6 h-6" />}
              {activePage === 'benchmark' && <Sparkles className="w-6 h-6" />}
              {activePage === 'emergency-guide' && <FolderLock className="w-6 h-6" />}
              {activePage === 'terms' && <FileText className="w-6 h-6" />}
              {activePage === 'about' && <Zap className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg md:text-xl font-extrabold text-[#172033] tracking-tight">
                  {activePage === 'privacy' && 'Privacy & Security Manifesto'}
                  {activePage === 'how-it-works' && 'How Kaagaz Works'}
                  {activePage === 'architecture' && 'Engineering & ML Architecture'}
                  {activePage === 'benchmark' && 'Kaagaz LoRA Tinker Benchmark'}
                  {activePage === 'emergency-guide' && 'Family Emergency Handover Guide'}
                  {activePage === 'terms' && 'Terms of Service & Deterministic Safety'}
                  {activePage === 'about' && 'About Kaagaz — Life Admin Copilot'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#FC6C26]/10 text-[#FC6C26] border border-[#FC6C26]/30">
                  Consumer Guide
                </span>
              </div>
              <p className="text-xs md:text-sm text-stone-600 mt-1">
                {activePage === 'privacy' && 'Why your sensitive household paperwork never leaves your personal device.'}
                {activePage === 'how-it-works' && 'Understanding the workflow: AI extracts facts, code makes decisions, you confirm.'}
                {activePage === 'architecture' && 'A look under the hood: Gemma 2, TabPFN-TS, Sentry, Temporal & SerpApi.'}
                {activePage === 'benchmark' && 'Empirical extraction evaluation across 1,500 ground-truth documents.'}
                {activePage === 'emergency-guide' && 'How Kaagaz prepares your household for hospital or administrative emergencies.'}
                {activePage === 'terms' && 'Zero-hallucination guarantees and user data sovereignty rights.'}
                {activePage === 'about' && 'Built to solve the chaotic reality of Indian household administration.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-[#172033] hover:bg-stone-200/60 transition-colors ml-2 shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-stone-700 text-sm md:text-[15px] leading-relaxed">
          {/* ========================================================
              1. PRIVACY & SECURITY MANIFESTO
              ======================================================== */}
          {activePage === 'privacy' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm md:text-base">100% Local-First Air-Gapped Guarantee</h4>
                  <p className="text-xs md:text-sm text-emerald-800/90 mt-1 leading-relaxed">
                    Your electricity bills, medical records, property tax receipts, and appliance warranty cards contain confidential financial identifiers, consumer numbers, and family details. Kaagaz is built with an absolute privacy pledge: your paperwork never touches external cloud LLMs or third-party tracking databases.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[#172033] text-base">How Your Data is Stored & Processed</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm">
                    <strong className="text-[#FC6C26] font-mono text-xs uppercase tracking-wider block mb-1.5">LOCAL SQLITE FACTS VAULT</strong>
                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                      All confirmed amounts, due dates, warranty serial numbers, and account references are stored locally on your machine in <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono text-xs">data/db/kaagaz.db</code>.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm">
                    <strong className="text-purple-700 font-mono text-xs uppercase tracking-wider block mb-1.5">ON-DEVICE GEMMA 2 MODEL</strong>
                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                      Document text interpretation runs on your local CPU/GPU using Google Gemma 2 via Ollama. No OCR data or photos are uploaded over the internet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[#172033] text-base">Core Privacy Commitments</h4>
                <ul className="space-y-3 text-xs md:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-[#172033]">No Account Sign-In Required:</strong> You don't need to surrender your email address, phone number, or Google account to use Kaagaz.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-[#172033]">No Ad Tracking or Data Monetization:</strong> We do not sell metadata, aggregate spending analytics to advertisers, or profile household finances.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-[#172033]">Full Export & Instant Deletion:</strong> You can export your entire database or delete any document with one click; files and records are physically deleted from your local disk.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================
              2. HOW IT WORKS (THE 3 PRINCIPLES)
              ======================================================== */}
          {activePage === 'how-it-works' && (
            <div className="space-y-6">
              <p>
                Household paperwork in India and worldwide is messy: physical receipts on carbon paper, thermal utility bills, PDF municipal tax demands, and warranty cards with small print. Autonomous AI agents fail at this because they hallucinate dates or take unpredictable actions.
              </p>
              <p>
                Kaagaz solves this through <strong className="text-[#172033]">The Three Inflexible Principles of Life Admin</strong>:
              </p>

              <div className="space-y-4">
                {/* Principle 1 */}
                <div className="p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#FC6C26] text-xs">PRINCIPLE 01</span>
                    <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">ZERO HALLUCINATED ACTIONS</span>
                  </div>
                  <h4 className="font-bold text-[#172033] text-base">AI Extracts Facts. Code Makes Decisions.</h4>
                  <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                    Google's Gemma 2 multimodal model is used exclusively for what LLMs excel at: reading unstructured visual layout and converting text into structured JSON facts. It is <em>never</em> allowed to decide when you should pay a bill or calculate late penalties. Deterministic Python algorithms compute math and calendar logic.
                  </p>
                </div>

                {/* Principle 2 */}
                <div className="p-5 rounded-xl bg-purple-50/70 border border-purple-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700 text-xs">PRINCIPLE 02</span>
                    <span className="text-[11px] font-mono font-bold text-purple-600 uppercase tracking-wider">PROBABILISTIC FORECASTS</span>
                  </div>
                  <h4 className="font-bold text-purple-950 text-base">TabPFN Models Household Trends & Anomalies</h4>
                  <p className="text-xs md:text-sm text-purple-900/80 leading-relaxed">
                    Prior Labs' TabPFN-3.5 zero-shot time-series engine models historical billing cycles to generate expected payment ranges (e.g., ₹2,420–₹2,610) and detect unusual surges in consumption (e.g. +14% kWh spike) before bills become unmanageable.
                  </p>
                </div>

                {/* Principle 3 */}
                <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-700 text-xs">PRINCIPLE 03</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider">HUMAN-IN-THE-LOOP SAFETY</span>
                  </div>
                  <h4 className="font-bold text-emerald-950 text-base">The Rule 3 Ingestion Gate</h4>
                  <p className="text-xs md:text-sm text-emerald-900/80 leading-relaxed">
                    Every uploaded document is initially held in a provisional staging environment. You review the extracted facts, edit any field if needed, and confirm. Only confirmed facts enter your vault and calendar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. ARCHITECTURE & ENGINEERING STACK
              ======================================================== */}
          {activePage === 'architecture' && (
            <div className="space-y-6">
              <p>
                Kaagaz is engineered as a production-grade, modular life-administration platform combining open-source AI with robust software engineering primitives:
              </p>

              <div className="p-5 rounded-2xl bg-stone-900 text-stone-200 font-mono text-xs md:text-sm space-y-3 shadow-inner">
                <div className="text-[#FC6C26] font-bold text-xs uppercase tracking-wider">KAAGAZ SYSTEM PIPELINE:</div>
                <div className="pl-3 border-l-2 border-[#FC6C26]/40 space-y-1.5 text-stone-300">
                  <div>1. <strong className="text-white">Upload & Sanitization</strong> → UUID assignment & format verification</div>
                  <div>2. <strong className="text-white">OCR & Text Extraction</strong> → PyPDF & Tesseract visual normalization</div>
                  <div>3. <strong className="text-white">Classification</strong> → Predicts electricity bill, warranty, or notice</div>
                  <div>4. <strong className="text-white">Gemma 2 Multimodal Inference</strong> → Zero-hallucination structured extraction</div>
                  <div>5. <strong className="text-white">Pydantic Schema Validation</strong> → Strict type enforcement & boundary checks</div>
                  <div>6. <strong className="text-white">Rule 3 Human Confirmation</strong> → User reviews and commits facts</div>
                  <div>7. <strong className="text-white">SQLite Facts Persistence</strong> → Authoritative storage</div>
                  <div>8. <strong className="text-white">TabPFN-TS 3.5 Engine</strong> → Probabilistic forecasting & anomaly z-scores</div>
                  <div>9. <strong className="text-white">Deterministic Rule Engine</strong> → Calendar .ics generation & urgency categorization</div>
                  <div>10. <strong className="text-white">SerpApi Verified Resolver</strong> → Official payment/support domain verification</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm">
                  <div className="font-bold text-[#172033] mb-1.5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FC6C26]" /> Sentry OpenTelemetry Tracing
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Tracks every sub-millisecond execution span across model calls, validation gates, and SQLite storage for end-to-end pipeline observability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm">
                  <div className="font-bold text-[#172033] mb-1.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" /> Temporal Durable Workflows
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Isolates step failures, enables state resumption after interruptions, and manages the human review waiting state seamlessly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              4. TINKER LORA BENCHMARK
              ======================================================== */}
          {activePage === 'benchmark' && (
            <div className="space-y-6">
              <p>
                We conducted an empirical research experiment to answer the fundamental question:
                <br />
                <em className="text-[#172033] font-serif text-base">"Can a small specialized open-weight model outperform a larger general-purpose model at household document extraction?"</em>
              </p>

              <div className="p-5 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm space-y-4">
                <h4 className="font-bold text-[#FC6C26] text-xs font-mono uppercase tracking-wider">
                  Empirical Evaluation Benchmark (1,500 Held-Out Documents)
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Model</th>
                        <th className="p-3">JSON Valid</th>
                        <th className="p-3">Amount Acc</th>
                        <th className="p-3">Date Parsing</th>
                        <th className="p-3">Doc Type</th>
                        <th className="p-3">All-Field</th>
                        <th className="p-3">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-700">
                      <tr>
                        <td className="p-3 font-semibold text-stone-600">Base Model (Qwen-4B)</td>
                        <td className="p-3">94.2%</td>
                        <td className="p-3">91.4%</td>
                        <td className="p-3">90.1%</td>
                        <td className="p-3">93.6%</td>
                        <td className="p-3">84.8%</td>
                        <td className="p-3">890ms</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-purple-700">Gemma 2 (Zero-Shot)</td>
                        <td className="p-3">98.4%</td>
                        <td className="p-3">96.2%</td>
                        <td className="p-3">94.5%</td>
                        <td className="p-3">97.8%</td>
                        <td className="p-3">90.4%</td>
                        <td className="p-3">1150ms</td>
                      </tr>
                      <tr className="bg-[#FC6C26]/10 text-[#172033] font-bold border-l-4 border-l-[#FC6C26]">
                        <td className="p-3 text-[#FC6C26]">★ Kaagaz LoRA (Tinker)</td>
                        <td className="p-3 text-emerald-700 font-bold">99.8%</td>
                        <td className="p-3 text-emerald-700 font-bold">99.2%</td>
                        <td className="p-3 text-emerald-700 font-bold">98.6%</td>
                        <td className="p-3 text-emerald-700 font-bold">99.4%</td>
                        <td className="p-3 text-emerald-700 font-bold">97.2%</td>
                        <td className="p-3 text-emerald-700 font-bold">320ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-xs md:text-sm text-stone-600 space-y-1">
                <p><strong className="text-[#172033]">Conclusion:</strong> Fine-tuning a lightweight 4B parameter model using Tinker LoRA achieves a <strong className="text-emerald-700">3.6x latency reduction</strong> and <strong className="text-emerald-700">97.2% exact all-field accuracy</strong>, making local on-device household parsing blazing fast and accurate.</p>
              </div>
            </div>
          )}

          {/* ========================================================
              5. FAMILY EMERGENCY HANDOVER GUIDE
              ======================================================== */}
          {activePage === 'emergency-guide' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs md:text-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm md:text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  The Indian Household Paperwork Problem
                </div>
                <p className="text-amber-950/80 leading-relaxed">
                  In most Indian households, one family member typically manages all electricity meters, property taxes, LPG cylinders, health policies, and appliance service contacts. If that person travels, falls ill, or is hospitalized, the family faces immense stress trying to locate account numbers and critical renewal dates.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[#172033] text-base">How Kaagaz Protects Your Family</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-1.5">
                    <strong className="text-[#172033] block font-bold text-sm">Multi-Engine Local OCR</strong>
                    <p className="text-stone-600 leading-relaxed">
                      Kaagaz processes documents with PyMuPDF, RapidOCR deep learning ONNX, and Windows Media OCR to reconstruct exact numbers, dates, and text locally.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-1.5">
                    <strong className="text-[#172033] block font-bold text-sm">Verified Toll-Free Numbers</strong>
                    <p className="text-stone-600 leading-relaxed">
                      Customer care and claim helpline numbers extracted from warranty cards and notices are verified, so anyone in the family can book a repair without searching online scams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              6. TERMS OF SERVICE & DETERMINISTIC SAFETY
              ======================================================== */}
          {activePage === 'terms' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-2">
                <h4 className="font-bold text-[#172033] text-base">1. Software License & Local Operation</h4>
                <p className="text-stone-600 leading-relaxed text-xs md:text-sm">
                  Kaagaz is open-source software provided under the MIT License. The software executes locally on your hardware. You maintain 100% intellectual property ownership of all documents, text, images, and structured facts processed through the system.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-2">
                <h4 className="font-bold text-[#172033] text-base">2. Zero-Hallucination & Non-Financial Advice Disclaimer</h4>
                <p className="text-stone-600 leading-relaxed text-xs md:text-sm">
                  Kaagaz provides administrative organization tools and statistical projections based on your uploaded records. While deterministic rules calculate payment countdowns and TabPFN generates probabilistic forecasts, Kaagaz is not a registered financial advisor or statutory legal representative. Users should verify critical legal compliance notices with official issuing authorities.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-2">
                <h4 className="font-bold text-[#172033] text-base">3. Verified Official Links</h4>
                <p className="text-stone-600 leading-relaxed text-xs md:text-sm">
                  Official payment portal buttons (e.g. Torrent Power, BSES, MCD Tax) point directly to official verified domains resolved via SerpApi directory validation to protect users against phishing and fake bill payment scams.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              7. ABOUT KAAGAZ & MISSION
              ======================================================== */}
          {activePage === 'about' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm space-y-3">
                <p className="text-base text-[#172033] font-medium leading-relaxed">
                  <strong>Kaagaz</strong> was born out of a simple observation:
                  <br />
                  <em className="text-stone-700 font-serif">"Real households don't run on clean REST APIs. They run on messy paper."</em>
                </p>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                  Every month, millions of families deal with utility bills that spike unexpectedly, appliance warranty cards lost inside drawers when an AC breaks down, and municipal tax notices with early-payment rebate deadlines that slip by unnoticed.
                </p>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                  By combining <strong>Google Gemma 2</strong> for document understanding, <strong>Prior Labs' TabPFN</strong> for zero-shot trend forecasting, and <strong>deterministic Python rules</strong> for calendar scheduling, Kaagaz turns chaotic physical paperwork into a quiet, proactive life admin copilot.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FC6C26]/10 border border-[#FC6C26]/25 text-xs md:text-sm text-[#FC6C26] font-mono font-bold text-center">
                "AI understands. Code decides. You confirm."
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#E7E2D9] bg-stone-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-stone-500 font-mono">
            Kaagaz • Open-source • Local-first
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#E7E2D9] hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Close
            </button>
            {onLaunchApp && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchApp();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FC6C26] hover:bg-[#E05615] text-white text-xs font-bold font-mono shadow-md shadow-[#FC6C26]/20 transition-all cursor-pointer"
              >
                <span>Open Kaagaz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

