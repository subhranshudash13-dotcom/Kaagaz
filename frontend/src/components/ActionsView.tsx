import React, { useState } from 'react';
import { ActionItem } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Check,
  ArrowRight,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCheck,
  RotateCcw
} from 'lucide-react';

interface ActionsViewProps {
  todos: {
    do_now: ActionItem[];
    coming_up: ActionItem[];
    monitored: ActionItem[];
    completed: ActionItem[];
    total_pending: number;
  };
  onToggleAction: (id: string) => void;
  onViewDocument: (docId: string) => void;
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  todos,
  onToggleAction,
  onViewDocument,
}) => {
  const [filter, setFilter] = useState<'all' | 'do_now' | 'coming_up' | 'monitored' | 'completed'>('all');

  const totalAll =
    todos.do_now.length +
    todos.coming_up.length +
    todos.monitored.length +
    todos.completed.length;

  const renderActionCard = (act: ActionItem, sectionType: string) => {
    const isCompleted = act.status === 'completed';
    const isOverdue = act.urgency === 'RED' || act.urgency === 'OVERDUE' || act.urgency === 'urgent';
    const isWarning = act.urgency === 'YELLOW' || act.urgency === 'warning';

    return (
      <div
        key={act.id}
        className={`group bg-[var(--surface)] border transition-all rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs hover:shadow-sm ${
          isCompleted
            ? 'opacity-60 bg-[var(--surface-raised)]/40 border-[var(--hairline)]'
            : isOverdue
            ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
            : isWarning
            ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
            : 'border-[var(--hairline)] hover:border-[var(--accent)]/40'
        }`}
      >
        {/* Row 1: Action Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1">
            <button
              onClick={() => onToggleAction(act.id)}
              className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-[var(--success)] border-[var(--success)] text-white shadow-xs'
                  : 'bg-[var(--surface-raised)] border-[var(--hairline)] hover:border-[var(--accent)] hover:bg-[var(--surface)]'
              }`}
              title={isCompleted ? 'Mark active' : 'Mark completed'}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-base font-bold text-[var(--primary)] font-heading leading-snug ${
                    isCompleted ? 'line-through text-[var(--muted)]' : ''
                  }`}
                >
                  {act.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
                {act.description}
              </p>
            </div>
          </div>

          {/* Amount & Due Tag */}
          <div className="flex items-center gap-3 sm:self-start shrink-0">
            {act.amount && (
              <span className="font-mono text-base sm:text-lg font-bold text-[var(--primary)]">
                ₹{act.amount.toLocaleString('en-IN')}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                isCompleted
                  ? 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20'
                  : isOverdue
                  ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                  : isWarning
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                  : 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/20'
              }`}
            >
              {act.due_date ? `DUE ${act.due_date}` : sectionType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Row 2: Deterministic Provenance / Reasoning Box */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>DETERMINISTIC PROVENANCE</span>
          </div>
          <p className="text-[var(--secondary)] text-xs leading-relaxed">
            {act.why_reason || `Extracted directly from confirmed document facts without generative hallucination.`}
          </p>
        </div>

        {/* Row 3: Action Controls Footer */}
        <div className="pt-3 border-t border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)] font-mono text-xs">
            <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Doc ID: {act.document_id ? act.document_id.slice(0, 12) : 'vault'}...</span>
          </div>

          <div className="flex items-center gap-2.5">
            {act.document_id && (
              <button
                onClick={() => onViewDocument(act.document_id)}
                className="px-3 py-1.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] hover:border-[var(--accent)] font-semibold text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer flex items-center gap-1"
              >
                <span>View Document</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => onToggleAction(act.id)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-[var(--surface-raised)] text-[var(--secondary)] hover:text-[var(--primary)] border border-[var(--hairline)]'
                  : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
              }`}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-3 h-3" />
                  <span>Reactivate</span>
                </>
              ) : act.action_type === 'pay' ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Mark as Paid</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3" />
                  <span>Mark Done</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans pb-12 max-w-6xl mx-auto">
      
      {/* 1. Reassuring Executive Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
              TASK MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {todos.total_pending} Pending
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--primary)] tracking-tight">
            Deterministic Life Actions
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Computed deadlines, payment countdowns, and renewal actions with transparent provenance.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] text-center min-w-[90px]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold">
              DO NOW
            </div>
            <div className="text-xl font-bold font-mono text-[var(--primary)]">
              {todos.do_now.length}
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] text-center min-w-[90px]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold">
              COMING UP
            </div>
            <div className="text-xl font-mono font-bold text-[var(--primary)]">
              {todos.coming_up.length}
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] text-center min-w-[90px]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--success)] font-bold">
              DONE
            </div>
            <div className="text-xl font-mono font-bold text-[var(--primary)]">
              {todos.completed.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] pb-4">
        {[
          { id: 'all', label: 'All Items', count: totalAll },
          { id: 'do_now', label: 'Do Now', count: todos.do_now.length, color: 'text-rose-600' },
          { id: 'coming_up', label: 'Coming Up', count: todos.coming_up.length, color: 'text-amber-600' },
          { id: 'monitored', label: 'Monitored', count: todos.monitored.length, color: 'text-purple-600' },
          { id: 'completed', label: 'Completed', count: todos.completed.length, color: 'text-[var(--success)]' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                filter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-raised)] text-[var(--muted)]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Action Groups Ledger */}
      <div className="space-y-8">
        
        {/* SECTION 1: DO NOW */}
        {(filter === 'all' || filter === 'do_now') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
              <div className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>DO NOW — IMMEDIATE ACTION REQUIRED</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {todos.do_now.length} {todos.do_now.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {todos.do_now.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--hairline)] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto opacity-70" />
                <p className="text-sm font-semibold text-[var(--primary)]">No urgent actions pending</p>
                <p className="text-xs text-[var(--secondary)]">All immediate deadlines and overdue invoices are settled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.do_now.map((act) => renderActionCard(act, 'do_now'))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: COMING UP */}
        {(filter === 'all' || filter === 'coming_up') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
              <div className="text-xs font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>COMING UP — NEXT 14 DAYS</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {todos.coming_up.length} {todos.coming_up.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {todos.coming_up.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--hairline)] text-center space-y-2">
                <Clock className="w-8 h-8 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-sm font-semibold text-[var(--primary)]">No upcoming deadlines in the next 14 days</p>
                <p className="text-xs text-[var(--secondary)]">You're fully up to date on all household paperwork.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.coming_up.map((act) => renderActionCard(act, 'coming_up'))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: MONITORED */}
        {(filter === 'all' || filter === 'monitored') && todos.monitored.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
              <div className="text-xs font-mono text-purple-600 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>MONITORED — STATISTICAL TRACKING</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {todos.monitored.length} {todos.monitored.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            <div className="space-y-4">
              {todos.monitored.map((act) => renderActionCard(act, 'monitored'))}
            </div>
          </div>
        )}

        {/* SECTION 4: COMPLETED */}
        {(filter === 'all' || filter === 'completed') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
              <div className="text-xs font-mono text-[var(--success)] font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>COMPLETED ARCHIVE</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {todos.completed.length} {todos.completed.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {todos.completed.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--hairline)] text-center space-y-2">
                <Layers className="w-8 h-8 text-[var(--muted)] mx-auto opacity-50" />
                <p className="text-sm font-semibold text-[var(--primary)]">No completed actions yet</p>
                <p className="text-xs text-[var(--secondary)]">Actions you settle will appear here with confirmation timestamps.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.completed.map((act) => renderActionCard(act, 'completed'))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
