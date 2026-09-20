export const REASON_TAGS = [
  { id: 'unaware', label: 'Didn\'t know MY NEHU app existed', icon: '❓' },
  { id: 'outdated_info', label: 'Outdated exam & syllabus info', icon: '⏰' },
  { id: 'clunky_ui', label: 'UI looks outdated / clunky', icon: '📱' },
  { id: 'no_bus_tracker', label: 'Missing live campus bus tracking', icon: '🚌' },
  { id: 'hostel_notice_delays', label: 'Hostel mess & notice delays', icon: '🏢' },
  { id: 'no_notifications', label: 'Push notifications don\'t work', icon: '🔔' },
  { id: 'prefer_whatsapp', label: 'Prefer WhatsApp student groups', icon: '💬' },
  { id: 'slow_loading', label: 'App is slow / frequent crashes', icon: '⚡' },
  { id: 'no_pyq', label: 'No past year question papers', icon: '📚' }
];

export const INITIAL_FEEDBACK = [];

export const INITIAL_FEATURES = [
  {
    id: 'f1',
    title: 'Real-Time Campus Bus Tracking',
    category: 'Transit',
    upvotes: 0,
    suggested_by: 'NEHU Student',
    description: 'Live GPS location of NEHU shuttle buses operating between Mawlai main campus and Police Bazar.'
  },
  {
    id: 'f2',
    title: 'Instant Exam Result Push Alerts',
    category: 'Academics',
    upvotes: 0,
    suggested_by: 'NEHU Student',
    description: 'Get an immediate phone notification as soon as NEHU examination branch releases grade sheets.'
  },
  {
    id: 'f3',
    title: 'Past 5 Years Question Papers Hub',
    category: 'Academics',
    upvotes: 0,
    suggested_by: 'NEHU Student',
    description: 'Centralized searchable repository of past end-sem exam question papers sorted by department.'
  }
];
