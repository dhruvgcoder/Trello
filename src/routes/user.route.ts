import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import type { Request , Response } from "express";

import { inputValidation , type InputType , signinValidation , type signinInputType  } from "../z.js"
import { userModel } from "../db.js"
import { env } from "../env.js"
// import { signinValidation , type signinInputType } from "../z.js"

export const userRouter = Router();


userRouter.post("/signup", async (req : Request<{},{},InputType>, res : Response) => {

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
    const hashPassword  = await bcrypt.hash(password, 12)

    const newUser = await userModel.create({
        username: username,
        password: hashPassword
    })

    res.json({
        id: newUser._id,
        message: "You have signed up successfully"
    })
});

userRouter.post("/signin", async (req : Request, res : Response) => {

    const userData = signinValidation.safeParse(req.body.username)
    console.log(userData)
    if(!userData.success){
        res.json({
            
        })
        return
    }
    const { username } : signinInputType = userData.data
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

userRouter.get("/boards",(req : Request,res : Response)=>{
    
})

userRouter.get("/issues",(req : Request,res : Response)=>{
    
})

userRouter.put("/update-issue",(req : Request,res : Response)=>{
    
})