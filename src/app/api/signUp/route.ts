import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await dbConnection()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success: false,
                message: "username is already exist"
            },{status: 400}
        )
        }
        const existingUserByEmail = await UserModel.findOne({email})
        console.log("existingUserByEmail:",existingUserByEmail);
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                success: false,
                message: "username already exist with this email"
            },{status: 400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date;
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
                
            })
            await newUser.save()
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email, 
            username, 
            verifyCode
        )
        console.log(emailResponse)
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:  emailResponse.message
            },{status:500}
        )
        }
        return NextResponse.json({
            success: true,
            message: "user register successfully. Please verify your otp"
        },{status: 200})
        
    } catch (error) {
        console.error("failed to register the user")
        return NextResponse.json(
            {
                success: false,
                message: "failed to register the user"
            },
            {
                status: 500
            }
        )
        
    }
}