import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { userRouter } from "./routes/user.route.js";
import { organizationRouter } from "./routes/organization.route.js";
import { boardsRouter } from "./routes/board.route.js";
import { issuesRouter } from "./routes/issue.route.js";


import { env } from "./env.js";


dotenv.config();
const app = express();
app.use(express.json());


app.use("/users",userRouter)
app.use("/organization",organizationRouter)
app.use("/boards",boardsRouter)
app.use("/issues",issuesRouter)


const PORT = process.env.PORT || 3001

mongoose.connect(env.MONGODB_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
})
.catch((err) => {
    console.log("Issue in connecting to Database")
})

