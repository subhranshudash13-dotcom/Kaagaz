import React, { useState, useEffect } from 'react';
import './App.css';
import { LandingPage } from './components/LandingPage';
import { HomeView } from './components/HomeView';
import { ActionsView } from './components/ActionsView';
import { CalendarView } from './components/CalendarView';
import { DocumentsView } from './components/DocumentsView';
import { AskKaagazView } from './components/AskKaagazView';
import { DocumentReviewModal } from './components/DocumentReviewModal';
import { ModelStatusModal } from './components/ModelStatusModal';
import { FooterModals, FooterPageId } from './components/FooterModals';
import { EditorialPage } from './components/EditorialPage';
import { KaagazLogo } from './components/KaagazLogo';
import { Footer } from './components/Footer';
import {
  ActionItem,
  DocumentItem,
  ProvisionalExtraction,
  DashboardData,
  CalendarEvent,
} from './types';
import { Sparkles, Shield, Upload, FileText, ArrowRight, FolderLock, Activity, Plus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function App() {
  // Navigation State
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<'home' | 'actions' | 'calendar' | 'documents' | 'assistant'>('home');
  const [showModelModal, setShowModelModal] = useState(false);
  const [activeFooterPage, setActiveFooterPage] = useState<FooterPageId>(null);

  // Data State
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [todos, setTodos] = useState<{
    do_now: ActionItem[];
    coming_up: ActionItem[];
    monitored: ActionItem[];
    completed: ActionItem[];
    total_pending: number;
  }>({
    do_now: [],
    coming_up: [],
    monitored: [],
    completed: [],
    total_pending: 0,
  });
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  // Upload & Review Modal State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [provisionalResult, setProvisionalResult] = useState<ProvisionalExtraction | null>(null);
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [selectedDocType, setSelectedDocType] = useState<string>('electricity_bill');
  const [isConfirming, setIsConfirming] = useState(false);

  // Document Detail State
  const [selectedDocDetail, setSelectedDocDetail] = useState<DocumentItem | null>(null);

  // Assistant State
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    sources?: any[];
  }>>([
    {
      sender: 'ai',
      text: 'Good day, Rajesh! I am your Kaagaz life-admin assistant. I answer questions strictly from your confirmed documents and structured records. How can I assist with your paperwork today?',
    },
  ]);

  // URL Hash Sync for Distinct Webpages per Feature
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash || hash === '') {
        setViewMode('landing');
        setActiveFooterPage(null);
      } else if (['privacy', 'terms', 'how-it-works', 'architecture', 'benchmark', 'emergency-guide', 'about'].includes(hash)) {
        setActiveFooterPage(hash as FooterPageId);
      } else if (['dashboard', 'home', 'actions', 'calendar', 'documents', 'assistant'].includes(hash)) {
        setViewMode('app');
        setActiveFooterPage(null);
        setCurrentTab(hash === 'dashboard' ? 'home' : (hash as any));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
  };

  // Fetch all backend data
  const fetchAllData = async () => {
    try {
      const [dashRes, todoRes, docsRes, calRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard`),
        fetch(`${API_BASE}/todo`),
        fetch(`${API_BASE}/documents`),
        fetch(`${API_BASE}/dashboard/calendar`),
      ]);

      if (dashRes.ok) {
        const d = await dashRes.json();
        setDashboardData(d);
        if (d.calendar_events) setCalendarEvents(d.calendar_events);
      }
      if (todoRes.ok) setTodos(await todoRes.json());
      if (docsRes.ok) setDocuments(await docsRes.json());
      if (calRes.ok) {
        const c = await calRes.json();
        if (c.events) setCalendarEvents(c.events);
      }
    } catch (err) {
      console.error('Error loading Kaagaz data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Upload Document Handler
  const handleFileUpload = async (file: File) => {
    setUploadLoading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Upload failed');
      }

      const provData: ProvisionalExtraction = await res.json();
      setProvisionalResult(provData);
      setSelectedDocType(provData.doc_type || 'electricity_bill');

      // Populate editable fields
      const fieldsObj: Record<string, any> = {};
      if (provData.extracted_data && typeof provData.extracted_data === 'object') {
        Object.entries(provData.extracted_data).forEach(([k, v]) => {
          fieldsObj[k] = v;
        });
      }
      setEditableFields(fieldsObj);
      setIsUploading(true);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing document');
    } finally {
      setUploadLoading(false);
    }
  };

  // Confirm Extraction
  const handleConfirmExtraction = async () => {
    if (!provisionalResult) return;
    setIsConfirming(true);
    try {
      const res = await fetch(`${API_BASE}/documents/${provisionalResult.document_id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: selectedDocType,
          confirmed_facts: editableFields,
        }),
      });

      if (!res.ok) throw new Error('Failed to confirm facts');

      setIsUploading(false);
      setProvisionalResult(null);
      await fetchAllData();
      navigateTo('documents');
    } catch (err: any) {
      alert('Error confirming extraction: ' + err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  // Toggle Action Status
  const handleToggleAction = async (actionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/todo/${actionId}/toggle`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error('Failed to toggle action item:', err);
    }
  };

  // View Document Detail
  const handleViewDetail = async (docId: string) => {
    let found = documents.find((d) => d.id === docId);
    if (!found) {
      try {
        const res = await fetch(`${API_BASE}/documents/${docId}`);
        if (res.ok) {
          found = await res.json();
        }
      } catch (err) {
        console.error('Failed to fetch doc detail:', err);
      }
    }
    if (found) {
      setSelectedDocDetail(found);
      navigateTo('documents');
    }
  };

  // Delete Document
  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Remove this document and its associated action items from your vault?')) return;
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedDocDetail(null);
        await fetchAllData();
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Ask Assistant
  const handleAskAssistant = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || chatLoading) return;

    navigateTo('assistant');
    setChatHistory((prev) => [...prev, { sender: 'user', text: q }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) throw new Error('Assistant query failed');
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Error querying local AI model: ' + err.message,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // 1-Click Instant Demo Ingest Handler
  const handleInstantIngestSample = async (type: 'electricity' | 'warranty' | 'notice') => {
    navigateTo('dashboard');
    let sampleContent = '';
    let fileName = '';
    if (type === 'electricity') {
      fileName = 'Torrent_Power_Sep_Bill.txt';
      sampleContent = `TORRENT POWER LTD\nConsumer Number: CN-112233\nBilling Date: 2026-09-28\nDue Date: 2026-10-10\nTotal Amount Payable: Rs 2500\nPrevious Month Amount: Rs 2000\nUnits Consumed: 240 kWh\nStatus: UNPAID`;
    } else if (type === 'warranty') {
      fileName = 'Samsung_Washing_Machine_Warranty.txt';
      sampleContent = `SAMSUNG ELECTRONICS INDIA\nProduct: Smart Inverter Front Load Washing Machine\nSerial Number: WM-2026-991823\nPurchase Date: 2026-05-10\nWarranty Duration: 24 Months\nExpiry Date: 2028-05-10\nHelpline: 1800-40-7267864\nCoverage: Parts and Labor`;
    } else {
      fileName = 'Municipal_Tax_Notice.txt';
      sampleContent = `MUNICIPAL CORPORATION - REVENUE DEPARTMENT\nNotice Reference: TAX-2026-9812\nAssessment Year: 2026-2027\nProperty Tax Due: Rs 4500\nDue Date: 2026-10-20\nAction Required: Submit property tax return before due date with electricity bill proof.`;
    }

    const file = new File([sampleContent], fileName, { type: 'text/plain' });
    await handleFileUpload(file);
  };

  // 1. Render Dedicated Editorial Sub-Pages (Privacy Policy, Terms, How It Works, Architecture, Benchmark, etc.)
  if (activeFooterPage) {
    return (
      <EditorialPage
        pageId={activeFooterPage}
        onNavigateHome={() => navigateTo('')}
        onLaunchApp={() => navigateTo('dashboard')}
        onOpenPage={(pageId) => navigateTo(pageId || '')}
      />
    );
  }

  // 2. Render Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchApp={() => navigateTo('dashboard')}
        onInstantIngestSample={handleInstantIngestSample}
        onOpenPage={(pageId) => navigateTo(pageId || '')}
      />
    );
  }

  // 3. Render Cockpit Application (Contribo Dashboard Styling)
  return (
    <div className="min-h-screen bg-[var(--base)] text-[var(--primary)] flex flex-col font-sans">
      
      {/* 1. Cockpit Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--hairline)] py-3 shadow-xs">
        <div className="page-container flex items-center justify-between gap-4">
          
          {/* Brand & Segmented Nav */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigateTo('')}
              className="cursor-pointer group shrink-0"
              title="Return to Landing Page"
            >
              <KaagazLogo size={32} />
            </div>

            {/* Segmented Navigation Capsule */}
            <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-raised)] p-1 rounded-xl border border-[var(--hairline)] text-xs font-semibold">
              {[
                { id: 'home', label: 'Home' },
                { id: 'actions', label: 'Actions', counter: todos.total_pending },
                { id: 'calendar', label: 'Calendar', counter: calendarEvents.length },
                { id: 'documents', label: 'Documents', counter: documents.length },
                { id: 'assistant', label: 'Ask Kaagaz' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id === 'home' ? 'dashboard' : tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === tab.id
                      ? 'bg-[var(--surface)] text-[var(--primary)] font-bold shadow-xs'
                      : 'text-[var(--secondary)] hover:text-[var(--primary)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.counter !== undefined && tab.counter > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                      {tab.counter}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions & Upload Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Upload Button */}
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer">
              <Plus size={15} />
              <span>Upload Document</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex items-center justify-around border-b border-[var(--hairline)] bg-[var(--surface)] py-2 text-xs font-mono">
        {['home', 'actions', 'calendar', 'documents', 'assistant'].map((tab) => (
          <button
            key={tab}
            onClick={() => navigateTo(tab === 'home' ? 'dashboard' : tab)}
            className={`px-2 py-1 uppercase font-bold ${currentTab === tab ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--muted)]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Main Workspace Viewport */}
      <main className="flex-1 page-container py-8 sm:py-10">
        
        {uploadLoading && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-mono text-[var(--accent)] flex items-center gap-3 animate-pulse">
            <span className="pulsing-beacon shrink-0" />
            <span>Running local Gemma ingestion & OCR classification pipeline on document...</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 text-xs font-mono text-rose-700 dark:text-rose-300">
            ⚠️ {uploadError}
          </div>
        )}

        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          dashboardData ? (
            <HomeView
              dashboardData={dashboardData}
              onToggleAction={handleToggleAction}
              onViewDocument={handleViewDetail}
              onNavigateTab={(tab) => navigateTo(tab === 'home' ? 'dashboard' : tab)}
              onUploadFile={handleFileUpload}
              onAskAssistant={handleAskAssistant}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center rounded-2xl bg-[var(--surface)] border border-[var(--hairline)] shadow-xs">
              <div className="w-10 h-10 mb-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              <h3 className="text-base font-bold text-[var(--primary)] mb-1">Loading Kaagaz Vault...</h3>
              <p className="text-xs text-[var(--muted)] max-w-md mb-4 font-mono">
                Connecting to backend API at <code className="bg-[var(--surface-sunken)] px-1.5 py-0.5 rounded text-[var(--accent)]">{API_BASE}</code>
              </p>
              <button
                onClick={() => fetchAllData()}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-all cursor-pointer"
              >
                Retry Connection
              </button>
            </div>
          )
        )}

        {/* TAB 2: ACTIONS */}
        {currentTab === 'actions' && (
          <ActionsView
            todos={todos}
            onToggleAction={handleToggleAction}
            onViewDocument={handleViewDetail}
          />
        )}

        {/* TAB 3: CALENDAR */}
        {currentTab === 'calendar' && (
          <CalendarView
            events={calendarEvents}
            onToggleAction={handleToggleAction}
            onViewDocument={handleViewDetail}
            onAskKaagaz={handleAskAssistant}
          />
        )}

        {/* TAB 4: DOCUMENTS */}
        {currentTab === 'documents' && (
          <DocumentsView
            documents={documents}
            selectedDocDetail={selectedDocDetail}
            onSelectDoc={setSelectedDocDetail}
            onDeleteDocument={handleDeleteDocument}
            onAskKaagaz={handleAskAssistant}
          />
        )}

        {/* TAB 5: ASK KAAGAZ */}
        {currentTab === 'assistant' && (
          <AskKaagazView
            chatHistory={chatHistory}
            chatLoading={chatLoading}
            onSendMessage={handleAskAssistant}
            onViewDocument={handleViewDetail}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer onOpenPage={(pageId: FooterPageId) => navigateTo(pageId || '')} onLaunchApp={() => navigateTo('dashboard')} />

      {/* 4. Document Review & Fact Confirmation Modal */}
      <DocumentReviewModal
        isOpen={isUploading}
        provisionalResult={provisionalResult}
        editableFields={editableFields}
        selectedDocType={selectedDocType}
        isConfirming={isConfirming}
        onChangeField={(key, val) => setEditableFields((prev) => ({ ...prev, [key]: val }))}
        onChangeDocType={setSelectedDocType}
        onConfirm={handleConfirmExtraction}
        onCancel={() => {
          setIsUploading(false);
          setProvisionalResult(null);
        }}
      />

      {/* 5. AI & Privacy Diagnostics Modal */}
      {showModelModal && (
        <ModelStatusModal onClose={() => setShowModelModal(false)} />
      )}


      {/* 7. Sub-Page Modals */}
      <FooterModals
        activePage={activeFooterPage}
        onClose={() => navigateTo('')}
      />
    </div>
  );
}
