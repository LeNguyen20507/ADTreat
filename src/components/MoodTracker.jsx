/**
 * Mood Tracking Component
 * Daily emotional check-in with AI-powered insights
 * Tracks mood patterns for caregiver reports
 */

import { useState, useEffect } from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart,
  Sun,
  Cloud,
  CloudRain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MessageCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { trackActivity, getRecentActivities } from '../utils/activityTracker';

const MOODS = [
  { 
    id: 'great', 
    label: 'Great', 
    emoji: '😊', 
    icon: Sun,
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Feeling wonderful today!'
  },
  { 
    id: 'good', 
    label: 'Good', 
    emoji: '🙂', 
    icon: Cloud,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    description: 'Having a nice day'
  },
  { 
    id: 'okay', 
    label: 'Okay', 
    emoji: '😐', 
    icon: Meh,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Just an average day'
  },
  { 
    id: 'low', 
    label: 'Low', 
    emoji: '😔', 
    icon: CloudRain,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    description: 'Feeling a bit down'
  },
  { 
    id: 'struggling', 
    label: 'Struggling', 
    emoji: '😢', 
    icon: Frown,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    description: 'Need some extra support'
  }
];

const FOLLOW_UP_QUESTIONS = {
  great: "That's wonderful! What's making today so good?",
  good: "Nice! Anything special happening today?",
  okay: "I understand. Would you like to talk about it?",
  low: "I'm here for you. Would you like to share what's on your mind?",
  struggling: "I'm so sorry you're feeling this way. I'm here to help."
};

