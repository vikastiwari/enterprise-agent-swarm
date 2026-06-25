import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Activity, Video, Settings, Play } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const actions = [
    { id: 1, title: 'Go to Overview', icon: <Activity size={16} />, category: 'Navigation' },
    { id: 2, title: 'Go to Settings', icon: <Settings size={16} />, category: 'Navigation' },
    { id: 3, title: 'Render True Crime Channel', icon: <Play size={16} color="var(--accent-cyan)" />, category: 'Actions' },
    { id: 4, title: 'View FinOps Reports', icon: <Activity size={16} />, category: 'Reports' },
    { id: 5, title: 'Switch to Light Mode (Disabled)', icon: <Settings size={16} />, category: 'System' }
  ];

  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '15vh'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '600px',
            background: 'rgba(15, 18, 25, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.1)',
            overflow: 'hidden'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Search size={20} color="var(--accent-cyan)" style={{ marginRight: '12px' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ESC to close
            </div>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px' }}>
            {filteredActions.length > 0 ? (
              filteredActions.map((action, idx) => (
                <div 
                  key={action.id}
                  className="dropdown-item-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    gap: '12px',
                    color: 'var(--text-main)'
                  }}
                  onClick={() => {
                    // Logic would go here
                    onClose();
                  }}
                >
                  <div style={{ color: 'var(--text-muted)' }}>{action.icon}</div>
                  <div style={{ flex: 1, fontSize: '0.95rem' }}>{action.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {action.category}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No commands found for "{query}"
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
