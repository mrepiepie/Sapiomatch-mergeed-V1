import React from 'react';
import { Check, ArrowLeft, Building, MapPin, Star, GraduationCap } from 'lucide-react';

const DESTINATION_DATA = {
  australia: {
    name: "Australia",
    title: "Study in Australia",
    description: "Australia offers world-class education with highly flexible work guidelines and post-study work streams. Discover dynamic universities in Sydney, Melbourne, Brisbane, and Adelaide.",
    image: "/imports/dest_australia.png",
    fees: "AUD 20,000 - AUD 45,000 per year",
    workRights: "Up to 48 hours per fortnight during study semesters, unlimited during holidays.",
    visaName: "Student Visa (Subclass 500)",
    checklist: [
      "Confirmation of Enrolment (CoE) from a registered Australian institution.",
      "Overseas Student Health Cover (OSHC) approval certificate.",
      "Evidence of financial capacity to cover travel, tuition, and living costs (min AUD 29,710/year).",
      "Genuine Student (GS) statement matching visa guidelines."
    ],
    partners: [
      { name: "Australian National University (ANU)", location: "Canberra", rating: 4.8 },
      { name: "University of Melbourne", location: "Melbourne", rating: 4.7 },
      { name: "Monash University", location: "Melbourne", rating: 4.6 }
    ]
  },
  uk: {
    name: "United Kingdom",
    title: "Study in the United Kingdom",
    description: "The UK is home to historically renowned universities, offering 1-year master's programs and a 2-year Graduate Route visa for post-study work.",
    image: "/imports/dest_uk.png",
    fees: "£12,000 - £30,000 per year",
    workRights: "Up to 20 hours per week during term time, full-time during official vacation periods.",
    visaName: "Student Route Visa (Points-based system)",
    checklist: [
      "Confirmation of Acceptance for Studies (CAS) from a licensed UK sponsor.",
      "Evidence of English language proficiency (IELTS 6.5 or equivalent).",
      "Financial capacity evidence (£1,334/month in London, £1,023/month outside London).",
      "Tuberculosis (TB) test certificate (if applying from certain countries)."
    ],
    partners: [
      { name: "Middlesex University Dubai", location: "London & Dubai", rating: 4.5 },
      { name: "University of Birmingham Dubai", location: "Birmingham & Dubai", rating: 4.6 }
    ]
  },
  usa: {
    name: "United States",
    title: "Study in the United States",
    description: "The US is the global hub for research and technology, offering OPT (Optional Practical Training) for up to 3 years for STEM graduates.",
    image: "/imports/dest_usa.png",
    fees: "USD 25,000 - USD 55,000 per year",
    workRights: "On-campus employment up to 20 hours per week during semesters, full-time during holidays.",
    visaName: "F-1 Student Visa",
    checklist: [
      "Form I-20 issued by a SEVP-certified institution.",
      "Payment of SEVIS I-901 fee confirmation.",
      "Proof of sufficient liquid funds to cover first-year tuition and living expenses.",
      "Non-immigrant intent declaration (DS-160 visa application)."
    ],
    partners: [
      { name: "California Institute of Technology (Caltech)", location: "Pasadena, California", rating: 4.9 },
      { name: "University of Michigan-Ann Arbor", location: "Ann Arbor, Michigan", rating: 4.7 }
    ]
  },
  canada: {
    name: "Canada",
    title: "Study in Canada",
    description: "Canada combines prestigious degrees with a transparent pathway to Permanent Residency via PGWP (Post-Graduation Work Permit).",
    image: "/imports/dest_canada.png",
    fees: "CAD 15,000 - CAD 35,000 per year",
    workRights: "Up to 20 hours per week off-campus during academic terms, full-time during scheduled breaks.",
    visaName: "Study Permit",
    checklist: [
      "Letter of Acceptance (LOA) from a Designated Learning Institution (DLI).",
      "Provincial Attestation Letter (PAL) if applicable.",
      "Guaranteed Investment Certificate (GIC) of CAD 20,635 to prove financial support.",
      "Certificat d'acceptation du Québec (CAQ) if studying in Quebec."
    ],
    partners: [
      { name: "University of British Columbia", location: "Vancouver, BC", rating: 4.7 },
      { name: "McGill University", location: "Montreal, Quebec", rating: 4.8 }
    ]
  },
  nz: {
    name: "New Zealand",
    title: "Study in New Zealand",
    description: "New Zealand is known for its high safety indices, friendly communities, and excellent post-study work guidelines for skilled graduates.",
    image: "/imports/dest_nz.png",
    fees: "NZD 18,000 - NZD 36,000 per year",
    workRights: "Up to 20 hours per week during study terms, full-time during holidays.",
    visaName: "Student Visa",
    checklist: [
      "Offer of Place from an NZQA-approved educational provider.",
      "Evidence of payment of tuition fees for the first academic year.",
      "Proof of sufficient funds (min NZD 20,000/year or NZD 1,250/month).",
      "Medical chest X-ray and police certificates if studying long-term."
    ],
    partners: [
      { name: "University of Auckland (Affiliated)", location: "Auckland", rating: 4.5 }
    ]
  },
  nepal: {
    name: "Nepal",
    title: "Study in Nepal",
    description: "Nepal is a growing destination for cultural research, engineering, and environmental studies, offering affordable, heritage-rich education.",
    image: "/imports/dest_nepal.png",
    fees: "NPR 100,000 - NPR 400,000 per year",
    workRights: "Limited on-campus internship and research assistantships.",
    visaName: "Student Visa",
    checklist: [
      "Letter of Admission from a recognized Nepalese college or university.",
      "No Objection Certificate (NOC) from the Ministry of Education.",
      "Bank statement demonstrating financial capacity for tuition fees.",
      "Police clearance report from your country of origin."
    ],
    partners: [
      { name: "Sunway College Kathmandu", location: "Kathmandu", rating: 4.3 },
      { name: "Softwarica College of IT & E-commerce", location: "Kathmandu", rating: 4.4 }
    ]
  }
};

