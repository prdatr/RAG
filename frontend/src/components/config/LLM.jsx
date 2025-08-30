import { useState } from 'react';

export default function LLM({ onNext }) {
  const [provider, setProvider] = useState('gemini');
  const [endpoint, setEndpoint] = useState('');
  const [key, setKey] = useState('');

  const saveConfig = async () => {
    await fetch('http://localhost:8000/llm-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, endpoint, key })
    });
    onNext();
  };

  return (
    <div>
      <h3>LLM Configuration</h3>
      <div>
        <label>Select LLM: </label>
        <select value={provider} onChange={e => setProvider(e.target.value)}>
          <option value="gemini">Gemini</option>
          <option value="azure">Azure OpenAI</option>
        </select>
      </div>
      <div>
        <input type="text" placeholder="Endpoint" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="API Key" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <button onClick={saveConfig}>Next</button>
    </div>
  );
}
