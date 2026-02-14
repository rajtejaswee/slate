import 'dotenv/config';
import { WebSocket, WebSocketServer } from 'ws';
import { verifyUser } from './middlewares/verifyUser.middleware';
import { prismaClient } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

const users: User[] = [];
export interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

wss.on('connection', function connection(ws, request) {
  const url = request.url; 
  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = verifyUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({ userId, rooms: [], ws });
  console.log(`User connected: ${userId}`);

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); 
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "draw-add") {
        const roomId = parsedData.roomId;
        const element = parsedData.element;

        // 1. Broadcast to others
        users.forEach(user => {
            if (user.rooms.includes(roomId) && user.ws !== ws) {
                user.ws.send(JSON.stringify({
                    type: "draw-add",
                    element: element
                }));
            }
        });

        // Save to DB (Robust Fix)
        try {
            // Check if roomId is a valid number (ID) or a string (Slug)
            const roomIdInt = parseInt(roomId);
            const isNumericId = !isNaN(roomIdInt) && roomIdInt.toString() === roomId.toString();

            if (isNumericId) {
                // It is a Number (e.g., "1") 
                await prismaClient.room.update({
                    where: { id: roomIdInt },
                    data: {
                        shapes: { push: element }
                    }
                });
            } else {
                // It is a String (e.g., "my-room") 
                await prismaClient.room.update({
                    where: { slug: roomId },
                    data: {
                        shapes: { push: element }
                    }
                });
            }
            console.log(`💾 Saved shape to Room ${roomId}`);
        } catch (e) {
            console.error("❌ DB Save Failed:", e);
        }
    }

    if (parsedData.type === "delete-shape") {
        const roomId = parsedData.roomId;
        const shapeId = parsedData.id;

        // Broadcast
        users.forEach(user => {
            if (user.rooms.includes(roomId) && user.ws !== ws) {
                user.ws.send(JSON.stringify({
                    type: "delete-shape",
                    id: shapeId
                }));
            }
        });

        // Delete from DB (Robust Fix)
        try {
            const roomIdInt = parseInt(roomId);
            const isNumericId = !isNaN(roomIdInt) && roomIdInt.toString() === roomId.toString();

            // Find room by ID or Slug
            const room = await prismaClient.room.findUnique({
                where: isNumericId ? { id: roomIdInt } : { slug: roomId },
                select: { shapes: true }
            });

            if (room?.shapes) {
                const updatedShapes = (room.shapes as any[]).filter((x: any) => x.id !== shapeId);
                
                await prismaClient.room.update({
                    where: isNumericId ? { id: roomIdInt } : { slug: roomId },
                    data: { shapes: updatedShapes }
                });
                console.log(`Deleted shape ${shapeId} from Room ${roomId}`);
            }
        } catch (e) {
            console.error("DB Delete Failed:", e);
        }
    }
  });
});

console.log("WebSocket Server running on port 8080");