import { useEffect, useRef } from 'react';
import { useStore } from '../store';

let ambientCtx = null;

const getAmbientContext = () => {
  if (!ambientCtx) {
    ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ambientCtx;
};

export const useAmbientMusic = () => {
  const isEnabled = useStore((state) => state.ambientMusic);
  const nodesRef = useRef(null);

  useEffect(() => {
    // We only want to start the music if it's enabled.
    // However, browsers require user interaction before audio contexts can start.
    // In many cases, toggling it from a UI switch counts as an interaction!
    
    if (!isEnabled) {
      if (nodesRef.current) {
        // Fade out
        const { gainNode, osc1, osc2, lfo } = nodesRef.current;
        const ctx = getAmbientContext();
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
        
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            lfo.stop();
            osc1.disconnect();
            osc2.disconnect();
            lfo.disconnect();
            gainNode.disconnect();
          } catch (e) {}
        }, 1000);
        nodesRef.current = null;
      }
      return;
    }

    if (nodesRef.current) return; // Already playing

    try {
      const ctx = getAmbientContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      // Cyberpunk Drone Setup
      // Deep low-end saw wave
      osc1.type = 'sawtooth';
      osc1.frequency.value = 55; // A1

      // Slightly detuned high-end
      osc2.type = 'sawtooth';
      osc2.frequency.value = 55.5; // Slight beating effect

      // Low pass filter
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Deep sound
      filter.Q.value = 5;

      // LFO to slowly sweep the filter cutoff (creates the "breathing" drone effect)
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // 10 second cycle
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300; // Sweep range

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Routing
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Fade in smoothly
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.setTargetAtTime(0.1, ctx.currentTime, 2); // Target low volume

      // Start everything
      osc1.start();
      osc2.start();
      lfo.start();

      nodesRef.current = { osc1, osc2, lfo, filter, gainNode };

    } catch (e) {
      console.warn("Could not start ambient music", e);
    }

    // Cleanup when component unmounts (though it's globally mounted in App.jsx)
    return () => {
      if (nodesRef.current) {
        const { gainNode, osc1, osc2, lfo } = nodesRef.current;
        try {
          const ctx = getAmbientContext();
          gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
              lfo.stop();
            } catch (e) {}
          }, 1000);
        } catch (e) {}
        nodesRef.current = null;
      }
    };
  }, [isEnabled]);
};
