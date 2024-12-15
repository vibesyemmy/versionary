import * as React from 'react';

const App: React.FC = () => {
    console.log('App component rendering');
    return (
        <div style={{ padding: '20px', color: '#000' }}>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Versionary</h1>
            <div style={{ height: '20px' }} />
            <button 
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: '#18A0FB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
                onClick={() => {
                    console.log('Create Version clicked');
                    parent.postMessage({ pluginMessage: { type: 'create-version' } }, '*');
                }}
            >
                Create Version
            </button>
        </div>
    );
};

export default App;
