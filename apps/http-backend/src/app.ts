import "dotenv/config";
import express from "express";
import cors from "cors";
import { prismaClient } from "@repo/db";

const app = express();


const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "" 
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log("Blocked CORS for:", origin);
            return callback(null, false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/health", async (req, res) => {
    try {
        await prismaClient.user.findFirst({ select: { id: true } });
        res.json({ status: "healthy", db: "connected" });
    } catch (e) {
        res.status(500).json({ status: "error", db: "disconnected" });
    }
});

import authRouter from "./routes/auth.route";
app.use("/api/v1/auth", authRouter);

import roomrouter from "./routes/room.route";
app.use("/api/v1/room", roomrouter);

import { errorHandler } from "./middlewares/error.middleware";
app.use(errorHandler);

export { app };