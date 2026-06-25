import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Activity, User, CreditCard, X, Shield, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStore } from '../store';

const GlobalModal = ({ isOpen, onClose, type }) => {
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);
  const compactLayout = useStore(s => s.compactLayout);
  const setCompactLayout = useStore(s => s.setCompactLayout);
  const hapticFeedback = useStore(s => s.hapticFeedback);
  const setHapticFeedback = useStore(s => s.setHapticFeedback);
  const soundAlerts = useStore(s => s.soundAlerts);
  const setSoundAlerts = useStore(s => s.setSoundAlerts);
  const ambientMusic = useStore(s => s.ambientMusic);
  const setAmbientMusic = useStore(s => s.setAmbientMusic);

  if (!isOpen) return null;

  const contentMap = {
    preferences: {
      icon: <Settings size={28} color="var(--accent-cyan)" />,
      title: "Global Preferences",
      desc: "Configure your node layout and theming",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>UI Theme</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select your preferred visual style</div>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="dark">Dark Mode (Default)</option>
              <option value="light">Light Mode</option>
              <option value="amoled">AMOLED Pitch Black</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>
          <ToggleSetting 
            label="Compact Dashboard Layout" 
            desc="Increase data density on charts" 
            isOn={compactLayout} 
            onToggle={() => setCompactLayout(!compactLayout)} 
          />
          <ToggleSetting 
            label="Haptic Feedback (Mobile)" 
            desc="Vibrate on orchestrator state change" 
            isOn={hapticFeedback} 
            onToggle={() => setHapticFeedback(!hapticFeedback)} 
          />
          <ToggleSetting 
            label="UI Sound Effects" 
            desc="Enable sonic feedback for interactions" 
            isOn={soundAlerts} 
            onToggle={() => setSoundAlerts(!soundAlerts)} 
          />
          <ToggleSetting 
            label="Cyberpunk Ambient Music" 
            desc="Generative drone via Web Audio API" 
            isOn={ambientMusic} 
            onToggle={() => setAmbientMusic(!ambientMusic)} 
          />
        </div>
      )
    },
    performance: {
      icon: <Activity size={28} color="var(--accent-magenta)" />,
      title: "Performance Tuning",
      desc: "Hardware acceleration & WebGL settings",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <ToggleSetting label="Hardware Acceleration (WebGL)" desc="Offload Particle compute to GPU" active={true} color="var(--accent-magenta)" />
          <ToggleSetting label="60FPS Node Graph Animation" desc="Smooth out the laser data paths" active={true} color="var(--accent-magenta)" />
          <ToggleSetting label="Background Audio Synthesis" desc="Allow waveforms to calculate off-screen" active={false} color="var(--accent-magenta)" />
        </div>
      )
    },
    profile: {
      icon: <User size={28} color="#00e676" />,
      title: "Admin Profile",
      desc: "Manage your credentials and security",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(138, 43, 226, 0.4)' }}>
              <Shield size={32} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>SuperAdmin_01</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level 4 Clearance • Last login: 2 min ago</p>
            </div>
          </div>
          <ToggleSetting label="Two-Factor Authentication" desc="Require Yubikey for Pipeline deployment" active={true} color="#00e676" />
        </div>
      )
    },
    billing: {
      icon: <CreditCard size={28} color="var(--accent-cyan)" />,
      title: "Billing & Plans",
      desc: "FinOps overview and usage limits",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-dark)', border: '1px solid var(--accent-cyan)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)' }}
            />
            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} /> Enterprise Plan Active
            </h3>
            <p style={{ color: 'var(--text-main)' }}>Unlimited Node Deployments</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Renews in 14 days</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Monthly Budget Cap</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>$4,500.00</span>
          </div>
        </div>
      )
    }
  };

  const config = contentMap[type] || contentMap.preferences;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel"
          style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-active)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0, 240, 255, 0.15)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {config.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{config.title}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{config.desc}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
              <X size={24} />
            </button>
          </div>
          
          <div style={{ height: '1px', background: 'var(--border-subtle)', width: '100%', marginBottom: '1.5rem' }}></div>

          {config.render()}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary" onClick={onClose}
            >
              Done
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ToggleSetting = ({ label, desc, isOn, onToggle, color = 'var(--accent-cyan)' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }} onClick={onToggle}>
      <div>
        <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <div style={{ color: isOn ? color : 'var(--text-muted)', transition: 'color 0.2s' }}>
        {isOn ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
      </div>
    </div>
  );
};

export default GlobalModal;
