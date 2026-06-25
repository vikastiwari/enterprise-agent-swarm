import React from 'react';
import { useStore } from '../store';
import { Settings, Moon, Sun, Monitor, Zap, Volume2, Music } from 'lucide-react';

const SettingsPanel = () => {
  const { 
    theme, setTheme, 
    compactLayout, setCompactLayout,
    hapticFeedback, setHapticFeedback,
    soundAlerts, setSoundAlerts,
    ambientMusic, setAmbientMusic
  } = useStore();

  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '600px', overflowY: 'auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--accent-cyan)' }}>
        <Settings size={24} /> System Settings
      </h2>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Appearance Settings */}
        <div style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Appearance</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span>Theme</span>
            <select 
              className="search-bar" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="amoled">AMOLED</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Compact Layout</span>
            <label className="switch">
              <input type="checkbox" checked={compactLayout} onChange={(e) => setCompactLayout(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Feedback Settings */}
        <div style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Feedback & Audio</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Volume2 size={16} /> Sound Alerts</span>
            <label className="switch">
              <input type="checkbox" checked={soundAlerts} onChange={(e) => setSoundAlerts(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Music size={16} /> Ambient Music</span>
            <label className="switch">
              <input type="checkbox" checked={ambientMusic} onChange={(e) => setAmbientMusic(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16} /> WebGL Particles</span>
            <label className="switch">
              <input type="checkbox" checked={hapticFeedback} onChange={(e) => setHapticFeedback(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;
