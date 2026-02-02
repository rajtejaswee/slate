import {Request, Response } from "express"
import axios from "axios"
import {prisma} from "@repo/db"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { AsyncHandler } from "../utils/AsyncHandler"

export const googleAuth = (req:Request, res:Response) => {
    const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${BASE_URL}/api/v1/auth/google/callback&response_type=code&scope=profile email&access_type=offline`;
    res.redirect(googleAuthUrl)
};

export const googleCallback = AsyncHandler(async (req:Request, res:Response) => {
    const {code} = req.query;

    if(!code) {
        throw new ApiError(400, "Authorization code missing")
    }

    const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
    try {
        const {data: tokenData} = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${BASE_URL}/api/v1/auth/google/callback`,
        });

        const { access_token } = tokenData;

        const { data: userData } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, picture } = userData;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    photo: picture,
                    password: null, 
                },
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "24h",
        });

        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    }
    catch(error) {
        console.error("Google Auth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

})