export default function DestinationDetail({ countryCode, setView, setAnswers, setExploreSearchTerm }) {
  const dest = DESTINATION_DATA[countryCode.toLowerCase()] || DESTINATION_DATA.australia;

  const handleMatchRedirect = () => {
    // Set destination in questionnaire answer state
    if (setAnswers) {
      setAnswers(prev => ({
        ...prev,
        destination: dest.name
      }));
    }
    setView('questionnaire');
  };

  const handlePartnerClick = (partnerName) => {
    if (setExploreSearchTerm) {
      setExploreSearchTerm(partnerName);
    }
    setView('public-explore');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }} className="page-fade-enter">
      
      {/* Banner */}
      <div className="dest-detail-banner" style={{ display: 'flex', flexDirection: 'column' }}>
        <img src={dest.image} alt={dest.title} className="dest-detail-banner-img" />
        <div className="dest-detail-banner-overlay">
          <div className="hero-badge" style={{ 
            background: 'rgba(34, 211, 238, 0.15)', 
            borderColor: 'rgba(34, 211, 238, 0.3)', 
            color: 'var(--accent)', 
            marginBottom: '12px', 
            width: 'fit-content',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Study Destination
          </div>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2rem, 5vw, 2.75rem)', 
            color: 'white', 
            marginBottom: '12px',
            lineHeight: 1.15
          }}>
            {dest.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '720px', lineHeight: 1.6 }}>
            {dest.description}
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* Left Side: Guidelines & Visa */}
        <div className="glass-card bento-col-8" style={{ 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '30px',
          gridColumn: 'span 8',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          background: 'var(--card-bg)'
        }}>
          {/* Key Guidelines */}
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600,
              marginBottom: '20px', 
              borderBottom: '1px solid var(--card-border)', 
              paddingBottom: '12px', 
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <GraduationCap size={20} />
              Key Academic Guidelines
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Tuition Fees Range
                </h4>
                <p style={{ fontSize: '16px', color: 'white', fontWeight: 600, marginTop: '6px' }}>
                  {dest.fees}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Working Rights
                </h4>
                <p style={{ fontSize: '14px', color: 'white', fontWeight: 500, marginTop: '6px', lineHeight: 1.5 }}>
                  {dest.workRights}
                </p>
              </div>
            </div>
          </div>

          {/* Visa Checklist */}
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600,
              marginBottom: '20px', 
              borderBottom: '1px solid var(--card-border)', 
              paddingBottom: '12px', 
              color: 'var(--secondary)'
            }}>
              {dest.visaName} Requirements
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0 }}>
              {dest.checklist.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* CTA Action */}
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={handleMatchRedirect} 
              className="btn-premium" 
              style={{ display: 'inline-flex', padding: '12px 28px', fontSize: '15px' }}
            >
              Match Me to {dest.name} Programs →
            </button>
          </div>
        </div>

        {/* Right Side: Partner Schools */}
        <div className="glass-card bento-col-4" style={{ 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column',
          gridColumn: 'span 4',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          background: 'var(--card-bg)'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 600,
            marginBottom: '20px', 
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Top Partner Institutions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dest.partners.map((p, idx) => (
              <div 
                key={idx}
                className="spotlight-card" 
                onMouseMove={handleMouseMove}
                onClick={() => handlePartnerClick(p.name)}
                style={{ 
                  padding: '20px', 
                  cursor: 'pointer',
                  border: '1px solid var(--card-border)',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '--spotlight-color': 'rgba(34, 211, 238, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 2 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>
                    {p.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                    <Star size={12} fill="var(--accent)" />
                    <span>{p.rating}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                  <MapPin size={12} />
                  <span>{p.location}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', zIndex: 2 }}>
                  <span>View profile</span>
                  <ArrowLeft size={12} style={{ transform: 'rotate(180deg)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
