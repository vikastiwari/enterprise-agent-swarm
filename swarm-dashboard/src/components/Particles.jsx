import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Particles = () => {
  // Generate 40 random particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1, // 1px to 5px
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      duration: Math.random() * 20 + 15, // 15 to 35 seconds
      delay: Math.random() * -20, // start at random progress
      color: Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-purple)'
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0, // Behind everything
      overflow: 'hidden'
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: 0.3
          }}
          initial={{ 
            x: `${p.x}vw`, 
            y: `${p.y}vh` 
          }}
          animate={{ 
            x: [`${p.x}vw`, `${p.x + (Math.random() * 20 - 10)}vw`, `${p.x}vw`],
            y: [`${p.y}vh`, `${p.y + (Math.random() * 20 - 10)}vh`, `${p.y}vh`],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
