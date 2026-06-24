"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CircleDot,
  Info,
  MessageSquare,
  Shield,
  Sun,
  Users,
  Video,
  WalletCards,
  Zap
} from "lucide-react";

const pathways = {
  tutoring: {
    eyebrow: "Online via Zoom",
    title: "1-to-1 Tutoring",
    body: "We can support you through personalized teaching in areas you are struggling with the most. Let us fill in the gaps and help you achieve your target grades.",
    helper: "Use our search tool to find your subject - We cover 400+ subjects",
    image: "/imports/tutoring_session.png",
    action: "Match a Tutor",
    icon: Users,
    chips: ["Maths", "English", "Computing", "Piano", "Physics", "Spanish", "Chemistry", "Psychology", "Biology"]
  },
  summer: {
    eyebrow: "Residential and day camps",
    title: "Summer Schools",
    body: "Discover enriching summer programs that build academic confidence, independence, and global friendships before the next school year begins.",
    helper: "Explore camps by destination, subject, age group, and duration.",
    image: "/imports/summer_school.png",
    action: "Find a Summer School",
    icon: Sun,
    chips: ["STEM", "Business", "English", "Leadership", "Medicine", "Arts", "Robotics"]
  },
  provision: {
    eyebrow: "Specialist support",
    title: "Alternative Provision",
    body: "Find flexible learning support for students who need a different pathway, specialist care, or a more personal education plan.",
    helper: "Match support based on needs, delivery format, and family goals.",
    image: "/imports/alternative_provision.png",
    action: "Find Support",
    icon: Shield,
    chips: ["Mentoring", "SEND", "Online", "Hybrid", "GCSE", "Wellbeing"]
  },
  online: {
    eyebrow: "Self-paced learning",
    title: "Online Courses",
    body: "Browse online learning options for professional skills, academic preparation, and flexible study from anywhere in the world.",
    helper: "Search by skill, budget, schedule, and certificate type.",
    image: "/imports/online_learning.png",
    action: "Browse Courses",
    icon: Video,
    chips: ["AI", "Data", "Design", "Business", "IELTS", "Coding", "Marketing"]
  }
};

const destinations = [
  { name: "Australia", image: "/imports/dest_australia.png" },
  { name: "United Kingdom", image: "/imports/dest_uk.png" },
  { name: "United States", image: "/imports/dest_usa.png" },
  { name: "Canada", image: "/imports/dest_canada.png" },
  { name: "New Zealand", image: "/imports/dest_nz.png" },
  { name: "Nepal", image: "/imports/dest_nepal.png" }
];

const universityLogos = [
  { code: "ANU", name: "Australian National University", country: "AU" },
  { code: "Caltech", name: "California Institute of Technology", country: "US" },
  { code: "MONASH", name: "Monash University", country: "AU" },
  { code: "MICHIGAN", name: "University of Michigan", country: "US" },
  { code: "MELBOURNE", name: "University of Melbourne", country: "AU" },
  { code: "UBC", name: "University of British Columbia", country: "CA" },
  { code: "ADELAIDE", name: "University of Adelaide", country: "AU" }
];

const testimonials = [
  {
    name: "Umar Ibrohimov",
    meta: "Royal Holloway University (Foundation Year), Egham, UK - Tashkent, Uzbekistan",
    image: "/imports/testimonials/avatar-umar.jpg",
    quote: "I've been stressing about my major for months. The personality test broke down my preferences and suggested degrees I actually liked. The PDF report was easier than trying to explain everything myself."
  },
  {
    name: "A. M.",
    meta: "Almaty, Kazakhstan",
    image: "/imports/testimonials/avatar-am.jpg",
    quote: "The university comparator is great because I could put my top choices side-by-side to see the real difference in fees, rankings, and requirements."
  },
  {
    name: "B. K.",
    meta: "Dubai, United Arab Emirates",
    image: "/imports/testimonials/avatar-bk.jpg",
    quote: "I thought this would be another search engine, but it felt like having a consultant working in one session. I got my course list and could focus on IELTS instead of digging through university pages."
  },
  {
    name: "Lina Foster",
    meta: "Manchester, United Kingdom",
    image: "/imports/testimonials/avatar-lina.jpg",
    quote: "SapioMatch helped me see which universities fit both my budget and career plans. I stopped guessing and finally had a shortlist that made sense."
  },
  {
    name: "Daniel Reed",
    meta: "Toronto, Canada",
    image: "/imports/testimonials/avatar-daniel.jpg",
    quote: "The match breakdown made the decision feel less overwhelming. I could compare outcomes, costs, and course structure without opening twenty tabs."
  },
  {
    name: "Maya Karim",
    meta: "Dubai, United Arab Emirates",
    image: "/imports/testimonials/avatar-maya.jpg",
    quote: "I liked that it felt personal but still data-driven. The recommendations gave me options I had not considered and helped me apply with confidence."
  }
];

