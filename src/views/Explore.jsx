import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Award, Clock, ArrowRight } from 'lucide-react';

export default function Explore({ setView, setSelectedInstId, institutions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState('All');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const offsetX = e.clientX - cardX;
    const offsetY = e.clientY - cardY;
    e.currentTarget.style.setProperty('--tilt-x', `${offsetX}px`);
    e.currentTarget.style.setProperty('--tilt-y', `${offsetY}px`);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0px');
    e.currentTarget.style.setProperty('--tilt-y', '0px');
  };

  const filtered = institutions.filter(inst => {
    // Search filter
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'All' || inst.type === typeFilter;
    
    // Budget filter
    let matchesBudget = true;
    if (budgetFilter === 'Under10k') {
      matchesBudget = inst.feeNum < 15000;
    } else if (budgetFilter === 'Medium') {
      matchesBudget = inst.feeNum >= 15000 && inst.feeNum <= 70000;
    } else if (budgetFilter === 'Premium') {
      matchesBudget = inst.feeNum > 70000;
    }

    return matchesSearch && matchesType && matchesBudget;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }} className="page-fade-enter">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Explore Partner <span className="gradient-text">Institutions</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse verified universities, academies, and online learning platforms in our knowledge base.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px', '--spotlight-color': 'rgba(180, 83, 9, 0.08)' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', zIndex: 2 }}>
          <input
            type="text"
            className="custom-input"
            placeholder="Search institutions by name, degree, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Filter Buttons Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          {/* Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'University', 'Online Platform'].map(type => (
                <button
                  key={type}
                  className={`btn-premium-outline`}
                  onClick={() => setTypeFilter(type)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    background: typeFilter === type ? 'var(--primary)' : 'var(--card-bg)',
                    borderColor: typeFilter === type ? 'var(--secondary)' : 'var(--card-border)',
                    color: typeFilter === type ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Annual Tuition / Cost</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'All', label: 'All Budgets' },
                { id: 'Under10k', label: 'Low (< AED 15k)' },
                { id: 'Medium', label: 'Moderate (AED 15k - 70k)' },
                { id: 'Premium', label: 'Premium (> AED 70k)' }
              ].map(budget => (
                <button
                  key={budget.id}
                  className={`btn-premium-outline`}
                  onClick={() => setBudgetFilter(budget.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    background: budgetFilter === budget.id ? 'var(--primary)' : 'var(--card-bg)',
                    borderColor: budgetFilter === budget.id ? 'var(--secondary)' : 'var(--card-border)',
                    color: budgetFilter === budget.id ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {budget.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filtered.map(inst => (
            <div 
              key={inst.id} 
              className="spotlight-card" 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                height: '100%',
                '--spotlight-color': inst.type === 'University' ? 'rgba(43, 92, 70, 0.12)' : 'rgba(180, 83, 9, 0.12)'
              }}
            >
              <div style={{ relative: 'relative', zIndex: 2 }}>
                {/* Header tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: inst.type === 'University' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(180, 83, 9, 0.15)',
                    color: inst.type === 'University' ? '#60a5fa' : '#22d3ee',
                    border: inst.type === 'University' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(180, 83, 9, 0.2)'
                  }}>
                    {inst.type}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>
                    <Award size={14} />
                    {inst.reputation.split(' ')[0]}
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'white', fontFamily: 'var(--font-display)' }}>{inst.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', minHeight: '40px', lineHeight: 1.45 }}>
                  {inst.tagline}
                </p>

                {/* Details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <MapPin size={14} style={{ color: 'var(--secondary)' }} />
                    <span>{inst.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <DollarSign size={14} style={{ color: 'var(--success)' }} />
                    <span>{inst.fee}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <Clock size={14} style={{ color: 'var(--accent)' }} />
                    <span>{inst.duration}</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn-premium" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px', zIndex: 2 }}
                onClick={() => {
                  setSelectedInstId(inst.id);
                  setView('institution-detail');
                }}
              >
                View Courses & Details
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card flex-center" style={{ padding: '60px', flexDirection: 'column', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '8px' }}>No Institutions Match Your Filter</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
            Try resetting your filters or searches to find other universities or online learning academies.
          </p>
        </div>
      )}
    </div>
  );
}
