import React, { useState } from 'react';
import { ProvisionalExtraction } from '../types';
import { Activity, ShieldCheck, ExternalLink, Cpu, Sparkles } from 'lucide-react';
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

  if (!isOpen || !provisionalResult) return null;

  const fieldsCount = Object.keys(editableFields).length;
  const portal = provisionalResult.official_portal;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="review-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 1. Header with Transparent Pipeline Display & Sentry Trace Trigger */}
        <div className="review-modal-head">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="review-eyebrow mono">RULE 3 INGESTION GATE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Gemma 2 Understanding
              </span>
            </div>
            <h2 className="review-title">Review Document & Extracted Facts</h2>
            <div className="review-file-badge mono">
              📄 {provisionalResult.original_filename}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTraceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 hover:text-white transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>View AI Trace</span>
            </button>
            <button className="modal-close-btn" onClick={onCancel}>
              ✕
            </button>
          </div>
        </div>

        {/* 3-Step Transparent Pipeline Indicator */}
        <div className="pipeline-steps-bar">
          <div className="pipeline-step completed">
            <span className="step-num mono">①</span>
            <div className="step-info">
              <strong>Document Read</strong>
              <span>OCR extracted text</span>
            </div>
          </div>
          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step completed">
            <span className="step-num mono">②</span>
            <div className="step-info">
              <strong>Gemma Inferred Schema</strong>
              <span>{fieldsCount} structured fields</span>
            </div>
          </div>
          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step active">
            <span className="step-num mono">③</span>
            <div className="step-info">
              <strong>Your Confirmation</strong>
              <span>You decide what persists</span>
            </div>
          </div>
        </div>

        {/* 2. Side-by-Side Review Workspace */}
        <div className="review-workspace-grid">
          {/* LEFT: Document Preview / Extracted Text */}
          <div className="review-preview-pane">
            <div className="pane-head-bar">
              <span className="pane-title mono">DOCUMENT TEXT PREVIEW</span>
              <span className="pane-status-pill mono">EXTRACTED</span>
            </div>
            <div className="document-raw-preview-box mono">
              {provisionalResult.raw_text ||
                `[Source Document: ${provisionalResult.original_filename}]\nText extracted successfully.\nGemma local model analyzed this document and generated the proposed structured facts on the right.`}
            </div>

            {/* Official Verified Action Badge (SerpApi Verified Lookup) */}
            {portal && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-300">{portal.entity_name}</div>
                    <div className="text-[11px] text-emerald-400/80">{portal.security_badge} ({portal.official_domain})</div>
                  </div>
                </div>
                <a
                  href={portal.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium text-xs transition-colors"
                >
                  <span>{portal.action_label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* RIGHT: KAAGAZ FOUND (Editable Structured Facts) */}
          <div className="review-fields-pane">
            <div className="pane-head-bar">
              <span className="pane-title mono">KAAGAZ FOUND ({fieldsCount} FIELDS)</span>
              <span className="pane-trust-pill">Deterministic Review</span>
            </div>

            {/* Document Type Selector */}
            <div className="field-edit-group">
              <label className="field-label mono">DOCUMENT TYPE</label>
              <select
                className="field-select-input"
                value={selectedDocType}
                onChange={(e) => onChangeDocType(e.target.value)}
              >
                <option value="electricity_bill">⚡ Electricity Bill / Utility</option>
                <option value="warranty">🛡️ Appliance / Device Warranty</option>
                <option value="notice">📋 Municipal Notice / Tax</option>
                <option value="other">📄 General Document</option>
              </select>
            </div>

            {/* Editable Extracted Fields List */}
            <div className="fields-input-stack">
              {Object.entries(editableFields).map(([key, val]) => (
                <div key={key} className="field-row-card">
                  <div className="field-row-head">
                    <span className="field-key-name mono">{key.replace(/_/g, ' ').toUpperCase()}</span>
                    <span className="field-provenance mono">Source: Page 1</span>
                  </div>
                  <input
                    type="text"
                    className="field-text-input mono"
                    value={val !== null && val !== undefined ? String(val) : ''}
                    onChange={(e) => onChangeField(key, e.target.value)}
                    placeholder={`Enter ${key}...`}
                  />
                </div>
              ))}
            </div>

            {provisionalResult.validation_issues && provisionalResult.validation_issues.length > 0 && (
              <div className="review-validation-box">
                <span className="val-title mono">⚠️ VALIDATION NOTES:</span>
                <ul>
                  {provisionalResult.validation_issues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="review-modal-footer">
          <div className="footer-disclaimer">
            "AI understands. Software decides. You confirm." — Only confirmed facts enter your vault and calendar.
          </div>
          <div className="footer-buttons">
            <button className="btn-secondary-outline" onClick={onCancel} disabled={isConfirming}>
              Cancel / Reject
            </button>
            <button className="btn-brand-confirm" onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? 'Committing to SQLite...' : '✓ Confirm & Save to Vault →'}
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
