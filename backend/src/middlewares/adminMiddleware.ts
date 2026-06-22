import type { Request, Response, NextFunction } from "express"

import { organizationModel } from "../db.js"

export async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction) {
    try {
        const orgId = req.params.orgId
        const userId = req.userId
        if (!orgId || !userId) {
            res.status(401).json({
                msg: " No valid parameters"
            })
            return
        }

        const org = await organizationModel.findOne({
            _id: orgId,
            admin: userId // autocasting under the hood from string to ObjectId
        })

        if (!org) {
            res.status(401).json({
                msg: "Not Authorised"
            })
            return
        }
        next()
    } catch (err) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}
