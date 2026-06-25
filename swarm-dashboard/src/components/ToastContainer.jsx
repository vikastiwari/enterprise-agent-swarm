import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store';

const ToastContainer = () => {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let color = 'var(--accent-cyan)';
          let bg = 'rgba(0, 240, 255, 0.1)';
          let border = 'var(--accent-cyan)';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            color = '#00e676';
            bg = 'rgba(0, 230, 118, 0.1)';
            border = '#00e676';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            color = '#ff1744';
            bg = 'rgba(255, 23, 68, 0.1)';
            border = '#ff1744';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            color = '#ffea00';
            bg = 'rgba(255, 234, 0, 0.1)';
            border = '#ffea00';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              style={{
                pointerEvents: 'auto',
                background: 'var(--bg-card)',
                borderLeft: `4px solid ${border}`,
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-3d)',
                minWidth: '280px'
              }}
            >
              <div style={{ padding: '6px', background: bg, borderRadius: '50%', display: 'flex', color: color }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  {toast.message}
                </div>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
