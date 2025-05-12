import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request: NextRequest){
    console.log('request:',request)
    await dbConnection()
    console.log("authOption:",authOptions);
    
    const session = await getServerSession(authOptions)
    console.log("session:",session)
    const user:User = session?.user as User
    if(!session || !session.user){
        return NextResponse.json(
            {
                success:false,
                message: "not authenticated"
            },{status:400}
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId} },
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if(!user || user.length === 0){
           return NextResponse.json(
            {
                success:false,
                message: "user not found"
            },{status:400}
        )
        }
        return NextResponse.json(
            {
                success:true,
                message: user[0].messages
            },{status:200}
        )
    } catch (error) {
        console.log("error while getting messages:",error);
        return NextResponse.json(
            {
                success:false,
                message: "error while getting messages"
            },{status:500}
        )  
    }

}