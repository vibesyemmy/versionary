console.log('Plugin code starting...');

figma.showUI(__html__, {
    width: 400,
    height: 600,
    themeColors: true
});

console.log('UI shown');

console.log('Plugin main script loaded');

figma.ui.onmessage = async (msg) => {
    console.log('Message received:', msg);
    
    if (msg.type === 'create-version') {
        console.log('Creating version...');
        // Handle version creation
        figma.notify('Version creation clicked!');
    }
};
