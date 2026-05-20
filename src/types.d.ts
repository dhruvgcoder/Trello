import mongoose from "mongoose"

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }

    interface JwtPayloadCustom {
        userId : string
    }

    interface BaseDocument {
        _id :  mongoose.Types.ObjectId ,
        id : string
    }

}
export {}