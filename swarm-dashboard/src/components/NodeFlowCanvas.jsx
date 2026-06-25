import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Handle, 
  Position,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getBezierPath
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle2, Activity, Clock, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Miniature sparkline SVG inside nodes
const MiniSparkline = ({ progress, isActive }) => {
  const points = useMemo(() => {
    const pts = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 100;
      const base = isActive ? Math.sin(i * 0.8 + progress * 0.05) * 8 : 0;
      const noise = isActive ? (Math.random() - 0.5) * 4 : 0;
      const y = 15 - base - noise;
      pts.push(`${x},${Math.max(2, Math.min(28, y))}`);
    }
    return pts.join(' ');
  }, [progress, isActive]);

  return (
    <svg width="100" height="30" viewBox="0 0 100 30" style={{ opacity: isActive ? 1 : 0.3 }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparkGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Animated mini-terminal showing agent "thoughts"
const MiniTerminal = ({ status, title }) => {
  const thoughts = useMemo(() => {
    if (status === 'active') {
      return [
        `▸ Processing ${title.split('(')[0].trim()}...`,
        '▸ Allocating GPU resources...'
      ];
    }
    if (status === 'complete') {
      return ['✓ Task completed successfully'];
    }
    return ['◦ Awaiting upstream signal...'];
  }, [status, title]);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      borderRadius: '4px',
      padding: '4px 6px',
      fontFamily: '"Fira Code", monospace',
      fontSize: '0.55rem',
      lineHeight: '1.4',
      color: status === 'active' ? 'var(--accent-cyan)' : (status === 'complete' ? '#00e676' : 'var(--text-muted)'),
      maxHeight: '28px',
      overflow: 'hidden'
    }}>
      {thoughts.map((t, i) => (
        <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</div>
      ))}
    </div>
  );
};

// Elite Custom Node — a micro-application
const CustomAgentNode = ({ data }) => {
  const statusColors = {
    active: { border: 'var(--accent-cyan)', bg: 'rgba(0, 240, 255, 0.08)', glow: '0 0 25px rgba(0, 240, 255, 0.4), 0 0 50px rgba(0, 240, 255, 0.15)' },
    complete: { border: '#00e676', bg: 'rgba(0, 230, 118, 0.08)', glow: '0 0 15px rgba(0, 230, 118, 0.3)' },
    pending: { border: 'var(--border-subtle)', bg: 'var(--bg-dark)', glow: 'none' }
  };

  const colors = statusColors[data.status] || statusColors.pending;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        boxShadow: colors.glow,
        color: 'white',
        minWidth: '200px',
        maxWidth: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease'
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent-cyan)', width: '8px', height: '8px', border: '2px solid var(--bg-dark)' }} />
      
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: data.status === 'active' ? 'var(--accent-cyan)' : (data.status === 'complete' ? '#00e676' : 'var(--text-muted)'),
            boxShadow: data.status === 'active' ? '0 0 8px var(--accent-cyan)' : 'none',
            animation: data.status === 'active' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none'
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 'bold', letterSpacing: '-0.02em' }}>{data.title}</span>
        </div>
        {data.status === 'complete' && <CheckCircle2 size={14} color="#00e676" />}
        {data.status === 'active' && <Activity size={14} color="var(--accent-cyan)" className="spin" />}
        {data.status === 'pending' && <Clock size={14} color="var(--text-muted)" />}
      </div>
      
      {/* Sparkline telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Cpu size={10} color="var(--text-muted)" />
        <MiniSparkline progress={data.progress} isActive={data.status === 'active'} />
      </div>

      {/* Progress bar (only when active) */}
      {data.status === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            <span>Progress</span>
            <span style={{ color: 'var(--accent-magenta)', fontWeight: 'bold' }}>{Math.round(data.progress)}%</span>
          </div>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '2px', boxShadow: '0 0 8px var(--accent-cyan)' }}
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Mini terminal */}
      <MiniTerminal status={data.status} title={data.title} />

      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent-magenta)', width: '8px', height: '8px', border: '2px solid var(--bg-dark)' }} />
    </motion.div>
  );
};

// Custom animated edge with pulse effect
const PulseEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  
  const isAnimated = data?.animated;
  const isComplete = data?.complete;
  const edgeColor = isComplete ? '#00e676' : 'var(--accent-cyan)';

  return (
    <>
      {/* Glow layer */}
      {isAnimated && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: edgeColor,
            strokeWidth: 6,
            opacity: 0.15,
            filter: 'blur(4px)'
          }}
        />
      )}
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: isAnimated ? 2.5 : 1.5,
          strokeDasharray: isAnimated ? '8 4' : 'none',
          opacity: isComplete ? 0.8 : (isAnimated ? 1 : 0.3),
          ...style
        }}
      />
      {/* Animated traveling particle on active edges */}
      {isAnimated && (
        <circle r="3" fill={edgeColor} filter={`drop-shadow(0 0 4px ${edgeColor})`}>
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
};

const nodeTypes = {
  customAgent: CustomAgentNode,
};

const edgeTypes = {
  pulse: PulseEdge,
};

export default function NodeFlowCanvas({ stages, isRunning }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Transform raw stages into React Flow nodes and edges
  useEffect(() => {
    if (!stages || stages.length === 0) return;

    // Stagger nodes vertically in a sine-wave pattern for visual interest
    const newNodes = stages.map((stage, idx) => ({
      id: `node-${idx}`,
      type: 'customAgent',
      position: { x: idx * 280 + 40, y: 80 + Math.sin(idx * 0.8) * 30 },
      data: { 
        title: stage.title,
        status: stage.status,
        progress: stage.progress
      }
    }));

    const newEdges = stages.slice(0, -1).map((_, idx) => ({
      id: `edge-${idx}-${idx+1}`,
      source: `node-${idx}`,
      target: `node-${idx+1}`,
      type: 'pulse',
      data: {
        animated: stages[idx].status === 'active' || stages[idx+1].status === 'active',
        complete: stages[idx].status === 'complete'
      }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [stages, setNodes, setEdges]);

  return (
    <div style={{ 
      width: '100%', 
      height: '320px', 
      background: 'rgba(0,0,0,0.3)', 
      borderRadius: '12px', 
      border: '1px solid var(--border-subtle)', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Subtle grid overlay effect */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(138, 43, 226, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 1
      }} />
      
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        defaultViewport={{ x: 20, y: 80, zoom: 0.9 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="rgba(255,255,255,0.03)" gap={20} size={1} />

      </ReactFlow>
    </div>
  );
}
