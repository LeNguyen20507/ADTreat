/**
 * PageLayout Component
 * Wrapper component providing consistent page structure with header
 */

import { Construction } from 'lucide-react';

const PageLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}) => {
  return (
    <div className="page">
      {/* Page Header */}
      <header className="page-header">
        {Icon && <Icon className="page-header-icon" size={48} />}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {/* Page Content */}
      <div className="page-content">
        {/* Under Development Badge */}
        <div className="dev-badge">
          <Construction size={16} />
          UNDER DEVELOPMENT
        </div>

        {children}
      </div>
    </div>
  );
};

export default PageLayout;
