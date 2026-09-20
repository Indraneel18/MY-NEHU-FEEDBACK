import { CyberCard } from '../UI/CyberCard';
import { StudentDetails } from './StudentDetails';
import { ReasonSelector } from './ReasonSelector';
import { SubmissionSuccess } from './SubmissionSuccess';

export function Diagnostic({ submitted, name, setName, isAnon, setIsAnon, dept, setDept, yearOfStudy, setYearOfStudy, usageFreq, setUsageFreq, selectedReasons, toggleReason, reasonDetails, setReasonDetails, handleFormSubmit, resetForm, setTab }) {
  return (
    <CyberCard style={{ padding: '2rem' }}>
      {submitted ? <SubmissionSuccess isAnon={isAnon} name={name} onReset={resetForm} onViewAnalytics={() => setTab('analytics')} /> : (
        <form onSubmit={handleFormSubmit}>
          <h2 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.4rem' }}>Why Aren't Students Using MY NEHU?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>Please fill out your details and reasons for not using the MY NEHU app.</p>
          <StudentDetails name={name} setName={setName} isAnon={isAnon} setIsAnon={setIsAnon} dept={dept} setDept={setDept} yearOfStudy={yearOfStudy} setYearOfStudy={setYearOfStudy} usageFreq={usageFreq} setUsageFreq={setUsageFreq} />
          <ReasonSelector selectedReasons={selectedReasons} toggleReason={toggleReason} reasonDetails={reasonDetails} setReasonDetails={setReasonDetails} />
          <button type="submit" className="btn-cyber-primary" style={{ width: '100%', padding: '0.85rem' }}>SUBMIT MY NEHU FEEDBACK RESPONSE</button>
        </form>
      )}
    </CyberCard>
  );
}
