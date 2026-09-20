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
import {
  getUserFeedback,
  getUserFeatures,
  insertFeedback,
  insertFeature,
  toggleFeatureUpvote,
} from './lib/supabaseData';

export default function App() {
  const [tab, setTab] = useState('diagnostic');

  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [features, setFeatures] = useState(INITIAL_FEATURES);
  const [upvotedIds, setUpvotedIds] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
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
  const loadData = async () => {
    try {
      const [remoteFeedback, remoteFeatures] = await Promise.all([
        getUserFeedback(),
        getUserFeatures(),
      ]);

      if (remoteFeedback.length) {
        setFeedbackList(remoteFeedback);
      }

      if (remoteFeatures.length) {
        setFeatures(remoteFeatures);
      }
    } catch (error) {
      console.warn(
        'Supabase load failed; using local browser data instead.',
        error
      );
    }
  };

  loadData();
}, []);
  const toggleReason = (id) => {
    if (selectedReasons.includes(id)) {
      setSelectedReasons(selectedReasons.filter(reason => reason !== id));
    } else {
      setSelectedReasons([...selectedReasons, id]);
    }
  };

  const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (!name.trim()) {
    alert('Please enter your name.');
    return;
  }

  const newFeedback = {
    name: name.trim(),
    department: dept,
    year_of_study: yearOfStudy,
    usage_frequency: usageFreq,
    reasons: [...selectedReasons],
    reason_details: reasonDetails.trim(),
  };

  try {
    const saved = await insertFeedback(newFeedback);

    setFeedbackList(prev => [saved, ...prev]);

    setSubmitted(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

  } catch (error) {
    console.error('Failed to save feedback:', error);

    alert(
      `Failed to submit feedback:\n${error.message}`
    );
  }
};
  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setReasonDetails('');
    setSelectedReasons([]);
  };

  const handleUpvote = async (id) => {
    const currentFeature = features.find(feature => feature.id === id);
    if (!currentFeature) return;
    const alreadyUpvoted = upvotedIds.includes(id);

    try {
      let targetId = id;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        const { id: ignoredId, ...featurePayload } = currentFeature;
        const savedFeature = await insertFeature(featurePayload);
        targetId = savedFeature.id;
        setFeatures(prev => prev.map(feature => feature.id === id ? savedFeature : feature));
      }

      const updatedFeature = await toggleFeatureUpvote(targetId, undefined, alreadyUpvoted);
      setFeatures(prev => prev.map(feature => (
        feature.id === id || feature.id === targetId
          ? { ...feature, upvotes: Number(updatedFeature.upvotes || 0) }
          : feature
      )));
      setUpvotedIds(prev => {
        const withoutIds = prev.filter(item => item !== id && item !== targetId);
        return updatedFeature.user_upvoted ? [...withoutIds, targetId] : withoutIds;
      });

      if (updatedFeature.user_upvoted && typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (error) {
      console.error('Failed to save upvote:', error);
      const nextVotes = Math.max(
        0,
        Number(currentFeature.upvotes || 0) + (alreadyUpvoted ? -1 : 1)
      );
      setFeatures(prev => prev.map(feature => (
        feature.id === id ? { ...feature, upvotes: nextVotes } : feature
      )));
      setUpvotedIds(prev => alreadyUpvoted
        ? prev.filter(item => item !== id)
        : [...prev, id]
      );
      if (!alreadyUpvoted && typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 40 });
      }
    }
  };

  const handleProposeFeature = async (event) => {
    event.preventDefault();
    if (!newPropTitle.trim()) return;

    const newFeatureObj = {
      title: newPropTitle.trim(),
      category: newPropCategory,
      upvotes: 1,
      suggested_by: name.trim() || 'NEHU Student',
      description: newPropDesc.trim() || 'No description provided.',
      created_at: new Date().toISOString(),
    };

    try {
      const saved = await insertFeature(newFeatureObj);
      setFeatures(prev => [saved, ...prev]);
      setUpvotedIds(prev => [...new Set([...prev, saved.id])]);
      setShowProposalModal(false);
      setNewPropTitle('');
      setNewPropDesc('');
      confetti({ particleCount: 45, spread: 55 });
    } catch (error) {
      console.error('Failed to save feature:', error);
      alert(`Failed to propose feature: ${error.message}`);
    }
  };

  const handleExportCSV = () => {
    if (feedbackList.length === 0) {
      alert('No feedback responses recorded yet to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Department', 'Year of Study', 'Usage Frequency', 'Reasons', 'Reason Details', 'Timestamp'];
    const rows = feedbackList.map(item => [
      item.id,
      `"${String(item.name || '').replace(/"/g, '""')}"`,
      `"${String(item.department || '').replace(/"/g, '""')}"`,
      `"${String(item.year_of_study || '').replace(/"/g, '""')}"`,
      `"${String(item.usage_frequency || '').replace(/"/g, '""')}"`,
      `"${String((item.reasons || []).join(', ')).replace(/"/g, '""')}"`,
      `"${String(item.reason_details || '').replace(/"/g, '""')}"`,
      item.timestamp || '',
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

  const handleClearAllData = async () => {
    if (confirm('Are you sure you want to clear all feedback submissions?')) {
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
          <Diagnostic submitted={submitted} name={name} setName={setName} dept={dept} setDept={setDept} yearOfStudy={yearOfStudy} setYearOfStudy={setYearOfStudy} usageFreq={usageFreq} setUsageFreq={setUsageFreq} selectedReasons={selectedReasons} toggleReason={toggleReason} reasonDetails={reasonDetails} setReasonDetails={setReasonDetails} handleFormSubmit={handleFormSubmit} resetForm={resetForm} setTab={setTab} />
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

