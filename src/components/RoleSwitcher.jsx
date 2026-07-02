import React, { useState } from 'react';
import { Sliders, Shield, GraduationCap, School, Globe, MessageSquare, Compass, BarChart3, Award } from 'lucide-react';

export default function RoleSwitcher({ currentView, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'public-home', label: 'Public Home', category: 'Public', icon: Globe },
    { id: 'about', label: 'About Us', category: 'Public', icon: Globe },
    { id: 'contact', label: 'Contact Us', category: 'Public', icon: Globe },
    { id: 'public-explore', label: 'Explore Courses', category: 'Public', icon: Compass },
    { id: 'questionnaire', label: 'AI Match Quiz', category: 'Questionnaire', icon: MessageSquare },
    { id: 'results', label: 'Match Results', category: 'Questionnaire', icon: Award },
    { id: 'user-dashboard', label: 'Student Dashboard', category: 'Student', icon: GraduationCap },
    { id: 'institution-dashboard', label: 'University Panel', category: 'Institution', icon: School },
    { id: 'admin-dashboard', label: 'Operator Portal', category: 'Operator', icon: Shield }
  ];

  // Group by category
  const categories = roles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = [];
    acc[role.category].push(role);
    return acc;
  }, {});

  return (
    <div className="role-switcher">
      <button 
        className="role-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Prototype Navigation Switcher"
      >
        <Sliders size={20} />
      </button>

      {isOpen && (
        <div className="role-switcher-menu">
          <div style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Interactive Demo Views
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 700, paddingLeft: '8px', textTransform: 'uppercase', marginTop: '4px' }}>
                  {category}
                </span>
                {items.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      className={currentView === role.id ? 'active' : ''}
                      onClick={() => {
                        setView(role.id);
                        setIsOpen(false);
                      }}
                      style={{
                        background: currentView === role.id ? 'var(--primary)' : 'transparent',
                        color: currentView === role.id ? 'white' : 'var(--text-primary)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: 'var(--border-radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        fontSize: '13px',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <Icon size={16} />
                      {role.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
