import { organizationModel } from "../db.js";
import mongoose from "mongoose";

export const getOrganizations  = async(userId : string | undefined )=>{
    return await organizationModel.find({
        members : new mongoose.Types.ObjectId(userId)
    })
}