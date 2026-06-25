import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PlayCircle, Cpu, HardDrive, Zap, CheckCircle2, Clock, Activity, Settings, Save, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Terminal from './Terminal';
import AlertsPanel from './AlertsPanel';
import ErrorBoundary from './ErrorBoundary';
import TiltCard from './TiltCard';
import PipelineCanvas from './PipelineCanvas';
import { useSonicFeedback } from '../hooks/useSonicFeedback';
import { useStore } from '../store';

const mockViewsData = [
  { time: '10:00', views: 4000, ctr: 4.2 },
  { time: '11:00', views: 3000, ctr: 4.1 },
  { time: '12:00', views: 5000, ctr: 4.8 },
  { time: '13:00', views: 8780, ctr: 5.5 },
  { time: '14:00', views: 11900, ctr: 6.2 },
  { time: '15:00', views: 15200, ctr: 7.1 },
  { time: '16:00', views: 18400, ctr: 8.4 },
];

const mockResourceData = [
  { name: 'GPU-1', usage: 85 },
  { name: 'GPU-2', usage: 42 },
  { name: 'GPU-3', usage: 92 },
  { name: 'GPU-4', usage: 18 },
];

const Dashboard = ({ activeTab, channelState }) => {
  const { stages, logs, vramUsage, isRunning } = channelState;
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  
  // Settings State
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const { playClick, playSuccess } = useSonicFeedback();
  const addToast = useStore((state) => state.addToast);

  const handleSave = () => {
    playClick();
    setSaved(true);
    addToast('Global orchestration settings saved successfully!', 'success');
    setTimeout(() => {
      setSaved(false);
      playSuccess();
    }, 1000);
  };

  const hftTelemetry = useStore((state) => state.hftTelemetry);
  const isHftConnected = useStore((state) => state.isHftConnected);

  if (activeTab === 'analytics') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--accent-cyan)" /> API Gateway Latency
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
              {Math.floor(hftTelemetry.price / 3)} ms
            </div>
          </div>
        </TiltCard>

        <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color={hftTelemetry.action > 0 ? "var(--accent-cyan)" : "var(--accent-magenta)"} /> Active Tokens / Sec
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: hftTelemetry.action > 0 ? "var(--accent-cyan)" : "var(--accent-magenta)" }}>
              {hftTelemetry.action > 0.5 ? '2.4k' : hftTelemetry.action < -0.5 ? '1.8k' : '3.1k'}
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Throughput Status: {hftTelemetry.action > 0.5 ? 'Optimal' : 'Surging'}
            </div>
          </div>
        </TiltCard>
      </div>
    );
  }

  if (activeTab === 'logs') {
    return (
      <div>
        <Terminal logs={logs} isVisible={true} forceExpanded={true} />
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={24} color="var(--accent-cyan)" /> 
          Global Orchestration Configuration
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Appearance Config */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Appearance</h3>
            <div className="input-group">
              <label>UI Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px', width: '100%', maxWidth: '300px' }}
              >
                <option value="dark">Dark Mode (Default)</option>
                <option value="light">Light Mode</option>
                <option value="amoled">AMOLED Pitch Black</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
              </select>
            </div>
          </div>

          {/* API Keys */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>API Credentials</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Gemini 2.5 Flash API Key</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type={showKey ? "text" : "password"} defaultValue="AIzaSyA88-Gemini-Fake-Key-992jdx" style={{ flex: 1, padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
                  <button onClick={() => setShowKey(!showKey)} className="glass-panel" style={{ padding: '0 15px', cursor: 'pointer', background: 'transparent' }}>
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label>Wan 2.5 I2V API Endpoint</label>
                <input type="text" defaultValue="https://wan-cluster.internal.gcp:8443/v1/generate" style={{ padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
            </div>
          </div>

          {/* Render Config */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Render Options</h3>
            <div className="settings-grid">
              <div className="input-group">
                <label>Output Resolution</label>
                <select style={{ padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }}>
                  <option>1080p (Fast)</option>
                  <option>4K (GPU Intensive)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Framerate</label>
                <select style={{ padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }}>
                  <option>30 FPS</option>
                  <option>60 FPS</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saved ? '#00e676' : undefined, borderColor: saved ? '#00e676' : undefined }}
            >
              {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {saved ? 'Configuration Saved!' : 'Save Configuration'}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Orchestrator State Card */}
        <ErrorBoundary>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="var(--accent-cyan)" /> 
              Active Orchestration Pipeline
              <span style={{ 
                marginLeft: 'auto', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px',
                background: isRunning ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg-dark)', 
                color: isRunning ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)'
              }}>
                {isRunning ? 'LangGraph State: Running' : 'LangGraph State: Idle'}
              </span>
            </h2>
            
            <PipelineCanvas stages={stages} isRunning={isRunning} />
            
            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Activity size={16} color={isRunning ? "var(--accent-magenta)" : "var(--text-muted)"} />
                <span style={{ fontSize: '0.9rem' }}>Neural Acoustic Synthesis</span>
              </div>
              <WaveformVisualizer isActive={isRunning} />
            </div>
          </div>
        </ErrorBoundary>

        {/* Dynamic Terminal View (Preview) */}
        {isRunning && <Terminal logs={logs} isVisible={true} />}

      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Hardware Telemetry */}
        <ErrorBoundary>
          <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>Cluster Telemetry</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TelemetryItem icon={<Cpu size={18} />} label="GCP L4 GPU Utilization" value={`${vramUsage}%`} progress={vramUsage} color={vramUsage > 80 ? "var(--accent-magenta)" : "var(--accent-cyan)"} />
              <TelemetryItem icon={<HardDrive size={18} />} label="VRAM Allocation" value={`${(vramUsage * 0.24).toFixed(1)} / 24 GB`} progress={vramUsage} color={vramUsage > 80 ? "var(--accent-magenta)" : "var(--accent-cyan)"} />
              <TelemetryItem icon={<Zap size={18} />} label="CPU Overhead" value="12%" progress={12} color="var(--accent-cyan)" />
            </div>
          </TiltCard>
        </ErrorBoundary>

        <ErrorBoundary>
          <AlertsPanel />
        </ErrorBoundary>

        {/* Financial Projections */}
        <ErrorBoundary>
          <TiltCard className="glass-panel glitch-hover" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>FinOps Economics</h2>
            <div className="settings-grid">
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Cost</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>$0.42</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Calls</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>8,492</p>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Daily Budget</span>
                <span style={{ color: 'var(--accent-cyan)' }}>$0.42 / $1.50</span>
              </div>
              <div className="progress-container">
                <div style={{ width: '28%', height: '100%', background: 'var(--accent-cyan)', borderRadius: '3px' }}></div>
              </div>
            </div>
          </TiltCard>
        </ErrorBoundary>

      </div>
    </div>
  );
};

const PipelineStage = ({ title, status, progress }) => {
  const getStatusIcon = () => {
    if (status === 'complete') return <CheckCircle2 size={18} color="#00e676" />;
    if (status === 'active') return <PlayCircle size={18} color="var(--accent-cyan)" />;
    return <Clock size={18} color="var(--text-muted)" />;
  };

  return (
    <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: status === 'active' ? 1 : 0.8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon()}
          <span style={{ fontSize: '0.95rem', fontWeight: status === 'active' ? '600' : '400', color: status === 'pending' ? 'var(--text-muted)' : 'var(--text-main)' }}>{title}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{progress}%</span>
      </div>
      <div className="progress-container">
        <motion.div 
          className="progress-bar" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          style={{ opacity: status === 'pending' ? 0.3 : 1, background: status === 'complete' ? '#00e676' : undefined }} 
        />
      </div>
    </motion.div>
  );
};

const TelemetryItem = ({ icon, label, value, progress, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {icon} {label}
      </div>
      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{value}</span>
    </div>
    <div className="progress-container">
      <motion.div 
        className="progress-bar" 
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
        style={{ background: color, boxShadow: `0 0 10px ${color}40` }} 
      />
    </div>
  </div>
);


const WaveformVisualizer = ({ isActive }) => {
  const bars = Array.from({ length: 30 });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '30px' }}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: isActive ? [4, Math.random() * 25 + 5, 4] : 2 }}
          transition={{ duration: 0.3 + Math.random() * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '4px', background: isActive ? 'var(--accent-cyan)' : 'transparent', borderRadius: '2px' }}
        />
      ))}
    </div>
  );
};

export default Dashboard;
