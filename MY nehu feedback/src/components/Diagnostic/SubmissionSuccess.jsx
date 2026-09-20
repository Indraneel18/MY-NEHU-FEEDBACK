export function SubmissionSuccess({ isAnon, name, onReset, onViewAnalytics }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <h2 className="font-heading" style={{ color: 'var(--emerald-neon)', fontSize: '1.5rem', marginBottom: '0.8rem' }}>FEEDBACK RECORDED!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', fontSize: '0.95rem' }}>Thank you <strong style={{ color: '#fff' }}>{isAnon ? 'Anonymous Student' : name}</strong>! Your response has been submitted successfully.</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onReset} className="btn-cyber-primary">Submit Another Response</button>
        <button onClick={onViewAnalytics} className="btn-cyber-secondary">View Analytics Dashboard →</button>
      </div>
    </div>
  );
}
