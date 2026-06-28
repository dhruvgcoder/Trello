import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { userRouter } from "./routes/user.route.js";
import { organizationRouter } from "./routes/organization.route.js";
import { boardsRouter } from "./routes/board.route.js";
import { issuesRouter } from "./routes/issue.route.js";

import { env } from "./env.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { msg: "Too many attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/users/signin", authLimiter);
app.use("/users/signup", authLimiter);

app.use("/users", userRouter)
app.use("/organization", organizationRouter)
app.use("/boards", boardsRouter)
app.use("/issues", issuesRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3001

mongoose.connect(env.MONGODB_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
})
.catch(() => {
    console.log("Issue in connecting to Database")
})

