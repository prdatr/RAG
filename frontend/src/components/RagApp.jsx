import { useState } from 'react';
import Upload from './config/Upload';
import LLM from './config/LLM';
import Analytics from './config/Analytics';
import Chatbot from './chat/Chatbot';
import './RagApp.css';

export default function RagApp() {
  const [tab, setTab] = useState('config');
  const [configTab, setConfigTab] = useState('upload');

  const renderConfig = () => {
    switch (configTab) {
      case 'upload':
        return <Upload onNext={() => setConfigTab('llm')} />;
      case 'llm':
        return <LLM onNext={() => setConfigTab('analytics')} />;
      case 'analytics':
        return <Analytics />;
      default:
        return null;
    }
  };

  return (
    <div className="rag-container">
      <div className="rag-tabs">
        <button className={tab==='config'?'active':''} onClick={() => setTab('config')}>Configuration</button>
        <button className={tab==='chat'?'active':''} onClick={() => setTab('chat')}>Chatbot</button>
      </div>
      {tab === 'config' && (
        <div>
          <div className="config-tabs">
            <button className={configTab==='upload'?'active':''} onClick={() => setConfigTab('upload')}>Upload</button>
            <button className={configTab==='llm'?'active':''} onClick={() => setConfigTab('llm')}>LLM</button>
            <button className={configTab==='analytics'?'active':''} onClick={() => setConfigTab('analytics')}>Analytics</button>
          </div>
          {renderConfig()}
        </div>
      )}
      {tab === 'chat' && <Chatbot />}
    </div>
  );
}
