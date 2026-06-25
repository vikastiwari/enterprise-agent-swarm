import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Brain, Zap, ChevronDown, ChevronRight, Clock, Search, Sparkles, GitBranch, Download } from 'lucide-react';

// Simulated agent decision traces
const generateTraces = () => [
  {
    id: 1,
    timestamp: '12:04:02.331',
    agent: 'SupervisorAgent',
    phase: 'observe',
    summary: 'Received new pipeline request for STEM channel',
    detail: {
      prompt: 'Decompose the STEM pipeline into sub-tasks: [scripting, animation, voice, compilation]. Assign each to a specialist agent.',
      response: 'Task decomposition complete. Identified 4 sub-tasks with dependency chain: Scripting → Animation → Voice → Compilation.',
      decision: 'Dispatching ScriptingAgent with priority=HIGH and context window of 128K tokens.'
    }
  },
  {
    id: 2,
    timestamp: '12:04:03.887',
    agent: 'ScriptingAgent',
    phase: 'think',
    summary: 'Analyzing topic: "Linear Algebra Fundamentals" for LaTeX script generation',
    detail: {
      prompt: 'Generate a 90-second educational script on eigenvalues and eigenvectors. Format output in LaTeX with Manim-compatible scene descriptors.',
      response: 'Generated 847-token LaTeX script with 6 scene descriptors. Estimated render time: 45 seconds per scene at 1080p.',
      decision: 'Script passes quality gate (perplexity < 12). Forwarding to AnimationAgent via A2A protocol.'
    }
  },
  {
    id: 3,
    timestamp: '12:04:08.112',
    agent: 'AnimationAgent',
    phase: 'act',
    summary: 'Executing Manim compilation with VGroup and SVG vectorization',
    detail: {
      prompt: 'Compile 6 LaTeX scenes using Manim Community v0.18. Apply: FadeIn, Write, Transform animations. Output: 1080p H.264.',
      response: 'Compilation started. Scene 1/6 rendering... Bounding box adjustment applied (buff=0.5). GPU memory: 8.2GB / 24GB.',
      decision: 'All scenes rendered. Total frames: 2,700. Passing MP4 asset to VoiceAgent queue.'
    }
  },
  {
    id: 4,
    timestamp: '12:04:12.445',
    agent: 'VoiceAgent',
    phase: 'observe',
    summary: 'Fetching GCP Journey TTS configuration and voice model',
    detail: {
      prompt: 'Synthesize narration for STEM script using GCP TTS Journey voice (en-US-Journey-D). Apply SSML prosody for emphasis on key terms.',
      response: 'Voice model loaded. Chunking script into 34 segments for parallel synthesis. Estimated cost: $0.008.',
      decision: 'Parallel synthesis initiated across 4 threads. Expected completion: 3.2 seconds.'
    }
  },
  {
    id: 5,
    timestamp: '12:04:15.998',
    agent: 'CompilationAgent',
    phase: 'act',
    summary: 'FFmpeg merge: H.264 video + AAC audio → final MP4',
    detail: {
      prompt: 'Merge animated scenes with synchronized audio. Apply: loudnorm filter (EBU R128), generate thumbnail at 00:15, write metadata tags.',
      response: 'FFmpeg process completed in 2.1s. Output: /outputs/stem/stem_eigenvalues_v1.mp4 (42.3 MB, 1:32 duration)',
      decision: 'Quality check passed. Uploading to staging bucket. Notifying SupervisorAgent of completion.'
    }
  },
  {
    id: 6,
    timestamp: '12:04:18.220',
    agent: 'SupervisorAgent',
    phase: 'think',
    summary: 'Evaluating pipeline output against quality thresholds',
    detail: {
      prompt: 'Validate output: check video integrity, audio sync, caption accuracy, and FinOps budget compliance.',
      response: 'All checks passed. Video integrity: OK. Audio sync delta: <50ms. Budget: $0.42 (within $2.00 limit).',
      decision: 'Pipeline marked as COMPLETE. Updating dashboard telemetry. Sending notification to operator.'
    }
  }
];

const phaseConfig = {
  observe: { icon: Eye, color: 'var(--accent-cyan)', label: 'OBSERVE', bg: 'rgba(0, 240, 255, 0.08)' },
  think: { icon: Brain, color: 'var(--accent-purple)', label: 'THINK', bg: 'rgba(138, 43, 226, 0.08)' },
  act: { icon: Zap, color: 'var(--accent-magenta)', label: 'ACT', bg: 'rgba(255, 0, 60, 0.08)' }
};

