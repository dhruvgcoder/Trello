import { Router } from "express";
import type { Request , Response , NextFunction } from "express";
import { authMiddleware } from "../middleware.js"

export const authRouter = Router();

authRouter.post("/create-organization",authMiddleware,(req : Request,res : Response)=>{
    const admin = req.userId
    
})
authRouter.post("/invite-member-to-organization" ,authMiddleware, (rreq : Request,res : Response)=>{
    
});
