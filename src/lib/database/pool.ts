import { Pool } from "pg";

// Mock pool implementation for build time
const createMockPool = () => {
    const mockPool = {
        connect: async () => ({
            release: () => {},
            query: async () => ({ rows: [], rowCount: 0 }),
        }),
        query: async () => ({ rows: [], rowCount: 0 }),
        end: async () => {},
    };
    return mockPool as unknown as Pool;
};

// Create either a real pool or a mock pool based on environment
export const pool = process.env.BUILD_SKIP_DB_SERVER
    ? createMockPool()
    : new Pool({
          host: process.env.DB_HOST || "localhost",
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          port: parseInt(process.env.DB_PORT || "5432", 10),
          max: 10, // max number of clients in the pool
          idleTimeoutMillis: 60000,
      });

// Only test the connection if we're not in build mode
if (!process.env.BUILD_SKIP_DB_SERVER) {
    pool.connect()
        .then((client) => {
            console.info("Database connected successfully");
            client.release();
        })
        .catch((err) => {
            console.error("Failed to connect to database:", err);
            process.exit(1);
        });
}
