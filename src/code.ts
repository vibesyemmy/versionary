console.log('Plugin code starting...');

figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true
});

console.log('UI shown');

// Types
interface VersionData {
    name: string;
    sprint?: string;
    tags: string[];
    description: string;
}

interface StoredVersion extends VersionData {
    id: string;
    timestamp: string;
    user: string;
    fileKey: string;
    documentState: string;
}

// Constants
const STORAGE_KEY = 'versions';

// Helper functions
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getStoredVersions = async (): Promise<StoredVersion[]> => {
    try {
        const versions = await figma.clientStorage.getAsync(STORAGE_KEY);
        return versions || [];
    } catch (error) {
        console.error('Error getting stored versions:', error);
        return [];
    }
};

const storeVersion = async (version: StoredVersion): Promise<void> => {
    try {
        const versions = await getStoredVersions();
        versions.push(version);
        await figma.clientStorage.setAsync(STORAGE_KEY, versions);
    } catch (error) {
        console.error('Error storing version:', error);
        throw error;
    }
};

const serializeDocument = (): string => {
    return JSON.stringify(figma.root);
};

const applyDocumentState = (_documentState: string): void => {
    // TODO: Implement the actual state restoration logic
    // This will require careful handling of all document elements
    figma.notify('Version switching coming soon!', { timeout: 2000 });
};

// Set up error handling for the plugin
const handleError = (error: Error) => {
  console.error('Plugin error:', error);
  figma.notify('An error occurred', { error: true });
};

figma.ui.onmessage = async (msg: { type: string; version?: VersionData; versionId?: string }) => {
  try {
    console.log('Message received:', msg);
    
    switch (msg.type) {
        case 'create-version':
            if (!msg.version) {
                throw new Error('No version data provided');
            }

            // Create stored version object
            const newVersion: StoredVersion = {
                ...msg.version,
                id: generateId(),
                timestamp: new Date().toISOString(),
                user: figma.currentUser?.name || 'Unknown',
                fileKey: figma.fileKey || 'unknown-file',
                documentState: serializeDocument()
            };

            // Store the version
            await storeVersion(newVersion);
            
            // Notify success
            figma.notify(`Version "${newVersion.name}" created successfully!`);
            
            // Send updated versions list to UI
            const versions = await getStoredVersions();
            figma.ui.postMessage({ 
                type: 'versions-updated',
                versions 
            });
            break;

        case 'switch-version':
            if (!msg.versionId) {
                throw new Error('No version ID provided');
            }

            const allVersions = await getStoredVersions();
            const targetVersion = allVersions.find(v => v.id === msg.versionId);
            
            if (!targetVersion) {
                throw new Error('Version not found');
            }

            // Apply the version's document state
            applyDocumentState(targetVersion.documentState);
            
            // Notify success
            figma.notify(`Switched to version "${targetVersion.name}"`);
            break;

        case 'get-versions':
            const storedVersions = await getStoredVersions();
            figma.ui.postMessage({ 
                type: 'versions-updated',
                versions: storedVersions 
            });
            break;

        default:
            console.log('Unknown message type:', msg.type);
    }
  } catch (error) {
    handleError(error as Error);
  }
};
