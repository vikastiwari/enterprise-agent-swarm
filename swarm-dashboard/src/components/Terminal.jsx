import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Trash2, Download, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'react-window';
import { useSonicFeedback } from '../hooks/useSonicFeedback';

const Toast = ({ message, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(0, 240, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--accent-cyan)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
        }}
      >
        <Check size={18} color="var(--accent-cyan)" />
        <span style={{ fontWeight: '500', letterSpacing: '0.5px' }}>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const LogLine = ({ index, style, logs, onCopy }) => {
  const log = logs[index];
  const [isHovered, setIsHovered] = useState(false);
  const color = log.type === 'INFO' ? '#00f0ff' : log.type === 'WARN' ? '#ffcc00' : '#ff003c';
  
  const timestamp = `[2026-06-22 14:${String(30+index).padStart(2,'0')}:${String((index*13)%60).padStart(2,'0')}]`;
  const fullLog = `${timestamp} [${log.type}] ${log.text}`;

  return (
    <div 
      style={{
        ...style,
        padding: '4px 8px', 
        background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span style={{ color: 'var(--text-muted)' }}>{timestamp}</span>{' '}
        <span style={{ color, fontWeight: 'bold' }}>[{log.type}]</span>{' '}
        <span style={{ color: 'var(--text-main)' }}>{log.text}</span>
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onCopy(fullLog)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 240, 255, 0.2)',
              border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem'
            }}
          >
            <Copy size={12} /> Copy
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const Terminal = ({ logs, isVisible, forceExpanded }) => {
  const listRef = useRef(null);
  const [clearedLogs, setClearedLogs] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const { playClick, playSuccess, playError } = useSonicFeedback();
  
  const displayLogs = logs.filter(log => !clearedLogs.includes(log));

  useEffect(() => {
    if (listRef.current && displayLogs.length > 0) {
      listRef.current.scrollToRow({ index: displayLogs.length - 1, align: 'end' });
    }
  }, [displayLogs.length]);

  if (!isVisible) return null;

  const handleClear = () => {
    playError();
    setClearedLogs([...logs]);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleExport = () => {
    playClick();
    const text = displayLogs.map((log, i) => `[2026-06-22 14:${String(30+i).padStart(2,'0')}:${String((i*13)%60).padStart(2,'0')}] [${log.type}] ${log.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orchestrator_logs.txt';
    a.click();
    URL.revokeObjectURL(url);
    playSuccess();
    showToast('Logs Exported to File!');
  };

  const handleCopy = (text) => {
    playClick();
    navigator.clipboard.writeText(text);
    showToast('Log Copied to Clipboard!');
  };

  const handleCopyAll = () => {
    playClick();
    const text = displayLogs.map((log, i) => `[2026-06-22 14:${String(30+i).padStart(2,'0')}:${String((i*13)%60).padStart(2,'0')}] [${log.type}] ${log.text}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('All Logs Copied to Clipboard!');
  };

  return (
    <>
      <Toast message={toastMessage} isVisible={!!toastMessage} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginTop: forceExpanded ? '0' : '2rem',
          height: forceExpanded ? '100%' : 'auto',
          minHeight: forceExpanded ? '600px' : 'auto',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 -4px 30px rgba(0, 240, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
        {/* Terminal Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalIcon size={14} color="var(--accent-cyan)" />
            Live Orchestrator Telemetry
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handleCopyAll} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '6px' }}>
              <Copy size={12} /> Copy All
            </button>
            <button onClick={handleExport} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '6px' }}>
              <Download size={12} /> Export
            </button>
            <button onClick={handleClear} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '6px', background: 'rgba(255, 0, 60, 0.1)', borderColor: 'var(--accent-magenta)', color: 'var(--accent-magenta)' }}>
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{
          padding: '16px',
          flex: 1,
          height: forceExpanded ? '600px' : '220px',
          fontFamily: '"Fira Code", monospace',
          fontSize: '0.85rem',
          lineHeight: '1.6',
        }}>
          <List
            listRef={listRef}
            style={{ height: forceExpanded ? 550 : 200, width: "100%" }}
            rowCount={displayLogs.length}
            rowHeight={30}
            rowProps={{ logs: displayLogs, onCopy: handleCopy }}
            rowComponent={LogLine}
          />
          
          <div style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--accent-cyan)', animation: 'blink 1s step-end infinite', marginTop: '4px' }}></div>
        </div>
      </motion.div>
    </>
  );
};

export default Terminal;
