import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import type { Request, Response } from "express"

import {
    signupValidation,
    signinValidation,
    type signupInputType,
    type signinInputType
} from "../validators/z.js"

import { userModel } from "../db.js"
import { env } from "../env.js"


export async function userSignup(req: Request, res: Response) {
    const parsed = signupValidation.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({
            errors: parsed.error.issues
        })
        return
    }
    const { username, password }: signupInputType = parsed.data

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
}

export async function userSignin(req: Request, res: Response) {
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
        res.status(400).json({
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
}

