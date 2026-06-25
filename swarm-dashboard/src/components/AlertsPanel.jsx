import React from 'react';
import { AlertTriangle, Info, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const alerts = [
  { id: 1, type: 'critical', message: 'Spot VM preemption risk high on us-central1-a. Auto-migrating to us-east4.', time: '2m ago' },
  { id: 2, type: 'warning', message: 'VRAM usage spiked to 98% during Wan 2.5 I2V rendering on STEM channel.', time: '15m ago' },
  { id: 3, type: 'info', message: 'New model weights (EchoMimic V3) cached to local storage.', time: '1h ago' },
];

const AlertsPanel = () => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '0rem' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert size={20} color="var(--accent-magenta)" /> 
        System Alerts
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map((alert, index) => {
          let Icon = Info;
          let color = 'var(--accent-cyan)';
          let bgColor = 'rgba(0, 240, 255, 0.05)';
          
          if (alert.type === 'critical') {
            Icon = AlertTriangle;
            color = 'var(--accent-magenta)';
            bgColor = 'rgba(255, 0, 60, 0.05)';
          } else if (alert.type === 'warning') {
            Icon = AlertCircle;
            color = '#ffea00';
            bgColor = 'rgba(255, 234, 0, 0.05)';
          }

          return (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                padding: '12px 16px', 
                borderRadius: '8px', 
                background: bgColor, 
                borderLeft: `3px solid ${color}`,
                display: 'flex',
                gap: '12px'
              }}
            >
              <div style={{ marginTop: '2px' }}><Icon size={16} color={color} /></div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{alert.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{alert.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
