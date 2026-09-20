export function Header({ tab, setTab }) {
  const tabs = [
    { id: 'diagnostic', label: 'Diagnostic' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 243, 255, 0.25)', backgroundColor: 'rgba(7, 8, 13, 0.88)', padding: '0.85rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'radial-gradient(circle, rgba(0,243,255,0.25) 0%, rgba(7,8,13,0.8) 100%)', border: '1px solid var(--cyan-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,243,255,0.3)', fontSize: '1.2rem' }}>⚡</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 className="font-heading" style={{ fontSize: '1.15rem', color: '#fff', letterSpacing: '0.08em' }}>MY NEHU // FEEDBACK PORTAL</h1>
            </div>
            <p className="font-mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>North-Eastern Hill University Student Engagement Survey</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(15,23,42,0.7)', padding: '0.3rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className="font-mono" style={{ padding: '0.55rem 0.9rem', borderRadius: '6px', border: tab === t.id ? '1px solid var(--cyan-primary)' : '1px solid transparent', background: tab === t.id ? 'rgba(0,243,255,0.15)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s ease', textTransform: 'uppercase' }}>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
