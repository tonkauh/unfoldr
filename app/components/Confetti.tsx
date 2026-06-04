'use client';

import { useEffect, useRef } from 'react';

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Adaptive particle count based on device
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 80;

    const confetti: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      shape: 'square' | 'circle';
    }> = [];

    const colors = ['#F9A8D4', '#D4AF37', '#FFFDFB', '#E8E2D9', '#C5A028'];

    // Create initial burst with adaptive count
    for (let i = 0; i < particleCount; i++) {
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 8,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
      });
    }

    let animationId: number;
    let frameCount = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use frame skipping on mobile for better performance
      const skipFrames = isMobile ? 1 : 0;
      if (frameCount % (skipFrames + 1) === 0) {
        confetti.forEach((particle, index) => {
          particle.y += particle.vy;
          particle.x += particle.vx;
          particle.vy += 0.15;
          particle.vx *= 0.98;
          particle.rotation += particle.rotationSpeed;

          ctx.save();
          ctx.fillStyle = particle.color;
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          
          if (particle.shape === 'square') {
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          if (particle.y > canvas.height + 100) {
            confetti.splice(index, 1);
          }
        });
      }

      frameCount++;
      if (confetti.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    />
  );
}
