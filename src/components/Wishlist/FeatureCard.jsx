export function FeatureCard({ feature, isUpvoted, handleUpvote }) {
  return (
    <div style={{ background: 'rgba(10,14,23,0.7)', border: isUpvoted ? '1px solid var(--cyan-primary)' : '1px solid rgba(0,243,255,0.15)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div>
        <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--cyan-primary)', background: 'rgba(0,243,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{feature.category}</span>
        <h3 className="font-sub" style={{ fontSize: '1rem', color: '#fff', marginTop: '0.3rem' }}>{feature.title}</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{feature.description}</p>
      </div>
      <button onClick={() => handleUpvote(feature.id)} className="btn-cyber-primary" style={{ flexShrink: 0, padding: '0.5rem 0.8rem', background: isUpvoted ? 'var(--cyan-primary)' : undefined, color: isUpvoted ? '#07080d' : undefined }}>👍 {feature.upvotes}</button>
    </div>
  );
}
