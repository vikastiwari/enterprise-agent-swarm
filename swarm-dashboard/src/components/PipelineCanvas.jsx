import React, { useMemo, useCallback } from 'react';
import { ReactFlow, Background, MarkerType, Handle, Position, Panel, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bot, Video, Mic, PenTool, LayoutTemplate, ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';
import { useSonicFeedback } from '../hooks/useSonicFeedback';

const CustomNode = ({ data }) => {
  const isActive = data.status === 'active' || data.status === 'running';
  const isComplete = data.status === 'complete';

  const statusColor = isActive ? 'var(--accent-cyan)' : isComplete ? 'var(--accent-magenta)' : '#a0a0b0';

  return (
    <div className={isActive ? 'node-pulse' : ''} style={{
      background: 'rgba(20, 20, 30, 0.8)',
      border: `1px solid ${isActive ? 'var(--accent-cyan)' : isComplete ? 'var(--accent-magenta)' : 'var(--border-subtle)'}`,
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '220px',
      boxShadow: isActive ? '0 0 25px var(--accent-cyan), inset 0 0 10px var(--accent-cyan)' : 'none',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: 'var(--accent-cyan)', width: '8px', height: '8px', border: 'none', marginLeft: '-4px' }} 
      />
      
      <div style={{ color: statusColor }}>
        {data.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{data.label}</div>
        <div style={{ fontSize: '0.7rem', color: statusColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {isActive ? 'Executing...' : isComplete ? 'Done' : 'Waiting'}
        </div>
      </div>
      {isActive && (
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
          {Math.round(data.progress)}%
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: 'var(--accent-magenta)', width: '8px', height: '8px', border: 'none', marginRight: '-4px' }} 
      />
    </div>
  );
};

const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Panel position="bottom-center" style={{ 
      display: 'flex', 
      gap: '12px', 
      padding: '10px 16px', 
      background: 'rgba(10, 15, 25, 0.85)', 
      backdropFilter: 'blur(12px)', 
      borderRadius: '12px', 
      border: '1px solid rgba(0, 240, 255, 0.3)', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      marginBottom: '10px'
    }}>
      <button className="custom-control-btn hover-cyan" onClick={() => zoomIn()} title="Zoom In">
        <ZoomIn size={18} />
      </button>
      <button className="custom-control-btn hover-magenta" onClick={() => zoomOut()} title="Zoom Out">
        <ZoomOut size={18} />
      </button>
      <button className="custom-control-btn hover-green" onClick={() => fitView({ duration: 800, padding: 0.2 })} title="Fit View">
        <Maximize size={18} />
      </button>
      <button className="custom-control-btn hover-yellow" onClick={() => fitView({ duration: 800 })} title="Interactive Toggle">
        <MousePointer2 size={18} />
      </button>
    </Panel>
  );
};

const nodeTypes = { custom: CustomNode };

const getIconForStage = (title) => {
  const t = title.toLowerCase();
  if (t.includes('video') || t.includes('wan')) return <Video size={20} />;
  if (t.includes('audio') || t.includes('voice')) return <Mic size={20} />;
  if (t.includes('script') || t.includes('prompt')) return <PenTool size={20} />;
  if (t.includes('assembly') || t.includes('review')) return <LayoutTemplate size={20} />;
  return <Bot size={20} />;
};

const PipelineCanvas = ({ stages }) => {
  const { playNodeSelect } = useSonicFeedback();

  const nodes = useMemo(() => {
    return stages.map((stage, index) => ({
      id: `node-${index}`,
      type: 'custom',
      position: { x: 280 * index, y: 120 + (index % 2 === 0 ? -40 : 40) }, // Zig-zag pattern
      data: { 
        label: stage.title, 
        status: stage.status, 
        progress: stage.progress,
        icon: getIconForStage(stage.title)
      }
    }));
  }, [stages]);

  const edges = useMemo(() => {
    const edgeList = [];
    for (let i = 0; i < stages.length - 1; i++) {
      const sourceActive = stages[i].status === 'active' || stages[i].status === 'running' || stages[i].status === 'complete';
      const isAnimating = sourceActive && stages[i+1].status !== 'complete';
      
      edgeList.push({
        id: `edge-${i}-${i+1}`,
        source: `node-${i}`,
        target: `node-${i+1}`,
        animated: isAnimating,
        style: {
          stroke: isAnimating ? 'var(--accent-cyan)' : sourceActive ? 'var(--accent-magenta)' : 'var(--border-subtle)',
          strokeWidth: 2,
          filter: isAnimating ? 'drop-shadow(0 0 5px var(--accent-cyan))' : 'none'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isAnimating ? 'var(--accent-cyan)' : sourceActive ? 'var(--accent-magenta)' : 'var(--border-subtle)',
        },
      });
    }
    return edgeList;
  }, [stages]);

  return (
    <div style={{ width: '100%', height: '350px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 20, y: 80, zoom: 0.9 }}
        minZoom={0.5}
        maxZoom={1.5}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={() => playNodeSelect()}
      >
        <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
        <CustomControls />
      </ReactFlow>
    </div>
  );
};

export default PipelineCanvas;
