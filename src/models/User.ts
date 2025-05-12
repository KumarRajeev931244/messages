import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
    _id:string,
    content: string,
    createdAt: Date
}

//  <> => this is used for custom interface
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean
    message: Message[]

}

const UserSchema = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type: Boolean,
        default:true
    },
    message: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',UserSchema))

export default UserModel