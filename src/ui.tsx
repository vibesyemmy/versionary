import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles.css';

// Type for error handling
type ErrorType = Error | string;

// Figma-specific error handling
const handleError = (error: ErrorType, details?: unknown) => {
    console.error('Plugin Error:', {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        details: details ? JSON.stringify(details) : undefined
    });
};

// Log environment info
console.log('Plugin Environment:', {
    'React Version': React.version,
    'Plugin UI Mode': true
});

function initializeApp() {
    console.log('Initializing Versionary plugin...');
    
    try {
        // Get the root element
        const container = document.getElementById('root');
        if (!container) {
            throw new Error('Root element (#root) not found in the DOM');
        }
        
        console.log('Root container found');
        
        // Create React root
        console.log('Creating React root...');
        const root = createRoot(container);
        
        // Render the app
        console.log('Rendering App component...');
        root.render(
            <div style={{ 
                width: '100%', 
                height: '100%', 
                background: '#ffffff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <App />
            </div>
        );
        
        console.log('Initial render completed');
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        handleError(errorMessage);
        
        // Try to render a fallback error UI
        try {
            const container = document.getElementById('root');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; color: red;">
                        <h2>Error Initializing Plugin</h2>
                        <pre>${errorMessage}</pre>
                    </div>
                `;
            }
        } catch (fallbackError) {
            const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Failed to render error UI';
            handleError(fallbackMessage);
        }
    }
}

// Initialize immediately
initializeApp();
