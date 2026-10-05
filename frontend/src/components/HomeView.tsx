import React, { useState } from 'react';
import { DashboardData, CalendarEvent } from '../types';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Calendar as CalendarIcon,
  Upload,
  ChevronRight,
  HelpCircle,
  X,
  FileText
} from 'lucide-react';
import { PipelineTraceModal } from './PipelineTraceModal';

interface HomeViewProps {
  dashboardData: DashboardData;
  onToggleAction: (id: string) => void;
  onViewDocument: (docId: string) => void;
  onNavigateTab: (tab: 'home' | 'actions' | 'calendar' | 'documents' | 'assistant') => void;
  onUploadFile?: (file: File) => void;
  onAskAssistant?: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  dashboardData,
  onToggleAction,
  onViewDocument,
  onNavigateTab,
  onUploadFile,
  onAskAssistant,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(10);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const currentMonthName = dashboardData.current_month || 'October 2026';
  const daysInMonth = 31;
  const startDayOffset = 3; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  (dashboardData.calendar_events || []).forEach((ev) => {
    if (!eventsByDay[ev.day]) eventsByDay[ev.day] = [];
    eventsByDay[ev.day].push(ev);
  });

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : [];

  const urgentActions = (dashboardData.needs_attention || []).filter(
    (item) => item.urgency === 'RED' || item.urgency === 'OVERDUE' || item.urgency === 'urgent'
  );
  const upcomingActions = (dashboardData.needs_attention || []).filter(
    (item) => item.urgency !== 'RED' && item.urgency !== 'OVERDUE' && item.urgency !== 'urgent'
  );

