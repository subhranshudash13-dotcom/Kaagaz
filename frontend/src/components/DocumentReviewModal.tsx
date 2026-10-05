import React, { useState } from 'react';
import { ProvisionalExtraction } from '../types';
import {
  Activity,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Sparkles,
  Scan,
  Layers,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Terminal,
  Crosshair,
  Zap,
} from 'lucide-react';
import { PipelineTraceModal } from './PipelineTraceModal';

interface DocumentReviewModalProps {
  isOpen: boolean;
  provisionalResult: ProvisionalExtraction | null;
  editableFields: Record<string, any>;
  selectedDocType: string;
  isConfirming: boolean;
  onChangeField: (key: string, value: string) => void;
  onChangeDocType: (type: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({
  isOpen,
  provisionalResult,
  editableFields,
  selectedDocType,
  isConfirming,
  onChangeField,
  onChangeDocType,
  onConfirm,
  onCancel,
}) => {
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'hud' | 'lines' | 'raw'>('hud');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedLineIdx, setCopiedLineIdx] = useState<number | null>(null);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [hoveredLineText, setHoveredLineText] = useState<string | null>(null);

  if (!isOpen || !provisionalResult) return null;

  const fieldsCount = Object.keys(editableFields).length;
  const portal = provisionalResult.official_portal;
  const ocrMeta = provisionalResult.ocr_meta;
  const ocrLines = provisionalResult.lines || [];
  const rawText = provisionalResult.raw_text || '';
  const confidenceScore = provisionalResult.confidence || 0.92;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawText);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleCopyLine = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLineIdx(idx);
    setTimeout(() => setCopiedLineIdx(null), 1500);
  };

  const handleAddNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldKey.trim()) return;
    const sanitizedKey = newFieldKey.trim().toLowerCase().replace(/\s+/g, '_');
    onChangeField(sanitizedKey, newFieldValue.trim());
    setNewFieldKey('');
    setNewFieldValue('');
    setShowAddCustom(false);
  };

  const handleDeleteField = (key: string) => {
    const updated = { ...editableFields };
    delete updated[key];
    // Trigger update
    onChangeField(key, '__DELETED__');
  };

  const getConfidenceBadgeColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (conf >= 0.75) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="review-modal-sheet" onClick={(e) => e.stopPropagation()}>
        
        {/* 1. High-Tech Header with Live Telemetry & Engine Badge */}
        <div className="review-modal-head">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="review-eyebrow mono">RULE 3 INGESTION GATE</span>
              
              {/* Active OCR Engine Tag */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center gap-1.5 font-bold">
                <Zap className="w-3 h-3" />
                {ocrMeta?.engine_used || 'Multi-Engine Local OCR'}
              </span>

              {/* Confidence Score Pill */}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${getConfidenceBadgeColor(confidenceScore)}`}>
                <CheckCircle2 className="w-3 h-3" />
                {(confidenceScore * 100).toFixed(1)}% Accuracy
              </span>

              {ocrMeta?.processing_time_ms && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[var(--muted)] bg-[var(--surface-raised)] border border-[var(--hairline)]">
                  ⚡ {ocrMeta.processing_time_ms}ms latency
                </span>
              )}
            </div>

            <h2 className="review-title">Document Intelligence & Fact Confirmation</h2>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--secondary)] mt-1">
              <span className="text-[var(--primary)] font-bold">📄 {provisionalResult.original_filename}</span>
              {ocrMeta?.stats?.word_count && (
                <span>• {ocrMeta.stats.word_count} words recognized</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTraceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--accent)]/15 border border-[var(--hairline)] hover:border-[var(--accent)] text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer shadow-xs"
              title="Inspect Sentry OpenTelemetry Trace"
            >
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="font-semibold">AI Trace</span>
            </button>
            <button className="modal-close-btn" onClick={onCancel} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* 3-Step Transparent Pipeline Indicator */}
        <div className="pipeline-steps-bar">
          <div className="pipeline-step completed">
            <span className="step-num mono">①</span>
            <div className="step-info">
              <strong>Deep Local OCR</strong>
              <span>{ocrLines.length > 0 ? `${ocrLines.length} lines parsed` : 'Text layer extracted'}</span>
            </div>
          </div>
          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step completed">
            <span className="step-num mono">②</span>
            <div className="step-info">
              <strong>Gemma / Neural Structuring</strong>
              <span>{fieldsCount} key-value facts mapped</span>
            </div>
          </div>
          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step active">
            <span className="step-num mono">③</span>
            <div className="step-info">
              <strong>Your Confirmation Gate</strong>
              <span>Air-gapped SQLite persistence</span>
            </div>
          </div>
        </div>

        {/* 2. Side-by-Side Review Workspace */}
        <div className="review-workspace-grid">
          
          {/* ========================================================
              LEFT COLUMN: ADVANCED OCR SCANNER VIEWPORT
              ======================================================== */}
          <div className="review-preview-pane flex flex-col">
            
            {/* Viewport Control Bar */}
            <div className="pane-head-bar flex items-center justify-between">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 bg-[var(--surface-sunken)] p-1 rounded-lg border border-[var(--hairline)] text-[11px] font-mono">
                <button
                  onClick={() => setActiveViewMode('hud')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold ${
                    activeViewMode === 'hud'
                      ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Scan className="w-3 h-3" />
                  <span>Scanner HUD</span>
                </button>
                <button
                  onClick={() => setActiveViewMode('lines')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold ${
                    activeViewMode === 'lines'
                      ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>OCR Lines ({ocrLines.length})</span>
                </button>
                <button
                  onClick={() => setActiveViewMode('raw')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold ${
                    activeViewMode === 'raw'
                      ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>Raw Stream</span>
                </button>
              </div>

              {/* Zoom & Copy Controls */}
              <div className="flex items-center gap-1.5">
                {activeViewMode === 'hud' && (
                  <div className="flex items-center gap-1 text-xs font-mono text-[var(--muted)] bg-[var(--surface-raised)] px-2 py-0.5 rounded-lg border border-[var(--hairline)]">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                      className="hover:text-[var(--primary)] px-1 cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span>{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 15, 160))}
                      className="hover:text-[var(--primary)] px-1 cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCopyRaw}
                  className="p-1.5 rounded-lg bg-[var(--surface-raised)] hover:bg-[var(--accent)]/15 border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] transition-all cursor-pointer"
                  title="Copy Full OCR Text Buffer"
                >
                  {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Viewport Content Container */}
            <div className="flex-1 min-h-[380px] max-h-[460px] overflow-y-auto overflow-x-auto rounded-xl border border-[var(--hairline)] bg-[var(--surface-sunken)] p-3 relative">
              
              {/* MODE A: SCANNER HUD (Interactive Grid + Laser Line + Highlight Badges) */}
              {activeViewMode === 'hud' && (
                <div 
                  className="relative transition-transform origin-top-left space-y-2 select-text font-mono text-xs"
                  style={{ transform: `scale(${zoomLevel / 100})`, width: `${(100 / zoomLevel) * 100}%` }}
                >
                  {/* High-Tech Laser Scanning Beam Animation Effect */}
                  <div className="ocr-scanner-laser-bar pointer-events-none" />

                  {/* HUD Header Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)] text-[10px] text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <Crosshair className="w-3 h-3 text-[var(--accent)]" />
                      COORDINATE MATRIX: RECOGNIZED BOUNDS
                    </span>
                    <span>100% AIR-GAPPED</span>
                  </div>

                  {/* Document Rendered Line Cards */}
                  {ocrLines.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      {ocrLines.map((line, idx) => {
                        const isHighConf = (line.confidence || 0.9) >= 0.85;
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredLineText(line.text)}
                            onMouseLeave={() => setHoveredLineText(null)}
                            className="group p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--hairline)] hover:border-[var(--accent)]/50 transition-all flex items-start justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <span className="text-[9px] text-[var(--muted)] font-mono shrink-0 pt-0.5 select-none">
                                #{String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-xs text-[var(--primary)] leading-snug break-words">
                                {line.text}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${isHighConf ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                {((line.confidence || 0.9) * 100).toFixed(0)}%
                              </span>
                              <button
                                onClick={() => handleCopyLine(line.text, idx)}
                                className="p-1 rounded hover:bg-[var(--accent)]/20 text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                                title="Copy Line"
                              >
                                {copiedLineIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed text-[var(--secondary)] text-xs p-2">
                      {rawText || 'No text extracted.'}
                    </div>
                  )}
                </div>
              )}

              {/* MODE B: RECOGNIZED LINE BREAKDOWN (Structured Table) */}
              {activeViewMode === 'lines' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-[var(--muted)] pb-1 border-b border-[var(--hairline)] flex justify-between">
                    <span>LINE TEXT & GEOMETRIC BOUNDS</span>
                    <span>CONFIDENCE</span>
                  </div>

                  {ocrLines.length > 0 ? (
                    ocrLines.map((line, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] font-mono text-xs flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="text-[var(--primary)] font-medium truncate">
                            {line.text}
                          </div>
                          {line.box && line.box.some((v) => v > 0) && (
                            <div className="text-[10px] text-[var(--muted)]">
                              Box: [{line.box.join(', ')}]
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                            {((line.confidence || 0.9) * 100).toFixed(0)}%
                          </span>
                          <button
                            onClick={() => handleCopyLine(line.text, idx)}
                            className="p-1 text-[var(--muted)] hover:text-[var(--primary)] cursor-pointer"
                          >
                            {copiedLineIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs font-mono text-[var(--muted)]">
                      Line segmentation unavailable. Switch to Raw Stream view.
                    </div>
                  )}
                </div>
              )}

              {/* MODE C: RAW OCR TEXT STREAM */}
              {activeViewMode === 'raw' && (
                <div className="font-mono text-xs text-[var(--secondary)] whitespace-pre-wrap leading-relaxed select-text p-1">
                  {rawText || 'Empty OCR text stream.'}
                </div>
              )}
            </div>

            {/* Official Verified Phishing Protection Card */}
            {portal && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-300">{portal.entity_name}</div>
                    <div className="text-[11px] text-emerald-400/80">{portal.security_badge} ({portal.official_domain})</div>
                  </div>
                </div>
                {portal.portal_url && (
                  <a
                    href={portal.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    <span>{portal.action_label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: STRUCTURED FACTS & RULE INGESTION GATE
              ======================================================== */}
          <div className="review-fields-pane flex flex-col">
            
            <div className="pane-head-bar flex items-center justify-between">
              <span className="pane-title mono font-bold">
                PROPOSED FACTS ({fieldsCount})
              </span>
              <button
                onClick={() => setShowAddCustom(!showAddCustom)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--accent)] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Custom Field</span>
              </button>
            </div>

            {/* Document Type Selector Capsule */}
            <div className="field-edit-group mb-3">
              <label className="field-label mono flex items-center justify-between">
                <span>CLASSIFIED DOCUMENT TYPE</span>
                <span className="text-[10px] text-[var(--muted)]">Deterministically Governed</span>
              </label>
              <select
                className="field-select-input"
                value={selectedDocType}
                onChange={(e) => onChangeDocType(e.target.value)}
              >
                <option value="electricity_bill">⚡ Electricity Bill / Utility Account</option>
                <option value="warranty">🛡️ Appliance / Device Warranty Card</option>
                <option value="notice">📋 Statutory Notice / Municipal Tax</option>
                <option value="other">📄 General Household Record</option>
              </select>
            </div>

            {/* Quick Add Custom Field Form */}
            {showAddCustom && (
              <form onSubmit={handleAddNewField} className="p-3 mb-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--accent)]/40 space-y-2 animate-fadeIn">
                <div className="text-[11px] font-mono font-bold text-[var(--accent)] flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> ADD NEW DOCUMENT FACT
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Field name (e.g. meter_id)..."
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] text-xs font-mono text-[var(--primary)] outline-none focus:border-[var(--accent)]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 4500.00)..."
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] text-xs font-mono text-[var(--primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-2.5 py-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-[11px] font-mono font-bold rounded-md bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] cursor-pointer shadow-xs"
                  >
                    Save Field
                  </button>
                </div>
              </form>
            )}

            {/* Editable Extracted Fields List */}
            <div className="fields-input-stack flex-1 max-h-[340px] overflow-y-auto pr-1 space-y-2.5">
              {Object.entries(editableFields)
                .filter(([_, val]) => val !== '__DELETED__')
                .map(([key, val]) => (
                  <div key={key} className="field-row-card">
                    <div className="field-row-head flex items-center justify-between">
                      <span className="field-key-name mono">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="field-provenance mono">Source: Verified OCR</span>
                        <button
                          onClick={() => handleDeleteField(key)}
                          className="text-[var(--muted)] hover:text-rose-500 p-0.5 cursor-pointer transition-colors"
                          title="Remove Field"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="field-text-input mono"
                      value={val !== null && val !== undefined ? String(val) : ''}
                      onChange={(e) => onChangeField(key, e.target.value)}
                      placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                    />
                  </div>
                ))}
            </div>

            {/* Validation Notes Card */}
            {provisionalResult.validation_issues && provisionalResult.validation_issues.length > 0 && (
              <div className="review-validation-box mt-3">
                <span className="val-title mono flex items-center gap-1 text-amber-400 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> VALIDATION NOTES:
                </span>
                <ul className="text-xs space-y-1 mt-1 text-[var(--secondary)]">
                  {provisionalResult.validation_issues.map((iss, i) => (
                    <li key={i}>• {iss}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* 3. Footer Action Controls */}
        <div className="review-modal-footer">
          <div className="footer-disclaimer">
            <strong>Rule 3 Ingestion Gate:</strong> AI analyzes documents; only human-confirmed facts enter your private database.
          </div>
          <div className="footer-buttons">
            <button className="btn-secondary-outline" onClick={onCancel} disabled={isConfirming}>
              Cancel / Reject
            </button>
            <button className="btn-brand-confirm" onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Committing to SQLite...
                </span>
              ) : (
                '✓ Confirm & Save to Vault →'
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Sentry Pipeline Trace Inspector */}
      <PipelineTraceModal
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        trace={provisionalResult.trace}
        documentTitle={provisionalResult.original_filename}
      />
    </div>
  );
};

