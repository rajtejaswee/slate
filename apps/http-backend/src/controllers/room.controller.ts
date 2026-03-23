import { Request, Response } from "express";
import { prismaClient } from "../db";
import { AsyncHandler } from "../utils/AsyncHandler";

// Custom interface for Auth Request
interface AuthRequest extends Request {
    userId?: string;
}

export const createRoom = AsyncHandler(async (req: AuthRequest, res: Response) => {
    const { slug } = req.body;
    const userId = req.userId;

    if (!userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }

    try {
        const room = await prismaClient.room.create({
            data: {
                slug,
                adminId: userId
            }
        });
        res.json({ roomId: room.id, message: "Room created" });
    } catch(e) {
        res.status(409).json({ message: "Room already exists" });
    }
});

export const getRoomShapes = AsyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId;

    const parsedRoomId = Number(roomId);
    if (isNaN(parsedRoomId)) {
        res.status(400).json({ message: "Invalid room ID" });
        return;
    }

    const room = await prismaClient.room.findFirst({
        where: {
            id: parsedRoomId
        },
        select: {
            shapes: true
        }
    });

    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }

    res.json({ shapes: room.shapes });
});

export const getRoomIdBySlug = AsyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    
    const room = await prismaClient.room.findUnique({
        where: { slug }
    });
    
    if(room) {
        res.json({ roomId: room.id });
    } else {
        res.status(404).json({ message: "Room not found" });
    }
});