const MoodTracker = ({ 
  mode = 'compact', // 'compact' | 'full' | 'widget'
  onMoodLogged,
  showHistory = false 
}) => {
  const { currentPatient } = usePatient();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [trend, setTrend] = useState('stable');
  const [isExpanded, setIsExpanded] = useState(mode === 'full');

  // Load mood history
  useEffect(() => {
    const activities = getRecentActivities(7, currentPatient?.id);
    const moods = activities
      .filter(a => a.type === 'MOOD_CHECKIN')
      .map(a => ({
        ...a.metadata,
        date: a.date,
        timestamp: a.timestamp
      }));
    
    setMoodHistory(moods);
    
    // Calculate trend
    if (moods.length >= 2) {
      const moodValues = { great: 5, good: 4, okay: 3, low: 2, struggling: 1 };
      const recent = moodValues[moods[0]?.mood] || 3;
      const previous = moodValues[moods[1]?.mood] || 3;
      
      if (recent > previous) setTrend('improving');
      else if (recent < previous) setTrend('declining');
      else setTrend('stable');
    }
  }, [currentPatient]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowFollowUp(true);
  };

  const handleSubmit = () => {
    const moodData = {
      mood: selectedMood.id,
      note: note.trim(),
      time: new Date().toLocaleTimeString(),
      patientName: currentPatient?.preferredName || currentPatient?.name
    };

    trackActivity('MOOD_CHECKIN', moodData, currentPatient?.id);

    // Update local history
    setMoodHistory(prev => [{
      ...moodData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    }, ...prev]);

    // Reset state
    setShowFollowUp(false);
    setSelectedMood(null);
    setNote('');

    // Notify parent
    if (onMoodLogged) {
      onMoodLogged(moodData);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const TrendIcon = getTrendIcon();

  // Widget mode - minimal display
  if (mode === 'widget') {
    const latestMood = moodHistory[0];
    const moodInfo = latestMood ? MOODS.find(m => m.id === latestMood.mood) : null;

    return (
      <button 
        onClick={() => setIsExpanded(true)}
        style={{
          ...styles.widget,
          backgroundColor: moodInfo?.bgColor || '#F3F4F6'
        }}
      >
        <span style={styles.widgetEmoji}>
          {moodInfo?.emoji || '💭'}
        </span>
        <span style={{
          ...styles.widgetText,
          color: moodInfo?.color || '#6B7280'
        }}>
          {moodInfo ? `Feeling ${moodInfo.label.toLowerCase()}` : 'How are you?'}
        </span>
        <ChevronRight size={16} color={moodInfo?.color || '#6B7280'} />
      </button>
    );
  }

  return (
    <div style={{
      ...styles.container,
      ...(mode === 'compact' ? styles.containerCompact : {})
    }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Sparkles size={20} color="#F59E0B" />
          <h3 style={styles.title}>How are you feeling?</h3>
        </div>
        {moodHistory.length > 0 && (
          <div style={styles.trendBadge}>
            <TrendIcon size={14} color={getTrendColor()} />
            <span style={{ color: getTrendColor(), fontSize: '12px' }}>
              {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
            </span>
          </div>
        )}
      </div>

      {/* Follow-up Question Modal */}
      {showFollowUp && selectedMood && (
        <div style={styles.overlay}>
          <div style={styles.followUpCard}>
            <button 
              onClick={() => setShowFollowUp(false)}
              style={styles.closeButton}
            >
              <X size={20} />
            </button>
            
            <div style={{
              ...styles.selectedMoodDisplay,
              backgroundColor: selectedMood.bgColor
            }}>
              <span style={styles.bigEmoji}>{selectedMood.emoji}</span>
            </div>
            
            <h3 style={styles.followUpTitle}>
              {FOLLOW_UP_QUESTIONS[selectedMood.id]}
            </h3>
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share your thoughts (optional)..."
              style={styles.noteInput}
              rows={3}
            />
            
            <div style={styles.followUpActions}>
              <button 
                onClick={handleSubmit}
                style={{
                  ...styles.submitButton,
                  backgroundColor: selectedMood.color
                }}
              >
                <Heart size={18} />
                Log My Mood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood Selection Grid */}
      <div style={styles.moodGrid}>
        {MOODS.map(mood => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood)}
            style={{
              ...styles.moodButton,
              backgroundColor: selectedMood?.id === mood.id ? mood.bgColor : 'white',
              borderColor: mood.color,
              transform: selectedMood?.id === mood.id ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <span style={styles.moodEmoji}>{mood.emoji}</span>
            <span style={{ 
              ...styles.moodLabel,
              color: mood.color 
            }}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Mood History */}
      {showHistory && moodHistory.length > 0 && (
        <div style={styles.historySection}>
          <div style={styles.historyHeader}>
            <Calendar size={16} color="#6B7280" />
            <span>Recent Check-ins</span>
          </div>
          <div style={styles.historyList}>
            {moodHistory.slice(0, 5).map((entry, idx) => {
              const moodInfo = MOODS.find(m => m.id === entry.mood);
              return (
                <div key={idx} style={styles.historyItem}>
                  <span style={styles.historyEmoji}>{moodInfo?.emoji}</span>
                  <div style={styles.historyDetails}>
                    <span style={styles.historyMood}>{moodInfo?.label}</span>
                    <span style={styles.historyDate}>{entry.date}</span>
                  </div>
                  {entry.note && (
                    <MessageCircle size={14} color="#9CA3AF" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  containerCompact: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    backgroundColor: '#F3F4F6',
  },
  moodGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  moodButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    borderRadius: '12px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '60px',
    flex: '1',
    maxWidth: '80px',
  },
  moodEmoji: {
    fontSize: '28px',
    marginBottom: '4px',
  },
  moodLabel: {
    fontSize: '12px',
    fontWeight: '600',
  },
  overlay: {
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
  followUpCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    padding: '4px',
  },
  selectedMoodDisplay: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  bigEmoji: {
    fontSize: '48px',
  },
  followUpTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px',
  },
  noteInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    fontSize: '16px',
    resize: 'none',
    fontFamily: 'inherit',
    marginBottom: '16px',
  },
  followUpActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  historySection: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
  },
  historyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
  },
  historyEmoji: {
    fontSize: '20px',
  },
  historyDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  historyMood: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  historyDate: {
    fontSize: '12px',
    color: '#6B7280',
  },
  widget: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  widgetEmoji: {
    fontSize: '24px',
  },
  widgetText: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
  },
};

export default MoodTracker;
