import { z } from "zod";

export const signupValidation = z.object({
    username: z.string().min(2),
    password: z.string().min(8, "Password length should be 8")
})

export const signinValidation = z.object({
    username: z.string().min(2),
})

export const statusValidation = z.object({
    newStatus : z.enum(["inProgress","done","pending","archived"])
})

export type signupInputType = z.infer<typeof signupValidation>
export type signinInputType = z.infer<typeof signinValidation>
export type statusInputType = z.infer<typeof statusValidation>


