import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function DELETE(request: NextRequest, {params}: {params:{messageid:string}}){
    const messageid= params.messageid 
    
    await dbConnection()
  
    
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

    try {
        const updatedResult =  await UserModel.updateOne(
            {_id: user._id},
            {$pull: {message: {_id:messageid}}}
        )
        if(updatedResult.modifiedCount == 0){
            return NextResponse.json({
                success: false,
                message: "Message not found or already delete"
            },{status:404})
        }
        return NextResponse.json({
                success: true,
                message: "Message Deleted"
            },{status:200})
    } catch (error) {
        console.log("error while deleting messages:",error)
        return NextResponse.json({
                success: false,
                message: "error in deleting messages"
            },{status:404})
    }
     
    

}