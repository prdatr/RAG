import { useState } from 'react';

// RAG application root component
import Upload from './config/Upload';
import LLM from './config/LLM';
import Analytics from './config/Analytics';
import Chatbot from './chat/Chatbot';
import './Dashboard.css';
import './RagApp.css';

const cards = [
  { id: 1, title: 'Upload', desc: 'Build knowledge base', action: 'upload' },
  { id: 2, title: 'LLM', desc: 'Configure LLM keys', action: 'llm' },
  { id: 3, title: 'Analytics', desc: 'Usage statistics', action: 'analytics' },
  { id: 4, title: 'Chatbot', desc: 'Ask questions', action: 'chat' },
];

export default function RagApp() {
  const [view, setView] = useState('menu');

  const renderView = () => {
    switch (view) {
      case 'upload':
        return <Upload onBack={() => setView('menu')} />;
      case 'llm':
        return <LLM onBack={() => setView('menu')} />;
      case 'analytics':
        return <Analytics onBack={() => setView('menu')} />;
      case 'chat':
        return <Chatbot onBack={() => setView('menu')} />;
      default:
        return (
          <div className="card-grid">
            {cards.map(c => (
              <div key={c.id} className="dashboard-card" onClick={() => setView(c.action)}>
                <div className="card-title">{c.title}</div>
                <div className="card-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>RAG</h1>
      </header>
      <section className="overview">
        {view === 'menu' && (
          <p style={{ marginBottom: '1rem' }}>Choose a section to configure or chat with your data.</p>
        )}
        {renderView()}
      </section>
    </div>
  );
}
