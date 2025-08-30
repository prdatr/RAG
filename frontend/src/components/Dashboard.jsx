import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const cards = [
  { id: 1, title: 'Discovery', desc: 'Identify problems & requirements.' },
  { id: 2, title: 'Planning', desc: 'Create epics, features and stories.' },
  { id: 3, title: 'Development', desc: 'Manage sprints and track progress.' },
  { id: 4, title: 'Testing', desc: 'Track test cases and quality.' },
  { id: 5, title: 'RAG', desc: 'Retrieval augmented generation chat.', action: '/rag' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Everything AI - Your AI Companion for SDLC 🚀</h1>
        <p className="subtitle">Your AI-powered software development lifecycle platform</p>
        <div className="header-actions">
          <button className="primary-btn">View Projects</button>
          <button className="primary-btn">AI Agents</button>
        </div>
      </header>
      <section className="overview">
        <div className="overview-header">
          <h2>SDLC Process Overview</h2>
          <button className="create-btn">Create New Project</button>
        </div>
        <div className="card-grid">
          {cards.map(card => (
            <div key={card.id} className="dashboard-card" onClick={() => card.action && navigate(card.action)}>
              <div className="card-title">{card.id}. {card.title}</div>
              <div className="card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
