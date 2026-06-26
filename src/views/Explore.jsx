import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Award, Clock, ArrowRight } from 'lucide-react';

export default function Explore({ 
  setView, 
  setSelectedInstId, 
  institutions,
  searchTerm: externalSearchTerm,
  setSearchTerm: setExternalSearchTerm
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
  const setSearchTerm = setExternalSearchTerm !== undefined ? setExternalSearchTerm : setLocalSearchTerm;

  const [typeFilter, setTypeFilter] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');

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

  // NLP parsing function
  const parseNLPQuery = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const tags = [];
    let detectedCategory = null;
    let detectedDelivery = null;
    let detectedBudget = null;
    let detectedLocation = null;

    // 1. Detect Category
    if (lower.includes('tech') || lower.includes('computer') || lower.includes('software') || lower.includes('coding') || lower.includes('data') || lower.includes('ai') || lower.includes('machine learning') || lower.includes('cyber')) {
      detectedCategory = 'Technology & AI';
      tags.push({ label: 'Category: Tech & AI', type: 'category' });
    } else if (lower.includes('business') || lower.includes('mba') || lower.includes('manage') || lower.includes('finance') || lower.includes('marketing') || lower.includes('strategy')) {
      detectedCategory = 'Business & Management';
      tags.push({ label: 'Category: Business & MBA', type: 'category' });
    } else if (lower.includes('policy') || lower.includes('govern') || lower.includes('law') || lower.includes('international') || lower.includes('legal')) {
      detectedCategory = 'Law & Public Policy';
      tags.push({ label: 'Category: Law & Policy', type: 'category' });
    } else if (lower.includes('health') || lower.includes('science') || lower.includes('medical') || lower.includes('clinical') || lower.includes('doctor')) {
      detectedCategory = 'Healthcare & Sciences';
      tags.push({ label: 'Category: Healthcare & Sciences', type: 'category' });
    }

    // 2. Detect Delivery Mode
    if (lower.includes('online') || lower.includes('remote') || lower.includes('self-paced') || lower.includes('udemy') || lower.includes('coursera')) {
      detectedDelivery = 'Online';
      tags.push({ label: 'Delivery: 100% Online', type: 'delivery' });
    } else if (lower.includes('physical') || lower.includes('on-campus') || lower.includes('campus') || lower.includes('in-person')) {
      detectedDelivery = 'On-Campus';
      tags.push({ label: 'Delivery: On-Campus', type: 'delivery' });
    } else if (lower.includes('hybrid') || lower.includes('blended')) {
      detectedDelivery = 'Hybrid';
      tags.push({ label: 'Delivery: Hybrid', type: 'delivery' });
    }

    // 3. Detect Budget/Cost
    if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('low cost') || lower.includes('under 15k') || lower.includes('free')) {
      detectedBudget = 'Under10k';
      tags.push({ label: 'Budget: Low (< 15k)', type: 'budget' });
    } else if (lower.includes('moderate') || lower.includes('mid') || lower.includes('medium') || lower.includes('under 50k') || lower.includes('around 50k')) {
      detectedBudget = 'Medium';
      tags.push({ label: 'Budget: Moderate (15k-70k)', type: 'budget' });
    } else if (lower.includes('premium') || lower.includes('expensive') || lower.includes('russell') || lower.includes('prestigious') || lower.includes('over 70k')) {
      detectedBudget = 'Premium';
      tags.push({ label: 'Budget: Premium (> 70k)', type: 'budget' });
    }

    // 4. Detect Location
    if (lower.includes('dubai')) {
      detectedLocation = 'Dubai';
      tags.push({ label: 'Location: Dubai', type: 'location' });
    } else if (lower.includes('sharjah')) {
      detectedLocation = 'Sharjah';
      tags.push({ label: 'Location: Sharjah', type: 'location' });
    }

    return { tags, category: detectedCategory, delivery: detectedDelivery, budget: detectedBudget, location: detectedLocation };
  };

  const nlp = parseNLPQuery(searchTerm);

  const filtered = institutions.filter(inst => {
    // 1. NLP or standard search text matching
    let matchesSearch = true;
    if (nlp && nlp.tags.length > 0) {
      if (nlp.category) {
        const matchesCategory = inst.courses.some(c => c.name.toLowerCase().includes(nlp.category.split(' ')[0].toLowerCase())) ||
                                inst.tagline.toLowerCase().includes(nlp.category.split(' ')[0].toLowerCase());
        if (!matchesCategory) matchesSearch = false;
      }
      if (nlp.delivery) {
        const matchesDeliv = inst.mode.toLowerCase().includes(nlp.delivery.toLowerCase()) || 
                             inst.courses.some(c => c.mode.toLowerCase().includes(nlp.delivery.toLowerCase()));
        if (!matchesDeliv) matchesSearch = false;
      }
      if (nlp.budget) {
        let matchesBud = true;
        if (nlp.budget === 'Under10k') {
          matchesBud = inst.feeNum < 15000;
        } else if (nlp.budget === 'Medium') {
          matchesBud = inst.feeNum >= 15000 && inst.feeNum <= 70000;
        } else if (nlp.budget === 'Premium') {
          matchesBud = inst.feeNum > 70000;
        }
        if (!matchesBud) matchesSearch = false;
      }
      if (nlp.location) {
        const matchesLoc = inst.location.toLowerCase().includes(nlp.location.toLowerCase());
        if (!matchesLoc) matchesSearch = false;
      }
    } else {
      matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      inst.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      inst.courses.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 2. Type filter
    const matchesType = typeFilter === 'All' || inst.type === typeFilter;
    
    // 3. Budget filter
    let matchesBudget = true;
    if (budgetFilter === 'Under10k') {
      matchesBudget = inst.feeNum < 15000;
    } else if (budgetFilter === 'Medium') {
      matchesBudget = inst.feeNum >= 15000 && inst.feeNum <= 70000;
    } else if (budgetFilter === 'Premium') {
      matchesBudget = inst.feeNum > 70000;
    }

    // 4. Delivery filter
    let matchesDelivery = true;
    if (deliveryFilter !== 'All') {
      matchesDelivery = inst.mode.toLowerCase().includes(deliveryFilter.toLowerCase()) ||
                        inst.courses.some(c => c.mode.toLowerCase().includes(deliveryFilter.toLowerCase()));
    }

    return matchesSearch && matchesType && matchesBudget && matchesDelivery;
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

        {/* NLP Tag Chips */}
        {nlp && nlp.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '-4px', animation: 'fadeIn 0.3s ease-out' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✨ NLP Extracted Filters:</span>
            {nlp.tags.map((tag, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: 'rgba(52, 211, 153, 0.1)', 
                  border: '1px solid rgba(52, 211, 153, 0.2)', 
                  borderRadius: '12px', 
                  padding: '2px 10px', 
                  fontSize: '11.5px', 
                  color: 'white', 
                  fontWeight: 500 
                }}
              >
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
        )}

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

          {/* Delivery Mode Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Delivery Mode</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'On-Campus', 'Hybrid', 'Online'].map(mode => (
                <button
                  key={mode}
                  className={`btn-premium-outline`}
                  onClick={() => setDeliveryFilter(mode)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    background: deliveryFilter === mode ? 'var(--primary)' : 'var(--card-bg)',
                    borderColor: deliveryFilter === mode ? 'var(--secondary)' : 'var(--card-border)',
                    color: deliveryFilter === mode ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {mode === 'Online' ? '100% Online' : mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '13.5px', flexWrap: 'wrap' }}>
        <span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '15px' }}>{filtered.length}</span>
        institution{filtered.length === 1 ? '' : 's'} found
        {filtered.length !== institutions.length && (
          <>
            <span style={{ opacity: 0.5 }}>·</span>
            <button onClick={() => { setTypeFilter('All'); setBudgetFilter('All'); setDeliveryFilter('All'); setSearchTerm(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13.5px', padding: 0, fontWeight: 600 }}>Clear filters</button>
          </>
        )}
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
