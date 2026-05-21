import { Router } from "express"

import { authMiddleware } from "../middlewares/authMiddleware.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

import { createBoard, getBoards } from "../controllers/board.controller.js"

export const boardsRouter = Router();

boardsRouter.get("/dashboard/:orgId", authMiddleware, getBoards)

boardsRouter.post("/:orgId", authMiddleware, adminMiddleware, createBoard)
