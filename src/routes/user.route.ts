import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Router } from "express";
import type { Request, Response } from "express";

import { env } from "../env.js"
import { userModel, boardsModel } from "../db.js"
import { authMiddleware } from "../middleware.js"
import { getOrganizations } from "../helper/org.helper.js"
import { inputValidation, type InputType, signinValidation, type signinInputType } from "../z.js"

export const userRouter = Router();


userRouter.post("/signup", async (req: Request<{}, {}, InputType>, res: Response) => {

    const parsed = inputValidation.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({
            errors: parsed.error.issues
        })
        return
    }
    const { username, password }: InputType = parsed.data

    const checkUser = await userModel.findOne({
        username: username
    })
    if (checkUser) {
        res.status(411).json({
            msg: "User Already Exist with this username"
        })
        return
    }
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await userModel.create({
        username: username,
        password: hashPassword
    })

    res.json({
        id: newUser._id,
        message: "You have signed up successfully"
    })
});

userRouter.post("/signin", async (req: Request, res: Response) => {

    const userData = signinValidation.safeParse(req.body)
    if (!userData.success) {
        res.json({
            msg: "invalid username"
        })
        return
    }
    const { username }: signinInputType = userData.data
    const userExist = await userModel.findOne({
        username: username
    })
    if (!userExist) {
        res.status(403).json({
            msg: "User not found"
        })
        return
    }

    const password = req.body.password
    const checkPassword = await bcrypt.compare(password, userExist.password)
    if (!checkPassword) {
        res.json({
            msg: "Invalid credentials"
        })
        return
    }

    const token = jwt.sign({
        userId: userExist.id
    }, env.userSecret)
    res.json({
        token: token
    })

});

userRouter.get("/boards", authMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId
    const orgs = await getOrganizations(userId)
    const orgsId = orgs.map(org => org._id)
    const boards = await boardsModel.find({
        organization : { $in : orgsId}
    })

    if(boards.length === 0){
        res.status(400).json({
            msg : "No boards found"
        })
        return
    }
    res.status(200).json({
        boards : boards.map(board =>({
            title : board.title ,
            organization : board.organization
        }))
    })
})


userRouter.get("/issues", authMiddleware, (req: Request, res: Response) => {

})

userRouter.put("/update-issue", authMiddleware, (req: Request, res: Response) => {

})