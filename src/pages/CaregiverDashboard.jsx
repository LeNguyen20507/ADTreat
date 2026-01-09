/**
 * Caregiver Dashboard - Activity Summaries & Insights
 * Real-time summarization of patient activity
 * Ambient visit reports for family members
 * 
 * Features:
 * - Daily/Weekly activity summaries
 * - Mood trends and alerts
 * - Engagement metrics
 * - Quick actions for caregiving tasks
 */

import { useState, useEffect } from 'react';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Heart,
  Pill,
  MessageCircle,
  BarChart3,
  ChevronRight,
  RefreshCw,
  Share2,
  Bell,
  Sparkles,
  Sun,
  Moon,
  CloudSun,
  FileText,
  Send,
  Database
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { 
  generateDailySummary, 
  generateWeeklySummary,
  getTodayActivities,
  getRecentActivities,
  seedDemoActivities,
  ACTIVITY_TYPES 
} from '../utils/activityTracker';

const CaregiverDashboard = () => {
  const { currentPatient } = usePatient();
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Load summaries
  useEffect(() => {
    refreshSummaries();
  }, [currentPatient]);

  const refreshSummaries = () => {
    setIsRefreshing(true);
    
    const patientId = currentPatient?.id || 'default';
    const daily = generateDailySummary(patientId);
    const weekly = generateWeeklySummary(patientId);
    
    setDailySummary(daily);
    setWeeklySummary(weekly);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const loadDemoData = () => {
    const patientId = currentPatient?.id || 'patient_001';
    seedDemoActivities(patientId);
    refreshSummaries();
  };

  // Generate AI summary using Claude/GPT-style prompt
  const generateAISummary = async () => {
    setGeneratingAI(true);
    
    // Simulate AI processing (in production, call Claude/OpenAI API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const patientName = currentPatient?.preferredName || 'the patient';
    const activities = getTodayActivities(currentPatient?.id);
    const moodCheckins = activities.filter(a => a.type === 'MOOD_CHECKIN');
    const latestMood = moodCheckins[0]?.metadata?.mood;
    
    // Generate contextual summary
    let summary = `📋 **Daily Report for ${patientName}** (${new Date().toLocaleDateString()})\n\n`;
    
    if (activities.length === 0) {
      summary += `No activities recorded yet today. Consider checking in with ${patientName}.\n`;
    } else {
      summary += `**Engagement Level:** ${activities.length >= 5 ? 'Active' : 'Moderate'}\n`;
      summary += `**Total Interactions:** ${activities.length}\n\n`;
      
      if (latestMood) {
        const moodEmoji = { great: '😊', good: '🙂', okay: '😐', low: '😔', struggling: '😢' };
        summary += `**Current Mood:** ${moodEmoji[latestMood] || '❓'} ${latestMood}\n\n`;
      }
      
      // Activity highlights
      const voiceSessions = activities.filter(a => a.type === 'VOICE_SESSION');
      const cognitive = activities.filter(a => a.typeInfo?.category === 'cognitive');
      const meds = activities.filter(a => a.type === 'MEDICATION_TAKEN');
      
      if (voiceSessions.length > 0 || cognitive.length > 0 || meds.length > 0) {
        summary += `**Today's Highlights:**\n`;
        if (voiceSessions.length > 0) summary += `• Had ${voiceSessions.length} voice conversation${voiceSessions.length > 1 ? 's' : ''}\n`;
        if (cognitive.length > 0) summary += `• Completed ${cognitive.length} brain exercise${cognitive.length > 1 ? 's' : ''}\n`;
        if (meds.length > 0) summary += `• Medication taken ✓\n`;
      }
      
      // Recommendations
      summary += `\n**Recommendations:**\n`;
      if (!latestMood) summary += `• No mood check-in today - consider asking how they're feeling\n`;
      if (voiceSessions.length === 0) summary += `• Encourage a voice session for social engagement\n`;
      if (cognitive.length === 0) summary += `• Suggest a brain game or puzzle\n`;
    }
    
    setAiSummary(summary);
    setGeneratingAI(false);
  };

  const getMoodTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getMoodTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return Sun;
    if (hour < 17) return CloudSun;
    return Moon;
  };

  const TimeIcon = getTimeOfDayIcon();
  const patientName = currentPatient?.preferredName || currentPatient?.name?.split(' ')[0] || 'Patient';
  const TrendIcon = getMoodTrendIcon(dailySummary?.moodTrend);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.patientBadge}>
            <img 
              src={currentPatient?.avatarUrl} 
              alt={patientName}
              style={styles.avatar}
            />
            <div>
              <h2 style={styles.patientName}>{patientName}'s Dashboard</h2>
              <p style={styles.patientStage}>{currentPatient?.stage || 'Care Dashboard'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={refreshSummaries}
          style={styles.refreshButton}
          disabled={isRefreshing}
        >
          <RefreshCw 
            size={18} 
            style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
            }} 
          />
        </button>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, backgroundColor: '#EFF6FF'}}>
          <Activity size={24} color="#3B82F6" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{dailySummary?.totalActivities || 0}</span>
            <span style={styles.statLabel}>Today's Activities</span>
          </div>
        </div>
        
        <div style={{...styles.statCard, backgroundColor: '#ECFDF5'}}>
          <div style={styles.trendWrapper}>
            <TrendIcon size={24} color={getMoodTrendColor(dailySummary?.moodTrend)} />
          </div>
          <div style={styles.statInfo}>
            <span style={{...styles.statValue, color: getMoodTrendColor(dailySummary?.moodTrend)}}>
              {dailySummary?.moodTrend || 'N/A'}
            </span>
            <span style={styles.statLabel}>Mood Trend</span>
          </div>
        </div>
        
        <div style={{...styles.statCard, backgroundColor: '#FEF3C7'}}>
          <BarChart3 size={24} color="#F59E0B" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{dailySummary?.engagementScore || 0}%</span>
            <span style={styles.statLabel}>Engagement</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {dailySummary?.alerts?.length > 0 && (
        <div style={styles.alertsSection}>
          <h3 style={styles.sectionTitle}>
            <Bell size={18} />
            Alerts
          </h3>
          {dailySummary.alerts.map((alert, idx) => (
            <div 
              key={idx}
              style={{
                ...styles.alertItem,
                backgroundColor: alert.type === 'alert' ? '#FEF2F2' : 
                               alert.type === 'warning' ? '#FFFBEB' : '#EFF6FF',
                borderLeftColor: alert.type === 'alert' ? '#EF4444' : 
                                alert.type === 'warning' ? '#F59E0B' : '#3B82F6'
              }}
            >
              <AlertTriangle 
                size={18} 
                color={alert.type === 'alert' ? '#EF4444' : 
                       alert.type === 'warning' ? '#F59E0B' : '#3B82F6'} 
              />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Summary Section */}
      <div style={styles.aiSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            <Sparkles size={18} color="#8B5CF6" />
            AI Summary
          </h3>
          <button 
            onClick={generateAISummary}
            style={styles.generateButton}
            disabled={generatingAI}
          >
            {generatingAI ? (
              <>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Report
              </>
            )}
          </button>
        </div>
        
        {aiSummary && (
          <div style={styles.aiSummaryCard}>
            <pre style={styles.aiSummaryText}>{aiSummary}</pre>
            <div style={styles.aiActions}>
              <button style={styles.aiActionButton}>
                <Share2 size={14} />
                Share with Family
              </button>
              <button style={styles.aiActionButton}>
                <FileText size={14} />
                Export PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button 
          onClick={() => setActiveTab('today')}
          style={{
            ...styles.tab,
            ...(activeTab === 'today' ? styles.tabActive : {})
          }}
        >
          <Clock size={16} />
          Today
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          style={{
            ...styles.tab,
            ...(activeTab === 'week' ? styles.tabActive : {})
          }}
        >
          <Calendar size={16} />
          This Week
        </button>
      </div>

      {/* Today's Highlights */}
      {activeTab === 'today' && (
        <div style={styles.highlightsSection}>
          <h3 style={styles.sectionTitle}>Today's Highlights</h3>
          
          {dailySummary?.highlights?.length > 0 ? (
            <div style={styles.highlightsList}>
              {dailySummary.highlights.map((highlight, idx) => (
                <div key={idx} style={styles.highlightItem}>
                  <CheckCircle size={18} color="#10B981" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Activity size={32} color="#D1D5DB" />
              <p>No activity recorded yet today</p>
              <span>Activities will appear here as they happen</span>
              <button
                onClick={loadDemoData}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Database size={16} />
                Load Demo Data
              </button>
            </div>
          )}

          {/* Activity by Category */}
          {dailySummary?.byCategory && Object.keys(dailySummary.byCategory).length > 0 && (
            <div style={styles.categoryBreakdown}>
              <h4 style={styles.subTitle}>Activity Breakdown</h4>
              <div style={styles.categoryGrid}>
                {Object.entries(dailySummary.byCategory).map(([category, activities]) => (
                  <div key={category} style={styles.categoryCard}>
                    <span style={styles.categoryIcon}>
                      {getCategoryIcon(category)}
                    </span>
                    <span style={styles.categoryName}>{category}</span>
                    <span style={styles.categoryCount}>{activities.length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly View */}
      {activeTab === 'week' && weeklySummary && (
        <div style={styles.weeklySection}>
          <div style={styles.weeklyStats}>
            <div style={styles.weeklyStat}>
              <span style={styles.weeklyStatValue}>{weeklySummary.totalActivities}</span>
              <span style={styles.weeklyStatLabel}>Total Activities</span>
            </div>
            <div style={styles.weeklyStat}>
              <span style={styles.weeklyStatValue}>{weeklySummary.averagePerDay}</span>
              <span style={styles.weeklyStatLabel}>Avg per Day</span>
            </div>
            <div style={styles.weeklyStat}>
              <span style={styles.weeklyStatValue}>{weeklySummary.mostActivePeriod}</span>
              <span style={styles.weeklyStatLabel}>Most Active</span>
            </div>
          </div>

          {/* Daily Activity Chart (simplified) */}
          <div style={styles.chartSection}>
            <h4 style={styles.subTitle}>Daily Activity</h4>
            <div style={styles.barChart}>
              {Object.entries(weeklySummary.dailyBreakdown).reverse().map(([date, count]) => (
                <div key={date} style={styles.barWrapper}>
                  <div 
                    style={{
                      ...styles.bar,
                      height: `${Math.min(100, count * 15)}%`,
                      backgroundColor: count > 5 ? '#10B981' : count > 2 ? '#3B82F6' : '#D1D5DB'
                    }}
                  />
                  <span style={styles.barLabel}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Timeline */}
          {weeklySummary.moodCheckins.length > 0 && (
            <div style={styles.moodTimeline}>
              <h4 style={styles.subTitle}>Mood Check-ins</h4>
              <div style={styles.moodList}>
                {weeklySummary.moodCheckins.slice(0, 7).map((entry, idx) => (
                  <div key={idx} style={styles.moodEntry}>
                    <span style={styles.moodEmoji}>
                      {getMoodEmoji(entry.mood)}
                    </span>
                    <span style={styles.moodDate}>{entry.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions for Caregiver */}
      <div style={styles.quickActions}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionButtons}>
          <button style={styles.actionBtn}>
            <MessageCircle size={20} />
            <span>Send Check-in</span>
          </button>
          <button style={styles.actionBtn}>
            <Pill size={20} />
            <span>Log Medication</span>
          </button>
          <button style={styles.actionBtn}>
            <Brain size={20} />
            <span>Start Exercise</span>
          </button>
          <button style={styles.actionBtn}>
            <Share2 size={20} />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    wellness: '💚',
    cognitive: '🧠',
    communication: '💬',
    care: '💊',
    learning: '📚',
    engagement: '📱'
  };
  return icons[category] || '📌';
};

const getMoodEmoji = (mood) => {
  const emojis = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    struggling: '😢'
  };
  return emojis[mood] || '❓';
};

const styles = {
  container: {
    padding: '20px',
    paddingTop: '90px', // Account for fixed navbar (70px + 20px spacing)
    paddingBottom: '100px',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerLeft: {
    flex: 1,
  },
  patientBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
  },
  patientName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  patientStage: {
    margin: '2px 0 0',
    fontSize: '14px',
    color: '#6B7280',
  },
  refreshButton: {
    padding: '10px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    color: '#6B7280',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  statLabel: {
    fontSize: '11px',
    color: '#6B7280',
  },
  trendWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  alertsSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#374151',
  },
  aiSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  generateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#8B5CF6',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  aiSummaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '16px',
  },
  aiSummaryText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
  },
  aiActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
  },
  aiActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: 'white',
    fontSize: '13px',
    color: '#6B7280',
    cursor: 'pointer',
  },
  tabNav: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'white',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    flex: 1,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#3B82F6',
    color: 'white',
  },
  highlightsSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
  },
  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#374151',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#9CA3AF',
  },
  categoryBreakdown: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
  },
  subTitle: {
    margin: '0 0 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 8px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    gap: '4px',
  },
  categoryIcon: {
    fontSize: '24px',
  },
  categoryName: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  categoryCount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  weeklySection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
  },
  weeklyStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  weeklyStat: {
    textAlign: 'center',
  },
  weeklyStatValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#3B82F6',
    textTransform: 'capitalize',
  },
  weeklyStatLabel: {
    fontSize: '12px',
    color: '#6B7280',
  },
  chartSection: {
    marginBottom: '20px',
  },
  barChart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100px',
    padding: '0 8px',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '70%',
    minHeight: '4px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s',
  },
  barLabel: {
    fontSize: '10px',
    color: '#6B7280',
    marginTop: '4px',
  },
  moodTimeline: {
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
  },
  moodList: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0',
  },
  moodEntry: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    minWidth: '60px',
  },
  moodEmoji: {
    fontSize: '24px',
  },
  moodDate: {
    fontSize: '10px',
    color: '#6B7280',
  },
  quickActions: {
    marginBottom: '20px',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
};

export default CaregiverDashboard;
