import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle2, ChevronRight, X, Cpu, Server, Activity } from 'lucide-react';

const SetupWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
      setTimeout(() => {
        setDeployed(false);
        setStep(1);
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.95, opacity: 0, rotateX: -10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="glass-panel"
          style={{ width: '90%', maxWidth: '700px', height: '500px', background: 'rgba(10, 12, 18, 0.95)', border: '1px solid var(--border-active)', boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0, 240, 255, 0.2)', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="gradient-text" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={24} color="var(--accent-cyan)" /> Deploy Autonomous Node
            </h2>
            <button onClick={onClose} disabled={isDeploying || deployed} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Step 1: Configuration */}
            <AnimatePresence mode="wait">
              {step === 1 && !isDeploying && !deployed && (
                <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Select Node Configuration</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid var(--accent-cyan)', background: 'rgba(0, 240, 255, 0.05)' }}>
                      <Cpu size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
                      <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Standard L4 Cluster</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1080p Generation • 30fps • Gemini 2.5 Flash</p>
                    </div>
                    <div className="glass-panel dropdown-item-hover" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                      <Server size={32} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
                      <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>H100 Cinematic Cluster</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>4K Generation • 60fps • Gemini 1.5 Pro</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Niche Protocol</label>
                    <input type="text" placeholder="e.g. Quantum Physics Explained" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px' }} />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Deploying */}
              {isDeploying && (
                <motion.div key="deploying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent-cyan)', borderRightColor: 'var(--accent-purple)' }} />
                    <Activity size={40} color="var(--accent-cyan)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  </div>
                  <h3 style={{ marginTop: '2rem', color: 'var(--text-main)' }}>Provisioning Cloud Infrastructure...</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Allocating VRAM and initializing LangGraph agents.</p>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {deployed && (
                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 100 }}>
                    <CheckCircle2 size={80} color="#00e676" />
                  </motion.div>
                  <h3 style={{ marginTop: '2rem', color: '#00e676', fontSize: '1.8rem' }}>Node Deployed Successfully!</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The new channel is now actively rendering content.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!isDeploying && !deployed && (
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleDeploy}
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: '1rem', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', border: 'none', color: '#fff' }}
              >
                Initialize Node <ChevronRight size={18} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SetupWizard;
