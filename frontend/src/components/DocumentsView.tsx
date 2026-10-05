import React, { useState } from 'react';
import { DocumentItem } from '../types';
import {
  Activity,
  ShieldCheck,
  ExternalLink,
  Trash2,
  MessageSquare,
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  Shield,
  AlertTriangle,
  ArrowRight,
  Eye,
  Sparkles,
  Zap,
  Building2,
  Copy,
  Check,
  Download,
  Upload,
  Layers,
  FileCode,
  Scan,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { PipelineTraceModal } from './PipelineTraceModal';

interface DocumentsViewProps {
  documents: DocumentItem[];
  selectedDocDetail: DocumentItem | null;
  onSelectDoc: (doc: DocumentItem | null) => void;
  onDeleteDocument: (docId: string) => void;
  onAskKaagaz: (query: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  selectedDocDetail,
  onSelectDoc,
  onDeleteDocument,
  onAskKaagaz,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeDetailTab, setActiveDetailTab] = useState<'facts' | 'ocr' | 'actions'>('facts');
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [ocrSearchFilter, setOcrSearchFilter] = useState('');

  // Filter documents
  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.doc_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || d.doc_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getDocAmount = (doc: DocumentItem): string | null => {
    if (Array.isArray(doc.facts)) {
      const amtFact = doc.facts.find(
        (f) => f.field_name === 'amount_due' || f.field_name === 'amount' || f.field_name === 'total_amount'
      );
      if (amtFact) return amtFact.normalized_value || amtFact.raw_value;
    } else if (doc.facts && typeof doc.facts === 'object') {
      return (
        doc.facts['amount_due'] ||
        doc.facts['amount'] ||
        doc.facts['total_amount'] ||
        null
      );
    }
    return null;
  };

  const getDocDueDate = (doc: DocumentItem): string | null => {
    if (Array.isArray(doc.facts)) {
      const dateFact = doc.facts.find(
        (f) => f.field_name === 'due_date' || f.field_name === 'expiry_date' || f.field_name === 'deadline'
      );
      if (dateFact) return dateFact.normalized_value || dateFact.raw_value;
    } else if (doc.facts && typeof doc.facts === 'object') {
      return (
        doc.facts['due_date'] ||
        doc.facts['expiry_date'] ||
        doc.facts['deadline'] ||
        null
      );
    }
    return null;
  };

  const handleCopyOcr = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
  };

  const handleDownloadOcrTxt = (doc: DocumentItem) => {
    const element = document.createElement('a');
    const file = new Blob([doc.ocr_text || 'No OCR text available.'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.original_filename.replace(/\.[^/.]+$/, '')}_OCR_Transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const portal = selectedDocDetail?.official_portal;

  return (
    <div className="space-y-8 font-sans pb-12 max-w-6xl mx-auto">
      
      {/* 1. Header with Vault Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
              LOCAL SQLITE VAULT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {documents.length} Confirmed Records
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Multi-Engine OCR Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--primary)] tracking-tight">
            Document Archive & OCR Studio
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Searchable store of confirmed documents with verifiable field provenance, high-res OCR transcripts, and official portal validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTraceModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer shadow-xs"
          >
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <span>AI Pipeline Trace</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        
        {/* Search Input */}
        <div className="w-full sm:w-80 h-11 bg-[var(--surface)] border border-[var(--hairline)] rounded-xl px-3.5 flex items-center gap-2.5 shadow-xs focus-within:border-[var(--accent)] transition-all">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            type="text"
            placeholder="Search documents by name, type, or provider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[var(--primary)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'electricity_bill', label: 'Electricity Bills' },
            { id: 'warranty', label: 'Warranties' },
            { id: 'notice', label: 'Statutory Notices' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                typeFilter === t.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Grid / Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Document Cards List */}
        <div className={`${selectedDocDetail ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {filteredDocs.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl text-center py-16 space-y-3">
              <FileText className="w-10 h-10 text-[var(--muted)] mx-auto opacity-50" />
              <div className="text-base font-bold text-[var(--primary)]">No documents match your query</div>
              <p className="text-xs text-[var(--secondary)]">Upload a PDF or bill scan to begin local fact extraction.</p>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const amount = getDocAmount(doc);
              const dueDate = getDocDueDate(doc);
              const isSelected = selectedDocDetail?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(isSelected ? null : doc)}
                  className={`p-5 rounded-2xl bg-[var(--surface)] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-sm ${
                    isSelected
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20 bg-[var(--surface-raised)]/40'
                      : 'border-[var(--hairline)] hover:border-[var(--accent)]/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[var(--primary)] font-heading">
                          {doc.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--muted)] font-bold">
                          {doc.doc_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--secondary)] truncate max-w-sm">
                        {doc.original_filename}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] pt-0.5">
                        {amount && <span className="font-bold text-[var(--primary)]">₹{amount}</span>}
                        {amount && dueDate && <span>•</span>}
                        {dueDate && <span>Due: {dueDate}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskKaagaz(`What are the key facts, amounts, and upcoming deadlines for my document "${doc.title}"?`);
                      }}
                      className="p-2 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--accent)]/15 text-[var(--secondary)] hover:text-[var(--accent)] transition-all cursor-pointer"
                      title="Ask AI Assistant about this document"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      className="p-2 rounded-xl bg-[var(--surface-raised)] hover:bg-rose-500/15 text-[var(--secondary)] hover:text-rose-600 transition-all cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Document Details Inspector Panel */}
        {selectedDocDetail && (
          <div className="lg:col-span-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-6 space-y-5 sticky top-20 shadow-xs animate-fadeIn">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-[var(--hairline)] pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[var(--accent)] font-bold tracking-wider">
                  <Scan className="w-3.5 h-3.5" />
                  PROVENANCE & OCR STUDIO
                </div>
                <h3 className="text-lg font-bold font-heading text-[var(--primary)]">
                  {selectedDocDetail.title}
                </h3>
                <div className="text-xs font-mono text-[var(--muted)]">
                  Original File: {selectedDocDetail.original_filename} ({selectedDocDetail.file_type})
                </div>
              </div>

              <button
                onClick={() => onSelectDoc(null)}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--primary)] px-2 py-1 rounded-lg hover:bg-[var(--surface-raised)] transition-all cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Official Portal Phishing Shield Card */}
            {portal && (
              <div className="p-4 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--success)] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Official Portal Verified
                  </span>
                  <span className="font-mono text-[10px] text-[var(--success)] font-bold">Deterministic Safe</span>
                </div>
                <p className="text-xs text-[var(--secondary)] leading-relaxed">
                  Direct verified domain: <strong className="text-[var(--primary)] font-mono">{portal.official_domain}</strong>
                </p>
                {portal.portal_url && (
                  <a
                    href={portal.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--success)] hover:underline pt-1 cursor-pointer"
                  >
                    <span>{portal.action_label || 'Open Official Gateway'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Inspector Tabs */}
            <div className="flex items-center gap-4 border-b border-[var(--hairline)] pb-2 text-xs font-mono">
              <button
                onClick={() => setActiveDetailTab('facts')}
                className={`pb-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDetailTab === 'facts'
                    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:text-[var(--primary)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>CONFIRMED FACTS</span>
              </button>

              <button
                onClick={() => setActiveDetailTab('ocr')}
                className={`pb-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDetailTab === 'ocr'
                    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:text-[var(--primary)]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>OCR TRANSCRIPT</span>
              </button>

              {selectedDocDetail.actions && selectedDocDetail.actions.length > 0 && (
                <button
                  onClick={() => setActiveDetailTab('actions')}
                  className={`pb-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeDetailTab === 'actions'
                      ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                      : 'text-[var(--muted)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>ACTIONS ({selectedDocDetail.actions.length})</span>
                </button>
              )}
            </div>

            {/* TAB 1: EXTRACTED FACTS */}
            {activeDetailTab === 'facts' && (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {Array.isArray(selectedDocDetail.facts) && selectedDocDetail.facts.length > 0 ? (
                  selectedDocDetail.facts.map((fact: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] text-xs font-mono flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] text-[var(--muted)] uppercase font-bold">
                          {fact.field_name.replace(/_/g, ' ')}
                        </div>
                        <div className="font-bold text-[var(--primary)] text-sm pt-0.5">
                          {fact.normalized_value || fact.raw_value}
                        </div>
                      </div>
                      {fact.confidence !== undefined && (
                        <span className="text-[10px] text-[var(--success)] font-bold px-2 py-0.5 rounded-full bg-[var(--success-bg)]">
                          {(fact.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[var(--muted)] italic text-center py-8">
                    No detailed facts recorded.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RAW OCR TRANSCRIPT STUDIO */}
            {activeDetailTab === 'ocr' && (
              <div className="space-y-3">
                
                {/* Search & Export Toolbar */}
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Filter words inside OCR transcript..."
                      value={ocrSearchFilter}
                      onChange={(e) => setOcrSearchFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] text-[11px] font-mono text-[var(--primary)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyOcr(selectedDocDetail.ocr_text || '')}
                      className="p-1.5 rounded-lg bg-[var(--surface-raised)] hover:bg-[var(--accent)]/15 border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] transition-all cursor-pointer"
                      title="Copy Full OCR Transcript"
                    >
                      {copiedOcr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDownloadOcrTxt(selectedDocDetail)}
                      className="p-1.5 rounded-lg bg-[var(--surface-raised)] hover:bg-[var(--accent)]/15 border border-[var(--hairline)] text-[var(--secondary)] hover:text-[var(--accent)] transition-all cursor-pointer"
                      title="Download OCR Transcript as .txt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* OCR Text Box */}
                <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--hairline)] font-mono text-xs max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[var(--secondary)] select-text">
                  {selectedDocDetail.ocr_text ? (
                    ocrSearchFilter ? (
                      selectedDocDetail.ocr_text
                        .split(new RegExp(`(${ocrSearchFilter})`, 'gi'))
                        .map((part, i) =>
                          part.toLowerCase() === ocrSearchFilter.toLowerCase() ? (
                            <mark key={i} className="bg-[var(--accent)] text-white px-0.5 rounded">
                              {part}
                            </mark>
                          ) : (
                            part
                          )
                        )
                    ) : (
                      selectedDocDetail.ocr_text
                    )
                  ) : (
                    <span className="text-[var(--muted)] italic">No raw OCR text layer cached for this document.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GENERATED ACTIONS */}
            {activeDetailTab === 'actions' && (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {selectedDocDetail.actions?.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-[var(--primary)] font-bold">{act.title}</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)]">
                        {act.urgency}
                      </span>
                    </div>
                    <p className="text-[var(--secondary)]">{act.description}</p>
                    {act.due_date && (
                      <div className="text-[11px] font-mono text-[var(--muted)]">
                        Due: {act.due_date} {act.amount && `• ₹${act.amount}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Assistant Quick Query Button */}
            <button
              onClick={() => onAskKaagaz(`Summarize key dates, penalty clauses, and amounts from ${selectedDocDetail.title}`)}
              className="w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={15} />
              <span>Ask Kaagaz Assistant About This Document</span>
            </button>
          </div>
        )}

      </div>

      {/* Trace Observability Modal */}
      <PipelineTraceModal isOpen={isTraceModalOpen} onClose={() => setIsTraceModalOpen(false)} />
    </div>
  );
};

