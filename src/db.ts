import mongoose , {Schema} from "mongoose"
import type { InferSchemaType } from "mongoose"


const userSchema = new Schema({
    username : String ,
    password : {type : String , required : true }

})

const organizationSchema = new Schema({
    title : String ,
    description : String ,
    admin : Schema.Types.ObjectId ,
    members : [Schema.Types.ObjectId]

});

type userType = InferSchemaType<typeof userSchema>
type organizationType  = InferSchemaType<typeof organizationSchema>

export const userModel = mongoose.model<userType>("users" , userSchema)
export const organizationModel = mongoose.model<organizationType>("organizations" , organizationSchema)

