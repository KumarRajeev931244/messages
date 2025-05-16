import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request){
    // console.log('Get messages request:',request)
    await dbConnection()
    const session = await getServerSession( authOptions)
    // console.log("Get messages session:",session)
     const user:User = session?.user as User
    if(!session || !session.user){
        return NextResponse.json(
            {
                success:false,
                message: "not authenticated"
            },{status:400}
        )
    }
    // console.log("get message user2:",user)
    const userId = new mongoose.Types.ObjectId(user._id as string)
    // console.log("aggregrated user: ",userId)
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId} },
            {$unwind: '$message'},
            {$sort: {'message.createdAt': -1}},
            {$group: {_id: '$_id', message: {$push: '$message'}}}
        ])
        console.log("user4",user)
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
                message: user[0].message
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