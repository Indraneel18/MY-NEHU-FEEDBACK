import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BackgroundEffects } from './components/Background/BackgroundEffects';
import { ParticleBackground } from './components/Background/ParticleBackground';
import { Header } from './components/Header/Header';
import { Diagnostic } from './components/Diagnostic/Diagnostic';
import { Wishlist } from './components/Wishlist/Wishlist';
import { FeatureModal } from './components/Wishlist/FeatureModal';
import { Analytics } from './components/Analytics/Analytics';
import { INITIAL_FEEDBACK, INITIAL_FEATURES } from './data/constants';

export default function App() {
  const [tab, setTab] = useState('diagnostic');
  
  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('mynehu_feedback_list_v2');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [features, setFeatures] = useState(() => {
    const saved = localStorage.getItem('mynehu_features_list_v2');
    return saved ? JSON.parse(saved) : INITIAL_FEATURES;
  });

  const [upvotedIds, setUpvotedIds] = useState(() => {
    const saved = localStorage.getItem('mynehu_user_upvotes_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [dept, setDept] = useState('B.Tech (CSE / ECE / IT / Energy Engg)');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year (Freshman)');
  const [usageFreq, setUsageFreq] = useState('Tried Once');
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [reasonDetails, setReasonDetails] = useState('');

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropCategory, setNewPropCategory] = useState('Academics');
  const [newPropDesc, setNewPropDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('mynehu_feedback_list_v2', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('mynehu_features_list_v2', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('mynehu_user_upvotes_v2', JSON.stringify(upvotedIds));
  }, [upvotedIds]);

  const toggleReason = (id) => {
    if (selectedReasons.includes(id)) {
      setSelectedReasons(selectedReasons.filter(reason => reason !== id));
    } else {
      setSelectedReasons([...selectedReasons, id]);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!isAnon && !name.trim()) return;

    const newFeedback = {
      id: 'fb-' + Date.now(),
      name: isAnon ? 'Anonymous Student' : name.trim(),
      department: dept,
      year_of_study: yearOfStudy,
      usage_frequency: usageFreq,
      reasons: [...selectedReasons],
      reason_details: reasonDetails.trim(),
      timestamp: new Date().toISOString()
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setSubmitted(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setReasonDetails('');
    setSelectedReasons([]);
  };

  const handleUpvote = (id) => {
    if (upvotedIds.includes(id)) {
      setUpvotedIds(upvotedIds.filter(i => i !== id));
      setFeatures(features.map(f => f.id === id ? { ...f, upvotes: Math.max(0, f.upvotes - 1) } : f));
    } else {
      setUpvotedIds([...upvotedIds, id]);
      setFeatures(features.map(f => f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f));
      if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 40 });
    }
  };

  const handleProposeFeature = (event) => {
    event.preventDefault();
    if (!newPropTitle.trim()) return;

    const newFeatureObj = {
      id: 'f-' + Date.now(),
      title: newPropTitle.trim(),
      category: newPropCategory,
      upvotes: 1,
      suggested_by: isAnon || !name ? 'NEHU Student' : name.trim(),
      description: newPropDesc.trim() || 'No description provided.'
    };
    setFeatures([newFeatureObj, ...features]);
    setUpvotedIds([...upvotedIds, newFeatureObj.id]);
    setShowProposalModal(false);
    setNewPropTitle('');
    setNewPropDesc('');
    confetti({ particleCount: 45, spread: 55 });
  };

  const handleExportCSV = () => {
    if (feedbackList.length === 0) {
      alert('No feedback responses recorded yet to export.');
      return;
    }
    const headers = ['ID', 'Name', 'Department', 'Year of Study', 'Usage Frequency', 'Reasons', 'Reason Details', 'Timestamp'];
    const rows = feedbackList.map(item => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.department}"`,
      `"${item.year_of_study}"`,
      `"${item.usage_frequency}"`,
      `"${(item.reasons || []).join(', ')}"`,
      `"${(item.reason_details || '').replace(/"/g, '""')}"`,
      item.timestamp || ''
    ]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MY_NEHU_Diagnostics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all feedback submissions?')) {
      localStorage.removeItem('mynehu_feedback_list_v2');
      localStorage.removeItem('mynehu_features_list_v2');
      localStorage.removeItem('mynehu_user_upvotes_v2');
      setFeedbackList([]);
      setFeatures(INITIAL_FEATURES);
      setUpvotedIds([]);
    }
  };

  return (
    <div className="cyber-bg-grid" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <BackgroundEffects />
      <ParticleBackground />

      <Header tab={tab} setTab={setTab} />

      <main style={{ maxWidth: '950px', margin: '2rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        {tab === 'diagnostic' && (
          <Diagnostic submitted={submitted} name={name} setName={setName} isAnon={isAnon} setIsAnon={setIsAnon} dept={dept} setDept={setDept} yearOfStudy={yearOfStudy} setYearOfStudy={setYearOfStudy} usageFreq={usageFreq} setUsageFreq={setUsageFreq} selectedReasons={selectedReasons} toggleReason={toggleReason} reasonDetails={reasonDetails} setReasonDetails={setReasonDetails} handleFormSubmit={handleFormSubmit} resetForm={resetForm} setTab={setTab} />
        )}

        {tab === 'wishlist' && (
          <Wishlist features={features} upvotedIds={upvotedIds} handleUpvote={handleUpvote} setShowProposalModal={setShowProposalModal} />
        )}

        {tab === 'analytics' && (
          <Analytics feedbackList={feedbackList} handleClearAllData={handleClearAllData} handleExportCSV={handleExportCSV} />
        )}
      </main>

      <FeatureModal showProposalModal={showProposalModal} setShowProposalModal={setShowProposalModal} newPropTitle={newPropTitle} setNewPropTitle={setNewPropTitle} newPropCategory={newPropCategory} setNewPropCategory={setNewPropCategory} newPropDesc={newPropDesc} setNewPropDesc={setNewPropDesc} handleProposeFeature={handleProposeFeature} />
    </div>
  );
}
