import { useState } from 'react';

const tabs = ['Assets', 'Structure', 'Listing', 'One-pager'] as const;

type Tab = typeof tabs[number];

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Assets');
  const [appName, setAppName] = useState('');
  const [platform, setPlatform] = useState('IOS');
  const [url, setUrl] = useState('');
  const [uploadScreenshots, setUploadScreenshots] = useState(false);

  const createApp = async () => {
    // TODO: integrate with API
    setShowModal(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <button onClick={() => setShowModal(true)}>Create App</button>
      {showModal && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20 }}>
          <h2>Create App</h2>
          <div>
            <label>Name</label>
            <input value={appName} onChange={e => setAppName(e.target.value)} />
          </div>
          <div>
            <label>Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="IOS">iOS</option>
              <option value="ANDROID">Android</option>
              <option value="WEB">Web</option>
            </select>
          </div>
          <div>
            <label>App URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} disabled={uploadScreenshots} />
            <div>
              <label>
                <input type="checkbox" checked={uploadScreenshots} onChange={e => setUploadScreenshots(e.target.checked)} />
                I'll upload screenshots
              </label>
            </div>
          </div>
          <button onClick={createApp}>Save</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
      <div style={{ marginTop: 40 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ marginRight: 8 }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        {activeTab === 'Assets' && (
          <div>
            <h2>Assets</h2>
            <p>Upload logo, brand colors, fonts.</p>
          </div>
        )}
        {activeTab === 'Structure' && (
          <div>
            <h2>Structure</h2>
            <p>Crawl or upload flow.</p>
          </div>
        )}
        {activeTab === 'Listing' && (
          <div>
            <h2>Listing</h2>
            <p>Generate and preview store text and screenshots.</p>
          </div>
        )}
        {activeTab === 'One-pager' && (
          <div>
            <h2>One-pager</h2>
            <p>Pick theme, preview and publish.</p>
          </div>
        )}
      </div>
    </div>
  );
}
