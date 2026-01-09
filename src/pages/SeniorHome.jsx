/**
 * Senior Home - Voice-First Simplified Interface
 * Large buttons, minimal cognitive load
 * 
 * Features:
 * - Daily check-in greeting
 * - Large, accessible action buttons
 * - Mood tracking integration
 * - Simplified navigation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Heart, 
  Pill, 
  Music,
  Sun,
  Moon,
  CloudSun,
  MessageCircle,
  Volume2,
  PhoneCall,
  Smile,
  Meh,
  Frown,
  Sparkles,
  CheckCircle,
  Clock,
  Settings,
  X,
  Brain,
  BookOpen,
  Camera,
  Coffee
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useRole } from '../context/RoleContext';
import { trackActivity } from '../utils/activityTracker';

const SeniorHome = () => {
  const navigate = useNavigate();
  const { currentPatient } = usePatient();
  const { isVoiceMode, toggleVoiceMode } = useRole();
  const [greeting, setGreeting] = useState('');
  const [timeIcon, setTimeIcon] = useState(Sun);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [todayMood, setTodayMood] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedActions, setSelectedActions] = useState(() => {
    const saved = localStorage.getItem('adtreat_senior_actions');
    if (saved) {
      // Filter out 'talk' if it was previously saved
      const parsed = JSON.parse(saved);
      return parsed.filter(id => id !== 'talk');
    }
    return ['music', 'meds', 'family', 'brain'];
  });

  // Determine time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setTimeIcon(Sun);
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
      setTimeIcon(CloudSun);
    } else {
      setGreeting('Good Evening');
      setTimeIcon(Moon);
    }

    // Track app opened
    trackActivity('APP_OPENED', { page: 'senior-home' }, currentPatient?.id);

    // Check if mood was logged today
    const lastMoodDate = localStorage.getItem('adtreat_last_mood_date');
    const today = new Date().toDateString();
    if (lastMoodDate !== today) {
      // Show mood check after a short delay
      setTimeout(() => setShowMoodCheck(true), 2000);
    }
  }, [currentPatient]);

  const handleMoodSelect = (mood) => {
    setTodayMood(mood);
    setShowMoodCheck(false);
    localStorage.setItem('adtreat_last_mood_date', new Date().toDateString());
    
    trackActivity('MOOD_CHECKIN', { 
      mood: mood.id,
      time: new Date().toLocaleTimeString() 
    }, currentPatient?.id);
  };

  const handleEmergencyCall = () => {
    trackActivity('FAMILY_CALL', { 
      type: 'emergency',
      contact: currentPatient?.emergencyContacts?.[0]?.name 
    }, currentPatient?.id);
    // In real app, would initiate call
    alert(`Calling ${currentPatient?.emergencyContacts?.[0]?.name || 'Emergency Contact'}...`);
  };

  const TimeIconComponent = timeIcon;
  const patientName = currentPatient?.preferredName || currentPatient?.name?.split(' ')[0] || 'Friend';

  const moods = [
    { id: 'great', label: 'Great!', icon: Smile, color: '#10B981', emoji: '😊' },
    { id: 'okay', label: 'Okay', icon: Meh, color: '#F59E0B', emoji: '😐' },
    { id: 'low', label: 'Not Great', icon: Frown, color: '#EF4444', emoji: '😔' },
  ];

  // All available quick actions
  const allQuickActions = [
    {
      id: 'music',
      label: 'Play Music',
      sublabel: 'Coming soon',
      icon: Music,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      action: () => {
        trackActivity('APP_OPENED', { feature: 'music' }, currentPatient?.id);
        alert('🎵 Music feature coming soon! We\'re adding your favorite tunes.');
      }
    },
    {
      id: 'meds',
      label: 'Medications',
      sublabel: 'View schedule',
      icon: Pill,
      color: '#10B981',
      bgColor: '#ECFDF5',
      action: () => {
        trackActivity('PAGE_VISITED', { page: 'reminders' }, currentPatient?.id);
        navigate('/reminders');
      }
    },
    {
      id: 'family',
      label: 'Call Family',
      sublabel: currentPatient?.emergencyContacts?.[0]?.name || 'Emergency',
      icon: PhoneCall,
      color: '#EC4899',
      bgColor: '#FDF2F8',
      action: handleEmergencyCall
    },
    {
      id: 'brain',
      label: 'Brain Games',
      sublabel: 'Fun exercises',
      icon: Brain,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      action: () => {
        trackActivity('COGNITIVE_EXERCISE', { type: 'started' }, currentPatient?.id);
        navigate('/learn');
      }
    },
    {
      id: 'stories',
      label: 'Stories',
      sublabel: 'Read & learn',
      icon: BookOpen,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      action: () => {
        trackActivity('PAGE_VISITED', { page: 'learn' }, currentPatient?.id);
        navigate('/learn');
      }
    },
    {
      id: 'photos',
      label: 'Photos',
      sublabel: 'Coming soon',
      icon: Camera,
      color: '#F97316',
      bgColor: '#FFF7ED',
      action: () => {
        trackActivity('PAGE_VISITED', { page: 'photos' }, currentPatient?.id);
        alert('📷 Photo memories coming soon! We\'re preparing your memory album.');
      }
    },
    {
      id: 'relax',
      label: 'Relax',
      sublabel: 'Coming soon',
      icon: Coffee,
      color: '#84CC16',
      bgColor: '#F7FEE7',
      action: () => {
        trackActivity('APP_OPENED', { feature: 'relax' }, currentPatient?.id);
        alert('🧘 Relaxation sounds coming soon! Calm moments await.');
      }
    }
  ];

  // Get currently selected actions (max 4 displayed)
  const quickActions = allQuickActions.filter(a => selectedActions.includes(a.id));

  const toggleActionSelection = (actionId) => {
    setSelectedActions(prev => {
      let newSelection;
      if (prev.includes(actionId)) {
        newSelection = prev.filter(id => id !== actionId);
      } else if (prev.length < 4) {
        newSelection = [...prev, actionId];
      } else {
        return prev; // Max 4 selected
      }
      localStorage.setItem('adtreat_senior_actions', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  return (
    <div className="senior-home" style={styles.container}>
      {/* Greeting Section */}
      <div style={styles.greetingSection}>
        <div style={styles.greetingRow}>
          <TimeIconComponent size={32} color="#F59E0B" />
          <div style={styles.greetingText}>
            <h1 style={styles.greeting}>{greeting}, {patientName}!</h1>
            <p style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Voice Mode Indicator */}
        {isVoiceMode && (
          <div style={styles.voiceModeIndicator}>
            <Volume2 size={20} color="#3B82F6" />
            <span>Voice Mode Active</span>
          </div>
        )}
      </div>

      {/* Mood Check Modal */}
      {showMoodCheck && (
        <div style={styles.moodOverlay}>
          <div style={styles.moodCard}>
            <Sparkles size={32} color="#F59E0B" />
            <h2 style={styles.moodTitle}>How are you feeling today?</h2>
            <p style={styles.moodSubtitle}>Tap to let us know</p>
            
            <div style={styles.moodOptions}>
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    ...styles.moodButton,
                    backgroundColor: mood.color,
                  }}
                >
                  <span style={styles.moodEmoji}>{mood.emoji}</span>
                  <span style={styles.moodLabel}>{mood.label}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowMoodCheck(false)}
              style={styles.skipButton}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Today's Mood (if set) */}
      {todayMood && (
        <div style={{
          ...styles.currentMood,
          backgroundColor: todayMood.bgColor || '#F0FDF4'
        }}>
          <CheckCircle size={20} color={todayMood.color} />
          <span style={{ color: todayMood.color, fontWeight: '600' }}>
            You're feeling {todayMood.label.toLowerCase()} today
          </span>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div style={{
        ...styles.actionsGrid,
        gridTemplateColumns: quickActions.length <= 2 ? 'repeat(2, 1fr)' : 
                            quickActions.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
      }}>
        {quickActions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            style={{
              ...styles.actionButton,
              backgroundColor: action.bgColor,
              borderColor: action.color
            }}
          >
            <action.icon size={36} color={action.color} />
            <span style={{ ...styles.actionLabel, color: action.color }}>
              {action.label}
            </span>
            <span style={styles.actionSublabel}>{action.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Reminder Preview */}
      <div style={styles.reminderPreview}>
        <div style={styles.reminderHeader}>
          <Clock size={20} color="#6B7280" />
          <span style={styles.reminderTitle}>Coming Up</span>
        </div>
        <div style={styles.reminderContent}>
          <Pill size={24} color="#3B82F6" />
          <div>
            <p style={styles.reminderName}>
              {currentPatient?.medications?.[0]?.name || 'Morning Medication'}
            </p>
            <p style={styles.reminderTime}>
              {currentPatient?.medications?.[0]?.dosage || 'As prescribed'}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <button 
        style={styles.settingsButton} 
        onClick={() => setShowSettings(true)}
        aria-label="Customize"
      >
        <Settings size={20} color="#6B7280" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div style={styles.moodOverlay}>
          <div style={{...styles.moodCard, maxWidth: '360px'}}>
            <button 
              onClick={() => setShowSettings(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9CA3AF'
              }}
            >
              <X size={24} />
            </button>
            
            <Settings size={32} color="#3B82F6" />
            <h2 style={styles.moodTitle}>Customize Your Home</h2>
            <p style={styles.moodSubtitle}>Choose up to 4 quick actions</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginTop: '16px'
            }}>
              {allQuickActions.map(action => {
                const isSelected = selectedActions.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => toggleActionSelection(action.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? action.color : '#E5E7EB'}`,
                      backgroundColor: isSelected ? action.bgColor : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <action.icon size={24} color={isSelected ? action.color : '#9CA3AF'} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isSelected ? action.color : '#6B7280'
                    }}>
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <p style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              {selectedActions.length}/4 selected
            </p>
            
            <button 
              onClick={() => setShowSettings(false)}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6); }
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        .senior-home button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    paddingTop: '90px', // Account for fixed navbar (70px + 20px spacing)
    paddingBottom: '100px',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  greetingSection: {
    marginBottom: '24px',
  },
  greetingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  date: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '4px 0 0 0',
  },
  voiceModeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#EFF6FF',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#3B82F6',
    fontWeight: '500',
  },
  moodOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  moodCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  moodTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '16px 0 8px',
  },
  moodSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '0 0 24px',
  },
  moodOptions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  moodButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    minWidth: '100px',
    transition: 'transform 0.2s',
  },
  moodEmoji: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  moodLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  },
  skipButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 16px',
  },
  currentMood: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '16px',
  },
  primaryVoiceButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    width: '100%',
    padding: '24px',
    backgroundColor: '#3B82F6',
    borderRadius: '24px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  voiceIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: 'white',
  },
  voiceButtonTitle: {
    fontSize: '28px',
    fontWeight: '700',
  },
  voiceButtonSub: {
    fontSize: '16px',
    opacity: 0.9,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 12px',
    borderRadius: '20px',
    border: '2px solid',
    cursor: 'pointer',
    gap: '12px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  actionLabel: {
    fontSize: '16px',
    fontWeight: '700',
    textAlign: 'center',
  },
  actionSublabel: {
    fontSize: '12px',
    color: '#6B7280',
    textAlign: 'center',
  },
  reminderPreview: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  reminderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  reminderTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
  },
  reminderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  reminderName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  reminderTime: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '4px 0 0 0',
  },
  settingsButton: {
    position: 'fixed',
    bottom: '80px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: 'white',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 100,
  }
};

export default SeniorHome;
