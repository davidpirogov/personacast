import { Role } from "next-auth";
import { IdRecord, UuidRecord } from "@/lib/database/base/models.d";

// User specific fields
export interface User extends UuidRecord {
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
export interface Account extends UuidRecord {
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
export interface Podcast extends IdRecord {
    id: number;
    title: string;
    slug: string;
    description: string;
    published: boolean;
    publishedAt: Date | null;
    heroImageId?: number | null;
}

// Episode specific fields
export interface Episode extends IdRecord {
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
export interface ApiClient extends IdRecord {
    id: number;
    name: string;
    description: string;
    token: string;
    isActive: boolean;
}

// Variable specific fields
export interface Variable extends IdRecord {
    id: number;
    name: string;
    value: string;
}

export interface FileMetadata extends UuidRecord {
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

export interface HeroImage extends IdRecord {
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

export interface MenuItem extends IdRecord {
    id: number;
    label: string;
    href: string;
    order: number;
    relOptions: string[];
    isActive: boolean;
    isSystem: boolean;
    requiredRoles: string[];
    parentId: number | null;
    children?: MenuItem[];
}
