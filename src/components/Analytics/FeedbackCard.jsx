import { REASON_TAGS } from '../../data/constants';

export function FeedbackCard({ item }) {
  return (
    <div style={{ background: 'rgba(10,14,23,0.7)', border: '1px solid var(--border-cyan)', borderRadius: '8px', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}><strong style={{ color: '#fff', fontSize: '0.95rem' }}>👤 {item.name || 'Anonymous Student'}</strong><span className="font-mono" style={{ color: 'var(--emerald-neon)', fontSize: '0.78rem' }}>Usage: {item.usage_frequency}</span></div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>🏛 {item.department} • 🎓 {item.year_of_study}</div>
      {item.reasons && item.reasons.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>{item.reasons.map(rId => { const found = REASON_TAGS.find(t => t.id === rId); return <span key={rId} className="badge-cyber badge-purple" style={{ fontSize: '0.7rem' }}>{found ? `${found.icon} ${found.label}` : rId}</span>; })}</div>}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>&quot;{item.reason_details || 'No additional details provided.'}&quot;</p>
    </div>
  );
}
