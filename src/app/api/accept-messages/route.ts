import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnection()
    // to find the currently login user 
    const session = await getServerSession(authOptions)
    console.log('session:',session);
    // from session we can find user because we inject it.
    const user:User = session?.user as User // we need to assert the user
    console.log("user:", user)

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "not authenticated"
        },{status: 400})
    }
    const userId = user._id
    console.log('userId:',userId);
    const {acceptmessage} = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptmessage},
            {new: true}
        )
        console.log("updatedUser:",updatedUser);
        if(!updatedUser){
            return NextResponse.json({
            success: false,
            message: "failed to update the user status to accept messages"
        },{status: 401})
        }
        return NextResponse.json({
            success: true,
            message: "update the user status to accept messages successfully"
        },{status: 200})
        
        
    } catch (error) {
        console.log('failed to update user status to accept messages');
        return NextResponse.json({
            success: false,
            message: "failed to update user status to accept messages"
        },{
            status: 500
        })
        
        
    }
    
    
}

export async function GET(request: NextRequest) {
    await dbConnection()
    // to find the currently login user 
    const session = await getServerSession(authOptions)
    console.log('session:',session);
    // from session we can find user because we inject it.
    const user:User = session?.user as User // we need to assert the user
    console.log("user:", user)

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "not authenticated"
        },{status: 400})
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
                return NextResponse.json({
                success: false,
                message: "failed to find the user "
            },{status: 404})
        }
        return NextResponse.json({
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
        },{status: 200})
    } catch (error) {
        console.log('failed to update user status to accept messages');
        return NextResponse.json({
            success: false,
            message: "error in getting is accepting message status"
        },{
            status: 500
        })
        
    }

    
}