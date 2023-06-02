import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/lib/server/db/schema.ts",
  out: "./migrations",
  connectionString: process.env.DATABASE_URL,
} satisfies Config;