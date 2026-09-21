import { Request, Response, NextFunction } from "express";
import { error } from "node:console";
import { verifyJwt } from "../services/auth";



export interface AuthedRequest extends Request {
  userId?: number;
}

export function requireAuth(req:AuthedRequest,res:Response,next:NextFunction) {
    const token = req.cookies?.token;
    if(!token) return res.status(401).json({error:'Login required'});
    
    try{
        const payload = verifyJwt(token);
        req.userId = payload.userId;
        next();
    }catch{
        res.status(401).json({error:'Invalid or expired session'});
    }
}