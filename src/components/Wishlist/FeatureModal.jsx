import { CyberCard } from '../UI/CyberCard';

export function FeatureModal({ showProposalModal, setShowProposalModal, newPropTitle, setNewPropTitle, newPropCategory, setNewPropCategory, newPropDesc, setNewPropDesc, handleProposeFeature }) {
  if (!showProposalModal) return null;
  return (
    <div className="modal-overlay">
      <CyberCard style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}><h3 className="font-heading" style={{ color: '#fff', fontSize: '1.2rem' }}>Propose Feature for MY NEHU 2.0</h3><button onClick={() => setShowProposalModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button></div>
        <form onSubmit={handleProposeFeature}>
          <div style={{ marginBottom: '1rem' }}><label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.3rem' }}>FEATURE TITLE</label><input type="text" required value={newPropTitle} onChange={e => setNewPropTitle(e.target.value)} placeholder="Enter feature title..." className="cyber-input" /></div>
          <div style={{ marginBottom: '1rem' }}><label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.3rem' }}>CATEGORY</label><select value={newPropCategory} onChange={e => setNewPropCategory(e.target.value)} className="cyber-select"><option>Academics</option><option>Transit</option><option>Hostel</option><option>Notifications</option><option>Admin</option></select></div>
          <div style={{ marginBottom: '1.5rem' }}><label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.3rem' }}>DESCRIPTION</label><textarea rows="3" value={newPropDesc} onChange={e => setNewPropDesc(e.target.value)} placeholder="Describe how this feature will help NEHU students..." className="cyber-input" /></div>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}><button type="button" onClick={() => setShowProposalModal(false)} className="btn-cyber-secondary">Cancel</button><button type="submit" className="btn-cyber-primary">Submit Feature Proposal</button></div>
        </form>
      </CyberCard>
    </div>
  );
}
