/**
 * PatientOnboarding Component
 * Multi-step wizard for creating a new patient profile
 * Collects comprehensive information for emergency and AI context
 */

import { useState } from 'react';
import {
  User, Heart, Pill, Phone, Music, Camera, Brain, AlertTriangle,
  ChevronRight, ChevronLeft, Check, Plus, X, Sparkles
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User, description: 'Name, age, and diagnosis' },
  { id: 2, title: 'Medical', icon: Pill, description: 'Medications and allergies' },
  { id: 3, title: 'Contacts', icon: Phone, description: 'Emergency contacts' },
  { id: 4, title: 'Favorites', icon: Heart, description: 'Things that bring comfort' },
  { id: 5, title: 'Memories', icon: Camera, description: 'Calming memories and triggers' },
  { id: 6, title: 'Music', icon: Music, description: 'Favorite songs for calming' },
];

const STAGES = [
  'Early-Stage Alzheimer\'s',
  'Moderate Alzheimer\'s',
  'Moderate-Severe Alzheimer\'s',
  'Severe Alzheimer\'s',
  'Mild Cognitive Impairment',
  'Vascular Dementia',
  'Lewy Body Dementia',
  'Other'
];

const PatientOnboarding = ({ onComplete, onSkipDemo }) => {
  const { addPatient, completeOnboarding } = usePatient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    preferredName: '',
    age: '',
    stage: 'Early-Stage Alzheimer\'s',
    location: '',
    diagnosis: '',
    
    // Step 2: Medical
    medications: [{ name: '', dosage: '' }],
    allergies: [''],
    doctorName: '',
    doctorPhone: '',
    
    // Step 3: Emergency Contacts
    emergencyContacts: [{ name: '', relationship: '', phone: '' }],
    
    // Step 4: Favorites
    favoriteThings: {
      food: '',
      place: '',
      activity: '',
      person: '',
      era: '',
      color: ''
    },
    
    // Step 5: Memories & Triggers
    comfortMemories: [''],
    triggers: [''],
    calmingStrategies: [''],
    
    // Step 6: Music
    favoriteSongs: [{ title: '', artist: '' }]
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const addArrayItem = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const updateArrayObjectItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Clean up empty entries
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
    completeOnboarding();
    onComplete?.();
  };

  const handleSkipDemo = () => {
    onSkipDemo?.();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Margaret Thompson"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Name / Nickname</label>
              <input
                type="text"
                value={formData.preferredName}
                onChange={(e) => updateField('preferredName', e.target.value)}
                placeholder="e.g., Maggie"
                className="form-input"
              />
              <span className="form-hint">What do they like to be called?</span>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value) || '')}
                  placeholder="78"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="City, State"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Diagnosis Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => updateField('stage', e.target.value)}
                className="form-select"
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Diagnosis Notes</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => updateField('diagnosis', e.target.value)}
                placeholder="e.g., Diagnosed in 2024 with mild cognitive impairment..."
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label>Current Medications</label>
              {formData.medications.map((med, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateArrayObjectItem('medications', index, 'name', e.target.value)}
                    placeholder="Medication name"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateArrayObjectItem('medications', index, 'dosage', e.target.value)}
                    placeholder="Dosage"
                    className="form-input small"
                  />
                  {formData.medications.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('medications', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('medications', { name: '', dosage: '' })}
              >
                <Plus size={16} /> Add Medication
              </button>
            </div>
            
            <div className="form-group">
              <label>Allergies</label>
              {formData.allergies.map((allergy, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={allergy}
                    onChange={(e) => updateArrayItem('allergies', index, e.target.value)}
                    placeholder="e.g., Penicillin"
                    className="form-input"
                  />
                  {formData.allergies.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('allergies', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('allergies', '')}
              >
                <Plus size={16} /> Add Allergy
              </button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Doctor's Name</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => updateField('doctorName', e.target.value)}
                  placeholder="Dr. Sarah Mitchell"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Doctor's Phone</label>
                <input
                  type="tel"
                  value={formData.doctorPhone}
                  onChange={(e) => updateField('doctorPhone', e.target.value)}
                  placeholder="555-0142"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label>Emergency Contacts</label>
              <span className="form-hint">These will be shown during emergencies</span>
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-card">
                  <div className="input-row">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateArrayObjectItem('emergencyContacts', index, 'name', e.target.value)}
                      placeholder="Contact name"
                      className="form-input"
                    />
                    {formData.emergencyContacts.length > 1 && (
                      <button className="remove-btn" onClick={() => removeArrayItem('emergencyContacts', index)}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="input-row">
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => updateArrayObjectItem('emergencyContacts', index, 'relationship', e.target.value)}
                      placeholder="Relationship (e.g., Daughter)"
                      className="form-input"
                    />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateArrayObjectItem('emergencyContacts', index, 'phone', e.target.value)}
                      placeholder="Phone number"
                      className="form-input"
                    />
                  </div>
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('emergencyContacts', { name: '', relationship: '', phone: '' })}
              >
                <Plus size={16} /> Add Contact
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step-content">
            <p className="step-intro">
              <Sparkles size={16} />
              These details help during emergencies and give our AI better context to provide comfort.
            </p>
            
            <div className="favorites-grid">
              <div className="form-group">
                <label>🍽️ Favorite Food</label>
                <input
                  type="text"
                  value={formData.favoriteThings.food}
                  onChange={(e) => updateNestedField('favoriteThings', 'food', e.target.value)}
                  placeholder="Homemade apple pie"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>📍 Favorite Place</label>
                <input
                  type="text"
                  value={formData.favoriteThings.place}
                  onChange={(e) => updateNestedField('favoriteThings', 'place', e.target.value)}
                  placeholder="Oregon coast beaches"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>🎯 Favorite Activity</label>
                <input
                  type="text"
                  value={formData.favoriteThings.activity}
                  onChange={(e) => updateNestedField('favoriteThings', 'activity', e.target.value)}
                  placeholder="Gardening"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>👤 Special Person</label>
                <input
                  type="text"
                  value={formData.favoriteThings.person}
                  onChange={(e) => updateNestedField('favoriteThings', 'person', e.target.value)}
                  placeholder="Grandchildren"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>📅 Favorite Era/Decade</label>
                <input
                  type="text"
                  value={formData.favoriteThings.era}
                  onChange={(e) => updateNestedField('favoriteThings', 'era', e.target.value)}
                  placeholder="1960s"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>🎨 Favorite Color</label>
                <input
                  type="text"
                  value={formData.favoriteThings.color}
                  onChange={(e) => updateNestedField('favoriteThings', 'color', e.target.value)}
                  placeholder="Blue"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label>💝 Comfort Memories</label>
              <span className="form-hint">Happy memories that bring peace and calm</span>
              {formData.comfortMemories.map((memory, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={memory}
                    onChange={(e) => updateArrayItem('comfortMemories', index, e.target.value)}
                    placeholder="e.g., Teaching school for 35 years"
                    className="form-input"
                  />
                  {formData.comfortMemories.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('comfortMemories', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('comfortMemories', '')}
              >
                <Plus size={16} /> Add Memory
              </button>
            </div>
            
            <div className="form-group">
              <label><AlertTriangle size={14} /> Known Triggers</label>
              <span className="form-hint">Things that may cause distress or agitation</span>
              {formData.triggers.map((trigger, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={trigger}
                    onChange={(e) => updateArrayItem('triggers', index, e.target.value)}
                    placeholder="e.g., Loud sudden noises"
                    className="form-input"
                  />
                  {formData.triggers.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('triggers', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('triggers', '')}
              >
                <Plus size={16} /> Add Trigger
              </button>
            </div>
            
            <div className="form-group">
              <label><Brain size={14} /> Calming Strategies</label>
              <span className="form-hint">Things that help when they're upset</span>
              {formData.calmingStrategies.map((strategy, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={strategy}
                    onChange={(e) => updateArrayItem('calmingStrategies', index, e.target.value)}
                    placeholder="e.g., Looking at family photos"
                    className="form-input"
                  />
                  {formData.calmingStrategies.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('calmingStrategies', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('calmingStrategies', '')}
              >
                <Plus size={16} /> Add Strategy
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="onboarding-step-content">
            <p className="step-intro">
              <Music size={16} />
              Music from their past can be incredibly calming during difficult moments.
            </p>
            
            <div className="form-group">
              <label>Favorite Songs</label>
              {formData.favoriteSongs.map((song, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={song.title}
                    onChange={(e) => updateArrayObjectItem('favoriteSongs', index, 'title', e.target.value)}
                    placeholder="Song title"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={song.artist}
                    onChange={(e) => updateArrayObjectItem('favoriteSongs', index, 'artist', e.target.value)}
                    placeholder="Artist"
                    className="form-input small"
                  />
                  {formData.favoriteSongs.length > 1 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('favoriteSongs', index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => addArrayItem('favoriteSongs', { title: '', artist: '' })}
              >
                <Plus size={16} /> Add Song
              </button>
            </div>
            
            <div className="completion-preview">
              <h4>🎉 Almost Done!</h4>
              <p>You've created a profile for <strong>{formData.name || 'your loved one'}</strong>.</p>
              <p className="preview-note">
                This information will help our AI provide personalized support and will be available during emergencies.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        {/* Header */}
        <div className="onboarding-header">
          <img src="/assets/name.svg" alt="EverMind" className="onboarding-logo" />
          <h1>Create Patient Profile</h1>
          <p>Set up a profile for your loved one</p>
        </div>

        {/* Progress Steps */}
        <div className="onboarding-progress">
          {STEPS.map((step) => (
            <div 
              key={step.id}
              className={`progress-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step.id ? <Check size={14} /> : <step.icon size={14} />}
              </div>
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="onboarding-content">
          <div className="step-header">
            <h2>{STEPS[currentStep - 1].title}</h2>
            <p>{STEPS[currentStep - 1].description}</p>
          </div>
          
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="onboarding-nav">
          <div className="nav-left">
            {currentStep === 1 && (
              <button className="skip-demo-btn" onClick={handleSkipDemo}>
                <Sparkles size={16} />
                Try Demo Instead
              </button>
            )}
            {currentStep > 1 && (
              <button className="back-btn" onClick={prevStep}>
                <ChevronLeft size={18} />
                Back
              </button>
            )}
          </div>
          
          <div className="nav-right">
            {currentStep < STEPS.length ? (
              <button 
                className="next-btn" 
                onClick={nextStep}
                disabled={currentStep === 1 && !formData.name.trim()}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button className="complete-btn" onClick={handleSubmit}>
                <Check size={18} />
                Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
