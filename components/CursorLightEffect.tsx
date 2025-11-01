import React, { useEffect, useRef } from 'react';

const CursorLightEffect: React.FC = () => {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLightPosition = (event: MouseEvent) => {
      if (lightRef.current) {
        lightRef.current.style.setProperty('--cursor-x', `${event.clientX}px`);
        lightRef.current.style.setProperty('--cursor-y', `${event.clientY}px`);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      window.requestAnimationFrame(() => updateLightPosition(event));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 50,
    background: `radial-gradient(
      circle 500px at var(--cursor-x, -1000px) var(--cursor-y, -1000px),
      rgba(13, 16, 23, 0) 0%,
      rgba(13, 16, 23, 0.5) 50%,
      rgba(13, 16, 23, 0.90) 100%
    )`,
  };

  return <div ref={lightRef} style={style} />;
};

export default CursorLightEffect;
