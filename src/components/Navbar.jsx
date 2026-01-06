/**
 * Navbar Component
 * Bottom navigation bar with 5 tabs for main app sections
 */

import { NavLink } from 'react-router-dom';
import { Home, Bell, MessageCircle, BookOpen, User } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="nav-icon-wrapper">
            <Icon size={22} />
          </div>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
