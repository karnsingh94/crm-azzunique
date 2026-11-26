'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { AnimatedModal } from '../ui/Modal';

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  DONE: 'Done',
};

const PERMISSION_LABELS = [
  ['manageMembers', 'Add and manage department and team members'],
  ['assignWork', 'Create and assign work to team members'],
  ['updateWork', 'Update and manage all team work'],
  ['manageServiceRecords', 'Manage service records'],
];

const EMPTY_WORK = { title: '', description: '', assignedToId: '', dueDate: '' };

export default function ServiceWorkBoard({
  activeCompany,
  serviceCode,
  currentUser,
  employees: providedEmployees,
  teamId: providedTeamId,
  accentColor = '#7f22fe',
  showToast,
}) {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState(providedEmployees || []);
  const [draft, setDraft] = useState(EMPTY_WORK);
  const [updates, setUpdates] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.role === 'COMPANY_ADMIN';
  const permissions = currentUser?.permissions || {};
  const isHead = currentUser?.role === 'DEPARTMENT_HEAD' || currentUser?.role === 'SERVICE_HEAD' || currentUser?.role === 'TEAM_LEADER';
  const canAssign = isAdmin || (isHead && permissions.assignWork === true);
  const canManageAll = isAdmin || (isHead && permissions.updateWork === true);
  const normalizedCode = (serviceCode || currentUser?.serviceCode || '').replace(/-/g, '_');
  const companyId = activeCompany?.id || currentUser?.companyId;
  const teamId = providedTeamId || currentUser?.teamId || '';

  const loadBoard = useCallback(async () => {
    if (!companyId || !normalizedCode) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(
        `/companies/${companyId}/services/${normalizedCode}/work-items${teamId ? `?teamId=${encodeURIComponent(teamId)}` : ''}`
      );
      setItems(response.data || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load service work.');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, normalizedCode, teamId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    setEmployees(providedEmployees || []);
  }, [providedEmployees]);

  useEffect(() => {
    if (!canAssign || !companyId || !normalizedCode || providedEmployees !== undefined) return;
    api.get(`/companies/${companyId}/services/${normalizedCode}/team`, { noCache: true })
      .then((response) => setEmployees(response.data?.employees || []))
      .catch((loadError) => setError(loadError.message || 'Unable to load department team members.'));
  }, [canAssign, companyId, normalizedCode, providedEmployees]);

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.status === 'ACTIVE'),
    [employees]
  );

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      await api.post(
        `/companies/${companyId}/services/${normalizedCode}/work-items`,
        { ...draft, teamId: teamId || undefined }
      );
      const assignedTitle = draft.title;
      setDraft(EMPTY_WORK);
      setShowCreate(false);
      await loadBoard();
      showToast?.('Work Assigned', `${assignedTitle} has been assigned.`, 'success');
    } catch (saveError) {
      setError(saveError.message || 'Unable to create this work item.');
      showToast?.('Assignment Failed', saveError.message || 'Unable to create this work item.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (item) => {
    const values = updates[item.id] || {};
    setError('');
    setIsSaving(true);
    try {
      await api.patch(`/companies/${companyId}/work-items/${item.id}`, {
        status: values.status || item.status,
        progress: Number(values.progress ?? item.progress),
        note: values.note || '',
      });
      setUpdates((current) => ({ ...current, [item.id]: {} }));
      await loadBoard();
      showToast?.('Work Updated', `Progress updated for "${item.title}".`, 'success');
    } catch (saveError) {
      setError(saveError.message || 'Unable to update this work item.');
      showToast?.('Update Failed', saveError.message || 'Unable to update this work item.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '0.6rem 0.7rem',
    border: '1px solid #cbd5e1',
    borderRadius: '7px',
    color: '#0f172a',
    background: '#ffffff',
    font: 'inherit',
    fontSize: '0.84rem',
  };
  const canShowUpdate = (item) => canManageAll || item.assignedTo.id === String(currentUser?.id);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>Team Work</h3>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.82rem' }}>
            Assign work, track progress, and record updates for this service.
          </p>
        </div>
        {canAssign && (
          <button
            type="button"
            onClick={() => {
              setDraft(EMPTY_WORK);
              setShowCreate(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.1rem',
              border: 0,
              borderRadius: '8px',
              color: '#fff',
              background: accentColor,
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(127, 34, 254, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>＋ Assign Work</span>
          </button>
        )}
      </div>

      <AnimatedModal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          setDraft(EMPTY_WORK);
        }}
        maxWidth="600px"
      >
        {({ close }) => (
          <>
            <div className="resp-modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Assign Work & Task
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Create and delegate a work item to a team member for this service.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
                margin: 0,
              }}
            >
              <div className="resp-modal-body" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    Work Title *
                  </label>
                  <input
                    required
                    maxLength={180}
                    placeholder="e.g. Follow up on hot leads in Mumbai region"
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    style={fieldStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem' }}>
                  <div>
                    <label style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Assign To *
                    </label>
                    <select
                      required
                      value={draft.assignedToId}
                      onChange={(event) => setDraft({ ...draft, assignedToId: event.target.value })}
                      style={fieldStyle}
                    >
                      <option value="">Select team member</option>
                      {activeEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.email || employee.role || 'Member'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={draft.dueDate}
                      onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    Task Details & Instructions
                  </label>
                  <textarea
                    rows={3}
                    maxLength={10000}
                    placeholder="Add detailed scope, milestones, or instructions..."
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    style={{ ...fieldStyle, resize: 'vertical' }}
                  />
                </div>

                {!activeEmployees.length && (
                  <span style={{ color: '#b45309', fontSize: '0.82rem', background: '#fffbeb', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    ⚠️ Please add an active team employee before assigning work.
                  </span>
                )}
              </div>

              <div className="resp-modal-footer" style={{ padding: '1rem 1.5rem' }}>
                <button
                  type="button"
                  onClick={close}
                  style={{
                    padding: '0.58rem 1.15rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#475569',
                    background: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || activeEmployees.length === 0}
                  style={{
                    padding: '0.58rem 1.35rem',
                    border: 0,
                    borderRadius: '8px',
                    color: '#fff',
                    background: isSaving ? '#94a3b8' : accentColor,
                    fontWeight: 700,
                    cursor: isSaving ? 'wait' : 'pointer',
                    boxShadow: '0 2px 6px rgba(127, 34, 254, 0.25)',
                  }}
                >
                  {isSaving ? 'Assigning...' : 'Assign Work'}
                </button>
              </div>
            </form>
          </>
        )}
      </AnimatedModal>

      {isLoading ? (
        <p style={{ margin: 0, color: '#64748b' }}>Loading team work…</p>
      ) : items.length ? (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {items.map((item) => {
            const draftUpdate = updates[item.id] || {};
            return (
              <article key={item.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.94rem' }}>{item.title}</h4>
                    {item.description && <p style={{ margin: '0.3rem 0', color: '#475569', fontSize: '0.84rem' }}>{item.description}</p>}
                    <p style={{ margin: '0.3rem 0 0', color: '#64748b', fontSize: '0.78rem' }}>
                      Assigned to {item.assignedTo.name}
                      {item.dueDate ? ` · Due ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                      {` · Created by ${item.createdBy}`}
                    </p>
                  </div>
                  <strong style={{ color: item.status === 'DONE' ? '#047857' : item.status === 'BLOCKED' ? '#b91c1c' : '#6b21a8', fontSize: '0.82rem' }}>
                    {STATUS_LABELS[item.status]} · {item.progress}%
                  </strong>
                </div>
                {canShowUpdate(item) && (
                  <div className="resp-grid-work-update" style={{ marginTop: '0.8rem' }}>
                    <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                      Status
                      <select value={draftUpdate.status ?? item.status} onChange={(event) => setUpdates({ ...updates, [item.id]: { ...draftUpdate, status: event.target.value } })} style={{ ...fieldStyle, display: 'block', marginTop: '0.25rem' }}>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                      Progress %
                      <input type="number" min={0} max={100} value={draftUpdate.progress ?? item.progress} onChange={(event) => setUpdates({ ...updates, [item.id]: { ...draftUpdate, progress: event.target.value } })} style={{ ...fieldStyle, display: 'block', marginTop: '0.25rem' }} />
                    </label>
                    <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                      Update note
                      <input maxLength={2000} value={draftUpdate.note || ''} onChange={(event) => setUpdates({ ...updates, [item.id]: { ...draftUpdate, note: event.target.value } })} placeholder="What changed?" style={{ ...fieldStyle, display: 'block', marginTop: '0.25rem' }} />
                    </label>
                    <button type="button" disabled={isSaving} onClick={() => handleUpdate(item)} style={{ padding: '0.62rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#334155', background: '#fff', fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer' }}>Update</button>
                  </div>
                )}
                {item.updates?.length > 0 && (
                  <details style={{ marginTop: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                    <summary style={{ cursor: 'pointer' }}>Update history ({item.updates.length})</summary>
                    <ul style={{ margin: '0.45rem 0 0', paddingLeft: '1.2rem' }}>
                      {item.updates.map((update) => (
                        <li key={update.id}>
                          {update.author}{update.status ? ` · ${STATUS_LABELS[update.status]}` : ''}{update.progress !== null ? ` · ${update.progress}%` : ''}{update.note ? ` · ${update.note}` : ''}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <p style={{ margin: 0, padding: '1rem', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '9px', textAlign: 'center' }}>
          No work has been assigned to this department team yet.
        </p>
      )}
    </section>
  );
}

export function TeamHeadPermissions({ permissions = {}, disabled, onChange }) {
  return (
    <div style={{ display: 'grid', gap: '0.55rem', marginTop: '0.9rem' }}>
      {PERMISSION_LABELS.map(([key, label]) => (
        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#334155', fontSize: '0.82rem', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <input
            type="checkbox"
            checked={permissions[key] === true}
            disabled={disabled}
            onChange={(event) => onChange({ ...permissions, [key]: event.target.checked })}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
