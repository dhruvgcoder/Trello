import { Router } from "express"

import { authMiddleware } from "../middlewares/authMiddleware.js"

import {
    getIssues,
    updateIssue,
    createIssue
} from "../controllers/issue.controller.js"

export const issuesRouter = Router();

issuesRouter.get("/:boardId", authMiddleware, getIssues)

issuesRouter.post("/:boardId", authMiddleware, createIssue)

issuesRouter.put("/:issueId", authMiddleware, updateIssue)