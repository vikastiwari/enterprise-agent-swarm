import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore } from '../store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useStore((state) => state.login);
  const addToast = useStore((state) => state.addToast);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      if (username && password) {
        login(username, password);
        addToast('Authentication successful. Welcome back, Admin.', 'success');
      } else {
        setError('Invalid credentials');
        addToast('Authentication failed. Please check your credentials.', 'error');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'var(--bg-dark)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '400px', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '12px', boxShadow: '0 0 20px var(--accent-cyan)', marginBottom: '1rem' }} />
          <h1 className="gradient-text" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Autonomous AI Studio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Personnel Only</p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Admin Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Access Key" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '14px' }}
          >
            {isLoading ? (
              <span className="spin"><RefreshCw size={20} /></span>
            ) : (
              <>Initiate Handshake <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
