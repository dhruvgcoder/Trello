import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

export const envSchema = z.object({
    userSecret : z.string(),
    MONGODB_URL : z.string(),
    FRONTEND_URL: z.string().default("http://localhost:5173"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export const env  = envSchema.parse(process.env)