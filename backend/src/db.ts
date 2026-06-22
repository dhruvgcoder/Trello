import { Schema, model } from "mongoose"
import type { InferSchemaType } from "mongoose"


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }

})

const organizationSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    admin: { type: Schema.Types.ObjectId, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users" }]

});

const boardsSchema = new Schema({
    title: {type: String, required: true},
    organization: { type: Schema.Types.ObjectId, ref: "organizations" }
})

const issueSchema = new Schema({
    description: {type: String , required: true},
    board: { type: Schema.Types.ObjectId, ref: "boards" },
    status: {
        type: String,
        enum: [
            "inProgress", "pending", "done", "archived"
        ] , default : "inProgress"
    },
    createdAt: { type: Date, default: Date.now },
    statusUpdatedAt: { type: Date }
})

export type userType = InferSchemaType<typeof userSchema> 
export type organizationType = InferSchemaType<typeof organizationSchema> & BaseDocument
export type boardsType = InferSchemaType<typeof boardsSchema> 
export type issueType = InferSchemaType<typeof issueSchema> 

export const userModel = model<userType>("users", userSchema)
export const organizationModel = model<organizationType>("organizations", organizationSchema)
export const boardsModel = model<boardsType>("boards", boardsSchema)
export const issueModel = model<issueType>("issue", issueSchema)


