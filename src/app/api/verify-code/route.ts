import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnection()
    try {
        const {username, code} = await request.json()
        console.log("username:", username);
        
        const decodedUsername = decodeURIComponent(username)
        console.log("decodedUsername:",decodedUsername);
        
        
        const user = await UserModel.findOne({username: decodedUsername})
        console.log("user:",user);
        
        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "user not found"          
                },
                {status: 400}
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return NextResponse.json({
                success: true,
                message: "user verified successfully"
            },{status: 200})
        }else if(!isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "verification code is expired"
            },{status: 400})
        }else{
            return NextResponse.json({
                success:false,
                message: "verification code is incorrect"
            },{
                status: 400
            })
        }

    } catch (error) {
        console.log("error while verifying code:", error)
        return NextResponse.json(
            {
                success: false,
                message: "failed to verify user"
            },{
                status:500
            }
        )
        
    }
}