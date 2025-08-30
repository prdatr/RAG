import { useState } from 'react';

export default function Upload({ onBack }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/upload');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      setTimeout(() => {
        setProgress(0);
      }, 500);
    };
    xhr.send(formData);
  };

  return (
    <div className="dashboard-card detail-card">
      <h3>Upload Files / Connect SharePoint</h3>
      <input
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md"
        onChange={e => setFile(e.target.files[0])}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleUpload} className="primary-btn">Upload</button>
        <button onClick={onBack} className="primary-btn" style={{ marginLeft: '0.5rem' }}>Back</button>
      </div>
      {progress > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div>Embedding progress: {progress}%</div>
          <div style={{ background:'#e5e7eb', borderRadius:'0.25rem', width:'100%', height:'10px' }}>
            <div style={{ width:`${progress}%`, height:'10px', background:'#2563eb', borderRadius:'0.25rem' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
