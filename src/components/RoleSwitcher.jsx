/**
 * Role Switcher Component
 * Floating button to switch between Caregiver and Senior modes
 * For development/demo purposes - can be hidden in production
 */

import { useState } from 'react';
import { 
  Users, 
  User, 
  X,
  ChevronUp,
  Heart,
  Stethoscope
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

const RoleSwitcher = () => {
  const { currentRole, switchRole, ROLE_CONFIG, isVoiceMode, toggleVoiceMode } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { 
      id: 'caregiver', 
      label: 'Caregiver Mode',
      icon: Stethoscope,
      description: 'Full access dashboard',
      color: '#3B82F6'
    },
    { 
      id: 'senior', 
      label: 'Senior Mode',
      icon: Heart,
      description: 'Simplified, voice-first',
      color: '#10B981'
    }
  ];

  const currentRoleInfo = roles.find(r => r.id === currentRole);
  const CurrentIcon = currentRoleInfo?.icon || Users;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.floatingButton,
          backgroundColor: currentRoleInfo?.color || '#3B82F6'
        }}
        aria-label="Switch role"
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <CurrentIcon size={24} color="white" />
        )}
      </button>

      {/* Role Selection Panel */}
      {isOpen && (
        <>
          <div 
            style={styles.overlay} 
            onClick={() => setIsOpen(false)}
          />
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Switch Mode</h3>
              <span style={styles.currentBadge}>
                Currently: {currentRoleInfo?.label}
              </span>
            </div>

            <div style={styles.roleOptions}>
              {roles.map(role => {
                const isActive = currentRole === role.id;
                const RoleIcon = role.icon;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      switchRole(role.id);
                      setIsOpen(false);
                    }}
                    style={{
                      ...styles.roleOption,
                      backgroundColor: isActive ? role.color : 'white',
                      borderColor: role.color,
                      color: isActive ? 'white' : role.color
                    }}
                  >
                    <RoleIcon size={28} />
                    <div style={styles.roleInfo}>
                      <span style={styles.roleName}>{role.label}</span>
                      <span style={{
                        ...styles.roleDesc,
                        color: isActive ? 'rgba(255,255,255,0.9)' : '#6B7280'
                      }}>
                        {role.description}
                      </span>
                    </div>
                    {isActive && (
                      <span style={styles.activeBadge}>Active</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Voice Mode Toggle (for Senior) */}
            {currentRole === 'senior' && (
              <div style={styles.voiceToggle}>
                <span style={styles.voiceLabel}>Voice Mode</span>
                <button
                  onClick={toggleVoiceMode}
                  style={{
                    ...styles.toggleButton,
                    backgroundColor: isVoiceMode ? '#10B981' : '#E5E7EB'
                  }}
                >
                  <span style={{
                    ...styles.toggleKnob,
                    transform: isVoiceMode ? 'translateX(20px)' : 'translateX(0)'
                  }} />
                </button>
              </div>
            )}

            <p style={styles.hint}>
              💡 Switch to Senior Mode for a simplified, voice-first experience
            </p>
          </div>
        </>
      )}
    </>
  );
};

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 999,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 998,
  },
  panel: {
    position: 'fixed',
    bottom: '160px',
    right: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    width: '280px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  panelHeader: {
    marginBottom: '16px',
  },
  panelTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  currentBadge: {
    fontSize: '12px',
    color: '#6B7280',
  },
  roleOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  roleOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  roleInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  roleName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  roleDesc: {
    fontSize: '12px',
  },
  activeBadge: {
    fontSize: '10px',
    padding: '4px 8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
  },
  voiceToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  voiceLabel: {
    fontSize: '14px',
    color: '#374151',
  },
  toggleButton: {
    width: '48px',
    height: '28px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  toggleKnob: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  hint: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0,
    textAlign: 'center',
  }
};

export default RoleSwitcher;
