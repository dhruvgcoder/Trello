import mongoose , {Schema , model } from "mongoose"
import type { InferSchemaType } from "mongoose"


const userSchema = new Schema({
    username : {type : String , required : true , unique : true } ,
    password : {type : String , required : true }

})

const organizationSchema = new Schema({
    title : String ,
    description : String ,
    admin : { type : Schema.Types.ObjectId , required : true } ,
    members : [Schema.Types.ObjectId]

});

type userType = InferSchemaType<typeof userSchema>
type organizationType  = InferSchemaType<typeof organizationSchema>

export const userModel = model<userType>("users" , userSchema)
export const organizationModel = model<organizationType>("organizations" , organizationSchema)

