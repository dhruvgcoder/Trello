import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../env.js";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ZodError) {
        res.status(400).json({
            msg: err.issues?.[0]?.message || "Validation error"
        })
        return
    }

    if (err.name === "MongooseError" || err.name === "CastError") {
        res.status(400).json({
            msg: "Invalid data format"
        })
        return
    }

    if (env.NODE_ENV === "development") {
        console.error("Unhandled error:", err)
    }

    res.status(500).json({
        msg: "Internal server error"
    })
}
