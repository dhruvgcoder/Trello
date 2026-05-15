import { Router } from "express";
import type { Request, Response } from "express";
import { authMiddleware } from "../middleware.js";
import { organizationModel, userModel } from "../db.js";

export const organizationRouter = Router();

organizationRouter.post("/create-organization", authMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId
    const { title, description } = req.body


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
        members: []
    })
    res.json({
        msg: "Organization Created",
        orgId: organization._id
    })

})
organizationRouter.post("/invite-member-to-organization", authMiddleware, async (req: Request, res: Response) => {
    const memberUsername = req.body.username
    const organizationId = req.body.organizationId
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

    if(organization.members.includes(memberUser._id)){
        res.status(400).json({
            msg : "User is already in the organization"
        })
        return
    }

   await organizationModel.findByIdAndUpdate(
        organizationId ,
        { $addToSet : {
            members : memberUser._id        
        }
    })
    res.status(200).json({
        msg : "User invited succesfully",
        id : memberUser._id
    })
});


organizationRouter.get("/organizations",(req : Request,res : Response)=>{
    
})

organizationRouter.get("/members",(req : Request,res : Response)=>{
    
})

organizationRouter.delete("/remove-member",(req : Request,res : Response)=>{
    
})