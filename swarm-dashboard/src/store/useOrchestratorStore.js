import { create } from 'zustand';
import React from 'react';
import { Activity, Video, BrainCircuit, BarChart3, Layers } from 'lucide-react';
import { pipelineConfigs } from '../data/pipelineConfigs';

// Top 10 Channels
const CHANNELS = [
  { id: 'stem', name: 'STEM & Explainers', icon: <BrainCircuit size={18} />, status: 'active' },
  { id: 'finance', name: 'Financial & Crypto', icon: <BarChart3 size={18} />, status: 'active' },
  { id: 'history', name: 'Historical Docs', icon: <Layers size={18} />, status: 'pending' },
  { id: 'crime', name: 'True Crime Mystery', icon: <Video size={18} />, status: 'active' },
  { id: 'tech', name: 'Enterprise AI News', icon: <Activity size={18} />, status: 'error' },
  { id: 'health', name: 'Health & Wellness', icon: <BrainCircuit size={18} />, status: 'active' },
  { id: 'travel', name: 'Travel Explorations', icon: <Layers size={18} />, status: 'pending' },
  { id: 'language', name: 'Language Learning', icon: <Video size={18} />, status: 'active' },
  { id: 'stoic', name: 'Stoic Motivation', icon: <BrainCircuit size={18} />, status: 'active' },
  { id: 'kids', name: 'Childrens Education', icon: <Layers size={18} />, status: 'pending' }
];

const initializeChannelStates = () => {
  const state = {};
  CHANNELS.forEach(ch => {
    const config = pipelineConfigs[ch.id] || pipelineConfigs.default;
    state[ch.id] = {
      isRunning: false,
      stages: config.stages.map(s => ({ ...s, status: 'pending', progress: 0 })),
      logs: [],
      vramUsage: 10
    };
  });
  return state;
};

let ws = null;

export const useOrchestratorStore = create((set, get) => ({
  channels: CHANNELS,
  activeChannel: CHANNELS[0].id,
  channelStates: initializeChannelStates(),
  isConnected: false,

  setActiveChannel: (id) => set({ activeChannel: id }),

  // WebSocket Connection
  connectWebSocket: () => {
    if (ws) return;
    
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to Orchestrator Mock Server');
      set({ isConnected: true });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;
      
      set((state) => {
        const { channelId } = payload;
        if (!channelId) return state;
        
        const prevState = state.channelStates[channelId] || {};
        
        switch (type) {
          case 'PIPELINE_START':
            return {
              channelStates: {
                ...state.channelStates,
                [channelId]: {
                  ...prevState,
                  isRunning: true,
                  stages: payload.stages.map(s => ({ ...s, status: 'pending', progress: 0 })),
                  logs: [],
                  vramUsage: 10
                }
              }
            };
          case 'PIPELINE_COMPLETE':
            return {
              channelStates: {
                ...state.channelStates,
                [channelId]: {
                  ...prevState,
                  isRunning: false,
                  vramUsage: 10
                }
              }
            };
          case 'STAGE_UPDATE':
            const newStages = [...prevState.stages];
            newStages[payload.stageIndex] = {
              ...newStages[payload.stageIndex],
              progress: payload.progress,
              status: payload.status
            };
            return {
              channelStates: {
                ...state.channelStates,
                [channelId]: {
                  ...prevState,
                  stages: newStages
                }
              }
            };
          case 'TELEMETRY_UPDATE':
            return {
              channelStates: {
                ...state.channelStates,
                [channelId]: {
                  ...prevState,
                  vramUsage: payload.vramUsage
                }
              }
            };
          case 'LOG_MESSAGE':
            return {
              channelStates: {
                ...state.channelStates,
                [channelId]: {
                  ...prevState,
                  logs: [...prevState.logs, payload.log]
                }
              }
            };
          default:
            return state;
        }
      });
    };

    ws.onclose = () => {
      console.log('Disconnected from Orchestrator Mock Server');
      set({ isConnected: false });
      ws = null;
      // Auto-reconnect
      setTimeout(() => get().connectWebSocket(), 3000);
    };
  },

  startRender: (channelId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'START_RENDER',
        payload: { channelId }
      }));
    } else {
      console.warn('Cannot start render. WebSocket not connected.');
    }
  }
}));
