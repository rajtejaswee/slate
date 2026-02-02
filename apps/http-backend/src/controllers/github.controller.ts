import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

console.log("Frontend URL:", process.env.FRONTEND_URL); // Is this undefined?
export const githubAuth = (req: Request, res: Response) => {
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    res.redirect(githubUrl);
};

export const githubCallback = AsyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) throw new ApiError(400, "Code missing");

    try {
        const { data: tokenData } = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenData.access_token;

        // B. Get User Profile
        const { data: userProfile } = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // C. Get User Email (GitHub hides it often)
        let email = userProfile.email;
        if (!email) {
            const { data: emails } = await axios.get("https://api.github.com/user/emails", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const primaryEmail = emails.find((e: any) => e.primary && e.verified);
            email = primaryEmail ? primaryEmail.email : null;
        }

        if (!email) throw new ApiError(400, "GitHub email not accessible");

        // D. Database Sync
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: userProfile.name || userProfile.login,
                    photo: userProfile.avatar_url,
                    password: null,
                },
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "24h",
        });

        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);

    } catch (error) {
        console.error("GitHub Auth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_failed`);
    }
});