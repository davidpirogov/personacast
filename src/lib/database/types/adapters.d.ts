import { Prisma } from "@prisma/client";
import { IdRecord, UuidRecord } from "@/lib/database/base/models.d";
import { IdDatabaseAdapter, UuidDatabaseAdapter } from "@/lib/database/base/adapters.d";
import {
    HeroImage,
    User,
    Account,
    Podcast,
    Episode,
    ApiClient,
    Variable,
    FileMetadata,
    MenuItem,
} from "@/lib/database/types/models.d";

// Hero Image specific adapter
export interface HeroImageAdapter extends IdDatabaseAdapter<HeroImage> {
    create(
        data: Pick<HeroImage, "name" | "description" | "fileId" | "podcastId" | "episodeId" | "urlTo">,
        tx?: Prisma.TransactionClient,
    ): Promise<HeroImage>;
}

export interface IdNameDatabaseAdapter<T extends IdRecord> extends IdDatabaseAdapter<T> {
    getByName(name: string, tx?: Prisma.TransactionClient): Promise<T | null>;
}

export interface PodcastDatabaseAdapter<T extends IdRecord> extends IdDatabaseAdapter<T> {
    getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<T | null>;
}

export interface EpisodeDatabaseAdapter<T extends IdRecord> extends IdDatabaseAdapter<T> {
    getByPodcastId(podcastId: number, tx?: Prisma.TransactionClient): Promise<T[]>;
    getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<T | null>;
    getByPodcastIdAndEpisodeSlug(
        podcastId: number,
        episodeSlug: string,
        tx?: Prisma.TransactionClient,
    ): Promise<T | null>;
}

export interface MenuItemDatabaseAdapter<T extends IdRecord> extends IdDatabaseAdapter<T> {
    getWithChildren(id: number, tx?: Prisma.TransactionClient): Promise<T | null>;
    getTopLevelItems(tx?: Prisma.TransactionClient): Promise<T[]>;
    getMenuTree(tx?: Prisma.TransactionClient): Promise<T[]>;
}
export interface AccountsAdapterType extends UuidDatabaseAdapter<Account> {
    findByProvider(provider: string, providerAccountId: string): Promise<Account | null>;
    deleteByUserId(userId: string): Promise<void>;
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
export type MenuItemsAdapterType = MenuItemDatabaseAdapter<MenuItem>;
