import React, { useEffect, useState } from 'react';

interface FamilyBriefcaseModalProps {
  onClose: () => void;
}

export const FamilyBriefcaseModal: React.FC<FamilyBriefcaseModalProps> = ({ onClose }) => {
  const [briefcaseData, setBriefcaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    fetch(`${apiBase}/dashboard/briefcase`)
      .then((res) => res.json())
      .then((data) => {
        setBriefcaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load briefcase:', err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet" style={{ maxWidth: '880px' }}>
        <div className="modal-head" style={{ background: 'linear-gradient(135deg, #342A29 0%, #251D1C 100%)', color: '#FAF5EE' }}>
          <div>
            <div className="modal-title" style={{ color: '#FAF5EE', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💼</span> Family Emergency Handover Briefcase
            </div>
            <div style={{ fontSize: '0.8rem', color: '#c4b8a8' }}>
              Single-page verified offline digest for household partners and family members
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FAF5EE', fontSize: '1.25rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div className="modal-content-body" style={{ background: 'var(--brand-cream-light)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--brand-text-secondary)' }}>Compiling verified family briefcase...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Executive Header */}
              <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid var(--brand-border)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-ink)' }}>
                    Household Executive Briefcase • Rajesh Kumar
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-text-secondary)', marginTop: '0.2rem' }}>
                    Verified by Kaagaz • Deterministic Fact Provenance • Zero Hallucination
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="urgency-badge urgency-green mono">VERIFIED READY</span>
                </div>
              </div>

              {/* 1. Essential Utilities & Account Registry */}
              <div className="stat-card" style={{ background: '#fff', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-ink)' }}>
                  <span>⚡</span> Essential Utilities & Consumer Numbers
                </h4>
                {briefcaseData?.utilities?.length > 0 ? (
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>PROVIDER</th>
                        <th>CONSUMER / ACCT NO.</th>
                        <th>METER ID</th>
                        <th>LATEST AMOUNT</th>
                        <th>NEXT DUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {briefcaseData.utilities.map((u: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{u.provider}</td>
                          <td className="mono" style={{ fontWeight: 600 }}>{u.account_number}</td>
                          <td className="mono">{u.meter_number}</td>
                          <td className="mono" style={{ fontWeight: 700 }}>{u.last_amount ? `₹${u.last_amount}` : '—'}</td>
                          <td className="mono">{u.due_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-text-secondary)' }}>No utilities confirmed yet.</div>
                )}
              </div>

              {/* 2. Active Warranties & Emergency Contacts */}
              <div className="stat-card" style={{ background: '#fff', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-ink)' }}>
                  <span>🛡️</span> Active Appliance Warranties & Support Hotlines
                </h4>
                {briefcaseData?.warranties?.length > 0 ? (
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>APPLIANCE / PRODUCT</th>
                        <th>BRAND</th>
                        <th>SERIAL NO.</th>
                        <th>EXPIRY DATE</th>
                        <th>SERVICE HELPLINE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {briefcaseData.warranties.map((w: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{w.product}</td>
                          <td>{w.brand}</td>
                          <td className="mono">{w.serial_number}</td>
                          <td className="mono" style={{ color: 'var(--status-success)', fontWeight: 600 }}>{w.expiry_date}</td>
                          <td className="mono" style={{ fontWeight: 600 }}>{w.service_contact || '1800-40-7267864'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-text-secondary)' }}>No warranties confirmed yet.</div>
                )}
              </div>

              {/* 3. Official Notices & Statutory Deadlines */}
              <div className="stat-card" style={{ background: '#fff', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-ink)' }}>
                  <span>📋</span> Statutory Compliance & Municipal Deadlines
                </h4>
                {briefcaseData?.notices?.length > 0 ? (
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>ISSUING BODY</th>
                        <th>SUBJECT</th>
                        <th>COMPLIANCE DEADLINE</th>
                        <th>PAYABLE AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {briefcaseData.notices.map((n: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{n.issuer}</td>
                          <td>{n.subject}</td>
                          <td className="mono" style={{ color: 'var(--status-warning)', fontWeight: 700 }}>{n.deadline}</td>
                          <td className="mono">{n.amount ? `₹${n.amount}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-text-secondary)' }}>No active statutory notices.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-head" style={{ justifyContent: 'space-between', background: 'rgba(245, 235, 221, 0.6)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--brand-text-secondary)' }}>
            Tip: Export and share with your family emergency group.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-landing-toggle" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </button>
            <button className="btn-brand-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
