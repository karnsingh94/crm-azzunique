'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function LeadIntegrationsModal({ companyId, isOpen, onClose, showToast, onLeadsSynced }) {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingIndiaMart, setIsSyncingIndiaMart] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (!isOpen || !companyId) return;
    let isCurrent = true;
    const fetchIntegrations = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/companies/${companyId}/crm/lead-integrations`);
        if (isCurrent && res.data) setIntegrations(res.data);
      } catch (err) {
        if (showToast) showToast('Failed to Load Integrations', err.message, 'danger');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };
    fetchIntegrations();
    return () => { isCurrent = false; };
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  const handleSyncIndiaMart = async () => {
    setIsSyncingIndiaMart(true);
    try {
      const res = await api.post(`/companies/${companyId}/crm/lead-integrations/sync-indiamart`, {});
      if (showToast) showToast('IndiaMART Sync Complete! 🇮🇳', res.message || 'Leads successfully fetched.', 'success');
      if (onLeadsSynced) onLeadsSynced();
      const updated = await api.get(`/companies/${companyId}/crm/lead-integrations`);
      if (updated.data) setIntegrations(updated.data);
    } catch (err) {
      if (showToast) showToast('IndiaMART Sync Failed', err.message, 'danger');
    } finally {
      setIsSyncingIndiaMart(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    const fullUrl = text.startsWith('http') ? text : `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(true);
    if (showToast) showToast('Copied! 📋', 'Universal Webhook URL copied to clipboard.', 'info');
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const websiteProvider = integrations.find((i) => i.id === 'WEBSITE_WEBHOOK');
  const activeIntegrations = integrations.filter((i) => i.status === 'ACTIVE' && i.configured);
  const inactiveIntegrations = integrations.filter((i) => !(i.status === 'ACTIVE' && i.configured));
  const activeCount = activeIntegrations.length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '760px', maxHeight: '88vh',
          background: '#ffffff', borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '1.1rem 1.5rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f5f0ff 100%)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7f22fe 0%, #6d28d9 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>⚡</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Lead Channels & Ingestion Hub
                </h3>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px',
                  borderRadius: '999px',
                  background: activeCount > 0 ? '#dcfce7' : '#f1f5f9',
                  color: activeCount > 0 ? '#15803d' : '#64748b',
                  border: activeCount > 0 ? '1px solid #86efac' : '1px solid #cbd5e1',
                }}>
                  {activeCount} Active
                </span>
              </div>
              <p style={{ margin: '0.1rem 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                External APIs (IndiaMART, Meta, Webhooks) managed by Super Admin
              </p>
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#ffffff', border: '1px solid #cbd5e1',
              cursor: 'pointer', fontWeight: 700, color: '#64748b',
              fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* ── Policy notice ── */}
        <div style={{
          padding: '0.6rem 1.5rem',
          background: '#faf5ff', borderBottom: '1px solid #e9d5ff',
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          fontSize: '0.76rem', color: '#6b21a8',
        }}>
          <span>🛡️</span>
          <span><strong>Super Admin Managed:</strong> Channel credentials are configured by your Super Admin. Contact them to activate additional channels.</span>
        </div>

        {/* ── Webhook URL strip (only when active) ── */}
        {websiteProvider?.configured && websiteProvider?.status === 'ACTIVE' && websiteProvider?.webhookUrl && (
          <div style={{
            padding: '0.65rem 1.5rem',
            background: '#f0fdf4', borderBottom: '1px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.75rem', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <span>🌐</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Your Universal Webhook URL
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#047857', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {typeof window !== 'undefined' ? `${window.location.origin}${websiteProvider.webhookUrl}` : websiteProvider.webhookUrl}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(websiteProvider.webhookUrl)}
              style={{
                flexShrink: 0,
                background: copiedToken ? '#059669' : '#ffffff',
                color: copiedToken ? '#ffffff' : '#059669',
                border: '1px solid #059669', borderRadius: '7px',
                padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
              }}
            >
              {copiedToken ? '✓ Copied!' : '📋 Copy URL'}
            </button>
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading channels...</div>
          ) : (
            <>
              {/* Active channels — prominent cards */}
              {activeIntegrations.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    Active Channels ({activeIntegrations.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {activeIntegrations.map((provider) => {
                      const isIndiaMart = provider.id === 'INDIAMART';
                      const isWebsite = provider.id === 'WEBSITE_WEBHOOK';
                      return (
                        <div key={provider.id} style={{
                          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                          padding: '0.9rem 1.1rem',
                          border: '1.5px solid #a7f3d0', borderRadius: '12px',
                          background: '#f0fdf4', boxShadow: '0 2px 8px rgba(16,185,129,0.07)',
                        }}>
                          <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{provider.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{provider.name}</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px', borderRadius: '999px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                                🟢 Active
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.15rem' }}>{provider.category}</div>
                            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#166534', background: '#dcfce7', borderRadius: '6px', padding: '3px 8px', display: 'inline-flex', flexWrap: 'wrap', gap: '0.4rem 1rem' }}>
                              <span>📊 Leads Synced: <strong>{provider.totalSynced || 0}</strong></span>
                              {provider.lastSyncAt && (
                                <span>🕒 Last: <strong>{new Date(provider.lastSyncAt).toLocaleDateString('en-IN')}</strong></span>
                              )}
                            </div>
                          </div>
                          <div style={{ flexShrink: 0 }}>
                            {isIndiaMart && (
                              <button
                                type="button" onClick={handleSyncIndiaMart} disabled={isSyncingIndiaMart}
                                style={{
                                  padding: '0.45rem 0.9rem', borderRadius: '7px', border: 0,
                                  background: '#005b9f', color: '#ffffff', fontSize: '0.78rem',
                                  fontWeight: 700, cursor: isSyncingIndiaMart ? 'wait' : 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap',
                                }}
                              >
                                {isSyncingIndiaMart ? '⏳ Syncing...' : '🔄 Sync Now'}
                              </button>
                            )}
                            {isWebsite && provider.webhookUrl && (
                              <button
                                type="button" onClick={() => copyToClipboard(provider.webhookUrl)}
                                style={{
                                  padding: '0.45rem 0.9rem', borderRadius: '7px',
                                  border: '1px solid #059669', background: '#ffffff',
                                  color: '#059669', fontSize: '0.78rem', fontWeight: 700,
                                  cursor: 'pointer', whiteSpace: 'nowrap',
                                }}
                              >
                                {copiedToken ? '✓ Copied!' : '📋 Copy URL'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inactive channels — compact list */}
              {inactiveIntegrations.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />
                    Not Provisioned ({inactiveIntegrations.length})
                  </div>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    {inactiveIntegrations.map((provider, idx) => (
                      <div key={provider.id} style={{
                        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem',
                        padding: '0.75rem 1rem',
                        borderBottom: idx < inactiveIntegrations.length - 1 ? '1px solid #f1f5f9' : 'none',
                        background: '#fafafa',
                      }}>
                        <div style={{ fontSize: '1.2rem', flexShrink: 0, opacity: 0.5 }}>{provider.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>{provider.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>{provider.category} · {provider.description?.slice(0, 60)}{provider.description?.length > 60 ? '...' : ''}</div>
                        </div>
                        <span style={{
                          flexShrink: 0, fontSize: '0.68rem', fontWeight: 700,
                          padding: '2px 7px', borderRadius: '999px',
                          background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0',
                        }}>🔒 Not Provisioned</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0.5rem 0 0', textAlign: 'center' }}>
                    Contact your Super Admin to activate these channels.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: '#f8fafc', borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem',
        }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            External leads appear in <strong>Leads Pipeline</strong> tagged by their channel source.
          </span>
          <button
            type="button" onClick={onClose}
            style={{
              padding: '0.45rem 1.1rem', borderRadius: '7px',
              border: '1px solid #cbd5e1', background: '#ffffff',
              color: '#334155', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
