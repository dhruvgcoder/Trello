import type { Request, Response } from "express"

import { boardsModel } from "../db.js"

export async function createBoard(req: Request, res: Response) {
    try {
        const board = await boardsModel.create({
            title: req.body.title,
            organization: req.params.orgId as string
        })
        res.status(200).json({
            msg : "Board created succesfully",
            id : board.id
        })
        return
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }

}

export async function getBoards(req: Request, res: Response) {
    try {
        const orgId = req.params.orgId
        const boards = await boardsModel.find({
            organization: orgId as string
        })

        if (boards.length === 0) {
            res.status(200).json({
                boards: []
            })
            return
        }
        res.status(200).json({
            boards: boards.map(board => ({
                title: board.title,
                organization: board.organization
            }))
        })
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

