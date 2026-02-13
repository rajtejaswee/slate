import { Router } from "express";
import { userMiddleware } from "../middlewares/auth.middleware";
import { 
    createRoom, 
    getRoomIdBySlug, 
    getRoomShapes 
} from "../controllers/room.controller";

const router = Router();

router.post("/", userMiddleware, createRoom);
router.get("/:roomId/shapes", userMiddleware, getRoomShapes);
router.get("/slug/:slug", userMiddleware, getRoomIdBySlug);

export default router;