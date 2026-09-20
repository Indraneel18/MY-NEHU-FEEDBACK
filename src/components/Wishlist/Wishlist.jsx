import { CyberCard } from '../UI/CyberCard';
import { FeatureCard } from './FeatureCard';

export function Wishlist({ features, upvotedIds, handleUpvote, setShowProposalModal }) {
  const sortedFeatures = [...features].sort((a, b) => b.upvotes - a.upvotes);
  return (
    <CyberCard style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div><h2 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.4rem' }}>Community Feature Voting Board</h2><p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Upvote requested features to prioritize development for MY NEHU 2.0.</p></div>
        <button onClick={() => setShowProposalModal(true)} className="btn-cyber-pink">+ Propose Feature</button>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>{sortedFeatures.map(feature => <FeatureCard key={feature.id} feature={feature} isUpvoted={upvotedIds.includes(feature.id)} handleUpvote={handleUpvote} />)}</div>
    </CyberCard>
  );
}
