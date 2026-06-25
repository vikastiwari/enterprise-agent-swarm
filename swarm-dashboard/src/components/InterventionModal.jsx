import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Activity, Cpu, DollarSign } from 'lucide-react';
import { useSonicFeedback } from '../hooks/useSonicFeedback';

const InterventionModal = ({ isOpen, onApprove, onReject, channelName, stageName }) => {
  const { playClick, playSuccess, playError } = useSonicFeedback();

  const handleApprove = () => {
    playClick();
    setTimeout(() => playSuccess(), 200);
    onApprove();
  };

  const handleReject = () => {
    playClick();
    setTimeout(() => playError(), 200);
    onReject();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
              zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="hitl-modal-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(12, 14, 20, 0.98), rgba(20, 22, 32, 0.98))',
                border: '2px solid rgba(255, 0, 60, 0.6)',
                borderRadius: '20px',
                padding: '2.5rem',
                maxWidth: '520px',
                width: '90%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Corner scan line animation */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--accent-magenta), transparent)',
                animation: 'hitl-scanline 2s ease-in-out infinite'
              }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(255, 0, 60, 0.15)', border: '2px solid var(--accent-magenta)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(255, 0, 60, 0.3)'
                  }}
                >
                  <ShieldAlert size={26} color="var(--accent-magenta)" />
                </motion.div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                    Human Approval Required
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Pipeline paused — awaiting operator decision
                  </p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div style={{
                background: 'rgba(255, 0, 60, 0.05)', border: '1px solid rgba(255, 0, 60, 0.2)',
                borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-magenta)', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> INTERVENTION CONTEXT
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Channel</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{channelName || 'STEM Education'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Paused At</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>{stageName || 'Voice Synthesis'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GPU Resources</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu size={14} color="var(--accent-cyan)" /> <span style={{ color: 'var(--text-main)' }}>L4 × 2 (16.4 GB allocated)</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Est. Cost</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={14} color="#00e676" /> <span style={{ color: '#00e676', fontWeight: '600' }}>$0.42</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Agent reasoning */}
              <div style={{
                background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '12px 16px',
                marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-purple)',
                fontFamily: '"Fira Code", monospace', fontSize: '0.78rem', lineHeight: '1.6',
                color: 'var(--text-muted)'
              }}>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>SupervisorAgent:</span> "Script and animation stages completed successfully. Voice synthesis is ready to consume 34 audio chunks via GCP TTS. 
                Estimated additional cost: $0.008. Proceeding will commit GPU resources for ~3.2 seconds. <span style={{ color: '#ffea00' }}>Requesting operator approval to proceed.</span>"
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0, 230, 118, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleApprove}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.2), rgba(0, 200, 83, 0.1))',
                    border: '1.5px solid #00e676', color: '#00e676',
                    fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <CheckCircle2 size={20} /> Approve & Resume
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255, 0, 60, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReject}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.15), rgba(255, 0, 60, 0.05))',
                    border: '1.5px solid var(--accent-magenta)', color: 'var(--accent-magenta)',
                    fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <XCircle size={20} /> Reject & Abort
                </motion.button>
              </div>

              {/* Pulsing urgency indicator */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-magenta)' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Pipeline resources held — respond to release
                </span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InterventionModal;
