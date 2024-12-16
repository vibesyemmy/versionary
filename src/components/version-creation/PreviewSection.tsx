import * as React from 'react';
import { VersionPreview } from '../../types/version';

interface PreviewSectionProps {
    preview: VersionPreview | null;
    isLoading: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ preview, isLoading }) => {
    if (isLoading) {
        return (
            <div className="preview-section">
                <div className="preview-loading">
                    Loading changes...
                </div>
            </div>
        );
    }

    if (!preview || (
        preview.modifiedLayers.length === 0 &&
        preview.addedLayers.length === 0 &&
        preview.deletedLayers.length === 0 &&
        preview.modifiedArtboards.length === 0
    )) {
        return (
            <div className="preview-section">
                <div className="preview-empty">
                    No changes detected in this version
                </div>
            </div>
        );
    }

    const totalChanges = 
        preview.modifiedLayers.length +
        preview.addedLayers.length +
        preview.deletedLayers.length +
        preview.modifiedArtboards.length;

    return (
        <div className="preview-section">
            <h4>Changes Summary</h4>
            <div className="changes-summary">
                {totalChanges} item{totalChanges === 1 ? '' : 's'} changed:
                {preview.modifiedLayers.length > 0 && ` ${preview.modifiedLayers.length} modified`}
                {preview.addedLayers.length > 0 && ` ${preview.addedLayers.length} added`}
                {preview.deletedLayers.length > 0 && ` ${preview.deletedLayers.length} deleted`}
                {preview.modifiedArtboards.length > 0 && ` ${preview.modifiedArtboards.length} artboards updated`}
            </div>
            
            <div className="modified-layers">
                {preview.modifiedLayers.map(layer => (
                    <div key={layer.id} className="layer-item">
                        <div className="layer-header">
                            <span className="layer-name">{layer.name}</span>
                            <span className="layer-type">{layer.type}</span>
                        </div>
                        <ul className="change-list">
                            {layer.changes.map((change, index) => (
                                <li key={index}>{change}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                
                {preview.addedLayers.map(layer => (
                    <div key={layer.id} className="layer-item">
                        <div className="layer-header">
                            <span className="layer-name">{layer.name}</span>
                            <span className="layer-type">{layer.type} (Added)</span>
                        </div>
                    </div>
                ))}
                
                {preview.deletedLayers.map(layer => (
                    <div key={layer.id} className="layer-item">
                        <div className="layer-header">
                            <span className="layer-name">{layer.name}</span>
                            <span className="layer-type">{layer.type} (Deleted)</span>
                        </div>
                    </div>
                ))}
                
                {preview.modifiedArtboards.map(layer => (
                    <div key={layer.id} className="layer-item">
                        <div className="layer-header">
                            <span className="layer-name">{layer.name}</span>
                            <span className="layer-type">Artboard</span>
                        </div>
                        <ul className="change-list">
                            {layer.changes.map((change, index) => (
                                <li key={index}>{change}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviewSection;
