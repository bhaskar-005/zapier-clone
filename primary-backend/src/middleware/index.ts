import { NextFunction, Request, Response } from "express"
import  jwt  from "jsonwebtoken";

export const authMiddleware = async(req:Request, res:Response, next:NextFunction) =>{
    const token = req.headers.authorization;
    try {
        const payload = jwt.verify(token!, process.env.JWT_PASSWORD!);
        //@ts-ignore
        req.id = payload.id;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}