export type UrgencyLevel = 'RED' | 'YELLOW' | 'GREEN' | 'OVERDUE' | 'UNKNOWN' | string;

export interface OfficialPortal {
  entity_name: string;
  official_domain: string;
  action_type: string;
  action_label: string;
  portal_url: string;
  is_verified: boolean;
  security_badge: string;
}

export interface PipelineSpan {
  name: string;
  stage: string;
  duration_ms: number;
  status: string;
  details?: Record<string, any>;
}

export interface PipelineTrace {
  trace_id: string;
  document_id: string;
  total_duration_ms: number;
  tokens_consumed: number;
  model_name: string;
  spans: PipelineSpan[];
}

export interface ActionItem {
  id: string;
  document_id: string;
  title: string;
  description: string;
  due_date: string | null;
  amount: number | null;
  urgency: UrgencyLevel;
  status: 'pending' | 'completed' | string;
  action_type: string;
  why_reason?: string;
  created_at?: string;
  official_portal?: OfficialPortal | null;
}

export interface Fact {
  field_name: string;
  raw_value: string | null;
  normalized_value: string | null;
  confidence: number;
  user_confirmed: boolean;
  source_page: number;
}

export interface Comparison {
  metric_name?: string;
  current_value?: number;
  previous_value?: number;
  delta_value: number;
  percentage_change: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  original_filename: string;
  doc_type: string;
  status: string;
  created_at: string;
  file_type: string;
  file_size: number;
  facts: Record<string, any> | Fact[];
  actions?: ActionItem[];
  comparison?: Comparison | null;
  ocr_text?: string;
  official_portal?: OfficialPortal | null;
  trace?: PipelineTrace | null;
}

export interface ProvisionalExtraction {
  document_id: string;
  workflow_id?: string;
  original_filename: string;
  title?: string;
  doc_type: string;
  confidence: number;
  reason: string;
  status: string;
  extracted_data: Record<string, any>;
  facts: Fact[];
  validation_issues: string[];
  raw_text?: string;
  trace?: PipelineTrace | null;
  official_portal?: OfficialPortal | null;
  workflow_state?: Record<string, any>;
}

export interface CalendarEvent {
  id: string;
  action_id: string;
  document_id: string;
  date: string;
  year: number;
  month: number;
  day: number;
  title: string;
  amount: number | null;
  urgency: UrgencyLevel;
  status: string;
  action_type: string;
  why_reason?: string;
}

export interface WhatChangedNext {
  historical: {
    title: string;
    provider?: string;
    current_amount: number;
    display_amount: string;
    percentage_change: number;
    direction: 'up' | 'down';
    comparison_text: string;
    previous_amount: number;
  };
  forecast: {
    title: string;
    expected_range: string;
    expected_amount: number;
    confidence_score: number;
    label: string;
    model: string;
    explanation: string;
  };
  pattern: {
    status: string;
    badge: string;
    is_anomalous: boolean;
    description: string;
    units_change?: string;
    bill_change?: string;
    possible_cause?: string;
  };
}

export interface DashboardData {
  greeting: string;
  current_month?: string;
  attention_headline: string;
  this_month: {
    total_amount: number;
    bills_count: number;
    renewals_count: number;
    deadlines_count: number;
    pending_count: number;
  };
  what_changed_next?: WhatChangedNext;
  tabpfn_forecast?: Record<string, any>;
  tabpfn_anomaly?: Record<string, any>;
  needs_attention: ActionItem[];
  calendar_events: CalendarEvent[];
  recent_changes: Array<{
    document_id: string;
    document_title: string;
    metric: string;
    current_value: number;
    previous_value: number;
    delta_value: number;
    percentage_change: number;
    direction: 'up' | 'down';
    consumption_detail?: string;
  }>;
  recent_documents: Array<{
    id: string;
    title: string;
    doc_type: string;
    status: string;
    amount?: number | null;
    date: string;
    file_type?: string;
    comparison?: {
      delta_value: number;
      percentage_change: number;
    } | null;
  }>;
  stats: {
    total_documents: number;
    pending_actions: number;
    urgent_count: number;
    upcoming_count: number;
    monitored_count: number;
  };
}
