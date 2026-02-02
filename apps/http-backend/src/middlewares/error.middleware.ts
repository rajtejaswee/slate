import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError"


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: null,
        });
    }

    
    console.error("Unhandled Error:", err); 
    
    return res.status(500).json({
        success: false, 
        message: "Internal Server Error. Something went wrong"
    });
}