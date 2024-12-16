export interface VersionData {
    name: string;
    sprint?: string;
    tags: string[];
    description: string;
}

export interface ValidationErrors {
    name?: string;
    sprint?: string;
    tags?: string;
    description?: string;
    submit?: string;
}

export interface ModifiedLayer {
    id: string;
    name: string;
    type: string;
    changes: string[];
}

export interface VersionPreview {
    modifiedLayers: ModifiedLayer[];
    addedLayers: ModifiedLayer[];
    deletedLayers: ModifiedLayer[];
    modifiedArtboards: ModifiedLayer[];
}

export interface VersionMetadata {
    createdAt: string;
    createdBy: string;
    fileKey: string;
    fileName: string;
}