export default function SapioLegacySections({ setView }) {
  const [activePathway, setActivePathway] = useState("tutoring");
  const [activeVisaTab, setActiveVisaTab] = useState("eligibility");
  const [visaReady, setVisaReady] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [testimonialInView, setTestimonialInView] = useState(false);
  const [stats, setStats] = useState({ universities: 0, programmes: 0, students: 0 });
  const choiceSectionRef = useRef(null);
  const testimonialSectionRef = useRef(null);
  const pathway = pathways[activePathway];
  const PathwayIcon = pathway.icon;
  const statTargets = useMemo(() => ({
    universities: 400,
    programmes: 60000,
    students: 82000
  }), []);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  const visaTabs = [
    { id: "eligibility", label: "Eligibility", icon: Award },
    { id: "study", label: "Study", icon: BookOpen },
    { id: "finance", label: "Finance", icon: WalletCards },
    { id: "english", label: "English", icon: MessageSquare },
    { id: "credibility", label: "Credibility", icon: Info }
  ];

  const goToMatching = () => setView("questionnaire");
  const goToExplore = () => setView("public-explore");
  const goToAuth = () => setView("auth");

  useEffect(() => {
    const section = choiceSectionRef.current;
    if (!section) return;

    let wasVisible = false;
    let tween = null;

    const playCounters = () => {
      tween?.kill();
      const state = { universities: 0, programmes: 0, students: 0 };
      setStats(state);
      tween = gsap.to(state, {
        universities: statTargets.universities,
        programmes: statTargets.programmes,
        students: statTargets.students,
        duration: 2.35,
        ease: "power2.out",
        onUpdate: () => {
          setStats({
            universities: Math.round(state.universities),
            programmes: Math.round(state.programmes),
            students: Math.round(state.students)
          });
        },
        onComplete: () => setStats(statTargets)
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.32;
        if (visible && !wasVisible) {
          wasVisible = true;
          playCounters();
        }
        if (!visible) {
          wasVisible = false;
        }
      },
      { threshold: [0, 0.32], rootMargin: "-10% 0px -14% 0px" }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [numberFormatter, statTargets]);

  useEffect(() => {
    const section = testimonialSectionRef.current;
    if (!section) return;

    let intervalId = 0;
    let isVisible = false;
    const startRotation = () => {
      if (!isVisible || testimonialPaused || intervalId) return;
      intervalId = window.setInterval(() => {
        setActiveTestimonial((prev) => (prev + 3) % testimonials.length);
      }, 3900);
    };

    const stopRotation = () => {
      if (!intervalId) return;
      window.clearInterval(intervalId);
      intervalId = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.24;
        isVisible = visible;
        setTestimonialInView(visible);
        if (visible) {
          startRotation();
        } else {
          stopRotation();
        }
      },
      { threshold: [0, 0.24], rootMargin: "-8% 0px -8% 0px" }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      stopRotation();
    };
  }, [testimonialPaused]);

  const visibleTestimonials = Array.from({ length: Math.min(3, testimonials.length) }, (_, offset) => testimonials[(activeTestimonial + offset) % testimonials.length]);

  const renderVisaPanel = () => {
    if (activeVisaTab === "study") {
      return (
        <div className="sapio-visa-info-panel">
          <strong>Study evidence checks</strong>
          <p>Confirm your CAS, offer letter, course level, and study history before submission.</p>
          <ul>
            <li><Check size={14} /> Course level aligns with visa rules.</li>
            <li><Check size={14} /> Provider sponsorship status verified.</li>
            <li><Check size={14} /> Academic progression narrative prepared.</li>
          </ul>
        </div>
      );
    }

    if (activeVisaTab === "finance") {
      return (
        <div className="sapio-visa-info-panel">
          <strong>Finance readiness</strong>
          <p>Simulate fund age, tuition coverage, maintenance amounts, and statement risks.</p>
          <button type="button" className={`sapio-check-row ${visaReady ? "checked" : ""}`} onClick={() => setVisaReady(!visaReady)}>
            <span />
            <div>
              <strong>Simulate Maintenance Funds Check</strong>
              <p>Check maintaining at least GBP 18,707 for 28 consecutive days.</p>
            </div>
          </button>
        </div>
      );
    }

    if (activeVisaTab === "english") {
      return (
        <div className="sapio-visa-info-panel">
          <strong>English evidence</strong>
          <p>Track IELTS, TOEFL, waiver status, and institution-specific language requirements.</p>
          <ul>
            <li><Check size={14} /> Test score format checked.</li>
            <li><Check size={14} /> Expiry date risk reviewed.</li>
            <li><Check size={14} /> Waiver evidence mapped.</li>
          </ul>
        </div>
      );
    }

    if (activeVisaTab === "credibility") {
      return (
        <div className="sapio-visa-info-panel">
          <strong>Credibility interview prep</strong>
          <p>Practice consistent answers about course choice, funding, career pathway, and return plans.</p>
          <ul>
            <li><Check size={14} /> Course motivation story prepared.</li>
            <li><Check size={14} /> Funding source explanation checked.</li>
            <li><Check size={14} /> Career outcome narrative aligned.</li>
          </ul>
        </div>
      );
    }

    return (
      <>
        <div className="sapio-visa-topline">
          <strong>Precise eligibility audit</strong>
          <span className={visaReady ? "ready" : ""}>{visaReady ? "Ready" : "Not yet ready"}</span>
        </div>
        <div className="sapio-score-row">
          <div className="sapio-score-ring">
            <b>{visaReady ? 70 : 60}</b>
            <span>{visaReady ? "100%" : "86%"}</span>
          </div>
          <div className="sapio-score-bars">
            <label>Study <span>50/50</span></label>
            <div><i style={{ width: "100%" }} /></div>
            <label>English <span>10/10</span></label>
            <div><i style={{ width: "100%" }} /></div>
            <label>Finance <span className={visaReady ? "" : "danger"}>{visaReady ? "10/10" : "0/10"}</span></label>
            <div><i style={{ width: visaReady ? "100%" : "0%" }} /></div>
          </div>
        </div>
        <button type="button" className={`sapio-check-row ${visaReady ? "checked" : ""}`} onClick={() => setVisaReady(!visaReady)}>
          <span />
          <div>
            <strong>Simulate Maintenance Funds Check</strong>
            <p>Check to verify maintaining at least GBP 18,707 for 28 consecutive days.</p>
          </div>
        </button>
        <strong>Next Steps checklist:</strong>
        <ul className={visaReady ? "sapio-ready-list" : ""}>
          <li><CircleDot size={14} /> Request a new statement from your bank.</li>
          <li><CircleDot size={14} /> Ensure bank holds at least GBP 18,707.</li>
          <li><CircleDot size={14} /> Maintain funds for 28 days before applying.</li>
        </ul>
      </>
    );
  };

  return (
    <div className="sapio-legacy-sections">
      <section className="sapio-section sapio-find-university sapio-snap-section">
        <div className="sapio-copy">
          <h2>Find your university now</h2>
          <p>Browse our catalog of universities and programs worldwide.</p>
          <div className="sapio-select-stack">
            <button type="button" onClick={goToExplore}>Country of study <span>⌄</span></button>
            <button type="button" onClick={goToExplore}>Subject of study <span>⌄</span></button>
          </div>
          <button className="btn-premium sapio-wide-cta" onClick={goToMatching}>
            Start matching
          </button>
          <p className="sapio-inline-link">
            Prefer to talk first? <button type="button" onClick={() => setView("contact")}>Book a consultation <ArrowRight size={14} /></button>
          </p>
        </div>
        <div className="sapio-laptop-wrap">
          <img src="/imports/dashboard_mockup.png" alt="SapioMatch university search dashboard" />
        </div>
      </section>

      <section className="sapio-section sapio-help-section sapio-snap-section">
        <div className="sapio-centered-heading">
          <h2>How Can We Help?</h2>
          <p>Select one of our specialized educational pathways to match with top tutors, camps, provisions, or self-paced courses.</p>
        </div>
        <div className="sapio-pathway-tabs">
          {Object.entries(pathways).map(([key, item]) => {
            const Icon = item.icon;
            return (
              <button
                key={key}
                type="button"
                className={activePathway === key ? "active" : ""}
                onClick={() => setActivePathway(key)}
              >
                <Icon size={20} />
                {item.title}
              </button>
            );
          })}
        </div>
        <div className="sapio-pathway-detail">
          <div>
            <span className="sapio-eyebrow">{pathway.eyebrow}</span>
            <h3>{pathway.title}</h3>
            <p>{pathway.body}</p>
            <strong>{pathway.helper}</strong>
            <div className="sapio-chip-cloud">
              {pathway.chips.map((chip) => <span key={chip}>{chip}</span>)}
            </div>
            <button className="btn-premium" onClick={goToMatching}>
              {pathway.action}
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="sapio-pathway-image">
            <img src={pathway.image} alt={`${pathway.title} preview`} />
            <PathwayIcon size={26} />
          </div>
        </div>
      </section>

      <section ref={choiceSectionRef} className="sapio-section sapio-choice-section sapio-snap-section">
        <div className="sapio-copy">
          <h2>Why students choose SapioMatch AI</h2>
          <p>Free to use, no middlemen, and AI-matched to you - built on real rankings, costs, and requirements.</p>
          <div className="sapio-stat-stack">
            <div><strong>{numberFormatter.format(stats.universities)}+</strong><span>Universities to choose from</span></div>
            <div><strong>{numberFormatter.format(stats.programmes)}+</strong><span>Study programmes available</span></div>
            <div><strong>{numberFormatter.format(stats.students)}+</strong><span>Students guided this year</span></div>
          </div>
        </div>
        <div className="sapio-phone-mock">
          <img src="/imports/purple_3d_orb.png" alt="" />
          <div>
            <h3>Find the right university</h3>
            <p>Create your account to start AI matching</p>
            <button type="button" onClick={goToAuth}>Log in</button>
            <button type="button" className="primary" onClick={goToAuth}>Sign up</button>
          </div>
        </div>
      </section>

      <section className="sapio-section sapio-destinations sapio-snap-section">
        <div className="sapio-centered-heading">
          <h2>Popular Study Destinations</h2>
          <p>Select a country to explore visa requirements, cost of living, post-study work options, and search partner courses.</p>
        </div>
        <div className="sapio-destination-grid">
          {destinations.map((destination) => (
            <button key={destination.name} type="button" onClick={goToExplore}>
              <img src={destination.image} alt={`Study in ${destination.name}`} />
              <span>{destination.name}</span>
              <ArrowRight size={20} />
            </button>
          ))}
        </div>
        <div className="sapio-worldwide sapio-worldwide-embedded">
          <div className="sapio-centered-heading">
            <h2>Universities worldwide</h2>
            <p>UK, USA, Canada, Germany, Australia - and growing.</p>
          </div>
          <div className="sapio-uni-marquee">
            {[...universityLogos, ...universityLogos].map((uni, index) => (
              <div key={`${uni.code}-${index}`} className="sapio-uni-card">
                <span>{uni.country}</span>
                <button type="button" onClick={goToExplore}>+</button>
                <strong>{uni.code}</strong>
                <small>{uni.name}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sapio-section sapio-visa-section sapio-snap-section">
        <div className="sapio-copy">
          <h2>Apply for your visa with confidence</h2>
          <h3>Stop guessing. Start knowing.</h3>
          <ul>
            <li><Check size={18} /> See your refusal risks first - we flag causes before the immigration authority does.</li>
            <li><Check size={18} /> Built on 1,000+ pages of visa guidelines - encoded into exact checks.</li>
            <li><Check size={18} /> Audited like a visa officer - the same forensic detail, so you submit with confidence.</li>
          </ul>
          <button className="btn-premium" onClick={goToMatching}>Try it now <ArrowRight size={17} /></button>
          <small>Built on official immigration rules. No guesswork.</small>
        </div>
        <div className="sapio-visa-card sapio-visa-card-legacy-hidden">
          <div className="sapio-visa-tabs">
            <span className="active"><Award size={18} />Eligibility</span>
            <span><BookOpen size={18} />Study</span>
            <span><WalletCards size={18} />Finance</span>
            <span><MessageSquare size={18} />English</span>
            <span><Info size={18} />Credibility</span>
          </div>
          <div className="sapio-visa-body">
            <div className="sapio-visa-topline">
              <strong>Precise eligibility audit</strong>
              <span className={visaReady ? "ready" : ""}>{visaReady ? "Ready" : "Not yet ready"}</span>
            </div>
            <div className="sapio-score-row">
              <div className="sapio-score-ring">
                <b>{visaReady ? 86 : 60}</b>
                <span>{visaReady ? "95%" : "86%"}</span>
              </div>
              <div className="sapio-score-bars">
                <label>Study <span>50/50</span></label>
                <div><i style={{ width: "100%" }} /></div>
                <label>English <span>10/10</span></label>
                <div><i style={{ width: "100%" }} /></div>
                <label>Finance <span className={visaReady ? "" : "danger"}>{visaReady ? "26/30" : "0/10"}</span></label>
                <div><i style={{ width: visaReady ? "86%" : "0%" }} /></div>
              </div>
            </div>
            <button type="button" className={`sapio-check-row ${visaReady ? "checked" : ""}`} onClick={() => setVisaReady(!visaReady)}>
              <span />
              <div>
                <strong>Simulate Maintenance Funds Check</strong>
                <p>Check to verify maintaining at least £18,707 for 28 consecutive days.</p>
              </div>
            </button>
            <strong>Next Steps checklist:</strong>
            <ul className={visaReady ? "sapio-ready-list" : ""}>
              <li><CircleDot size={14} /> Request a new statement from your bank.</li>
              <li><CircleDot size={14} /> Ensure bank holds at least £18,707.</li>
              <li><CircleDot size={14} /> Maintain funds for 28 days before applying.</li>
            </ul>
          </div>
          <div className="sapio-visa-footer"><Zap size={20} /> We calculate your exact standing against the points-based immigration system.</div>
        </div>
        <div className="sapio-visa-card">
          <div className="sapio-visa-tabs">
            {visaTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={activeVisaTab === tab.id ? "active" : ""}
                  onClick={() => setActiveVisaTab(tab.id)}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div key={activeVisaTab} className="sapio-visa-body sapio-visa-panel-animate">
            {renderVisaPanel()}
          </div>
          <div className="sapio-visa-footer"><Zap size={20} /> We calculate your exact standing against the points-based immigration system.</div>
        </div>
      </section>

      <section ref={testimonialSectionRef} className="sapio-section sapio-testimonials sapio-snap-section">
        <div className="sapio-centered-heading">
          <h2>Hear from Our Students</h2>
          <p>Real stories from students who found their path with SapioMatch AI</p>
        </div>
        <div
          className={`sapio-testimonial-stage ${testimonialPaused ? "is-paused" : ""} ${testimonialInView ? "is-visible" : ""}`}
          onMouseEnter={() => setTestimonialPaused(true)}
          onMouseLeave={() => setTestimonialPaused(false)}
          onFocus={() => setTestimonialPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setTestimonialPaused(false);
            }
          }}
        >
          {visibleTestimonials.map((item, index) => (
            <article key={`${item.name}-${activeTestimonial}-${index}`} className={`sapio-testimonial-card ${index === 0 ? "is-active" : ""}`}>
              <img src={item.image} alt={item.name} />
              <section>
              <h3>{item.name}</h3>
              <p className="sapio-meta">{item.meta}</p>
              <span className="sapio-quote-mark">“</span>
              <p className="sapio-testimonial-quote">{item.quote}</p>
              <div className="sapio-testimonial-actions">
                <span className="sapio-testimonial-tag">Verified student</span>
                <button type="button">Story</button>
              </div>
              </section>
            </article>
          ))}
        </div>
        <div className="sapio-carousel-dots">
          {testimonials.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={activeTestimonial === index ? "active" : ""}
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
