import { pool } from "@/lib/database/pool";
import { QueryResult, PoolClient, QueryResultRow } from "pg";
import { TimeoutError } from "@/lib/database/errors";

// Separate functions for read vs write queries
export async function query<T extends QueryResultRow>(sql: string, params?: any[]): Promise<T[]> {
    const result = await pool.query<T>(sql, params);
    return result.rows;
}

export async function executeQuery(sql: string, params?: any[]): Promise<QueryResult<any>> {
    const result = await pool.query(sql, params);
    return result as QueryResult<any>;
}

// Transaction helper with proper typing
export async function withTransaction<T>(callback: (connection: PoolClient) => Promise<T>): Promise<T> {
    const connection = await pool.connect();
    await connection.query("BEGIN");

    try {
        const result = await callback(connection);
        await connection.query("COMMIT");
        return result;
    } catch (error) {
        await connection.query("ROLLBACK");
        throw error;
    } finally {
        connection.release();
    }
}

export async function healthCheck() {
    const timeoutMs = parseInt(process.env.HEALTH_CHECK_TIMEOUT_MS || "1000", 10);

    const queryPromise = executeQuery("SELECT 1").then((result) => ({
        type: "query" as const,
        result,
    }));

    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError(timeoutMs));
        }, timeoutMs);
    });

    await Promise.race([queryPromise, timeoutPromise]);
    // If we get here, it means the query completed (the timeout would have thrown an error)
    return true;
}
