/**
 * Home Page - Patient Dashboard with Tabbed Reminders
 * Focus on songs/sounds for calming
 * 4 tabbed reminder types: Medication, Appointment, Meal, Activity
 */

import { useState } from 'react';
import { 
  Pill, 
  AlertTriangle,
  Activity,
  Brain,
  Plus,
  Clock,
  Calendar,
  Utensils,
  X,
  Edit3,
  Trash2,
  Save,
  Music,
  Mic,
  Play,
  Heart
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';

const Home = () => {
  const { currentPatient } = usePatient();

  // State for reminders - organized by type
  const [reminders, setReminders] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [activeTab, setActiveTab] = useState('medication');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    timeOfDay: 'morning',
    type: 'medication',
    isRecurring: false,
    note: ''
  });

  const reminderTypes = [
    { id: 'medication', label: 'Meds', icon: Pill, color: '#3B82F6' },
    { id: 'appointment', label: 'Appts', icon: Calendar, color: '#8B5CF6' },
    { id: 'meal', label: 'Meals', icon: Utensils, color: '#10B981' },
    { id: 'activity', label: 'Activity', icon: Activity, color: '#F59E0B' },
  ];

  const timeOfDayOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { id: 'evening', label: 'Evening', icon: '🌙' },
  ];

  const getTypeInfo = (type) => {
    return reminderTypes.find(t => t.id === type) || reminderTypes[0];
  };

  // Get reminders for current tab
  const currentTabReminders = reminders
    .filter(r => r.type === activeTab && !completedIds.includes(r.id))
    .sort((a, b) => {
      const order = { morning: 1, afternoon: 2, evening: 3 };
      if (a.isRecurring !== b.isRecurring) return b.isRecurring ? 1 : -1;
      return order[a.timeOfDay] - order[b.timeOfDay];
    });

  // Open modal for new reminder
  const handleAddNew = () => {
    setEditingReminder(null);
    setFormData({ title: '', timeOfDay: 'morning', type: activeTab, isRecurring: false, note: '' });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      timeOfDay: reminder.timeOfDay,
      type: reminder.type,
      isRecurring: reminder.isRecurring || false,
      note: reminder.note || ''
    });
    setShowModal(true);
  };

  // Save reminder
  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingReminder) {
      setReminders(prev => prev.map(r => 
        r.id === editingReminder.id ? { ...r, ...formData } : r
      ));
    } else {
      const newReminder = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setReminders(prev => [...prev, newReminder]);
    }
    
    setShowModal(false);
    setFormData({ title: '', timeOfDay: 'morning', type: activeTab, isRecurring: false, note: '' });
    setEditingReminder(null);
  };

  // Delete reminder
  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setCompletedIds(prev => prev.filter(cid => cid !== id));
  };

  // Toggle completion
  const toggleComplete = (id) => {
    if (completedIds.includes(id)) {
      setCompletedIds(prev => prev.filter(cid => cid !== id));
    } else {
      setCompletedIds(prev => [...prev, id]);
    }
  };

  // Get count for each tab
  const getTabCount = (type) => {
    return reminders.filter(r => r.type === type && !completedIds.includes(r.id)).length;
  };

  return (
    <div className="home-page">
      {/* Patient Identity Section */}
      <div className="patient-identity" style={{ '--patient-color': currentPatient?.color }}>
        <div 
          className="patient-photo"
          style={{ 
            background: `${currentPatient?.color}15`,
            borderColor: currentPatient?.color 
          }}
        >
          <span className="patient-avatar-emoji-lg">{currentPatient?.avatar || '👤'}</span>
        </div>
        <div className="patient-info">
          <h1 className="patient-name">{currentPatient?.preferredName || 'Patient'}</h1>
          <span className="patient-stage">{currentPatient?.stage || 'Unknown'} • Age {currentPatient?.age || '?'}</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="home-two-column">
        {/* Left Column - Songs & Sounds */}
        <div className="home-left-column">
          {/* Favorite Songs Card */}
          <div className="home-card songs-card">
            <div className="card-header">
              <Music size={16} />
              <span>Calming Songs</span>
              <Heart size={14} className="header-heart" />
            </div>
            <div className="card-content songs-list">
              {(currentPatient?.favoriteSongs || []).map((song, idx) => (
                <button key={idx} className="song-item">
                  <div className="song-play-btn">
                    <Play size={12} />
                  </div>
                  <div className="song-info">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                  {song.calming === 'very_high' && (
                    <span className="calming-badge">★</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Recordings Card */}
          <div className="home-card recordings-card">
            <div className="card-header">
              <Mic size={16} />
              <span>Family Voices</span>
            </div>
            <div className="card-content recordings-list">
              {(currentPatient?.voiceRecordings || []).map((recording, idx) => (
                <button key={idx} className="recording-item">
                  <div className="recording-play-btn">
                    <Play size={10} />
                  </div>
                  <div className="recording-info">
                    <span className="recording-title">{recording.title}</span>
                    <span className="recording-from">{recording.from}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Medications Mini Card */}
          <div className="home-card meds-mini-card">
            <div className="card-header">
              <Pill size={14} />
              <span>Medications</span>
            </div>
            <div className="card-content meds-compact">
              {(currentPatient?.medications || []).slice(0, 2).map((med, idx) => (
                <div key={idx} className="med-compact-item">
                  <span className="med-name">{med.name}</span>
                  <span className="med-dose">{med.dosage}</span>
                </div>
              ))}
              {(currentPatient?.allergies?.length > 0) && (
                <div className="allergy-compact">
                  <AlertTriangle size={10} />
                  <span>{currentPatient.allergies.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Reminders with Tabs */}
        <div className="home-right-column">
          <div className="home-card reminders-card-full">
            <div className="card-header reminders-header">
              <Brain size={16} />
              <span>Today's Schedule</span>
              <button className="add-reminder-btn" onClick={handleAddNew}>
                <Plus size={14} />
              </button>
            </div>

            {/* Reminder Type Tabs */}
            <div className="reminder-tabs">
              {reminderTypes.map(({ id, label, icon: Icon, color }) => {
                const count = getTabCount(id);
                return (
                  <button
                    key={id}
                    className={`reminder-tab ${activeTab === id ? 'active' : ''}`}
                    onClick={() => setActiveTab(id)}
                    style={{ 
                      '--tab-color': color,
                      borderColor: activeTab === id ? color : 'transparent'
                    }}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    {count > 0 && (
                      <span className="tab-count" style={{ background: color }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reminder List for Active Tab */}
            <div className="card-content reminder-list-tabbed">
              {currentTabReminders.length === 0 ? (
                <div className="empty-tab">
                  <Clock size={20} />
                  <p>No {getTypeInfo(activeTab).label.toLowerCase()} reminders</p>
                  <button className="add-first-btn" onClick={handleAddNew}>
                    <Plus size={12} />
                    Add {getTypeInfo(activeTab).label}
                  </button>
                </div>
              ) : (
                <div className="reminder-items-list">
                  {currentTabReminders.map((reminder) => {
                    const typeInfo = getTypeInfo(reminder.type);
                    const timeLabel = timeOfDayOptions.find(t => t.id === reminder.timeOfDay);
                    
                    return (
                      <div key={reminder.id} className="reminder-item-row">
                        <button 
                          className="reminder-checkbox"
                          onClick={() => toggleComplete(reminder.id)}
                          style={{ borderColor: typeInfo.color }}
                        />
                        <div className="reminder-item-content">
                          <div className="reminder-item-top">
                            <span className="reminder-time-badge">
                              {timeLabel?.icon} {timeLabel?.label}
                            </span>
                            {reminder.isRecurring && (
                              <span className="recurring-badge">↻</span>
                            )}
                          </div>
                          <span className="reminder-item-title">{reminder.title}</span>
                        </div>
                        <div className="reminder-item-actions">
                          <button onClick={() => handleEdit(reminder)}>
                            <Edit3 size={12} />
                          </button>
                          <button onClick={() => handleDelete(reminder.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReminder ? 'Edit Reminder' : 'New Reminder'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., Take morning medication"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Time of Day</label>
                <div className="time-of-day-selector">
                  {timeOfDayOptions.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      className={`time-of-day-option ${formData.timeOfDay === id ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, timeOfDay: id }))}
                    >
                      <span className="time-icon">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  {reminderTypes.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      className={`type-option ${formData.type === id ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: id }))}
                      style={{ 
                        borderColor: formData.type === id ? color : 'transparent',
                        background: formData.type === id ? `${color}10` : 'var(--neutral-100)'
                      }}
                    >
                      <Icon size={18} style={{ color: formData.type === id ? color : 'var(--text-muted)' }} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  />
                  <span>Recurring task</span>
                </label>
              </div>

              <div className="form-group">
                <label>Note (optional)</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={!formData.title.trim()}
              >
                <Save size={18} />
                {editingReminder ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
