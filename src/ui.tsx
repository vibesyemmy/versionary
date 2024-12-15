import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// Add this to debug any errors during initialization
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

console.log('Script loaded');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    
    try {
        const container = document.getElementById('root');
        if (!container) {
            console.error('Root element not found');
            return;
        }
        
        console.log('Root element found, rendering App');
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log('App rendered');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
});
