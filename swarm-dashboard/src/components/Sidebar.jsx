import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useSonicFeedback } from '../hooks/useSonicFeedback';

const Sidebar = ({ channels, activeChannel, setActiveChannel, onOpenWizard, isMobileMenuOpen }) => {
  const { playMenuClick } = useSonicFeedback();
  const activeChannels = channels.filter(c => c.status === 'active');
  const pendingChannels = channels.filter(c => c.status === 'pending');
  const errorChannels = channels.filter(c => c.status === 'error');

  const renderChannelList = (list) => (
    <ul style={{ listStyle: 'none', marginTop: '8px' }}>
      {list.map((ch) => (
        <li key={ch.id} style={{ marginBottom: '4px' }}>
          <button 
            onClick={() => {
              playMenuClick();
              setActiveChannel(ch.id);
            }}
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '10px 1.5rem',
              background: activeChannel === ch.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              border: 'none',
              borderRight: activeChannel === ch.id ? '3px solid var(--accent-cyan)' : '3px solid transparent',
              color: activeChannel === ch.id ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {activeChannel === ch.id && (
              <motion.div 
                layoutId="sidebar-active"
                style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.05))', zIndex: -1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span style={{ color: activeChannel === ch.id ? 'var(--accent-cyan)' : 'inherit' }}>
              {ch.icon}
            </span>
            <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: activeChannel === ch.id ? '600' : '400' }}>
              {ch.name}
            </span>
            <div className={`status-dot status-${ch.status}`}></div>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', boxShadow: '0 0 12px var(--accent-cyan)' }} />
          Enterprise Swarm
        </h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Multi-Agent Orchestrator
        </div>
      </div>

      <div style={{ padding: '1.5rem 0', flex: 1, overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Active Agents
          </h3>
          {renderChannelList(activeChannels)}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Idle Agents
          </h3>
          {renderChannelList(pendingChannels)}
        </div>

        {errorChannels.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-magenta)', padding: '0 1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Requires Attention
            </h3>
            {renderChannelList(errorChannels)}
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <button 
          onClick={() => {
            playMenuClick();
            onOpenWizard();
          }}
          style={{ width: '100%', marginBottom: '1.5rem', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          className="glitch-hover"
        >
          <PlusCircle size={16} /> Deploy New Node
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Supervisor Hub</span>
          <span className="status-dot status-active"></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>H2 Billing DB</span>
          <span className="status-dot status-active"></span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
