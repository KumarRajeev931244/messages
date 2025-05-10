import z from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'
import { dbConnection } from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'
import UserModel from '@/models/User'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:NextRequest){
    await dbConnection()
    try {
        const {searchParams} = new URL(request.url)
        console.log("search Params:", searchParams);
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("result:",result.error)
        
        if(!result.success){
           const usernameErrors =  result.error.format().username?._errors || []
           return NextResponse.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "invalid query parameter"
           },{status: 400})
        }
        const {username} = result.data
        const existingUser = await UserModel.findOne({username, isVerified: true})
        if(existingUser){
            return NextResponse.json({
                success: false,
                message: "username is already taken"
            },{status: 400})
        } 
        return NextResponse.json({
            success: true,
            message: "username is unique"
        },{status: 200})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error while checking username"
        },{status: 500})
        
    }
}