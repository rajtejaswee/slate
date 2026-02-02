import { Request, Response, NextFunction } from "express"

type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | any

const AsyncHandler = (requestHandler:ControllerFunction) => {
    return(req: Request,res: Response,next: NextFunction) => {
        Promise.resolve(requestHandler(req,res, next)).catch((err) => next(err))
    }
}

export { AsyncHandler }