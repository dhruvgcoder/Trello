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
            msg: parsed.error.issues?.[0]?.message || "Invalid input"
        })
        return
    }
    const { username, password }: signupInputType = parsed.data

    const checkUser = await userModel.findOne({
        username: username
    })
    if (checkUser) {
        res.status(409).json({
            msg: "User already exists with this username"
        })
        return
    }
    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await userModel.create({
        username: username,
        password: hashPassword
    })

    const token = jwt.sign(
        { userId: newUser.id },
        env.userSecret,
        { expiresIn: env.JWT_EXPIRES_IN as unknown as number }
    )

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        message: "You have signed up successfully",
        token: token
    })
}

export async function userSignin(req: Request, res: Response) {
    const userData = signinValidation.safeParse(req.body)
    if (!userData.success) {
        res.status(400).json({
            msg: userData.error.issues?.[0]?.message || "Invalid input"
        })
        return
    }
    const { username, password }: signinInputType = userData.data
    const userExist = await userModel.findOne({
        username: username
    })
    if (!userExist) {
        res.status(401).json({
            msg: "Invalid credentials"
        })
        return
    }

    const checkPassword = await bcrypt.compare(password, userExist.password)
    if (!checkPassword) {
        res.status(401).json({
            msg: "Invalid credentials"
        })
        return
    }

    const token = jwt.sign(
        { userId: userExist.id },
        env.userSecret,
        { expiresIn: env.JWT_EXPIRES_IN as unknown as number }
    )
    res.json({
        token: token,
        id: userExist.id,
        username: userExist.username
    })
}

