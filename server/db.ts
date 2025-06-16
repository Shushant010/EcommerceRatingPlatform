import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Using the specified connection string

const connectionString = "postgresql://neondb_owner:npg_UMHQueX7GLv1@ep-wispy-leaf-a1lyn8jv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });