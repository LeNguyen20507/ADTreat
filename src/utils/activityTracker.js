/**
 * Activity Tracker Utility
 * Tracks user activities for real-time summarization
 * Provides ambient visit reports for family members
 * 
 * PHI-Safe: No personal health info stored, only activity metadata
 */

const STORAGE_KEY = 'adtreat_activities';
const MAX_ACTIVITIES = 500; // Rolling window

// Activity types with categories
export const ACTIVITY_TYPES = {
  // Mood & Wellness
  MOOD_CHECKIN: { category: 'wellness', label: 'Mood Check-in', icon: '😊' },
  DAILY_CHECKIN: { category: 'wellness', label: 'Daily Check-in', icon: '✅' },
  
  // Cognitive
  COGNITIVE_EXERCISE: { category: 'cognitive', label: 'Brain Exercise', icon: '🧠' },
  MEMORY_GAME: { category: 'cognitive', label: 'Memory Game', icon: '🎮' },
  PUZZLE_COMPLETED: { category: 'cognitive', label: 'Puzzle Completed', icon: '🧩' },
  
  // Communication
  VOICE_SESSION: { category: 'communication', label: 'Voice Conversation', icon: '🎤' },
  CHAT_MESSAGE: { category: 'communication', label: 'Chat Message', icon: '💬' },
  FAMILY_CALL: { category: 'communication', label: 'Family Call', icon: '📞' },
  
  // Care
  MEDICATION_TAKEN: { category: 'care', label: 'Medication Taken', icon: '💊' },
  MEDICATION_MISSED: { category: 'care', label: 'Medication Missed', icon: '⚠️' },
  APPOINTMENT_REMINDER: { category: 'care', label: 'Appointment Reminder', icon: '📅' },
  
  // Content
  ARTICLE_READ: { category: 'learning', label: 'Article Read', icon: '📖' },
  VIDEO_WATCHED: { category: 'learning', label: 'Video Watched', icon: '🎬' },
  
  // Navigation
  APP_OPENED: { category: 'engagement', label: 'App Opened', icon: '📱' },
  PAGE_VISITED: { category: 'engagement', label: 'Page Visited', icon: '👀' }
};

/**
 * Get all stored activities
 */
export function getActivities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Track a new activity
 * @param {string} type - Activity type from ACTIVITY_TYPES
 * @param {object} metadata - Additional context (PHI-safe only)
 * @param {string} patientId - Patient identifier
 */
export function trackActivity(type, metadata = {}, patientId = 'default') {
  const activities = getActivities();
  
  const activity = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    typeInfo: ACTIVITY_TYPES[type] || { category: 'other', label: type, icon: '📌' },
    metadata,
    patientId,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  };
  
  // Add to beginning (most recent first)
  activities.unshift(activity);
  
  // Keep rolling window
  const trimmed = activities.slice(0, MAX_ACTIVITIES);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('[ActivityTracker] Storage full, clearing old activities');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed.slice(0, 100)));
  }
  
  return activity;
}

/**
 * Get activities for a specific date
 * @param {Date} date - Target date
 * @param {string} patientId - Optional patient filter
 */
export function getActivitiesForDate(date, patientId = null) {
  const dateStr = date.toLocaleDateString();
  return getActivities().filter(a => 
    a.date === dateStr && 
    (!patientId || a.patientId === patientId)
  );
}

/**
 * Get activities for today
 */
export function getTodayActivities(patientId = null) {
  return getActivitiesForDate(new Date(), patientId);
}

/**
 * Get activities for the last N days
 */
export function getRecentActivities(days = 7, patientId = null) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return getActivities().filter(a => {
    const actDate = new Date(a.timestamp);
    return actDate >= cutoff && (!patientId || a.patientId === patientId);
  });
}

/**
 * Generate daily activity summary (for caregiver reports)
 * @param {string} patientId - Patient to summarize
 * @param {Date} date - Date to summarize
 */
