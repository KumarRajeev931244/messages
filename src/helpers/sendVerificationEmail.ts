import { resend } from "@/lib/resend";
import VerificationEmailTemplates from "../../emailsTemplates/VerificationEmailTemplates";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    emails: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse>{
    try {
         await resend.emails.send({
            from: 'onboarding@resend.dev',
            to:  emails,
            subject: 'Mystry message Verification code',
            react: VerificationEmailTemplates({username,otp:verifyCode}),
        });

         return {success: true, message: "Send verification email successfully"}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success: false, message: "failed to send verification email"}
        
    }
    
}
