import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, User, Sparkles, X, LogOut, CreditCard, Activity, AlertCircle, CheckCircle2, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { useSonicFeedback } from '../hooks/useSonicFeedback';

const TopNav = ({ onOpenCommandPalette, onOpenModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const toggleMobileMenu = useStore((state) => state.toggleMobileMenu);
  const logout = useStore((state) => state.logout);
  const { playMenuClick } = useSonicFeedback();

  const navRef = useRef(null);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsAlertsOpen(false);
        setIsSettingsOpen(false);
        setIsAdminOpen(false);
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      setIsSearching(true);
      setGeminiResponse('');
      
      // Simulate Gemini Lite streaming response
      const responses = [
        "Analyzing Swarm HTN DAG... The Billing Agent is currently querying the H2 database.",
        "Based on your query, the Supervisor Agent has engaged the Support RAG vector database for technical assistance.",
        "I've checked the Orchestrator state. The Synthesis Fallback Mechanism was engaged due to a 429 Rate Limit.",
        "Global telemetry shows Virtual Threads are managing 15 concurrent MCP sessions seamlessly."
      ];
      
      const targetResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setGeminiResponse(targetResponse.charAt(0));
      let i = 1;
      const interval = setInterval(() => {
        setGeminiResponse(prev => targetResponse.substring(0, i + 1));
        i++;
        if (i >= targetResponse.length) {
          clearInterval(interval);
        }
      }, 30);
    }
  };

  return (
    <header className="topnav" ref={navRef} style={{ position: 'relative', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => { playMenuClick(); toggleMobileMenu(); }} className="mobile-menu-btn" aria-label="Toggle Menu">
          <Menu size={20} />
        </button>
        {/* Breadcrumbs can go here */}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
        
        {/* Gemini Lite Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Ask Gemini Lite..." 
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            style={{ width: '300px', transition: 'width 0.3s ease' }}
            onFocus={(e) => e.target.style.width = '400px'}
            onBlur={(e) => e.target.style.width = '300px'}
          />
          <Sparkles size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
          
          {/* Ctrl+K Hint */}
          <div 
            onClick={() => { playMenuClick(); onOpenCommandPalette(); }}
            style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
          >
            Ctrl K
          </div>

          <AnimatePresence>
            {isSearching && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="glass-panel"
                style={{ 
                  position: 'absolute', top: '50px', right: 0, width: '400px', 
                  padding: '1.5rem', zIndex: 100, border: '1px solid var(--accent-cyan)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} /> Gemini Lite (Fast)
                  </h3>
                  <button onClick={() => setIsSearching(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {geminiResponse}
                  <span className="blink-cursor">|</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playMenuClick(); setIsAlertsOpen(!isAlertsOpen); }}
              className="glass-panel" 
              style={{ padding: '8px', border: 'none', background: isAlertsOpen ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer', position: 'relative' }}
            >
              <Bell size={20} color="var(--text-muted)" />
              <span style={{ position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px', background: 'var(--accent-magenta)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-magenta)' }}></span>
            </motion.button>

            <AnimatePresence>
              {isAlertsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-panel dropdown-menu"
                >
                  <h4 style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', margin: 0 }}>System Notifications</h4>
                  <div style={{ padding: '0.5rem' }}>
                    <DropdownItem icon={<AlertCircle color="var(--accent-magenta)" size={16} />} title="MCP Server Timeout" desc="Billing Agent failed to respond." />
                    <DropdownItem icon={<CheckCircle2 color="#00e676" size={16} />} title="Synthesis Complete" desc="Request CUST-1001 resolved." />
                    <DropdownItem icon={<Activity color="var(--accent-cyan)" size={16} />} title="Rate Limit Alert" desc="Gemini 5 RPM ceiling hit." />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Settings Dropdown */}
          <div style={{ position: 'relative' }}>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playMenuClick(); setIsSettingsOpen(!isSettingsOpen); }}
              className="glass-panel" 
              style={{ padding: '8px', border: 'none', background: isSettingsOpen ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer' }}
            >
              <Settings size={20} color="var(--text-muted)" />
            </motion.button>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-panel dropdown-menu"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <DropdownItem icon={<Settings size={16} />} title="Preferences" desc="App layout & styling" onClick={() => { playMenuClick(); onOpenModal('preferences'); }} />
                    <DropdownItem icon={<Activity size={16} />} title="Agent Configuration" desc="Manage sub-agents & MCP endpoints" onClick={() => { playMenuClick(); onOpenModal('performance'); }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }}></div>

          {/* Admin Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <motion.button 
              onClick={() => { playMenuClick(); setIsAdminOpen(!isAdminOpen); }}
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}>
                <User size={16} color="white" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Admin</span>
            </motion.button>
            <AnimatePresence>
              {isAdminOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-panel dropdown-menu" style={{ right: 0, left: 'auto', minWidth: '200px' }}
                >
                  <div style={{ padding: '0.5rem' }}>
                    <DropdownItem icon={<User size={16} />} title="My Profile" onClick={() => onOpenModal('profile')} />
                    <DropdownItem icon={<CreditCard size={16} />} title="Billing & Plans" onClick={() => onOpenModal('billing')} />
                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                    <DropdownItem icon={<LogOut size={16} color="var(--accent-magenta)" />} title="Logout" color="var(--accent-magenta)" onClick={logout} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon, title, desc, color, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s ease' }} className="dropdown-item-hover">
    <div style={{ marginTop: '2px', color: color || 'var(--text-muted)' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: color || 'var(--text-main)', marginBottom: desc ? '4px' : '0' }}>{title}</div>
      {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>}
    </div>
  </div>
);

export default TopNav;
