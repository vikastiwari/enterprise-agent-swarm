import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ children, className, style }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 100 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 100 });

  // Glare effect values
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [100, 0]), { damping: 20, stiffness: 100 });
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [100, 0]), { damping: 20, stiffness: 100 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
        transition: 'scale 0.2s ease',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1, transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Glare effect overlay */}
      {isHovered && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'inherit'
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
