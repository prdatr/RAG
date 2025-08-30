import { useEffect, useState } from 'react';

export default function Analytics({ onBack }) {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/analytics')
      .then(r => r.json())
      .then(setMetrics)
      .catch(() => setMetrics([]));
  }, []);

  return (
    <div className="dashboard-card detail-card">
      <h3>Usage Analytics</h3>
      {metrics.length > 0 ? (
        <table style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr><th>Question</th><th>Source</th></tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={i}><td>{m.question}</td><td>{m.source}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ marginTop: '1rem' }}>No analytics yet.</div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={onBack} className="primary-btn">Back</button>
      </div>
    </div>
  );
}
