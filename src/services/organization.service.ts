import { organizationModel } from "../db.js"
import type { userType, organizationType } from "../db.js"

import { Types } from "mongoose"

class OrganizationService {

    // Get the list of organization user is part of.
    async getListOfOrgs(userId: string | undefined): Promise<organizationType[]> {
        if (!userId) return []
        const userObjectId = new Types.ObjectId(userId)
        const orgs = await organizationModel.find({
            $or: [
                { members: { $in: [userObjectId] } },
                { admin: userObjectId }
            ]
        })
        return orgs;
    }

    async getMembers(orgId: string): Promise<userType[] | null> {
        const orgData = await organizationModel
            .findById(orgId)
            .populate<{
                members: userType[]
            }>({
                path: "members",
                select: "username"
            })

        if (!orgData) return null

        return orgData.members

    }
}
export const organizationService = new OrganizationService()


