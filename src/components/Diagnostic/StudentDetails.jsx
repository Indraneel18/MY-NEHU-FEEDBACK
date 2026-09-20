export function StudentDetails({ name, setName, isAnon, setIsAnon, dept, setDept, yearOfStudy, setYearOfStudy, usageFreq, setUsageFreq }) {
  return (
    <>
      <div style={{ marginBottom: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)' }}>01 // STUDENT NAME</label>
          <button type="button" onClick={() => setIsAnon(!isAnon)} className="font-mono" style={{ fontSize: '0.72rem', background: isAnon ? 'rgba(0,255,157,0.15)' : 'transparent', color: isAnon ? 'var(--emerald-neon)' : 'var(--text-dim)', border: 'none', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            {isAnon ? '✓ ANONYMOUS' : 'Submit Anonymously'}
          </button>
        </div>
        {!isAnon ? (
          <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name..." className="cyber-input" />
        ) : (
          <div className="font-mono" style={{ padding: '0.7rem 1rem', background: 'rgba(0, 255, 157, 0.08)', border: '1px solid var(--emerald-neon)', borderRadius: '6px', color: 'var(--emerald-neon)', fontSize: '0.85rem' }}>
            🔒 Submitting as Anonymous Student.
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.4rem' }}>
        <div>
          <label className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.4rem' }}>02 // DEPARTMENT</label>
          <select value={dept} onChange={e => setDept(e.target.value)} className="cyber-select">
            <option>B.Tech (BME / ECE / IT / Energy Engg)</option><option>M.Sc (Physics / Chemistry / Botany / Zoology)</option><option>B.A / M.A (English / History / Political Sci)</option><option>MBA / Commerce</option><option>LL.B / Law</option><option>Ph.D Scholar</option>
          </select>
        </div>
        <div>
          <label className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.4rem' }}>03 // YEAR OF STUDY</label>
          <select value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className="cyber-select">
            <option>1st Year (Freshman)</option><option>2nd Year (Sophomore)</option><option>3rd Year (Junior)</option><option>4th Year (Senior / Final)</option><option>Post-Graduate (M.Sc / M.A / MBA)</option><option>Ph.D / Research Scholar</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '1.4rem' }}>
        <label className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)', display: 'block', marginBottom: '0.4rem' }}>04 // HOW FREQUENTLY DO YOU USE MY NEHU?</label>
        <select value={usageFreq} onChange={e => setUsageFreq(e.target.value)} className="cyber-select">
          <option>Never</option><option>Tried Once</option><option>Rarely (1-2x/mo)</option><option>Weekly User</option><option>Daily User</option>
        </select>
      </div>
    </>
  );
}
