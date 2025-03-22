// Base record interface with common fields
export interface BaseRecord {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

// Podcast specific fields
export interface Podcast extends BaseRecord {
    title: string;
    description: string;
    published: boolean;
    publishedAt: Date | null;
}

// Episode specific fields
export interface Episode extends BaseRecord {}

// API Client specific fields
export interface ApiClient extends BaseRecord {
    description: string;
    token: string;
    isActive: boolean;
}

// Generic database adapter interface
export interface DatabaseAdapter<T extends BaseRecord> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T>;
    update(id: string, data: Partial<Omit<T, "id" | "created_at" | "updated_at">>): Promise<T>;
    delete(id: string): Promise<void>;
}

// Concrete adapter types
export type PodcastsAdapter = DatabaseAdapter<Podcast>;
export type EpisodesAdapter = DatabaseAdapter<Episode>;
export type ApiClientsAdapter = DatabaseAdapter<ApiClient>;
