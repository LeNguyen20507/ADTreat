/**
 * Home Page - Patient Dashboard with MCP Profile Data
 * Shows patient profile info from MCP server + tabbed reminders
 * No scrolling - everything fits on one page
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Pill, 
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
  User,
  Home as HomeIcon,
  Heart,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader,
  Phone
} from 'lucide-react';
import { 
  fetchPatientProfile, 
  initMcpClient, 
  testMcpHealth,
  isMcpConnected 
} from '../utils/mcpClient';

const Home = () => {
  // MCP Profile State
  const [profile, setProfile] = useState(null);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpError, setMcpError] = useState(null);
  const [mcpStatus, setMcpStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'

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

  // Initialize MCP connection on mount
  useEffect(() => {
    const init = async () => {
      setMcpStatus('connecting');
      const connected = await initMcpClient();
      setMcpStatus(connected ? 'connected' : 'error');
    };
    init();
  }, []);

  // MCP Test Functions
  const handleTestMargaret = async () => {
    setMcpLoading(true);
    setMcpError(null);
    console.log('=== TEST MCP - Fetch Margaret ===');
    console.time('fetchPatientProfile');
    
    try {
      const data = await fetchPatientProfile('margaret_chen');
      console.timeEnd('fetchPatientProfile');
      console.log('✅ Margaret Chen Profile:', data);
      console.log('Fields present:', Object.keys(data));
      console.log('calming_topics count:', data.calming_topics?.length);
      setProfile(data);
      setMcpStatus('connected');
    } catch (error) {
      console.timeEnd('fetchPatientProfile');
      console.error('❌ Error:', error.message);
      setMcpError(error.message);
      setMcpStatus('error');
    } finally {
      setMcpLoading(false);
    }
  };

  const handleTestRobert = async () => {
    setMcpLoading(true);
    setMcpError(null);
    console.log('=== TEST MCP - Fetch Robert ===');
    console.time('fetchPatientProfile');
    
    try {
      const data = await fetchPatientProfile('robert_williams');
      console.timeEnd('fetchPatientProfile');
      console.log('✅ Robert Williams Profile:', data);
      console.log('Fields present:', Object.keys(data));
      console.log('calming_topics count:', data.calming_topics?.length);
      setProfile(data);
      setMcpStatus('connected');
    } catch (error) {
      console.timeEnd('fetchPatientProfile');
      console.error('❌ Error:', error.message);
      setMcpError(error.message);
      setMcpStatus('error');
    } finally {
      setMcpLoading(false);
    }
  };

  const handleTestInvalid = async () => {
    setMcpLoading(true);
    setMcpError(null);
    console.log('=== TEST MCP - Invalid ID ===');
    
    try {
      await fetchPatientProfile('invalid_patient_id');
    } catch (error) {
      console.log('✅ Error handling works:', error.message);
      setMcpError(error.message);
    } finally {
      setMcpLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    console.log('=== MCP Health Check ===');
    const health = await testMcpHealth();
    console.log('Health status:', health);
    setMcpStatus(health.status === 'healthy' ? 'connected' : 'error');
  };

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
      {/* MCP Test Section - Temporary for Stage 1 */}
      <div className="mcp-test-section">
        <div className="mcp-test-header">
          <span className="mcp-label">MCP Server Test</span>
          <span className={`mcp-status ${mcpStatus}`}>
            {mcpStatus === 'connecting' && <Loader size={12} className="spin" />}
            {mcpStatus === 'connected' && <CheckCircle size={12} />}
            {mcpStatus === 'error' && <AlertCircle size={12} />}
            {mcpStatus}
          </span>
        </div>
        <div className="mcp-test-buttons">
          <button 
            className="mcp-test-btn" 
            onClick={handleTestMargaret}
            disabled={mcpLoading}
          >
            {mcpLoading ? <Loader size={14} className="spin" /> : null}
            Test Margaret
          </button>
          <button 
            className="mcp-test-btn" 
            onClick={handleTestRobert}
            disabled={mcpLoading}
          >
            Test Robert
          </button>
          <button 
            className="mcp-test-btn error" 
            onClick={handleTestInvalid}
            disabled={mcpLoading}
          >
            Test Invalid
          </button>
        </div>
        {mcpError && (
          <div className="mcp-error-msg">
            <AlertCircle size={12} />
            {mcpError}
          </div>
        )}
        {/* Link to VAPI Voice Test (Stage 2) */}
        <Link to="/test-call" className="mcp-test-btn vapi-link">
          <Phone size={14} />
          VAPI Voice Test →
        </Link>
      </div>

      {/* Patient Basic Info - From MCP Profile */}
      <div className="patient-header-simple">
        <h1 className="patient-name-lg">
          {profile ? profile.name : 'Select a Patient'}
        </h1>
        {profile && (
          <span className="patient-meta">
            Age {profile.age} • Preferred: "{profile.preferred_address}"
          </span>
        )}
      </div>

      {/* Profile Data Cards - 3 Main Things */}
      {profile && (
        <div className="profile-cards-row">
          {/* Core Identity Card */}
          <div className="profile-card identity-card">
            <div className="profile-card-header">
              <User size={14} />
              <span>Core Identity</span>
            </div>
            <p className="profile-card-text">{profile.core_identity}</p>
          </div>

          {/* Safe Place Card */}
          <div className="profile-card safe-place-card">
            <div className="profile-card-header">
              <HomeIcon size={14} />
              <span>Safe Place</span>
            </div>
            <p className="profile-card-text">{profile.safe_place}</p>
          </div>

          {/* Calming Topics Card */}
          <div className="profile-card calming-card">
            <div className="profile-card-header">
              <Heart size={14} />
              <span>Calming Topics</span>
            </div>
            <ul className="calming-topics-list">
              {profile.calming_topics.slice(0, 3).map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reminders Section - Full Width */}
      <div className="reminders-section">
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
