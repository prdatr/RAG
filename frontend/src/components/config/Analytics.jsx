import { useEffect, useState } from 'react';

export default function Analytics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/analytics').then(r => r.json()).then(setMetrics);
  }, []);

  return (
    <div>
      <h3>Usage Analytics</h3>
      <table>
        <thead>
          <tr><th>Question</th><th>Source</th></tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i}><td>{m.question}</td><td>{m.source}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
