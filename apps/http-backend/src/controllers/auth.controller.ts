import { Request, Response } from "express";
import {SignupSchema, SigninSchema} from "@repo/common";
import {prisma} from "@repo/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Signup logic
export const signup = AsyncHandler(async(req: Request, res: Response) => {
        const parseData = SignupSchema.safeParse(req.body)

        if(!parseData.success) {
            throw new ApiError(401, "Validation Error", parseData.error.issues);
        }

        const {name, email, password} = parseData.data;

        const existingUser = await prisma.user.findFirst({
            where: {email}
        })

        if(existingUser) {
            throw new ApiError(409, "User already exist with this email")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password : hashedPassword
            }, 
            select :{
                id: true,
                email: true,
                name: true
            }
        })

        return res.status(201).json(
            new ApiResponse(200, user, "User successfully registered")
        )
})

//Signin logic
export const signin = AsyncHandler(async(req: Request, res:Response) => {
    const parseData = SigninSchema.safeParse(req.body) 

    if(!parseData.success) {
        throw new ApiError(401, "Validation Error", parseData.error.issues)
    }

    const {email, password} = parseData.data;

    const user = await prisma.user.findFirst({
            where: {email}
    })

    if(!user) {
        throw new ApiError(403, "User not registered")
    }

    if (!user.password) {
        throw new ApiError(400, "This account uses Google/Github login. Please sign in with that.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) {
        throw new ApiError(401, "Password is incorrect")
    }

    const token = jwt.sign(
        {id: user.id}, 
        process.env.JWT_SECRET || "secret",
        {expiresIn: "24h"}
    )

    return res.status(200).json(
        new ApiResponse(200, {token}, "User logged in successfully")
    )

})