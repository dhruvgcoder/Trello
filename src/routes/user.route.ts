import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

import {
    userSignup,
    userSignin
} from "../controllers/user.controller.js"

export const userRouter = Router();


userRouter.post("/signup", userSignup)

userRouter.post("/signin", userSignin)
