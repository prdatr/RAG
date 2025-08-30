import { useState, useEffect } from 'react';

export default function LLM({ onBack }) {
  const [provider, setProvider] = useState('gemini');
  const [endpoint, setEndpoint] = useState('');
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/llm-config')
      .then(res => res.json())
      .then(data => {
        if (data.provider) setProvider(data.provider);
        if (data.endpoint) setEndpoint(data.endpoint);
        if (data.key) setKey(data.key);
        if (!data.endpoint && data.provider === 'gemini') {
          setEndpoint('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent');
        }
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('llm-config') || '{}');
        if (local.provider) setProvider(local.provider);
        if (local.endpoint) setEndpoint(local.endpoint);
        if (local.key) setKey(local.key);
      });
  }, []);

  const saveConfig = async () => {
    const payload = { provider, endpoint, key };
    await fetch('http://localhost:8000/llm-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setSaved(true);
    localStorage.setItem('llm-config', JSON.stringify(payload));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="dashboard-card detail-card">
      <h3>LLM Configuration</h3>
      <div style={{ marginTop: '0.5rem' }}>
        <label>Select LLM: </label>
        <select value={provider} onChange={e => setProvider(e.target.value)}>
          <option value="gemini">Gemini</option>
          <option value="azure">Azure OpenAI</option>
        </select>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <input type="text" placeholder="Endpoint" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <input type="password" placeholder="API Key" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={saveConfig} className="primary-btn">Save</button>
        <button onClick={onBack} className="primary-btn" style={{ marginLeft: '0.5rem' }}>Back</button>
        {saved && <span style={{ marginLeft: '0.5rem' }}>Saved!</span>}
      </div>
    </div>
  );
}