const TraceEntry = ({ trace, index, isExpanded, onToggle }) => {
  const phase = phaseConfig[trace.phase];
  const PhaseIcon = phase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 20 }}
      style={{ position: 'relative' }}
    >
      {/* Timeline connector line */}
      <div style={{
        position: 'absolute', left: '19px', top: '40px', bottom: '-20px',
        width: '2px', background: `linear-gradient(to bottom, ${phase.color}40, transparent)`,
        display: index < 5 ? 'block' : 'none'
      }} />

      <div
        onClick={onToggle}
        style={{
          display: 'flex', gap: '16px', padding: '16px', cursor: 'pointer',
          borderRadius: '12px', background: isExpanded ? phase.bg : 'transparent',
          border: isExpanded ? `1px solid ${phase.color}30` : '1px solid transparent',
          transition: 'all 0.3s ease', marginBottom: '8px'
        }}
      >
        {/* Phase icon bubble */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: phase.bg, border: `2px solid ${phase.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isExpanded ? `0 0 20px ${phase.color}40` : 'none',
          transition: 'box-shadow 0.3s'
        }}>
          <PhaseIcon size={18} color={phase.color} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px',
              borderRadius: '4px', background: phase.bg, color: phase.color,
              letterSpacing: '0.05em', border: `1px solid ${phase.color}40`
            }}>
              {phase.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: '"Fira Code", monospace' }}>
              {trace.timestamp}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
              {trace.agent}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{trace.summary}</p>
        </div>

        {/* Expand indicator */}
        <div style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', marginLeft: '56px', marginBottom: '16px' }}
          >
            <div style={{
              background: 'var(--bg-card)', borderRadius: '10px',
              padding: '16px', border: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {/* Prompt */}
              <div>
                <div style={{ fontSize: '0.7rem', color: phase.color, fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={12} /> PROMPT
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5', fontFamily: '"Fira Code", monospace', background: 'var(--bg-dark)', padding: '8px 12px', borderRadius: '6px', borderLeft: `3px solid ${phase.color}` }}>
                  {trace.detail.prompt}
                </p>
              </div>
              {/* Response */}
              <div>
                <div style={{ fontSize: '0.7rem', color: '#00e676', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} /> RESPONSE
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5', fontFamily: '"Fira Code", monospace', background: 'rgba(0, 230, 118, 0.05)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #00e676' }}>
                  {trace.detail.response}
                </p>
              </div>
              {/* Decision */}
              <div>
                <div style={{ fontSize: '0.7rem', color: '#ffea00', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitBranch size={12} /> DECISION
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5', fontFamily: '"Fira Code", monospace', background: 'rgba(255, 234, 0, 0.05)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #ffea00' }}>
                  {trace.detail.decision}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AgentTraceView = () => {
  const traces = useMemo(() => generateTraces(), []);
  const [expandedId, setExpandedId] = useState(null);
  const [scrubberPos, setScrubberPos] = useState(100);

  const visibleTraces = useMemo(() => {
    const count = Math.ceil((scrubberPos / 100) * traces.length);
    return traces.slice(0, count);
  }, [scrubberPos, traces]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(traces, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-traces.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Timeline Scrubber */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={20} color="var(--accent-cyan)" /> Agent Decision Timeline
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {visibleTraces.length} / {traces.length} trace entries
            </span>
            <button onClick={exportJSON} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> Export JSON
            </button>
          </div>
        </div>

        {/* Scrubber track */}
        <div style={{ position: 'relative', height: '36px', display: 'flex', alignItems: 'center' }}>
          {/* Track background */}
          <div style={{
            width: '100%', height: '4px', borderRadius: '2px',
            background: 'rgba(255,255,255,0.08)',
            position: 'relative'
          }}>
            {/* Filled portion */}
            <motion.div
              style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple), var(--accent-magenta))',
                boxShadow: '0 0 10px var(--accent-glow)'
              }}
              animate={{ width: `${scrubberPos}%` }}
            />
            {/* Tick marks for each trace */}
            {traces.map((_, i) => (
              <div key={i} style={{
                position: 'absolute', top: '-6px',
                left: `${((i + 1) / traces.length) * 100}%`,
                width: '2px', height: '16px', borderRadius: '1px',
                background: ((i + 1) / traces.length) * 100 <= scrubberPos ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          {/* Range input overlaid */}
          <input
            type="range" min="0" max="100" value={scrubberPos}
            onChange={(e) => setScrubberPos(Number(e.target.value))}
            style={{
              position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%)',
              appearance: 'none', background: 'transparent', cursor: 'pointer', height: '36px',
              WebkitAppearance: 'none'
            }}
          />
        </div>

        {/* Phase legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '12px' }}>
          {Object.entries(phaseConfig).map(([key, conf]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: conf.color }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: conf.color, boxShadow: `0 0 6px ${conf.color}` }} />
              {conf.label}
            </div>
          ))}
        </div>
      </div>

      {/* Trace entries */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {visibleTraces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Move the scrubber to reveal agent decision traces</p>
          </div>
        ) : (
          visibleTraces.map((trace, idx) => (
            <TraceEntry
              key={trace.id}
              trace={trace}
              index={idx}
              isExpanded={expandedId === trace.id}
              onToggle={() => setExpandedId(expandedId === trace.id ? null : trace.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AgentTraceView;
