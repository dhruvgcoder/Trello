import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import { env } from "../env.js";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader

        if (typeof token !== "string") {
            res.status(401).json({
                msg: "Authentication required"
            });
            return
        }

        const decoded = jwt.verify(token, env.userSecret) as JwtPayload
        const userId = decoded.userId

        if (userId) {
            req.userId = userId
            next()
        }
        else {
            res.status(401).json({
                msg: "Invalid token"
            })
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ msg: "Token expired" })
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ msg: "Invalid token" })
        } else {
            res.status(500).json({ msg: "Internal server error" })
        }
    }
}


