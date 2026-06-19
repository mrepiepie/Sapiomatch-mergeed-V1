import { useEffect, useRef } from "react";

const DEFAULT_CONFIG = {
  particles: {
    number: { value: 120 },
    color: { value: "#676fdf" },
    opacity: { value: 1, random: true, anim: { enable: true, speed: 1, opacity_min: 0 } },
    size: { value: 3, random: true },
    move: { enable: true, speed: 3.5, direction: "bottom", random: true, out_mode: "out" }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { repulse: { distance: 80 }, push: { particles_nb: 4 } }
  },
  retina_detect: true
};

function createParticle(config, width, height, fromTop = false) {
  const particles = config.particles || DEFAULT_CONFIG.particles;
  const sizeConfig = particles.size || DEFAULT_CONFIG.particles.size;
  const opacityConfig = particles.opacity || DEFAULT_CONFIG.particles.opacity;
  const moveConfig = particles.move || DEFAULT_CONFIG.particles.move;
  const speed = moveConfig.speed || 1;
  const size = sizeConfig.random ? Math.max(0.4, Math.random() * sizeConfig.value) : sizeConfig.value;
  const baseOpacity = opacityConfig.random ? Math.random() * opacityConfig.value : opacityConfig.value;
  const drift = moveConfig.random ? (Math.random() - 0.5) * speed : 0;

  return {
    x: Math.random() * width,
    y: fromTop ? -size - Math.random() * 40 : Math.random() * height,
    vx: drift,
    vy: speed * (0.55 + Math.random() * 0.7),
    size,
    opacity: Math.max(opacityConfig.anim?.opacity_min ?? 0, baseOpacity),
    opacityDirection: Math.random() > 0.5 ? 1 : -1
  };
}

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let animationFrame = 0;
    let particles = [];
    let config = DEFAULT_CONFIG;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = performance.now();
    let isDisposed = false;
    const mouse = { x: -9999, y: -9999 };

    const getContext = () => canvas.getContext("2d", { alpha: true });
    const ctx = getContext();
    if (!ctx) return undefined;

    const resize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      dpr = config.retina_detect ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = config.particles?.number?.value || DEFAULT_CONFIG.particles.number.value;
      particles = Array.from({ length: targetCount }, () => createParticle(config, width, height));
    };

    const addParticles = (count, x = Math.random() * width, y = Math.random() * height) => {
      for (let i = 0; i < count; i += 1) {
        const particle = createParticle(config, width, height);
        particle.x = x + (Math.random() - 0.5) * 28;
        particle.y = y + (Math.random() - 0.5) * 28;
        particles.push(particle);
      }
    };

    const handlePointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleClick = (event) => {
      const clickEvents = config.interactivity?.events?.onclick;
      if (!clickEvents?.enable || clickEvents.mode !== "push") return;
      const count = config.interactivity?.modes?.push?.particles_nb || 4;
      addParticles(count, event.clientX, event.clientY);
    };

    const draw = (now) => {
      if (isDisposed) return;

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const particlesConfig = config.particles || DEFAULT_CONFIG.particles;
      const color = particlesConfig.color?.value || "#676fdf";
      const opacityConfig = particlesConfig.opacity || DEFAULT_CONFIG.particles.opacity;
      const opacityAnim = opacityConfig.anim || {};
      const repulseConfig = config.interactivity?.modes?.repulse || {};
      const shouldRepulse = config.interactivity?.events?.onhover?.enable &&
        config.interactivity?.events?.onhover?.mode === "repulse";
      const repulseDistance = repulseConfig.distance || 80;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (shouldRepulse) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0 && distance < repulseDistance) {
            const force = (1 - distance / repulseDistance) * 5.5;
            particle.x += (dx / distance) * force;
            particle.y += (dy / distance) * force;
          }
        }

        particle.x += particle.vx * delta * 28;
        particle.y += particle.vy * delta * 28;

        if (opacityAnim.enable) {
          particle.opacity += particle.opacityDirection * (opacityAnim.speed || 1) * delta * 0.55;
          const minOpacity = opacityAnim.opacity_min ?? 0;
          if (particle.opacity <= minOpacity || particle.opacity >= opacityConfig.value) {
            particle.opacityDirection *= -1;
            particle.opacity = Math.max(minOpacity, Math.min(opacityConfig.value, particle.opacity));
          }
        }

        const margin = particle.size + 8;
        if (particle.y > height + margin || particle.x < -margin || particle.x > width + margin) {
          Object.assign(particle, createParticle(config, width, height, true));
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, particle.opacity));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(draw);
    };

    fetch("/particlesjs-config.json")
      .then((response) => response.json())
      .then((loadedConfig) => {
        if (isDisposed) return;
        config = loadedConfig;
        resize();
        animationFrame = requestAnimationFrame(draw);
      })
      .catch(() => {
        if (isDisposed) return;
        resize();
        animationFrame = requestAnimationFrame(draw);
      });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleClick);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-background"
      aria-hidden="true"
    />
  );
}
