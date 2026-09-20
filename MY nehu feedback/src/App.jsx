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
  ensureUserSession,
  getUserFeedback,
  getUserFeatures,
  getUserFeatureVotes,
  insertFeedback,
  insertFeature,
  toggleFeatureUpvote,
  deleteAllFeedback,
  deleteAllFeatures,
} from './lib/supabaseData';

const readLocalFeedback = () => {
  try {
    const saved = localStorage.getItem('mynehu_feedback_list_v2');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  } catch {
    return INITIAL_FEEDBACK;
  }
};

const readLocalFeatures = () => {
  try {
    const saved = localStorage.getItem('mynehu_features_list_v2');
    return saved ? JSON.parse(saved) : INITIAL_FEATURES;
  } catch {
    return INITIAL_FEATURES;
  }
};

const readLocalUpvotes = () => {
  try {
    const saved = localStorage.getItem('mynehu_user_upvotes_v2');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [tab, setTab] = useState('diagnostic');
  const [userId, setUserId] = useState(null);

  const [feedbackList, setFeedbackList] = useState(() => readLocalFeedback());
  const [features, setFeatures] = useState(() => readLocalFeatures());
  const [upvotedIds, setUpvotedIds] = useState(() => readLocalUpvotes());

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
      const localFeedback = readLocalFeedback();
      const localFeatures = readLocalFeatures();
      const localUpvotes = readLocalUpvotes();

      setFeedbackList(localFeedback);
      setFeatures(localFeatures.length ? localFeatures : INITIAL_FEATURES);
      setUpvotedIds(localUpvotes);

      try {
        const user = await ensureUserSession();
        if (!user) return;

        setUserId(user.id);

        const [remoteFeedback, remoteFeatures, remoteUpvotes] = await Promise.all([
          getUserFeedback(user.id),
          getUserFeatures(user.id),
          getUserFeatureVotes(user.id),
        ]);

        if (remoteFeedback.length) {
          setFeedbackList(remoteFeedback);
          localStorage.setItem('mynehu_feedback_list_v2', JSON.stringify(remoteFeedback));
        }

        if (remoteFeatures.length) {
          setFeatures(remoteFeatures);
          localStorage.setItem('mynehu_features_list_v2', JSON.stringify(remoteFeatures));
        }

        if (remoteUpvotes.length) {
          setUpvotedIds(remoteUpvotes);
          localStorage.setItem('mynehu_user_upvotes_v2', JSON.stringify(remoteUpvotes));
        }
      } catch (error) {
        console.warn('Supabase load failed; using local browser data instead.', error);
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
      id: 'fb-' + Date.now(),
      user_id: userId || 'local-session',
      name: name.trim(),
      department: dept,
      year_of_study: yearOfStudy,
      usage_frequency: usageFreq,
      reasons: [...selectedReasons],
      reason_details: reasonDetails.trim(),
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    if (!userId) {
      const nextList = [newFeedback, ...feedbackList];
      setFeedbackList(nextList);
      localStorage.setItem('mynehu_feedback_list_v2', JSON.stringify(nextList));
      setSubmitted(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      return;
    }

    try {
      const saved = await insertFeedback(newFeedback);
      setFeedbackList(prev => [saved, ...prev]);
      setSubmitted(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (error) {
      console.error('Failed to save feedback:', error);
      alert(`Failed to submit feedback: ${error.message}`);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setReasonDetails('');
    setSelectedReasons([]);
  };

  const handleUpvote = async (id) => {
    if (!userId) {
      const isAlreadyUpvoted = upvotedIds.includes(id);
      const nextUpvotes = isAlreadyUpvoted ? upvotedIds.filter(item => item !== id) : [...upvotedIds, id];
      const nextFeatures = features.map(feature => {
        if (feature.id !== id) return feature;
        const currentVotes = Number(feature.upvotes || 0);
        return { ...feature, upvotes: Math.max(0, isAlreadyUpvoted ? currentVotes - 1 : currentVotes + 1) };
      });

      setUpvotedIds(nextUpvotes);
      setFeatures(nextFeatures);
      localStorage.setItem('mynehu_user_upvotes_v2', JSON.stringify(nextUpvotes));
      localStorage.setItem('mynehu_features_list_v2', JSON.stringify(nextFeatures));
      if (!isAlreadyUpvoted && typeof confetti === 'function') confetti({ particleCount: 30, spread: 40 });
      return;
    }

    try {
      const updatedFeature = await toggleFeatureUpvote(id, userId);
      setFeatures(prev => prev.map(feature => feature.id === id ? { ...feature, upvotes: Number(updatedFeature.upvotes || 0) } : feature));
      setUpvotedIds(prev => updatedFeature.user_upvoted ? [...new Set([...prev, id])] : prev.filter(featureId => featureId !== id));

      if (updatedFeature.user_upvoted && typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (error) {
      console.error('Failed to upvote feature:', error);
    }
  };

  const handleProposeFeature = async (event) => {
    event.preventDefault();
    if (!newPropTitle.trim()) return;

    const newFeatureObj = {
      id: 'f-' + Date.now(),
      user_id: userId || 'local-session',
      title: newPropTitle.trim(),
      category: newPropCategory,
      upvotes: 1,
      suggested_by: name.trim() || 'NEHU Student',
      description: newPropDesc.trim() || 'No description provided.',
      created_at: new Date().toISOString(),
    };

    if (!userId) {
      const nextFeatures = [newFeatureObj, ...features];
      setFeatures(nextFeatures);
      const nextVotes = [...new Set([...upvotedIds, newFeatureObj.id])];
      setUpvotedIds(nextVotes);
      localStorage.setItem('mynehu_features_list_v2', JSON.stringify(nextFeatures));
      localStorage.setItem('mynehu_user_upvotes_v2', JSON.stringify(nextVotes));
      setShowProposalModal(false);
      setNewPropTitle('');
      setNewPropDesc('');
      confetti({ particleCount: 45, spread: 55 });
      return;
    }

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
      if (userId) {
        try {
          await deleteAllFeedback(userId);
          await deleteAllFeatures(userId);
        } catch (error) {
          console.error('Failed to clear data:', error);
        }
      }

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

