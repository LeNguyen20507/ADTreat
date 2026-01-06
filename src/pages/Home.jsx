/**
 * Home Page
 * Dashboard overview with quick stats and navigation to other sections
 */

import { PageLayout } from '../components';
import { 
  Home as HomeIcon, 
  Bell, 
  MessageCircle, 
  BookOpen, 
  Heart, 
  Users, 
  AlertCircle,
  CheckCircle,
  Code
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Placeholder data for stats
  const stats = [
    { icon: Bell, value: '5', label: 'Today\'s Tasks' },
    { icon: Heart, value: '92%', label: 'Wellness Score' },
    { icon: Users, value: '3', label: 'Caregivers' },
    { icon: AlertCircle, value: '0', label: 'Alerts' },
  ];

  // Placeholder reminders preview
  const todayReminders = [
    { time: '8:00 AM', task: 'Morning Medication', type: 'medication' },
    { time: '10:00 AM', task: 'Hydration Reminder', type: 'hydration' },
    { time: '2:00 PM', task: 'Afternoon Rest', type: 'rest' },
  ];

  // Quick action buttons
  const quickActions = [
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/profile', icon: Users, label: 'Profile' },
  ];

  // Planned features for this page
  const plannedFeatures = [
    'Real-time dashboard overview',
    'Patient status monitoring',
    'Urgent alerts and notifications',
    'Quick access to emergency contacts',
    'Daily activity summary',
    'Caregiver sync status',
  ];

  return (
    <PageLayout
      title="Welcome Back"
      description="Your Alzheimer care dashboard. Monitor health, manage reminders, and access support."
      icon={HomeIcon}
    >
      {/* Quick Stats Cards */}
      <section className="section">
        <h3 className="section-title">
          <Heart size={20} />
          Quick Overview
        </h3>
        <div className="card-grid">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-icon">
                <Icon size={20} />
              </div>
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Reminders Preview */}
      <section className="section">
        <h3 className="section-title">
          <Bell size={20} />
          Today's Reminders
        </h3>
        {todayReminders.map((reminder, index) => (
          <div key={index} className="reminder-item">
            <div className={`reminder-icon ${reminder.type}`}>
              <Bell size={20} />
            </div>
            <div className="reminder-content">
              <h4>{reminder.task}</h4>
              <p>Scheduled reminder</p>
            </div>
            <span className="reminder-time">{reminder.time}</span>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="section">
        <h3 className="section-title">
          <CheckCircle size={20} />
          Quick Actions
        </h3>
        <div className="quick-actions">
          {quickActions.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path} className="quick-action-btn">
              <Icon size={28} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Planned Features */}
      <section className="section">
        <h3 className="section-title">
          <CheckCircle size={20} />
          Planned Features
        </h3>
        <ul className="feature-list">
          {plannedFeatures.map((feature, index) => (
            <li key={index}>
              <CheckCircle size={18} />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Developer Notes */}
      <div className="dev-notes">
        <h4>
          <Code size={16} />
          Developer Notes
        </h4>
        <p>
          This dashboard will serve as the main hub for the app. 
          Integrate real-time data fetching for patient stats, 
          implement push notifications for urgent alerts, and 
          add caregiver sync functionality.
        </p>
      </div>
    </PageLayout>
  );
};

export default Home;
