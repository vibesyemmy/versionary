import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { VersionData, ValidationErrors, VersionPreview } from '../../types/version';
import { validateVersionData, isValidTag, formatTag } from '../../utils/validation';
import PreviewSection from './PreviewSection';

interface VersionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: VersionData) => Promise<void>;
    existingVersions?: string[];
}

const VersionModal: React.FC<VersionModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit,
    existingVersions = []
}) => {
    const [formData, setFormData] = useState<VersionData>({
        name: '',
        sprint: '',
        tags: [],
        description: ''
    });

    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<VersionPreview | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form data
        const validationErrors = validateVersionData(formData, existingVersions);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            setErrors(prev => ({ ...prev, submit: 'Failed to create version. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                sprint: '',
                tags: [],
                description: ''
            });
            setErrors({});
            setTagInput('');
            loadPreview();
        }
    }, [isOpen]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            
            // Close on escape
            if (e.key === 'Escape') {
                onClose();
            }
            
            // Submit on Cmd/Ctrl + Enter
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(new Event('submit') as any);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleSubmit]);

    // Load preview data
    const loadPreview = useCallback(async () => {
        setIsLoadingPreview(true);
        try {
            // Mock preview data for now
            const mockPreview: VersionPreview = {
                modifiedLayers: [
                    {
                        id: '1',
                        name: 'Button',
                        type: 'COMPONENT',
                        changes: ['Color updated', 'Size adjusted']
                    },
                    {
                        id: '2',
                        name: 'Header',
                        type: 'FRAME',
                        changes: ['New text added']
                    }
                ],
                addedLayers: [],
                deletedLayers: [],
                modifiedArtboards: []
            };
            setPreview(mockPreview);
        } catch (error) {
            console.error('Error loading preview:', error);
        } finally {
            setIsLoadingPreview(false);
        }
    }, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (name in errors) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof ValidationErrors];
                return newErrors;
            });
        }
    };

    // Handle tag input
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const tag = formatTag(tagInput);
        if (tag && isValidTag(tag) && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="version-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="version-modal">
                <div className="version-modal-header">
                    <h3>Create New Version</h3>
                    <button className="close-button" onClick={onClose} aria-label="Close">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="version-name">
                            Version Name*
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </label>
                        <input
                            id="version-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="e.g., Profile Redesign v2"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="sprint">
                            Sprint (Optional)
                            {errors.sprint && <span className="error-text">{errors.sprint}</span>}
                        </label>
                        <input
                            id="sprint"
                            type="text"
                            name="sprint"
                            value={formData.sprint}
                            onChange={handleInputChange}
                            className={errors.sprint ? 'error' : ''}
                            placeholder="e.g., Sprint 14"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="tags">
                            Tags
                            {errors.tags && <span className="error-text">{errors.tags}</span>}
                        </label>
                        <div className="tag-input-container">
                            <input
                                id="tags"
                                type="text"
                                value={tagInput}
                                onChange={handleTagInputChange}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="Add tags and press Enter"
                                className={errors.tags ? 'error' : ''}
                            />
                            <button type="button" onClick={addTag}>Add</button>
                        </div>
                        <div className="tags-container">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                    <button 
                                        type="button" 
                                        onClick={() => removeTag(tag)}
                                        aria-label={`Remove tag ${tag}`}
                                    >×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">
                            Description
                            {errors.description && <span className="error-text">{errors.description}</span>}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={errors.description ? 'error' : ''}
                            placeholder="Describe the changes in this version..."
                            rows={4}
                        />
                        <div className="character-count">
                            {formData.description.length}/500
                        </div>
                    </div>

                    <PreviewSection 
                        preview={preview} 
                        isLoading={isLoadingPreview} 
                    />

                    {errors.submit && (
                        <div className="error-text" style={{ marginBottom: '16px' }}>
                            {errors.submit}
                        </div>
                    )}

                    <div className="button-group">
                        <button 
                            type="button" 
                            className="secondary" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Version'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VersionModal;
