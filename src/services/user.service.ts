import { organizationModel } from "../db.js";

class UserService {
    
    // Get the list of orgs user is part of.
    async getListOfOrgs(userId : string){
         const user = await organizationModel.find({
                member: { $in: [userId] }
            })
            return user;
    }
}

export const userService = new UserService()