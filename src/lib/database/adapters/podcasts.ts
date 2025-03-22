import { DatabaseAdapter, Podcast } from "@/types/database";
import { query } from "../utils";

class PodcastsAdapter implements DatabaseAdapter<Podcast> {
    async getAll(): Promise<Podcast[]> {
        const result = await query<Podcast>("SELECT * FROM podcasts");
        return result;
    }

    async getById(id: string): Promise<Podcast | null> {
        const result = await query<Podcast>("SELECT * FROM podcasts WHERE id = $1", [id]);
        return result[0] || null;
    }

    async create(data: Omit<Podcast, "id" | "created_at" | "updated_at">): Promise<Podcast> {
        const result = await query<Podcast>("INSERT INTO podcasts (name) VALUES ($1) RETURNING *", [
            data.name,
        ]);
        return result[0];
    }

    async update(
        id: string,
        data: Partial<Omit<Podcast, "id" | "created_at" | "updated_at">>,
    ): Promise<Podcast> {
        const result = await query<Podcast>("UPDATE podcasts SET name = $1 WHERE id = $2 RETURNING *", [
            data.name,
            id,
        ]);
        return result[0];
    }

    async delete(id: string): Promise<void> {
        await query("DELETE FROM podcasts WHERE id = $1", [id]);
    }
}

export default PodcastsAdapter;
