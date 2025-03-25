import { Role } from "next-auth";
import { Prisma } from "@prisma/client";

// Base record interface with common fields
export interface BaseRecord {
    createdAt: Date;
    updatedAt: Date;
}

// User specific fields
export interface User extends BaseRecord {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    role: Role;
    isActive: boolean;
    accounts: Account[];
}

// Account specific fields (for OAuth providers)
export interface Account extends BaseRecord {
    id: string;
    name: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
}

// Podcast specific fields
export interface Podcast extends BaseRecord {
    id: number;
    title: string;
    slug: string;
    description: string;
    published: boolean;
    publishedAt: Date | null;
    heroImageId?: number | null;
}

// Episode specific fields
export interface Episode extends BaseRecord {
    id: number;
    title: string;
    slug: string;
    description: string;
    podcastId: number;
    published: boolean;
    publishedAt: Date | null;
    heroImageId?: number | null;
}

// API Client specific fields
export interface ApiClient extends BaseRecord {
    id: number;
    name: string;
    description: string;
    token: string;
    isActive: boolean;
}

// Variable specific fields
export interface Variable extends BaseRecord {
    id: number;
    name: string;
    value: string;
}

export interface FileMetadata extends BaseRecord {
    id: string;
    name: string;
    path: string;
    size: number;
    mimeType: string;
    width: number | null;
    height: number | null;
    duration: number | null;
    url: string;
    extension: string;
}

export interface HeroImage extends BaseRecord {
    id: number;
    name: string;
    description: string;
    fileId: string;
    podcastId?: number | null;
    episodeId?: number | null;
    urlTo?: string | null;
    file: FileMetadata;
    podcast?: Podcast;
    episode?: Episode;
}

// Generic database adapter interface
export interface DatabaseAdapter<T extends BaseRecord> {
    getAll(tx?: Prisma.TransactionClient): Promise<T[]>;
    getById(id: string, tx?: Prisma.TransactionClient): Promise<T | null>;
    create(data: Omit<T, "id" | "createdAt" | "updatedAt">, tx?: Prisma.TransactionClient): Promise<T>;
    update(
        id: string,
        data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<T>;
    delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

// Database adapter where the id is a string (UUID)
export interface UuidDatabaseAdapter<T extends BaseRecord> extends DatabaseAdapter<T> {
    getById(id: string, tx?: Prisma.TransactionClient): Promise<T | null>;
    update(
        id: string,
        data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<T>;
    delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

// Database adapter where the id is a number (integer)
export interface IdDatabaseAdapter<T extends BaseRecord> extends DatabaseAdapter<T> {
    getById(id: number, tx?: Prisma.TransactionClient): Promise<T | null>;
    update(
        id: number,
        data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<T>;
    delete(id: number, tx?: Prisma.TransactionClient): Promise<void>;
}

// Hero Image specific adapter
export interface HeroImageAdapter extends IdDatabaseAdapter<HeroImage> {
    create(
        data: Pick<HeroImage, "name" | "description" | "fileId" | "podcastId" | "episodeId" | "urlTo">,
        tx?: Prisma.TransactionClient,
    ): Promise<HeroImage>;
}

export interface IdNameDatabaseAdapter<T extends BaseRecord> extends IdDatabaseAdapter<T> {
    getByName(name: string, tx?: Prisma.TransactionClient): Promise<T | null>;
}

export interface PodcastDatabaseAdapter<T extends BaseRecord> extends IdDatabaseAdapter<T> {
    getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<T | null>;
}

export interface EpisodeDatabaseAdapter<T extends BaseRecord> extends IdDatabaseAdapter<T> {
    getByPodcastId(podcastId: number, tx?: Prisma.TransactionClient): Promise<T[]>;
    getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<T | null>;
    getByPodcastIdAndEpisodeSlug(
        podcastId: number,
        episodeSlug: string,
        tx?: Prisma.TransactionClient,
    ): Promise<T | null>;
}

// Concrete adapter types
export type UsersAdapterType = UuidDatabaseAdapter<User>;
export type AccountsAdapterType = UuidDatabaseAdapter<Account>;
export type PodcastsAdapterType = PodcastDatabaseAdapter<Podcast>;
export type EpisodesAdapterType = EpisodeDatabaseAdapter<Episode>;
export type ApiClientsAdapterType = IdDatabaseAdapter<ApiClient>;
export type VariablesAdapterType = IdNameDatabaseAdapter<Variable>;
export type FilesAdapterType = UuidDatabaseAdapter<FileMetadata>;
export type HeroImagesAdapterType = HeroImageAdapter;
