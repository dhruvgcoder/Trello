declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
    interface JwtPayloadCustom {
        userId : string
    }
}
export {}