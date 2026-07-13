/**
 * Home.jsx — Learnova Antigravity Redesign (Replicating antigravity.google flow)
 *
 * Layout Flow:
 *   1. Hero Section (Centered headline, subtitle, stats)
 *   2. Video Section (Widescreen mock player with play overlay)
 *   3. Simple Typography Section (Spacious ink text with emerald highlight)
 *   4. "The Process: How Learnova Guides You" (3-step workflow grid)
 *   5. "Find Your University" Section (Interactive filtering category dashboard)
 *   6. Academic Advantage Pricing Section
 *
 * 100% Native CSS animations. Zero GSAP. Cream/Off-white background.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, ArrowRight, Shield, Award, BookOpen, Play, Search, GraduationCap, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../home-antigravity.css';

export default function Home({ setView }) {
  /* ── Hero word cycle ── */
  const words = ['AI', 'Apply', 'Live'];
  const [currentWord, setCurrentWord] = useState('AI');
  const [fadeState, setFadeState] = useState('fade-in');

  /* ── References for video scaling scroll animation ── */
  const videoSectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  /* ── Interactive University Mockup Dashboard State ── */
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [answers, setAnswers] = useState({ field: 'Technology & AI' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnova_questions');
      if (saved) {
        try {
          const qs = JSON.parse(saved);
          const ans = {};
          qs.forEach(q => {
            if (q.value) {
              ans[q.id] = q.value;
            }
          });
          setAnswers(ans);
        } catch (e) {
          console.error("Error loading saved answers on Home", e);
        }
      }
    }
  }, []);

  const getLiveMatchScore = (uniCategory) => {
    const field = (answers.field || "Technology & AI").toLowerCase();
    
    let isMatched = false;
    if (uniCategory === 'Engineering') {
      if (field.includes("tech") || field.includes("computer") || field.includes("ai") || field.includes("software") || field.includes("engineering")) {
        isMatched = true;
      }
    } else if (uniCategory === 'Business') {
      if (field.includes("business") || field.includes("management") || field.includes("mba") || field.includes("marketing") || field.includes("finance")) {
        isMatched = true;
      }
    } else if (uniCategory === 'Design') {
      if (field.includes("design") || field.includes("art") || field.includes("creative") || field.includes("media") || field.includes("architecture")) {
        isMatched = true;
      }
    } else if (uniCategory === 'Medicine') {
      if (field.includes("health") || field.includes("science") || field.includes("medicine") || field.includes("clinical") || field.includes("nursing")) {
        isMatched = true;
      }
    }

    const hash = uniCategory.length + field.length;
    if (isMatched) {
      const score = 92 + (hash % 7);
      return `${score}%`;
    } else {
      const score = 68 + (hash % 12);
      return `${score}%`;
    }
  };

  const galleryRef = useRef(null);
  const playBtnRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const customCursorRef = useRef(null);
  const devCursorRef = useRef(null);
  const devSliderRef = useRef(null);
  const devTrackRef = useRef(null);
  const [activeYoutubeId, setActiveYoutubeId] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [isTestimonialVisible, setIsTestimonialVisible] = useState(false);
  const testimonialSectionRef = useRef(null);
  const downloadCanvasRef = useRef(null);

  const mockUniversities = [
    { 
      name: 'Khalifa University', 
      category: 'Engineering', 
      location: 'Abu Dhabi, UAE', 
      match: '98%', 
      desc: 'Top-ranked UAE engineering school with advanced research facilities and world-class faculty.',
      image: '/imports/hologram_matching.png'
    },
    { 
      name: 'United Arab Emirates University (UAEU)', 
      category: 'Engineering', 
      location: 'Al Ain, UAE', 
      match: '95%', 
      desc: 'Large campus with broad engineering tracks and a strong alumni network.',
      image: '/imports/technology-isometric-ai-robot-brain.gif'
    },
    { 
      name: 'American University of Sharjah (AUS)', 
      category: 'Business', 
      location: 'Sharjah, UAE', 
      match: '94%', 
      desc: 'Renowned private institution with a highly international student body and AACSB accreditation.',
      image: '/imports/alternative_provision.png'
    },
    { 
      name: 'Zayed University', 
      category: 'Business', 
      location: 'Dubai, UAE', 
      match: '91%', 
      desc: 'Innovative modern campus focused on technology, entrepreneurship, and business excellence.',
      image: '/imports/online_learning.png'
    },
    { 
      name: 'Abu Dhabi University (ADU)', 
      category: 'Design', 
      location: 'Abu Dhabi, UAE', 
      match: '89%', 
      desc: 'Growing private university offering state-of-the-art design labs and collaborative studios.',
      image: '/imports/dashboard_mockup_wide.png'
    },
    { 
      name: 'University of Sharjah', 
      category: 'Medicine', 
      location: 'Sharjah, UAE', 
      match: '92%', 
      desc: 'Comprehensive medical studies with attached training hospital and research centers.',
      image: '/imports/tutoring_session.png'
    },
    { 
      name: 'Gulf Medical University', 
      category: 'Medicine', 
      location: 'Ajman, UAE', 
      match: '93%', 
      desc: 'Specialized healthcare education provider and research center affiliated with medical facilities.',
      image: '/imports/summer_school.png'
    },
    { 
      name: 'NYU Abu Dhabi', 
      category: 'Design', 
      location: 'Abu Dhabi, UAE', 
      match: '96%', 
      desc: 'Prestigious global liberal arts college with fully funded research and multicultural hub.',
      image: '/imports/students_learning.png'
    },
  ];

  const categories = ['All', 'Engineering', 'Business', 'Medicine', 'Design'];

  // Filter list based on selected category and search input
  const filteredUniversities = mockUniversities.filter(uni => {
    const matchesCategory = activeCategory === 'All' || uni.category === activeCategory;
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentWord(prev => {
          const i = words.indexOf(prev);
          return words[(i + 1) % words.length];
        });
        setFadeState('fade-in');
      }, 350);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  /* ── Ambient Dot-Matrix Ripple Background Canvas Animation ── */
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const spacing = 22;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const source1X = width * 0.25;
      const source1Y = height * 0.50;
      const source2X = width * 0.70;
      const source2Y = height * 0.35;

      time += 0.04;

      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const dx1 = x - source1X;
          const dy1 = y - source1Y;
          const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

          const dx2 = x - source2X;
          const dy2 = y - source2Y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const wave1 = Math.sin(dist1 / 120 - time);
          const wave2 = Math.sin(dist2 / 120 - time);
          const avgWave = (wave1 + wave2) / 2;

          const radius = Math.max(0.1, 1.6 + 1.8 * avgWave);
          const opacity = Math.min(1, Math.max(0, 0.14 + 0.22 * avgWave));

          if (opacity > 0) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 178, 169, ${opacity})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ── GSAP ScrollTrigger Video Scale & Play/Pause Animation ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set starting state in JS to prevent initial scale jumps
    gsap.set(videoContainerRef.current, {
      maxWidth: '1024px',
      width: '68%',
      borderRadius: '20px'
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(videoContainerRef.current,
        {
          maxWidth: '1024px',
          width: '68%',
          borderRadius: '20px',
          boxShadow: '0 16px 48px rgba(16, 185, 129, 0.08)'
        },
        {
          maxWidth: '1536px',
          width: '80%',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.04)',
          ease: 'none',
          scrollTrigger: {
            id: 'video-trigger',
            trigger: videoSectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            onEnter: () => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => console.log('Video play interrupted:', e));
              }
            },
            onLeave: () => {
              if (videoRef.current) {
                videoRef.current.pause();
              }
            },
            onEnterBack: () => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => console.log('Video play interrupted:', e));
              }
            },
            onLeaveBack: () => {
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const devSlides = [
    {
      role: 'Full-Stack Developer',
      image: '/imports/1783339123115.png',
      quote: 'Build production-ready matches with confidence. We designed Learnova to offer high-fidelity academic options using deep verification structures.',
      caseLink: '#questionnaire',
      youtubeId: 'UIZAiXYceBI'
    },
    {
      role: 'Enterprise Architect',
      image: '/imports/1783339152286.png',
      quote: 'Empowering enterprise builders with direct APIs. We created clean data channels to connect school registrars with verified candidate portfolios.',
      caseLink: '#explore',
      youtubeId: 'UIZAiXYceBI'
    },
    {
      role: 'Cybersecurity Developer',
      image: '/imports/1783335842063.png',
      quote: 'Securing user portfolios with enterprise-grade encrypted privacy protocols. We built robust security pipelines to protect student credentials.',
      caseLink: '#explore',
      youtubeId: 'UIZAiXYceBI'
    },
    {
      role: 'Veteran / AI Engineer',
      image: '/imports/whyhim.png',
      quote: 'Pioneering recommendation models with advanced neural network pipelines. We engineered AI matchmaking to identify ideal campus alignments.',
      caseLink: '#explore',
      youtubeId: 'UIZAiXYceBI'
    }
  ];
  const testimonialsData = [
    {
      name: "Umar Ibrohimov",
      meta: "Royal Holloway University (Foundation Year), Egham, UK - Tashkent, Uzbekistan",
      image: "/imports/student_umar.png",
      quote: "I've been stressing about my major for months. The personality test broke down my preferences and suggested degrees I actually liked. The PDF report was easier than trying to explain everything myself."
    },
    {
      name: "A. M.",
      meta: "Almaty, Kazakhstan",
      image: "/imports/student_am.png",
      quote: "The university comparator is great because I could put my top choices side-by-side to see the real difference in fees, rankings, and requirements."
    },
    {
      name: "B. K.",
      meta: "Dubai, United Arab Emirates",
      image: "/imports/student_bk.png",
      quote: "I thought this would be another search engine, but it felt like having a consultant working in one session. I got my course list and could focus on IELTS instead of digging through university pages."
    },
    {
      name: "Lina Foster",
      meta: "Manchester, United Kingdom",
      image: "/imports/student_sara.png",
      quote: "Learnova helped me see which universities fit both my budget and career plans. I stopped guessing and finally had a shortlist that made sense."
    },
    {
      name: "Daniel Reed",
      meta: "Toronto, Canada",
      image: "/imports/student_mateo.png",
      quote: "The match breakdown made the decision feel less overwhelming. I could compare outcomes, costs, and course structure without opening twenty tabs."
    },
    {
      name: "Maya Karim",
      meta: "Dubai, United Arab Emirates",
      image: "/imports/student_umar.png",
      quote: "I liked that it felt personal but still data-driven. The recommendations gave me options I had not considered and helped me apply with confidence."
    }
  ];

  /* ── Auto-advance Testimonials Carousel ── */
  useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex(prev => (prev + 1) % 6);
    }, 3720);
    return () => clearInterval(interval);
  }, [isTestimonialPaused]);

  /* ── IntersectionObserver for Testimonials Reveal ── */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsTestimonialVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsTestimonialVisible(true);
      }
    }, { threshold: 0.05 });
    
    if (testimonialSectionRef.current) {
      observer.observe(testimonialSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  /* ── Particles Canvas Effect for Find and Apply Section ── */
  useEffect(() => {
    const canvas = downloadCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth || 1200;
    let height = canvas.height = canvas.offsetHeight || 400;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 1200;
      height = canvas.height = canvas.offsetHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.15,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ── Sync Background Video play/pause with Modal state ── */
  useEffect(() => {
    if (activeYoutubeId) {
      if (videoRef.current) videoRef.current.pause();
    } else {
      const trigger = ScrollTrigger.getById('video-trigger');
      if (trigger && trigger.isActive) {
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log('Video play interrupted:', e));
        }
      }
    }
  }, [activeYoutubeId]);

  /* ── Typing effect for Developer slider slide titles ── */
  useEffect(() => {
    const fullText = devSlides[activeSlideIndex].role;
    setTypedText('');
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.substring(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [activeSlideIndex]);


  /* ── GSAP Accordion Slider Hover Expand Animation ── */
  useEffect(() => {
    if (!galleryRef.current) return;
    const cards = galleryRef.current.querySelectorAll('.ag-accordion-card');
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      const isActive = activeIndex === index;
      const isAnyActive = activeIndex !== null;

      // Calculate flex width targets
      let targetFlex = 1;
      if (isAnyActive) {
        targetFlex = isActive ? 6.5 : 0.4;
      }

      // Smooth custom spring transition logic via GSAP
      gsap.to(card, {
        flex: targetFlex,
        borderColor: isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isActive ? '0 16px 36px rgba(16, 185, 129, 0.12)' : 'none',
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto"
      });

      // Background visual zoom/fade
      const bg = card.querySelector('.ag-accordion-bg');
      if (bg) {
        gsap.to(bg, {
          scale: isActive ? 1.05 : 1,
          opacity: isActive ? 0.58 : (isAnyActive ? 0.22 : 0.38),
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

      // Collapsed text labels fade & slide down out of view
      const collapsedTitle = card.querySelector('.ag-accordion-collapsed-title');
      if (collapsedTitle) {
        // Hide all collapsed titles when any card is active/hovered, show them all when none is active
        const targetOpacity = isAnyActive ? 0 : 1;
        gsap.to(collapsedTitle, {
          opacity: targetOpacity,
          yPercent: isActive ? -70 : -50,
          duration: isActive ? 0.35 : 0.45,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

      // Expanded horizontal text slide-ups
      const expandedContent = card.querySelector('.ag-accordion-expanded-content');
      if (expandedContent) {
        // Toggle interactivity pointer events
        expandedContent.style.pointerEvents = isActive ? 'auto' : 'none';

        gsap.to(expandedContent, {
          opacity: isActive ? 1 : 0,
          duration: isActive ? 0.45 : 0.25,
          delay: isActive ? 0.1 : 0,
          overwrite: "auto"
        });

        const title = expandedContent.querySelector('.ag-accordion-title');
        const match = expandedContent.querySelector('.ag-accordion-match');
        const desc = expandedContent.querySelector('.ag-accordion-desc');
        const footer = expandedContent.querySelector('.ag-accordion-footer');

        if (isActive) {
          if (title) gsap.to(title, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          if (match) gsap.to(match, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          if (desc) gsap.to(desc, { y: 0, opacity: 1, duration: 0.5, delay: 0.04, ease: "power2.out", overwrite: "auto" });
          if (footer) gsap.to(footer, { y: 0, opacity: 1, duration: 0.5, delay: 0.08, ease: "power2.out", overwrite: "auto" });
        } else {
          // Instantly reset position offsets
          if (title) gsap.set(title, { y: 12, opacity: 0 });
          if (match) gsap.set(match, { y: 12, opacity: 0 });
          if (desc) gsap.set(desc, { y: 16, opacity: 0 });
          if (footer) gsap.set(footer, { y: 20, opacity: 0 });
        }
      }
    });
  }, [activeIndex, filteredUniversities]);

  /* ── Custom Cursor Follow for Video Container ── */
  const handleVideoMouseMove = (e) => {
    if (!customCursorRef.current || !videoContainerRef.current) return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(customCursorRef.current, {
      x: x,
      y: y,
      duration: 0.1,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleVideoMouseEnter = () => {
    if (!customCursorRef.current) return;
    gsap.to(customCursorRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleVideoMouseLeave = () => {
    if (!customCursorRef.current) return;
    gsap.to(customCursorRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  /* ── Custom Cursor Follow for Developer Slider ── */
  const handleDevMouseMove = (e) => {
    if (!devCursorRef.current || !devSliderRef.current) return;
    const rect = devSliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(devCursorRef.current, {
      x: x,
      y: y,
      duration: 0.1,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleDevMouseEnter = () => {
    if (!devCursorRef.current) return;
    gsap.to(devCursorRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleDevMouseLeave = () => {
    if (!devCursorRef.current) return;
    gsap.to(devCursorRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  /* ── Drag to Slide Carousel Interaction ── */
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentDeltaXRef = useRef(0);

  const handleDragStart = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    currentDeltaXRef.current = 0;
    
    if (devTrackRef.current) {
      devTrackRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (e) => {
    // Custom cursor follow
    handleDevMouseMove(e);

    if (!isDraggingRef.current) return;
    const x = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const deltaX = x - startXRef.current;
    currentDeltaXRef.current = deltaX;

    if (devTrackRef.current && devSliderRef.current) {
      const containerWidth = devSliderRef.current.getBoundingClientRect().width;
      const slideWidth = containerWidth * 0.58;
      const gap = 24;
      const baseTranslate = -activeSlideIndex * (slideWidth + gap);
      
      // Add resistance at boundaries
      let finalTranslate = baseTranslate + deltaX;
      const maxTranslate = 0;
      const minTranslate = -(devSlides.length - 1) * (slideWidth + gap);
      if (finalTranslate > maxTranslate) {
        finalTranslate = maxTranslate + (finalTranslate - maxTranslate) * 0.35;
      } else if (finalTranslate < minTranslate) {
        finalTranslate = minTranslate + (finalTranslate - minTranslate) * 0.35;
      }

      devTrackRef.current.style.transform = `translate3d(${finalTranslate}px, 0px, 0px)`;
    }
  };

  const handleDragEnd = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const deltaX = currentDeltaXRef.current;
    
    if (devTrackRef.current) {
      devTrackRef.current.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.2, 1)';
    }

    const threshold = devSliderRef.current ? devSliderRef.current.getBoundingClientRect().width * 0.12 : 100;

    if (deltaX < -threshold && activeSlideIndex < devSlides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
    } else if (deltaX > threshold && activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    } else {
      // Force React state re-sync to reset translation
      if (devTrackRef.current && devSliderRef.current) {
        const containerWidth = devSliderRef.current.getBoundingClientRect().width;
        const slideWidth = containerWidth * 0.58;
        const gap = 24;
        const baseTranslate = -activeSlideIndex * (slideWidth + gap);
        devTrackRef.current.style.transform = `translate3d(${baseTranslate}px, 0px, 0px)`;
      }
    }
  };



  return (
    <div className="ag-home">

      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION — Centered, Cream Background
      ════════════════════════════════════════════════════════ */}
      <section className="ag-hero" aria-label="Hero">
        <canvas ref={heroCanvasRef} className="ag-hero-canvas" aria-hidden="true" />
        <div className="ag-hero-ambient" aria-hidden="true" />
        <div className="ag-hero-center">
          
          <div className="ag-badge">
            <Sparkles size={13} aria-hidden="true" />
            Next-Gen AI Recommendation System
          </div>

          <h1 className="ag-h1">
            Find Your Best-Fit<br />
            Program with{' '}
            <span className="ag-brand">Learnova</span>{' '}
            <span className={`learnova-morph-word ${fadeState}`} aria-live="polite">
              {currentWord}
            </span>
          </h1>

          <p className="ag-hero-sub">
            An intelligent advisor analyzing your career goals, academic
            background, and budget — connecting you with the world&apos;s best
            institutions.
          </p>

          <div className="ag-hero-actions">
            <button
              id="hero-cta-match"
              className="ag-btn-primary"
              onClick={() => {
                localStorage.setItem('learnova_auth_redirect', 'questionnaire');
                setView('questionnaire');
              }}
            >
              Start AI Matching
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              id="hero-cta-explore"
              className="ag-btn-ghost"
              onClick={() => setView('public-explore')}
            >
              Explore Institutions
            </button>
          </div>

          {/* Stats Bar */}
          <div className="ag-hero-stats" aria-label="Key platform stats">
            <div className="ag-stat-card">
              <div className="ag-stat-icon" aria-hidden="true">
                <Brain size={20} />
              </div>
              <div>
                <p className="ag-stat-label">Knowledge Database</p>
                <p className="ag-stat-desc">Tailored institutional data</p>
              </div>
            </div>

            <div className="ag-stat-card">
              <div className="ag-stat-icon orange" aria-hidden="true">
                <Award size={20} />
              </div>
              <div>
                <p className="ag-stat-label">94% Match Score</p>
                <p className="ag-stat-desc">High accuracy AI mapping</p>
              </div>
            </div>

            <div className="ag-stat-card">
              <div className="ag-stat-icon" aria-hidden="true">
                <Shield size={20} />
              </div>
              <div>
                <p className="ag-stat-label">Secure Entitlement</p>
                <p className="ag-stat-desc">Safe credentials &amp; library</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. VIDEO SECTION — Replicating antigravity.google video row
      ════════════════════════════════════════════════════════ */}


      <section ref={videoSectionRef} className="ag-video-section ag-rise" aria-label="Video Demonstration">
        <div 
          ref={videoContainerRef}
          className="ag-video-container"
          onMouseMove={handleVideoMouseMove}
          onMouseEnter={handleVideoMouseEnter}
          onMouseLeave={handleVideoMouseLeave}
          onClick={() => setActiveYoutubeId('UIZAiXYceBI')}
        >
          {/* Custom Cursor */}
          <div ref={customCursorRef} className="ag-custom-cursor" aria-hidden="true">
            <div className="ag-custom-cursor-content">
              <Play size={12} fill="currentColor" style={{ marginRight: '6px' }} />
              <span>Play intro</span>
            </div>
          </div>

          {/* Background Widescreen Video Loop */}
          <video 
            ref={videoRef}
            loop 
            muted 
            playsInline 
            className="ag-video-preview"
          >
            <source src="/imports/Video_Project__1___1_.mp4" type="video/mp4" />
          </video>
          
          <div className="ag-video-overlay" />
          
          {/* Bottom Right Control Play Button */}
          <div className="ag-video-control-btn" aria-hidden="true">
            <Play size={14} fill="currentColor" />
          </div>
          
          <div className="ag-video-caption">
            Learnova AI: Finding your path in 180 seconds
          </div>
        </div>

        {/* Video Dialog/Modal Popup */}
        {activeYoutubeId && (
          <div className="ag-video-modal-overlay" onClick={() => setActiveYoutubeId(null)}>
            <div className="ag-video-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="ag-video-modal-close" onClick={() => setActiveYoutubeId(null)} aria-label="Close video player">
                <X size={20} />
              </button>
              <div className="ag-video-modal-body">
                <iframe
                  src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                  title="Learnova AI Intro Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Video Walkthrough Feature List */}
        <div className="ag-video-features" aria-label="Video Walkthrough Features">
          <div className="ag-video-feature-item">
            <Sparkles size={15} />
            <span>180-Second Interactive Tour</span>
          </div>
          <div className="ag-video-feature-item">
            <Brain size={15} />
            <span>AI Match Diagnostics Preview</span>
          </div>
          <div className="ag-video-feature-item">
            <Award size={15} />
            <span>Direct Admissions Expert Walkthrough</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. SIMPLE TYPOGRAPHIC TEXT SECTION — clean & minimal
      ════════════════════════════════════════════════════════ */}


      <section className="ag-text-section ag-rise" aria-label="Philosophy">
        <div className="ag-text-display">
          We believe matching with a university shouldn&apos;t be about luck. It should be guided by your <span>raw potential</span>, your <span>career targets</span>, and <span>verified academic insights</span>.
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. THE PROCESS — 3-step grid
      ════════════════════════════════════════════════════════ */}


      <section className="ag-workflow ag-rise" aria-labelledby="workflow-heading">
        <div className="ag-workflow-inner">
          <span className="ag-eyebrow">The process</span>
          <h2 id="workflow-heading" className="ag-h2">
            How <span className="ag-em">Learnova</span> Guides You
          </h2>

          <div className="ag-steps" role="list">

            <div className="ag-step ag-rise" role="listitem">
              <p className="ag-step-num" aria-hidden="true">01</p>
              <div className="ag-step-icon" aria-hidden="true">
                <BookOpen size={20} />
              </div>
              <h3 className="ag-step-h3">Tell Us Your Goal</h3>
              <p className="ag-step-p">
                Upload your resume or chat with our AI advisor Aria. Share your
                career targets, budget, and preferred learning format.
              </p>
              <img
                src="/imports/guide_step1_wide.png"
                alt="Tell Us Your Goal step"
                className="ag-step-img"
                loading="lazy"
              />
            </div>

            <div className="ag-step ag-rise" role="listitem">
              <p className="ag-step-num" aria-hidden="true">02</p>
              <div className="ag-step-icon" aria-hidden="true">
                <Brain size={20} />
              </div>
              <h3 className="ag-step-h3">AI Match Algorithm</h3>
              <p className="ag-step-p">
                Our proprietary engine cross-references your profile with a
                verified knowledge base of global universities and courses.
              </p>
              <img
                src="/imports/guide_step2_wide.png"
                alt="AI Match Algorithm step"
                className="ag-step-img"
                loading="lazy"
              />
            </div>

            <div className="ag-step ag-rise" role="listitem">
              <p className="ag-step-num" aria-hidden="true">03</p>
              <div className="ag-step-icon" aria-hidden="true">
                <Award size={20} />
              </div>
              <h3 className="ag-step-h3">Apply &amp; Connect</h3>
              <p className="ag-step-p">
                Review matches side-by-side, generate your digital Student ID
                Passport, and apply directly to partner institutions.
              </p>
              <img
                src="/imports/guide_step3_wide.png"
                alt="Apply and Connect step"
                className="ag-step-img"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. FIND YOUR UNIVERSITY SECTION — Interactive selector mockup
      ════════════════════════════════════════════════════════ */}


      <section className="ag-find-section ag-rise" aria-labelledby="find-heading">
        <div className="ag-find-hdr">
          <span className="ag-eyebrow">Explore</span>
          <h2 id="find-heading" className="ag-h2" style={{ margin: '0 auto', textAlign: 'center', marginBottom: '14px' }}>
            Find Your University
          </h2>
          <p style={{ color: '#4b5563', fontSize: '15px' }}>
            Filter by academic stream to preview partner institutions and match percentages.
          </p>
        </div>

        <div className="ag-search-mockup">
          {/* Search Box */}
          <div className="ag-search-input-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by institution name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Selector Pills */}
          <div className="ag-pills" role="tablist" aria-label="University Categories">
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`ag-pill ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sliding Window Gallery (Horizontal Accordion) */}
          <div ref={galleryRef} className="ag-uni-accordion-gallery" onMouseLeave={() => setActiveIndex(null)}>
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni, i) => (
                <div 
                  key={i} 
                  className="ag-accordion-card"
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {/* Background Image */}
                  <img src={uni.image} alt={uni.name} className="ag-accordion-bg" />
                  <div className="ag-accordion-overlay" />
                  
                  {/* Collapsed State: Vertically Rotated Name */}
                  <div className="ag-accordion-collapsed-title">
                    <span>{uni.name}</span>
                  </div>

                  {/* Expanded State: Horizontal Content Info */}
                  <div className="ag-accordion-expanded-content">
                    <div className="ag-accordion-hdr">
                      <h3 className="ag-accordion-title">{uni.name}</h3>
                      <div className="ag-accordion-match">
                        <GraduationCap size={13} />
                        <span>{getLiveMatchScore(uni.category)} Match</span>
                      </div>
                    </div>
                    <p className="ag-accordion-desc">{uni.desc}</p>
                    <div className="ag-accordion-footer">
                      <span>📍 {uni.location}</span>
                      <span>•</span>
                      <span>🎓 {uni.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ width: '100%', padding: '40px', color: '#6b7280', fontSize: '14px', background: '#ffffff', borderRadius: '12px', border: '1px dashed rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                No universities matched your search criteria. Try a different query.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. BENTO GRID SECTION — Programs Explorer
      ════════════════════════════════════════════════════════ */}


      <section className="ag-bento-section ag-rise" aria-labelledby="bento-heading">
        <div className="ag-pricing-inner">

          <div className="ag-pricing-hdr">
            <span className="ag-eyebrow">Programs</span>
            <h2 id="bento-heading" className="ag-h2" style={{ textAlign: 'center', maxWidth: 'none', color: '#4b5563' }}>
              <span className="ag-h2-outline">Explore Diverse</span> <span className="ag-em">Academic Streams</span>
            </h2>
            <p>
              Compare core paths from Computer Science to Chartered Accountancy and discover programs tailored to your credentials.
            </p>
          </div>

          <div className="ag-bento-grid">

            {/* CS Card */}
            <div className="ag-bento-card cs-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">CS</span>
                <h3 className="ag-bento-title">Computer Science &amp; AI</h3>
                <p className="ag-bento-desc">Software engineering, machine learning paths, data structures, and algorithmic logic.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-code-preview">
                  <div className="code-line"><span className="keyword">import</span> {'{ AI }'} <span className="keyword">from</span> <span className="string">"learnova"</span>;</div>
                  <div className="code-line"><span className="function">matchProfile</span>(student.resume);</div>
                  <div className="code-line"><span className="comment">// 94% accuracy score achieved</span></div>
                </div>
              </div>
            </div>

            {/* BA Card */}
            <div className="ag-bento-card ba-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">BA</span>
                <h3 className="ag-bento-title">Business Administration</h3>
                <p className="ag-bento-desc">Global entrepreneurship, corporate finance strategy, marketing analytics, and operations.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-tablet-preview">
                  <div className="tablet-frame">
                    <img src="/imports/guide_step2_wide.png" alt="BA Dashboard Mockup" />
                  </div>
                </div>
              </div>
            </div>

            {/* CA Card */}
            <div className="ag-bento-card ca-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">CA</span>
                <h3 className="ag-bento-title">Chartered Accountancy</h3>
                <p className="ag-bento-desc">Corporate tax legislation, financial audits, reporting guidelines, and investment audits.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-stats-preview">
                  <div className="stat-row"><span>Corporate Audit</span><span className="stat-val green">Accredited</span></div>
                  <div className="stat-row"><span>IFRS Standards</span><span className="stat-val">Global</span></div>
                  <div className="stat-row"><span>Tax Diagnostics</span><span className="stat-val green">Passed</span></div>
                </div>
              </div>
            </div>

            {/* Engineering Card */}
            <div className="ag-bento-card eng-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">ENG</span>
                <h3 className="ag-bento-title">Engineering &amp; Technology</h3>
                <p className="ag-bento-desc">Robotics systems, mechanical design, structural physics, and nanotechnology research.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-blueprint-preview">
                  <div className="blueprint-circle" />
                  <div className="blueprint-line x" />
                  <div className="blueprint-line y" />
                </div>
              </div>
            </div>

            {/* Medicine Card */}
            <div className="ag-bento-card med-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">MED</span>
                <h3 className="ag-bento-title">Medicine &amp; Health</h3>
                <p className="ag-bento-desc">Pre-med biology pathways, molecular research, biochemistry labs, and clinical genetics.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-lab-preview">
                  <div className="pulse-wave" />
                  <div className="pulse-rate">98 bpm</div>
                </div>
              </div>
            </div>

            {/* Design Card */}
            <div className="ag-bento-card design-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">DESIGN</span>
                <h3 className="ag-bento-title">Creative Design &amp; UX</h3>
                <p className="ag-bento-desc">Interactive interface design, portfolio curation, game design, and digital creative direction.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-palette-preview">
                  <div className="palette-color color1" />
                  <div className="palette-color color2" />
                  <div className="palette-color color3" />
                  <div className="palette-color color4" />
                </div>
              </div>
            </div>

            {/* Law Card */}
            <div className="ag-bento-card law-card">
              <div className="ag-bento-info">
                <span className="ag-bento-tag">LAW</span>
                <h3 className="ag-bento-title">Law &amp; Cyber Policy</h3>
                <p className="ag-bento-desc">International trade laws, digital governance, corporate ethics, and public advocacy.</p>
              </div>
              <div className="ag-bento-visual">
                <div className="ag-bento-law-preview">
                  <div className="law-badge">Juris Doctor</div>
                  <div className="law-badge">Corporate Ethics</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. MEET THE DEVELOPERS SECTION — Slider with custom cursor
      ════════════════════════════════════════════════════════ */}
      <section className="ag-use-case-section ag-rise" aria-labelledby="dev-heading">
        <div className="ag-use-case-inner">
          <div className="ag-use-case-header">
            <div className="ag-use-case-header-left">
              <h2 id="dev-heading" className="ag-h2" style={{ margin: 0, fontWeight: 800 }}>
                <span style={{ color: '#8a8a8a', WebkitTextStroke: 'none', textStroke: 'none' }}>Meet the developers</span><br />
                <span style={{ color: '#000000' }}>of the new agent-first era</span>
              </h2>
            </div>
            <div className="ag-use-case-header-right">
              <p className="ag-use-case-p">
                Learnova is built for user trust, whether you&apos;re a professional developer working in a large enterprise codebase, a hobbyist vibe-coding in their spare time, or anyone in between.
              </p>
            </div>
          </div>

          <div className="ag-use-case-body">
            {/* Horizontal Slider Area */}
            <div 
              ref={devSliderRef}
              className="ag-dev-slider-viewport"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={(e) => { handleDevMouseLeave(); handleDragEnd(e); }}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseEnter={handleDevMouseEnter}
            >
              {/* Custom Cursor */}
              <div ref={devCursorRef} className="ag-custom-cursor" aria-hidden="true">
                <div className="ag-custom-cursor-content">
                  <Play size={12} fill="currentColor" style={{ marginRight: '6px' }} />
                  <span>Watch case</span>
                </div>
              </div>

              {/* Slider Track */}
              <div 
                ref={devTrackRef}
                className="ag-dev-slider-track"
                style={{ transform: `translate3d(calc(-${activeSlideIndex * 58}% - ${activeSlideIndex * 24}px), 0px, 0px)` }}
              >
                {devSlides.map((slide, i) => {
                  const isActive = activeSlideIndex === i;
                  return (
                    <div 
                      key={i} 
                      className={`ag-dev-slide ${isActive ? 'is-active' : 'is-inactive'}`}
                      onClick={(e) => {
                        if (Math.abs(currentDeltaXRef.current) > 10) return;
                        if (isActive) {
                          setActiveYoutubeId(slide.youtubeId);
                        } else {
                          e.stopPropagation();
                          setActiveSlideIndex(i);
                        }
                      }}
                    >
                      <img className="ag-dev-slide-img" src={slide.image} alt={slide.role} />
                      <div className="ag-dev-slide-overlay" />
                      
                      {/* Card Role Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 10,
                        background: 'rgba(11, 15, 25, 0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '5px 10px',
                        borderRadius: '100px',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        pointerEvents: 'none'
                      }}>
                        {slide.role}
                      </div>
                      
                      {/* Typed Header on Slide */}
                      {isActive && (
                        <div className="ag-dev-slide-typed-header">
                          <span className="ag-typed-content">
                            {typedText}
                            <span className="ag-typing-cursor">|</span>
                          </span>
                        </div>
                      )}

                      {/* Pill Button Overlay (Inactive only) */}
                      {!isActive && (
                        <div className="ag-dev-slide-watch-pill">
                          <Play size={10} fill="currentColor" style={{ marginRight: '6px' }} />
                          <span>Watch case</span>
                        </div>
                      )}

                      {/* Small Circular Play Button (Active only) */}
                      {isActive && (
                        <div className="ag-dev-slide-play-icon" aria-hidden="true">
                          <Play size={12} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Copy Details and Arrow Controls below Card 1 */}
            <div className="ag-dev-slider-meta-row">
              <div className="ag-dev-slider-meta-left">
                <strong className="ag-dev-slider-title">{devSlides[activeSlideIndex].role}</strong>
                <p className="ag-dev-slider-body">{devSlides[activeSlideIndex].quote}</p>
                <a className="ag-dev-slider-link" href={devSlides[activeSlideIndex].caseLink}>
                  View case <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                </a>
              </div>

              <div className="ag-dev-slider-meta-right">
                <div className="ag-dev-slider-controls">
                  <button 
                    className="ag-slider-arrow-btn" 
                    onClick={(e) => { e.stopPropagation(); if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1); }}
                    disabled={activeSlideIndex === 0}
                    aria-label="Previous slide"
                  >
                    ←
                  </button>
                  <button 
                    className="ag-slider-arrow-btn" 
                    onClick={(e) => { e.stopPropagation(); if (activeSlideIndex < devSlides.length - 1) setActiveSlideIndex(activeSlideIndex + 1); }}
                    disabled={activeSlideIndex === devSlides.length - 1}
                    aria-label="Next slide"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section: Hear from Our Students ── */}
      <section ref={testimonialSectionRef} className="learnova-section learnova-testimonials learnova-snap-section" aria-labelledby="testimonial-heading">
        <div className="learnova-centered-heading">
          <h2 id="testimonial-heading">Hear from Our Students</h2>
          <p>Real stories from students who found their path with Learnova AI</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveTestimonialIndex(prev => (prev - 1 + 6) % 6)}
            style={{
              position: 'absolute',
              left: '-60px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            className={`learnova-testimonial-stage ${isTestimonialPaused ? 'is-paused' : ''} ${isTestimonialVisible ? 'is-visible' : ''}`}
            onMouseEnter={() => setIsTestimonialPaused(true)}
            onMouseLeave={() => setIsTestimonialPaused(false)}
            onFocus={() => setIsTestimonialPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsTestimonialPaused(false);
              }
            }}
          >
            {[
              testimonialsData[activeTestimonialIndex],
              testimonialsData[(activeTestimonialIndex + 1) % 6],
              testimonialsData[(activeTestimonialIndex + 2) % 6]
            ].map((item, t) => (
              <article 
                key={`${item.name}-${activeTestimonialIndex}-${t}`}
                className={`learnova-testimonial-card ${t === 0 ? 'is-active' : ''}`}
              >
                <img src={item.image} alt={item.name} />
                <section>
                  <h3>{item.name}</h3>
                  <p className="learnova-meta">{item.meta}</p>
                  <span className="learnova-quote-mark">“</span>
                  <p className="learnova-testimonial-quote">{item.quote}</p>
                  <div className="learnova-testimonial-actions">
                    <span className="learnova-testimonial-tag">Verified student</span>
                    <button type="button">Story</button>
                  </div>
                </section>
              </article>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveTestimonialIndex(prev => (prev + 1) % 6)}
            style={{
              position: 'absolute',
              right: '-60px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="learnova-carousel-dots">
          {testimonialsData.map((_, t) => (
            <button 
              key={t}
              type="button" 
              className={activeTestimonialIndex === t ? 'active' : ''}
              aria-label={`Show testimonial ${t + 1}`}
              onClick={() => setActiveTestimonialIndex(t)}
            />
          ))}
        </div>
      </section>

      {/* ── Find and Apply Section (Antigravity download-style) ── */}
      <section className="ag-download-section-container">
        <div className="ag-download-section">
          <div className="ag-download-section-backdrop">
            <canvas ref={downloadCanvasRef} className="ag-download-canvas" />
          </div>
          
          <div className="ag-download-section-content">
            <h2 className="ag-download-header">
              <span className="ag-download-typed-content">
                Find and apply with Learnova AI
                <span className="ag-download-cursor" aria-hidden="true">|</span>
              </span>
            </h2>
            <div className="ag-download-section-cta">
              <button 
                type="button" 
                className="ag-btn-primary-inverse"
                onClick={() => setView('questionnaire')}
              >
                Start AI Matching
              </button>
              <button 
                type="button" 
                className="ag-btn-secondary-inverse"
                onClick={() => setView('contact')}
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Minimalist Premium Footer Section ── */}
      <footer className="ag-footer">
        <div className="ag-footer-container">
          <div className="ag-footer-grid">
            <div className="ag-footer-brand-col">
              <div className="ag-footer-logo-row">
                <Sparkles size={16} className="ag-footer-sparkle" />
                <span className="ag-footer-brand-name">Learnova AI</span>
              </div>
              <p className="ag-footer-brand-desc">
                Transforming academic search into structured, personalized fits for ambitious candidates.
              </p>
            </div>
            
            <div className="ag-footer-nav-col">
              <strong>Product</strong>
              <a href="#questionnaire" onClick={(e) => { e.preventDefault(); setView('questionnaire'); }}>AI Matcher</a>
              <a href="#explore" onClick={(e) => { e.preventDefault(); setView('public-explore'); }}>Explore Universities</a>
            </div>

            <div className="ag-footer-nav-col">
              <strong>Company</strong>
              <a href="#about" onClick={(e) => { e.preventDefault(); setView('about'); }}>About Us</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); setView('contact'); }}>Contact Us</a>
            </div>
          </div>

          <div className="ag-footer-bottom">
            <span>{"\u00A9"} 2026 Learnova AI. All rights reserved.</span>
            <div className="ag-footer-bottom-links">
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
