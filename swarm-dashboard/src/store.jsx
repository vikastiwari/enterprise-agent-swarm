import { create } from 'zustand';
import { pipelineConfigs } from './data/pipelineConfigs';
import { BrainCircuit, BarChart3, Layers, Video, Activity } from 'lucide-react';
import React from 'react';

export const CHANNELS = [
  { id: 'supervisor', name: 'Supervisor Agent', icon: <BrainCircuit size={18} />, status: 'active' },
  { id: 'billing', name: 'Billing MCP Agent', icon: <BarChart3 size={18} />, status: 'active' },
  { id: 'support', name: 'Support RAG Agent', icon: <Layers size={18} />, status: 'active' },
  { id: 'sales', name: 'Sales Agent', icon: <Activity size={18} />, status: 'pending' }
];

const initializeStates = () => {
  const initialState = {};
  CHANNELS.forEach(ch => {
    const config = pipelineConfigs[ch.id] || pipelineConfigs.default;
    initialState[ch.id] = {
      isRunning: false,
      stages: config.stages.map(s => ({ ...s, status: 'pending', progress: 0 })),
      logs: [],
      vramUsage: 10
    };
  });
  return initialState;
};

let ws = null;
let hftWs = null;

export const useStore = create((set, get) => ({
  channelStates: initializeStates(),
  hftTelemetry: { price: 0.0, action: 0.0 },
  isConnected: false,
  isHftConnected: false,
  theme: localStorage.getItem('theme') || 'dark',
  compactLayout: localStorage.getItem('compactLayout') === 'true',
  hapticFeedback: localStorage.getItem('hapticFeedback') !== 'false',
  soundAlerts: localStorage.getItem('soundAlerts') !== 'false', // Default true
  ambientMusic: localStorage.getItem('ambientMusic') === 'true', // Default false
  isMobileMenuOpen: false,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  toasts: [],
  hftInterval: null,
  activeSimulations: {},

  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  login: (username, password) => {
    // Mock authentication - accept anything for the demo
    localStorage.setItem('isAuthenticated', 'true');
    set({ isAuthenticated: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false });
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },

  setCompactLayout: (isCompact) => {
    localStorage.setItem('compactLayout', isCompact);
    set({ compactLayout: isCompact });
  },

  setHapticFeedback: (isHaptic) => {
    localStorage.setItem('hapticFeedback', isHaptic);
    set({ hapticFeedback: isHaptic });
  },
  
  setSoundAlerts: (isOn) => {
    localStorage.setItem('soundAlerts', isOn);
    set({ soundAlerts: isOn });
  },

  setAmbientMusic: (isOn) => {
    localStorage.setItem('ambientMusic', isOn);
    set({ ambientMusic: isOn });
  },
  
  updateChannelState: (channelId, updater) => set((state) => ({
    channelStates: {
      ...state.channelStates,
      [channelId]: typeof updater === 'function' 
        ? updater(state.channelStates[channelId]) 
        : { ...state.channelStates[channelId], ...updater }
    }
  })),

  connectWebSocket: () => {
    // Disabled legacy Orchestrator Mock WebSocket
    console.log('Legacy Orchestrator WebSocket Disabled. Relying on local simulation for Observability metrics.');
    set({ isConnected: false });
  },

  connectHftWebSocket: () => {
    // Disabled legacy HFT WebSocket
    console.log('Legacy HFT WebSocket Disabled. Falling back to local simulation for telemetry.');
    set({ isHftConnected: false });
    
    // Start local simulation immediately
    if (!get().hftInterval) {
      const interval = setInterval(() => {
        set((state) => ({
          hftTelemetry: {
            price: Math.max(100, state.hftTelemetry.price + (Math.random() - 0.5) * 5),
            action: Math.floor(Math.random() * 3) // 0=hold, 1=buy, 2=sell
          }
        }));
      }, 200);
      set({ hftInterval: interval });
    }
  },

  handleRender: (channelId) => {
    // Forward the render request to the WebSocket server
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'START_RENDER',
        payload: { channelId }
      }));
    } else {
      console.warn('WebSocket not connected. Falling back to Local Simulation Mode.');
      get().simulateLocalPipeline(channelId);
    }
  },

  simulateLocalPipeline: (channelId) => {
    const state = get();
    if (state.activeSimulations[channelId]) return; // Already running

    // 1. Mark Pipeline as Started
    set((s) => {
      const prevState = s.channelStates[channelId] || {};
      const config = pipelineConfigs[channelId] || pipelineConfigs.default;
      return {
        activeSimulations: { ...s.activeSimulations, [channelId]: true },
        channelStates: {
          ...s.channelStates,
          [channelId]: {
            ...prevState,
            isRunning: true,
            stages: config.stages.map(stage => ({ ...stage, status: 'pending', progress: 0 })),
            logs: [{ timestamp: Date.now(), type: 'INFO', text: '[SIMULATION MODE] Agent Pipeline Initialized' }],
            vramUsage: 10
          }
        }
      };
    });

    const config = pipelineConfigs[channelId] || pipelineConfigs.default;
    let currentStageIndex = 0;
    
    // Telemetry Loop
    const telemetryInterval = setInterval(() => {
      set((s) => {
        const prevState = s.channelStates[channelId];
        if (!prevState || !prevState.isRunning) return s;
        return {
          channelStates: {
            ...s.channelStates,
            [channelId]: {
              ...prevState,
              vramUsage: Math.min(100, Math.max(10, prevState.vramUsage + (Math.random() - 0.5) * 20))
            }
          }
        };
      });
    }, 500);

    // Progression Loop
    const progressionInterval = setInterval(() => {
      const s = get();
      const prevState = s.channelStates[channelId];
      if (!prevState || !prevState.isRunning) {
        clearInterval(progressionInterval);
        clearInterval(telemetryInterval);
        return;
      }

      if (currentStageIndex >= config.stages.length) {
        // Complete
        clearInterval(progressionInterval);
        clearInterval(telemetryInterval);
        set((state) => ({
          activeSimulations: { ...state.activeSimulations, [channelId]: false },
          channelStates: {
            ...state.channelStates,
            [channelId]: {
              ...prevState,
              isRunning: false,
              vramUsage: 10,
              logs: [...prevState.logs, { timestamp: Date.now(), type: 'INFO', text: '[SIMULATION MODE] Pipeline execution complete.' }]
            }
          }
        }));
        return;
      }

      const stage = prevState.stages[currentStageIndex];
      let newProgress = stage.progress + Math.floor(Math.random() * 15) + 5;
      
      let newLogs = [...prevState.logs];
      if (newProgress < 20 && stage.status === 'pending') {
         newLogs.push({ timestamp: Date.now(), type: 'INFO', text: `Executing stage: ${stage.title}` });
      }

      if (newProgress >= 100) {
        newProgress = 100;
        newLogs.push({ timestamp: Date.now(), type: 'INFO', text: `Completed stage: ${stage.title}` });
      }

      const updatedStages = [...prevState.stages];
      updatedStages[currentStageIndex] = {
        ...stage,
        progress: newProgress,
        status: newProgress === 100 ? 'complete' : 'running'
      };

      set((state) => ({
        channelStates: {
          ...state.channelStates,
          [channelId]: {
            ...prevState,
            stages: updatedStages,
            logs: newLogs
          }
        }
      }));

      if (newProgress === 100) {
        currentStageIndex++;
      }
    }, 400);
  }
}));
