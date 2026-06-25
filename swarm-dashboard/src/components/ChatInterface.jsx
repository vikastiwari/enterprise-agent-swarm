import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { useSonicFeedback } from '../hooks/useSonicFeedback';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const ChatInterface = () => {
  const { chatMessages, addChatMessage } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { playMenuClick } = useSonicFeedback();

  const handleSend = async () => {
    if (!input.trim()) return;
    playMenuClick();
    
    const userMsg = { id: Date.now(), role: 'user', content: input };
    addChatMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: 'CUST-1001', message: input })
      });
      const data = await response.json();
      addChatMessage({ id: Date.now() + 1, role: 'bot', content: data.response || "No response received" });
    } catch (e) {
      addChatMessage({ id: Date.now() + 1, role: 'error', content: 'Connection to Swarm Orchestrator failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ minHeight: '300px', maxHeight: '600px', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem' }}>
        {chatMessages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '80%',
              border: msg.role === 'user' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ color: msg.role === 'user' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div style={{ color: msg.role === 'error' ? 'var(--accent-magenta)' : 'var(--text-main)', lineHeight: '1.5' }}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--accent-cyan)' }}>
            Swarm is thinking...
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          className="search-bar" 
          style={{ flex: 1, padding: '1rem' }} 
          placeholder="Ask the Swarm..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-primary" onClick={handleSend} disabled={isLoading}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
