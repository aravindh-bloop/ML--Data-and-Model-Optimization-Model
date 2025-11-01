import React, { useRef, useEffect } from 'react';
import AsteroidImage from './assets/AsteroidImage';

interface StarfieldProps {
  animationState: 'none' | 'diving' | 'exploding' | 'compressing' | 'imploding';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  originalRadius: number;
  color: string;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tail: { x: number; y: number }[];
  tailLength: number;
}

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  rotationSpeed: number;
  img: HTMLImageElement;
}

const Starfield: React.FC<StarfieldProps> = ({ animationState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationStateRef = useRef(animationState);
  const explosionParticlesRef = useRef<Particle[]>([]);
  const compressionParticlesRef = useRef<Particle[]>([]);
  const flashOpacityRef = useRef(0);
  const cometsRef = useRef<Comet[]>([]);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const asteroidImageRef = useRef<HTMLImageElement | null>(null);


  useEffect(() => {
    animationStateRef.current = animationState;
    if (animationState === 'exploding') {
      const particleCount = 200;
      const newParticles: Particle[] = [];
      const angleIncrement = (Math.PI * 2) / particleCount;
      for (let i = 0; i < particleCount; i++) {
        const angle = angleIncrement * i + (Math.random() - 0.5) * 0.1;
        const speed = Math.random() * 15 + 5;
        const radius = Math.random() * 3 + 1;
        newParticles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          radius: radius,
          originalRadius: radius,
          color: '255, 255, 255'
        });
      }
      explosionParticlesRef.current = newParticles;
    } else if (animationState === 'compressing') {
      const particleCount = 2500;
      const newParticles: Particle[] = [];
      const colors = ['#FFD700', '#C0C0C0']; // Gold and Silver
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 30 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const radius = Math.random() * 4 + 2; // Increased size range
        newParticles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          radius: radius,
          originalRadius: radius,
          color,
        });
      }
      compressionParticlesRef.current = newParticles;
      flashOpacityRef.current = 1.0;
    }
  }, [animationState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number, y: number, z: number, pz: number }[] = [];
    const numStars = 800;

    const setupStars = () => {
      stars.length = 0; 
      for (let i = 0; i < numStars; i++) {
        stars[i] = {
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          z: Math.random() * width,
          pz: 0
        };
        stars[i].pz = stars[i].z;
      }
    };
    setupStars();
    
    let cometTimeoutId: number;
    const cometsRefCurrent = cometsRef.current;

    const createComet = () => {
        if (cometsRefCurrent.length > 0) return; // Only one comet at a time for a cleaner look

        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const edge = Math.floor(Math.random() * 4);
        let x, y, angle;

        switch (edge) {
            case 0: // Top
                x = Math.random() * width - halfWidth;
                y = -halfHeight - 20;
                angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.1;
                break;
            case 1: // Right
                x = halfWidth + 20;
                y = Math.random() * height - halfHeight;
                angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.6;
                break;
            case 2: // Bottom
                x = Math.random() * width - halfWidth;
                y = halfHeight + 20;
                angle = Math.random() * Math.PI * 0.8 + Math.PI * 1.1;
                break;
            default: // Left
                x = -halfWidth - 20;
                y = Math.random() * height - halfHeight;
                angle = Math.random() * Math.PI * 0.8 - Math.PI * 0.4;
                break;
        }

        const speed = Math.random() * 4 + 6;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        cometsRefCurrent.push({
            x, y, vx, vy,
            radius: Math.random() * 1.5 + 2,
            tail: [],
            tailLength: 35,
        });
    };

    const scheduleNextComet = () => {
        clearTimeout(cometTimeoutId);
        const delay = Math.random() * 8000 + 4000; // every 4-12 seconds
        cometTimeoutId = window.setTimeout(() => {
            createComet();
            scheduleNextComet();
        }, delay);
    };

    const asteroidsRefCurrent = asteroidsRef.current;
    let asteroidTimeoutId: number;

    const createAsteroid = () => {
        if (!asteroidImageRef.current || asteroidsRefCurrent.length > 2) return; // Max 3 asteroids

        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const edge = Math.floor(Math.random() * 4);
        let x, y, angle;
        const size = Math.random() * 60 + 30; // 30px to 90px

        switch (edge) {
            case 0: x = Math.random() * width - halfWidth; y = -halfHeight - size; angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.1; break;
            case 1: x = halfWidth + size; y = Math.random() * height - halfHeight; angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.6; break;
            case 2: x = Math.random() * width - halfWidth; y = halfHeight + size; angle = Math.random() * Math.PI * 0.8 + Math.PI * 1.1; break;
            default: x = -halfWidth - size; y = Math.random() * height - halfHeight; angle = Math.random() * Math.PI * 0.8 - Math.PI * 0.4; break;
        }

        const speed = Math.random() * 1 + 0.5; // Slow moving
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const rotationSpeed = (Math.random() - 0.5) * 0.01;

        asteroidsRefCurrent.push({
            x, y, vx, vy, size,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed,
            img: asteroidImageRef.current,
        });
    };

    const scheduleNextAsteroid = () => {
        clearTimeout(asteroidTimeoutId);
        const delay = Math.random() * 10000 + 5000; // every 5-15 seconds
        asteroidTimeoutId = window.setTimeout(() => {
            createAsteroid();
            scheduleNextAsteroid();
        }, delay);
    };
    
    const img = new Image();
    img.onload = () => {
      asteroidImageRef.current = img;
      scheduleNextAsteroid();
    };
    img.src = AsteroidImage;

    scheduleNextComet();

    let animationFrameId: number;
    
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      const currentAnimationState = animationStateRef.current;
      const time = performance.now();

      if (currentAnimationState === 'compressing' || currentAnimationState === 'imploding') {
        if (currentAnimationState === 'compressing') {
            const glowMaxSize = Math.min(width, height) / 4;
            const glowRadius = glowMaxSize * (0.8 + 0.2 * Math.sin(time / 300));
            const glowOpacity = 0.5 + 0.3 * Math.sin(time / 200);

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
            gradient.addColorStop(0, `rgba(255, 223, 186, ${glowOpacity})`);
            gradient.addColorStop(0.5, `rgba(255, 215, 0, ${glowOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (flashOpacityRef.current > 0 && currentAnimationState === 'compressing') {
          ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacityRef.current})`;
          ctx.fillRect(-width / 2, -height / 2, width, height);
        }
        compressionParticlesRef.current.forEach(p => {
          if (p.alpha > 0) {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = p.alpha * (Math.random() * 0.6 + 0.4);
            
            const displayRadius = currentAnimationState === 'imploding' 
              ? p.radius 
              : p.originalRadius * (0.5 + Math.random());

            drawStar(p.x, p.y, 5, displayRadius, displayRadius / 2);
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      } else if (currentAnimationState === 'exploding') {
        explosionParticlesRef.current.forEach(p => {
          if (p.alpha > 0) {
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else {
        for (let i = 0; i < numStars; i++) {
          const star = stars[i];
          const k = width / star.z;
          const px = star.x * k;
          const py = star.y * k;
          const opacity = Math.max(0.1, 1 - star.z / width);

          if (currentAnimationState === 'diving') {
            const pz_k = width / star.pz;
            const prev_px = star.x * pz_k;
            const prev_py = star.y * pz_k;
            const size = Math.max(0.1, (1 - star.z / width) * 10);

            ctx.lineWidth = size;
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(prev_px, prev_py);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            const size = Math.max(1, (1 - star.z / width) * 7);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(px, py, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (currentAnimationState !== 'compressing' && currentAnimationState !== 'imploding' && currentAnimationState !== 'exploding') {
        cometsRefCurrent.forEach(comet => {
            if (comet.tail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(comet.tail[0].x, comet.tail[0].y);
                for (let j = 1; j < comet.tail.length - 1; j++) {
                    const p1 = comet.tail[j];
                    const p2 = comet.tail[j + 1];
                    const xc = (p1.x + p2.x) / 2;
                    const yc = (p1.y + p2.y) / 2;
                    ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
                }
                const first = comet.tail[0];
                const last = comet.tail[comet.tail.length - 1];
                const gradient = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(180, 220, 255, 1)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        asteroidsRefCurrent.forEach(asteroid => {
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.angle);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.drawImage(
                asteroid.img,
                -asteroid.size / 2,
                -asteroid.size / 2,
                asteroid.size,
                asteroid.size
            );
            ctx.restore();
        });
      }
      ctx.restore();
    };

    const update = () => {
      const currentAnimationState = animationStateRef.current;
      
      for (let i = cometsRefCurrent.length - 1; i >= 0; i--) {
        const comet = cometsRefCurrent[i];
        comet.tail.unshift({ x: comet.x, y: comet.y });
        if (comet.tail.length > comet.tailLength) {
            comet.tail.pop();
        }
        comet.x += comet.vx;
        comet.y += comet.vy;
        const margin = 100;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        if (comet.x < -halfWidth - margin || comet.x > halfWidth + margin || comet.y < -halfHeight - margin || comet.y > halfHeight + margin) {
            cometsRefCurrent.splice(i, 1);
        }
      }

      for (let i = asteroidsRefCurrent.length - 1; i >= 0; i--) {
        const asteroid = asteroidsRefCurrent[i];
        asteroid.x += asteroid.vx;
        asteroid.y += asteroid.vy;
        asteroid.angle += asteroid.rotationSpeed;

        const margin = asteroid.size;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        if (asteroid.x < -halfWidth - margin || asteroid.x > halfWidth + margin || asteroid.y < -halfHeight - margin || asteroid.y > halfHeight + margin) {
            asteroidsRefCurrent.splice(i, 1);
        }
      }

      if (currentAnimationState === 'compressing') {
        if (flashOpacityRef.current > 0) flashOpacityRef.current -= 0.04;
        compressionParticlesRef.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.99;
          p.vy *= 0.99;
        });
      } else if (currentAnimationState === 'imploding') {
          compressionParticlesRef.current.forEach(p => {
            const dx = -p.x;
            const dy = -p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
              p.x += dx * 0.05;
              p.y += dy * 0.05;
            } else {
              p.alpha = 0;
            }
            if (p.radius > 0.1) p.radius -= 0.03;
            if (p.alpha > 0.01) p.alpha -= 0.01; else p.alpha = 0;
          });
      } else if (currentAnimationState === 'exploding') {
          explosionParticlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.vy *= 0.99;
            p.alpha -= 0.04;
          });
      } else {
          const speed = currentAnimationState === 'diving' ? 80 : 1;
          for (let i = 0; i < numStars; i++) {
              stars[i].pz = stars[i].z;
              stars[i].z -= speed;
              if (stars[i].z <= 1) {
                  stars[i].x = Math.random() * width - width / 2;
                  stars[i].y = Math.random() * height - height / 2;
                  stars[i].z = width;
                  stars[i].pz = width;
              }
          }
      }
    };
    
    const animate = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        if(canvas) {
          canvas.width = width;
          canvas.height = height;
        }
        setupStars();
    }

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(cometTimeoutId);
      clearTimeout(asteroidTimeoutId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }} />;
};

export default Starfield;