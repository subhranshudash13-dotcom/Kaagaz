import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  FileText,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Clock,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  sources?: Array<{
    document_id: string;
    document_title?: string;
    field_name?: string;
    value?: any;
  }>;
}

interface AskKaagazViewProps {
  chatHistory: ChatMessage[];
  chatLoading: boolean;
  onSendMessage: (query: string) => void;
  onViewDocument: (docId: string) => void;
}

export const AskKaagazView: React.FC<AskKaagazViewProps> = ({
  chatHistory,
  chatLoading,
  onSendMessage,
  onViewDocument,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why did my electricity bill increase?',
    'What bills are due this month?',
    'When does my washing machine warranty expire?',
    'What is my consumer number and meter ID?',
    'Show me an executive summary of all upcoming deadlines',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || chatLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Format message text with basic markdown styling (bold, bullets, paragraphs)
  const renderFormattedText = (text: string) => {
    return text.split('\n\n').map((block, i) => {
      const lines = block.split('\n');
      return (
        <div key={i} className="space-y-1.5">
          {lines.map((line, li) => {
            // Bullet lines
            if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
              const content = line.substring(2);
              return (
                <div key={li} className="flex items-start gap-2 pl-1">
                  <span className="text-[var(--accent)] font-bold text-sm shrink-0">•</span>
                  <span>{parseInlineFormatting(content)}</span>
                </div>
              );
            }
            // Numbered lines
            if (/^\d+\.\s/.test(line)) {
              return (
                <div key={li} className="flex items-start gap-2 pl-1">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold shrink-0">
                    {line.match(/^\d+\./)?.[0]}
                  </span>
                  <span>{parseInlineFormatting(line.replace(/^\d+\.\s*/, ''))}</span>
                </div>
              );
            }
            return <p key={li}>{parseInlineFormatting(line)}</p>;
          })}
        </div>
      );
    });
  };

  // Helper to parse bold, backticks, and currency
  const parseInlineFormatting = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[var(--primary)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--hairline)] font-mono text-[11px] text-[var(--primary)] font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-8 font-sans pb-12 max-w-6xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
              LOCAL MULTIMODAL INTELLIGENCE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              100% Private & On-Device
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--primary)] tracking-tight">
            Ask Kaagaz
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Natural conversational intelligence strictly grounded in your confirmed documents with verified citation chips.
          </p>
        </div>
      </div>

      {/* 2. Suggested Prompts Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mr-1">
          SUGGESTED:
        </span>
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(q)}
            disabled={chatLoading}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--hairline)] hover:border-[var(--accent)] text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* 3. Chat Messages Thread Bento */}
      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-6 min-h-[500px] max-h-[640px] flex flex-col justify-between space-y-4 shadow-xs">
        
        {/* Messages Scroll Area */}
        <div className="space-y-5 overflow-y-auto pr-2 flex-1">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs mt-1">
                  <Sparkles size={16} />
                </div>
              )}

              <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="font-mono text-[10px] uppercase text-[var(--muted)] font-bold flex items-center gap-1.5">
                  <span>{msg.sender === 'user' ? 'YOU' : 'KAAGAZ AI (LOCAL)'}</span>
                  {msg.sender === 'ai' && (
                    <span className="text-[var(--success)] font-semibold">• Confirmed Grounding</span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[var(--accent)] text-white font-medium rounded-tr-xs shadow-xs'
                      : 'bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--primary)] rounded-tl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>

                {/* Sources / Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-mono text-[10px] text-[var(--muted)] font-bold">
                      SOURCES:
                    </span>
                    {msg.sources.map((src, si) => (
                      <button
                        key={si}
                        onClick={() => onViewDocument(src.document_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--hairline)] hover:border-[var(--accent)] text-[11px] font-mono font-semibold text-[var(--accent)] cursor-pointer transition-colors shadow-xs"
                      >
                        <FileText size={12} />
                        <span>{src.document_title || src.field_name || 'Confirmed Document'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[var(--surface-raised)] border border-[var(--hairline)] text-[var(--secondary)] flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)] py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
              <span>Analyzing confirmed vault records & computing answers...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-[var(--hairline)] flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about your bills, appliances, warranties, or payment deadlines..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={chatLoading}
            className="flex-1 h-12 bg-[var(--surface-raised)] border border-[var(--hairline)] focus:border-[var(--accent)] rounded-xl px-4 text-xs sm:text-sm text-[var(--primary)] outline-none placeholder:text-[var(--muted)] transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || chatLoading}
            className="h-12 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <span>Ask</span>
            <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  );
};
