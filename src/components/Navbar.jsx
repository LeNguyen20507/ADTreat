/**
 * Navbar Component
 * Global top navigation bar with emergency button (with label), app title, and patient switcher
 * SOS button opens the AI-powered calming assistant modal
 * Includes dashboard access for caregivers
 * Role switcher is now a floating circle button at bottom-right
 */

import { AlertCircle, LayoutDashboard, Users, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SOSModal from './SOSModal';
import PatientSwitcher from './PatientSwitcher';
import { usePatient } from '../context/PatientContext';
import { useRole } from '../context/RoleContext';

const Navbar = () => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showPatientSwitcher, setShowPatientSwitcher] = useState(false);
  const { currentPatient, currentPatientId } = usePatient();
  const { currentRole, switchRole, isCaregiver, isSenior } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleToggle = () => {
    switchRole(currentRole === 'caregiver' ? 'senior' : 'caregiver');
    navigate('/');
  };

  return (
    <>
      {/* Global Top Navigation Bar - Fixed */}
      <nav className="global-top-nav">
        {/* LEFT: Emergency Button with Label */}
        <button 
          className="emergency-btn-with-label" 
          onClick={() => setShowSOSModal(true)}
          aria-label="Emergency"
        >
          <AlertCircle size={20} />
          <span>SOS</span>
        </button>

        {/* CENTER: App Logo */}
        <div className="nav-center">
          <img src="/assets/name.svg" alt="EverMind" className="app-logo" />
        </div>

        {/* RIGHT: Dashboard (for caregivers) + Patient Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Dashboard Button - Only for Caregivers */}
          {isCaregiver && (
            <button 
              onClick={() => navigate('/dashboard')}
              aria-label="Patient Dashboard"
              title="View Patient Dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: location.pathname === '/dashboard' ? '#3B82F6' : '#F3F4F6',
                color: location.pathname === '/dashboard' ? 'white' : '#6B7280',
                transition: 'all 0.2s'
              }}
            >
              <LayoutDashboard size={20} />
            </button>
          )}

          {/* Patient Switcher Button */}
          <button 
            className="patient-switcher-btn" 
            onClick={() => setShowPatientSwitcher(true)}
            aria-label="Switch Patient"
            title={`Current: ${currentPatient?.preferredName || 'Select Patient'}`}
            style={{ '--patient-color': currentPatient?.color || '#14B8A6' }}
          >
            <div 
              className="patient-avatar-btn"
              style={{ 
                background: currentPatient?.color,
                borderColor: currentPatient?.color 
              }}
            >
              {currentPatient?.avatarUrl ? (
                <img 
                  src={currentPatient.avatarUrl} 
                  alt={currentPatient.name} 
                  className="patient-avatar-img"
                />
              ) : (
                <span className="patient-avatar-initials">
                  {currentPatient?.initials || 'PT'}
                </span>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Floating Role Toggle Button - Bottom Right of App Container */}
      <div style={{
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        pointerEvents: 'none',
        zIndex: 999,
      }}>
        <button
          onClick={handleRoleToggle}
          aria-label={`Switch to ${isCaregiver ? 'Senior' : 'Caregiver'} Mode`}
          title={`Currently: ${isCaregiver ? 'Caregiver' : 'Senior'} Mode - Tap to switch`}
          style={{
            position: 'absolute',
            bottom: '0',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isCaregiver ? '#3B82F6' : '#10B981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease',
          }}
        >
          {isCaregiver ? <Users size={24} /> : <Heart size={24} />}
        </button>
      </div>

      {/* SOS Modal - AI-powered calming assistant */}
      <SOSModal 
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
      />

      {/* Patient Switcher Modal */}
      <PatientSwitcher
        isOpen={showPatientSwitcher}
        onClose={() => setShowPatientSwitcher(false)}
      />
    </>
  );
};

export default Navbar;