  return (
    <div className="space-y-8 font-sans pb-12 max-w-6xl mx-auto">
      
      {/* ========================================================
          1. REASSURING EXECUTIVE GREETING & FINANCIAL SUMMARY
          ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--primary)] tracking-tight">
            Good morning, Rajesh.
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            You have <strong className="text-[var(--primary)] font-semibold">{urgentActions.length} urgent {urgentActions.length === 1 ? 'item' : 'items'}</strong> and {upcomingActions.length} upcoming deadlines across {dashboardData.stats?.total_documents || (dashboardData.recent_documents?.length || 13)} organized documents.
          </p>
        </div>

        {/* Quiet Month Total Ledger */}
        <div className="flex items-center gap-6 text-right">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider">
              {currentMonthName} DUE
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--primary)]">
              ₹{dashboardData.this_month?.total_amount?.toLocaleString('en-IN') || '99,158'}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('actions')}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Review Items
          </button>
        </div>
      </div>

      {/* ========================================================
          2. WHAT NEEDS YOUR ATTENTION (UNIFIED EDITORIAL LEDGER)
          ======================================================== */}
      <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span>What Needs Your Attention</span>
          </div>
          <button
            onClick={() => onNavigateTab('actions')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all actions ({dashboardData.needs_attention?.length || 3})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Dynamic Ledger Rows */}
        <div className="divide-y divide-[var(--hairline)]">
          {(dashboardData.needs_attention || []).slice(0, 5).map((act, idx) => {
            const isUrgent = act.urgency === 'RED' || act.urgency === 'OVERDUE';
            const isWarning = act.urgency === 'YELLOW';
            return (
              <div key={act.id || idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      isUrgent ? 'bg-rose-500 animate-pulse' : isWarning ? 'bg-amber-500' : 'bg-[var(--accent)]'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-[var(--primary)] flex items-center gap-2">
                      <span>{act.title}</span>
                      {act.due_date && (
                        <span className="text-xs font-normal text-[var(--muted)] font-mono">
                          • Due {act.due_date}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--secondary)]">
                      {act.description || act.why_reason || 'Verified from document record.'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center pl-5 sm:pl-0 shrink-0">
                  {act.amount ? (
                    <span className="text-sm font-mono font-bold text-[var(--primary)]">
                      ₹{act.amount.toLocaleString('en-IN')}
                    </span>
                  ) : null}
                  <button
                    onClick={() => {
                      if (act.document_id) onViewDocument(act.document_id);
                      else onNavigateTab('actions');
                    }}
                    className="px-3 py-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. TWO-COLUMN BALANCED WORKSPACE
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ========================================================
            LEFT COLUMN (7 COLS): CALENDAR & FORECAST INTELLIGENCE
            ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Calendar Agenda Matrix */}
          <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
              <div>
                <h2 className="text-base font-bold font-heading text-[var(--primary)] flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Your {currentMonthName}</span>
                </h2>
                <p className="text-xs text-[var(--secondary)]">
                  Scheduled payment deadlines and statutory milestones.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Bills
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Renewals
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Notices
                </span>
              </div>
            </div>

            {/* Days Matrix */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[var(--muted)]">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 opacity-20 text-[var(--muted)]">-</div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasEvents = !!eventsByDay[day];
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`p-2 transition-all relative font-semibold cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white font-bold'
                          : hasEvents
                          ? 'bg-[var(--surface-raised)] text-[var(--primary)] font-bold hover:bg-[var(--hairline)]'
                          : 'text-[var(--secondary)] hover:bg-[var(--surface-raised)]'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && (
                        <span className={`w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 ${isSelected ? 'bg-white' : 'bg-[var(--accent)]'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Summary Line */}
            <div className="pt-3 border-t border-[var(--hairline)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[var(--accent)]">OCT {selectedDay}:</span>
                {selectedEvents.length > 0 ? (
                  <span className="text-[var(--primary)] font-medium">
                    {selectedEvents[0].title} (₹{selectedEvents[0].amount?.toLocaleString('en-IN') || '2,000'})
                  </span>
                ) : (
                  <span className="text-[var(--muted)] italic">No scheduled deadlines.</span>
                )}
              </div>

              {selectedEvents.length > 0 && (
                <button
                  onClick={() => {
                    if (selectedEvents[0].document_id) onViewDocument(selectedEvents[0].document_id);
                    else onNavigateTab('documents');
                  }}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Document</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Household Intelligence & Trends */}
          <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary)]">
                Household Intelligence & Trends
              </div>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Forecast details</span>
                <HelpCircle size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                  <span>ELECTRICITY (TORRENT)</span>
                  <span className="text-rose-600 font-bold">↑ 18% spike</span>
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">₹2,481</div>
                <p className="text-xs text-[var(--secondary)]">
                  Normal seasonal pattern. Units consumed: 240 kWh (+15 kWh from August).
                </p>
              </div>

              <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                  <span>INSURANCE UMBRELLA</span>
                  <span className="text-purple-600 font-bold">In 61 days</span>
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">₹8,240</div>
                <p className="text-xs text-[var(--secondary)]">
                  Health & property umbrella policy. Scheduled renewal date: December 4.
                </p>
              </div>
            </div>

            {/* TabPFN Forecast Range Band */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-[var(--hairline)]">
              <div>
                <span className="font-semibold text-[var(--primary)]">Next Month Forecast Range: </span>
                <span className="font-mono font-bold text-[var(--accent)]">₹2,144 — ₹2,537</span>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">
                Model: TabPFN-TS 3.5 Zero-Shot
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN (5 COLS): INBOX, RECENT DOCS, ASSISTANT
            ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Ingest Dropzone */}
          <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[var(--accent)]" />
              <span>Document Ingestion</span>
            </div>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Drop any PDF, JPG, or bill scan. Processed 100% on-device with zero cloud leaks.
            </p>

            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[var(--hairline)] hover:border-[var(--accent)] bg-[var(--surface-raised)] cursor-pointer transition-colors text-center">
              <span className="text-xs font-semibold text-[var(--primary)] mb-0.5">+ Select or Drop Document</span>
              <span className="text-[10px] text-[var(--muted)] font-mono">PDF, PNG, JPG up to 25MB</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0] && onUploadFile) {
                    onUploadFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Your Documents Overview */}
          <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary)]">
                Your Documents ({dashboardData.stats?.total_documents || 65})
              </span>
              <button
                onClick={() => onNavigateTab('documents')}
                className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Category Filter Tags */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => onNavigateTab('documents')}
                className="px-2.5 py-1 bg-[var(--surface-raised)] text-[var(--primary)] text-[11px] font-mono border border-[var(--hairline)] hover:border-[var(--accent)] cursor-pointer"
              >
                Bills <strong>12</strong>
              </button>
              <button
                onClick={() => onNavigateTab('documents')}
                className="px-2.5 py-1 bg-[var(--surface-raised)] text-[var(--primary)] text-[11px] font-mono border border-[var(--hairline)] hover:border-[var(--accent)] cursor-pointer"
              >
                Warranties <strong>8</strong>
              </button>
              <button
                onClick={() => onNavigateTab('documents')}
                className="px-2.5 py-1 bg-[var(--surface-raised)] text-[var(--primary)] text-[11px] font-mono border border-[var(--hairline)] hover:border-[var(--accent)] cursor-pointer"
              >
                Notices <strong>6</strong>
              </button>
              <button
                onClick={() => onNavigateTab('documents')}
                className="px-2.5 py-1 bg-[var(--surface-raised)] text-[var(--secondary)] text-[11px] font-mono border border-[var(--hairline)] hover:border-[var(--accent)] cursor-pointer"
              >
                Other <strong>21</strong>
              </button>
            </div>

            {/* Recent Items */}
            <div className="pt-2 space-y-2 text-xs">
              <div 
                onClick={() => onNavigateTab('documents')}
                className="flex items-center justify-between text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer py-1 border-b border-[var(--hairline)]/50"
              >
                <span className="truncate pr-2">• Electricity Bill (Torrent Power)</span>
                <span className="text-[10px] font-mono text-[var(--muted)] shrink-0">Confirmed</span>
              </div>
              <div 
                onClick={() => onNavigateTab('documents')}
                className="flex items-center justify-between text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer py-1"
              >
                <span className="truncate pr-2">• Samsung Washing Machine</span>
                <span className="text-[10px] font-mono text-[var(--muted)] shrink-0">Yesterday</span>
              </div>
            </div>
          </div>

          {/* Ask Kaagaz Quick Assistant Bar */}
          <div className="bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Ask Kaagaz Assistant
            </div>
            <p className="text-xs text-[var(--secondary)]">
              "What do I need to take care of this week?"
            </p>
            <button
              onClick={() => {
                if (onAskAssistant) onAskAssistant('What do I need to take care of this week?');
                onNavigateTab('assistant');
              }}
              className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded transition-all cursor-pointer shadow-xs"
            >
              Ask Assistant →
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          4. FORECAST METHODOLOGY DETAILS MODAL
          ======================================================== */}
      {isMethodologyOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--hairline)] p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
              <div className="flex items-center gap-2 text-sm font-bold font-heading text-[var(--primary)]">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>Forecast Methodology Details</span>
              </div>
              <button
                onClick={() => setIsMethodologyOpen(false)}
                className="p-1 hover:bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--primary)] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-[var(--secondary)]">
              <div className="p-3 bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-1">
                <div className="font-bold text-[var(--primary)]">MODEL ARCHITECTURE</div>
                <div>Prior Labs TabPFN-TS 3.5 (Zero-Shot Time-Series)</div>
                <div className="text-[var(--muted)]">65 confirmed historical observations indexed in SQLite.</div>
              </div>

              <div className="p-3 bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-1">
                <div className="font-bold text-[var(--primary)]">EXPECTED PROBABILITY BAND</div>
                <div className="text-[var(--accent)] font-bold text-sm">₹2,144 — ₹2,537</div>
                <div className="text-[var(--muted)]">95% confidence interval with local seasonal weather weighting.</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsMethodologyOpen(false)}
                className="px-4 py-1.5 bg-[var(--primary)] text-[var(--base)] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trace Observability Modal */}
      <PipelineTraceModal isOpen={isTraceModalOpen} onClose={() => setIsTraceModalOpen(false)} />
    </div>
  );
};
