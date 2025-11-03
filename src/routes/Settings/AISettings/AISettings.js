import React, { useCallback, useEffect, useState } from 'react';

const LOCALSTORAGE_KEY = 'gemini_api_key';

function getGeminiApiKey() {
  return localStorage.getItem(LOCALSTORAGE_KEY) || '';
}

function setGeminiApiKey(key) {
  if (key) {
    localStorage.setItem(LOCALSTORAGE_KEY, key);
  } else {
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }
}

const AISettings = React.forwardRef(function AISettings(_, ref) {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    const key = getGeminiApiKey();
    setApiKey(key);
    setSavedKey(key);
  }, []);

  const handleChange = useCallback((e) => {
    setApiKey(e.target.value);
    setStatus('idle');
  }, []);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      setGeminiApiKey(apiKey.trim());
      setSavedKey(apiKey.trim());
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1200);
    },
    [apiKey]
  );

  const handleClear = useCallback(() => {
    setApiKey('');
    setGeminiApiKey('');
    setStatus('idle');
    setSavedKey('');
  }, []);

  return (
    <section ref={ref} style={{ padding: '1.5rem 1rem', border: '1px solid #ececec', borderRadius: 8, marginTop: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 10 }}>AI / Recommendation Settings</h2>
      <form onSubmit={handleSave} style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="gemini-api-key" style={{ fontWeight: 500 }}>
            Gemini API Key:
          </label>
          <input
            id="gemini-api-key"
            type="text"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={handleChange}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 8,
              border: '1px solid #c4c4c4',
              borderRadius: 4,
              fontSize: 14
            }}
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={!apiKey || apiKey === savedKey} style={{ padding: '7px 18px', borderRadius: 4, fontSize: 14 }}>
          Save
        </button>
        <button type="button" onClick={handleClear} disabled={!savedKey} style={{ padding: '7px 18px', borderRadius: 4, fontSize: 14 }}>
          Clear
        </button>
      </form>
      {status === 'saved' && (
        <div style={{ color: 'green', marginTop: 8, fontSize: 14 }}>API Key saved!</div>
      )}
      <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        Your API key is only stored in this browser (localStorage). It is not sent to any server other than Gemini.
      </p>
    </section>
  );
});

export { getGeminiApiKey };
export default AISettings;