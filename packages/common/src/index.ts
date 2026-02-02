import {z} from "zod";

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3)
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20),
})

export type SignupType = z.infer<typeof SignupSchema>
export type SigninType = z.infer<typeof SigninSchema>
export type CreateRoomType = z.infer<typeof CreateRoomSchema>

