import { REASON_TAGS } from '../../data/constants';

export function ReasonSelector({ selectedReasons, toggleReason, reasonDetails, setReasonDetails }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <label className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.5rem' }}>05 // REASON(S) FOR NOT USING MY NEHU (Select All That Apply)</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {REASON_TAGS.map(t => {
          const active = selectedReasons.includes(t.id);
          return <button type="button" key={t.id} onClick={() => toggleReason(t.id)} className={`diag-tag ${active ? 'active' : ''}`}><span>{t.icon}</span><span>{t.label}</span></button>;
        })}
      </div>
      <textarea rows="3" value={reasonDetails} onChange={e => setReasonDetails(e.target.value)} placeholder="Describe your primary reason for not using the app..." className="cyber-input" />
    </div>
  );
}
