/**
 * Learn Page
 * Educational resources about Alzheimer's disease
 */

import { PageLayout } from '../components';
import { 
  BookOpen, 
  Search,
  Brain,
  Heart,
  Users,
  Video,
  FileText,
  CheckCircle,
  Code,
  ChevronRight
} from 'lucide-react';

const Learn = () => {
  // Educational content categories
  const categories = [
    { 
      icon: Brain, 
      color: 'blue',
      title: 'Understanding Alzheimer\'s',
      description: 'Disease stages, causes, and progression',
      articles: 12
    },
    { 
      icon: Heart, 
      color: 'green',
      title: 'Caregiver Wellness',
      description: 'Self-care tips and stress management',
      articles: 8
    },
    { 
      icon: Users, 
      color: 'orange',
      title: 'Communication Tips',
      description: 'How to connect with your loved one',
      articles: 10
    },
    { 
      icon: FileText, 
      color: 'purple',
      title: 'Daily Care Guides',
      description: 'Practical advice for everyday tasks',
      articles: 15
    },
  ];

  // Placeholder article cards
  const featuredArticles = [
    { title: '10 Early Warning Signs of Alzheimer\'s', readTime: '5 min read', category: 'Basics' },
    { title: 'Creating a Safe Home Environment', readTime: '8 min read', category: 'Safety' },
    { title: 'Managing Sundowning Symptoms', readTime: '6 min read', category: 'Care' },
    { title: 'Self-Care for Caregivers', readTime: '4 min read', category: 'Wellness' },
  ];

  // Planned features
  const plannedFeatures = [
    'Comprehensive Alzheimer\'s disease information',
    'Caregiver tips and best practices',
    'Symptom guides and management strategies',
    'Coping strategies for patients and families',
    'Video resources and tutorials',
    'Searchable article database',
    'Bookmarking and reading lists',
    'Expert-reviewed content',
  ];

  return (
    <PageLayout
      title="Learn"
      description="Access educational resources, articles, and guides to better understand and manage Alzheimer's care."
      icon={BookOpen}
    >
      {/* Search Bar (Non-functional) */}
      <div className="search-bar">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search articles, guides, videos..."
          disabled
        />
      </div>

      {/* Content Categories */}
      <section className="section">
        <h3 className="section-title">
          <BookOpen size={20} />
          Browse Categories
        </h3>
        {categories.map(({ icon: Icon, color, title, description, articles }, index) => (
          <div key={index} className="category-card">
            <div className={`category-icon ${color}`}>
              <Icon size={24} />
            </div>
            <div className="category-content">
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem' }}>{articles}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </section>

      {/* Featured Articles */}
      <section className="section">
        <h3 className="section-title">
          <FileText size={20} />
          Featured Articles
        </h3>
        {featuredArticles.map((article, index) => (
          <div key={index} className="card" style={{ marginBottom: '12px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: 'var(--primary-100)', 
                  color: 'var(--primary-600)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  {article.category}
                </span>
                <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>{article.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{article.readTime}</p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-light)' }} />
            </div>
          </div>
        ))}
      </section>

      {/* Video Resources Placeholder */}
      <section className="section">
        <h3 className="section-title">
          <Video size={20} />
          Video Resources
        </h3>
        <div style={{ 
          background: 'var(--neutral-100)', 
          borderRadius: 'var(--radius-md)',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <Video size={48} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Video tutorials and guides coming soon
          </p>
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
          Create CMS integration for article management. Implement full-text 
          search with Algolia or similar. Add video player for educational 
          content. Consider partnerships with Alzheimer's organizations for 
          verified content.
        </p>
      </div>
    </PageLayout>
  );
};

export default Learn;