export function generateDailySummary(patientId, date = new Date()) {
  const activities = getActivitiesForDate(date, patientId);
  
  // Group by category
  const byCategory = {};
  activities.forEach(a => {
    const cat = a.typeInfo.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(a);
  });
  
  // Extract mood data
  const moodCheckins = activities.filter(a => a.type === 'MOOD_CHECKIN');
  const latestMood = moodCheckins[0]?.metadata?.mood || null;
  const moodTrend = moodCheckins.length > 1 
    ? calculateMoodTrend(moodCheckins) 
    : 'stable';
  
  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, activities.length * 10);
  
  // Check for concerning patterns
  const alerts = [];
  if (!activities.some(a => a.type === 'MEDICATION_TAKEN')) {
    alerts.push({ type: 'warning', message: 'No medication taken today' });
  }
  if (activities.some(a => a.type === 'MEDICATION_MISSED')) {
    alerts.push({ type: 'alert', message: 'Medication was missed' });
  }
  if (engagementScore < 20) {
    alerts.push({ type: 'info', message: 'Low engagement today' });
  }
  
  return {
    date: date.toLocaleDateString(),
    patientId,
    totalActivities: activities.length,
    byCategory,
    latestMood,
    moodTrend,
    engagementScore,
    alerts,
    highlights: generateHighlights(activities),
    generatedAt: new Date().toISOString()
  };
}

/**
 * Calculate mood trend from check-ins
 */
function calculateMoodTrend(moodCheckins) {
  if (moodCheckins.length < 2) return 'stable';
  
  const moodValues = { 
    great: 5, good: 4, okay: 3, low: 2, struggling: 1 
  };
  
  const recent = moodValues[moodCheckins[0]?.metadata?.mood] || 3;
  const previous = moodValues[moodCheckins[1]?.metadata?.mood] || 3;
  
  if (recent > previous) return 'improving';
  if (recent < previous) return 'declining';
  return 'stable';
}

/**
 * Generate human-readable highlights
 */
function generateHighlights(activities) {
  const highlights = [];
  
  const voiceSessions = activities.filter(a => a.type === 'VOICE_SESSION');
  if (voiceSessions.length > 0) {
    highlights.push(`Had ${voiceSessions.length} voice conversation${voiceSessions.length > 1 ? 's' : ''}`);
  }
  
  const cognitive = activities.filter(a => 
    ['COGNITIVE_EXERCISE', 'MEMORY_GAME', 'PUZZLE_COMPLETED'].includes(a.type)
  );
  if (cognitive.length > 0) {
    highlights.push(`Completed ${cognitive.length} brain exercise${cognitive.length > 1 ? 's' : ''}`);
  }
  
  const meds = activities.filter(a => a.type === 'MEDICATION_TAKEN');
  if (meds.length > 0) {
    highlights.push(`Took medication ${meds.length} time${meds.length > 1 ? 's' : ''}`);
  }
  
  const articles = activities.filter(a => a.type === 'ARTICLE_READ');
  if (articles.length > 0) {
    highlights.push(`Read ${articles.length} article${articles.length > 1 ? 's' : ''}`);
  }
  
  return highlights;
}

/**
 * Generate weekly summary for family reports
 */
export function generateWeeklySummary(patientId) {
  const activities = getRecentActivities(7, patientId);
  
  // Daily breakdown
  const dailyBreakdown = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString();
    dailyBreakdown[dateStr] = activities.filter(a => a.date === dateStr).length;
  }
  
  // Mood over week
  const moodCheckins = activities
    .filter(a => a.type === 'MOOD_CHECKIN')
    .map(a => ({
      date: a.date,
      mood: a.metadata?.mood,
      timestamp: a.timestamp
    }));
  
  // Most active time of day
  const hourCounts = {};
  activities.forEach(a => {
    const hour = new Date(a.timestamp).getHours();
    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    hourCounts[period] = (hourCounts[period] || 0) + 1;
  });
  const mostActivePeriod = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';
  
  return {
    patientId,
    period: 'Last 7 days',
    totalActivities: activities.length,
    averagePerDay: Math.round(activities.length / 7),
    dailyBreakdown,
    moodCheckins,
    mostActivePeriod,
    topCategories: getTopCategories(activities),
    generatedAt: new Date().toISOString()
  };
}

