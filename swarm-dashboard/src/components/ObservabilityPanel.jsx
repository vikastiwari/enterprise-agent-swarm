import React from 'react';
import { motion } from 'framer-motion';
import { Network, Activity, Database, Server } from 'lucide-react';

const ObservabilityPanel = () => {
  return (
    <div style={{ display: 'flex', gap: '2rem', height: '600px' }}>
      {/* Node Graph Visualization Placeholder */}
      <div className="glass-panel" style={{ flex: 2, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Network size={20} /> HTN DAG Visualization
        </h3>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed var(--border-subtle)', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            [Live Agent Graph Rendering Here]
            <br/><br/>
            Supervisor &rarr; BillingAgent (Parallel)
            <br/>
            Supervisor &rarr; SupportAgent (Parallel)
          </div>
        </div>
      </div>

      {/* Telemetry Sidebar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} /> Virtual Threads
          </h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>15</div>
          <div style={{ fontSize: '0.8rem', color: '#00e676' }}>+3 active sessions</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} /> MCP Sessions
          </h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-magenta)' }}>1</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BillingAgent_H2</div>
        </div>
      </div>
    </div>
  );
};

export default ObservabilityPanel;
