import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import { prismaClient } from "./db";

const app: Application = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://slate-web-murex.vercel.app", 
    process.env.FRONTEND_URL || "" 
];

// Let the cors package handle the array matching natively. 
// Do NOT use a custom callback that throws Errors.
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.options("*", cors());

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