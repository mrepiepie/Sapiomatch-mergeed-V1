'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Send, Sparkles, Target } from 'lucide-react';

const journeySteps = [
  {
    number: '01',
    title: 'Tell Us Your Goals',
    text: 'Upload your resume or chat with our humanized AI mascot. Share your career targets, budget, and learning format.',
    image: '/imports/guided-journey/step-goals.png',
    imageAlt: 'Student sharing career goals and uploading a resume to SapioMatch AI',
    icon: Target,
    accent: 'cyan'
  },
  {
    number: '02',
    title: 'AI Match Algorithm',
    text: 'Our proprietary engine cross-references your profile with our verified knowledge base of global universities and courses.',
    image: '/imports/guided-journey/step-ai-match.png',
    imageAlt: 'SapioMatch AI cross-referencing a student profile with global university data',
    icon: BrainCircuit,
    accent: 'purple'
  },
  {
    number: '03',
    title: 'Apply & Connect',
    text: 'Review matches side-by-side, check your match breakdown, generate your digital Student ID Passport, and apply directly.',
    image: '/imports/guided-journey/step-ai-apply-connect.png',
    imageAlt: 'University comparison and match breakdown interface for applying through SapioMatch',
    icon: Send,
    accent: 'blue'
  }
];

export default function GuidedJourneyTimeline() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(() => new Set());

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.stepIndex);
          setRevealedSteps((current) => {
            if (current.has(index)) return current;
            const next = new Set(current);
            next.add(index);
            return next;
          });
          stepObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.28, rootMargin: '0px 0px -14% 0px' }
    );

    sectionObserver.observe(section);
    stepRefs.current.forEach((step) => {
      if (step) stepObserver.observe(step);
    });

    return () => {
      sectionObserver.disconnect();
      stepObserver.disconnect();
    };
  }, []);

  const lineProgress = `${Math.min(100, (revealedSteps.size / journeySteps.length) * 100)}%`;

  return (
    <section
      ref={sectionRef}
      className={`sapio-journey-section${sectionVisible ? ' is-visible' : ''}`}
      style={{ '--journey-progress': lineProgress }}
      aria-labelledby="sapio-journey-title"
    >
      <div className="sapio-journey-ambient" aria-hidden="true" />

      <header className="sapio-journey-header">
        <span className="sapio-journey-kicker">
          <Sparkles size={15} aria-hidden="true" />
          Your guided journey
        </span>
        <h2 id="sapio-journey-title">
          How <span className="gradient-text">SapioMatch</span> Guides You
        </h2>
        <p>From first ambition to a confident application, every step stays clear, intelligent, and connected.</p>
      </header>

      <div className="sapio-journey-timeline">
        <div className="sapio-journey-rail" aria-hidden="true">
          <span />
        </div>

        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          const isRevealed = revealedSteps.has(index);

          return (
            <article
              key={step.number}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              data-step-index={index}
              className={`sapio-journey-step sapio-journey-step-${index % 2 === 0 ? 'forward' : 'reverse'} sapio-journey-accent-${step.accent}${isRevealed ? ' is-revealed' : ''}`}
            >
              <div className="sapio-journey-media">
                <div className="sapio-journey-image-glow" aria-hidden="true" />
                <img src={step.image} alt={step.imageAlt} loading="lazy" />
                <span className="sapio-journey-media-label">SapioMatch intelligence</span>
              </div>

              <div className="sapio-journey-node" aria-hidden="true">
                <span>{step.number}</span>
              </div>

              <div className="sapio-journey-copy">
                <div className="sapio-journey-icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <span className="sapio-journey-step-label">Step {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="sapio-journey-signal" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
