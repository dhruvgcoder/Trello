import { z } from "zod";

export const inputValidation = z.object({
    username: z.string().min(2),
    password: z.string().min(8, "Password length should be 8")
})

export type InputType = z.infer<typeof inputValidation>

export const envSchema = z.object({
    userSecret : z.string(),
    MONGODB_URL : z.string()
})

export type envType = z.infer<typeof envSchema>