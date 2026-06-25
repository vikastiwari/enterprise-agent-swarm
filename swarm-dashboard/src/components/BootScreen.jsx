import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const BootScreen = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "INITIALIZING AUTONOMOUS AGENT ORCHESTRATOR...";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 50);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-cyan)',
        fontFamily: 'monospace'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ marginBottom: '2rem' }}
      >
        <Terminal size={64} color="var(--accent-cyan)" />
      </motion.div>
      
      <div style={{ fontSize: '1.2rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{text}</span>
        <motion.span 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{ display: 'inline-block', width: '10px', height: '20px', background: 'var(--accent-cyan)' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
      >
        [SYSTEM: OK] [AUTH: READY] [TELEMETRY: ONLINE]
      </motion.div>
    </motion.div>
  );
};

export default BootScreen;
