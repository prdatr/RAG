import { useState } from 'react';

export default function Chatbot({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('kb');
  const [instructions, setInstructions] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, mode, instructions })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'bot', content: data.answer, refs: data.references }]);
      setInput('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-card detail-card chat-window">
      <div>
        <label>
          <input type="radio" checked={mode==='kb'} onChange={() => setMode('kb')} /> Knowledge Base
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input type="radio" checked={mode==='both'} onChange={() => setMode('both')} /> Knowledge Base + LLM
        </label>
      </div>
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        style={{ width: '100%', height: '60px', margin: '0.5rem 0' }}
      />
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.content}
            {m.refs && m.refs.length > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>References: {m.refs.join(', ')}</div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!input.trim()}>Send</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={onBack} className="primary-btn">Back</button>
      </div>
    </div>
  );
}
