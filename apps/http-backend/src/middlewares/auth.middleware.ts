import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";


export const userMiddleware = (req:Request, res:Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]

    if(!authHeader) {
        next(new ApiError(401, "Unauthorized request: No token provided"))
        return;
    }

    try {
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "secret") as JwtPayload

        if(decoded && decoded.id) {
            req.userId = decoded.id
            next();
        }
        else {
            next(new ApiError(403, "Invalid JWT token"))
        }
    }
    catch(err) {
        next(new ApiError(401, "Invalid or Expired Token"))
    }

}