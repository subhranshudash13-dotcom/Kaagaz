import React, { useEffect, useState } from 'react';

interface ModelStatusModalProps {
  onClose: () => void;
}

export const ModelStatusModal: React.FC<ModelStatusModalProps> = ({ onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    fetch(`${apiBase}/health`)
      .then((res) => res.json())
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Health fetch failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet" style={{ maxWidth: '680px' }}>
        <div className="modal-head">
          <div>
            <div className="modal-title">AI & Privacy Diagnostics</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--brand-text-secondary)' }}>
              Inspect your local open-source AI configuration & privacy parameters
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--brand-text-secondary)' }}>Checking local AI engine...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Status Banner */}
              <div style={{ padding: '1rem 1.25rem', background: healthData?.ollama_status === 'online' ? 'var(--status-success-bg)' : 'var(--status-warning-bg)', border: `1px solid ${healthData?.ollama_status === 'online' ? 'var(--status-success-border)' : 'var(--status-warning-border)'}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-ink)' }}>
                    Ollama Local Daemon: <span style={{ textTransform: 'uppercase' }}>{healthData?.ollama_status || 'OFFLINE'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-text-secondary)' }}>
                    Endpoint: http://localhost:11434
                  </div>
                </div>
                <span className={`urgency-badge ${healthData?.ollama_status === 'online' ? 'urgency-green' : 'urgency-yellow'}`}>
                  {healthData?.ollama_status === 'online' ? 'LIVE' : 'ADAPTIVE FALLBACK'}
                </span>
              </div>

              {/* Model Specifications */}
              <div className="stat-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-ink)' }}>Configured Open-Source Model</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--brand-text-secondary)' }}>Target Model:</span>
                    <div className="mono" style={{ fontWeight: 600, color: 'var(--brand-ink)' }}>{healthData?.ollama_model || 'gemma2:2b'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--brand-text-secondary)' }}>Architecture:</span>
                    <div className="mono" style={{ fontWeight: 600, color: 'var(--brand-ink)' }}>Gemma (Google Open Weights)</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--brand-text-secondary)' }}>Context Provider:</span>
                    <div className="mono" style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>OllamaGemmaProvider</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--brand-text-secondary)' }}>Extraction Format:</span>
                    <div className="mono" style={{ fontWeight: 600, color: 'var(--brand-ink)' }}>Strict JSON Schema</div>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantees */}
              <div className="stat-card" style={{ padding: '1.25rem', background: 'rgba(235, 104, 79, 0.06)', border: '1px solid rgba(235, 104, 79, 0.2)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-coral)', marginBottom: '0.5rem' }}>
                  🔒 Local Privacy Guarantees
                </h4>
                <ul style={{ fontSize: '0.825rem', color: 'var(--brand-ink)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li>All uploaded files are saved strictly inside <code>data/documents/</code> on your hard drive.</li>
                  <li>No document text or metadata is sent to OpenAI, Anthropic, or external cloud LLM APIs.</li>
                  <li>All deadlines, percentage changes, and urgencies are computed deterministically in local Python code.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="modal-head" style={{ justifyContent: 'flex-end', background: 'rgba(245, 235, 221, 0.5)' }}>
          <button className="btn-brand-primary" onClick={onClose}>
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
