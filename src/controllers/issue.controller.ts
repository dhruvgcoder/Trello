import type { Request, Response } from "express"

import { issueModel } from "../db.js";
import { statusValidation } from "../validators/z.js"


export async function getIssues(req: Request, res: Response) {
    try {
        const boardId = req.params.boardId
        const issues = await issueModel.find({
            board: boardId as string
        })
        if (issues.length === 0) {
            res.status(200).json({
                issues: []
            })
            return
        }
        res.status(200).json({
            issues: issues.map(issue => ({
                description: issue.description,
                status: issue.status,
                createdAt: issue.createdAt
            }))
        })
        return
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}
export async function createIssue(req: Request, res: Response) {
    const boardId = req.params.boardId

    const issue = await issueModel.create({
        description: req.body.description,
        board: boardId as string
    })
    res.status(200).json({
        msg: "Issue created succesfully",
        issue: issue.id
    })
    return
}
export async function updateIssue(req: Request, res: Response) {
    const issueId = req.params.issueId
    const parsed = statusValidation.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({
            msg: "Incorrect status format"
        })
        return
    }

    const newStatus = parsed.data.newStatus
    const updatedStatus = await issueModel.findByIdAndUpdate(issueId, {
        status: newStatus,
        statusUpdatedAt: Date.now()
    }, {
        new: true
    })
    if (!updatedStatus) {
        res.json({
            msg: "Error in updating status"
        })
        return
    }
    res.status(200).json({
        msg: `Status updated to ${newStatus}`,
        issueId: issueId,
        updatedAt: updatedStatus.statusUpdatedAt
    })
    return
}