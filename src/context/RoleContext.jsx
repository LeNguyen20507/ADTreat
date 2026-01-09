/**
 * Role Context - Caregiver vs Senior Mode
 * Enables dual-app design with connected experiences
 * 
 * Caregiver Mode: Full dashboard, patient management, activity reports
 * Senior Mode: Simplified UI, voice-first, large buttons, daily check-ins
 */

import { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext(null);

// Role configurations
const ROLE_CONFIG = {
  caregiver: {
    id: 'caregiver',
    label: 'Caregiver',
    description: 'Full access to patient data, reminders, and activity reports',
    theme: {
      primary: '#3B82F6',
      fontSize: 'normal',
      buttonSize: 'normal'
    }
  },
  senior: {
    id: 'senior',
    label: 'Senior',
    description: 'Simplified interface with voice-first interaction',
    theme: {
      primary: '#10B981',
      fontSize: 'large',
      buttonSize: 'large'
    }
  }
};

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    // Persist role preference
    const saved = localStorage.getItem('adtreat_role');
    return saved || 'caregiver';
  });

  const [isVoiceMode, setIsVoiceMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('adtreat_role', currentRole);
    
    // Apply theme based on role
    document.documentElement.setAttribute('data-role', currentRole);
    
    // For seniors, default to voice mode
    if (currentRole === 'senior') {
      setIsVoiceMode(true);
    }
  }, [currentRole]);

  const switchRole = (role) => {
    if (ROLE_CONFIG[role]) {
      setCurrentRole(role);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(prev => !prev);
  };

  const roleConfig = ROLE_CONFIG[currentRole];
  const isSenior = currentRole === 'senior';
  const isCaregiver = currentRole === 'caregiver';

  return (
    <RoleContext.Provider value={{
      currentRole,
      roleConfig,
      isSenior,
      isCaregiver,
      switchRole,
      isVoiceMode,
      toggleVoiceMode,
      ROLE_CONFIG
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export default RoleContext;
