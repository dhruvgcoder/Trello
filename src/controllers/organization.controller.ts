import type { Request, Response } from "express"
import { organizationModel, userModel } from "../db.js"

import { organizationService } from "../services/organization.service.js"


export async function createOrganization(req: Request, res: Response) {
    const userId = req.userId
    const { title, description } = req.body

    try {
        if (!userId) {
            res.status(401).json({
                msg: "Not authorised"
            })
            return
        }

        const organization = await organizationModel.create({
            title: title,
            description: description,
            admin: userId,
            members: [userId]
        })
        res.json({
            msg: "Organization Created",
            orgId: organization._id
        })
        return

    } catch (err) {
        res.json({
            msg: "Error creating organization"
        })
        return
    }
}

export async function inviteMemberToOrg(req: Request, res: Response) {
    const memberUsername = req.body.username
    const organizationId = req.params.orgId as string
    const userId = req.userId

    const organization = await organizationModel.findOne({
        _id: organizationId
    })
    if (!organization || organization.admin.toString() !== userId) {
        res.status(411).json({
            msg: "Either you are not admin OR this org does not exist"
        })
        return
    }
    const memberUser = await userModel.findOne({
        username: memberUsername
    })
    if (!memberUser) {
        res.status(404).json({
            msg: "User not found"
        })
        return
    }

    if (organization.members.includes(memberUser._id)) {
        res.status(400).json({
            msg: "User is already in the organization"
        })
        return
    }

    await organizationModel.findByIdAndUpdate(
        organizationId,
        {
            $addToSet: {
                members: memberUser._id
            }
        })
    res.status(200).json({
        msg: "User invited succesfully",
        id: memberUser._id
    })
    return
}

export async function getOrganizations(req: Request, res: Response) {
    const userId = req.userId
    const orgs = await organizationService.getListOfOrgs(userId)
    if (orgs.length == 0) {
        res.status(400).json({
            msg: "You are not part of any organization"
        })
        return
    }

    res.status(200).json({
        orgs: orgs.map(org => ({
            id: org._id,
            title: org.title
        }))
    })
}

export async function getMembers(req: Request, res: Response) {
    const orgId = req.params.orgId
    const members = await organizationService.getMembers(orgId as string)

    if (!members) {
        res.status(411).json({
            msg: "No members in this organization"
        })
        return
    }
    res.status(200).json({
        members: members
    })
    return
}

export async function removeMember(req: Request, res: Response) {
    const targetUserId = req.body.targetUserId
    const orgId = req.params.orgId as string
    if (!targetUserId || !orgId) {
        res.status(400).json({
            msg: "User not found or Org do not exists"
        })
        return
    }
    
    await organizationModel.findByIdAndUpdate(
        orgId,
        {
            $pull: {
                members: targetUserId
            }
        }
    )
    res.status(200).json({
        msg: `${targetUserId} - User removed succesfully`
    })
    return

}
