/**
 * Home Page - Patient Information Dashboard with Reminders
 * Non-scrollable overview with integrated today's schedule/reminders
 * Modal for add/edit reminders
 */

import { useState } from 'react';
import { 
  Phone, 
  Pill, 
  AlertTriangle,
  User,
  Heart,
  Activity,
  Brain,
  Plus,
  Check,
  Clock,
  Calendar,
  Utensils,
  X,
  Edit3,
  Trash2,
  Save
} from 'lucide-react';

const Home = () => {
  // State for reminders
  const [reminders, setReminders] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    timeOfDay: 'morning',
    type: 'medication',
    isRecurring: false,
    note: ''
  });

  const reminderTypes = [
    { id: 'medication', label: 'Medication', icon: Pill, color: '#3B82F6' },
    { id: 'appointment', label: 'Appointment', icon: Calendar, color: '#8B5CF6' },
    { id: 'meal', label: 'Meal', icon: Utensils, color: '#10B981' },
    { id: 'activity', label: 'Activity', icon: Activity, color: '#F59E0B' },
  ];

  const timeOfDayOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { id: 'evening', label: 'Evening', icon: '🌙' },
  ];

  // Patient data
  const patientData = {
    name: 'John Doe',
    stage: 'Mild Stage',
    condition: 'Alzheimer\'s Disease',
    age: 72
  };

  // Medical overview
  const medicalInfo = {
    medications: [
      { name: 'Donepezil', dosage: '10mg', time: 'Morning' },
      { name: 'Memantine', dosage: '5mg', time: 'Twice daily' }
    ],
    allergies: ['Penicillin', 'Sulfa drugs'],
    physician: { name: 'Dr. Sarah Smith', phone: '+1 (555) 234-5678' }
  };

  // Emergency contacts
  const emergencyContacts = [
    { name: 'Mary Doe', relation: 'Spouse', phone: '+1 (555) 123-4567' },
    { name: 'Sarah J.', relation: 'Daughter', phone: '+1 (555) 987-6543' }
  ];

  const getTypeInfo = (type) => {
    return reminderTypes.find(t => t.id === type) || reminderTypes[0];
  };

  // Open modal for new reminder
  const handleAddNew = () => {
    setEditingReminder(null);
    setFormData({ title: '', timeOfDay: 'morning', type: 'medication', isRecurring: false, note: '' });
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
        r.id === editingReminder.id 
          ? { ...r, ...formData }
          : r
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
    setFormData({ title: '', timeOfDay: 'morning', type: 'medication', isRecurring: false, note: '' });
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

  // Sort reminders - recurring first, then by time of day
  const timeOfDayOrder = { morning: 1, afternoon: 2, evening: 3 };
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.isRecurring !== b.isRecurring) return b.isRecurring ? 1 : -1;
    return timeOfDayOrder[a.timeOfDay] - timeOfDayOrder[b.timeOfDay];
  });
  
  const recurringReminders = sortedReminders.filter(r => r.isRecurring && !completedIds.includes(r.id));
  const normalReminders = sortedReminders.filter(r => !r.isRecurring && !completedIds.includes(r.id));

  return (
    <div className="home-page">
      {/* Patient Identity Section */}
      <div className="patient-identity">
        <div className="patient-photo">
          <User size={32} />
        </div>
        <div className="patient-info">
          <h1 className="patient-name">{patientData.name}</h1>
          <span className="patient-stage">{patientData.stage} • Age {patientData.age}</span>
        </div>
      </div>

      {/* Info Label */}
      <div className="home-info-label">
        <Brain size={14} />
        <span>Current Patient Overview</span>
      </div>

      {/* Critical Information Cards Grid */}
      <div className="home-cards-grid">
        {/* Medical Overview Card */}
        <div className="home-card medical-card">
          <div className="card-header">
            <Pill size={16} />
            <span>Medications</span>
          </div>
          <div className="card-content">
            <div className="med-list">
              {medicalInfo.medications.map((med, idx) => (
                <div key={idx} className="med-item">
                  <span className="med-name">{med.name}</span>
                  <span className="med-dose">{med.dosage}</span>
                </div>
              ))}
            </div>
            <div className="allergy-warning">
              <AlertTriangle size={12} />
              <span>Allergies: {medicalInfo.allergies.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <div className="home-card contacts-card">
          <div className="card-header">
            <Phone size={16} />
            <span>Contacts</span>
          </div>
          <div className="card-content">
            {emergencyContacts.map((contact, idx) => (
              <a 
                key={idx} 
                href={`tel:${contact.phone}`}
                className="contact-item"
              >
                <div className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-relation">{contact.relation}</span>
                </div>
                <Phone size={14} className="call-icon" />
              </a>
            ))}
          </div>
        </div>

        {/* Today's Schedule Card - With Reminders */}
        <div className="home-card schedule-card-full">
          <div className="card-header">
            <Activity size={16} />
            <span>Today's Schedule</span>
          </div>
          <div className="card-content schedule-list">
            {recurringReminders.length === 0 && normalReminders.length === 0 ? (
              <div className="empty-schedule">
                <Clock size={24} />
                <p>No reminders for today</p>
                <button className="add-first-btn" onClick={handleAddNew}>
                  <Plus size={14} />
                  Add Reminder
                </button>
              </div>
            ) : (
              <>
                {/* Recurring Tasks Section */}
                {recurringReminders.length > 0 && (
                  <div className="reminder-section">
                    <h5 className="reminder-section-label">Recurring</h5>
                    {recurringReminders.map((reminder) => {
                      const typeInfo = getTypeInfo(reminder.type);
                      const Icon = typeInfo.icon;
                      const timeLabel = timeOfDayOptions.find(t => t.id === reminder.timeOfDay);
                      
                      return (
                        <div key={reminder.id} className="schedule-reminder-item">
                          <button 
                            className="mini-checkbox"
                            onClick={() => toggleComplete(reminder.id)}
                            style={{ borderColor: typeInfo.color }}
                          />
                          <div className="schedule-reminder-main">
                            <div className="schedule-reminder-header">
                              <span className="schedule-time-of-day">{timeLabel?.icon} {timeLabel?.label}</span>
                              <div 
                                className="schedule-type-badge" 
                                style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}
                              >
                                <Icon size={10} />
                              </div>
                            </div>
                            <h4 className="schedule-title">{reminder.title}</h4>
                          </div>
                          <div className="schedule-actions">
                            <button 
                              className="mini-action-btn"
                              onClick={() => handleEdit(reminder)}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              className="mini-action-btn delete"
                              onClick={() => handleDelete(reminder.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Normal Tasks Section */}
                {normalReminders.length > 0 && (
                  <div className="reminder-section">
                    <h5 className="reminder-section-label">Today</h5>
                    {normalReminders.map((reminder) => {
                      const typeInfo = getTypeInfo(reminder.type);
                      const Icon = typeInfo.icon;
                      const timeLabel = timeOfDayOptions.find(t => t.id === reminder.timeOfDay);
                      
                      return (
                        <div key={reminder.id} className="schedule-reminder-item">
                          <button 
                            className="mini-checkbox"
                            onClick={() => toggleComplete(reminder.id)}
                            style={{ borderColor: typeInfo.color }}
                          />
                          <div className="schedule-reminder-main">
                            <div className="schedule-reminder-header">
                              <span className="schedule-time-of-day">{timeLabel?.icon} {timeLabel?.label}</span>
                              <div 
                                className="schedule-type-badge" 
                                style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}
                              >
                                <Icon size={10} />
                              </div>
                            </div>
                            <h4 className="schedule-title">{reminder.title}</h4>
                          </div>
                          <div className="schedule-actions">
                            <button 
                              className="mini-action-btn"
                              onClick={() => handleEdit(reminder)}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              className="mini-action-btn delete"
                              onClick={() => handleDelete(reminder.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Label */}
      <div className="home-footer-label">
        <span>Tap the person icon (top right) to switch patients</span>
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
                  rows={3}
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
