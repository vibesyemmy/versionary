import { VersionData, ValidationErrors } from '../types/version';

export const validateVersionData = (data: VersionData, existingVersions: string[] = []): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate name
    if (!data.name.trim()) {
        errors.name = 'Version name is required';
    } else if (data.name.length > 50) {
        errors.name = 'Version name must be less than 50 characters';
    } else if (existingVersions.includes(data.name.trim())) {
        errors.name = 'A version with this name already exists';
    }

    // Validate sprint (optional)
    if (data.sprint && data.sprint.length > 20) {
        errors.sprint = 'Sprint number must be less than 20 characters';
    }

    // Validate tags
    if (data.tags.length > 10) {
        errors.tags = 'Maximum 10 tags allowed';
    }

    // Validate description
    if (!data.description.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.length > 500) {
        errors.description = 'Description must be less than 500 characters';
    }

    return errors;
};

export const isValidTag = (tag: string): boolean => {
    // Tags should be 1-20 characters, alphanumeric with hyphens and underscores
    return /^[a-zA-Z0-9-_]{1,20}$/.test(tag);
};

export const formatTag = (tag: string): string => {
    // Remove spaces and special characters, convert to lowercase
    return tag.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
};
