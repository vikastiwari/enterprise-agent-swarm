import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Video, BrainCircuit, BarChart3, 
  Settings, Play, RefreshCw, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Particles from './components/Particles';
import CommandPalette from './components/CommandPalette';
import GlobalModal from './components/GlobalModal';
import SetupWizard from './components/SetupWizard';
import AgentTraceView from './components/AgentTraceView';
import FinOpsDashboard from './components/FinOpsDashboard';
import InterventionModal from './components/InterventionModal';
import Login from './components/Login';
import BootScreen from './components/BootScreen';
import ToastContainer from './components/ToastContainer';
import ChatInterface from './components/ChatInterface';
import ObservabilityPanel from './components/ObservabilityPanel';
import SettingsPanel from './components/SettingsPanel';
import { useAmbientMusic } from './hooks/useAmbientMusic';
import { useSonicFeedback } from './hooks/useSonicFeedback';
import { CHANNELS, useStore } from './store';

function App() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isHITLOpen, setIsHITLOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Assuming connectWebSocket is added to store.jsx
    useStore.getState().connectWebSocket();
    useStore.getState().connectHftWebSocket();
  }, []);

  const activeState = useStore((state) => state.channelStates[activeChannel]) || { isRunning: false, stages: [], logs: [], vramUsage: 10 };
  const triggerRender = useStore((state) => state.handleRender);
  const addToast = useStore((state) => state.addToast);
  const theme = useStore((state) => state.theme);
  const compactLayout = useStore((state) => state.compactLayout);
  const isMobileMenuOpen = useStore((state) => state.isMobileMenuOpen);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // Mount global ambient music engine
  useAmbientMusic();
  const { playEventProcess, playTabClick } = useSonicFeedback();

  const handleRender = () => {
    playEventProcess();
    addToast('Pipeline render triggered successfully', 'success');
    triggerRender(activeChannel);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-layout', compactLayout ? 'compact' : 'default');
  }, [theme, compactLayout]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsBooting(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      <AnimatePresence>
        {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {!isBooting && !isAuthenticated ? (
        <>
          <Particles />
          <Login />
        </>
      ) : !isBooting && isAuthenticated ? (
        <div className="app-container">
          <Particles />
      <ToastContainer />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <GlobalModal isOpen={!!modalType} onClose={() => setModalType(null)} type={modalType} />
      <SetupWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      <InterventionModal 
        isOpen={isHITLOpen} 
        onApprove={() => setIsHITLOpen(false)} 
        onReject={() => setIsHITLOpen(false)}
        channelName={CHANNELS.find(c => c.id === activeChannel)?.name}
        stageName="Voice Synthesis"
      />
      
      <Sidebar 
        channels={CHANNELS} 
        activeChannel={activeChannel} 
        setActiveChannel={setActiveChannel}
        onOpenWizard={() => setIsWizardOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <main className="main-content" style={{ zIndex: 1 }}>
        <TopNav 
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
          onOpenModal={(type) => setModalType(type)}
        />
        
        <div style={{ padding: '2rem 2rem 0 2rem', flexShrink: 0 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                Enterprise Swarm
              </h1>
              <p style={{ color: 'var(--text-muted)' }}>Multi-Agent Orchestration & Observability</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleRender(activeChannel)}
                disabled={activeState.isRunning}
                className="btn-primary" 
              >
                {activeState.isRunning ? <RefreshCw size={16} className="spin" /> : <Play size={16} />} 
                {activeState.isRunning ? 'Swarm Active...' : 'Ping Supervisor'}
              </button>
            </div>
          </header>

          <div className="tabs-container">
            {['chat', 'observability', 'settings'].map(tab => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  playTabClick();
                  setActiveTab(tab);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <motion.div layoutId="activeTabIndicator" className="tab-indicator" />}
              </button>
            ))}
          </div>
        </div>

        <div className="content-area" style={{ padding: '0 2rem 2rem 2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'chat' ? (
                <ChatInterface />
              ) : activeTab === 'observability' ? (
                <ObservabilityPanel />
              ) : (
                <SettingsPanel />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
      ) : null}
    </>
  );
}

export default App;
