import { CyberCard } from '../UI/CyberCard';
import { FeedbackCard } from './FeedbackCard';

export function Analytics({ feedbackList, handleClearAllData, handleExportCSV }) {
  return (
    <CyberCard style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}><div><h2 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.4rem' }}>Real-Time Student Analytics Feed</h2><p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Submissions displaying Student Name, Department, Year of Study, Usage Frequency, and Non-Usage Reasons.</p></div><div style={{ display: 'flex', gap: '0.5rem' }}>{feedbackList.length > 0 && <button onClick={handleClearAllData} className="btn-cyber-secondary" style={{ color: 'var(--pink-neon)' }}>Clear Feed</button>}<button onClick={handleExportCSV} className="btn-cyber-secondary">Export CSV</button></div></div>
      {feedbackList.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem 1rem' }}>No feedback responses recorded yet. Be the first to submit a response using the Diagnostic Form!</div> : <div style={{ display: 'grid', gap: '1rem' }}>{feedbackList.map(item => <FeedbackCard key={item.id} item={item} />)}</div>}
    </CyberCard>
  );
}
