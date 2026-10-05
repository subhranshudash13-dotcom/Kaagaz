import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Shield,
  FileCheck
} from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  onToggleAction: (actionId: string) => void;
  onViewDocument: (docId: string) => void;
  onAskKaagaz: (query: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onToggleAction,
  onViewDocument,
  onAskKaagaz,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 10 = Oct
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'bill' | 'warranty' | 'deadline'>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(10);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
    setSelectedDay(5);
  };

  // Filter events by category
  const filteredEvents = events.filter((ev) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'bill') return ev.action_type === 'pay' || ev.title.toLowerCase().includes('bill') || ev.title.toLowerCase().includes('power');
    if (categoryFilter === 'warranty') return ev.action_type === 'renew' || ev.title.toLowerCase().includes('warranty') || ev.title.toLowerCase().includes('machine');
    if (categoryFilter === 'deadline') return ev.action_type === 'respond' || ev.title.toLowerCase().includes('tax') || ev.title.toLowerCase().includes('notice');
    return true;
  });

  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  const startDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  filteredEvents.forEach((ev) => {
    if (ev.year === currentYear && ev.month === currentMonth) {
      if (!eventsByDay[ev.day]) eventsByDay[ev.day] = [];
      eventsByDay[ev.day].push(ev);
    }
  });

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : [];
  const totalMonthObligations = filteredEvents
    .filter((e) => e.year === currentYear && e.month === currentMonth && e.amount)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-8 font-sans pb-12 max-w-6xl mx-auto">
      
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
              SPATIAL RADAR
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {filteredEvents.length} Scheduled Events
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--primary)] tracking-tight">
            {monthNames[currentMonth - 1]} {currentYear}
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Dates, payment deadlines, and renewal milestones mapped deterministically across your vault.
          </p>
        </div>

        {/* Month Navigation & Month Total */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
              TOTAL DUE IN {monthNames[currentMonth - 1].toUpperCase()}
            </div>
            <div className="text-xl font-bold font-mono text-[var(--primary)]">
              ₹{totalMonthObligations.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--hairline)] p-1 rounded-xl shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[var(--primary)] hover:bg-[var(--surface-raised)] transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] pb-4">
        {[
          { id: 'all', label: 'All Events', icon: CalendarIcon },
          { id: 'bill', label: 'Utility Bills', icon: Zap },
          { id: 'warranty', label: 'Warranties', icon: Shield },
          { id: 'deadline', label: 'Statutory Notices', icon: FileCheck },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setCategoryFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                categoryFilter === f.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface)] border border-[var(--hairline)] text-[var(--secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Grid / Agenda Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Calendar Matrix Card */}
        <div className="lg:col-span-8 bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider pb-3 border-b border-[var(--hairline)]">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span className="text-[var(--accent)]">SAT</span><span className="text-[var(--accent)]">SUN</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[85px] p-2 rounded-xl bg-[var(--surface-raised)]/30 border border-transparent opacity-30"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsByDay[day] || [];
              const isSelected = selectedDay === day;
              const isToday = currentYear === 2026 && currentMonth === 10 && day === 5;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[90px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/20 shadow-xs'
                      : dayEvents.length > 0
                      ? 'border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--accent)]/60 hover:shadow-xs'
                      : 'border-[var(--hairline-subtle)] bg-[var(--surface)]/60 hover:bg-[var(--surface-raised)]/50'
                  }`}
                >
                  {/* Top Bar: Date Number & Event Indicator Dot */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        isToday
                          ? 'bg-[var(--accent)] text-white'
                          : isSelected
                          ? 'text-[var(--accent)] font-extrabold'
                          : 'text-[var(--primary)]'
                      }`}
                    >
                      {day}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((ev, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] font-mono truncate px-1.5 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--secondary)] font-semibold border border-[var(--hairline-subtle)] group-hover:border-[var(--accent)]/30"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] font-mono text-[var(--muted)] font-bold pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer */}
        <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
                AGENDA
              </div>
              <h3 className="text-base font-bold font-heading text-[var(--primary)]">
                {monthNames[currentMonth - 1]} {selectedDay}, {currentYear}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {selectedEvents.length} {selectedEvents.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {selectedEvents.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <Clock className="w-8 h-8 text-[var(--muted)] mx-auto opacity-40" />
                <div>
                  <p className="text-xs font-semibold text-[var(--primary)]">No events on this date</p>
                  <p className="text-[11px] text-[var(--secondary)]">Select a date with an indicator dot or jump to an upcoming event:</p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {Object.keys(eventsByDay).map((dayStr) => {
                    const d = parseInt(dayStr, 10);
                    return (
                      <button
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] hover:border-[var(--accent)] text-[11px] font-mono font-bold text-[var(--primary)] transition-all cursor-pointer"
                      >
                        {monthNames[currentMonth - 1].slice(0, 3)} {d} ({eventsByDay[d].length})
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              selectedEvents.map((ev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-[var(--primary)] font-heading leading-snug">
                      {ev.title}
                    </span>
                    {ev.amount && (
                      <span className="font-mono text-sm font-bold text-[var(--primary)] shrink-0">
                        ₹{ev.amount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--hairline)] text-xs">
                    <span className="font-mono text-[10px] text-[var(--muted)] uppercase font-semibold">
                      {ev.action_type === 'pay' ? 'Payment Due' : 'Scheduled Milestone'}
                    </span>
                    {ev.document_id && (
                      <button
                        onClick={() => onViewDocument(ev.document_id)}
                        className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Doc</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
