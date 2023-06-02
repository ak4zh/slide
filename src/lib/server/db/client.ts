import postgres from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$env/static/private";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const connectionPool = new postgres.Pool({
	connectionString: DATABASE_URL
});

export const db = drizzle(connectionPool, { logger: true });