function getTopCategories(activities) {
  const counts = {};
  activities.forEach(a => {
    const cat = a.typeInfo.category;
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, count]) => ({ category, count }));
}

/**
 * Clear all activities (for testing/privacy)
 */
export function clearActivities() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Seed demo activities for testing the dashboard
 * Creates realistic activity data for the past 7 days
 */
export function seedDemoActivities(patientId = 'patient_001') {
  clearActivities();
  
  const moods = ['great', 'good', 'okay', 'good', 'great', 'okay', 'good'];
  const activities = [];
  
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toLocaleDateString();
    
    // Morning activities
    const morningTime = new Date(date);
    morningTime.setHours(8, 30, 0);
    
    activities.push({
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'APP_OPENED',
      typeInfo: ACTIVITY_TYPES.APP_OPENED,
      metadata: { page: 'home' },
      patientId,
      timestamp: morningTime.toISOString(),
      date: dateStr
    });
    
    // Mood check-in
    morningTime.setMinutes(35);
    activities.push({
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'MOOD_CHECKIN',
      typeInfo: ACTIVITY_TYPES.MOOD_CHECKIN,
      metadata: { mood: moods[daysAgo], time: morningTime.toLocaleTimeString() },
      patientId,
      timestamp: morningTime.toISOString(),
      date: dateStr
    });
    
    // Medication taken
    morningTime.setHours(9, 0);
    activities.push({
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'MEDICATION_TAKEN',
      typeInfo: ACTIVITY_TYPES.MEDICATION_TAKEN,
      metadata: { medication: 'Morning medication' },
      patientId,
      timestamp: morningTime.toISOString(),
      date: dateStr
    });
    
    // Cognitive exercise (most days)
    if (daysAgo !== 3) {
      const exerciseTime = new Date(date);
      exerciseTime.setHours(10, 15);
      activities.push({
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'COGNITIVE_EXERCISE',
        typeInfo: ACTIVITY_TYPES.COGNITIVE_EXERCISE,
        metadata: { exercise: 'Word Association', duration: '5 min' },
        patientId,
        timestamp: exerciseTime.toISOString(),
        date: dateStr
      });
    }
    
    // Voice session (every other day)
    if (daysAgo % 2 === 0) {
      const voiceTime = new Date(date);
      voiceTime.setHours(14, 30);
      activities.push({
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'VOICE_SESSION',
        typeInfo: ACTIVITY_TYPES.VOICE_SESSION,
        metadata: { duration: '8 min', topic: 'Grounding conversation' },
        patientId,
        timestamp: voiceTime.toISOString(),
        date: dateStr
      });
    }
    
    // Article read (some days)
    if (daysAgo < 4) {
      const readTime = new Date(date);
      readTime.setHours(15, 45);
      activities.push({
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'ARTICLE_READ',
        typeInfo: ACTIVITY_TYPES.ARTICLE_READ,
        metadata: { article: 'Daily Wellness Tips' },
        patientId,
        timestamp: readTime.toISOString(),
        date: dateStr
      });
    }
    
    // Evening medication
    const eveningTime = new Date(date);
    eveningTime.setHours(20, 0);
    if (daysAgo !== 1) { // Missed one day
      activities.push({
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'MEDICATION_TAKEN',
        typeInfo: ACTIVITY_TYPES.MEDICATION_TAKEN,
        metadata: { medication: 'Evening medication' },
        patientId,
        timestamp: eveningTime.toISOString(),
        date: dateStr
      });
    }
  }
  
  // Sort by timestamp descending (most recent first)
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  
  return activities.length;
}

export default {
  trackActivity,
  getActivities,
  getTodayActivities,
  getRecentActivities,
  generateDailySummary,
  generateWeeklySummary,
  seedDemoActivities,
  clearActivities,
  ACTIVITY_TYPES
};
