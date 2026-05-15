import { z } from "zod";

export const inputValidation = z.object({
    username: z.string().min(2),
    password: z.string().min(8, "Password length should be 8")
})

export const signinValidation = z.object({
    username: z.string().min(2),
    // password: z.string().min(8, "Password length should be 8")
})

export type InputType = z.infer<typeof inputValidation>
export type signinInputType = z.infer<typeof signinValidation>


