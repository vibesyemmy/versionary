import * as React from 'react';
import { useState, useEffect } from 'react';
import '../styles.css';

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
}

const App: React.FC = () => {
    const [formData, setFormData] = useState<VersionData>({
        name: '',
        sprint: '',
        tags: [],
        description: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [versions, setVersions] = useState<StoredVersion[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Listen for messages from the plugin code
        window.onmessage = (event) => {
            const msg = event.data.pluginMessage;
            if (msg.type === 'versions-updated') {
                setVersions(msg.versions);
            }
        };

        // Request initial versions
        parent.postMessage({ pluginMessage: { type: 'get-versions' } }, '*');
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting version:', formData);
        
        // Send message to plugin code
        parent.postMessage({ 
            pluginMessage: { 
                type: 'create-version',
                version: formData
            }
        }, '*');

        // Reset form
        setFormData({
            name: '',
            sprint: '',
            tags: [],
            description: ''
        });
        setShowForm(false);
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            height: '100%',
            overflow: 'auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 500
                }}>
                    Versions
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#18A0FB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    New Version
                </button>
            </div>

            {showForm ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px' }}>Version Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Homepage Redesign v1"
                            required
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5',
                                fontSize: '12px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px' }}>Sprint Number</label>
                        <input
                            type="text"
                            value={formData.sprint || ''}
                            onChange={e => setFormData(prev => ({ ...prev, sprint: e.target.value }))}
                            placeholder="e.g., Sprint 23"
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5',
                                fontSize: '12px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px' }}>Tags</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag"
                                style={{
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '12px',
                                    flex: 1
                                }}
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#F5F5F5',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: '#E8F2FF',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0 0 0 4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#666'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px' }}>Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the changes in this version..."
                            required
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5',
                                fontSize: '12px',
                                minHeight: '100px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#F5F5F5',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                flex: 1
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#18A0FB',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                flex: 1
                            }}
                        >
                            Create Version
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {versions.length === 0 ? (
                        <div style={{ 
                            padding: '32px', 
                            textAlign: 'center', 
                            color: '#666',
                            fontSize: '12px'
                        }}>
                            No versions created yet. Click "New Version" to create one.
                        </div>
                    ) : (
                        versions.map(version => (
                            <div
                                key={version.id}
                                style={{
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{ fontWeight: 500 }}>{version.name}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                        {formatDate(version.timestamp)}
                                    </div>
                                </div>
                                {version.sprint && (
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                        Sprint: {version.sprint}
                                    </div>
                                )}
                                {version.tags.length > 0 && (
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                        {version.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    backgroundColor: '#E8F2FF',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div style={{ fontSize: '12px' }}>
                                    {version.description}
                                </div>
                                <div style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '11px', 
                                    color: '#666',
                                    marginTop: '8px',
                                    borderTop: '1px solid #f0f0f0',
                                    paddingTop: '8px'
                                }}>
                                    <div>Created by {version.user}</div>
                                    <button
                                        onClick={() => {
                                            parent.postMessage({ 
                                                pluginMessage: { 
                                                    type: 'switch-version',
                                                    versionId: version.id
                                                }
                                            }, '*');
                                        }}
                                        style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#18A0FB',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '11px'
                                        }}
                                    >
                                        Switch to Version
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
