import { useState } from 'react';
import { X, Check, Plus, ChevronRight, ChevronLeft, User, Pill, Phone, Heart, Music, Camera, Sparkles, AlertTriangle, Brain } from 'lucide-react';
import { usePatient } from '../context/PatientContext';

// Onboarding steps for new patient
const STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Medical', icon: Pill },
  { id: 3, title: 'Contacts', icon: Phone },
  { id: 4, title: 'Favorites', icon: Heart },
  { id: 5, title: 'Memories', icon: Camera },
  { id: 6, title: 'Music', icon: Music },
];

const STAGES = [
  'Early-Stage Alzheimer\'s',
  'Moderate Alzheimer\'s',
  'Moderate-Severe Alzheimer\'s',
  'Severe Alzheimer\'s',
  'Mild Cognitive Impairment',
  'Other'
];

const PatientSwitcher = ({ isOpen, onClose }) => {
  const { patients, currentPatientId, switchPatient, addPatient } = usePatient();
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    preferredName: '',
    age: '',
    stage: 'Early-Stage Alzheimer\'s',
    location: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '' }],
    allergies: [''],
    doctorName: '',
    doctorPhone: '',
    emergencyContacts: [{ name: '', relationship: '', phone: '' }],
    favoriteThings: { food: '', place: '', activity: '', person: '', era: '', color: '' },
    comfortMemories: [''],
    triggers: [''],
    calmingStrategies: [''],
    favoriteSongs: [{ title: '', artist: '' }]
  });

  const handleSelectPatient = (patientId) => {
    switchPatient(patientId);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '', preferredName: '', age: '', stage: 'Early-Stage Alzheimer\'s',
      location: '', diagnosis: '',
      medications: [{ name: '', dosage: '' }], allergies: [''],
      doctorName: '', doctorPhone: '',
      emergencyContacts: [{ name: '', relationship: '', phone: '' }],
      favoriteThings: { food: '', place: '', activity: '', person: '', era: '', color: '' },
      comfortMemories: [''], triggers: [''], calmingStrategies: [''],
      favoriteSongs: [{ title: '', artist: '' }]
    });
    setCurrentStep(1);
  };

  const handleStartAddPatient = () => {
    resetForm();
    setShowAddPatient(true);
  };

  const handleCancelAdd = () => {
    setShowAddPatient(false);
    resetForm();
  };

  const handleSubmit = () => {
    const cleanedData = {
      ...formData,
      medications: formData.medications.filter(m => m.name.trim()),
      allergies: formData.allergies.filter(a => a.trim()),
      emergencyContacts: formData.emergencyContacts.filter(c => c.name.trim()),
      comfortMemories: formData.comfortMemories.filter(m => m.trim()),
      triggers: formData.triggers.filter(t => t.trim()),
      calmingStrategies: formData.calmingStrategies.filter(s => s.trim()),
      favoriteSongs: formData.favoriteSongs.filter(s => s.title.trim())
    };
    addPatient(cleanedData);
    setShowAddPatient(false);
    resetForm();
    onClose();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  };

  const addArrayItem = (field, template) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].map((item, i) => i === index ? value : item) }));
  };

  const updateArrayObjectItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? { ...item, [key]: value } : item)
    }));
  };

  if (!isOpen) return null;

  // Render Add Patient Form
  if (showAddPatient) {
    return (
      <div className="patient-switcher-overlay" onClick={handleCancelAdd}>
        <div className="patient-switcher-modal add-patient-modal" onClick={e => e.stopPropagation()}>
          <div className="patient-switcher-header">
            <h2>Add New Patient</h2>
            <button className="patient-switcher-close" onClick={handleCancelAdd}>
              <X size={24} />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="add-patient-progress">
            {STEPS.map((step) => (
              <div key={step.id} className={`progress-dot ${currentStep >= step.id ? 'active' : ''}`}>
                <step.icon size={12} />
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="add-patient-content">
            {currentStep === 1 && (
              <div className="form-step">
                <h3>Basic Information</h3>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g., Margaret Thompson" />
                </div>
                <div className="form-field">
                  <label>Preferred Name</label>
                  <input type="text" value={formData.preferredName} onChange={e => updateField('preferredName', e.target.value)} placeholder="e.g., Maggie" />
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Age</label>
                    <input type="number" value={formData.age} onChange={e => updateField('age', e.target.value)} placeholder="78" />
                  </div>
                  <div className="form-field">
                    <label>Location</label>
                    <input type="text" value={formData.location} onChange={e => updateField('location', e.target.value)} placeholder="City, State" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Diagnosis Stage</label>
                  <select value={formData.stage} onChange={e => updateField('stage', e.target.value)}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h3>Medical Information</h3>
                <div className="form-field">
                  <label>Medications</label>
                  {formData.medications.map((med, i) => (
                    <div key={i} className="inline-inputs">
                      <input type="text" value={med.name} onChange={e => updateArrayObjectItem('medications', i, 'name', e.target.value)} placeholder="Medication" />
                      <input type="text" value={med.dosage} onChange={e => updateArrayObjectItem('medications', i, 'dosage', e.target.value)} placeholder="Dosage" className="small" />
                      {formData.medications.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('medications', i)}>×</button>}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={() => addArrayItem('medications', { name: '', dosage: '' })}>+ Add Medication</button>
                </div>
                <div className="form-field">
                  <label>Allergies</label>
                  {formData.allergies.map((a, i) => (
                    <div key={i} className="inline-inputs">
                      <input type="text" value={a} onChange={e => updateArrayItem('allergies', i, e.target.value)} placeholder="Allergy" />
                      {formData.allergies.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('allergies', i)}>×</button>}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={() => addArrayItem('allergies', '')}>+ Add Allergy</button>
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Doctor's Name</label>
                    <input type="text" value={formData.doctorName} onChange={e => updateField('doctorName', e.target.value)} placeholder="Dr. Smith" />
                  </div>
                  <div className="form-field">
                    <label>Doctor's Phone</label>
                    <input type="tel" value={formData.doctorPhone} onChange={e => updateField('doctorPhone', e.target.value)} placeholder="555-0123" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h3>Emergency Contacts</h3>
                {formData.emergencyContacts.map((c, i) => (
                  <div key={i} className="contact-block">
                    <input type="text" value={c.name} onChange={e => updateArrayObjectItem('emergencyContacts', i, 'name', e.target.value)} placeholder="Contact name" />
                    <div className="inline-inputs">
                      <input type="text" value={c.relationship} onChange={e => updateArrayObjectItem('emergencyContacts', i, 'relationship', e.target.value)} placeholder="Relationship" />
                      <input type="tel" value={c.phone} onChange={e => updateArrayObjectItem('emergencyContacts', i, 'phone', e.target.value)} placeholder="Phone" />
                    </div>
                    {formData.emergencyContacts.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('emergencyContacts', i)}>Remove</button>}
                  </div>
                ))}
                <button className="add-item-btn" onClick={() => addArrayItem('emergencyContacts', { name: '', relationship: '', phone: '' })}>+ Add Contact</button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-step">
                <h3>Favorite Things</h3>
                <p className="form-hint">These help during emergencies and give AI context.</p>
                <div className="form-row-2">
                  <div className="form-field"><label>🍽️ Food</label><input type="text" value={formData.favoriteThings.food} onChange={e => updateNestedField('favoriteThings', 'food', e.target.value)} placeholder="Apple pie" /></div>
                  <div className="form-field"><label>📍 Place</label><input type="text" value={formData.favoriteThings.place} onChange={e => updateNestedField('favoriteThings', 'place', e.target.value)} placeholder="Beach" /></div>
                </div>
                <div className="form-row-2">
                  <div className="form-field"><label>🎯 Activity</label><input type="text" value={formData.favoriteThings.activity} onChange={e => updateNestedField('favoriteThings', 'activity', e.target.value)} placeholder="Gardening" /></div>
                  <div className="form-field"><label>👤 Person</label><input type="text" value={formData.favoriteThings.person} onChange={e => updateNestedField('favoriteThings', 'person', e.target.value)} placeholder="Grandchildren" /></div>
                </div>
                <div className="form-row-2">
                  <div className="form-field"><label>📅 Era</label><input type="text" value={formData.favoriteThings.era} onChange={e => updateNestedField('favoriteThings', 'era', e.target.value)} placeholder="1960s" /></div>
                  <div className="form-field"><label>🎨 Color</label><input type="text" value={formData.favoriteThings.color} onChange={e => updateNestedField('favoriteThings', 'color', e.target.value)} placeholder="Blue" /></div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="form-step">
                <h3>Memories & Triggers</h3>
                <div className="form-field">
                  <label>💝 Comfort Memories</label>
                  {formData.comfortMemories.map((m, i) => (
                    <div key={i} className="inline-inputs">
                      <input type="text" value={m} onChange={e => updateArrayItem('comfortMemories', i, e.target.value)} placeholder="Happy memory..." />
                      {formData.comfortMemories.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('comfortMemories', i)}>×</button>}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={() => addArrayItem('comfortMemories', '')}>+ Add Memory</button>
                </div>
                <div className="form-field">
                  <label>⚠️ Known Triggers</label>
                  {formData.triggers.map((t, i) => (
                    <div key={i} className="inline-inputs">
                      <input type="text" value={t} onChange={e => updateArrayItem('triggers', i, e.target.value)} placeholder="What causes distress..." />
                      {formData.triggers.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('triggers', i)}>×</button>}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={() => addArrayItem('triggers', '')}>+ Add Trigger</button>
                </div>
                <div className="form-field">
                  <label>🧠 Calming Strategies</label>
                  {formData.calmingStrategies.map((s, i) => (
                    <div key={i} className="inline-inputs">
                      <input type="text" value={s} onChange={e => updateArrayItem('calmingStrategies', i, e.target.value)} placeholder="What helps calm down..." />
                      {formData.calmingStrategies.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('calmingStrategies', i)}>×</button>}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={() => addArrayItem('calmingStrategies', '')}>+ Add Strategy</button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="form-step">
                <h3>Favorite Music</h3>
                <p className="form-hint">Music from their past can be incredibly calming.</p>
                {formData.favoriteSongs.map((s, i) => (
                  <div key={i} className="inline-inputs">
                    <input type="text" value={s.title} onChange={e => updateArrayObjectItem('favoriteSongs', i, 'title', e.target.value)} placeholder="Song title" />
                    <input type="text" value={s.artist} onChange={e => updateArrayObjectItem('favoriteSongs', i, 'artist', e.target.value)} placeholder="Artist" className="small" />
                    {formData.favoriteSongs.length > 1 && <button className="remove-btn" onClick={() => removeArrayItem('favoriteSongs', i)}>×</button>}
                  </div>
                ))}
                <button className="add-item-btn" onClick={() => addArrayItem('favoriteSongs', { title: '', artist: '' })}>+ Add Song</button>
                
                <div className="completion-note">
                  <Sparkles size={20} />
                  <p>Almost done! This info will help our AI provide personalized support.</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="add-patient-nav">
            {currentStep > 1 ? (
              <button className="nav-btn back" onClick={() => setCurrentStep(s => s - 1)}>
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <button className="nav-btn cancel" onClick={handleCancelAdd}>Cancel</button>
            )}
            
            {currentStep < 6 ? (
              <button 
                className="nav-btn next" 
                onClick={() => setCurrentStep(s => s + 1)}
                disabled={currentStep === 1 && !formData.name.trim()}
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button className="nav-btn create" onClick={handleSubmit}>
                <Check size={18} /> Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Patient List (default view)
  return (
    <div className="patient-switcher-overlay" onClick={onClose}>
      <div className="patient-switcher-modal" onClick={e => e.stopPropagation()}>
        <div className="patient-switcher-header">
          <h2>Switch Patient</h2>
          <button className="patient-switcher-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="patient-switcher-list">
          {patients.map((patient) => (
            <button
              key={patient.id}
              className={`patient-switcher-item ${currentPatientId === patient.id ? 'active' : ''}`}
              onClick={() => handleSelectPatient(patient.id)}
              style={{ '--patient-color': patient.color }}
            >
              <div 
                className="patient-switcher-avatar"
                style={{ background: patient.color, borderColor: patient.color }}
              >
                {patient.avatarUrl ? (
                  <img src={patient.avatarUrl} alt={patient.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>{patient.initials}</span>
                )}
              </div>
              
              <div className="patient-switcher-info">
                <span className="patient-switcher-name">{patient.preferredName}</span>
                <span className="patient-switcher-details">
                  {patient.name} • Age {patient.age}
                </span>
                <span className="patient-switcher-stage">{patient.stage}</span>
              </div>

              {currentPatientId === patient.id && (
                <div className="patient-switcher-check" style={{ background: patient.color }}>
                  <Check size={16} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Add New Patient Button */}
        <div className="patient-switcher-footer">
          <button className="add-patient-btn" onClick={handleStartAddPatient}>
            <Plus size={20} />
            <span>Add New Patient</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSwitcher;
