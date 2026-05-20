import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import { env } from "../env.js";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction) {
    try {
        const token = req.headers.token

        if (typeof token !== "string") {
            res.status(401).json({
                msg: "Token is Missing"
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
                msg: "Token was incorrect"
            })
        }
    } catch (err) {
        res.status(400).json({
            msg: "Invalid token"
        })
    }
}


