// Base record interface with common fields
export interface BaseRecord {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

// Podcast specific fields
export interface Podcast extends BaseRecord {
    title: string;
    description: string;
    published: boolean;
    published_at: Date | null;
}

// Episode specific fields
export interface Episode extends BaseRecord {}

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
