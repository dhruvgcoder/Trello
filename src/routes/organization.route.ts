import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

import {
    createOrganization,
    inviteMemberToOrg,
    getOrganizations,
    getMembers,
    removeMember
} from "../controllers/organization.controller.js"


export const organizationRouter = Router();

organizationRouter.post("/create", authMiddleware, createOrganization)

organizationRouter.post("/:orgId/members", authMiddleware, inviteMemberToOrg)

organizationRouter.get("/", authMiddleware, getOrganizations)

organizationRouter.get("/:orgId/members", authMiddleware, adminMiddleware, getMembers)

organizationRouter.delete("/:orgId/member/:userId/", authMiddleware, adminMiddleware, removeMember)