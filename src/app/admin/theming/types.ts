export interface OptimizedImage {
    size: string;
    width: number;
    paths: {
        webp: string;
        jpeg: string;
    };
}

export interface ThemingImageState {
    type: 'url' | 'upload' | 'default';
    url?: string;
    uploadedImage?: File;
    previewUrl: string | null;
    isLoading: boolean;
    error: string | null;
    optimizedImages: OptimizedImage[];
}

export interface ThemingImageActions {
    onUpload: (file: File) => Promise<void>;
    onUrlSubmit: (url: string) => Promise<void>;
    onReset: () => void;
}

export type ThemingImageContextType = ThemingImageState & ThemingImageActions; 