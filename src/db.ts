import { Schema, model } from "mongoose"
import type { InferSchemaType } from "mongoose"


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }

})

const organizationSchema = new Schema({
    title: String,
    description: String,
    admin: { type: Schema.Types.ObjectId, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users" }]

});

const boardsSchema = new Schema({
    title: String,
    organization: { type: Schema.Types.ObjectId, ref: "organizations" }
})

const issueSchema = new Schema({
    description: String,
    board: { type: Schema.Types.ObjectId, ref: "boards" },
    status: {
        type: String,
        enum: [
            "inProgress", "pending", "done", "archived"
        ]
    },
    createdAt: { type: Date, default: Date.now },
    statusChangedAt: { type: Date }
})

type userType = InferSchemaType<typeof userSchema>
type organizationType = InferSchemaType<typeof organizationSchema>
type boardsType = InferSchemaType<typeof boardsSchema>
type issueType = InferSchemaType<typeof issueSchema>

export const userModel = model<userType>("users", userSchema)
export const organizationModel = model<organizationType>("organizations", organizationSchema)
export const boardsModel = model<boardsType>("boards", boardsSchema)
export const issueModel = model<issueType>("issue", issueSchema)

